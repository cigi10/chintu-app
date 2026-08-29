"use client";
import "@/styles/achievements.css";
import { useState, useEffect } from "react";
import Companion from "@/components/Companion";
import {
  ACHIEVEMENTS,
  getAchievementsContext,
  computeProgress,
  getMotivationalLine,
  getOverallStats,
  moodFromUnlockRatio,
} from "@/lib/achievements";
import { hydrateTracker } from "@/lib/tracker";
import { hydrateStreak } from "@/lib/streakLogic";

const CATEGORY_ORDER = ["Sessions", "Streak", "Focus Time", "Coins Earned", "Subjects", "Portions", "Goals"];

export default function Achievements() {
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    Promise.all([hydrateTracker(), hydrateStreak()]).then(() => {
      setCtx(getAchievementsContext());
    });
  }, []);

  if (!ctx) {
    return (
      <div className="achievements">
        <p className="achievements__loading">Loading your progress...</p>
      </div>
    );
  }

  const { totalTiers, unlockedTiers } = getOverallStats(ctx);
  const ratio = totalTiers > 0 ? unlockedTiers / totalTiers : 0;
  const mood  = moodFromUnlockRatio(ratio);

  const grouped = {};
  ACHIEVEMENTS.forEach(a => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });

  return (
    <div className="achievements">
      <div className="achievements__hero">
        <div className="achievements__companion-wrap">
          <Companion mood={mood} />
        </div>
        <div className="achievements__hero-text">
          <div className="achievements__hero-count">{unlockedTiers} / {totalTiers}</div>
          <p className="achievements__hero-label">milestones unlocked</p>
          {unlockedTiers === 0 && (
            <p className="achievements__hero-hint">
              Nothing logged yet: start a session on the Timer page and your first milestone won&apos;t be far off.
            </p>
          )}
        </div>
      </div>

      <div className="achievements__categories">
        {CATEGORY_ORDER.filter(c => grouped[c]).map(category => (
          <div key={category} className="achievements__category-block">
            <h2 className="achievements__category-title">{category}</h2>
            <div className="achievements__cards">
              {grouped[category].map(a => {
                const progress = computeProgress(a, ctx);
                return (
                  <div
                    key={a.id}
                    className={`achievements__card${progress.isMaxed ? " achievements__card--maxed" : ""}`}
                  >
                    <div className="achievements__card-top">
                      <h3 className="achievements__card-title">{a.title}</h3>
                      <span className="achievements__card-value">
                        {progress.displayValue} {progress.displayValue === 1 ? a.unitSingular : a.unitPlural}
                      </span>
                    </div>
                    <p className="achievements__card-desc">{a.description}</p>

                    <div className="achievements__tier-row">
                      {a.tiers.map((tier, i) => {
                        const unlocked = i <= progress.currentTierIndex;
                        return (
                          <div
                            key={tier.name}
                            className={`achievements__tier-chip${unlocked ? " achievements__tier-chip--unlocked" : ""}`}
                            title={`${tier.name} · ${tier.threshold} ${a.unitPlural}`}
                          >
                            {tier.name}
                          </div>
                        );
                      })}
                    </div>

                    {!progress.isMaxed && (
                      <div className="achievements__progress-bar-bg">
                        <div
                          className="achievements__progress-bar-fill"
                          style={{ width: `${Math.round(progress.progressToNext * 100)}%` }}
                        />
                      </div>
                    )}

                    <p className={`achievements__quote${progress.isMaxed ? " achievements__quote--maxed" : ""}`}>
                      {getMotivationalLine(a, progress)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}