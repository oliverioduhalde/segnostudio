/* vimeo-guard.js — auto-recover Vimeo embeds that fail to load, and never show
   the failure.
   When a page opens many Vimeo players at once, Vimeo sometimes answers one
   of them with "Sorry, This video does not exist." even though the video is
   fine (a reload fixes it). Every player.vimeo.com iframe is kept invisible
   (a still of the video is shown behind it instead) until the player proves
   it has the video: it answers getDuration with a real duration, or starts
   playing. If that doesn't happen in time, or the player reports an error,
   the iframe is reloaded with back-off, up to MAX_TRIES times, still hidden.
   Load this in <head>, before other scripts. */
(function () {
  "use strict";
  var ORIGIN = "https://player.vimeo.com";
  var RE = /^https:\/\/player\.vimeo\.com\/video\/(\d+)/;
  var TIMEOUT = 6000;          // ms after load to wait for the video (grows per retry)
  var MAX_TRIES = 6;
  var WAIT = "vg-wait";
  var frames = new Set();
  var state = new WeakMap();   // iframe -> { base, tries, ok, timer }
  var thumbs = {};             // "id/hash" -> Promise<thumbnail url | "">

  var css = document.createElement("style");
  css.textContent = "iframe." + WAIT + "{opacity:0!important}";
  (document.head || document.documentElement).appendChild(css);

  function baseSrc(src) { return src.replace(/([?&])_vr=\d+&?/, "$1").replace(/[?&]$/, ""); }

  function send(f, method, value) {
    try { f.contentWindow.postMessage(value === undefined ? { method: method } : { method: method, value: value }, ORIGIN); } catch (e) {}
  }

  // still of the video behind the (hidden) iframe, from Vimeo's oEmbed
  function poster(f) {
    var m = RE.exec(f.src || ""), p = f.parentElement;
    if (!m || !p) return;
    var h = /[?&]h=([0-9a-f]+)/.exec(f.src);
    var key = m[1] + (h ? "/" + h[1] : "");
    if (p.dataset.vgPoster === key && p.style.backgroundImage) return;
    p.dataset.vgPoster = key;
    if (!thumbs[key]) {
      thumbs[key] = fetch("https://vimeo.com/api/oembed.json?width=1280&url=" +
          encodeURIComponent("https://vimeo.com/" + key))
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (d) { return (d && d.thumbnail_url) || ""; })
        .catch(function () { return ""; });
    }
    thumbs[key].then(function (url) {
      if (!url || p.dataset.vgPoster !== key) return;
      if (p.dataset.vgBg !== "1" && getComputedStyle(p).backgroundImage !== "none") return;
      p.dataset.vgBg = "1";
      p.style.backgroundImage = 'url("' + url + '")';
      p.style.backgroundSize = "cover";
      p.style.backgroundPosition = "center";
      p.style.backgroundRepeat = "no-repeat";
    });
  }

  function watch(f) {
    if (f.tagName !== "IFRAME" || !RE.test(f.src || "")) return;
    var s = state.get(f);
    if (s && s.ok && s.base === baseSrc(f.src)) return;
    f.classList.add(WAIT);
    poster(f);
  }

  function reveal(f, s) {
    s.ok = true;
    clearTimeout(s.timer);
    f.classList.remove(WAIT);
  }

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
    f.classList.add(WAIT);
    poster(f);
    frames.add(f);
    send(f, "ping");
    send(f, "getDuration");
    clearTimeout(s.timer);
    s.timer = setTimeout(function () {
      if (!s.ok && f.isConnected && baseSrc(f.src) === base) retry(f);
    }, TIMEOUT * (s.tries + 1));
  }

  // iframes as they are added (parser or script) or get a new src
  new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === "attributes") { watch(m.target); return; }
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === "IFRAME") watch(n);
        else if (n.querySelectorAll) n.querySelectorAll("iframe").forEach(watch);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

  // load events don't bubble, but they can be captured at the document
  document.addEventListener("load", function (e) {
    if (e.target && e.target.tagName === "IFRAME") onFrameLoad(e.target);
  }, true);

  window.addEventListener("message", function (e) {
    if (e.origin !== ORIGIN) return;
    var d = e.data;
    if (typeof d === "string") { try { d = JSON.parse(d); } catch (err) { return; } }
    if (!d) return;
    var hello = d.event === "ready" || d.method === "ping";
    var good = (d.method === "getDuration" && d.value > 0) ||
               d.event === "play" || d.event === "playProgress" || d.event === "timeupdate";
    var bad = d.event === "error" && d.data && d.data.method === "ready";
    if (!hello && !good && !bad) return;
    frames.forEach(function (f) {
      if (!f.isConnected) { frames.delete(f); return; }
      if (f.contentWindow !== e.source) return;
      var s = state.get(f);
      if (!s || s.ok) return;
      if (good) reveal(f, s);
      else if (hello) {
        // the player answered; now ask whether it actually has the video
        send(f, "addEventListener", "playProgress");
        send(f, "getDuration");
      } else { clearTimeout(s.timer); retry(f); }
    });
  });
})();
