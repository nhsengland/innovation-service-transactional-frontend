
const tagMeasurementId = window.__env.TAG_MEASUREMENT_ID;
const gtmId = window.__env.GTM_ID;
const enableAnalytics = window.__env.ENABLE_ANALYTICS === "true";

(function () {

  if (!enableAnalytics || !getConsentCookie().analytics) {
    return;
  }

  // Hotjar tracking Code.
  (function (h, o, t, j, a, r) {
    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
    h._hjSettings = { hjid: 2499228, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script'); r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

  // Set GA4 Consent Mode
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'denied',
    analytics_storage: 'granted'
  });

  // Google Analytics.
  const node = document.createElement('script');
  node.id = 'ga-analytics';
  node.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagMeasurementId;
  node.type = 'text/javascript';
  node.async = true;
  document.getElementsByTagName('head')[0].appendChild(node);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', tagMeasurementId);

  // Google Tag Manager
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', gtmId);

})();
