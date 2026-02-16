package com.jos.spotifyclone.model;

import java.util.List;
import se.michaelthelin.spotify.model_objects.specification.ExternalUrl;
import se.michaelthelin.spotify.model_objects.specification.Image;

public class AlbumModel {
    String name;
    List<Object> artist;
    Image[] image;
    ExternalUrl externalUrl;

    public AlbumModel(String name, List<Object> artist, Image[] image, ExternalUrl externalUrl) {
        this.name = name;
        this.artist = artist;
        this.image = image;
        this.externalUrl = externalUrl;
    }

    public ExternalUrl getExternalUrl() {
        return externalUrl;
    }

    public Image[] getImage() {
        return image;
    }

    public String getName() {
        return name;
    }

    public List<Object> getArtist() {
        return artist;
    }
}
