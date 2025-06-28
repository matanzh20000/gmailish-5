package com.example.application.api;

import com.example.application.models.UserEntity;

import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface UsersApi {

    @Multipart
    @POST("/api/users")
    Call<UserEntity> createUser(
        @Part MultipartBody.Part avatar,
        @Part("name") String name,
        @Part("mail") String mail,
        @Part("password") String password
    );

    @GET("/api/users/{id}")
    Call<UserEntity> getUserById(@Path("id") String id);
}
