package com.example.application.viewmodels;

import android.app.Application;
import android.content.ContentResolver;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.application.api.SignUpResultCallback;
import com.example.application.api.TokenResponse;
import com.example.application.entities.User;
import com.example.application.repositories.UserRepository;

import java.util.List;

public class UserViewModel extends AndroidViewModel {

    private final UserRepository repository;

    public UserViewModel(@NonNull Application application) {
        super(application);
        repository = new UserRepository(application);
    }

    public void createUser(User user, Uri imageUri, ContentResolver contentResolver) {
        repository.createUser(user, imageUri, contentResolver, new SignUpResultCallback() {
            @Override
            public void onSuccess() {
                signUpResult.postValue("success");
            }

            @Override
            public void onError(String message) {
                signUpResult.postValue(message);
            }
        });
    }



    private final MutableLiveData<String> signUpResult = new MutableLiveData<>();
    public LiveData<String> getSignUpResult() {
        return signUpResult;
    }


    // Login: get user by email from local DB
    public LiveData<User> getUserByEmail(String email) {
        return repository.getUserByEmail(email);
    }

    public LiveData<User> getUserByIdFromApi(String id) {
        return repository.getUserByIdFromApi(id);
    }


    // 📥 Optional local insert (if needed)
    public void insert(User user) {
        repository.insert(user);
    }
    public LiveData<TokenResponse> signInWithApi(String email, String password) {
        return repository.signInWithApi(email, password);
    }


}