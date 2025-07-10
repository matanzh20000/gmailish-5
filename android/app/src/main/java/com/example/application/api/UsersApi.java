package com.example.application.api;

import com.example.application.entities.User;
import com.google.gson.JsonObject;

import org.json.JSONObject;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface UsersApi {

    // Create a new user (sign up)
    @Multipart
    @POST("api/users")
    Call<JsonObject> createUser(
            @Part("firstName") RequestBody firstName,
            @Part("lastName") RequestBody lastName,
            @Part("mail") RequestBody mail,
            @Part("password") RequestBody password,
            @Part("gender") RequestBody gender,
            @Part("birthDate[year]") RequestBody year,
            @Part("birthDate[month]") RequestBody month,
            @Part("birthDate[day]") RequestBody day,
            @Part MultipartBody.Part image
    );

    // Get user by email (sign in or check existence)
    @GET("users/{id}")
    Call<User> getUserById(@Path("id") String id);


    @POST("/api/tokens")
    Call<TokenResponse> signIn(@Body SignInRequest request);


}