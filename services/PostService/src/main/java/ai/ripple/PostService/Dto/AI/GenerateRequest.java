package ai.ripple.PostService.Dto.AI;

import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.PostType;
import lombok.Data;

@Data
public class GenerateRequest {
    private String prompt;
    OwnerType ownerType;
    String ownerId;
    PostType postType;
    String campaignId;
}

