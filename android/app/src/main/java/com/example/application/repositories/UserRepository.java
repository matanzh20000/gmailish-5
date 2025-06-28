package com.example.application.repositories;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;

import com.example.application.api.UsersApi;
import com.example.application.db.GmailishDatabase;
import com.example.application.db.UserDao;
import com.example.application.models.UserEntity;

import java.util.List;
import java.util.concurrent.Executors;

import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UsersRepository {

    private final UserDao userDao;
    private final UsersApi usersApi;

    public UsersRepository(Application application) {
        GmailishDatabase db = GmailishDatabase.getInstance(application);
        userDao = db.userDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8080/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        usersApi = retrofit.create(UsersApi.class);
    }

    public LiveData<UserEntity> getUserByEmail(String email) {
        refreshUserFromApi(email);
        return userDao.getUserByEmail(email);
    }

    private void refreshUserFromApi(String userId) {
        usersApi.getUserById(userId).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<UserEntity> call, @NonNull Response<UserEntity> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Executors.newSingleThreadExecutor().execute(() -> userDao.insert(response.body()));
                }
            }

            @Override
            public void onFailure(@NonNull Call<UserEntity> call, @NonNull Throwable t) {
                Log.e("UsersRepository", "Failed to fetch user", t);
            }
        });
    }

    public void createUser(MultipartBody.Part avatar, String name, String mail, String password) {
        usersApi.createUser(avatar, name, mail, password).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<UserEntity> call, @NonNull Response<UserEntity> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Executors.newSingleThreadExecutor().execute(() -> userDao.insert(response.body()));
                }
            }

            @Override
            public void onFailure(@NonNull Call<UserEntity> call, @NonNull Throwable t) {
                Log.e("UsersRepository", "Failed to create user", t);
            }
        });
    }
}
