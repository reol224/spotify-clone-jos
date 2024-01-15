package main.java.com.jos.spotifyclone.services;


import java.io.IOException;
import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import org.apache.commons.lang3.SystemUtils;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

@Component
public class SpotifyConnect {
    private final SpotifyApi spotifyApi;
    private final AuthorizationCodeUriRequest.Builder authorizationCodeUriRequestBuilder;
    public static final Logger logger = Logger.getLogger(SpotifyConnect.class.getName());

    public SpotifyConnect(
            @Value("${spotify.api.clientId}") String clientId,
            @Value("${spotify.api.secretId}") String secretId,
            @Value("${spotify.api.redirectUri}") String redirectUri
    ) {
        this.spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(secretId)
                .setRedirectUri(SpotifyHttpManager.makeUri(redirectUri))
                .build();

        this.authorizationCodeUriRequestBuilder = spotifyApi.authorizationCodeUri().scope("user-read-recently-played " +
                "user-read-playback-position " +
                "user-top-read " +
                "playlist-modify-private " +
                "playlist-read-collaborative " +
                "playlist-read-private " +
                "playlist-modify-public " +
                "user-read-email " +
                "user-read-private " +
                "user-follow-read " +
                "user-follow-modify " +
                "user-library-modify " +
                "user-library-read " +
                "user-read-currently-playing " +
                "ugc-image-upload " +
                "user-read-playback-state " +
                "user-modify-playback-state");
    }


    @PostConstruct
    public void openAuthWindow() {
        final URI uri = authorizationCodeUriRequestBuilder.build().execute();
        Runtime runtime = Runtime.getRuntime();
        if (SystemUtils.IS_OS_WINDOWS) {
            try {
                runtime.exec("rundll32 url.dll,FileProtocolHandler " + uri);
            } catch (IOException e) {
                logger.log(Level.SEVERE, "If you're running on Windows and read this it looks like we can't open your browser...");
            }
        }
        if (SystemUtils.IS_OS_MAC || SystemUtils.IS_OS_MAC_OSX) {
            try {
                runtime.exec("open " + uri);
            } catch (IOException e) {
                logger.log(Level.SEVERE, "If you're running on MacOS and read this it looks like we can't open your browser...");
            }
        }
        if (SystemUtils.IS_OS_LINUX) {
            try {
                runtime.exec(new String[]{"bash", "-c", "xdg-open " + uri});
            } catch (IOException e) {
                logger.log(Level.SEVERE, "If you're running on Linux and read this it looks like we can't open your browser...");
            }
        }
    }

    public void addAuthCode(String code) throws ParseException, SpotifyWebApiException, IOException {
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code).build();

        final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

        // Set access and refresh token for further "spotifyApi" object usage
        spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
        spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());
    }

    @Scheduled(cron = "@hourly")
    public void refreshAuthToken() {
        spotifyApi.setAccessToken(spotifyApi.getAccessToken());
        spotifyApi.setRefreshToken(spotifyApi.getRefreshToken());
    }

    public SpotifyApi getSpotifyApi() {
        return spotifyApi;
    }
}
