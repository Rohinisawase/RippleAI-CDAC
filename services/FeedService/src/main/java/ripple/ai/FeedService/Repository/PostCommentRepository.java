package ripple.ai.FeedService.Repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import ripple.ai.FeedService.Entity.PostComment;

@Repository
public interface PostCommentRepository extends MongoRepository<PostComment, String> {

    long countByPostId(String postId);

    List<PostComment> findByPostId(String postId);

    List<PostComment> findByUserId(String userId);

    void deleteByPostId(String postId);
}
