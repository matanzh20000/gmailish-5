package com.example.application;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.application.viewmodels.AuthViewModel;

public class SignUpActivity extends AppCompatActivity {
    private EditText emailInput, passwordInput, firstNameInput, lastNameInput;
    private Button signUpButton;
    private AuthViewModel authViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        firstNameInput = findViewById(R.id.firstNameInput);
        lastNameInput = findViewById(R.id.lastNameInput);
        signUpButton = findViewById(R.id.signUpButton);

        authViewModel = new ViewModelProvider(this).get(AuthViewModel.class);

        signUpButton.setOnClickListener(v -> {
            String email = emailInput.getText().toString();
            String password = passwordInput.getText().toString();
            String fname = firstNameInput.getText().toString();
            String lname = lastNameInput.getText().toString();

            authViewModel.signUp(email, password, fname, lname).observe(this, success -> {
                if (success) {
                    Toast.makeText(this, "Account created", Toast.LENGTH_SHORT).show();
                    finish(); // Return to sign in
                } else {
                    Toast.makeText(this, "Sign up failed", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}