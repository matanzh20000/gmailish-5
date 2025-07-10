package com.example.application.repositories;

import static com.example.application.utils.Utils.extractUrls;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.application.api.BlacklistCheckResponse;
import com.example.application.api.BlacklistRequest;
import com.example.application.api.MailsApi;
import com.example.application.db.AppDatabase;
import com.example.application.db.MailDao;
import com.example.application.entities.Mail;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        String baseUrl = "http://10.0.2.2:8080/";

        mailsApi.getRecentMails("matan@gmailish.com").enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Executors.newSingleThreadExecutor().execute(() -> {
                        for (Mail mail : response.body()) {
                            String imagePath = mail.getUserImage();
                            if (imagePath == null || imagePath.isEmpty()) {
                                mail.setUserImage(baseUrl + "uploads/default-avatar.png");
                            } else if (!imagePath.startsWith("http")) {
                                mail.setUserImage(baseUrl + imagePath);
                            }
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
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (Mail m : response.body()) {
                        insertMail(m);
                    }
                }
                refreshMailsFromApi(mail.getOwner());
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                Log.e("MailsRepository", "Failed to create mail", t);
            }
        });
    }


    public void addMailToSpam(Mail mail) {
        mail.setLabel(Collections.singletonList("Spam"));
        addMail(mail);
    }

    public void updateMail(Mail mail) {
        mailsApi.updateFullMail(mail.getId(), mail).enqueue(new Callback<Mail>() {
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

    public void checkAndAddToBlacklist(String url) {
        mailsApi.checkBlacklist(url).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<BlacklistCheckResponse> call, @NonNull Response<BlacklistCheckResponse> response) {
                if (response.isSuccessful() && response.body() != null && !response.body().isBlacklisted()) {
                    addToBlacklist(url);
                }
            }

            @Override
            public void onFailure(@NonNull Call<BlacklistCheckResponse> call, @NonNull Throwable t) { }
        });
    }

    public void addToBlacklist(String url) {
        mailsApi.addToBlacklist(new BlacklistRequest(url)).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) { }
            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) { }
        });
    }

    public void removeFromBlacklist(String url) {
        mailsApi.removeFromBlacklist(url).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call,@NonNull Response<Void> response) { }
            @Override
            public void onFailure(@NonNull Call<Void> call,@NonNull Throwable t) { }
        });
    }

    public void moveMailToLabel(Mail mail, String labelName) {
        Map<String, Object> updates = new HashMap<>();
        updates.put("label", Collections.singletonList(labelName));

        mailsApi.updateMailLabel(mail.getId(), updates).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    mail.setLabel(Collections.singletonList(labelName));
                    insertMail(mail);
                    refreshMailsFromApi(mail.getOwner());

                    List<String> urls = extractUrls(mail.getSubject() + "\n" + mail.getBody());

                    if ("Spam".equalsIgnoreCase(labelName)) {
                        for (String url : urls) {
                            checkAndAddToBlacklist(url);
                        }
                    } else {
                        for (String url : urls) {
                            removeFromBlacklist(url);
                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) { }
        });
    }

    public void sendMailWithBlacklistCheck(Mail mail) {
        List<String> urls = extractUrls(mail.getSubject() + "\n" + mail.getBody());

        if (urls.isEmpty()) {
            addMail(mail);
            return;
        }

        final int[] pending = { urls.size() };
        final boolean[] blacklistedFound = { false };

        for (String url : urls) {
            mailsApi.checkBlacklist(url).enqueue(new Callback<>() {
                @Override
                public void onResponse(Call<BlacklistCheckResponse> call, Response<BlacklistCheckResponse> response) {
                    if (response.isSuccessful() && response.body() != null && response.body().isBlacklisted()) {
                        blacklistedFound[0] = true;
                    }
                    checkComplete();
                }

                @Override
                public void onFailure(Call<BlacklistCheckResponse> call, Throwable t) {
                    checkComplete();
                }

                private void checkComplete() {
                    pending[0]--;
                    if (pending[0] == 0) {
                        if (blacklistedFound[0]) {
                            addMailToSpam(mail);
                        } else {
                            addMail(mail);
                        }
                    }
                }
            });
        }
    }

    private void insertMail(Mail mail) {
        Executors.newSingleThreadExecutor().execute(() -> mailDao.insert(mail));
    }
}
