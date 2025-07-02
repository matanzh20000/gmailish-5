package com.example.application.api;

import com.example.application.entities.Mail;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.DELETE;
import retrofit2.http.Path;

public interface MailsApi {

    @GET("api/mails")
    Call<List<Mail>> getRecentMails(@Header("X-user") String user);

    @GET("api/mails/{id}")
    Call<Mail> getMailById(@Path("id") String id);

    @POST("api/mails")
    Call<Mail> createMail(@Body Mail mail);

    @PATCH("api/mails/{id}")
    Call<Mail> updateMail(@Path("id") String id, @Body Mail mail);

    @DELETE("api/mails/{id}")
    Call<Void> deleteMail(@Path("id") String id);

    @GET("api/mails/search/{query}")
    Call<List<Mail>> searchMails(
            @Header("X-user") String userEmail,
            @Path("query") String query
    );

}
