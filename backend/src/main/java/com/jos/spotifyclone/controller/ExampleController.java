package src.main.java.com.jos.spotifyclone.controller;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.User;
import src.main.java.com.jos.spotifyclone.services.SpotifyConnect;

import java.io.IOException;

@RequestMapping("api/example")
@RestController
public class ExampleController {

    @Autowired
    SpotifyConnect spotifyConnect;

    @GetMapping
    public User handleGet() throws ParseException, SpotifyWebApiException, IOException {
        return spotifyConnect.getSpotifyApi().getCurrentUsersProfile().build().execute();
    }

}
