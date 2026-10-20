export function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function reviewSearchUrl(company, site) {
  if (site === "reddit.com") {
    return `https://www.reddit.com/search/?q=${encodeURIComponent(company)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`site:${site} ${company} employee reviews`)}`;
}