package ai.ripple.PostService.Dto.AI;

import ai.ripple.PostService.Entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostFeedEvent {

    private Post post;
    private double contentScore; 
}
