package com.example.application.db;
import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;
import com.example.application.MailDao;
import com.example.application.db.Converters;
import com.example.application.db.DateConverter;
import com.example.application.db.LabelDao;
import com.example.application.db.UserDao;
import com.example.application.models.MailEntity;
import com.example.application.models.UserEntity;
import com.example.application.models.LabelEntity;

@Database(entities = {MailEntity.class, UserEntity.class, LabelEntity.class}, version = 1, exportSchema = false)
@TypeConverters({Converters.class, DateConverter.class})
public abstract class GmailishDatabase extends RoomDatabase {
    public abstract MailDao mailDao();
    public abstract UserDao userDao();
    public abstract LabelDao labelDao();

    private static volatile GmailishDatabase INSTANCE;

    public static GmailishDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (GmailishDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    GmailishDatabase.class, "gmailish_db")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}