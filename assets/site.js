/* Stage switcher, stream rendering, doors. Plain JS, no build step. */
(function () {
  var cfg = window.MATH_CONFIG;
  var KEY = "math.stage";

  function getStage() {
    var s = null;
    try { s = localStorage.getItem(KEY); } catch (e) {}
    var ok = cfg.stages.some(function (st) { return st.id === s; });
    return ok ? s : null;
  }
  function setStage(id) {
    try { localStorage.setItem(KEY, id); } catch (e) {}
    render();
  }
  function stageLabel(id) {
    var st = cfg.stages.filter(function (s) { return s.id === id; })[0];
    return st ? st.label : "";
  }

  function renderSwitcher() {
    var host = document.querySelector("[data-stages]");
    if (!host) return;
    var cur = getStage();
    host.innerHTML = "";
    var lede = document.createElement("span");
    lede.className = "lede";
    lede.textContent = cur ? "Your stage:" : "Where are you?";
    host.appendChild(lede);
    cfg.stages.forEach(function (st) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "stage-btn" + (st.id === "separated" ? " separated" : "");
      b.textContent = st.label;
      b.setAttribute("aria-pressed", String(st.id === cur));
      b.addEventListener("click", function () { setStage(st.id); });
      host.appendChild(b);
    });
  }

  function renderStreams() {
    var cur = getStage();
    document.querySelectorAll("[data-stream]").forEach(function (el) {
      var room = el.getAttribute("data-stream");
      var h = document.createElement("h3");
      var who = document.createElement("p"); who.className = "who";
      var body = document.createElement("p"); body.className = "empty";
      el.innerHTML = "";

      if (!cur) {
        h.textContent = "The stream for this room";
        who.textContent = "Pick your stage at the top and the right stream opens here.";
        el.appendChild(h); el.appendChild(who);
        return;
      }
      var s = (cfg.streams[room] || {})[cur];
      h.textContent = s && s.label ? s.label : "Stream";
      el.appendChild(h);
      if (s && s.url) {
        who.textContent = s.who || ("Men at the " + stageLabel(cur).toLowerCase() + " stage.");
        el.appendChild(who);
        var a = document.createElement("a");
        a.className = "join"; a.href = s.url; a.rel = "noopener"; a.target = "_blank";
        a.textContent = /chat\.whatsapp\.com/.test(s.url) ? "Join on WhatsApp" : "Join the stream";
        el.appendChild(a);
      } else {
        who.textContent = "Not open yet.";
        el.appendChild(who);
        body.textContent = "A stream opens when enough men at this stage ask for it. Asking takes one line.";
        el.appendChild(body);
        var ask = document.createElement("a");
        ask.className = "join secondary"; ask.href = cfg.contact;
        ask.textContent = "Ask to open it";
        el.appendChild(ask);
      }
    });
  }

  function renderDoors() {
    var host = document.querySelector("[data-plan]");
    if (!host) return;
    host.innerHTML = "";
    var cur = getStage();
    cfg.rooms.forEach(function (r) {
      var a = document.createElement("a");
      a.href = r.href;
      var top = document.createElement("div");
      var name = document.createElement("div"); name.className = "room-name"; name.textContent = r.label;
      var what = document.createElement("p"); what.className = "room-what"; what.textContent = r.what;
      top.appendChild(name); top.appendChild(what);
      var live = document.createElement("div"); live.className = "room-live";
      var s = cur ? (cfg.streams[r.id] || {})[cur] : null;
      if (s && s.url) { live.innerHTML = "<b>Stream open</b>" + (s.who ? " · " + s.who : ""); }
      else if (cur) { live.textContent = "Stream not open yet"; }
      else { live.textContent = ""; }
      a.appendChild(top); a.appendChild(live);
      host.appendChild(a);
    });
  }

  function renderMeetups() {
    var host = document.querySelector("[data-meetups]");
    if (!host) return;
    host.innerHTML = "";
    if (!cfg.meetups.length) {
      var p = document.createElement("p");
      p.textContent = "No nights listed yet. The first one is whichever town has a man willing to book a back room and turn up twice.";
      host.appendChild(p);
      return;
    }
    var ul = document.createElement("ul");
    cfg.meetups.forEach(function (m) {
      var li = document.createElement("li");
      var txt = m.town + ": " + m.when + ", " + m.where + (m.note ? ". " + m.note : "");
      if (m.url) { var a = document.createElement("a"); a.href = m.url; a.textContent = txt; li.appendChild(a); }
      else { li.textContent = txt; }
      ul.appendChild(li);
    });
    host.appendChild(ul);
  }

  function markCurrentDoor() {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".doors a").forEach(function (a) {
      if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
    });
  }

  function render() {
    renderSwitcher();
    renderStreams();
    renderDoors();
    renderMeetups();
  }

  window.MATH_render = render;
  document.addEventListener("DOMContentLoaded", function () {
    markCurrentDoor();
    render();
  });
})();
