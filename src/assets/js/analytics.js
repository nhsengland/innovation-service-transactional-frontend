const tagMeasurementId = window.__env.TAG_MEASUREMENT_ID;
const gtmId = window.__env.GTM_ID;
const enableAnalytics = window.__env.ENABLE_ANALYTICS === true;


// GA4 specific methods.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Send an update consent for GA4.
function updateGTAGConsent(agreed) {

  if (!enableAnalytics || !tagMeasurementId || !gtmId) {
    return;
  }

  gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'denied',
    analytics_storage: agreed ? 'granted' : 'denied'
  });
}


(function () {

  if (!enableAnalytics || !tagMeasurementId || !gtmId) {
    return;
  }

  // Hotjar tracking Code.
  if (getConsentCookie().analytics) { // Only if user accepted cookies!
    (function (h, o, t, j, a, r) {
      h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
      h._hjSettings = { hjid: 2499228, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.id = 'hj-analytics';
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  // Google Analytics.
  // GA4 is being loaded trought Google Tag Manager.

  // // Set GA4 default Consent Mode. Needs to be declared before scripts injection.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'denied',
    analytics_storage: getConsentCookie().analytics ? 'granted' : 'denied' // Only if user accepted cookies!
  });

  // // Google Tag Manager.
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', gtmId);

})();
