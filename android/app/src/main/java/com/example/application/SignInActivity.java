package com.example.application;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.content.ContextCompat;


import com.example.application.R;
import com.example.application.entities.User;

import com.example.application.ui.theme.PreferenceManager;
import com.example.application.viewmodels.UserViewModel;

public class SignInActivity extends AppCompatActivity {


    private EditText emailInput, passwordInput;
    private Button signInButton;
    private TextView goToSignUp;

    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        if (PreferenceManager.isDarkMode(this)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);
        SwitchCompat darkModeSwitch = findViewById(R.id.themeSwitch);

        darkModeSwitch.setThumbDrawable(ContextCompat.getDrawable(this, R.drawable.thumb_selector));
        darkModeSwitch.setTrackDrawable(ContextCompat.getDrawable(this, R.drawable.track_selector));

        darkModeSwitch.setChecked(PreferenceManager.isDarkMode(this));

        SwitchCompat darkModeSwitch = findViewById(R.id.themeSwitch);
        darkModeSwitch.setThumbDrawable(ContextCompat.getDrawable(this, R.drawable.thumb_selector));
        darkModeSwitch.setTrackDrawable(ContextCompat.getDrawable(this, R.drawable.track_selector));
        darkModeSwitch.setChecked(PreferenceManager.isDarkMode(this));
        darkModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            PreferenceManager.setDarkMode(this, isChecked);
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
            AppCompatDelegate.setDefaultNightMode(
                    isChecked ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO
            );
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        });

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
                // Fetch only from Room
                userViewModel.getUserByEmail(email).observe(this, user -> {
                    String imagePath;
                    if (user != null && user.getImage() != null && !user.getImage().isEmpty()) {
                        imagePath = user.getImage();
                    } else {
                        imagePath = "uploads/default-avatar.png";
                    }

                    Log.d("SignIn", "Using image path: " + imagePath);

                    Intent intent = new Intent(this, InboxActivity.class);
                    intent.putExtra("email", email);
                    intent.putExtra("image", imagePath);
                    startActivity(intent);
                    finish();
                });
            } else {
                Toast.makeText(this, "Invalid email or password", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
