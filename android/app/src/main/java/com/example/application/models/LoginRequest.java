
package com.example.application.models;

public class LoginRequest {
    public String mail;
    public String password;

    public LoginRequest(String mail, String password) {
        this.mail = mail;
        this.password = password;
    }
}
