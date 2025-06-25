package com.example.application.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.example.application.models.LabelEntity;
import java.util.List;

@Dao
public interface LabelDao {
    @Query("SELECT * FROM labels WHERE user = :userEmail")
    LiveData<List<LabelEntity>> loadLabels(String userEmail);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertAll(List<LabelEntity> labels);
}