package ai.ripple.UserService.auth.Dto;

import ai.ripple.UserService.auth.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {

    private String token;
}
