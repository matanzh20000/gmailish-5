
package com.example.application.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.application.models.Mail;

import java.util.ArrayList;
import java.util.List;

public class MailAdapter extends RecyclerView.Adapter<MailAdapter.MailViewHolder> {
    private List<Mail> mailList = new ArrayList<>();

    public void submitList(List<Mail> mails) {
        mailList = mails;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(android.R.layout.simple_list_item_2, parent, false);
        return new MailViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull MailViewHolder holder, int position) {
        Mail mail = mailList.get(position);
        holder.subject.setText(mail.subject);
        holder.preview.setText(mail.body);
    }

    @Override
    public int getItemCount() {
        return mailList.size();
    }

    static class MailViewHolder extends RecyclerView.ViewHolder {
        TextView subject, preview;

        public MailViewHolder(@NonNull View itemView) {
            super(itemView);
            subject = itemView.findViewById(android.R.id.text1);
            preview = itemView.findViewById(android.R.id.text2);
        }
    }
}
