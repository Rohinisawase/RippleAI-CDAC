package ai.ripple.PostService.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ai.ripple.PostService.Dto.Post.CreatePostItem;
import ai.ripple.PostService.Dto.Post.CreatePostRequest;
import ai.ripple.PostService.Entity.OwnerType;
import ai.ripple.PostService.Entity.Post;
import ai.ripple.PostService.Entity.PostStatus;
import ai.ripple.PostService.Entity.PostType;
import ai.ripple.PostService.Repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Save multiple posts (bulk)
    public void savePosts(CreatePostRequest request) {

        List<Post> entities = request.getPosts().stream()
                .map(p -> buildPostEntity(request, p))
                .toList();

        postRepository.saveAll(entities);
    }

    // Save a single post
    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    // Get post by Mongo ID
    public Post getPostById(String id) {
        return postRepository.findById(id).orElse(null);
    }

    // Get posts by owner
    public List<Post> getPostsByOwner(String ownerId, OwnerType ownerType) {
        return postRepository.findByOwnerIdAndOwnerType(ownerId, ownerType);
    }

    // Get campaign posts
    public List<Post> getCampaignPosts(String campaignId) {
        return postRepository.findByCampaignId(campaignId);
    }

    // Get pending scheduled posts
    public List<Post> getPendingScheduledPosts() {
        return postRepository.findByStatusAndScheduledAtBefore(
                PostStatus.SCHEDULED,
                LocalDateTime.now()
        );
    }

    public List<Post> getApprovedPostsByNgoAndCampaign(String ngoId, String campaignId) {
        return postRepository.findByOwnerIdAndCampaignIdAndStatus(
                ngoId,
                campaignId,
                PostStatus.SCHEDULED
        );
    }

    public Post getPostByPostId(String postId) {
        return postRepository.findByPostId(postId).orElse(null);
    }

    // Delete post
    public boolean deletePost(String postId) {
        Post post = getPostByPostId(postId);
        if (post == null) return false;
        postRepository.deleteByPostId(postId);
        return true;
    }


    // Delete all posts under a campaign
    public boolean deletePostsByCampaign(String campaignId) {
        if (!postRepository.existsByCampaignId(campaignId)) {
            return false;
        }
        postRepository.deleteByCampaignId(campaignId);
        return true;
    }

    // Get posts by list of IDs
    public List<Post> getPostsByIds(List<String> postIds) {
        if (postIds == null || postIds.isEmpty()) {
            return List.of();
        }
        return postRepository.findAllByIdIn(postIds);
    }


    // ---------------- PRIVATE HELPERS ----------------

    private Post buildPostEntity(CreatePostRequest request, CreatePostItem p) {

        Post post = new Post();

        post.setPostId(UUID.randomUUID().toString());

        post.setOwnerType(request.getOwnerType()); // USER / NGO
        post.setOwnerId(request.getOwnerId());

        post.setPostType(request.getPostType()); // NORMAL / CAMPAIGN
        post.setCampaignId(request.getPostType() == PostType.CAMPAIGN
                ? request.getCampaignId()
                : null);

        post.setCaption(p.getCaption());
        post.setPostLink(p.getPostLink());
        post.setMusicLink(p.getMusicLink());
        post.setTags(p.getTags());

        post.setScheduledAt(p.getScheduledAt());
        post.setCreatedAt(LocalDateTime.now());

        post.setStatus(
                p.getScheduledAt() != null
                        ? PostStatus.SCHEDULED
                        : PostStatus.DRAFT
        );

        return post;
    }
}
