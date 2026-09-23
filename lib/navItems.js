// Single source of truth for every nav destination's href/label.
// Navbar.jsx (desktop) and BottomNav.jsx (mobile) each arrange a different
// subset into "always visible" vs "grouped under More" — that arrangement
// is a deliberate per-surface UX decision and stays separately curated in
// each component. What shouldn't drift between them is the href/label for
// a page they both link to, so those live here once.
export const NAV = {
  home:         { href: "/dashboard",    label: "Home"          },
  timer:        { href: "/timer",        label: "Timer"         },
  todo:         { href: "/todo",         label: "Todo"          },
  timetable:    { href: "/timetable",    label: "Timetable"     },
  tracker:      { href: "/tracker",      label: "Tracker"       },
  goals:        { href: "/goals",        label: "Goals"         },
  revisions:    { href: "/revisions",    label: "Revisions"     },
  mocktests:    { href: "/mocktests",    label: "Mocks"         },
  quiz:         { href: "/quiz",         label: "Quiz"          },
  games:        { href: "/games",        label: "Games"         },
  stats:        { href: "/stats",        label: "Stats"         },
  rooms:        { href: "/rooms",        label: "Rooms"         },
  shop:         { href: "/shop",         label: "Shop"          },
  achievements: { href: "/achievements", label: "Achievements"  },
  journal:      { href: "/journal",      label: "Journal"       },
  mood:         { href: "/mood",         label: "Mood"          },
  digest:       { href: "/digest",       label: "Digest"        },
  profile:      { href: "/profile",      label: "Profile"       },
  tutorial:     { href: "/tutorial",     label: "How it works"  },
  login:        { href: "/login",        label: "Log in"        },
  privacy: { href: "/privacy", label: "Privacy" },
  terms: { href: "/terms", label: "Terms" },
  blog: { href: "/blog", label: "Blog" },
  resources: { href: "/resources", label: "Resources" },
  timetableGenerator: { href: "/tools/timetable-generator", label: "Timetable Generator" },
  countdown: { href: "/countdown", label: "Countdown" },
};

// Grouping of the keys above for the "More" mega-menu in Navbar.jsx
// (desktop) and the bottom-sheet in BottomNav.jsx (mobile) — order within
// each group is the display order in both places.
export const NAV_GROUPS = [
  {
    label: "Study",
    items: ["home", "timer", "todo", "timetable", "tracker", "goals", "revisions", "mocktests", "stats", "achievements", "rooms", "shop"],
  },
  {
    label: "Free Tools",
    items: ["timetableGenerator", "countdown", "quiz", "games", "resources", "blog"],
  },
  {
    label: "You",
    items: ["tutorial", "journal", "mood", "digest", "profile"],
  },
];
