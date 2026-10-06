// lib/adsense.js
//
// AdSense is loaded only on content pages (/blog/* and /resources/*, via
// their route layouts) and only when NEXT_PUBLIC_ADSENSE_CLIENT holds a
// well-formed publisher ID. Unset or malformed means no ad code anywhere,
// which also keeps local dev and previews ad-free.

export function getAdsenseClient() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return client && /^ca-pub-\d{10,20}$/.test(client) ? client : null;
}

export function adsenseScriptSrc(client) {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
}
