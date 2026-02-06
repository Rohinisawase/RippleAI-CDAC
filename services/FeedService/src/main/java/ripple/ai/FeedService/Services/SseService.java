package ripple.ai.FeedService.Services;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import ripple.ai.FeedService.Entity.FeedPost;

@Service
public class SseService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        return emitter;
    }

    public void sendPost(FeedPost post) {
        emitters.forEach(emitter -> {
            try {
                emitter.send(post, MediaType.APPLICATION_JSON);
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        });
    }

    public void sendDelete(String postId) {
        Map<String, Object> payload = Map.of(
            "eventType", "DELETE",
            "postId", postId
        );

        emitters.forEach(emitter -> {
            try {
                emitter.send(payload, MediaType.APPLICATION_JSON);
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        });
    }
}
