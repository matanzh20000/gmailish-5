package com.example.application.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.OnConflictStrategy;

import com.example.application.entities.User;

import java.util.List;

@Dao
public interface UserDao {

    // Insert a user (replace if conflict)
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(User user);

    // Get user by email (for login check)
    @Query("SELECT * FROM users WHERE mail = :email LIMIT 1")
    LiveData<User> getUserByEmail(String email);

    // (Optional) Get all users
    @Query("SELECT * FROM users")
    LiveData<List<User>> getAllUsers();

    // (Optional) Delete all users (for reset)
    @Query("DELETE FROM users")
    void deleteAllUsers();
}