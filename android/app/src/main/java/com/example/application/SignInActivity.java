package com.example.application;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.application.viewmodels.AuthViewModel;

public class SignInActivity extends AppCompatActivity {
    private EditText emailInput, passwordInput;
    private Button signInButton, goToSignUp;
    private AuthViewModel authViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        signInButton = findViewById(R.id.signInButton);
        goToSignUp = findViewById(R.id.goToSignUp);

        authViewModel = new ViewModelProvider(this).get(AuthViewModel.class);

        signInButton.setOnClickListener(v -> {
            String email = emailInput.getText().toString();
            String password = passwordInput.getText().toString();

            authViewModel.signIn(email, password).observe(this, success -> {
                if (success) {
                    Intent intent = new Intent(SignInActivity.this, InboxActivity.class);
                    intent.putExtra("email", email);
                    startActivity(intent);
                } else {
                    Toast.makeText(this, "Login failed", Toast.LENGTH_SHORT).show();
                }
            });
        });

        goToSignUp.setOnClickListener(v -> {
            startActivity(new Intent(SignInActivity.this, SignUpActivity.class));
        });
    }
}