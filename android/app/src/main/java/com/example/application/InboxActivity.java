package com.example.application;

import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.application.adapters.MailAdapter;
import com.example.application.viewmodels.MailViewModel;

public class InboxActivity extends AppCompatActivity {
    private MailViewModel mailViewModel;
    private RecyclerView mailList;
    private MailAdapter mailAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        mailList = findViewById(R.id.mailRecyclerView);
        mailList.setLayoutManager(new LinearLayoutManager(this));
        mailAdapter = new MailAdapter();
        mailList.setAdapter(mailAdapter);

        String userEmail = getIntent().getStringExtra("email");
        if (userEmail == null) {
            Toast.makeText(this, "User email missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);
        mailViewModel.getMails(userEmail).observe(this, mails -> {
            if (mails != null) {
                mailAdapter.submitList(mails);
            } else {
                Toast.makeText(this, "Failed to load mails", Toast.LENGTH_SHORT).show();
            }
        });
    }
}