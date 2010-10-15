var tabs = chrome.tabs;
var i18n = chrome.i18n.getMessage;

/*
 *
 */
function noStyle() {
  tabs.getSelected(null, function (tab) {
    tabs.sendRequest(tab.id, {"type": "none"});
  });
}

/*
 *
 */
function switchStyle(style) {
  tabs.getSelected(null, function (tab) {
    tabs.sendRequest(tab.id, {"type": "switch", "style": style});
  });
}

/*
 *
 */
function createLink(style) {
  return '<a href="javascript:switchStyle(\'' + style + '\');">' + style + '</a>';
}

$(document).ready(function () {
  tabs.getSelected(null, function (tab) {
    tabs.sendRequest(tab.id, {"type": "detail"}, function (response) {
      var alternates = response.alternates;
      var selected = response.selected;
      var preferred = response.preferred;

      preferred = preferred == null ? "null" : ("'" + preferred + "'");

      var html = ['<ul>'];

      html.push('<li><a style="font-weight: bold;" href="javascript:noStyle();">' + i18n("menuNoStyles") + '</a></li>');
      html.push('<li><a style="font-weight: bold;" href="javascript:switchStyle(' + preferred + ');">' + i18n("styleDefault") + '</a></li>');

      for (var i = 0, j = alternates.length; i < j; i++) {
        html.push('<li>' + createLink(alternates[i]) + '</li>');
      }

      html.push('</ul>');

      $("#menu").html(html.join(""));
    });
  });
});
