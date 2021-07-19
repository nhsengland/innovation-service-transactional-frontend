export const COOKIES_USED: {
  necessary: { name: string, purpose: string, expires: string }[],
  analytics: { name: string, purpose: string, expires: string }[]
} = {

  necessary: [
    { name: 'nhsuk-cookie-consent', purpose: 'Remembers if you used our cookies banner', expires: 'When you close the browser (if you do not use the banner) or 1 year (if you use the banner).' },
    { name: 'grav-site', purpose: 'A cookie set when you enter a password to get into a private area of the site. It allows the site to remember that you have already entered the password.', expires: '30 minutes' },
    { name: 'connect.sid', purpose: 'Innovation Service session cookie. This is set when you log in to the service. It makes temporary use of your personal information previously collected by us, only holding information for the duration of your session. It is required by various features in the site and is deleted when your session ends.', expires: 'Session' },
    { name: 'ApplicationGatewayAffinity', purpose: 'This cookie is provided by the load balancer and used to ensure functionality of the service.', expires: 'Session' },
    { name: 'ApplicationGatewayAffinityCORS', purpose: 'This cookie is provided by the load balancer and used to ensure functionality of the service, even for cross-origin requests.', expires: 'Session' }
  ],

  analytics: [
    { name: '_ga', purpose: 'Used to distinguish users.', expires: '2 years' },
    { name: '_gid', purpose: 'Used to distinguish users.', expires: '24 hours' },
    { name: 'ga', purpose: 'Used to persist session state.', expires: '2 years' },
    { name: '_gac_gb_', purpose: 'Contains campaign related information. If you have linked your Google Analytics and Google Ads accounts, Google Ads website conversion tags will read this cookie unless you opt-out.', expires: '90 days' },
    { name: '_hjClosedSurveyInvites', purpose: 'Hotjar cookie that is set once a user interacts with an External Link Survey invitation modal. It is used to ensure that the same invite does not reappear if it has already been shown.', expires: '365 days' },
    { name: '_hjDonePolls', purpose: 'Hotjar cookie that is set once a user completes a survey using the On-site Survey widget. It is used to ensure that the same survey does not reappear if it has already been filled in.', expires: '365 days' },
    { name: '_hjMinimizedPolls', purpose: 'Hotjar cookie that is set once a user minimizes an On-site Survey widget. It is used to ensure that the widget stays minimized when the user navigates through your site.', expires: '365 days' },
    { name: '_hjShownFeedbackMessage', purpose: 'Hotjar cookie that is set when a user minimizes or completes Incoming Feedback. This is done so that the Incoming Feedback will load as minimized immediately if the user navigates to another page where it is set to show.', expires: '365 days' },
    { name: '_hjSessionTooLarge', purpose: 'Causes Hotjar to stop collecting data if a session becomes too large. This is determined automatically by a signal from the WebSocket server if the session size exceeds the limit.', expires: 'Session' },
    { name: '_hjSessionRejected', purpose: 'If present, this cookie will be set to \'1\' for the duration of a user\'s session, if Hotjar rejected the session from connecting to our WebSocket due to server overload. This cookie is only applied in extremely rare situations to prevent severe performance issues.', expires: 'Session' },
    { name: '_hjSessionResumed', purpose: 'A cookie that is set when a session/recording is reconnected to Hotjar servers after a break in connection.', expires: 'Session' },
    { name: '_hjid', purpose: 'Hotjar cookie that is set when the customer first lands on a page with the Hotjar script. It is used to persist the Hotjar User ID, unique to that site on the browser. This ensures that behavior in subsequent visits to the same site will be attributed to the same user ID.', expires: '365 days' },
    { name: '_hjRecordingLastActivity', purpose: 'This should be found in Session storage (as opposed to cookies). This gets updated when a user recording starts and when data is sent through the WebSocket (the user performs an action that Hotjar records).', expires: 'Session' },
    { name: '_hjTLDTest', purpose: 'When the Hotjar script executes we try to determine the most generic cookie path we should use, instead of the page hostname. This is done so that cookies can be shared across subdomains (where applicable). To determine this, we try to store the _hjTLDTest cookie for different URL substring alternatives until it fails. After this check, the cookie is removed.', expires: 'Session' },
    { name: '_hjUserAttributesHash', purpose: 'User Attributes sent through the Hotjar Identify API are cached for the duration of the session in order to know when an attribute has changed and needs to be updated.', expires: 'Session' },
    { name: '_hjCachedUserAttributes', purpose: 'This cookie stores User Attributes which are sent through the Hotjar Identify API, whenever the user is not in the sample. Collected attributes will only be saved to Hotjar servers if the user interacts with a Hotjar Feedback tool, but the cookie will be used regardless of whether a Feedback tool is present.', expires: 'Session' },
    { name: '_hjLocalStorageTest', purpose: 'This cookie is used to check if the Hotjar Tracking Script can use local storage. If it can, a value of 1 is set in this cookie. The data stored in_hjLocalStorageTest has no expiration time, but it is deleted almost immediately after it is created.', expires: 'Under 100ms' },
    { name: '_hjIncludedInPageviewSample', purpose: 'This cookie is set to let Hotjar know whether that user is included in the data sampling defined by your site\'s pageview limit.', expires: '30 minutes' },
    { name: '_hjIncludedInSessionSample', purpose: 'This cookie is set to let Hotjar know whether that user is included in the data sampling defined by your site\'s daily session limit.', expires: '30 minutes' },
    { name: '_hjAbsoluteSessionInProgress', purpose: 'This cookie is used to detect the first pageview session of a user. This is a True/False flag set by the cookie.', expires: '30 Minutes' },
    { name: '_hjFirstSeen', purpose: 'This is set to identify a new user’s first session. It stores a true/false value, indicating whether this was the first time Hotjar saw this user. It is used by Recording filters to identify new user sessions.', expires: 'Session' },
    { name: '_hjViewportId', purpose: 'This stores information about the user viewport such as size and dimensions.', expires: 'Session' },
    { name: '_hjRecordingEnabled', purpose: 'This is added when a Recording starts and is read when the recording module is initialized to see if the user is already in a recording in a particular session.', expires: 'Session' }
  ]
};
