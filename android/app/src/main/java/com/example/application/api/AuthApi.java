package com.example.application.api;

import com.example.application.models.LoginRequest;
import com.example.application.models.LoginResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface AuthApi {
    @POST("/api/tokens")
    Call<LoginResponse> login(@Body LoginRequest request);
}