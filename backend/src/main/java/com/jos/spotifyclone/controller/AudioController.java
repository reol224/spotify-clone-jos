package src.main.java.com.jos.spotifyclone.controller;

import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.miscellaneous.AudioAnalysis;
import com.wrapper.spotify.model_objects.specification.AudioFeatures;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import src.main.java.com.jos.spotifyclone.services.SpotifyConnect;

import java.io.IOException;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletionException;

@RestController
@RequestMapping("api/audio")
public class AudioController {

    @Autowired
    SpotifyConnect spotifyConnect;

    /**
     * http://localhost:8080/api/audio/analysis?id=01iyCAUm8EvOFqVWYJ3dVX
     *
     * @param id Required.
     *           The Spotify ID for the track.
     */
    @GetMapping("/analysis")
    public AudioAnalysis getAudioAnalysisForTrack(@RequestParam String id) throws ParseException, SpotifyWebApiException, IOException {
        AudioAnalysis result = null;
        try {
            result = spotifyConnect.getSpotifyApi().getAudioAnalysisForTrack(id).build().executeAsync().join();
        } catch (CompletionException e) {
            System.out.println("Error: " + e.getCause().getMessage());
        } catch (CancellationException e) {
            System.out.println("Async operation cancelled.");
        }
        return result;
    }

    /**
     * http://localhost:8080/api/audio/audio-features/track?id=01iyCAUm8EvOFqVWYJ3dVX
     *
     * @param id Required.
     *           The Spotify ID for the track.
     */
    @GetMapping("/audio-features/track")
    public AudioFeatures getAudioFeaturesForTrack(@RequestParam String id) throws ParseException, SpotifyWebApiException, IOException {
        AudioFeatures result = null;
        try {
            result = spotifyConnect.getSpotifyApi().getAudioFeaturesForTrack(id).build().executeAsync().join();
        } catch (CompletionException e) {
            System.out.println("Error: " + e.getCause().getMessage());
        } catch (CancellationException e) {
            System.out.println("Async operation cancelled.");
        }
        return result;
    }

    /**
     * http://localhost:8080/api/audio/audio-features/tracks?ids=01iyCAUm8EvOFqVWYJ3dVX
     *
     * @param ids Required.
     *            A comma-separated list of the Spotify IDs for the tracks.
     *            Maximum: 100 IDs.
     */
    @GetMapping("/audio-features/tracks")
    public AudioFeatures[] getAudioFeaturesForSeveralTracks(@RequestParam String[] ids) throws ParseException, SpotifyWebApiException, IOException {
        AudioFeatures[] result = null;
        try {
            result = spotifyConnect.getSpotifyApi().getAudioFeaturesForSeveralTracks(ids).build().executeAsync().join();
        } catch (CompletionException e) {
            System.out.println("Error: " + e.getCause().getMessage());
        } catch (CancellationException e) {
            System.out.println("Async operation cancelled.");
        }
        return result;
    }
}
