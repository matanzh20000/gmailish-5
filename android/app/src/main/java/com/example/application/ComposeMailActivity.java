package com.example.application;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.lifecycle.ViewModelProvider;
import com.example.application.ui.theme.PreferenceManager;

import com.example.application.entities.Mail;
import com.example.application.viewmodels.MailsViewModel;

import java.util.ArrayList;
import java.util.List;

public class ComposeMailActivity extends AppCompatActivity {

    private EditText toInput, subjectInput, bodyInput, ccInput, bccInput;
    private Button sendButton;
    private ImageView closeIcon;
    private TextView ccBccToggle;

    private String userImage;
    private String userEmail;
    private MailsViewModel mailsViewModel;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        if (PreferenceManager.isDarkMode(this)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_compose_mail);

        toInput = findViewById(R.id.toInput);
        subjectInput = findViewById(R.id.subjectInput);
        bodyInput = findViewById(R.id.bodyInput);
        sendButton = findViewById(R.id.sendButton);
        closeIcon = findViewById(R.id.closeIcon);
        ccInput = findViewById(R.id.ccInput);
        bccInput = findViewById(R.id.bccInput);
        ccBccToggle = findViewById(R.id.ccBccToggle);
        userImage =  getIntent().getStringExtra("image");

        userEmail = getIntent().getStringExtra("email");
        if (userEmail == null) {
            Toast.makeText(this, "User email missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        mailsViewModel = new ViewModelProvider(this).get(MailsViewModel.class);



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
            String cc = ccInput.getText().toString().trim();
            String bcc = bccInput.getText().toString().trim();

            if (to.isEmpty() || subject.isEmpty() || body.isEmpty()) {
                Toast.makeText(this, "Please fill all required fields", Toast.LENGTH_SHORT).show();
                return;
            }

            Mail newMail = new Mail();
            newMail.setFrom(userEmail);
            newMail.setTo(List.of(to));
            newMail.setSubject(subject);
            newMail.setBody(body);
            newMail.setLabel(List.of("Sent"));
            newMail.setOwner(userEmail);
            String baseUrl = "http://10.0.2.2:8080/";
            if (userImage != null && !userImage.startsWith("http")) {
                newMail.setUserImage(baseUrl + userImage);
            } else {
                newMail.setUserImage(userImage);
            }


            if (!cc.isEmpty()) {
                List<String> ccList = new ArrayList<>();
                ccList.add(cc);
                newMail.setCopy(ccList);
            }

            if (!bcc.isEmpty()) {
                List<String> bccList = new ArrayList<>();
                bccList.add(bcc);
                newMail.setBlindCopy(bccList);
            }

            mailsViewModel.sendMailWithBlacklistCheck(newMail);

            Toast.makeText(this, "Mail sent to: " + to, Toast.LENGTH_SHORT).show();
            finish();
        });
    }
}

