package ai.ripple.PostService.Kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ai.ripple.PostService.Dto.AI.PostFeedEvent;
import ai.ripple.PostService.Dto.Post.PostDeleteEvent;
import ai.ripple.PostService.Entity.Post;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PostProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public PostProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
        // Register JavaTimeModule to handle LocalDateTime
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    //storing rank of posts (optimizing)
    public void publish(String topic, Post post, double contentScore) {
        try {


            //added content score from here only
            PostFeedEvent event = new PostFeedEvent(post, contentScore);
            String jsonMessage = objectMapper.writeValueAsString(event);

           // String jsonMessage = objectMapper.writeValueAsString(post);

            // Send JSON string to Kafka
            kafkaTemplate.send(topic, jsonMessage);

            log.info("Sent message to Kafka topic {}: {}", topic, jsonMessage);
        } catch (Exception e) {
            log.error("Failed to send message to Kafka topic {}: {}", topic, post, e);
            throw new RuntimeException(e);
        }
    }

    public void sendDeleteEvent(String topic, PostDeleteEvent event) {
        kafkaTemplate.send(topic, event);
    }
}
