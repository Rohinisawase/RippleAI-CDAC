package ai.ripple.PostService.Interfaces;

import java.util.List;
import ai.ripple.PostService.Dto.Post.PostResponse;
import ai.ripple.PostService.Entity.Post;

public interface AIClient {
    
    List<PostResponse> generatePosts(String prompt);
    
    double rankPost(Post post);

    String chatWithData(String question);
}
