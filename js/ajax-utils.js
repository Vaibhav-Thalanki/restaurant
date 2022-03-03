document.addEventListener("DOMContentLoaded", function (event) {
  (function (global) {
    var ajaxutils = {};
    function returnXMLHttpObject() {
      if (global.XMLHttpRequest) {
        return new XMLHttpRequest();
      } else {
        global.alert("AJAX not supported");
        return null;
      }
    }

    ajaxutils.sendreq = function (requrl, responsehandler, isitjson) {
      var req = returnXMLHttpObject();
      req.onreadystatechange = function () {
        handleresponses(req, responsehandler, isitjson);
      };
      req.open("GET", requrl, true);
      req.send(null);
    };
    function handleresponses(req, responsehandler, isitjson) {
      if (req.status == 200 && req.readyState == 4) {
        if (isitjson == undefined) isitjson = true; // default format is json

        if (!isitjson) responsehandler(req.responseText);
        else responsehandler(JSON.parse(req.responseText));
      }
    }

    global.$ajaxutils = ajaxutils;
  })(window);
});
