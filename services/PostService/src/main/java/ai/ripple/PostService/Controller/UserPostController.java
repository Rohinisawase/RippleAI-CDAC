package ai.ripple.PostService.Controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ai.ripple.PostService.Dto.Post.CreatePostItem;
import ai.ripple.PostService.Dto.Post.CreatePostRequest;
import ai.ripple.PostService.Dto.Post.PostDeleteEvent;
import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Entity.PostStatus;
import ai.ripple.PostService.Entity.PostType;
import ai.ripple.PostService.Interfaces.AIClient;
import ai.ripple.PostService.Kafka.PostProducer;
import ai.ripple.PostService.Service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/user/posts")
public class UserPostController {

    @Autowired
    private PostService postService;

   
    @Autowired
    private PostProducer postEventProducer;

    @Autowired
    private AIClient aiClient;


    @Value("${local.upload-dir}")
    private String uploadFolder;

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestBody String base64, HttpServletRequest request) {
        try {
            // Remove "data:image/...;base64," prefix if present
            if (base64.contains(",")) {
                base64 = base64.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64);

            // Generate unique filename
            String fileName = UUID.randomUUID() + ".png";

            // Path to static/uploads folder
            Path staticFolder = Paths.get(new ClassPathResource("static/uploads").getURI());
            if (!Files.exists(staticFolder)) {
                Files.createDirectories(staticFolder);
            }

            // Save the image file
            Path filePath = staticFolder.resolve(fileName);
            Files.write(filePath, imageBytes);

            // Construct full URL accessible from browser
            String baseUrl = String.format("%s://%s:%d",
                    request.getScheme(),
                    request.getServerName(),
                    request.getServerPort());
            String fileUrl = baseUrl + "/uploads/" + fileName;

            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }


    // ----------------- CREATE POST -----------------
    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest request) {

        // Normal users can only create NORMAL posts
        if (request.getOwnerType() == OwnerType.USER) {
            request.setPostType(PostType.NORMAL);
            request.setCampaignId(null); 
        }

        //changes for post creation
        List<Post> posts = mapToPosts(request);
        for(Post post : posts){

            //ranking feature
            double rank = aiClient.rankPost(post);

            //kafka porducer
            postEventProducer.publish("post-event", post, rank);
        }

        //save to db
        postService.savePosts(request);
       return ResponseEntity.ok(Map.of("message", "Post(s) created successfully"));
    }

    // ----------------- READ POSTS -----------------
    @GetMapping
    public ResponseEntity<List<Post>> getMyPosts(
            @RequestParam String ownerId,
            @RequestParam OwnerType ownerType
    ) {
        List<Post> posts = postService.getPostsByOwner(ownerId, ownerType);
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }

    // ----------------- UPDATE POST -----------------
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @Valid @RequestBody CreatePostItem updateRequest,
            @RequestParam String ownerId,
            @RequestParam OwnerType ownerType
    ) {
        Post post = postService.getPostById(postId);

        if (post == null) return ResponseEntity.notFound().build();

        // Only owner can update their post
        if (!post.getOwnerId().equals(ownerId) || post.getOwnerType() != ownerType) {
            return ResponseEntity.status(403).body("Not allowed to update this post");
        }

        // Normal users can only update NORMAL posts
        if (ownerType == OwnerType.USER && post.getPostType() != PostType.NORMAL) {
            return ResponseEntity.status(403).body("Users cannot update campaign posts");
        }

        // Update allowed fields
        post.setCaption(updateRequest.getCaption());
        post.setPostLink(updateRequest.getPostLink());
        post.setMusicLink(updateRequest.getMusicLink());
        post.setTags(updateRequest.getTags());
        post.setScheduledAt(updateRequest.getScheduledAt());

        postService.savePost(post);
        return ResponseEntity.ok("Post updated successfully");
    }

    // ----------------- DELETE POST -----------------
   @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable String postId,
            @RequestParam String ownerId,
            @RequestParam OwnerType ownerType
    ) {
        Post post = postService.getPostByPostId(postId);
        if (post == null) return ResponseEntity.notFound().build();

        if (!post.getOwnerId().equals(ownerId) || post.getOwnerType() != ownerType) {
            return ResponseEntity.status(403).body("Not allowed to delete this post");
        }

        if (ownerType == OwnerType.USER && post.getPostType() != PostType.NORMAL) {
            return ResponseEntity.status(403).body("Users cannot delete campaign posts");
        }


        log.info("post", postId);
        boolean postStatus = postService.deletePost(postId);

        if(postStatus){

            postEventProducer.sendDeleteEvent(
                "post-event",
                new PostDeleteEvent(
                    "POST_DELETED",
                    post.getPostId(),
                    ownerId,
                    ownerType
                )
            );

           return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        }else{
             return ResponseEntity.ok(Map.of("message", "Post does not delete"));
        }
    }



    public List<Post> mapToPosts(CreatePostRequest request) {

        LocalDateTime now = LocalDateTime.now();

        return request.getPosts().stream()
            .map(item -> {

                Post post = new Post();

                post.setId(null); // Mongo will generate
                post.setPostId(UUID.randomUUID().toString());

                post.setOwnerType(request.getOwnerType());
                post.setOwnerId(request.getOwnerId());

                post.setPostType(request.getPostType());
                post.setCampaignId(request.getCampaignId());

                post.setCaption(item.getCaption());
                post.setPostLink(item.getPostLink());
                post.setMusicLink(item.getMusicLink());
                post.setScheduledAt(item.getScheduledAt());

                post.setCreatedAt(now);
                post.setStatus(
                    item.getScheduledAt() != null
                        ? PostStatus.SCHEDULED
                        : PostStatus.PUBLISHED
                );

                post.setTags(item.getTags());

                return post;
            })
            .toList();
    }

}
