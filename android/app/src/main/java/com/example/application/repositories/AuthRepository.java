package com.example.application.repositories;

import android.util.Log;

import com.example.application.api.AuthApi;
import com.example.application.models.LoginRequest;
import com.example.application.models.LoginResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AuthRepository {

    private final AuthApi authApi;

    public AuthRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8080/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        authApi = retrofit.create(AuthApi.class);
    }

    public void login(String mail, String password, Callback<LoginResponse> callback) {
        LoginRequest request = new LoginRequest(mail, password);
        authApi.login(request).enqueue(callback);
    }
}