package com.example.application.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.Embedded;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "users")
public class User {

    // MongoDB _id
    @PrimaryKey
    @NonNull
    @SerializedName("_id")  // Tell Gson to map _id → _id field from MongoDB
    private String id;

    private String firstName;
    private String lastName;

    @Embedded
    private BirthDate birthDate;

    private String gender;

    @NonNull
    private String mail;

    @NonNull
    private String password;

    private String backupMail;
    private String image;

    // Default constructor for Room and Retrofit
    public User() {}

    // Full constructor
    public User(@NonNull String id, String firstName, String lastName, BirthDate birthDate,
                 String gender, @NonNull String mail, @NonNull String password,
                 String backupMail, String image) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.mail = mail;
        this.password = password;
        this.backupMail = backupMail;
        this.image = image;
    }

    // Inner class for birthDate
    public static class BirthDate {
        private int year;
        private int month;
        private int day;

        public BirthDate() {}

        public BirthDate(int year, int month, int day) {
            this.year = year;
            this.month = month;
            this.day = day;
        }

        // Getters and setters
        public int getYear() { return year; }
        public void setYear(int year) { this.year = year; }

        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }

        public int getDay() { return day; }
        public void setDay(int day) { this.day = day; }
    }

    // Getters and setters
    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public BirthDate getBirthDate() { return birthDate; }
    public void setBirthDate(BirthDate birthDate) { this.birthDate = birthDate; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    @NonNull
    public String getMail() { return mail; }
    public void setMail(@NonNull String mail) { this.mail = mail; }

    @NonNull
    public String getPassword() { return password; }
    public void setPassword(@NonNull String password) { this.password = password; }

    public String getBackupMail() { return backupMail; }
    public void setBackupMail(String backupMail) { this.backupMail = backupMail; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
