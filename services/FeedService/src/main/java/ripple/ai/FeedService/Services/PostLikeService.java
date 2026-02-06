package ripple.ai.FeedService.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ripple.ai.FeedService.Entity.FeedPost;
import ripple.ai.FeedService.Entity.PostLike;
import ripple.ai.FeedService.Repository.PostLikeRepository;
import ripple.ai.FeedService.Repository.PostRepository;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostLikeService {

    private final PostLikeRepository likeRepository;
    private final PostRepository postRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void likePost(String postId, String userId) {
        try {
            // Check if user already liked
            if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
                log.info("User {} already liked post {}", userId, postId);
                return;
            }

            //Save like in DB
            PostLike like = PostLike.builder()
                    .postId(postId)
                    .userId(userId)
                    .likedAt(LocalDateTime.now())
                    .build();
            likeRepository.save(like);
            log.info("Saved like for post {} by user {}", postId, userId);

            // 3️⃣ Fetch post owner email
            FeedPost post = postRepository.findByPostId(postId);
            if (post == null) {
                log.warn("Post {} not found for like event", postId);
                return;
            }
            String ownerId = post.getOwnerId(); 

            // 4️⃣ Prepare Kafka event
            Map<String, Object> event = new HashMap<>();
            event.put("event", "POST_LIKED");
            event.put("postId", postId);
            event.put("userId", userId);       // user who liked
            event.put("ownerId", ownerId); // post owner
            event.put("timestamp", LocalDateTime.now().toString());

            String jsonEvent = objectMapper.writeValueAsString(event);

            //Publish to Kafka
            kafkaTemplate.send("post-engagement-events", jsonEvent);
            log.info("Published POST_LIKED event to Kafka for post {}", postId);

        } catch (Exception e) {
            log.error("Error in likePost for postId {} by userId {}", postId, userId, e);
        }
    }

    public long getLikesCount(String postId) {
             return likeRepository.countByPostId(postId);
      }
}
