package com.example.application;

import android.content.Intent;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.content.ContextCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

import com.example.application.adapters.LabelsAdapter;
import com.example.application.adapters.MailsAdapter;
import com.example.application.entities.Label;
import com.example.application.entities.Mail;
import com.example.application.ui.theme.PreferenceManager;
import com.example.application.viewmodels.LabelsViewModel;
import com.example.application.viewmodels.MailsViewModel;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.List;

public class InboxActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private EditText searchBar;
    private LabelsAdapter labelsAdapter;
    private MailsAdapter mailsAdapter;
    private MailsViewModel mailsViewModel;
    private Label selectedLabel = null;
    private LinearLayout topActionMenu;
    private ImageView backArrow;
    private ImageView moreOptions;
    private Mail selectedMail = null;
    private ImageView userIcon;
    private LiveData<List<Mail>> allUserMailsLiveData;
    private String userEmail;
    private String fullImageUrl;

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

        String imagePath = getIntent().getStringExtra("image");
        String baseUrl = "http://10.0.2.2:8080/";

        fullImageUrl = (imagePath != null && !imagePath.isEmpty()) ? baseUrl + imagePath : baseUrl + "uploads/default-avatar.png";

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.navigationView);
        ImageView menuIcon = findViewById(R.id.menuIcon);
        userIcon = findViewById(R.id.userIcon);

        Glide.with(this)
                .load(fullImageUrl)
                .placeholder(R.drawable.ic_user_placeholder)
                .circleCrop()
                .into(userIcon);

        searchBar = findViewById(R.id.searchBar);
        SwitchCompat darkModeSwitch = findViewById(R.id.themeSwitch);
        RecyclerView mailList = findViewById(R.id.mailRecyclerView);
        topActionMenu = findViewById(R.id.topActionMenu);
        backArrow = findViewById(R.id.backArrow);
        moreOptions = findViewById(R.id.moreOptions);

        topActionMenu.setVisibility(View.GONE);

        RecyclerView labelsRecyclerView = navigationView.findViewById(R.id.labelsRecyclerView);
        Button addLabelButton = navigationView.findViewById(R.id.addLabelButton);
        Button renameLabelButton = navigationView.findViewById(R.id.renameLabelButton);
        Button deleteLabelButton = navigationView.findViewById(R.id.deleteLabelButton);
        SwipeRefreshLayout swipeRefresh = findViewById(R.id.swipeRefresh);


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

        searchBar.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) { }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String query = s.toString().trim();
                if (!query.isEmpty()) {
                    mailsViewModel.searchMailsByQuery(userEmail, query).observe(InboxActivity.this, mails -> {
                        if (mails != null) {
                            String baseUrl = "http://10.0.2.2:8080/";
                            for (Mail mail : mails) {
                                if (mail.getUserImage() != null && !mail.getUserImage().isEmpty()) {
                                    mail.setUserImage(baseUrl + mail.getUserImage());
                                } else {
                                    mail.setUserImage(baseUrl + "uploads/default-avatar.png");
                                }
                            }
                            mailsAdapter.setMails(mails);
                        }
                    });
                } else {
                    loadMailsForLabel(selectedLabel != null ? selectedLabel.getName() : "Inbox");
                }
            }


            @Override
            public void afterTextChanged(android.text.Editable s) { }
        });


        userEmail = getIntent().getStringExtra("email");
        if (userEmail == null) {
            Toast.makeText(this, "User email missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        mailList.setLayoutManager(new LinearLayoutManager(this));

        userIcon.setOnClickListener(v -> {
            Intent intent = new Intent(InboxActivity.this, UserProfileActivity.class);
            intent.putExtra("image", imagePath);
            intent.putExtra("email", userEmail);
            startActivity(intent);
        });

        mailsViewModel = new ViewModelProvider(this).get(MailsViewModel.class);
        mailsAdapter = new MailsAdapter(new ArrayList<>(), new MailsAdapter.OnMailClickListener() {

            @Override
            public void onMailClick(Mail mail) {
                Intent intent = new Intent(InboxActivity.this, MailViewActivity.class);
                intent.putExtra("subject", mail.getSubject());
                intent.putExtra("label", mail.getLabel().get(0));
                intent.putExtra("sender", mail.getFrom());
                intent.putExtra("body", mail.getBody());
                startActivity(intent);
            }

            @Override
            public void onMailLongClick(Mail mail) {
                selectedMail = mail;
                topActionMenu.setVisibility(View.VISIBLE);
            }
        }, this);

// Back arrow logic:
        backArrow.setOnClickListener(v -> {
            mailsAdapter.clearSelection();
            selectedMail = null;
            topActionMenu.setVisibility(View.GONE);
        });

// More options menu:
        moreOptions.setOnClickListener(v -> {
            PopupMenu popup = new PopupMenu(this, v);
            popup.getMenuInflater().inflate(R.menu.mails_actions_menu, popup.getMenu());
            popup.setOnMenuItemClickListener(item -> {
                if (item.getItemId() == R.id.action_move) {
                    showLabelSelectionDialog();
                    return true;
                } else if (item.getItemId() == R.id.action_delete) {
                    deleteSelectedMail();
                    return true;
                }
                return false;
            });
            popup.show();
        });


        mailList.setAdapter(mailsAdapter);


        ExtendedFloatingActionButton composeFab = findViewById(R.id.composeFab);
        composeFab.setOnClickListener(v -> {
            Intent intent = new Intent(InboxActivity.this, ComposeMailActivity.class);
            intent.putExtra("email", userEmail);
            startActivity(intent);
        });


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

        labelsViewModel.getAllLabels().observe(this, labels -> {
            List<Label> userLabels = new ArrayList<>();

            for (Label label : labels) {
                if (label.getUser().equals(userEmail) || label.getUser().equals("global")) {
                    userLabels.add(label);
                }
            }

            labelsAdapter.setLabels(userLabels);

        });

        allUserMailsLiveData = mailsViewModel.getMailsByUser(userEmail);

        allUserMailsLiveData.observe(this, mails -> {
            if (selectedLabel != null) {
                loadMailsForLabel(selectedLabel.getName());
            } else {
                mailsAdapter.setMails(mails);
            }
            labelsAdapter.setMails(mails);
        });


        addLabelButton.setOnClickListener(v -> {
            EditText input = new EditText(this);
            input.setHint("Label Name");

            new androidx.appcompat.app.AlertDialog.Builder(this)
                    .setTitle("Add New Label")
                    .setView(input)
                    .setPositiveButton("Add", (dialog, which) -> {
                        String labelName = input.getText().toString().trim();
                        if (!labelName.isEmpty()) {
                            Label newLabel = new Label(labelName, "icon_label", userEmail);
                            labelsViewModel.addLabel(userEmail, newLabel);
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
                                    if (selectedLabel == null) {  // Only default to Inbox on first load
                                        selectedLabel = findLabelByName("Inbox");
                                        if (selectedLabel != null) {
                                            loadMailsForLabel(selectedLabel.getName());
                                            labelsAdapter.highlightLabel(selectedLabel.getName());
                                        }
                                    }
                                }, 500);
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

        swipeRefresh.setOnRefreshListener(() -> {
            mailsViewModel.refreshMails(userEmail);
            swipeRefresh.setRefreshing(false);

        });

        new android.os.Handler().postDelayed(() -> {
            selectedLabel = findLabelByName("Inbox");
            if (selectedLabel != null) {
                loadMailsForLabel(selectedLabel.getName());
                labelsAdapter.highlightLabel(selectedLabel.getName());
            }
        }, 200);

    }

    @Override
    protected void onResume() {
        super.onResume();

        Glide.with(this)
                .load(fullImageUrl)
                .placeholder(R.drawable.ic_user_placeholder)
                .circleCrop()
                .into(userIcon);
    }


    private void loadMailsForLabel(String labelName) {
        if (allUserMailsLiveData == null) return;

        List<Mail> filtered = new ArrayList<>();
        List<Mail> allMails = allUserMailsLiveData.getValue();

        if (allMails != null) {
            for (Mail mail : allMails) {
                if (mail.getLabel() != null && mail.getLabel().contains(labelName)) {
                    filtered.add(mail);
                }
            }
        }

        mailsAdapter.setMails(filtered);
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

    private void showLabelSelectionDialog() {
        if (selectedMail == null) return;

        List<Label> allLabels = labelsAdapter.getLabels();
        List<String> labelNames = new ArrayList<>();

        for (Label label : allLabels) {
            if (label.getUser().equals(userEmail) || label.getUser().equals("global")) {
                labelNames.add(label.getName());
            }
        }

        if (labelNames.isEmpty()) {
            Toast.makeText(this, "No labels available", Toast.LENGTH_SHORT).show();
            return;
        }

        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Move to Label")
                .setItems(labelNames.toArray(new String[0]), (dialog, which) -> {
                    String targetLabel = labelNames.get(which);
                    List<String> mailLabels = selectedMail.getLabel();
                    if (mailLabels != null && !mailLabels.contains(targetLabel)) {
                        mailLabels.clear();
                        mailLabels.add(targetLabel);
                        mailsViewModel.updateMail(selectedMail);
                        Toast.makeText(this, "Mail moved to " + targetLabel, Toast.LENGTH_SHORT).show();
                    }
                    clearMailSelection();
                })
                .setNegativeButton("Cancel", (dialog, which) -> clearMailSelection())
                .show();
    }

    private void searchMails(String query) {
        if (mailsViewModel == null || userEmail == null) return;

        mailsViewModel.searchMailsByQuery(userEmail, query).observe(this, mails -> {
            if (mails != null) {
                mailsAdapter.setMails(mails);
            }
        });
    }


    private void deleteSelectedMail() {
        if (selectedMail == null) return;

        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Delete Mail")
                .setMessage("Are you sure you want to delete this mail?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    mailsViewModel.deleteMail(selectedMail);
                    clearMailSelection();
                })
                .setNegativeButton("Cancel", (dialog, which) -> clearMailSelection())
                .show();
    }
    private void clearMailSelection() {
        mailsAdapter.clearSelection();
        selectedMail = null;
        topActionMenu.setVisibility(View.GONE);
    }
}
