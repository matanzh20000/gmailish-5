package com.example.application.repositories;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;

import com.example.application.api.LabelsApi;
import com.example.application.db.LabelDao;
import com.example.application.db.LabelDatabase;
import com.example.application.entities.Label;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LabelsRepository {

    private final LabelDao labelDao;
    private final LiveData<List<Label>> allLabels;
    private final LabelsApi labelsApi;

    public LabelsRepository(Application application) {
        LabelDatabase database = LabelDatabase.getInstance(application);
        labelDao = database.labelDao();

        insertDefaultLabels();  // Ensure defaults inserted before observing LiveData

        allLabels = labelDao.getAllLabels();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8080/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        labelsApi = retrofit.create(LabelsApi.class);
    }

    public LiveData<List<Label>> getAllLabels() {
        refreshLabelsFromApi();
        return allLabels;
    }

    public void insertDefaultLabels() {
        Executors.newSingleThreadExecutor().execute(() -> {
            List<Label> existingLabels = labelDao.getAllLabelsList();
            if (existingLabels == null || existingLabels.isEmpty()) {
                Log.d("LabelsRepository", "Inserting default labels");
                labelDao.insert(new Label("Inbox", "icon_inbox", "global"));
                labelDao.insert(new Label("Starred", "icon_star", "global"));
                labelDao.insert(new Label("Snoozed", "icon_snooze", "global"));
                labelDao.insert(new Label("Sent", "icon_sent", "global"));
                labelDao.insert(new Label("Spam", "icon_spam", "global"));
                labelDao.insert(new Label("Drafts", "icon_drafts", "global"));
            }
        });
    }

    private void refreshLabelsFromApi() {
        labelsApi.getLabels().enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertLabels(response.body());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call, @NonNull Throwable t) {
                Log.e("LabelsRepository", "Failed to fetch labels", t);
            }
        });
    }

    public void addLabel(Label label) {
        labelsApi.addLabel("global", label).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Label> call, @NonNull Response<Label> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertLabels(List.of(response.body()));
                } else {
                    Log.e("LabelsRepository", "Failed to add label - " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Label> call, @NonNull Throwable t) {
                Log.e("LabelsRepository", "Failed to add label", t);
            }
        });
    }


    public void updateLabel(Label label) {
        labelsApi.updateLabel(label.getId(), label).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Label> call, @NonNull Response<Label> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertLabels(List.of(response.body()));
                }
            }

            @Override
            public void onFailure(@NonNull Call<Label> call, @NonNull Throwable t) {
                Log.e("LabelsRepository", "Failed to update label", t);
            }
        });
    }

    public void deleteLabel(Label label) {
        labelsApi.deleteLabel(label.getId()).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    deleteLabelFromDb(label);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("LabelsRepository", "Failed to delete label", t);
            }
        });
    }

    private void insertLabels(List<Label> labels) {
        Executors.newSingleThreadExecutor().execute(() -> {
            for (Label label : labels) {
                labelDao.insert(label);
            }
        });
    }

    private void deleteLabelFromDb(Label label) {
        Executors.newSingleThreadExecutor().execute(() -> labelDao.delete(label));
    }
}
