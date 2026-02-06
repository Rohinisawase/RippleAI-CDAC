package ai.ripple.UserService.auth.Dto;

import lombok.Data;

@Data
public class ResetOtpVerifyRequest {
    private String email;
    private String otp;
}