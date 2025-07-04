package com.example.application;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.application.entities.User;
import com.example.application.entities.User.BirthDate;
import com.example.application.viewmodels.UserViewModel;

import java.io.IOException;
import java.io.InputStream;

public class SignUpActivity extends AppCompatActivity {

    private EditText firstNameInput, lastNameInput, emailInput, passwordInput;
    private Button signUpButton;
    private ImageView profileImageView;
    private Spinner genderSpinner;
    private TextView birthDateText;

    private static final int REQUEST_IMAGE_PICK = 1;
    private Uri selectedImageUri = null;

    private int birthYear = 2000, birthMonth = 1, birthDay = 1;

    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        // Bind Views
        firstNameInput = findViewById(R.id.firstNameInput);
        lastNameInput = findViewById(R.id.lastNameInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        signUpButton = findViewById(R.id.signUpButton);
        profileImageView = findViewById(R.id.profileImageView);
        genderSpinner = findViewById(R.id.genderSpinner);
        birthDateText = findViewById(R.id.birthDateText);

        // Image picker
        profileImageView.setOnClickListener(v -> openImagePicker());

        // Gender spinner
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_dropdown_item,
                new String[]{"Male", "Female", "Other"}
        );
        genderSpinner.setAdapter(adapter);

        // Birth date picker
        birthDateText.setOnClickListener(v -> {
            DatePickerDialog picker = new DatePickerDialog(this, (view, year, month, dayOfMonth) -> {
                birthYear = year;
                birthMonth = month + 1;
                birthDay = dayOfMonth;
                birthDateText.setText(birthDay + "/" + birthMonth + "/" + birthYear);
            }, birthYear, birthMonth - 1, birthDay);
            picker.show();
        });

        // ViewModel
        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        signUpButton.setOnClickListener(v -> handleSignUp());
    }

    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("image/*");
        startActivityForResult(intent, REQUEST_IMAGE_PICK);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            selectedImageUri = data.getData();
            profileImageView.setImageURI(selectedImageUri);
        }
    }

    private String encodeImageToBase64(Uri imageUri) {
        try {
            InputStream inputStream = getContentResolver().openInputStream(imageUri);
            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);
            inputStream.close();
            return Base64.encodeToString(bytes, Base64.NO_WRAP);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void handleSignUp() {
        String first = firstNameInput.getText().toString().trim();
        String last = lastNameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String gender = genderSpinner.getSelectedItem().toString();

        if (first.isEmpty() || last.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        // Build birthDate object
        BirthDate birthDate = new BirthDate(birthYear, birthMonth, birthDay);

        // Create new user object
        User newUser = new User();
        newUser.setId(java.util.UUID.randomUUID().toString());
        newUser.setFirstName(first);
        newUser.setLastName(last);
        newUser.setMail(email);
        newUser.setPassword(password);
        newUser.setBirthDate(birthDate);
        newUser.setGender(gender);

        if (selectedImageUri != null) {
            String base64Image = encodeImageToBase64(selectedImageUri);
            newUser.setImage(base64Image);
        }

        userViewModel.createUser(newUser);
        Toast.makeText(this, "Sign up successful!", Toast.LENGTH_SHORT).show();

        finish();
    }
}