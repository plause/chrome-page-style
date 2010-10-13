(function () {
  var alternate = /alternate/i;
  var stylesheet = /stylesheet/i;

  function isAlternate(link) {
    return alternate.test($(link).attr("rel"));
  }

  function isStylesheet(link) {
    return stylesheet.test($(link).attr("rel"));
  }

  function isAlternateStylesheet(link) {
    return isStylesheet(link) && isAlternate(link);
  }

  function isPersistentStylesheet(link) {
    return isStylesheet(link) && !isAlternate(link) && !$(link).attr("title");
  }

  function isPageStyle(link) {
    return isStylesheet(link) && $(link).attr("title");
  }

  function toggleSheet(sheet, toggle) {
    sheet.disabled = toggle;
    sheet.disabled = toggle;
  }

  function toggleLinkedStyles(toggle) {
    $("link").each(function () {
      if (isStylesheet(this)) {
        toggleSheet(this, true);
      }
    });
  }

  function toggleEmbeddedStyles(toggle) {
    $("style").each(function () {
      toggleSheet(this.sheet, toggle);
    });
  }

  function toggleInlineStyles(toggle) {
    $("*").each(function () {
      if (toggle) {
        if (this.style.cssText != "") {
          this.style["chrome-page-style"] = this.style.cssText;
          this.style.cssText = "";
        }
      } else {
        if (this.style["chrome-page-style"]) {
          this.style.cssText = this.style["chrome-page-style"];
          delete this.style["chrome-page-style"];
        }
      }
    });
  }

  /*
   * disable all styles
   */
  function noStyles() {
    toggleLinkedStyles(true);
    toggleEmbeddedStyles(true);
    toggleInlineStyles(true);
  }

  /*
   * if name is specified, switch to it, otherwise do "baisc page style"
   */
  function switchStyle(name) {
    $("link").each(function () {
      var val = name ? $(this).attr("title") != name : isAlternate(this);

      if (isStylesheet(this)) {
        toggleSheet(this, val);
      }
    }).each(function () {
      if (isPersistentStylesheet(this)) {
        toggleSheet(this, false);
      }
    });

    toggleEmbeddedStyles(false);
    toggleInlineStyles(false);
  }

  /*
   *
   */
  function refreshDetail() {
    var flag = {};
    var styles = [];

    $("link").each(function () {
      var title = $(this).attr("title");

      if (isPageStyle(this) && !flag[title] && (flag[title] = true)) {
        styles.push(title);
      }
    });

    return {"styles": styles, "default": document.selectedStylesheetSet};
  }

  function onRequest(request, sender, sendResponse) {
    if (request.type == "detail") {
      sendResponse(refreshDetail());
    } else if (request.type == "switch") {
      sendResponse(switchStyle(request.style));
    } else if (request.type == "none") {
      sendResponse(noStyles());
    }
  }

  chrome.extension.sendRequest(refreshDetail());
  chrome.extension.onRequest.addListener(onRequest);

  // fix chrome
  noStyles();
  switchStyle(document.selectedStylesheetSet);
})(jQuery);
