package ai.ripple.PostService.Kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PostConsumer {

    private final ObjectMapper objectMapper;

    public PostConsumer() {
        this.objectMapper = new ObjectMapper();
        // Register module to handle LocalDateTime in Post
        this.objectMapper.registerModule(new JavaTimeModule());
    }

   @KafkaListener(topics = "post-event", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(ConsumerRecord<String, String> record) {
        String jsonMessage = record.value();
        log.info("Received Post JSON from Kafka: {}", jsonMessage);
    }
}
