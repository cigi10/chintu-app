"use client";
import "@/styles/toast-progress.css";

// Maps 0 (session start) through 1 (session end) into one of 4 toast
// browning stages. Kept separate from the rendering below so the image
// swap (see STAGE_IMAGES) never has to touch this math.
export function getToastStage(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.min(4, Math.floor(clamped * 4) + 1);
}

// Real art landed in public/toast-nutella-banana-strawberry-blueberry/
// (that's the folder's actual name — left as-is rather than renamed).
// Mapped bread -> toast -> +nutella -> +banana across the 4 stages, with
// the fully-loaded +strawberry+blueberry version reserved for the
// celebration state on completion. "+strawberry" alone (one topping short
// of the celebration image) isn't used by this 4-stage mapping; swap any
// of these paths, or the mapping itself, in one place if you'd rather use
// it differently.
const TOAST_DIR = "/toast-nutella-banana-strawberry-blueberry";
const STAGE_IMAGES = {
  1: `${TOAST_DIR}/bread.PNG`,
  2: `${TOAST_DIR}/toast.PNG`,
  3: `${TOAST_DIR}/toast-nutella.PNG`,
  4: `${TOAST_DIR}/toast-nutella-banana.PNG`,
};
const CELEBRATION_IMAGE = `${TOAST_DIR}/toast-nutella-banana-strawberry-blueberry.PNG`;

// Separate from the weekly Bread Basket streak (components/BreadBasket.jsx)
// — this tracks how far through the *current* session you are, resetting
// every session rather than accumulating over a week.
export default function ToastProgress({ progress, done }) {
  const stage = getToastStage(progress);
  const src = done ? CELEBRATION_IMAGE : STAGE_IMAGES[stage];

  return (
    <div className="toast-progress">
      <img
        src={src}
        alt={done ? "Fully loaded toast" : `Toast at stage ${stage} of 4`}
        className={`toast-progress__toast ${done ? "toast-progress__toast--celebration" : ""}`}
      />
      <p className="toast-progress__label">
        {done ? "Toast's ready!" : `Toasting: stage ${stage} of 4`}
      </p>
    </div>
  );
}
