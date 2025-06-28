package com.example.application.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;
import androidx.room.Delete;

import com.example.application.entities.Label;

import java.util.List;

@Dao
public interface LabelDao {

    @Insert
    void insert(Label label);

    @Update
    void update(Label label);

    @Delete
    void delete(Label label);

    @Query("SELECT * FROM labels ORDER BY CASE WHEN name = 'Inbox' THEN 0 ELSE 1 END, name ASC")
    LiveData<List<Label>> getAllLabels();

    @Query("SELECT * FROM labels")
    List<Label> getAllLabelsList();

}
