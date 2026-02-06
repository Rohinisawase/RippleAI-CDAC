package ai.ripple.UserService.auth.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ai.ripple.UserService.auth.Dto.AccountRegisterDTO;
import ai.ripple.UserService.auth.Dto.JwtResponse;
import ai.ripple.UserService.auth.Dto.LoginRequest;
import ai.ripple.UserService.auth.Entity.Account;
import ai.ripple.UserService.auth.Entity.Role;
import ai.ripple.UserService.auth.FileStorage.FileStorage;
import ai.ripple.UserService.auth.Repository.AccountRepository;
import ai.ripple.UserService.auth.Security.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorage fileStorageService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@ModelAttribute AccountRegisterDTO dto) {

        if (accountRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT) //409
                    .body("Email already registered");
        }

        Account account = new Account();
        account.setName(dto.getName());
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setPhone(dto.getPhone());
        account.setAddress(dto.getAddress());
        account.setRole(dto.getRole() != null ? dto.getRole() : Role.USER);

        // Upload profile photo if exists
        if (dto.getProfilePhoto() != null && !dto.getProfilePhoto().isEmpty()) {
            String fileUrl = fileStorageService.uploadFile(dto.getProfilePhoto(), "ripple/profile_photos");
            account.setProfilePhotoUrl(fileUrl);
        }

        accountRepository.save(account);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // Now RuntimeException will be handled by GlobalExceptionHandler
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                account.getAccountId(),
                account.getEmail(),
                account.getRole());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) //dev
                .path("/")
                .maxAge(86400)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new JwtResponse(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        // Clear the JWT cookie by setting it empty and expiring it
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)          // cookie not accessible in JS
                .secure(false)            // only over HTTPS in production
                .path("/")               // valid for entire domain
                .maxAge(0)               // expires immediately
                .sameSite("None")        // allow cross-site for frontend on different domain
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("status", "logged out"));
    }
}
