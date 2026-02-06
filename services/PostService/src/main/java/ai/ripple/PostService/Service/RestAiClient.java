package ai.ripple.PostService.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import ai.ripple.PostService.Dto.AI.GenerateRequest;
import ai.ripple.PostService.Dto.AI.GenerateResponse;
import ai.ripple.PostService.Dto.AI.PostAnalysisRequest;
import ai.ripple.PostService.Dto.AI.PostAnalysisResponse;
import ai.ripple.PostService.Dto.Post.PostResponse;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Interfaces.AIClient;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RestAiClient implements AIClient {

    private final RestTemplate restTemplate;

    private final String aiBaseUrl;

    public RestAiClient(RestTemplate restTemplate,
                        @Value("${ai.service.url}") String aiBaseUrl) {
        this.restTemplate = restTemplate;
        this.aiBaseUrl = aiBaseUrl;
    }

    @Override
    public List<PostResponse> generatePosts(String prompt) {

        GenerateRequest request = new GenerateRequest();
        request.setPrompt(prompt);

        GenerateResponse response = restTemplate.postForObject(
                aiBaseUrl + "/ai/generate-posts",
                request,
                GenerateResponse.class
        );

        log.info("postsss",response.getPosts());
        return response != null ? response.getPosts() : List.of();
    }

    @Override
    public double rankPost(Post post) {
        // For testing / dummy mode: generate a rank between 0 and 10
        double minRank = 1.0;
        double maxRank = 10.0;

        double dummyRank = minRank + Math.random() * (maxRank - minRank);

        log.info("Dummy rank generated for post {}: {}", post.getPostId(), dummyRank);

        return dummyRank;
    }


    /* 
    @Override
    public double rankPost(Post post) {

        PostAnalysisRequest request = new PostAnalysisRequest();
        request.setCaption(post.getCaption());
        request.setMusicLink(post.getMusicLink());
        request.setPostLink(post.getPostLink());

        try {
            PostAnalysisResponse response =
                    restTemplate.postForObject(
                            aiBaseUrl + "/ai/analyze-post",
                            request,
                            PostAnalysisResponse.class
                    );

            if (response == null) {
                log.warn("AI analysis returned null response");
                return 0.0;
            }

            return response.getRank();

        } catch (Exception e) {
            log.error("Error while calling AI analyze-post service", e);
            return 0.0; // fail-safe default
        }
    }

    */

    @Override
    public String chatWithData(String question) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'chatWithData'");
    }

   
}