package ai.ripple.PostService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ai.ripple.PostService.Dto.AI.GenerateRequest;
import ai.ripple.PostService.Dto.Post.PostResponse;
import ai.ripple.PostService.Service.PostGenerationService;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/ngo/posts")
public class PostGenerationController {

    @Autowired
    private PostGenerationService postGenerationService;

    @PostMapping("/generate")
    public ResponseEntity<List<PostResponse>> generatePosts(
            @RequestBody GenerateRequest request) {

        log.info("Generate posts request received: {}", request);

        //generate posts
        List<PostResponse> posts =
                postGenerationService.generate(request);


        log.info("posts",posts);

        return ResponseEntity.ok(posts);
    }
}
