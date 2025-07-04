package com.example.application;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import com.example.application.ui.theme.PreferenceManager;

public class MailViewActivity extends AppCompatActivity {

    private ImageView backArrow;
    private TextView subjectText;
    private TextView labelText;
    private TextView senderText;
    private TextView bodyText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        if (PreferenceManager.isDarkMode(this)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mail_view);

        backArrow = findViewById(R.id.backArrow);
        subjectText = findViewById(R.id.subjectText);
        labelText = findViewById(R.id.labelText);
        senderText = findViewById(R.id.senderText);
        bodyText = findViewById(R.id.bodyText);

        String subject = getIntent().getStringExtra("subject");
        String label = getIntent().getStringExtra("label");
        String sender = getIntent().getStringExtra("sender");
        String body = getIntent().getStringExtra("body");

        subjectText.setText(subject);

        if (label != null && !label.isEmpty()) {
            labelText.setVisibility(View.VISIBLE);
            labelText.setText(label);
        } else {
            labelText.setVisibility(View.GONE);
        }

        senderText.setText("From: " + sender);
        bodyText.setText(body);

        backArrow.setOnClickListener(v -> finish());
    }
}
