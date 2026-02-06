package ai.ripple.PostService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Entity.PostStatus;
import ai.ripple.PostService.Interfaces.AIClient;
import ai.ripple.PostService.Kafka.PostProducer;
import ai.ripple.PostService.Service.PostService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/ngo/posts")
@Slf4j
public class NGOPostController {

    @Autowired
    private PostService postService;

    @Autowired
    private PostProducer postEventProducer;

    @Autowired
    private AIClient aiClient;

    // ---------------- READ APIs ----------------

    @GetMapping
    public ResponseEntity<List<Post>> getPostsByOwner(
            @RequestParam String ownerId,
            @RequestParam OwnerType ownerType
    ) {
        log.info("Fetching posts for ownerId={}, ownerType={}", ownerId, ownerType);

        List<Post> posts = postService.getPostsByOwner(ownerId, ownerType);

        log.info("Found {} posts for ownerId={}", posts.size(), ownerId);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Post>> getCampaignPosts(
            @PathVariable String campaignId
    ) {
        log.info("Fetching campaign posts for campaignId={}", campaignId);

        List<Post> posts = postService.getCampaignPosts(campaignId);

        log.info("Found {} posts for campaignId={}", posts.size(), campaignId);

        return ResponseEntity.ok(posts);
    }

    // ---------------- STATE TRANSITIONS ----------------

    // Approve post (USER / MODERATOR action)
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(@PathVariable String id) {

        log.info("Approve request received for postId={}", id);

        Post post = postService.getPostById(id);
        if (post == null) {
            log.warn("Approve failed: post not found, postId={}", id);
            return ResponseEntity.notFound().build();
        }

        if (post.getStatus() != PostStatus.DRAFT &&
            post.getStatus() != PostStatus.SCHEDULED) {

            log.warn("Approve rejected due to invalid state. postId={}, status={}",
                    id, post.getStatus());

            return ResponseEntity.badRequest()
                    .body("Post cannot be approved in current state");
        }

        post.setStatus(PostStatus.SCHEDULED);
        postService.savePost(post);

        log.info("Post approved successfully. postId={}", id);

        return ResponseEntity.ok("Post approved");
    }

    // Reject post
    @DeleteMapping("/{id}/reject")
    public ResponseEntity<?> rejectPost(@PathVariable String id) {

        log.info("Reject request received for postId={}", id);

        boolean deleted = postService.deletePost(id);

        if (!deleted) {
            log.warn("Reject failed: post not found, postId={}", id);
            return ResponseEntity.notFound().build();
        }

        log.info("Post rejected and deleted. postId={}", id);

        return ResponseEntity.ok("Post rejected and deleted");
    }

    // ---------------- CAMPAIGN SUBMISSION ----------------

    @PostMapping("/submit")
    public ResponseEntity<?> submitCampaignPosts(
            @RequestParam String ngoId,
            @RequestParam String campaignId
    ) {
        log.info("Submit request received. ngoId={}, campaignId={}", ngoId, campaignId);

        // Fetch all APPROVED posts for NGO + campaign
        List<Post> posts = postService.getApprovedPostsByNgoAndCampaign(ngoId, campaignId);

        if (posts.isEmpty()) {
            log.warn("No approved posts found for submission. ngoId={}, campaignId={}", ngoId, campaignId);
            return ResponseEntity.badRequest().body("No approved posts found for this campaign");
        }

        int publishedCount = 0;

        for (Post post : posts) {
            post.setStatus(PostStatus.PUBLISHED);
            postService.savePost(post);

            try {
                
                //ranking feature
            double rank = aiClient.rankPost(post);

            //kafka porducer
            postEventProducer.publish("post-event", post, rank);
                log.info("Post published and sent to Kafka. postId={}", post.getId());
                publishedCount++;
            } catch (Exception e) {
                log.error("Kafka publish failed for postId={}", post.getId(), e);
                // Return error immediately
                return ResponseEntity.status(500)
                        .body("Failed to publish postId=" + post.getId() + " to Kafka");
            }

            publishedCount++;
        }

        log.info("Campaign submission completed. ngoId={}, campaignId={}, publishedCount={}",
                ngoId, campaignId, publishedCount);

        return ResponseEntity.ok("Published and submitted " + publishedCount + " posts");
    }
}
