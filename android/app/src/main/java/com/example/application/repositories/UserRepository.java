package com.example.application.repositories;

import android.app.Application;
import android.content.ContentResolver;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.application.api.SignInRequest;
import com.example.application.api.SignUpResultCallback;
import com.example.application.api.TokenResponse;
import com.example.application.api.UsersApi;
import com.example.application.db.AppDatabase;
import com.example.application.db.UserDao;
import com.example.application.entities.User;
import com.google.gson.JsonObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
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

    public LiveData<TokenResponse> signInWithApi(String email, String password) {
        MutableLiveData<TokenResponse> result = new MutableLiveData<>();
        SignInRequest request = new SignInRequest(email, password);

        userApi.signIn(request).enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body());
                } else {
                    result.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                result.setValue(null);
            }
        });

        return result;
    }


    public LiveData<User> getUserByIdFromApi(String id) {
        MutableLiveData<User> userData = new MutableLiveData<>();
        userApi.getUserById(id).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    userData.setValue(response.body());
                } else {
                    userData.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                userData.setValue(null);
            }
        });
        return userData;
    }

    public void createUser(User user, Uri imageUri, ContentResolver contentResolver, SignUpResultCallback callback) {
        RequestBody firstName = RequestBody.create(MediaType.parse("text/plain"), user.getFirstName());
        RequestBody lastName = RequestBody.create(MediaType.parse("text/plain"), user.getLastName());
        RequestBody mail = RequestBody.create(MediaType.parse("text/plain"), user.getMail());
        RequestBody password = RequestBody.create(MediaType.parse("text/plain"), user.getPassword());
        RequestBody gender = RequestBody.create(MediaType.parse("text/plain"), user.getGender());
        RequestBody year = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(user.getBirthDate().getYear()));
        RequestBody month = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(user.getBirthDate().getMonth()));
        RequestBody day = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(user.getBirthDate().getDay()));

        MultipartBody.Part imagePart = null;

        if (imageUri != null) {
            try {
                String mimeType = contentResolver.getType(imageUri);
                InputStream inputStream = contentResolver.openInputStream(imageUri);
                byte[] bytes = readBytes(inputStream);

                String extension = (mimeType != null && mimeType.contains("/")) ? mimeType.split("/")[1] : "jpg";
                String fileName = "upload_" + System.currentTimeMillis() + "." + extension;

                RequestBody requestFile = RequestBody.create(
                        MediaType.parse(mimeType != null ? mimeType : "image/jpeg"),
                        bytes
                );
                imagePart = MultipartBody.Part.createFormData("avatar", fileName, requestFile);

            } catch (IOException e) {
                callback.onError("Failed to read image file: " + e.getMessage());
                return;
            }
        }

        Call<JsonObject> call = userApi.createUser(firstName, lastName, mail, password, gender, year, month, day, imagePart);

        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(@NonNull Call<JsonObject> call, @NonNull Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String savedFileName = response.body().get("filename").getAsString();
                    user.setImage("uploads/" + savedFileName);
                    insert(user);
                    callback.onSuccess();
                } else {
                    String message = "Unknown error";
                    try {
                        if (response.errorBody() != null) {
                            message = response.errorBody().string();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    callback.onError(message);
                }
            }

            @Override
            public void onFailure(@NonNull Call<JsonObject> call, @NonNull Throwable t) {
                callback.onError("Network error: " + t.getMessage());
            }
        });
    }





    // Get user from local Room database
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

    private byte[] readBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();
        int bufferSize = 1024;
        byte[] buffer = new byte[bufferSize];

        int len;
        while ((len = inputStream.read(buffer)) != -1) {
            byteBuffer.write(buffer, 0, len);
        }
        return byteBuffer.toByteArray();
    }

}