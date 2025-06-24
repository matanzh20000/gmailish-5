package com.example.application.repositories;
import android.app.Application;
import androidx.lifecycle.LiveData;
import com.example.application.api.ApiService;
import com.example.application.api.RetrofitClient;
import com.example.application.db.GmailishDatabase;
import com.example.application.db.LabelDao;
import com.example.application.models.LabelEntity;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LabelRepository {
    private final LabelDao labelDao;
    private final ApiService api;
    private final Executor ioExecutor = Executors.newSingleThreadExecutor();

    public LabelRepository(Application application) {
        GmailishDatabase db = GmailishDatabase.getInstance(application);
        labelDao = db.labelDao();
        api = RetrofitClient.getApiService();
    }

    public LiveData<List<LabelEntity>> getLabels(String userEmail) {
        refreshFromNetwork(userEmail);
        return labelDao.loadLabels(userEmail);
    }

    private void refreshFromNetwork(String userEmail) {
        api.getLabels(userEmail).enqueue(new Callback<List<LabelEntity>>() {
            @Override
            public void onResponse(Call<List<LabelEntity>> call, Response<List<LabelEntity>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ioExecutor.execute(() -> labelDao.upsertAll(response.body()));
                }
            }

            @Override
            public void onFailure(Call<List<LabelEntity>> call, Throwable t) {
                // handle error
            }
        });
    }
}