package ai.ripple.UserService.auth.Dto;

import org.springframework.web.multipart.MultipartFile;

import ai.ripple.UserService.auth.Entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountRegisterDTO {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String phone;
    private String address;

    private Role role;

    private MultipartFile profilePhoto; 

}
