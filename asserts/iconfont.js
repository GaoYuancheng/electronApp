!(function (e) {
  var t,
    n,
    o,
    i,
    c,
    d,
    l =
      '<svg><symbol id="icon-stop" viewBox="0 0 1024 1024"><path d="M512 0c-282.784 0-512 229.216-512 512s229.216 512 512 512 512-229.216 512-512-229.216-512-512-512zM512 928c-229.76 0-416-186.24-416-416s186.24-416 416-416 416 186.24 416 416-186.24 416-416 416zM320 320l384 0 0 384-384 0z"  ></path></symbol><symbol id="icon-ok" viewBox="0 0 1024 1024"><path d="M886.745 249.567c-12.864-12.064-33.152-11.488-45.217 1.408L414.776 705.344l-233.12-229.696c-12.608-12.416-32.864-12.288-45.28 0.32-12.416 12.575-12.256 32.863 0.352 45.248l256.48 252.672c0.096 0.096 0.224 0.128 0.319 0.224 0.097 0.096 0.129 0.224 0.225 0.32 2.016 1.92 4.448 3.008 6.784 4.288 1.151 0.672 2.144 1.664 3.359 2.144 3.776 1.472 7.776 2.24 11.744 2.24 4.192 0 8.384-0.832 12.288-2.496 1.313-0.544 2.336-1.664 3.552-2.368 2.4-1.408 4.896-2.592 6.944-4.672 0.096-0.096 0.128-0.256 0.224-0.352 0.064-0.097 0.192-0.129 0.288-0.225l449.185-478.208C900.28 281.951 899.608 261.695 886.745 249.567z"  ></path></symbol><symbol id="icon-baseline-close-px" viewBox="0 0 1024 1024"><path d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"  ></path></symbol></svg>',
    s = (s = document.getElementsByTagName("script"))[
      s.length - 1
    ].getAttribute("data-injectcss");
  if (s && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function a() {
    c || ((c = !0), o());
  }
  (t = function () {
    var e, t, n, o;
    ((o = document.createElement("div")).innerHTML = l),
      (l = null),
      (n = o.getElementsByTagName("svg")[0]) &&
        (n.setAttribute("aria-hidden", "true"),
        (n.style.position = "absolute"),
        (n.style.width = 0),
        (n.style.height = 0),
        (n.style.overflow = "hidden"),
        (e = n),
        (t = document.body).firstChild
          ? ((o = e), (n = t.firstChild).parentNode.insertBefore(o, n))
          : t.appendChild(e));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener("DOMContentLoaded", n, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", n, !1))
      : document.attachEvent &&
        ((o = t),
        (i = e.document),
        (c = !1),
        (d = function () {
          try {
            i.documentElement.doScroll("left");
          } catch (e) {
            return void setTimeout(d, 50);
          }
          a();
        })(),
        (i.onreadystatechange = function () {
          "complete" == i.readyState && ((i.onreadystatechange = null), a());
        }));
})(window);
