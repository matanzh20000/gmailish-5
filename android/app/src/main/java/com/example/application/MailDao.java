// com.example.application.db.MailDao.java
package com.example.application;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.example.application.models.MailEntity;

import java.util.List;

@Dao
public interface MailDao {
    @Query("SELECT * FROM mails")
    LiveData<List<MailEntity>> getAllMails();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<MailEntity> mails);

    @Query("DELETE FROM mails")
    void clearAll();
}
