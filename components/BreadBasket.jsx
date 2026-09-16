"use client";
import "@/styles/bread-basket.css";
import { useState, useEffect } from "react";
import {
  hydrateBreadBasket,
  getCurrentBasket,
  getBasketHistory,
  getWeekStart,
  BASKET_DAYS,
} from "@/lib/breadBasket";

function formatWeekRange(weekStart) {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const startLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString(undefined, {
    month: start.getMonth() === end.getMonth() ? undefined : "short",
    day: "numeric",
  });
  return `${startLabel}–${endLabel}`;
}

function bunCount(days) {
  return BASKET_DAYS.filter(day => days[day]).length;
}

// One image per bun count (0 through 7), under public/bread-basket/. A
// full basket (every day this week) also gets a theme-aware celebration
// overlay on top, since the art itself is plain, uncolored bread/basket
// tones with no color treatment of its own.
function basketImageSrc(count) {
  return count === 0
    ? "/bread-basket/bread-basket-empty.PNG"
    : `/bread-basket/bread-basket${count}.PNG`;
}

function Basket({ days, size = "regular" }) {
  const count = bunCount(days || {});
  const isFull = count >= BASKET_DAYS.length;
  return (
    <div className={`bread-basket__basket bread-basket__basket--${size}`}>
      <div className={`bread-basket__basket-art${isFull ? " bread-basket__basket-art--full" : ""}`}>
        {isFull && <div className="bread-basket__celebration" aria-hidden="true" />}
        <img
          src={basketImageSrc(count)}
          alt={count === 0 ? "Empty bread basket" : `Bread basket with ${count} bun${count === 1 ? "" : "s"}`}
          className="bread-basket__image"
        />
      </div>
    </div>
  );
}

export default function BreadBasket() {
  const [currentWeek, setCurrentWeek] = useState({ weekStart: getWeekStart(), days: {} });
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    hydrateBreadBasket().then(() => {
      setCurrentWeek(getCurrentBasket());
      setHistory(getBasketHistory());
      setLoaded(true);
    });
  }, []);

  const count = bunCount(currentWeek.days || {});

  return (
    <div className="dashboard__section">
      <h2 className="dashboard__section-heading">
        Bread Basket
        <span className="dashboard__goal-progress-pill">{count}/7 this week</span>
      </h2>
      <p className="bread-basket__subtitle">
        Finish a focus session to add a bun to the basket. Missed days just don&apos;t add one, nothing to lose.
      </p>

      <Basket days={currentWeek.days} />

      {loaded && history.length > 0 && (
        <div className="bread-basket__shelf-wrap">
          <p className="bread-basket__shelf-label">Bakery shelf</p>
          <div className="bread-basket__shelf">
            {history.map(week => (
              <div key={week.weekStart} className="bread-basket__shelf-item">
                {/* Placeholder for mini-basket-icon.png — a past week is
                    "packed away" as a single small basket + its final
                    count, not a re-rendered day-by-day breakdown. */}
                <div className="bread-basket__mini-icon" aria-hidden="true">
                  {bunCount(week.days)}
                </div>
                <span className="bread-basket__shelf-range">{formatWeekRange(week.weekStart)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
