var tabs = chrome.tabs;
var i18n = chrome.i18n.getMessage;

var id = "ddpkgkegfklikkmfmneldonhldahhacb";

var contextTab = null;

/*
 *
 */
function noStyle() {
  tabs.sendRequest(contextTab.id, {"type": "none"});
}

/*
 *
 */
function switchStyle(name) {
  tabs.sendRequest(contextTab.id, {"type": "switch", "style": name});
}

/*
 *
 */
function toggleSelected(target) {
  $("a").removeClass("selected");
  $(target).addClass("selected");
}

/*
 *
 */
function initialize(object) {
  var alternates = object.alternates;
  var selected = object.selected;
  var preferred = object.preferred;

  $("#noStyle").click(function () {
    noStyle();
    toggleSelected(this);
  }).toggleClass("selected", selected == id);

  $("#defaultStyle").click(function () {
    switchStyle(preferred);
    toggleSelected(this);
  }).toggleClass("selected", selected == preferred);

  var ul = $("#menu > ul");

  $.each(alternates, function (i, e) {
    var li = $('<li>');
    var a = $('<a href="javascript:;">' + e + '</a>');

    a.click(function () {
      switchStyle(e);
      toggleSelected(this);
    }).toggleClass("selected", selected == e);

    ul.append(li.append(a));
  });
}

$(document).ready(function () {
  tabs.getSelected(null, function (tab) {
    contextTab = tab;

    tabs.sendRequest(tab.id, {"type": "detail"}, initialize);
  });
});
