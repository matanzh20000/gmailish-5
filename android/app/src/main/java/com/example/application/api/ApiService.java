
package com.example.application.api;

import java.util.List;
import com.example.application.models.*;

import retrofit2.Call;
import retrofit2.http.*;

public interface ApiService {
    @POST("api/users/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @POST("api/users/register")
    Call<Void> register(@Body RegisterRequest request);

    @GET("api/mails")
    Call<List<MailEntity>> getInbox(@Header("X-user") String email);

}
