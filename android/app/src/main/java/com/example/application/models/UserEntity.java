package com.example.application.models;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.Embedded;
import androidx.annotation.NonNull;

@Entity(tableName = "users")
public class UserEntity {
    @PrimaryKey
    @NonNull
    public String mail;
    public String firstName;
    public String lastName;
    @Embedded(prefix = "birth_")
    public BirthDate birthDate;
    public String gender;
    public String backupMail;
    public String image;
}

