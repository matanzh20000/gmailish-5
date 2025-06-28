package com.example.application.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "users")
public class UserEntity {
    @PrimaryKey
    @NonNull
    public String _id; 
    public String name;
    public String mail;
    public String password;
    public String avatar; 
    public String createdAt;
}
