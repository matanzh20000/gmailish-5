
package com.example.application.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import com.example.application.repositories.AuthRepository;

public class AuthViewModel extends ViewModel {
    private final AuthRepository repo = new AuthRepository();

    public LiveData<Boolean> signIn(String email, String pass) {
        return repo.signIn(email, pass);
    }

    public LiveData<Boolean> signUp(String email, String pass, String fname, String lname) {
        return repo.signUp(email, pass, fname, lname);
    }
}
