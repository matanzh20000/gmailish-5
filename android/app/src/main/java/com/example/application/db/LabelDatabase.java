package com.example.application.db;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import com.example.application.entities.Label;

@Database(entities = {Label.class}, version = 3)
public abstract class LabelDatabase extends RoomDatabase {

    private static LabelDatabase instance;

    public abstract LabelDao labelDao();

    public static synchronized LabelDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(),
                            LabelDatabase.class, "label_database")
                    .fallbackToDestructiveMigration()
                    .build();
        }
        return instance;
    }
}
