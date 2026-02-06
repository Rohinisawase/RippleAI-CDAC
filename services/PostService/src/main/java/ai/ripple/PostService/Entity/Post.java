package ai.ripple.PostService.Entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private String id;

    @NotBlank(message = "postId is required")
    private String postId; // UUID (validate format if needed)

    @NotNull(message = "ownerType is required")
    private OwnerType ownerType; // USER or NGO

    @NotBlank(message = "ownerId is required")
    private String ownerId; // userId or ngoId

    @NotNull(message = "postType is required")
    private PostType postType; // NORMAL, CAMPAIGN

    // conditional validation handled later
    private String campaignId;

    @NotBlank(message = "caption cannot be empty")
    @Size(max = 1000, message = "caption cannot exceed 1000 characters")
    private String caption;

    @NotBlank(message = "postLink is required")
    private String postLink;

    private String musicLink;

    private LocalDateTime scheduledAt;

    @NotNull(message = "createdAt is required")
    private LocalDateTime createdAt;

    @NotNull(message = "status is required")
    private PostStatus status;

    @Size(max = 20, message = "Maximum 20 tags allowed")
    private List<@NotBlank(message = "tag cannot be blank") String> tags;
}
