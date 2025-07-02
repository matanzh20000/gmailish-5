package com.example.application.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.application.R;
import com.example.application.entities.Mail;
import java.util.List;

public class MailsAdapter extends RecyclerView.Adapter<MailsAdapter.MailViewHolder> {

    private List<Mail> mails;
    private final OnMailClickListener listener;
    private final Context context;
    private int selectedPosition = RecyclerView.NO_POSITION;

    public interface OnMailClickListener {
        void onMailClick(Mail mail);
        void onMailLongClick(Mail mail);
    }

    public MailsAdapter(List<Mail> mails, OnMailClickListener listener, Context context) {
        this.mails = mails;
        this.listener = listener;
        this.context = context;
    }

    @NonNull
    @Override
    public MailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.mail_item, parent, false);
        return new MailViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MailViewHolder holder, int position) {
        Mail mail = mails.get(position);
        holder.subjectText.setText(mail.getSubject());
        holder.fromText.setText(mail.getFrom());
        holder.previewText.setText(mail.getBody());

        if (position == selectedPosition) {
            holder.itemView.setBackgroundColor(ContextCompat.getColor(context, R.color.highlight));
        } else {
            holder.itemView.setBackgroundColor(android.graphics.Color.TRANSPARENT);
        }

        // Load user image
        if (mail.getUserImage() != null && !mail.getUserImage().isEmpty()) {
            // Use Glide or Picasso for real image loading from URL
            Glide.with(context)
                    .load(mail.getUserImage())
                    .placeholder(R.drawable.ic_user_placeholder)
                    .circleCrop()
                    .into(holder.senderImage);
        } else {
            holder.senderImage.setImageResource(R.drawable.ic_user_placeholder);
        }

        holder.itemView.setOnClickListener(v -> listener.onMailClick(mail));

        holder.itemView.setOnLongClickListener(v -> {
            int previousPosition = selectedPosition;
            selectedPosition = holder.getAdapterPosition();

            if (previousPosition != RecyclerView.NO_POSITION) {
                notifyItemChanged(previousPosition);
            }
            notifyItemChanged(selectedPosition);

            listener.onMailLongClick(mail);
            return true;
        });

    }

    @Override
    public int getItemCount() {
        return mails != null ? mails.size() : 0;
    }

    public void setMails(List<Mail> newMails) {
        this.mails = newMails;
        notifyDataSetChanged();
    }

    public void clearSelection() {
        int previousPosition = selectedPosition;
        selectedPosition = RecyclerView.NO_POSITION;
        notifyItemChanged(previousPosition);
    }

    static class MailViewHolder extends RecyclerView.ViewHolder {

        TextView subjectText;
        TextView fromText;
        TextView previewText;
        ImageView senderImage;

        public MailViewHolder(@NonNull View itemView) {
            super(itemView);
            subjectText = itemView.findViewById(R.id.subjectText);
            fromText = itemView.findViewById(R.id.fromText);
            previewText = itemView.findViewById(R.id.previewText);
            senderImage = itemView.findViewById(R.id.senderImage);
        }
    }
}
