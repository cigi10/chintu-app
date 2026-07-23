"use client";
import GoalForm from "./GoalForm";

export default function GoalCard({ goal, isEditing, onToggleEdit, onSave, onDelete, onCancel }) {
  return (
    <div className="goals__item">
      <button className="goals__card" onClick={onToggleEdit}>
        <span className="goals__card-dot" style={{ backgroundColor: goal.color }} />
        <span className="goals__card-subject">{goal.subject}</span>
        <span className="goals__card-meta">
          {goal.repeat?.type === "weekly" ? ((goal.repeat.days || []).join(", ") || "Weekly") : goal.repeat?.type}
          {" · "}{goal.durationMinutes}m
        </span>
      </button>

      {isEditing && (
        <div className="goals__form-card goals__form-card--inline">
          <GoalForm existing={goal} onSave={onSave} onDelete={onDelete} onCancel={onCancel} />
        </div>
      )}
    </div>
  );
}