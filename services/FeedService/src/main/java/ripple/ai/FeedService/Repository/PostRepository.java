package ripple.ai.FeedService.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import ripple.ai.FeedService.Entity.FeedPost;
import ripple.ai.FeedService.Entity.OwnerType;


@Repository
public interface PostRepository extends MongoRepository<FeedPost, String> {

    // Latest posts first
    Page<FeedPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Filter by owner type
    Page<FeedPost> findByOwnerTypeOrderByCreatedAtDesc(
            OwnerType ownerType,
            Pageable pageable
    );

    // Find single post
    FeedPost findByPostId(String postId);

    // DELETE by postId
    void deleteByPostId(String postId);
}
