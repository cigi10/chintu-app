// lib/games.js
//
// The top level of the Games hierarchy: /games lists game *families*
// (Crumb today, a Nerdle-style equation-guessing game later), each
// family then owns its own subtree (/games/crumb, /games/crumb/[domain]).
// Adding a second family is just a new entry here plus its own
// app/games/<slug>/ routes - the hub itself never needs to change shape.
export const GAME_FAMILIES = [
  {
    slug: "crumb",
    label: "Crumb",
    tagline: "Daily term-guessing game",
    description: "Guess a real subject term in 6 tries, with colored letter feedback. One puzzle a day per domain.",
  },
];

export function getGameFamilySlugs() {
  return GAME_FAMILIES.map(family => family.slug);
}

export function getGameFamily(slug) {
  return GAME_FAMILIES.find(family => family.slug === slug);
}
