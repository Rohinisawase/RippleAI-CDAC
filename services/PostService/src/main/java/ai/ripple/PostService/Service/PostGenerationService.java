package ai.ripple.PostService.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ai.ripple.PostService.Dto.AI.GenerateRequest;
import ai.ripple.PostService.Dto.Post.PostResponse;
import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Entity.PostStatus;
import ai.ripple.PostService.Entity.PostType;
import ai.ripple.PostService.Interfaces.AIClient;
import ai.ripple.PostService.Repository.PostRepository;
import ai.ripple.PostService.util.FallbackPosts;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PostGenerationService {
    
    @Autowired
    private AIClient aiClient;

    @Autowired
    private PostRepository postRepository;

    public void savePosts(
            List<PostResponse> responses,
            OwnerType ownerType,
            String ownerId,
            PostType postType,
            String campaignId
    ) {

        List<Post> posts = responses.stream()
                .map(response -> {
                    Post post = new Post();

                    post.setPostId(UUID.randomUUID().toString());
                    post.setOwnerType(ownerType);
                    post.setOwnerId(ownerId);
                    post.setPostType(postType);

                    post.setCaption(response.getCaption());
                    post.setPostLink(response.getPostLink());
                    post.setMusicLink(response.getMusicLink());

                    if (postType == PostType.CAMPAIGN) {
                        post.setCampaignId(campaignId);
                    }

                      log.info("working till here");


                    post.setScheduledAt(
                        OffsetDateTime
                            .parse(response.getScheduleTime())
                            .atZoneSameInstant(ZoneOffset.UTC)
                            .toLocalDateTime()
                    );

                       log.info("working till here 2");


                    post.setCreatedAt(LocalDateTime.now());
                    post.setStatus(PostStatus.DRAFT); // or DRAFT / ACTIVE
                    post.setTags(response.getTags());

                    return post;
                })
                .toList();

        postRepository.saveAll(posts);
    }


    public List<PostResponse> generate(GenerateRequest request) {
        List<PostResponse> posts = aiClient.generatePosts(request.getPrompt());
       log.info("posts: {}", posts);


        //checking if null then fallback
        if (posts == null || posts.isEmpty()) {
            posts = FallbackPosts.DEFAULT_POSTS;
        } 

        //saving to db
        savePosts(posts, 
                  request.getOwnerType(), 
                  request.getOwnerId(), 
                  request.getPostType(), 
                  request.getCampaignId());
        return posts;
    }
}
