/**
 * Hero vector-field canvas.
 * A low-opacity field drawn *on top of* the graph-grid hero background.
 * Constrained to the hero container; reduced-motion users see only the grid.
 * Query flag `?motion=off` disables the canvas as a manual override.
 */
export default `(function () {
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) return;

  var url = new URL(window.location.href);
  var motionOff = url.searchParams.get("motion") === "off";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (motionOff || reduced) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var wrap = canvas.parentElement;
  var W = 0;
  var H = 0;
  var particles = [];
  var N = 180;

  var palette = { primary: "#3a4a8f", secondary: "#8f5c08" };

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    var p = cs.getPropertyValue("--secondary").trim();
    if (!p) p = cs.getPropertyValue("--link-color").trim();
    var s = cs.getPropertyValue("--tertiary").trim();
    if (!s) s = cs.getPropertyValue("--accent-mark").trim();
    if (p) palette.primary = p;
    if (s) palette.secondary = s;
  }

  function resize() {
    if (!wrap) return;
    W = Math.max(1, wrap.clientWidth);
    H = Math.max(1, wrap.clientHeight);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function field(x, y) {
    var sx = x * 0.0045;
    var sy = y * 0.0045;
    var dx = Math.cos(sy * 1.5) + Math.sin(sx * 2.0 + sy * 0.7);
    var dy = Math.sin(sx * 1.5) - Math.cos(sy * 2.0 + sx * 0.7);
    var len = Math.sqrt(dx * dx + dy * dy) + 1e-6;
    return { dx: dx / len, dy: dy / len };
  }

  function init() {
    particles = [];
    for (var i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        age: Math.random() * 100,
        hue: Math.random(),
        speed: 0.35 + Math.random() * 0.65,
      });
    }
  }

  function step(dt) {
    for (var i = 0; i < N; i++) {
      var p = particles[i];
      var f = field(p.x - W / 2, p.y - H / 2);
      var targetVx = f.dx * 48 * p.speed;
      var targetVy = f.dy * 48 * p.speed;
      p.vx += (targetVx - p.vx) * 0.04;
      p.vy += (targetVy - p.vy) * 0.04;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.age += dt;

      if (p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40 || p.age > 14) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
        p.vx = 0;
        p.vy = 0;
        p.age = 0;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < N; i++) {
      var p = particles[i];
      var color = p.hue > 0.55 ? palette.primary : palette.secondary;
      var alpha = 0.18 + 0.28 * Math.sin(p.age * 0.7);
      var size = 1.1 + 0.8 * Math.sin(p.age * 1.1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  var onscreen = true;
  var last = 0;
  function frame(t) {
    if (!document.body.contains(canvas)) return;
    var dt = Math.min(0.033, (t - last) / 1000 || 0.016);
    last = t;
    if (onscreen && document.visibilityState === "visible") {
      step(dt);
      draw();
    }
    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onscreen = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(canvas);
  }

  document.addEventListener("themechange", readColors);
  window.addEventListener("resize", function () {
    resize();
    init();
  });

  readColors();
  resize();
  init();
  requestAnimationFrame(frame);
})();`
