package com.example.application.api;

public interface SignUpResultCallback {
    void onSuccess();
    void onError(String message);
}