var i18n = chrome.i18n.getMessage;

$(document).ready(function () {
  var $fixChrome = $("#fixChrome");
  $fixChrome.attr("checked", localStorage["fixChrome"] == "1");

  var $alwaysShowIcon = $("#alwaysShowIcon");
  $alwaysShowIcon.attr("checked", localStorage["alwaysShowIcon"] == "1");

  var $rememberSelected = $("#rememberSelected");
  $rememberSelected.attr("checked", localStorage["rememberSelected"] == "1");

  var $closePopupAfterSwitch = $("#closePopupAfterSwitch");
  $closePopupAfterSwitch.attr("checked", localStorage["closePopupAfterSwitch"] == "1");

  $("h1").text(document.title = i18n("titleSettings"));

  $("label[for=fixChrome]").text(i18n("labelFixChrome"));
  $("label[for=fixChrome] + p").text(i18n("noteFixChrome"));
  $("label[for=alwaysShowIcon]").text(i18n("labelAlwaysShowIcon"));
  $("label[for=alwaysShowIcon] + p").text(i18n("noteAlwaysShowIcon"));
  $("label[for=rememberSelected]").text(i18n("labelRememberSelected"));
  $("label[for=rememberSelected] + p").text(i18n("noteRememberSelected"));
  $("label[for=closePopupAfterSwitch]").text(i18n("labelClosePopupAfterSwitch"));
  $("label[for=closePopupAfterSwitch] + p").text(i18n("noteClosePopupAfterSwitch"));

  $("input[type=button]").val(i18n("buttonSave")).click(function () {
    localStorage["fixChrome"] = $fixChrome.attr("checked") ? "1" : "0";
    localStorage["alwaysShowIcon"] = $alwaysShowIcon.attr("checked") ? "1" : "0";
    localStorage["rememberSelected"] = $rememberSelected.attr("checked") ? "1" : "0";
    localStorage["closePopupAfterSwitch"] = $closePopupAfterSwitch.attr("checked") ? "1" : "0";
    window.alert(i18n("messageSettingsSaved"));
  });
});
