package com.example.application.api;

public class BlacklistRequest {
    private String url;

    public BlacklistRequest(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
}