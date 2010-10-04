var tabs = chrome.tabs;
var action = chrome.pageAction;
var extension = chrome.extension;

function error(message) {
  console.error(message);
}

function warn(message) {
  console.warn(message);
}

function info(message) {
  console.info(message);
}

function debug(message) {
  console.warn(message);
}

function i18n(message) {
  return chrome.i18n.getMessage(message);
}

