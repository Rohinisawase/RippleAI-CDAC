package ripple.ai.FeedService.Dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ripple.ai.FeedService.Entity.OwnerType;
import ripple.ai.FeedService.Entity.PostStatus;
import ripple.ai.FeedService.Entity.PostType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCreatedEvent {
    private String postId;
    private OwnerType ownerType;
    private String ownerId;
    private PostType postType;
    private String campaignId;
    private String caption;
    private String postLink;
    private String musicLink;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
    private PostStatus status;
    private List<String> tags;
}
