package ripple.ai.FeedService.Services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ripple.ai.FeedService.Entity.FeedPost;
import ripple.ai.FeedService.Entity.PostComment;
import ripple.ai.FeedService.Repository.PostCommentRepository;
import ripple.ai.FeedService.Repository.PostRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostCommentService {

    private final PostCommentRepository commentRepository;
    private final PostRepository postRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void commentOnPost(String postId, String userId, String content) {
        try {
            PostComment comment = PostComment.builder()
                    .postId(postId)
                    .userId(userId)
                    .content(content)
                    .createdAt(LocalDateTime.now())
                    .build();

            commentRepository.save(comment);
            log.info("Saved comment for post {} by user {}", postId, userId);

            FeedPost post = postRepository.findByPostId(postId);
            if (post == null) {
                log.warn("Post {} not found for comment event", postId);
                return;
            }

            String ownerId = post.getOwnerId();

            Map<String, Object> event = new HashMap<>();
            event.put("event", "POST_COMMENTED");
            event.put("postId", postId);
            event.put("userId", userId);    // commenter
            event.put("ownerId", ownerId);  // post owner
            event.put("timestamp", LocalDateTime.now().toString());

            String jsonEvent = objectMapper.writeValueAsString(event);

            kafkaTemplate.send("post-engagement-events", jsonEvent);
            log.info("Published POST_COMMENTED event to Kafka for post {}", postId);

        } catch (Exception e) {
            log.error("Error in commentOnPost for postId {} by userId {}", postId, userId, e);
        }
    }


        public List<Map<String, Object>> getComments(String postId) {
            return commentRepository.findByPostId(postId)
                    .stream()
                    .map(c -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("user", c.getUserId());
                        m.put("text", c.getContent());
                        m.put("createdAt", c.getCreatedAt());
                        return m;
                    })
                    .collect(Collectors.toList());
        }

}
