package ai.ripple.UserService.auth.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "verification")
@Data
@NoArgsConstructor
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long verificationId;

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private Account ngo; 

    @Column(columnDefinition = "TEXT")
    private String submittedDocs;

    @Enumerated(EnumType.STRING)
    private VerificationStatus status; // Pending, Verified, Rejected

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private Account reviewedBy; // role = ADMIN

    private LocalDateTime reviewDate;
}

