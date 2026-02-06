package ripple.ai.FeedService.Entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "post_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(
    name = "post_user_comment_idx",
    def = "{'postId': 1, 'userId': 1, 'createdAt': 1}"
)
public class PostComment {

    @Id
    private String id;

    @NotBlank
    private String postId;

    @NotBlank
    private String userId;

    @NotBlank
    private String content;

    @NotNull
    private LocalDateTime createdAt;
}
