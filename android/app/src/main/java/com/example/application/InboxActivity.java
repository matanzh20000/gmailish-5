package com.example.application;

import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.content.ContextCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.application.adapters.MailAdapter;
import com.example.application.ui.theme.PreferenceManager;
import com.example.application.viewmodels.MailViewModel;
import com.google.android.material.navigation.NavigationView;

public class InboxActivity extends AppCompatActivity {

    private MailViewModel mailViewModel;
    private RecyclerView mailList;
    private MailAdapter mailAdapter;


    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private ImageView menuIcon, userIcon;
    private EditText searchBar;
    private SwitchCompat darkModeSwitch;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        // Apply theme before view inflation
        if (PreferenceManager.isDarkMode(this)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        // Find views
        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.navigationView);
        menuIcon = findViewById(R.id.menuIcon);
        userIcon = findViewById(R.id.userIcon);
        searchBar = findViewById(R.id.searchBar);
        darkModeSwitch = findViewById(R.id.themeSwitch);
        mailList = findViewById(R.id.mailRecyclerView);

        // Apply custom thumb and track to SwitchCompat
        darkModeSwitch.setThumbDrawable(ContextCompat.getDrawable(this, R.drawable.thumb_selector));
        darkModeSwitch.setTrackDrawable(ContextCompat.getDrawable(this, R.drawable.track_selector));

        // Sync switch state with preference
        darkModeSwitch.setChecked(PreferenceManager.isDarkMode(this));

        darkModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            PreferenceManager.setDarkMode(this, isChecked);

            // Optional smooth fade
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

            if (isChecked) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            }

            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        });

        // Handle menu icon to open drawer
        menuIcon.setOnClickListener(v -> drawerLayout.openDrawer(Gravity.LEFT));

        // Handle user icon click (example Toast)
        userIcon.setOnClickListener(v ->
                Toast.makeText(this, "User info clicked", Toast.LENGTH_SHORT).show()
        );

        // Search bar logic placeholder
        searchBar.setOnEditorActionListener((v, actionId, event) -> {
            String query = searchBar.getText().toString().trim();
            Toast.makeText(this, "Search: " + query, Toast.LENGTH_SHORT).show();
            return true;
        });

        // Setup RecyclerView
        mailList.setLayoutManager(new LinearLayoutManager(this));
        mailAdapter = new MailAdapter();
        mailList.setAdapter(mailAdapter);

        // Get user email from intent
        String userEmail = getIntent().getStringExtra("email");
        if (userEmail != null) {
            Toast.makeText(this, "User email missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Load mails
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
