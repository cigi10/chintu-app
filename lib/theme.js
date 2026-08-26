const THEME_KEY = "chintu-theme";

export const THEMES = [
  { id: "sunset",          label: "Sunset"          },
  { id: "azure",           label: "Azure"           },
  { id: "strawberry",      label: "Strawberry"      },
  { id: "periwinkle",      label: "Periwinkle"      },
  { id: "matcha",          label: "Matcha"          },
  { id: "forest",          label: "Forest"          },
  { id: "majorelle",       label: "Majorelle"       },
  { id: "slate",           label: "Slate"           },
  { id: "cocoa",           label: "Cocoa"           },
  { id: "starry-nights",   label: "Starry Nights"   },
  { id: "rose-noir",       label: "Rose Noir"       },
  { id: "midnight-blue",   label: "Midnight Blue"   },
  { id: "twilight-forest", label: "Twilight Forest" },
];

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return THEMES.some(t => t.id === stored) ? stored : "sunset";
  } catch {
    return "sunset";
  }
}

export function applyTheme(themeId) {
  try {
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem(THEME_KEY, themeId);
  } catch {}
}