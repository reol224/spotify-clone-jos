package main.java.com.jos.spotifyclone.model;

import com.neovisionaries.i18n.CountryCode;
import se.michaelthelin.spotify.model_objects.specification.Image;

public class UserModel {
    String displayName;
    String birthdate;
    CountryCode country;
    Image[] profilePicture;

    public UserModel(String displayName, String birthdate, CountryCode country, Image[] profilePicture) {
        this.displayName = displayName;
        this.birthdate = birthdate;
        this.country = country;
        this.profilePicture = profilePicture;
    }

    public Image[] getProfilePicture() {
        return profilePicture;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public CountryCode getCountry() {
        return country;
    }
}
