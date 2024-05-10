function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + encodeURI(cvalue) + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const cookieArray = document.cookie.split(";");

  for (let item of cookieArray) {
    let c = item;
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

function getConsentCookie() {
  // cookies-consent type = { consented: boolean, necessary: boolean, analytics: boolean }
  try {
    return JSON.parse(decodeURIComponent(getCookie("cookies-consent")) || "{}");
  } catch (error) {
    console.log("Error parsing consent cookies", error);
    return {};
  }
}

function setConsentCookie(agreed) {
  setCookie("cookies-consent", JSON.stringify({ consented: true, necessary: true, analytics: agreed }), 365);
}
