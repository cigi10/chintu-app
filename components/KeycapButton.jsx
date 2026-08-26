"use client";
import "@/styles/keycap.css";

// 3D keycap-style button, used only for the Start/Pause control on the
// Timer page. Flows inline with its siblings (Reset/Finish) instead of the
// fixed/absolute positioning of the original Uiverse concept.
export default function KeycapButton({ children, onClick, className = "" }) {
  return (
    <div className={["keycap", className].filter(Boolean).join(" ")}>
      <div className="keycap__cover">
        <button type="button" className="keycap__button" onClick={onClick}>
          {children}
        </button>
      </div>
    </div>
  );
}
