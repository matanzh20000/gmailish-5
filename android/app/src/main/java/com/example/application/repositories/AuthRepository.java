
package com.example.application.repositories;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.application.api.ApiService;
import com.example.application.api.RetrofitClient;
import com.example.application.models.AuthResponse;
import com.example.application.models.LoginRequest;
import com.example.application.models.RegisterRequest;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthRepository {
    private final ApiService api = RetrofitClient.getClient().create(ApiService.class);

    public LiveData<Boolean> signIn(String mail, String password) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        api.login(new LoginRequest(mail, password)).enqueue(new Callback<AuthResponse>() {
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> res) {
                if (!res.isSuccessful()) {
                    Log.e("SignUp", "Error code: " + res.code() + ", message: " + res.message());
                }
                result.setValue(res.isSuccessful());
            }

            public void onFailure(Call<AuthResponse> call, Throwable t) {
                result.setValue(false);
            }
        });
        return result;
    }

    public LiveData<Boolean> signUp(String mail, String password, String fname, String lname) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        api.register(new RegisterRequest(mail, password, fname, lname)).enqueue(new Callback<Void>() {
            public void onResponse(Call<Void> call, Response<Void> res) {
                result.setValue(res.isSuccessful());
            }


            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("SignUp", "Failure: " + t.getMessage());
                result.setValue(false);
            }
        });
        return result;
    }
}
