var i18n = chrome.i18n.getMessage;

$(document).ready(function () {
  var $alwaysShowIcon = $("#alwaysShowIcon");
  $alwaysShowIcon.attr("checked", localStorage["alwaysShowIcon"] == "1");

  $("h1").text(document.title = i18n("titleSettings"));

  $("label[for=alwaysShowIcon]").text(i18n("labelAlwaysShowIcon"));

  $("input[type=button]").val(i18n("buttonSave")).click(function () {
    localStorage["alwaysShowIcon"] = $alwaysShowIcon.attr("checked") ? "1" : "0";
    window.alert(i18n("messageSettingsSaved"));
  });
});
