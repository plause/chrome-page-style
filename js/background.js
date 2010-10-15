var action = chrome.pageAction;

/*
 * set page action icon
 */
function setIcon(tabId, bool) {
  var path = "images/" + (bool ? "icon-has-styles.png" : "icon-no-styles.png");
  action.setIcon({"tabId": tabId, "path": path});
}

/*
 * set page action title
 */
function setTitle(tabId, bool) {
  var title = chrome.i18n.getMessage(bool ? "titleHasStyles" : "titleNoStyles");
  action.setTitle({"tabId": tabId, "title": title});
}

/*
 * show or hide page action
 */
function doPageAction(tabId, bool) {
  var alwaysShowIcon = localStorage["alwaysShowIcon"] || "0";
  alwaysShowIcon || bool ? action.show(tabId) : action.hide(tabId);
}

/*
 * receive page style details
 */
function onRequest(detail, sender) {
  var tabId = sender.tab.id;
  var bool = detail.alternates.length > 0;

  setIcon(tabId, bool);
  setTitle(tabId, bool);
  doPageAction(tabId, bool);
}

$(document).ready(function () {
  chrome.extension.onRequest.addListener(onRequest);
  console.info("[INFO] Chrome Page Style Initialized");
});
