package ai.ripple.PostService.Controller;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Entity.PostType;
import ai.ripple.PostService.Service.PostService;

import java.util.Map;

@RestController
@RequestMapping("/ngo/posts/campaigns")
public class CampaignController {

    @Autowired
    private PostService postService;

    // ---------------- GET CAMPAIGNS WITH POSTS FOR AN NGO ----------------
    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<?> getCampaignsWithPostsByNgo(@PathVariable String ngoId) {
        List<Post> posts = postService.getPostsByOwner(ngoId, OwnerType.NGO);

        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Group posts by campaignId
        Map<String, List<Post>> campaigns = posts.stream()
                .filter(post -> post.getPostType() == PostType.CAMPAIGN) // only campaigns
                .collect(Collectors.groupingBy(Post::getCampaignId));

        return ResponseEntity.ok(campaigns);
    }

    // ---------------- DELETE A SINGLE POST ----------------
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        boolean deleted = postService.deletePost(postId);

        if (deleted) {
            return ResponseEntity.ok("Post deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------- DELETE AN ENTIRE CAMPAIGN ----------------
    @DeleteMapping("/{campaignId}")
    public ResponseEntity<?> deleteCampaign(@PathVariable String campaignId) {
        boolean deleted = postService.deletePostsByCampaign(campaignId);

        if (deleted) {
            return ResponseEntity.ok("Campaign deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
