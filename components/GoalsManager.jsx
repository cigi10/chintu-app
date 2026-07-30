"use client";
import "@/styles/goals.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";
import { loadGoals, saveGoals, getGoalsForWeek, hydrateGoals } from "@/lib/goals";
import { setSubjectColor } from "@/lib/subjectColors";
import { weeklyMinutesFor, fmtWeeklyMinutes, moodFromGoalCount } from "@/lib/goalHelpers";
import GoalForm from "./GoalForm";
import GoalCard from "./GoalCard";
import GoalStatsRow from "./GoalStatsRow";
import WeekGlance from "./WeekGlance";

export default function GoalsManager() {
  const [goals, setGoals]           = useState([]);
  const [addingNew, setAddingNew]   = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [goalsByDay, setGoalsByDay] = useState({});

  useEffect(() => {
    hydrateGoals().then(() => {
      setGoals(loadGoals());
      setGoalsByDay(getGoalsForWeek());
    });
  }, []);

  function persist(list) {
    setGoals(list);
    saveGoals(list);
    setGoalsByDay(getGoalsForWeek());
  }

  function handleSave(goal) {
    const exists = goals.some(g => g.id === goal.id);
    const updated = exists ? goals.map(g => g.id === goal.id ? goal : g) : [...goals, goal];
    persist(updated);
    setSubjectColor(goal.subject, goal.color);
    setAddingNew(false);
    setEditingId(null);
  }

  function handleDelete(id) {
    persist(goals.filter(g => g.id !== id));
    setEditingId(null);
  }

  function openNewForm() {
    setAddingNew(v => !v);
    setEditingId(null);
  }

  function toggleEdit(id) {
    setEditingId(prev => prev === id ? null : id);
    setAddingNew(false);
  }

  const weeklyTotal  = goals.reduce((sum, g) => sum + weeklyMinutesFor(g), 0);
  const mood         = moodFromGoalCount(goals.length);
  const hasWeekData  = Object.values(goalsByDay).some(dayGoals => (dayGoals || []).length > 0);

  return (
    <div className="goals__wrap">
      <div className="goals__header">
        <div>
          <h1 className="goals__title">Goals</h1>
          <p className="goals__subtitle">These show up automatically on your Timetable and Tracker.</p>
        </div>
        <button className="goals__add-btn" onClick={openNewForm}>
          {addingNew ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      <div className="goals__companion-wrap">
        <Companion mood={mood} />
      </div>

      {goals.length > 0 && (
        <GoalStatsRow goalCount={goals.length} weeklyTotalLabel={fmtWeeklyMinutes(weeklyTotal)} />
      )}

      {addingNew && (
        <div className="goals__form-card">
          <p className="goals__form-title">New goal</p>
          <GoalForm onSave={handleSave} onCancel={() => setAddingNew(false)} />
        </div>
      )}

      {goals.length === 0 && !addingNew ? (
        <div className="goals__empty-state">
          <p className="goals__empty">No goals yet: a goal is just a subject you want to hit regularly.</p>
          <p className="goals__empty-hint">
            Try something like "Maths, 30 minutes, every weekday": it'll show up on your Timetable and Tracker automatically.
          </p>
        </div>
      ) : (
        <div className="goals__list">
          {goals.map(g => (
            <GoalCard
              key={g.id}
              goal={g}
              isEditing={editingId === g.id}
              onToggleEdit={() => toggleEdit(g.id)}
              onSave={handleSave}
              onDelete={() => handleDelete(g.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </div>
      )}

      {hasWeekData && <WeekGlance goalsByDay={goalsByDay} />}
    </div>
  );
}