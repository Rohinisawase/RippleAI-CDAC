package ai.ripple.UserService.auth.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ai.ripple.UserService.auth.Entity.Account;
import ai.ripple.UserService.auth.Entity.Verification;
import ai.ripple.UserService.auth.Entity.VerificationStatus;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {
    List<Verification> findByNgo(Account ngo);
    List<Verification> findByNgoAndStatusNot(Account ngo, VerificationStatus status);
}
