
package com.example.application.models;

public class RegisterRequest {
    public String mail;
    public String password;
    public String firstName;
    public String lastName;

    public RegisterRequest(String mail, String password, String firstName, String lastName) {
        this.mail = mail;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
