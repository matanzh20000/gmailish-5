package com.example.application.api;

import com.example.application.entities.Label;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface LabelsApi {

    @GET("/api/labels")
    Call<List<Label>> getLabels();

    @POST("/api/labels")
    Call<Label> addLabel(@Header("X-user") String user, @Body Label label);

    @PATCH("/api/labels/{id}")
    Call<Label> updateLabel(@Path("id") String id, @Body Label label);

    @DELETE("/api/labels/{id}")
    Call<Void> deleteLabel(@Path("id") String id);
}
