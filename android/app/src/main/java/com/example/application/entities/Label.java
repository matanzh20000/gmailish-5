package com.example.application.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "labels")
public class Label {

    @PrimaryKey
    @NonNull
    @SerializedName("_id")  // Ensures Retrofit binds Mongo _id correctly
    private String id;

    private String name;
    private String icon;
    private String user;

    @Ignore
    public Label(@NonNull String id, String name, String icon, String user) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.user = user;
    }

    public Label(String name, String icon, String user) {
        this.id = java.util.UUID.randomUUID().toString();  // Ensures a unique placeholder ID
        this.name = name;
        this.icon = icon;
        this.user = user;
    }

    // --- Getters ---
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIcon() {
        return icon;
    }

    public String getUser() {
        return user;
    }

    // --- Setters ---
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
