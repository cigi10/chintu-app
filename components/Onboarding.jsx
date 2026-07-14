"use client";
import "@/styles/onboarding.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Companion from "@/components/Companion";

const PACK_OPTIONS = [
  { key: "Custom",     icon: "CU", desc: "Build your own subject and topic list" },
  { key: "JEE",        icon: "JE", desc: "Physics, Chemistry, Maths" },
  { key: "NEET",       icon: "NE", desc: "Physics, Chemistry, Biology" },
  { key: "SAT/ACT",    icon: "SA", desc: "Math, Reading & Writing" },
  { key: "A-Levels",   icon: "AL", desc: "Pick 3-4 subjects" },
  { key: "GCSEs",      icon: "GC", desc: "Pick your subjects" },
  { key: "Gaokao",     icon: "GK", desc: "Maths, Chinese, English" },
  { key: "GRE/GMAT",   icon: "GR", desc: "Quant, Verbal" },
  { key: "Placements", icon: "PL", desc: "CS, ECE, DSA, Aptitude" },
];

const NAME_CHIPS = [
  "Pip", "Mochi", "Tofu", "Walnut", "Biscuit", "Bun",
  "Kiwi", "Sushi", "Coco", "Pepper", "Noodle", "Waffle",
  "Peanut", "Mango", "Olive", "Sprout",
];

const STEP_LABELS = ["Pack", "Name", "Exam date"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pack, setPack] = useState("");
  const [name, setName] = useState("");
  const [dday, setDday] = useState("");

  function pickPack(key) { setPack(key); setStep(1); }

  function confirmName() {
    if (!name.trim()) return;
    localStorage.setItem("chintu-exam-pack", pack);
    localStorage.setItem("chintu-companion-name", name.trim());
    setStep(2);
  }

  function finish() {
    if (dday) {
      const existing = JSON.parse(localStorage.getItem("chintu-ddays") || "[]");
      existing.push({ label: pack + " Exam", date: dday });
      localStorage.setItem("chintu-ddays", JSON.stringify(existing));
    }
    localStorage.setItem("chintu-onboarded", "true");
    router.push("/dashboard");
  }

  return (
    <div className="onboarding">
      <div className="onboarding__container">

        <div className="onboarding__progress">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`onboarding__dot${
                i === step ? " onboarding__dot--active" : i < step ? " onboarding__dot--done" : ""
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="onboarding__companion">
              <Companion mood="curious" />
            </div>
            <h1 className="onboarding__title">What are you preparing for?</h1>
            <p className="onboarding__subtitle">
              Pick a pack to get pre-loaded topics, or choose Custom to build your own list from scratch.
            </p>
            <div className="onboarding__exam-grid">
              {PACK_OPTIONS.map(p => (
                <button
                  key={p.key}
                  className={`onboarding__exam-btn${p.key === "Custom" ? " onboarding__exam-btn--custom" : ""}`}
                  onClick={() => pickPack(p.key)}
                >
                  <span className="onboarding__exam-icon">{p.icon}</span>
                  <span className="onboarding__exam-text">
                    <span className="onboarding__exam-name">{p.key}</span>
                    <span className="onboarding__exam-desc">{p.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="onboarding__companion">
              <Companion mood="waiting" />
            </div>
            <h1 className="onboarding__title">Name your companion</h1>
            <p className="onboarding__subtitle">
              Type any name you like: it doesn't have to be one of the suggestions below.
            </p>
            <div className="onboarding__step">
              <input
                className="onboarding__input"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && confirmName()}
                placeholder="Type your own name here..."
                autoFocus
              />
              <div className="onboarding__chips-panel">
                <p className="onboarding__chips-label">Need inspiration? Try one of these:</p>
                <div className="onboarding__chips">
                  {NAME_CHIPS.map(c => (
                    <button
                      key={c}
                      className={`onboarding__chip${name === c ? " onboarding__chip--selected" : ""}`}
                      onClick={() => setName(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="onboarding__actions">
                <button
                  className="onboarding__cta"
                  onClick={confirmName}
                  disabled={!name.trim()}
                >
                  That's the name
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="onboarding__companion">
              <Companion mood="happy" />
            </div>
            <h1 className="onboarding__title">When is your exam?</h1>
            <p className="onboarding__subtitle">Optional: you can add this later too</p>
            <div className="onboarding__step">
              <input
                className="onboarding__input"
                type="date"
                value={dday}
                onChange={e => setDday(e.target.value)}
              />
              <div className="onboarding__actions">
                <button className="onboarding__cta" onClick={finish}>
                  {dday ? "Start studying" : "Skip for now"}
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}