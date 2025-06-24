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
    private MailAdapter adapter;
    private MailViewModel vm;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        // 1) RecyclerView + Adapter setup
        RecyclerView rv = findViewById(R.id.mailRecyclerView);
        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MailAdapter();
        rv.setAdapter(adapter);

        // 2) ViewModel + LiveData observer
        vm = new ViewModelProvider(this).get(MailViewModel.class);
        String userEmail = getSharedPreferences("prefs", MODE_PRIVATE)
                .getString("user_email", "");
        vm.fetchInbox(userEmail).observe(this, mails -> {
            adapter.submitList(mails);
        });
    }
}