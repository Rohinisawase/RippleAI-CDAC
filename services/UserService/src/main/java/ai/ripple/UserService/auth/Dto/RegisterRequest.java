package ai.ripple.UserService.auth.Dto;

import lombok.*;

@Getter
@Setter
public class RegisterRequest {

    private String email;
    private String password;
    private String phone;
    private String role;   // USER or NGO

    // USER FIELDS
    private String name;
    private Integer age;
    private String address;

    // NGO FIELDS
    private String ngoName;
    private String ngoDetails;
}