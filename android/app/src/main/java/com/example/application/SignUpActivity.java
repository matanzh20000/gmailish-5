package com.example.application;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.application.R;
import com.example.application.entities.User;
import com.example.application.entities.User.BirthDate;
import com.example.application.viewmodels.UserViewModel;

public class SignUpActivity extends AppCompatActivity {

    private EditText firstNameInput, lastNameInput, emailInput, passwordInput;
    private Button signUpButton;

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

        // Init ViewModel
        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        // Button click
        signUpButton.setOnClickListener(v -> handleSignUp());
    }

    private void handleSignUp() {
        String first = firstNameInput.getText().toString().trim();
        String last = lastNameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (first.isEmpty() || last.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        // Dummy birthDate (you can create a DatePicker later)
        BirthDate birthDate = new BirthDate(2000, 1, 1);

        // Create new user object
        User newUser = new User();
        newUser.setId(java.util.UUID.randomUUID().toString()); // temporary _id
        newUser.setFirstName(first);
        newUser.setLastName(last);
        newUser.setMail(email);
        newUser.setPassword(password);
        newUser.setBirthDate(birthDate);
        newUser.setGender("Other"); // You can customize later

        // Send to ViewModel
        userViewModel.createUser(newUser);

        Toast.makeText(this, "Sign up successful!", Toast.LENGTH_SHORT).show();

        finish(); // Go back to SignInActivity
    }
}