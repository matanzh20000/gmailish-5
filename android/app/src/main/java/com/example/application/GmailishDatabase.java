// com.example.application.db.GmailishDatabase.java
package com.example.application;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.example.application.models.MailEntity;

@Database(entities = { MailEntity.class }, version = 1, exportSchema = false)
public abstract class GmailishDatabase extends RoomDatabase {
    public abstract MailDao mailDao();

    private static volatile GmailishDatabase INSTANCE;
    public static GmailishDatabase getInstance(Context ctx) {
        if (INSTANCE == null) {
            synchronized(GmailishDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(ctx.getApplicationContext(),
                                    GmailishDatabase.class, "gmailish_db")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}

