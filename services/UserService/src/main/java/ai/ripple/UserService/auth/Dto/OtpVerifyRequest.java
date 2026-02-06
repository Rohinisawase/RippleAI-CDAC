package ai.ripple.UserService.auth.Dto;

import lombok.*;

@Getter
@Setter
public class OtpVerifyRequest {
    private String email;
    private String otp;
}