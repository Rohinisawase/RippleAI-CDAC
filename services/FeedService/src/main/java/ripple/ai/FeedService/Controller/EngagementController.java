package ripple.ai.FeedService.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ripple.ai.FeedService.Services.PostCommentService;
import ripple.ai.FeedService.Services.PostLikeService;

@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
@Slf4j
public class EngagementController {

    private final PostLikeService likeService;
    private final PostCommentService commentService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestParam String userId
    ) {
        likeService.likePost(postId, userId);
        return ResponseEntity.ok(Map.of("status", "liked"));
    }


    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> commentOnPost(
            @PathVariable String postId,
            @RequestBody Map<String, String> body
    ) {
        commentService.commentOnPost(
                postId,
                body.get("userId"),
                body.get("content")
        );
        return ResponseEntity.ok(Map.of("status", "commented"));
    }

    @GetMapping("/{postId}/engagement")
    public ResponseEntity<?> getEngagement(@PathVariable String postId) {
            long likes = likeService.getLikesCount(postId);       // fetch total likes
            List<Map<String, Object>> comments = commentService.getComments(postId); // fetch comments

            return ResponseEntity.ok(Map.of(
                    "likes", likes,
                    "comments", comments
            ));
    }


}
