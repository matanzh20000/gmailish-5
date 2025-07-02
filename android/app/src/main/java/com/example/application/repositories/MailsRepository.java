package com.example.application.repositories;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.application.api.MailsApi;
import com.example.application.db.AppDatabase;
import com.example.application.db.MailDao;
import com.example.application.entities.Mail;

import java.util.ArrayList;
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

    public LiveData<List<Mail>> getMailsByUser(String userEmail) {
        refreshMailsFromApi(userEmail);
        return mailDao.getMailsByUser(userEmail);
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
            public void onFailure(@NonNull Call<List<Mail>> call,@NonNull Throwable t) {
                Log.e("MailsRepository", "API failure", t);
            }
        });
    }

    public void refreshMailsFromApi(String userEmail) {
        String baseUrl = "http://10.0.2.2:8080/";

        mailsApi.getRecentMails(userEmail).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Executors.newSingleThreadExecutor().execute(() -> {
                        for (Mail mail : response.body()) {
                            if (mail.getUserImage() != null && !mail.getUserImage().isEmpty()) {
                                mail.setUserImage(baseUrl + mail.getUserImage());
                            } else {
                                mail.setUserImage(baseUrl + "uploads/default-avatar.png");
                            }
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
        mailsApi.createMail(mail).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Mail> call, @NonNull Response<Mail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertMail(response.body());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
                Log.e("MailsRepository", "Failed to create mail", t);
            }
        });
    }

    public void updateMail(Mail mail) {
        mailsApi.updateMail(mail.getId(), mail).enqueue(new Callback<Mail>() {
            @Override
            public void onResponse(@NonNull Call<Mail> call,@NonNull Response<Mail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    insertMail(response.body());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
                Log.e("MailsRepository", "Failed to update mail", t);
            }
        });
    }

    public void deleteMail(Mail mail) {
        mailsApi.deleteMail(mail.getId()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Executors.newSingleThreadExecutor().execute(() -> mailDao.delete(mail));
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("MailsRepository", "Failed to delete mail", t);
            }
        });
    }

    public LiveData<List<Mail>> searchMailsByQuery(String userEmail, String query) {
        MutableLiveData<List<Mail>> mailsLiveData = new MutableLiveData<>();

        mailsApi.searchMails(userEmail, query).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful()) {
                    mailsLiveData.setValue(response.body());
                } else {
                    mailsLiveData.setValue(new ArrayList<>());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                mailsLiveData.setValue(new ArrayList<>());
            }
        });

        return mailsLiveData;
    }



    private void insertMail(Mail mail) {
        Executors.newSingleThreadExecutor().execute(() -> mailDao.insert(mail));
    }
}
