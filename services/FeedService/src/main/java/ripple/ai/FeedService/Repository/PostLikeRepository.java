package ripple.ai.FeedService.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import ripple.ai.FeedService.Entity.PostLike;

@Repository
public interface PostLikeRepository extends MongoRepository<PostLike, String> {

    boolean existsByPostIdAndUserId(String postId, String userId);

    long countByPostId(String postId);

    List<PostLike> findByUserId(String userId);
    void deleteByPostId(String postId);
}
