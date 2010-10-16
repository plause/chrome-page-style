var alternate = /\balternate\b/i;
var stylesheet = /\bstylesheet\b/i;

var id = "ddpkgkegfklikkmfmneldonhldahhacb";
var property = "chrome-page-style-" + Math.random();

// reads the default style from the browser.
// default style cat be set by HTTP HEADER: Default-Style
// or meta HTTP equivalent: Default-Style
// or preferred stylesheets
var defaultStyle = document.selectedStylesheetSet;

var settings = {"remeberSelected": false};

/*
 * check if the link's relationships has a type named 'alternate'.
 */
function isAlternate(link) {
  return alternate.test($(link).attr("rel"));
}

/*
 * check if the link's relationships has a type named 'stylesheet'.
 */
function isStylesheet(link) {
  return stylesheet.test($(link).attr("rel"));
}

/*
 * an alternate stylesheet MUST have an attribute 'title'.
 */
function isAlternateStylesheet(link) {
  return isStylesheet(link) && isAlternate(link) && $(link).attr("title");
}

/*
 * a preferred stylesheet MUST have an attribute 'title'.
 */
function isPreferredStylesheet(link) {
  return isStylesheet(link) && !isAlternate(link) && $(link).attr("title");
}

/*
 * a persistent stylesheet MUST NOT have an attribute 'title'.
 */
function isPersistentStylesheet(link) {
  return isStylesheet(link) && !isAlternate(link) && !$(link).attr("title");
}

/*
 * a page style is a stylesheet HAVING an attribute 'title'.
 */
function isPageStyle(link) {
  return isStylesheet(link) && $(link).attr("title");
}

/*
 * disable or enable the specified stylesheet.
 */
function toggleStylesheet(stylesheet, toggle) {
  stylesheet.disabled = toggle;
  stylesheet.disabled = toggle; // force the browser to action right now
}

/*
 * disable or enable all linked stylesheets.
 */
function toggleLinkedStylesheets(toggle) {
  $("link").each(function () {
    if (isStylesheet(this)) {
      toggleStylesheet(this, toggle);
    }
  });
}

/*
 * disable or enable all embedded stylesheets.
 */
function toggleEmbeddedStylesheets(toggle) {
  $("style").each(function () {
    toggleStylesheet(this.sheet, toggle);
  });
}

/*
 * disable or enable all inline stylesheets.
 */
function toggleInlineStylesheets(toggle) {
  $("*").each(function () {
    if (toggle) {
      if (this.style.cssText != "") { // this tag has an inline style
        this.style[property] = this.style.cssText;
        this.style.cssText = "";
      }
    } else {
      if (this.style[property]) {
        this.style.cssText = this.style[property];
        delete this.style[property];
      }
    }
  });
}

/*
 *
 */
function saveSelected(selected) {
  if (settings["rememberSelected"] == "1") {
    $.cookie(id, selected, {"expires": 1});
  }
}

/*
 * disable all styles.
 */
function noStyle() {
  toggleLinkedStylesheets(true);
  toggleEmbeddedStylesheets(true);
  toggleInlineStylesheets(true);

  saveSelected(id);
}

/*
 * activate the selected page style.
 */
function switchStyle(name) {
  $("link").each(function () {
    if (isStylesheet(this)) {
      var title = $(this).attr("title");
      toggleStylesheet(this, name ? name != title : isAlternate(this));
    }
  }).each(function () {
    if (isPersistentStylesheet(this)) {
      toggleStylesheet(this, false);
    }
  });

  toggleEmbeddedStylesheets(false);
  toggleInlineStylesheets(false);

  saveSelected(name);
}

/*
 * re-retreving page styles.
 */
function reloadPageStyle() {
  var alternateStored = {}; // prevents from stroing duplicated alternate styles
  var alternates = []; // stores all possible alternate styles
  var preferredStored = {}; // prevents from storing duplicated preferred styles
  var preferreds = []; // stores all possible preferred styles

  $("link").each(function () {
    var title = $(this).attr("title");

    if (isAlternateStylesheet(this)) {
      if (!alternateStored[title] && (alternateStored[title] = true)) {
        alternates.push(title);
      }
    } else if (isPreferredStylesheet(this)) {
      if (!preferredStored[title] && (preferredStored[title] = true)) {
        preferreds.push(title);
      }
    }
  });

  var remember = settings["rememberSelected"] == "1";
  var selected = (remember ? $.cookie(id) : null) || defaultStyle;
  var preferred = preferreds.length > 1 ? defaultStyle : preferreds[0];

  return {"alternates": alternates, "selected": selected, "preferred": preferred};
}

/*
 * receive requests from popup.
 */
function onRequest(request, sender, sendResponse) {
  if (request.type == "detail") {
    sendResponse(reloadPageStyle());
  } else if (request.type == "switch") {
    sendResponse(switchStyle(request.style));
  } else if (request.type == "none") {
    sendResponse(noStyle());
  }
}

/*
 *
 */
function initialize(object) {
  $.extend(settings, object);

  var pageStyle = reloadPageStyle();

  // send details to background
  chrome.extension.sendRequest({"type": "icon", "detail": pageStyle});
  chrome.extension.onRequest.addListener(onRequest);

  // fix chrome
  noStyle();
  switchStyle(pageStyle.selected);
}

chrome.extension.sendRequest({"type": "init"}, initialize);
