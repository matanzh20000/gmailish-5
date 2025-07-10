package com.example.application;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.example.application.ui.theme.PreferenceManager;

public class UserProfileActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        if (PreferenceManager.isDarkMode(this)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);

        ImageView userImageLarge = findViewById(R.id.userImageLarge);
        TextView userEmail = findViewById(R.id.userEmail);
        Button signOutButton = findViewById(R.id.signOutButton);

        String imagePath = getIntent().getStringExtra("image");
        Log.d("UserProfile", "Using image path: " + imagePath);
        String email = getIntent().getStringExtra("email");
        String baseUrl = "http://10.0.2.2:8080/";
        String fullImageUrl;
        if (imagePath != null && !imagePath.isEmpty()) {
            if (imagePath.startsWith("http")) {
                fullImageUrl = imagePath;
            } else {
                fullImageUrl = baseUrl + imagePath;
            }
        } else {
            fullImageUrl = baseUrl + "uploads/default-avatar.png";
        }

        Glide.with(this)
                .load(fullImageUrl)
                .placeholder(R.drawable.ic_user_placeholder)
                .circleCrop()
                .skipMemoryCache(true)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .into(userImageLarge);


        userEmail.setText(email);

        signOutButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, SignInActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });
    }
}
