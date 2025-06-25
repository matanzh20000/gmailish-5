package com.example.application.viewmodels;
import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import com.example.application.models.UserEntity;
import com.example.application.repositories.UserRepository;

public class UserViewModel extends AndroidViewModel {
    private final UserRepository repo;
    private LiveData<UserEntity> user;

    public UserViewModel(@NonNull Application application) {
        super(application);
        repo = new UserRepository(application);
    }

    /**
     * Returns LiveData for the given user email.
     * Triggers a network fetch + local cache refresh on first call.
     */
    public LiveData<UserEntity> getUser(String email) {
        if (user == null) {
            user = repo.getUser(email);
        }
        return user;
    }
}