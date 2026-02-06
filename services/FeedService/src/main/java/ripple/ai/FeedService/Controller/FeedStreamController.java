package ripple.ai.FeedService.Controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import ripple.ai.FeedService.Services.SseService;


@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
public class FeedStreamController {

    private final SseService sseService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamFeed() {
        return sseService.createEmitter();
    }
}