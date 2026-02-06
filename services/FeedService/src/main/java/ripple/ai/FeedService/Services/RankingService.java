package ripple.ai.FeedService.Services;

import java.time.Duration;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class RankingService {

    public double calculatePostRank(
            double contentScore,
            int likes,
            int comments,
            LocalDateTime createdAt
    ) {
        double content = contentScore / 10.0;

        double engagementRaw =
                likes * 1.0 +
                comments * 2.0;

        double engagement = engagementRaw / (engagementRaw + 10);

        long hours =
                Duration.between(createdAt, LocalDateTime.now()).toHours();

        double freshness = Math.exp(-hours / 48.0);

        double finalScore =
                0.35 * content +
                0.30 * engagement +
                0.25 * freshness;

        return Math.max(0, Math.min(finalScore, 1)) * 100;
    }

      public double calculateUserRank(
            double avgContentScore,   // 0–10
            double avgEngagement,     // 0–1
            int violations,
            long accountAgeDays
    ) {
        double content = avgContentScore / 10.0;
        double trust = Math.min(accountAgeDays / 365.0, 1.0);
        double violationPenalty = Math.min(violations * 0.1, 0.4);

        double rank =
                0.40 * content +
                0.30 * avgEngagement +
                0.20 * trust -
                0.10 * violationPenalty;

        return Math.max(0, Math.min(rank, 1)) * 100;
    }
}
