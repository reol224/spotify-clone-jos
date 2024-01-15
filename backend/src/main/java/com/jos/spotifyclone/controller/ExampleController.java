package main.java.com.jos.spotifyclone.controller;

import java.io.IOException;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.User;
import main.java.com.jos.spotifyclone.services.SpotifyConnect;

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
