package ai.ripple.PostService.Dto.AI;

import java.util.List;
import lombok.Data;

@Data
public class PostAnalysisResponse {
    private String positivity;
    private int rank;
    private List<String> reasons;
}
