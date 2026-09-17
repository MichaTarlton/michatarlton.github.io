/**
 * PROTOTYPE landing script: variant switcher + ambient vector field.
 * The field is drawn on whichever canvas the active variant exposes
 * (A: hero band, C: whole page). B has no canvas. Reduced-motion → static.
 */
export default `(function () {
  var VARIANTS = ["a", "b", "c"];
  var html = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = 0;

  function current() {
    var v = html.getAttribute("data-variant") || "a";
    return VARIANTS.indexOf(v) >= 0 ? v : "a";
  }

  function label() {
    var v = current();
    var el = document.querySelector(".landing.variant-" + v);
    var name = el ? el.getAttribute("data-variant-name") : "";
    var lab = document.querySelector(".proto-label");
    if (lab) lab.textContent = v.toUpperCase() + (name ? " · " + name : "");
  }

  function setVariant(v) {
    html.setAttribute("data-variant", v);
    var u = new URL(location.href);
    u.searchParams.set("variant", v);
    history.replaceState(null, "", u.toString());
    label();
    startField();
  }

  function cycle(dir) {
    var i = VARIANTS.indexOf(current());
    setVariant(VARIANTS[(i + dir + VARIANTS.length) % VARIANTS.length]);
  }

  var bar = document.querySelector(".proto-bar");
  if (bar) {
    bar.querySelector(".proto-prev").addEventListener("click", function () { cycle(-1); });
    bar.querySelector(".proto-next").addEventListener("click", function () { cycle(1); });
    bar.querySelector(".proto-theme").addEventListener("click", function (e) {
      e.preventDefault();
      var dark = html.getAttribute("saved-theme") === "dark";
      var u = new URL(location.href);
      if (dark) { u.searchParams.delete("dark"); } else { u.searchParams.set("dark", "1"); }
      localStorage.setItem("theme", dark ? "light" : "dark");
      location.href = u.toString();
    });
    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    });
  }
  label();

  // ── Ambient vector field ─────────────────────────────────────
  function startField() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    var v = current();
    var canvas = document.querySelector(".landing.variant-" + v + " canvas.field-canvas");
    if (!canvas || reduced) return;
    var mode = canvas.getAttribute("data-field"); // hero | page
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, particles = [];
    var N = mode === "page" ? 420 : 260;
    var ink = "#3a4a8f", mark = "#a8690e";

    function readColors() {
      var cs = getComputedStyle(html);
      var a = cs.getPropertyValue("--secondary").trim();
      var b = cs.getPropertyValue("--accent-mark").trim();
      if (a) ink = a; if (b) mark = b;
    }
    function resize() {
      var host = mode === "page" ? { clientWidth: window.innerWidth, clientHeight: window.innerHeight } : canvas.parentElement;
      W = Math.max(1, host.clientWidth); H = Math.max(1, host.clientHeight);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
    }
    function field(x, y, t) {
      var sx = x * 0.006, sy = y * 0.006;
      var dx = Math.cos(sy * 1.6 + t * 0.15) + Math.sin(sx * 1.9 + sy * 0.6);
      var dy = Math.sin(sx * 1.4 - t * 0.12) - Math.cos(sy * 2.1 + sx * 0.7);
      var l = Math.hypot(dx, dy) + 1e-6;
      return [dx / l, dy / l];
    }
    function spawn(p) {
      p.x = Math.random() * W; p.y = Math.random() * H;
      p.px = p.x; p.py = p.y; p.age = 0; p.life = 4 + Math.random() * 6;
      p.speed = 18 + Math.random() * 26; p.mark = Math.random() < 0.18;
    }
    function init() { particles = []; for (var i = 0; i < N; i++) { var p = {}; spawn(p); p.age = Math.random() * p.life; particles.push(p); } }

    var last = 0, T = 0, onscreen = true;
    function frame(t) {
      if (!document.body.contains(canvas)) return;
      var dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t; T += dt;
      if (onscreen && document.visibilityState === "visible") {
        // fade previous frame toward transparent → soft trails
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0," + (mode === "page" ? 0.06 : 0.09) + ")";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "round";
        for (var i = 0; i < N; i++) {
          var p = particles[i];
          var f = field(p.x - W / 2, p.y - H / 2, T);
          p.px = p.x; p.py = p.y;
          p.x += f[0] * p.speed * dt; p.y += f[1] * p.speed * dt; p.age += dt;
          var k = Math.sin(Math.PI * Math.min(1, p.age / p.life));
          ctx.globalAlpha = (mode === "page" ? 0.22 : 0.55) * k;
          ctx.strokeStyle = p.mark ? mark : ink;
          ctx.lineWidth = p.mark ? 1.6 : 1.1;
          ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
          if (p.age > p.life || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) spawn(p);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { onscreen = en[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener("themechange", readColors);
    window.addEventListener("resize", function () { resize(); init(); });
    readColors(); resize(); init();
    raf = requestAnimationFrame(frame);
  }
  startField();
})();`
