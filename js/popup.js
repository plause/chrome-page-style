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
function closePopup() {
  if (localStorage["closePopupAfterSwitch"] == "1") {
    window.close();
  }
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
  var value = object.preferredValue;

  $("#noStyle").text(i18n("menuNoStyle")).click(function () {
    noStyle();
    toggleSelected(this);
    closePopup();
  }).toggleClass("selected", selected == id);

  $("#defaultStyle").text(i18n("menuDefaultStyle")).click(function () {
    switchStyle(preferred);
    toggleSelected(this);
    closePopup();
  }).toggleClass("selected", selected == preferred);

  if (value != null) {
    $("#defaultStyle").text(value + " (" + i18n("styleDefault") + ")");
  }

  var ul = $("#menu > ul");

  $.each(alternates, function (i, e) {
    var li = $('<li>');
    var a = $('<a href="javascript:;">' + e + '</a>');

    a.click(function () {
      switchStyle(e);
      toggleSelected(this);
      closePopup();
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
