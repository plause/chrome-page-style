(function () {
  var links = document.getElementsByTagName("link");
  var detail = {"default": document.selectedStylesheetSet, "styles": []};

  /*
   * persistent stylesheets will be disabled if they are inner stylesheets in
   * the disabled stylesheets. (loaded by '@import').
   *
   * this function will fix the issue by re-enable all persistent stylesheets.
   */
  function enablePersistentStylesheets() {
    for (var i = 0, j = links.length; i < j; i++) {
      var link = links.item(i);
      var rel = link.getAttribute("rel");
      var title = link.getAttribute("title");

      // no title or not alternate
      if (!title || rel.toLowerCase().indexOf("alternate") == -1) {
        link.disabled = true;
        link.disabled = false;
      }
    }
  }

  function switchStylesheetSet(name) {
    for (var i = 0, j = links.length; i < j; i++) {
      var link = links.item(i);
      var rel = link.getAttribute("rel");
      var title = link.getAttribute("title");

      // has a title
      if (title && rel.toLowerCase().indexOf("stylesheet") > -1) {
        link.disabled = true;
        link.disabled = title != name;
      }
    }

    enablePersistentStylesheets();
  }

  function refreshStylesheetDetail() {
    var styles = detail.styles;

    styles.length = 0;

    for (var i = 0, j = links.length; i < j; i++) {
      var link = links.item(i);
      var rel = link.getAttribute("rel");
      var title = link.getAttribute("title");

      // has a title
      if (title && rel.toLowerCase().indexOf("stylesheet") > -1) {
        styles.push(title);
      }
    }

    var newStyles = [];

    for (var i = 0, j = styles.length; i < j; i++) {
      if (newStyles.indexOf(styles[i]) == -1) {
        newStyles.push(styles[i]);
      }
    }

    detail.styles = newStyles;
  }

  function onRequest(request, sender, sendResponse) {
    if (request.type == "detail") {
      refreshStylesheetDetail();
      sendResponse(detail);
    } else if (request.type == "switch") {
      switchStylesheetSet(request.style);
      sendResponse({});
    }
  }

  console.log(document.readyState);

  refreshStylesheetDetail();
  switchStylesheetSet(detail["default"]);

  chrome.extension.sendRequest(detail);
  chrome.extension.onRequest.addListener(onRequest);
})();
