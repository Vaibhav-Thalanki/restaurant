(function (global) {
  var homeHtml = "snippets/main-content-snippet.html";

  document.addEventListener("DOMContentLoaded", function (event) {
    $ajaxutils.sendreq(
      homeHtml,
      function (responseText) {
        document.querySelector("#mainContent").innerHTML = responseText;
      },
      false
    );
  });
  function show_loader() {
    var html = "<div class='text-center'>";
    html +=
      "<img src='assets/ajax-loader.gif' height = '200px' width='200px' ><br><br></div>";
    document.querySelector("#mainContent").innerHTML = html;
  }
  function change_active() {
    var classes = document.querySelector("a#home-nav").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("a#home-nav").className = classes;
    classes = document.getElementById("menu-nav").className;
    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.getElementById("menu-nav").className = classes;
    }
  }
  var dc = {};
  function replacedata(content, oldword, newword) {
    if (newword == undefined || newword == null) {
      newword = "";
    }
    var oldword2 = "{{" + oldword + "}}";

    var result = content.replace(new RegExp(oldword2, "g"), newword);

    return result;
  }
  function dorest(fin) {
    var arobj = {};
    $ajaxutils.sendreq(
      backend,
      function (response) {
        arobj = response;
        dorestall(fin, arobj);
      },
      true
    );
  }
  function dorestall(fin2, arobj) {
    var menu = {};
    $ajaxutils.sendreq(
      menuHtml,
      function (res) {
        menu = res;
        for (var i in arobj) {
          temp = "";

          temp = replacedata(menu, "name", arobj[i]["name"]);
          temp = replacedata(temp, "short_name", arobj[i]["short_name"]);
          fin2 += temp;
        }
        fin2 += "</section>";
        document.querySelector("#mainContent").innerHTML = fin2;
      },
      false
    );
  }
  var menutitle = "snippets/menu-category-title-snippet.html";
  var menuHtml = "snippets/menu-category-snippet.html";
  var backend = "https://davids-restaurant.herokuapp.com/categories.json";
  dc.loadmenu = function () {
    show_loader();
    change_active();

    var final = "";
    $ajaxutils.sendreq(
      menutitle,
      function (response) {
        final += response;
        final += "<section class='row'>";
        dorest(final);
      },
      false
    );
  };

  var singletitle = "snippets/single-title-snippet.html";
  var singleHtml = "snippets/single-snippet.html";
  var backend2 =
    "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  function dorestall2(response, final2) {
    $ajaxutils.sendreq(
      singleHtml,
      function (r1) {
        var eachitem = response.menu_items;

        for (var i in eachitem) {
          var r = r1;
          r = replacedata(r, "short_name", eachitem[i].short_name);
          r = replacedata(r, "name", eachitem[i].name);
          r = replacedata(r, "description", eachitem[i].description);
          r = replacedata(r, "price_small", eachitem[i].price_small);
          r = replacedata(r, "price_large", eachitem[i].price_large);
          r = replacedata(
            r,
            "small_portion_name",
            eachitem[i].small_portion_name
          );
          r = replacedata(
            r,
            "large_portion_name",
            eachitem[i].large_portion_name
          );
          r = replacedata(r, "catShortName", response.category.short_name);
          final2 += r;
        }
        final2 += "</section>";
        document.querySelector("#mainContent").innerHTML = final2;
      },
      false
    );
  }

  function dorest2(response) {
    var final2 = "";
    $ajaxutils.sendreq(
      singletitle,
      function (res) {
        res = replacedata(res, "name", response.category.name);
        res = replacedata(
          res,
          "special_instructions",
          response.category.special_instructions
        );
        final2 += res;
        final2 += "<section class='row'>";
        dorestall2(response, final2);
      },
      false
    );
  }
  dc.loadmenuitems = function (category) {
    show_loader();
    change_active();
    $ajaxutils.sendreq(
      backend2 + category,
      function (response) {
        dorest2(response);
      },
      true
    );
  };
  global.$dc = dc;
})(window);
