package com.example.application.db;
import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.example.application.models.UserEntity;

@Dao
public interface UserDao {
    @Query("SELECT * FROM users WHERE mail = :email")
    LiveData<UserEntity> loadUser(String email);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsert(UserEntity user);
}