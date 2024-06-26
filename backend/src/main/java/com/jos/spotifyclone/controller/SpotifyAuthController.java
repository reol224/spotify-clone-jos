package main.java.com.jos.spotifyclone.controller;


import java.io.IOException;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import main.java.com.jos.spotifyclone.services.SpotifyConnect;

@RequestMapping("api/spotify-auth")
@RestController
public class SpotifyAuthController {

    @Autowired
    private SpotifyConnect spotifyConnect;

    @GetMapping
    public RedirectView handleAuthCode(@RequestParam String code) throws ParseException, SpotifyWebApiException, IOException {
        spotifyConnect.addAuthCode(code);

        return new RedirectView("example");
    }

}
