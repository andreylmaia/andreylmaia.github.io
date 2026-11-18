import type {Locale, labIds} from './site';

type LabId = typeof labIds[number];
type Content = {content_id: string; category: string};
export type ConversationLocation = 'home' | 'about' | 'article';
type Events = {
  article_view: Content;
  article_completed: Content;
  article_shared: Content & {share_method: 'copy' | 'native' | 'email'};
  lab_opened: {lab_id: LabId};
  lab_used: {lab_id: LabId};
  resource_clicked: Content;
  language_changed: {target_language: Locale};
  theme_changed: {theme: 'light' | 'dark'};
  linkedin_clicked: {cta_location: 'footer' | 'connect'};
  email_clicked: {cta_location: 'footer' | 'connect' | 'composer'};
  conversation_started: {cta_location: ConversationLocation | 'composer'};
};

type Choice = 'granted' | 'denied';
declare global {
  interface Window {
    dataLayer?: IArguments[];
    [key: `ga-disable-G-${string}`]: boolean | undefined;
  }
}
type MeasurementId = `G-${string}`;

const key = 'am-analytics-consent';
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term'];
const denied = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
let choice: Choice | null = null;
let active = false;
let configured = false;
let initialized = false;
let locale = 'en';
const usedLabs = new Set<LabId>();

function validId(value: string): value is MeasurementId {
  return /^G-[A-Z0-9]+$/.test(value);
}

export function measurementId() {
  const id = (import.meta.env.PUBLIC_GA_MEASUREMENT_ID || '').trim();
  return import.meta.env.PROD && validId(id) ? id : '';
}

export function campaignParams(search: string) {
  const query = new URLSearchParams(search);
  const allowed = new URLSearchParams();
  for (const name of utmKeys) {
    const value = query.get(name);
    // Campaign values are public codes, with no spaces, email syntax or long numbers.
    if (value && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value) && !/\d{7,}/.test(value)) allowed.set(name, value);
  }
  return allowed.toString();
}

function gtag(..._args: unknown[]) {
  (window.dataLayer ??= []).push(arguments);
}

export function track<K extends keyof Events>(name: K, params: Events[K]) {
  if (!active) return false;
  gtag('event', name, {...params, site_language:locale});
  return true;
}

export function trackLabUse(id: LabId) {
  if (!usedLabs.has(id) && track('lab_used', {lab_id:id})) usedLabs.add(id);
}

export function trackArticleShare(method: Events['article_shared']['share_method']) {
  const article = document.querySelector<HTMLElement>('[data-analytics-article]');
  if (article?.dataset.analyticsArticle && article.dataset.category) {
    track('article_shared', {content_id:article.dataset.analyticsArticle, category:article.dataset.category, share_method:method});
  }
}

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(key);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch { return null; }
}

function pageContext() {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel=canonical]');
  const pathname = canonical ? new URL(canonical.href).pathname : '/';
  const page = new URL(pathname, location.origin);
  page.search = campaignParams(location.search);
  let referrer = '';
  try {
    const source = new URL(document.referrer);
    if (source.protocol === 'https:' || source.protocol === 'http:') referrer = source.origin + '/';
  } catch {}
  return {page_location:page.href, page_referrer:referrer, page_title:document.title};
}

function trackPage() {
  gtag('event', 'page_view', {site_language:locale});
  const article = document.querySelector<HTMLElement>('[data-analytics-article]');
  if (article?.dataset.analyticsArticle && article.dataset.category) {
    const content = {content_id:article.dataset.analyticsArticle, category:article.dataset.category};
    track('article_view', content);
    observeArticleEnd(content);
  }
  const lab = document.querySelector<HTMLElement>('[data-analytics-lab]')?.dataset.analyticsLab as LabId | undefined;
  if (lab) track('lab_opened', {lab_id:lab});
}

function observeArticleEnd(content: Content) {
  const end = document.querySelector('[data-article-end]');
  if (!end || !('IntersectionObserver' in window)) return;
  let reachedEnd = false;
  let visibleMs = 0;
  let since = performance.now();

  function check() {
    const now = performance.now();
    if (active && document.visibilityState === 'visible') visibleMs += Math.min(now - since, 1000);
    since = now;
    if (reachedEnd && visibleMs >= 30_000 && track('article_completed', content)) {
      observer.disconnect();
      clearInterval(timer);
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (active && entry.isIntersecting && document.visibilityState === 'visible') reachedEnd = true;
    check();
  });
  observer.observe(end);
  const timer = window.setInterval(check, 500);
}

export function initializeAnalytics(root: HTMLElement) {
  const id = root.dataset.gaId || '';
  if (initialized || !validId(id)) return;
  initialized = true;
  locale = document.documentElement.lang;
  const flag = `ga-disable-${id}` as const;
  const banner = root.querySelector<HTMLElement>('[data-consent-banner]');
  const panel = root.querySelector<HTMLElement>('[data-consent-panel]');

  function apply(next: Choice | null) {
    const wasActive = active;
    choice = next;
    active = next === 'granted';
    window[flag] = !active;
    if (banner) banner.hidden = choice !== null || !!panel;
    panel?.querySelectorAll<HTMLElement>('[data-consent-status]').forEach(status => {
      status.hidden = status.dataset.consentStatus !== (choice ?? 'unset');
    });
    panel?.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.consentChoice === choice));
    });

    if (!active) {
      if (wasActive) gtag('consent', 'update', denied);
      return;
    }
    if (!wasActive) {
      if (!configured) gtag('consent', 'default', denied);
      gtag('consent', 'update', {...denied, analytics_storage:'granted'});
    }
    if (configured) return;
    configured = true;
    gtag('js', new Date());
    gtag('config', id, {
      send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false,
      ...pageContext(),
    });
    trackPage();
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(script);
  }

  root.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const next = button.dataset.consentChoice === 'granted' ? 'granted' : 'denied';
      try { localStorage.setItem(key, next); } catch {}
      const fromBanner = !!button.closest('[data-consent-banner]');
      apply(next);
      if (fromBanner) document.querySelector<HTMLElement>('#main')?.focus();
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(readChoice());
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) apply(readChoice());
  });
  apply(readChoice());

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-analytics-action]');
    if (!link) return;
    const {analyticsAction,contentId,category,ctaLocation} = link.dataset;
    if (analyticsAction === 'resource_clicked' && contentId && category) {
      track('resource_clicked', {content_id:contentId, category});
    }
    if (analyticsAction === 'linkedin_clicked' && (ctaLocation === 'footer' || ctaLocation === 'connect')) {
      track('linkedin_clicked', {cta_location:ctaLocation});
    }
    if (analyticsAction === 'email_clicked' && (ctaLocation === 'footer' || ctaLocation === 'connect')) {
      track('email_clicked', {cta_location:ctaLocation});
    }
    if (analyticsAction === 'conversation_started' && (ctaLocation === 'home' || ctaLocation === 'about' || ctaLocation === 'article')) {
      track('conversation_started', {cta_location:ctaLocation});
    }
  });
}
