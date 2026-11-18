/** Configure only a script authorized for this site and add both privacy disclosures. */
interface Analytics {
  scriptUrl: string;
  privacy: {en:string; pt:string};
}

export const analytics = resolveAnalytics(null);

function resolveAnalytics(config: Analytics | null) {
  if (!config) return null;
  const url = new URL(config.scriptUrl);
  if (url.protocol !== 'https:' || !config.privacy.en.trim() || !config.privacy.pt.trim()) {
    throw new Error('Analytics requires an HTTPS script and localized privacy disclosures');
  }
  return config;
}
