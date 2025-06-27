package com.example.application;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.content.ContextCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.application.adapters.LabelsAdapter;
import com.example.application.entities.Label;
import com.example.application.ui.theme.PreferenceManager;
import com.example.application.viewmodels.LabelsViewModel;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.List;

public class InboxActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private EditText searchBar;
    private LabelsAdapter labelsAdapter;
    private Label selectedLabel = null;

    @SuppressLint("RtlHardcoded")
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        if (PreferenceManager.isDarkMode(this)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ImageView menuIcon = findViewById(R.id.menuIcon);
        ImageView userIcon = findViewById(R.id.userIcon);
        searchBar = findViewById(R.id.searchBar);
        SwitchCompat darkModeSwitch = findViewById(R.id.themeSwitch);
        RecyclerView mailList = findViewById(R.id.mailRecyclerView);

        RecyclerView labelsRecyclerView = navigationView.findViewById(R.id.labelsRecyclerView);
        Button addLabelButton = navigationView.findViewById(R.id.addLabelButton);
        Button renameLabelButton = navigationView.findViewById(R.id.renameLabelButton);
        Button deleteLabelButton = navigationView.findViewById(R.id.deleteLabelButton);

        darkModeSwitch.setThumbDrawable(ContextCompat.getDrawable(this, R.drawable.thumb_selector));
        darkModeSwitch.setTrackDrawable(ContextCompat.getDrawable(this, R.drawable.track_selector));

        darkModeSwitch.setChecked(PreferenceManager.isDarkMode(this));

        darkModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            PreferenceManager.setDarkMode(this, isChecked);
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
            if (isChecked) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            }
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        });

        menuIcon.setOnClickListener(v -> drawerLayout.openDrawer(Gravity.LEFT));

        userIcon.setOnClickListener(v ->
                Toast.makeText(this, "User info clicked", Toast.LENGTH_SHORT).show()
        );

        searchBar.setOnEditorActionListener((v, actionId, event) -> {
            String query = searchBar.getText().toString().trim();
            Toast.makeText(this, "Search: " + query, Toast.LENGTH_SHORT).show();
            return true;
        });

        mailList.setLayoutManager(new LinearLayoutManager(this));

        String userEmail = getIntent().getStringExtra("email");
        if (userEmail != null) {
            Toast.makeText(this, "User email missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        LabelsViewModel labelsViewModel = new ViewModelProvider(this).get(LabelsViewModel.class);

        labelsRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        labelsAdapter = new LabelsAdapter(new ArrayList<>(), new LabelsAdapter.OnLabelClickListener() {
            @Override
            public void onLabelLongClick(Label label) {
                // Long click no longer needed
            }

            @Override
            public void onLabelClick(String labelName) {
                loadMailsForLabel(labelName);
                selectedLabel = findLabelByName(labelName);
            }
        }, this);

        labelsRecyclerView.setAdapter(labelsAdapter);

        labelsViewModel.getAllLabels().observe(this, labels -> labelsAdapter.setLabels(labels));

        addLabelButton.setOnClickListener(v -> {
            EditText input = new EditText(this);
            input.setHint("Label Name");

            new androidx.appcompat.app.AlertDialog.Builder(this)
                    .setTitle("Add New Label")
                    .setView(input)
                    .setPositiveButton("Add", (dialog, which) -> {
                        String labelName = input.getText().toString().trim();
                        if (!labelName.isEmpty()) {
                            Label newLabel = new Label(labelName, "icon_label", "global");
                            labelsViewModel.addLabel(newLabel);
                            new android.os.Handler().postDelayed(() -> {
                                selectedLabel = findLabelByName(labelName);
                                if (selectedLabel != null) {
                                    loadMailsForLabel(selectedLabel.getName());
                                    labelsAdapter.highlightLabel(selectedLabel.getName());
                                }
                            }, 300);
                            Toast.makeText(this, "Label added: " + labelName, Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(this, "Label name cannot be empty", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .setNegativeButton("Cancel", null)
                    .show();
        });

        renameLabelButton.setOnClickListener(v -> {
            if (selectedLabel != null) {
                    if (isDefaultLabel(selectedLabel)) {
                        Toast.makeText(this, "Cannot delete default label: " + selectedLabel.getName(), Toast.LENGTH_SHORT).show();
                        return;
                    }
                EditText input = new EditText(this);
                input.setHint("New Label Name");

                new androidx.appcompat.app.AlertDialog.Builder(this)
                        .setTitle("Rename Label")
                        .setView(input)
                        .setPositiveButton("Rename", (dialog, which) -> {
                            String newName = input.getText().toString().trim();
                            if (!newName.isEmpty()) {
                                selectedLabel.setName(newName);
                                labelsViewModel.updateLabel(selectedLabel);
                                new android.os.Handler().postDelayed(() -> {
                                    selectedLabel = findLabelByName(newName);
                                    if (selectedLabel != null) {
                                        loadMailsForLabel(selectedLabel.getName());
                                        labelsAdapter.highlightLabel(selectedLabel.getName());
                                    }
                                }, 300);
                            }
                        })
                        .setNegativeButton("Cancel", null)
                        .show();
            }
        });

        deleteLabelButton.setOnClickListener(v -> {
            if (selectedLabel != null) {
                if (isDefaultLabel(selectedLabel)) {
                    Toast.makeText(this, "Cannot delete default label: " + selectedLabel.getName(), Toast.LENGTH_SHORT).show();
                    return;
                }

                new androidx.appcompat.app.AlertDialog.Builder(this)
                        .setTitle("Delete Label")
                        .setMessage("Are you sure you want to delete " + selectedLabel.getName() + "?")
                        .setPositiveButton("Delete", (dialog, which) -> {
                            labelsViewModel.deleteLabel(selectedLabel);
                            selectedLabel = null;
                        })
                        .setNegativeButton("Cancel", null)
                        .show();
            }
        });
    }

    private void loadMailsForLabel(String labelName) {
        Toast.makeText(this, "Loading mails for: " + labelName, Toast.LENGTH_SHORT).show();
        // TODO: Add Retrofit logic to load mails by labelName
    }

    private boolean isDefaultLabel(Label label) {
        String name = label.getName().toLowerCase();
        return name.equals("inbox") || name.equals("sent") || name.equals("drafts") || name.equals("spam") || name.equals("snoozed") || name.equals("starred");
    }

    private Label findLabelByName(String labelName) {
        List<Label> labels = labelsAdapter.getLabels();
        for (Label label : labels) {
            if (label.getName().equals(labelName)) {
                return label;
            }
        }
        return null;
    }
}
