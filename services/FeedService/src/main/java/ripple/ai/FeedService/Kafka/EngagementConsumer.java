package ripple.ai.FeedService.Kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ripple.ai.FeedService.Entity.FeedPost;
import ripple.ai.FeedService.Repository.PostRepository;
import ripple.ai.FeedService.Services.RankingService;

@Service
@Slf4j
@RequiredArgsConstructor
public class EngagementConsumer {

    private final ReactiveRedisTemplate<String, String> redisTemplate;
    private final PostRepository postRepository;
    private final RankingService rankingService;

    @KafkaListener(topics = "post-engagement-events", groupId = "feed-service")
    public void consume(String message) {
        try {
            log.info("Received Kafka message: {}", message);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(message);

            // Unwrap if message is stringified JSON
            if (node.isTextual()) {
                node = mapper.readTree(node.asText());
            }

            String eventType = node.get("event").asText();

            // Only handle likes and comments
            if (!"POST_LIKED".equals(eventType) && !"POST_COMMENTED".equals(eventType)) {
                return;
            }

            String postId = node.get("postId").asText();
            if (postId == null) return;

            // Redis keys
            String likesKey = "post_likes:" + postId;
            String commentsKey = "post_comments:" + postId;
            String contentScoreKey = "post_contentScore:" + postId;
            String rankKey = "post_rank:" + postId;

            // Fetch post from DB
            FeedPost post = postRepository.findByPostId(postId);
            if (post == null) {
                log.warn("Post not found for postId: {}", postId);
                return;
            }

            // Prepare reactive counters
            Mono<Long> likesMono = "POST_LIKED".equals(eventType)
                    ? redisTemplate.opsForValue().increment(likesKey)
                    : redisTemplate.opsForValue().get(likesKey).map(Long::valueOf).defaultIfEmpty(0L);

            Mono<Long> commentsMono = "POST_COMMENTED".equals(eventType)
                    ? redisTemplate.opsForValue().increment(commentsKey)
                    : redisTemplate.opsForValue().get(commentsKey).map(Long::valueOf).defaultIfEmpty(0L);

            Mono<Double> contentScoreMono = redisTemplate.opsForValue()
                    .get(contentScoreKey)
                    .map(Double::valueOf)
                    .defaultIfEmpty(5.0);

            // Combine Monos and calculate rank
            Mono.zip(likesMono, commentsMono, contentScoreMono)
                    .flatMap(tuple -> {
                        Long likes = tuple.getT1();
                        Long comments = tuple.getT2();
                        Double contentScore = tuple.getT3();

                        double postRank = rankingService.calculatePostRank(
                                contentScore,
                                likes.intValue(),
                                comments.intValue(),
                                post.getCreatedAt()
                        );

                        return redisTemplate.opsForValue()
                                .set(rankKey, String.valueOf(postRank));
                    })
                    .doOnError(e -> log.error("Failed to update post rank for postId {}", postId, e))
                    .subscribe(); // subscribe to trigger reactive chain

        } catch (Exception e) {
            log.error("Error processing Kafka message: {}", message, e);
        }
    }
}
