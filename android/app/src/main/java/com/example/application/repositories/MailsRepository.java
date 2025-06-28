package com.example.application.repositories;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;

import com.example.application.api.MailsApi;
import com.example.application.db.AppDatabase;
import com.example.application.db.MailDao;
import com.example.application.entities.Mail;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MailsRepository {

    private final MailDao mailDao;
    private final LiveData<List<Mail>> allMails;
    private final MailsApi mailsApi;

    public MailsRepository(Application application) {
        AppDatabase database = AppDatabase.getInstance(application);
        mailDao = database.mailDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8080/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        mailsApi = retrofit.create(MailsApi.class);
        allMails = mailDao.getAllMails();
    }

    public LiveData<List<Mail>> getAllMails() {
        refreshMailsFromApi();
        return allMails;
    }

    private void refreshMailsFromApi() {
        mailsApi.getRecentMails("matan@gmailish.com").enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Executors.newSingleThreadExecutor().execute(() -> {
                        for (Mail mail : response.body()) {
                            mailDao.insert(mail);
                        }
                    });
                } else {
                    Log.e("MailsRepository", "Failed to fetch mails: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<Mail>> call, Throwable t) {
                Log.e("MailsRepository", "API failure", t);
            }
        });
    }

    public void addMail(Mail mail) {
        mailsApi.createMail(mail).enqueue(new Callback<Mail>() {
            @Override
            public void onResponse(Call<Mail> call, Response<Mail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertMail(response.body());
                }
            }

            @Override
            public void onFailure(Call<Mail> call, Throwable t) {
                Log.e("MailsRepository", "Failed to create mail", t);
            }
        });
    }

    public void updateMail(Mail mail) {
        mailsApi.updateMail(mail.getId(), mail).enqueue(new Callback<Mail>() {
            @Override
            public void onResponse(Call<Mail> call, Response<Mail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertMail(response.body());
                }
            }

            @Override
            public void onFailure(Call<Mail> call, Throwable t) {
                Log.e("MailsRepository", "Failed to update mail", t);
            }
        });
    }

    public void deleteMail(Mail mail) {
        mailsApi.deleteMail(mail.getId()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Executors.newSingleThreadExecutor().execute(() -> mailDao.delete(mail));
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("MailsRepository", "Failed to delete mail", t);
            }
        });
    }

    private void insertMail(Mail mail) {
        Executors.newSingleThreadExecutor().execute(() -> mailDao.insert(mail));
    }
}
