import "@/styles/spinner.css";

const DOT_COUNT = 10;

// 10 dots arranged in a circle, each fading in sequence.
// Positions are computed per-index (rotate + translateY) instead of
// hand-written nth-child rules, so DOT_COUNT/size can change freely.
export default function Spinner({ size = 40, className = "" }) {
  const radius = size * 0.35;

  return (
    <div
      className={["spinner", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <span
          key={i}
          className="spinner__dot"
          style={{
            transform: `rotate(${i * 36}deg) translateY(-${radius}px)`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
