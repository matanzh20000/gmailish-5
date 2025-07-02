package com.example.application;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.application.R;
import com.example.application.entities.User;
import com.example.application.viewmodels.UserViewModel;

public class SignInActivity extends AppCompatActivity {

    private EditText emailInput, passwordInput;
    private Button signInButton;
    private TextView goToSignUp;

    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        // Bind Views
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        signInButton = findViewById(R.id.signInButton);
        goToSignUp = findViewById(R.id.goToSignUp);

        // Init ViewModel
        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        // Sign In button click
        signInButton.setOnClickListener(v -> handleSignIn());

        // Go to Sign Up screen
        goToSignUp.setOnClickListener(v -> {
            Intent intent = new Intent(SignInActivity.this, SignUpActivity.class);
            startActivity(intent);
        });
    }

    private void handleSignIn() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
            return;
        }

        userViewModel.signInWithApi(email, password).observe(this, tokenResponse -> {
            if (tokenResponse != null && tokenResponse.getToken() != null) {

                // You only have email locally, no image from backend
                userViewModel.getUserByEmail(email).observe(this, user -> {
                    if (user != null) {
                        Intent intent = new Intent(this, InboxActivity.class);
                        intent.putExtra("email", email);
                        intent.putExtra("image", user.getImage());  // Fetched from Room
                        startActivity(intent);
                        finish();
                    } else {
                        Intent intent = new Intent(this, InboxActivity.class);
                        intent.putExtra("email", email);
                        intent.putExtra("image", "uploads/default-avatar.png");  // Fallback
                        startActivity(intent);
                        finish();
                    }
                });
            } else {
                Toast.makeText(this, "Invalid email or password", Toast.LENGTH_SHORT).show();
            }
        });

    }

}