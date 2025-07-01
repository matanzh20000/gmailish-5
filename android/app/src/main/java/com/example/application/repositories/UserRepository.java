package com.example.application.repositories;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.application.api.SignInRequest;
import com.example.application.api.TokenResponse;
import com.example.application.api.UsersApi;
import com.example.application.db.AppDatabase;
import com.example.application.db.UserDao;
import com.example.application.entities.User;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserRepository {

    private final UserDao userDao;
    private final UsersApi userApi;
    private final ExecutorService executor;

    public UserRepository(Application application) {
        AppDatabase db = AppDatabase.getInstance(application);
        userDao = db.userDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8080/")  // Adjust to your server IP if needed
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        userApi = retrofit.create(UsersApi.class);
        executor = Executors.newSingleThreadExecutor();
    }

    public LiveData<String> signInWithApi(String email, String password) {
        MutableLiveData<String> result = new MutableLiveData<>();
        SignInRequest request = new SignInRequest(email, password);

        userApi.signIn(request).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<TokenResponse> call, @NonNull Response<TokenResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body().getToken());
                } else {
                    result.setValue(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<TokenResponse> call, @NonNull Throwable t) {
                result.setValue(null);
            }
        });

        return result;
    }



    public void createUser(User user) {
        Call<User> call = userApi.createUser(user);
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    User createdUser = response.body();
                    executor.execute(() -> userDao.insert(createdUser));
                } else {
                    Log.e("UserRepo", "Failed to create user: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("UserRepo", "Network error: " + t.getMessage());
            }
        });
    }

    // 🔍 Get user from local Room database
    public LiveData<User> getUserByEmail(String email) {
        return userDao.getUserByEmail(email);
    }

    // Optional: insert directly into Room (e.g., offline creation)
    public void insert(User user) {
        executor.execute(() -> userDao.insert(user));
    }

    // Optional: get all users
    public LiveData<java.util.List<User>> getAllUsers() {
        return userDao.getAllUsers();
    }

    // Optional: delete all users
    public void deleteAll() {
        executor.execute(userDao::deleteAllUsers);
    }
}