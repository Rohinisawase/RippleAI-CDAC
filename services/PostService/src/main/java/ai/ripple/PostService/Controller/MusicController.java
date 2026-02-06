package ai.ripple.PostService.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/posts/music")
public class MusicController {

    @GetMapping
    public List<Map<String, Object>> getAllSongs(HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" +
                request.getServerName() + ":" +
                request.getServerPort();

        System.out.println("[MusicController] Request received for /user/posts/music");
        System.out.println("[MusicController] Base URL: " + baseUrl);

        List<Map<String, Object>> songs = new ArrayList<>();
        try {
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            org.springframework.core.io.Resource[] resources = resolver.getResources("classpath:/static/songs/*.mp3");

            System.out.println("[MusicController] Found " + resources.length + " resources in /static/songs/");

            int id = 1;
            for (org.springframework.core.io.Resource resource : resources) {
                String filename = resource.getFilename();
                if (filename == null) {
                    System.out.println("[MusicController] Skipping resource with null filename");
                    continue;
                }

                System.out.println("[MusicController] Processing file: " + filename);

                Map<String, Object> song = new HashMap<>();
                song.put("id", id++);
                song.put("name", filename.replace(".mp3", ""));
                song.put("artist", "Unknown");
                song.put("url", baseUrl + "/songs/" + filename);

                songs.add(song);
            }

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("[MusicController] IOException occurred while loading songs");
            throw new RuntimeException("Error reading songs directory", e);
        }

        System.out.println("[MusicController] Returning " + songs.size() + " songs to client");
        return songs;
    }
}
