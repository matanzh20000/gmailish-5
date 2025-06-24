package com.example.application.viewmodels;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import com.example.application.models.MailEntity;
import com.example.application.repositories.MailRepository;
import java.util.List;

public class MailViewModel extends AndroidViewModel {
    private final MailRepository repo;
    private LiveData<List<MailEntity>> inbox;

    public MailViewModel(@NonNull Application application) {
        super(application);
        repo = new MailRepository(application);
    }

    /**
     * For your Activity/Fragment to call:
     * – returns LiveData<List<MailEntity>>
     * – triggers the initial network load under the hood
     */
    public LiveData<List<MailEntity>> fetchInbox(String userEmail) {
        if (inbox == null) {
            inbox = repo.fetchInbox(userEmail);
        }
        return inbox;
    }
}

