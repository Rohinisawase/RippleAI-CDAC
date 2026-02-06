package ripple.ai.FeedService.Controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ripple.ai.FeedService.Entity.FeedPost;
import ripple.ai.FeedService.Entity.OwnerType;
import ripple.ai.FeedService.Repository.PostRepository;

@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
@Slf4j
public class FeedController {

    private final PostRepository postRepository;

    /**
     * Infinite scroll feed
     * GET /api/feed?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<FeedPost>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Fetching feed posts | page={}, size={}", page, size);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<FeedPost> feedPosts =
                postRepository.findAllByOrderByCreatedAtDesc(pageable);

        return ResponseEntity.ok(feedPosts);
    }

    /**
     * Optional: filter feed by owner type (NGO / USER)
     * GET /api/feed/type/NGO?page=0&size=10
     */
    @GetMapping("/type/{ownerType}")
    public ResponseEntity<Page<FeedPost>> getFeedByOwnerType(
            @PathVariable OwnerType ownerType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Fetching {} feed posts | page={}, size={}",
                ownerType, page, size);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<FeedPost> feedPosts =
                postRepository.findByOwnerTypeOrderByCreatedAtDesc(
                        ownerType,
                        pageable
                );

        return ResponseEntity.ok(feedPosts);
    }
}
