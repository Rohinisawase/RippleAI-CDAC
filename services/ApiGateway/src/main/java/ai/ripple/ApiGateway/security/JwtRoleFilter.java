package ai.ripple.ApiGateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtRoleFilter implements GatewayFilter {

    private final Key signingKey;

    // Constructor injection of JWT secret
    public JwtRoleFilter(@Value("${jwt.SECRET}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Skip auth-free paths
        if (path.startsWith("/auth/register") ||
                path.startsWith("/auth/login") ||
                path.startsWith("/auth/logout") || 
                path.startsWith("/notification/")) {
                return chain.filter(exchange);
            }

        // Extract JWT from cookie
        HttpCookie jwtCookie = exchange.getRequest().getCookies().getFirst("jwt");
        if (jwtCookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = jwtCookie.getValue();
        Claims claims;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        System.out.println("JWT claims: " + claims);


        // Extract roles
        List<String> roles = new ArrayList<>();
        Object rolesObj = claims.get("role");
        if (rolesObj instanceof String) roles.add((String) rolesObj);
        else if (rolesObj instanceof List<?>) {
            for (Object r : (List<?>) rolesObj) roles.add(String.valueOf(r));
        }

        // Check access based on role
        boolean allowed = roles.stream().anyMatch(role -> {
    String r = role.toUpperCase();
    return (r.equals("NGO") && path.startsWith("/ngo")) ||
           (r.equals("USER") && (path.startsWith("/auth/user") || path.startsWith("/user/posts"))) ||
           (path.startsWith("/feed")); 
});


        if (!allowed) {
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            return exchange.getResponse().setComplete();
        }

        // Set userId in exchange attributes for backend
        Object userId = claims.get("userId");
        System.out.println("userId" + userId);
        if (userId != null) {
            exchange.getAttributes().put("userId", userId.toString());
        } else {
            // Handle missing id - either reject request or skip setting attribute
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }


        return chain.filter(exchange);
    }
}
