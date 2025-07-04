package com.example.application.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.application.entities.Label;
import com.example.application.repositories.LabelsRepository;

import java.util.List;

public class LabelsViewModel extends AndroidViewModel {

    private final LabelsRepository repository;
    private final LiveData<List<Label>> allLabels;

    public LabelsViewModel(@NonNull Application application) {
        super(application);
        repository = new LabelsRepository(application);
        allLabels = repository.getAllLabels();
    }

    public LiveData<List<Label>> getAllLabels() {
        return allLabels;
    }

    public void addLabel(String userEmail, Label label) {
        repository.addLabel(userEmail, label);
    }


    public void updateLabel(Label label) {
        repository.updateLabel(label);
    }

    public void deleteLabel(Label label) {
        repository.deleteLabel(label);
    }

    public void refreshLabels() {
        repository.refreshLabelsFromApi();
    }
}
