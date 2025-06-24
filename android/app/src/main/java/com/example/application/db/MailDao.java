package com.example.application.db;
import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.example.application.models.MailEntity;
import java.util.List;

@Dao
public interface MailDao {
    @Query("SELECT * FROM mails WHERE owner = :userEmail ORDER BY createdAt DESC")
    LiveData<List<MailEntity>> loadInbox(String userEmail);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertAll(List<MailEntity> mails);

    @Query("DELETE FROM mails WHERE owner = :userEmail")
    void clearInbox(String userEmail);
}