package ai.ripple.Notifications.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ai.ripple.Notifications.service.EmailService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PostConsumer {

    private final ObjectMapper objectMapper;
 private final EmailService emailService;

    // Track post count per owner + campaign
    private final ConcurrentHashMap<String, AtomicInteger> postCountMap = new ConcurrentHashMap<>();

    // logic for getting subscribed users to particular NGO (REST CALL TO User service)
    private final List<String> allUserEmails = List.of(
            "shivdu2000@gmail.com",
            "shakyashivam236@gmail.com",
            "shakyashiv1212@gmail.com"
    );

    // Inject EmailService via constructor
    public PostConsumer(EmailService emailService) {
        this.emailService = emailService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

   
    @KafkaListener(topics = "post-event", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(ConsumerRecord<String, String> record) {
        String jsonMessage = record.value();

        log.info("Kafka message received");
        log.info("Post JSON: {}", jsonMessage);

        try {
            // Optional: extract key fields using simple string operations or JsonNode
            String ownerId = extractField(jsonMessage, "ownerId");
            String campaignId = extractField(jsonMessage, "campaignId");
            String caption = extractField(jsonMessage, "caption");
            String postLink = extractField(jsonMessage, "postLink");

            String key = ownerId + ":" + campaignId;
            int currentCount = postCountMap
                    .computeIfAbsent(key, k -> new AtomicInteger(0))
                    .incrementAndGet();

            String emailBody = String.format(
                    "NGO '%s' has uploaded %d post(s) in campaign '%s'.\n\nLatest post caption: %s\nCheck it out: %s",
                    ownerId,
                    currentCount,
                    campaignId,
                    caption,
                    postLink
            );

            // Send emails
            for (String email : allUserEmails) {
                emailService.sendNotification(email, "New Campaign Post Notification", emailBody)
                        .doOnSuccess(v -> log.info("Email sent to {}", email))
                        .doOnError(err -> log.error("Failed to send email to {}", email, err))
                        .subscribe();
            }

            log.info("Notification flow completed for ownerId={}, campaignId={}", ownerId, campaignId);

        } catch (Exception e) {
            log.error("Error while processing Kafka message", e);
        }
    }


    private String extractField(String json, String fieldName) {
        try {
            int idx = json.indexOf("\"" + fieldName + "\":");
            if (idx == -1) return "";
            int start = json.indexOf(":", idx) + 1;
            int end;
            if (json.charAt(start) == '"') { // string value
                start++;
                end = json.indexOf("\"", start);
            } else { // numeric/array/boolean
                end = json.indexOf(",", start);
                if (end == -1) end = json.indexOf("}", start);
            }
            return json.substring(start, end).trim();
        } catch (Exception e) {
            return "";
        }
    }
}
