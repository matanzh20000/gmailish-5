package com.example.application.models;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;
import androidx.annotation.NonNull;
import com.example.application.db.Converters;
import com.example.application.db.DateConverter;

import java.util.Date;
import java.util.List;

@Entity(tableName = "mails")
@TypeConverters({Converters.class, DateConverter.class})
public class MailEntity {
    @PrimaryKey
    @NonNull
    public String _id;

    public String from;
    public List<String> to;
    public List<String> copy;
    public List<String> blindCopy;
    public String subject;
    public String body;
    public List<String> label;
    public boolean draft;
    public boolean isRead;
    public Date createdAt;
    public Date updatedAt;
    public String owner;
}
