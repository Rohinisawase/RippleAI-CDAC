package ai.ripple.ApiGateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import ai.ripple.ApiGateway.security.JwtRoleFilter;

@Configuration
public class GatewayConfig {

    private final JwtRoleFilter jwtRoleFilter;

    public GatewayConfig(JwtRoleFilter jwtRoleFilter) {
        this.jwtRoleFilter = jwtRoleFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // User service (profile, dashboard, etc.)
                .route("user_service", r -> r.path("/auth/**", "/user/**" , "/ngo/**")
                        .filters(f -> f.filter(jwtRoleFilter))
                        .uri("lb://USERSERVICE"))

                // NGO service
                .route("post_service", r -> r.path("/post/**")
                        .filters(f -> f.filter(jwtRoleFilter))
                        .uri("lb://POSTSERVICE"))

                // Feed service
                .route("feed_service", r -> r.path("/feed/**")
                        .filters(f -> f.filter(jwtRoleFilter))
                        .uri("lb://FEEDSERVICE"))

                // Notification service
                .route("notification_service", r -> r.path("/notification/**")
                        .filters(f -> f.filter(jwtRoleFilter))
                        .uri("lb://NOTIFICATIONSERVICE"))

                .build();
    }
}
