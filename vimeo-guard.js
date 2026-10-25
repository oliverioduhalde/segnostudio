/* vimeo-guard.js — auto-recover Vimeo embeds that fail to load.
   When a page opens many Vimeo players at once, Vimeo sometimes answers one
   of them with "Sorry, This video does not exist." even though the video is
   fine (a reload fixes it). This watches every player.vimeo.com iframe: after
   it loads we ping it; a healthy player answers (ready / ping). If it does not
   answer in time, or reports a ready error, the iframe is reloaded with
   back-off, up to MAX_TRIES times. Load this in <head>, before other scripts. */
(function () {
  "use strict";
  var ORIGIN = "https://player.vimeo.com";
  var RE = /^https:\/\/player\.vimeo\.com\/video\//;
  var TIMEOUT = 5000;          // ms after load to wait for the player to answer (grows per retry)
  var MAX_TRIES = 4;
  var frames = new Set();
  var state = new WeakMap();   // iframe -> { base, tries, ok, timer }

  function baseSrc(src) { return src.replace(/([?&])_vr=\d+&?/, "$1").replace(/[?&]$/, ""); }

  function retry(f) {
    var s = state.get(f);
    if (!s || !f.isConnected || s.tries >= MAX_TRIES) return;
    s.tries += 1;
    var n = s.tries;
    setTimeout(function () {
      if (!f.isConnected || baseSrc(f.src) !== s.base) return;
      f.src = s.base + (s.base.indexOf("?") < 0 ? "?" : "&") + "_vr=" + n;
    }, 700 * Math.pow(2, n - 1));
  }

  function onFrameLoad(f) {
    var src = f.src || "";
    if (!RE.test(src)) return;
    var base = baseSrc(src);
    var s = state.get(f);
    if (!s || s.base !== base) { s = { base: base, tries: 0 }; state.set(f, s); }
    s.ok = false;
    frames.add(f);
    try { f.contentWindow.postMessage({ method: "ping" }, ORIGIN); } catch (e) {}
    clearTimeout(s.timer);
    s.timer = setTimeout(function () {
      if (!s.ok && f.isConnected && baseSrc(f.src) === base) retry(f);
    }, TIMEOUT * (s.tries + 1));
  }

  // load events don't bubble, but they can be captured at the document
  document.addEventListener("load", function (e) {
    if (e.target && e.target.tagName === "IFRAME") onFrameLoad(e.target);
  }, true);

  window.addEventListener("message", function (e) {
    if (e.origin !== ORIGIN) return;
    var d = e.data;
    if (typeof d === "string") { try { d = JSON.parse(d); } catch (err) { return; } }
    if (!d) return;
    var ok = d.event === "ready" || d.method === "ping";
    var bad = d.event === "error" && d.data && d.data.method === "ready";
    if (!ok && !bad) return;
    frames.forEach(function (f) {
      if (!f.isConnected) { frames.delete(f); return; }
      if (f.contentWindow !== e.source) return;
      var s = state.get(f);
      if (!s) return;
      if (ok) { s.ok = true; clearTimeout(s.timer); }
      else { clearTimeout(s.timer); retry(f); }
    });
  });
})();
