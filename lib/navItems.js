// Single source of truth for every nav destination's href/label, and for
// how they're grouped in the sidebar (desktop) and the hamburger overlay
// (mobile) — see NAV_GROUPS below, shared by components/Sidebar.jsx and
// components/BottomNav.jsx so the two surfaces can never drift apart.
// Navbar.jsx is a slim top bar now (brand, coins, theme, login/avatar) and
// no longer renders any of these links itself.
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

// Sidebar/hamburger-overlay section order matters here — Stats before
// Achievements in Study, and the exact item lists per section, are
// deliberate product decisions, not alphabetical or incidental.
export const NAV_GROUPS = [
  {
    label: "Study",
    items: [
      NAV.home, NAV.timer, NAV.todo, NAV.timetable, NAV.tracker, NAV.goals,
      NAV.revisions, NAV.mocktests, NAV.stats, NAV.achievements, NAV.rooms, NAV.shop,
    ],
  },
  {
    label: "Free Tools",
    items: [NAV.timetableGenerator, NAV.countdown, NAV.quiz, NAV.resources, NAV.blog],
  },
  {
    label: "You",
    items: [NAV.tutorial, NAV.journal, NAV.mood, NAV.digest, NAV.profile],
  },
];
