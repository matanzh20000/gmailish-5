
package com.example.application.models;

public class RegisterRequest {
    public String email;
    public String password;
    public String firstName;
    public String lastName;

    public RegisterRequest(String email, String password, String firstName, String lastName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
