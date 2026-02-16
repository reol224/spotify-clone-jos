package com.jos.spotifyclone.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spotify.api")
@Getter
@Setter
public class ApplicationPropertiesConfig {
    private String clientId;
    private String secretId;
    private String redirectUri;
    private String frontendUrl;
}
