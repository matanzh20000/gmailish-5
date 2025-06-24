package com.example.application.repositories;
import android.app.Application;
import androidx.lifecycle.LiveData;
import com.example.application.api.ApiService;
import com.example.application.api.RetrofitClient;
import com.example.application.db.GmailishDatabase;
import com.example.application.db.UserDao;
import com.example.application.models.UserEntity;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {
    private final UserDao userDao;
    private final ApiService api;
    private final Executor ioExecutor = Executors.newSingleThreadExecutor();

    public UserRepository(Application application) {
        GmailishDatabase db = GmailishDatabase.getInstance(application);
        userDao = db.userDao();
        api = RetrofitClient.getApiService();
    }

    public LiveData<UserEntity> getUser(String email) {
        refreshFromNetwork(email);
        return userDao.loadUser(email);
    }

    private void refreshFromNetwork(String email) {
        api.getUser(email).enqueue(new Callback<UserEntity>() {
            @Override
            public void onResponse(Call<UserEntity> call, Response<UserEntity> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ioExecutor.execute(() -> userDao.upsert(response.body()));
                }
            }

            @Override
            public void onFailure(Call<UserEntity> call, Throwable t) {
                // handle error
            }
        });
    }
}