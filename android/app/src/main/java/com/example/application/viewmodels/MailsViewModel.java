package com.example.application.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.application.entities.Mail;
import com.example.application.repositories.MailsRepository;

import java.util.List;

public class MailsViewModel extends AndroidViewModel {

    private final MailsRepository repository;
    private final LiveData<List<Mail>> allMails;

    public MailsViewModel(@NonNull Application application) {
        super(application);
        repository = new MailsRepository(application);
        allMails = repository.getAllMails();
    }

    public LiveData<List<Mail>> getAllMails() {
        return allMails;
    }

    public void addMail(Mail mail) {
        repository.addMail(mail);
    }

    public void updateMail(Mail mail) {
        repository.updateMail(mail);
    }

    public void deleteMail(Mail mail) {
        repository.deleteMail(mail);
    }
}
