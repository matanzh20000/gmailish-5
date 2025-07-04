package com.example.application.api;

import com.example.application.entities.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface UsersApi {

    // Create a new user (sign up)
    @POST("/api/users")
    Call<User> createUser(@Body User user);

    // Get user by email (sign in or check existence)
    @GET("users/{id}")
    Call<User> getUserById(@Path("id") String id);


    @POST("/api/tokens")
    Call<TokenResponse> signIn(@Body SignInRequest request);


}