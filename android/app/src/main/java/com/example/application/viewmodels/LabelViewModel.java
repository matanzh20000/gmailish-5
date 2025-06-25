package com.example.application.viewmodels;
import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import com.example.application.models.LabelEntity;
import com.example.application.repositories.LabelRepository;
import java.util.List;

public class LabelViewModel extends AndroidViewModel {
    private final LabelRepository repo;
    private LiveData<List<LabelEntity>> labels;

    public LabelViewModel(@NonNull Application application) {
        super(application);
        repo = new LabelRepository(application);
    }

    /**
     * Returns LiveData list of labels/folders for the given user.
     * Triggers a network fetch + local cache refresh on first call.
     */
    public LiveData<List<LabelEntity>> getLabels(String userEmail) {
        if (labels == null) {
            labels = repo.getLabels(userEmail);
        }
        return labels;
    }
}
