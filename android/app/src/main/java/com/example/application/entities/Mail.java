package com.example.application.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.google.gson.annotations.SerializedName;
import com.example.application.db.Converters;

import java.util.List;

@Entity(tableName = "mails")
@TypeConverters(Converters.class)
public class Mail {

    @PrimaryKey
    @SerializedName("_id")
    @NonNull
    private String id;

    private String from;
    private List<String> to;
    private List<String> copy;
    private List<String> blindCopy;
    private String subject;
    private String body;
    private List<String> label;
    private boolean draft;
    private boolean isRead;
    private String createdAt;
    private String updatedAt;
    private String owner;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }

    public List<String> getCopy() {
        return copy;
    }

    public void setCopy(List<String> copy) {
        this.copy = copy;
    }

    public List<String> getBlindCopy() {
        return blindCopy;
    }

    public void setBlindCopy(List<String> blindCopy) {
        this.blindCopy = blindCopy;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public List<String> getLabel() {
        return label;
    }

    public void setLabel(List<String> label) {
        this.label = label;
    }

    public boolean isDraft() {
        return draft;
    }

    public void setDraft(boolean draft) {
        this.draft = draft;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    // Constructor with all fields
    public Mail(String id, String from, List<String> to, List<String> copy, List<String> blindCopy,
                String subject, String body, List<String> label, boolean draft, boolean isRead,
                String createdAt, String updatedAt, String owner) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.copy = copy;
        this.blindCopy = blindCopy;
        this.subject = subject;
        this.body = body;
        this.label = label;
        this.draft = draft;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.owner = owner;
    }

}
