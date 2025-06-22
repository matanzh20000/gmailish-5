
package com.example.application.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import java.util.List;
import com.example.application.models.Mail;

import com.example.application.repositories.MailRepository;

public class MailViewModel extends ViewModel {
    private final MailRepository repo = new MailRepository();

    public LiveData<List<Mail>> getMails(String email) {
        return repo.fetchInbox(email);
    }
}
