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
 *
 */
function onRequest(request, sender, sendResponse) {
  if (request.type == "init") {
    sendResponse(localStorage);
  } else if (request.type == "icon") {
    var tabId = sender.tab.id;
    var bool = request.detail.alternates.length > 0;

    setIcon(tabId, bool);
    setTitle(tabId, bool);
    doPageAction(tabId, bool);
  }
}

$(document).ready(function () {
  chrome.extension.onRequest.addListener(onRequest);
  console.info("[INFO] Chrome Page Style Initialized");
});
