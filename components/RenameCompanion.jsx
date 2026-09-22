"use client";
import { useState } from "react";
import { setCompanionName, NAME_CHIPS } from "@/lib/companion";
import Button from "@/components/Button";
import "@/styles/onboarding.css";

// Lets a signed-in user rename their companion after onboarding, reusing
// the exact same suggestion chips + free-text input Onboarding.jsx uses
// for the initial name. `currentName` is the name to show/prefill;
// `onRenamed(newName)` fires after a successful save so the parent can
// update its own display without a full reload.
export default function RenameCompanion({ currentName, onRenamed }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);

  function startEditing() {
    setName(currentName);
    setEditing(true);
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const clean = setCompanionName(trimmed);
    onRenamed(clean);
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="profile__row">
        <span className="profile__label">Companion name</span>
        <span className="profile__value">
          {currentName}{" "}
          <button type="button" className="profile__rename-link" onClick={startEditing}>
            Rename
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="profile__rename-panel">
      <input
        className="onboarding__input"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && save()}
        placeholder="Type a new name..."
        autoFocus
      />
      <div className="onboarding__chips-panel">
        <p className="onboarding__chips-label">Need inspiration? Try one of these:</p>
        <div className="onboarding__chips">
          {NAME_CHIPS.map(chip => (
            <button
              key={chip}
              type="button"
              className={`onboarding__chip${name === chip ? " onboarding__chip--selected" : ""}`}
              onClick={() => setName(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      <div className="profile__rename-actions">
        <Button size="sm" onClick={save} disabled={!name.trim()}>Save</Button>
        <Button size="sm" variant="secondary" onClick={cancel}>Cancel</Button>
      </div>
    </div>
  );
}
