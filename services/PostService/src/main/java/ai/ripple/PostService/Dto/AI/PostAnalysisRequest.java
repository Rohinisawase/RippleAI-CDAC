package ai.ripple.PostService.Dto.AI;

import lombok.Data;

@Data
public class PostAnalysisRequest {
    private String caption;
    private String postLink;
    private String musicLink;
}
