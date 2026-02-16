package com.jos.spotifyclone.controller;

import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletionException;
import java.util.logging.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jos.spotifyclone.services.SpotifyConnect;

import se.michaelthelin.spotify.model_objects.miscellaneous.AudioAnalysis;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;

@RestController
@RequestMapping("api/audio")
public class AudioController {
    @Autowired
    SpotifyConnect spotifyConnect;
    String ERROR_MESSAGE = "Error: %s";
    String CANCELLED_MESSAGE = "Async operation cancelled.";
    Logger logger = LoggerFactory.getLogger(AudioController.class);

    /**
     * http://localhost:8080/api/audio/analysis?id=01iyCAUm8EvOFqVWYJ3dVX
     *
     * @param id Required.
     *           The Spotify ID for the track.
     */
    @GetMapping("/analysis")
    public AudioAnalysis getAudioAnalysisForTrack(@RequestParam String id) {
        AudioAnalysis result = null;
        try {
            result = spotifyConnect.getSpotifyApi().getAudioAnalysisForTrack(id).build().executeAsync().join();
        } catch (CompletionException e) {
            logger.error((Marker) Level.SEVERE, ERROR_MESSAGE, e.getCause().getMessage());
        } catch (CancellationException e) {
            logger.error(CANCELLED_MESSAGE);
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
    public AudioFeatures getAudioFeaturesForTrack(@RequestParam String id) {
        AudioFeatures result = null;
        try {
            result = spotifyConnect.getSpotifyApi().getAudioFeaturesForTrack(id).build().executeAsync().join();
        } catch (CompletionException e) {
            logger.error((Marker) Level.SEVERE, ERROR_MESSAGE, e.getCause().getMessage());
        } catch (CancellationException e) {
            logger.error(CANCELLED_MESSAGE);
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
    public AudioFeatures[] getAudioFeaturesForSeveralTracks(@RequestParam String[] ids) {
        AudioFeatures[] result = null;
        try {
            result = spotifyConnect.getSpotifyApi().getAudioFeaturesForSeveralTracks(ids).build().executeAsync().join();
        } catch (CompletionException e) {
            logger.error((Marker) Level.SEVERE, ERROR_MESSAGE, e.getCause().getMessage());
        } catch (CancellationException e) {
            logger.error(CANCELLED_MESSAGE);
        }
        return result;
    }
}
