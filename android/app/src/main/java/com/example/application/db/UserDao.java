package com.example.application.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;
import androidx.room.Delete;

import com.example.application.models.UserEntity;

import java.util.List;

@Dao
public interface UserDao {

    @Insert
    void insert(UserEntity user);

    @Update
    void update(UserEntity user);

    @Delete
    void delete(UserEntity user);

    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    LiveData<UserEntity> getUserByEmail(String email);

    @Query("SELECT * FROM users")
    List<UserEntity> getAllUsers();
}
