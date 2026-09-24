/**
 * PROTOTYPE research script (ticket 08): variant switcher + theme toggle.
 * Both variants are in the DOM; `data-variant` on <html> decides which shows.
 * No simulation on research pages, so no motion readout needed.
 */
export default `(function () {
  var VARIANTS = ["a", "b"];
  var html = document.documentElement;

  function current() {
    var v = html.getAttribute("data-variant") || "a";
    return VARIANTS.indexOf(v) >= 0 ? v : "a";
  }

  function label() {
    var v = current();
    var el = document.querySelector('.research.variant-' + v);
    var name = el ? el.getAttribute("data-variant-name") || "" : "";
    var lb = document.querySelector(".proto-label");
    if (lb) lb.textContent = v.toUpperCase() + (name ? " · " + name : "");
  }

  function setVariant(v) {
    html.setAttribute("data-variant", v);
    var u = new URL(location.href);
    u.searchParams.set("variant", v);
    history.replaceState(null, "", u.toString());
    label();
  }

  var V = null;

  function boot() {
    var p = new URLSearchParams(location.search);
    var v = p.get("variant");
    if (v !== "a" && v !== "b") v = "a";
    html.setAttribute("data-variant", v);
    label();
    wire();
  }

  function wire() {
    var bar = document.querySelector(".proto-bar");
    if (!bar || bar.dataset.wired) return;
    bar.dataset.wired = "1";
    bar.querySelectorAll(".pv").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = VARIANTS.indexOf(current());
        var n = (i + Number(b.dataset.dir) + VARIANTS.length) % VARIANTS.length;
        setVariant(VARIANTS[n]);
      });
    });
    bar.querySelector(".proto-theme").addEventListener("click", function (e) {
      e.preventDefault();
      var dark = html.getAttribute("saved-theme") === "dark";
      var u = new URL(location.href);
      if (dark) { u.searchParams.delete("dark"); } else { u.searchParams.set("dark", "1"); }
      localStorage.setItem("theme", dark ? "light" : "dark");
      location.href = u.toString();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var t = document.activeElement;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    var i = VARIANTS.indexOf(current());
    var dir = e.key === "ArrowRight" ? 1 : -1;
    var n = (i + dir + VARIANTS.length) % VARIANTS.length;
    setVariant(VARIANTS[n]);
  });

  boot();
  document.addEventListener("nav", boot); // Quartz SPA: re-resolve on every navigation
})();`
