package com.example.application.api;

import com.example.application.api.BlacklistCheckResponse;
import com.example.application.api.BlacklistRequest;
import com.example.application.entities.Mail;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

import java.util.List;

public interface MailsApi {

    @GET("api/mails")
    Call<List<Mail>> getRecentMails(@Header("X-user") String user);

    @POST("api/mails")
    Call<List<Mail>> createMail(@Body Mail mail);

    @PATCH("api/mails/{id}")
    Call<Mail> updateFullMail(@Path("id") String id, @Body Mail mail);

    @PATCH("api/mails/{id}")
    Call<Void> updateMailLabel(@Path("id") String id, @Body Map<String, Object> updates);

    @DELETE("api/mails/{id}")
    Call<Void> deleteMail(@Path("id") String id);

    @GET("api/mails/search/{query}")
    Call<List<Mail>> searchMails(
            @Header("X-user") String userEmail,
            @Path("query") String query
    );

    @GET("api/blacklist/{url}")
    Call<BlacklistCheckResponse> checkBlacklist(@Path(value = "url", encoded = true) String url);

    @POST("api/blacklist")
    Call<Void> addToBlacklist(@Body BlacklistRequest request);

    @DELETE("api/blacklist/{url}")
    Call<Void> removeFromBlacklist(@Path(value = "url", encoded = true) String url);
}
