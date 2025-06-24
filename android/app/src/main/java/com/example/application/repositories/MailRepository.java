package com.example.application.repositories;

import android.app.Application;
import androidx.lifecycle.LiveData;
import com.example.application.api.ApiService;
import com.example.application.api.RetrofitClient;
import com.example.application.db.GmailishDatabase;
import com.example.application.db.MailDao;
import com.example.application.models.MailEntity;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MailRepository {
    private final MailDao mailDao;
    private final ApiService api;
    private final Executor ioExecutor = Executors.newSingleThreadExecutor();

    public MailRepository(Application application) {
        GmailishDatabase db = GmailishDatabase.getInstance(application);
        mailDao = (MailDao) db.mailDao();
        api = RetrofitClient.getApiService();
    }

    /**
     * Triggers a network refresh and returns LiveData from the local cache.
     */
    public LiveData<List<MailEntity>> fetchInbox(String userEmail) {
        refreshFromNetwork(userEmail);
        return mailDao.loadInbox(userEmail);
    }

    private void refreshFromNetwork(String userEmail) {
        api.getInbox(userEmail).enqueue(new Callback<List<MailEntity>>() {
            @Override
            public void onResponse(Call<List<MailEntity>> call, Response<List<MailEntity>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ioExecutor.execute(() -> {
                        mailDao.clearInbox(userEmail);
                        mailDao.upsertAll(response.body());
                    });
                }
            }

            @Override
            public void onFailure(Call<List<MailEntity>> call, Throwable t) {
                // TODO: handle error (log or expose via another LiveData)
            }
        });
    }
}

