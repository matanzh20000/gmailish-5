package com.example.application;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.example.application.api.MailsApi;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ComposeMailActivity extends AppCompatActivity {

    private EditText toInput, subjectInput, bodyInput;
    private Button sendButton;
    private ImageView closeIcon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_compose_mail);

        toInput = findViewById(R.id.toInput);
        subjectInput = findViewById(R.id.subjectInput);
        bodyInput = findViewById(R.id.bodyInput);
        sendButton = findViewById(R.id.sendButton);
        closeIcon = findViewById(R.id.closeIcon);
        EditText ccInput = findViewById(R.id.ccInput);
        EditText bccInput = findViewById(R.id.bccInput);
        TextView ccBccToggle = findViewById(R.id.ccBccToggle);

        ccBccToggle.setOnClickListener(v -> {
            boolean show = ccInput.getVisibility() == View.GONE;
            ccInput.setVisibility(show ? View.VISIBLE : View.GONE);
            bccInput.setVisibility(show ? View.VISIBLE : View.GONE);
        });
        closeIcon.setOnClickListener(v -> finish());

        sendButton.setOnClickListener(v -> {
            String to = toInput.getText().toString().trim();
            String subject = subjectInput.getText().toString().trim();
            String body = bodyInput.getText().toString().trim();

            if (to.isEmpty() ||subject.isEmpty()||  body.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("http://10.0.2.2:8080/api/") // localhost for emulator
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            MailsApi mailApi = retrofit.create(MailsApi.class);            Toast.makeText(this, "Mail sent to: " + to, Toast.LENGTH_SHORT).show();
            finish();
        });
    }
}