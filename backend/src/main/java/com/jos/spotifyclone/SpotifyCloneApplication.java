package src.main.java.com.jos.spotifyclone;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import src.main.java.com.jos.spotifyclone.config.ApplicationPropertiesConfig;

import java.util.*;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(ApplicationPropertiesConfig.class)
public class SpotifyCloneApplication {

    @Value("spotify.frontend.url")
    String FRONTEND_URL;

    public static void main(String[] args) {
        SpringApplication.run(SpotifyCloneApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/*").allowedOrigins(FRONTEND_URL);
            }
        };
    }
}
