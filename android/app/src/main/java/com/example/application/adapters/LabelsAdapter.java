package com.example.application.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.application.R;
import com.example.application.entities.Label;

import java.util.List;

public class LabelsAdapter extends RecyclerView.Adapter<LabelsAdapter.LabelViewHolder> {

    private List<Label> labels;
    private final OnLabelClickListener listener;
    private final Context context;
    private int selectedPosition = 0;

    public interface OnLabelClickListener {
        void onLabelLongClick(Label label);

        void onLabelClick(String labelName);
    }

    public LabelsAdapter(List<Label> labels, OnLabelClickListener listener, Context context) {
        this.labels = labels;
        this.listener = listener;
        this.context = context;
    }

    public List<Label> getLabels() {
        return labels;
    }


    @NonNull
    @Override
    public LabelViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.label_item, parent, false);
        return new LabelViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull LabelViewHolder holder, int position) {
        Label label = labels.get(position);
        holder.labelName.setText(label.getName());
        holder.labelIcon.setImageResource(R.drawable.ic_label);

        if (position == selectedPosition) {
            holder.itemView.setBackgroundColor(ContextCompat.getColor(context, R.color.highlight));
        } else {
            holder.itemView.setBackgroundColor(Color.TRANSPARENT);
        }

        holder.itemView.setOnClickListener(v -> {
            int previousPosition = selectedPosition;
            selectedPosition = holder.getAdapterPosition();
            notifyItemChanged(previousPosition);
            notifyItemChanged(selectedPosition);

            listener.onLabelClick(label.getName());
        });

        holder.itemView.setOnLongClickListener(v -> {
            listener.onLabelLongClick(label);
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return labels != null ? labels.size() : 0;
    }

    public void highlightLabel(String labelName) {
        for (int i = 0; i < labels.size(); i++) {
            if (labels.get(i).getName().equals(labelName)) {
                int previousPosition = selectedPosition;
                selectedPosition = i;
                notifyItemChanged(previousPosition);
                notifyItemChanged(selectedPosition);
                break;
            }
        }
    }


    @SuppressLint("NotifyDataSetChanged")
    public void setLabels(List<Label> newLabels) {
        this.labels = newLabels;
        notifyDataSetChanged();
    }

    static class LabelViewHolder extends RecyclerView.ViewHolder {
        TextView labelName;
        ImageView labelIcon;

        public LabelViewHolder(@NonNull View itemView) {
            super(itemView);
            labelName = itemView.findViewById(R.id.labelName);
            labelIcon = itemView.findViewById(R.id.labelIcon);
        }
    }
}
