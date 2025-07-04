package com.example.application.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.application.entities.Mail;

import java.util.List;

@Dao
public interface MailDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Mail mail);

    @Update
    void update(Mail mail);

    @Delete
    void delete(Mail mail);

    @Query("SELECT * FROM mails ORDER BY createdAt DESC")
    LiveData<List<Mail>> getAllMails();

    @Query("SELECT * FROM mails WHERE owner = :userEmail")
    LiveData<List<Mail>> getMailsByUser(String userEmail);
}
