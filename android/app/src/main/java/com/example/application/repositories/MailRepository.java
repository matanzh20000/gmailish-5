
package com.example.application.repositories;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.util.List;
import com.example.application.api.ApiService;
import com.example.application.api.RetrofitClient;
import com.example.application.models.Mail;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MailRepository {
    private final ApiService api = RetrofitClient.getClient().create(ApiService.class);

    public LiveData<List<Mail>> fetchInbox(String userMail) {
        MutableLiveData<List<Mail>> data = new MutableLiveData<>();
        api.getInbox(userMail).enqueue(new Callback<List<Mail>>() {
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> res) {
                data.setValue(res.body());
            }

            public void onFailure(Call<List<Mail>> call, Throwable t) {
                data.setValue(null);
            }
        });
        return data;
    }
}
