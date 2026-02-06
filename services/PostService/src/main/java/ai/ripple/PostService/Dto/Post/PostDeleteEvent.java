package ai.ripple.PostService.Dto.Post;

import ai.ripple.PostService.Entity.OwnerType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDeleteEvent {
    private String eventType;
    private String postId;
    private String ownerId;
    private OwnerType ownerType;
}
