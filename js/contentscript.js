(function () {
  var alternate = /alternat(e|ive)/i;
  var stylesheet = /stylesheet/i;

  var detail = {"default": document.selectedStylesheetSet};

  function switchStylesheet(name) {
    $("link").each(function () {
      var link = $(this);
      var title = link.attr("title");

      if (stylesheet.test(link.attr("rel")) && title) {
        link.attr("disabled", true).attr("disabled", title != name);
      }
    }).each(function () {
      var link = $(this);
      // enable persistent stylesheet
      // a persistent stylesheet is a stylesheet without title
      if (stylesheet.test(link.attr("rel")) && !link.attr("title")) {
        link.attr("disabled", true).attr("disabled", false);
      }
    });
  }

  function refreshStylesheets() {
    var flag = {};
    var styles = detail.styles = [];

    $("link").each(function () {
      var link = $(this);
      var title = link.attr("title");

      if (stylesheet.test(link.attr("rel")) && title) {
        if (!flag[title] && (flag[title] = true)) {
          styles.push(title);
        }
      }
    });

    detail.selected = document.selectedStylesheetSet;
  }

  function onRequest(request, sender, sendResponse) {
    if (request.type == "detail") {
      refreshStylesheets();
      sendResponse(detail);
    } else if (request.type == "switch") {
      switchStylesheet(request.style);
      sendResponse({"result": true});
    }
  }

  if (detail["default"] != null) {
    switchStylesheet(detail["default"]);
  }

  refreshStylesheets();

  chrome.extension.sendRequest(detail);
  chrome.extension.onRequest.addListener(onRequest);
})(jQuery);
