package ai.ripple.UserService.auth.Dto;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String idToken;
}