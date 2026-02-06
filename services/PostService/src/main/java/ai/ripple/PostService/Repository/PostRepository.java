package ai.ripple.PostService.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Entity.PostStatus;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

 // In PostRepository
    Optional<Post> findByPostId(String postId);


    List<Post> findAllByIdIn(List<String> ids);

    List<Post> findByOwnerIdAndOwnerType(String ownerId, OwnerType ownerType);

    List<Post> findByCampaignId(String campaignId);

    boolean existsByCampaignId(String campaignId);

    void deleteByCampaignId(String campaignId);

    void deleteByPostId(String postId);


    List<Post> findByStatusAndScheduledAtBefore(
            PostStatus status,
            LocalDateTime time
    );

    List<Post> findByOwnerIdAndCampaignIdAndStatus(
            String ownerId,
            String campaignId,
            PostStatus status
    );
}
