// lib/onboardedFlag.js
//
// "This browser has finished onboarding" lives in localStorage (what client
// code has always read) and is mirrored into a cookie of the same name, so
// proxy.ts can send a returning visitor from / straight to /dashboard on
// the server, before any HTML renders. Without the cookie, / would have to
// render nothing and decide in the browser, which is what left Google with
// a blank homepage.
export const ONBOARDED_KEY = "chintu-onboarded";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function setOnboardedCookie() {
  document.cookie = `${ONBOARDED_KEY}=true; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export function markOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, "true");
  setOnboardedCookie();
}
