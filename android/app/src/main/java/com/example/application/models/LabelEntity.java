package com.example.application.models;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "labels")
public class LabelEntity {
    @PrimaryKey(autoGenerate = true)
    public int id;
    public String name;
    public String icon;
    public String user;
}