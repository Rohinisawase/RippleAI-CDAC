package ripple.ai.FeedService.Kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import ripple.ai.FeedService.Entity.FeedPost;
import ripple.ai.FeedService.Entity.OwnerType;
import ripple.ai.FeedService.Entity.PostStatus;
import ripple.ai.FeedService.Entity.PostType;
import ripple.ai.FeedService.Repository.PostCommentRepository;
import ripple.ai.FeedService.Repository.PostLikeRepository;
import ripple.ai.FeedService.Repository.PostRepository;
import ripple.ai.FeedService.Services.SseService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PostConsumer {

    private final PostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final PostCommentRepository commentRepository;
    private final ObjectMapper objectMapper;
    private final SseService sseService;
    private final ReactiveRedisTemplate<String, String> redisTemplate;


    public PostConsumer(PostRepository postRepository, PostLikeRepository likeRepository , PostCommentRepository commentRepository, SseService sseService, ReactiveRedisTemplate<String, String> redisTemplate) {
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
         this.sseService = sseService;
         this.redisTemplate = redisTemplate;
    }

    @KafkaListener(topics = "post-event", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(ConsumerRecord<String, String> record) {
        String jsonMessage = record.value();
        log.info("---------- Kafka message received ----------");
        log.info("Raw JSON: {}", jsonMessage);

        try {
          JsonNode rootNode = objectMapper.readTree(jsonMessage);

            // Unwrap outer string if needed
            if (rootNode.isTextual()) {
                log.info("Unwrapping outer JSON string");
                rootNode = objectMapper.readTree(rootNode.asText());
            }

            if (rootNode.has("eventType") 
                    && "DELETE".equals(rootNode.get("eventType").asText())) {

                String postId = rootNode.get("postId").asText();

                postRepository.deleteByPostId(postId);
                likeRepository.deleteByPostId(postId);
                commentRepository.deleteByPostId(postId);

                // optional: notify clients
                sseService.sendDelete(postId);

                // optional: cleanup redis
                redisTemplate.delete("post_contentScore:" + postId).subscribe();

                return; 
            }



            // Get the actual post node
            JsonNode postNode = rootNode.has("post") ? rootNode.get("post") : rootNode;

            // Then extract fields from postNode
            String postId = getText(postNode, "postId");
            OwnerType ownerType = getEnum(postNode, "ownerType", OwnerType.class);
            PostType postType = getEnum(postNode, "postType", PostType.class);
            String ownerId = getText(postNode, "ownerId");
            String campaignId = getText(postNode, "campaignId");
            String caption = getText(postNode, "caption");
            String postLink = getText(postNode, "postLink");
            String musicLink = getText(postNode, "musicLink");
            PostStatus status = getEnum(postNode, "status", PostStatus.class);
            LocalDateTime scheduledAt = getLocalDateTime(postNode, "scheduledAt");
            LocalDateTime createdAt = getLocalDateTime(postNode, "createdAt");
            if (createdAt == null) createdAt = LocalDateTime.now();

            // Tags
            List<String> tags = new ArrayList<>();
            if (postNode.has("tags") && postNode.get("tags").isArray()) {
                for (JsonNode t : postNode.get("tags")) if (!t.isNull()) tags.add(t.asText());
            }

            // contentScore from root
            double contentScore = rootNode.has("contentScore") ? rootNode.get("contentScore").asDouble() : 0.0;



            if (createdAt == null) createdAt = LocalDateTime.now();


            log.info("Extracted Post fields -> postId: {}, ownerType: {}, ownerId: {}, postType: {}, campaignId: {}, status: {}",
                    postId, ownerType, ownerId, postType, campaignId, status);
            log.info("Caption length: {}, PostLink: {}, MusicLink: {}, Tags: {}",
                    caption != null ? caption.length() : 0, postLink, musicLink, tags);
            log.info("ScheduledAt: {}, CreatedAt: {}", scheduledAt, createdAt);

            // Map to FeedPost and save
            FeedPost feedPost = FeedPost.builder()
                    .postId(postId)
                    .ownerType(ownerType)
                    .ownerId(ownerId)
                    .postType(postType)
                    .campaignId(campaignId)
                    .caption(caption)
                    .postLink(postLink)
                    .musicLink(musicLink)
                    .scheduledAt(scheduledAt)
                    .createdAt(createdAt)
                    .status(status)
                    .tags(tags)
                    .build();

            FeedPost savedPost = postRepository.save(feedPost);

            sseService.sendPost(feedPost);      // push to clients

           String contentScoreKey = "post_contentScore:" + postId;
           redisTemplate.opsForValue()
                        .set(contentScoreKey, String.valueOf(contentScore))
                        .subscribe(); 

            log.info("Saved post to feed. postId: {}, Mongo ID: {}", savedPost.getPostId(), savedPost.getId());
            log.info("-------------------------------------------");

        } catch (Exception e) {
            log.error("Failed to process Kafka message", e);
        }
    }

    // ---------------- Helper methods ----------------

    private String getText(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? node.get(fieldName).asText() : null;
    }

    private <T extends Enum<T>> T getEnum(JsonNode node, String fieldName, Class<T> clazz) {
        try {
            String value = getText(node, fieldName);
            return value != null ? Enum.valueOf(clazz, value) : null;
        } catch (IllegalArgumentException e) {
            log.warn("Invalid enum value for {}: {}", fieldName, node.get(fieldName));
            return null;
        }
    }

    private LocalDateTime getLocalDateTime(JsonNode node, String fieldName) {
        if (node.has(fieldName) && node.get(fieldName).isArray()) {
            JsonNode arr = node.get(fieldName);
            if (arr.size() >= 5) {
                int year = arr.get(0).asInt();
                int month = arr.get(1).asInt();
                int day = arr.get(2).asInt();
                int hour = arr.get(3).asInt();
                int minute = arr.get(4).asInt();
                int second = arr.size() > 5 ? arr.get(5).asInt() : 0;
                int nano = arr.size() > 6 ? arr.get(6).asInt() : 0;
                return LocalDateTime.of(year, month, day, hour, minute, second, nano);
            }
        }
        return null;
    }
}

