package ai.ripple.UserService.auth.Dto;

import lombok.Data;

@Data
public class UpdateNGOProfileDTO {
    private String name;
    private String phone;
    private String address;
    private String registrationNumber;
}
