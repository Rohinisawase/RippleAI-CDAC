package ai.ripple.UserService.auth.Dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private String role;
}