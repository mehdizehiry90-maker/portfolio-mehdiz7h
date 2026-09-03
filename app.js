const PAGE = 6;
let SITE = null;
let shown = PAGE;
let lbIndex = 0;
let visibleCards = [];

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}
function rich(s, w) {
  let t = esc(s).replace(/\n/g, "<br>");
  t = t.replace(/\[\[(\d{3}):([\s\S]*?)\]\]/g, '<span style="font-weight:$1">$2</span>');
  if (w) t = `<span style="font-weight:${esc(w)}">${t}</span>`;
  return t;
}
function set(id, v) {
  const el = document.getElementById(id);
  if (el && v != null) el.textContent = v;
}
function setRich(id, s, w) {
  const el = document.getElementById(id);
  if (!el || s == null) return;
  el.innerHTML = rich(s, w);
}
function webp(src) {
  return String(src || "").replace(/\.(jpe?g|png)$/i, ".webp");
}
function catLabel(c) {
  return c === "yt" ? "YouTube" : c === "cover" ? "Cover" : "Social";
}

function applySite(s) {
  SITE = s;
  document.title = `${s.brand || "mehdiz7h"} — Graphic Designer`;
  const root = document.documentElement;
  if (s.theme) {
    root.style.setProperty("--bg", s.theme.bg);
    root.style.setProperty("--ink", s.theme.ink);
    root.style.setProperty("--mute", s.theme.mute);
    root.style.setProperty("--acc", s.theme.acc);
  }
  const h = s.hero || {};
  const W = s.weights || {};
  const logo = s.logo || "images/logo.png";
  const limg = document.getElementById("logoimg");
  if (limg) limg.src = logo;
  const fav = document.getElementById("favicon");
  if (fav) fav.href = logo;
  set("brand", s.brand);
  set("eyebrow_en", h.eyebrow_en || "Graphic Designer");
  setRich("line1", h.line1, W.line1);
  setRich("line2", h.line2, W.line2);
  setRich("line3", h.line3, W.line3);
  set("hero_meta", h.meta);
  set("work_kicker", h.work_kicker || "Selected Work");
  set("work_title", h.work_title || "پروژه‌ها");
  set("kicker", s.about.kicker);
  document.getElementById("about_title").innerHTML =
    `${esc(s.about.title_before)} <em>${esc(s.about.name)}</em> ${esc(s.about.title_after)}`;
  setRich("bio", s.about.bio, W.bio);
  document.getElementById("tags").innerHTML = (s.about.tags || [])
    .map((t) => `<li>${esc(t)}</li>`).join("");
  set("fleft", s.footer.left);
  set("fright", s.footer.right);

  const works = s.works || [];
  const featured = works.filter((w) => w.featured).slice(0, 4);
  const heroWorks = featured.length ? featured : works.slice(0, 4);
  const art = document.getElementById("hero_art");
  if (art) {
    art.innerHTML = heroWorks.map((w) =>
      `<a href="/work/${esc(w.id)}" data-ratio="${esc(w.ratio || "1-1")}"><img src="${esc(webp(w.src))}" alt="${esc(w.title)}" loading="eager" onerror="this.src=this.src.replace('.webp','.jpg')" /></a>`
    ).join("");
  }

  const c = s.contact || {};
  set("contact_kicker", c.kicker || "Contact");
  set("contact_title", c.title || "LET'S WORK TOGETHER");
  setRich("contact_text", c.text || "", W.contact_text);
  const hint = c.copy_hint || "کلیک کن تا کپی بشه";
  const plats = c.platforms || [];
  const box = document.getElementById("socials");
  if (box) {
    box.innerHTML = plats.map((p) => {
      const logoEl = p.logo ? `<img src="${esc(p.logo)}" alt="" />` : `<span class="soc-fallback">${esc((p.name||"?").slice(0,1))}</span>`;
      return `<article class="soc">
        <a class="soc-logo" href="${esc(p.url||"#")}" target="_blank" rel="noopener">${logoEl}</a>
        <div class="soc-meta">
          <b>${esc(p.name||"")}</b>
          <button type="button" class="soc-id" data-copy="${esc(p.handle||"")}">${esc(p.handle||"")}</button>
          <small>${esc(hint)}</small>
        </div>
      </article>`;
    }).join("");
    const start = document.getElementById("start_project");
    if (start && plats[0] && plats[0].url) start.href = plats[0].url;
    box.querySelectorAll(".soc-id").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const t = btn.dataset.copy || "";
        try { await navigator.clipboard.writeText(t); } catch {}
        const sm = btn.nextElementSibling;
        if (sm) { const p = sm.textContent; sm.textContent = "کپی شد"; setTimeout(() => sm.textContent = p, 1200); }
      });
    });
  }
  renderGrid();
}

function filtered() {
  const on = document.querySelector(".filters .is-on");
  const f = on ? on.dataset.filter : "all";
  return (SITE.works || []).filter((w) => f === "all" || w.cat === f);
}

function renderGrid() {
  const list = filtered();
  const slice = list.slice(0, shown);
  const grid = document.getElementById("grid");
  grid.innerHTML = slice.map((w, i) => {
    const year = w.year || SITE.year || "2026";
    return `<a class="card" href="/work/${esc(w.id)}" data-cat="${esc(w.cat)}" data-ratio="${esc(w.ratio||"1-1")}" data-i="${i}">
      <div class="ph"></div>
      <img src="${esc(webp(w.src))}" alt="${esc(w.title)}" loading="lazy" />
      <div class="ov">
        <small>${esc(catLabel(w.cat))} · ${esc(year)}</small>
        <b>${esc(w.title)}</b>
        <em>View project</em>
      </div>
    </a>`;
  }).join("");
  grid.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", () => img.previousElementSibling?.remove());
    img.addEventListener("error", () => {
      img.src = img.src.replace(".webp", ".jpg");
    });
  });
  const more = document.getElementById("more");
  if (more) more.style.display = slice.length < list.length ? "inline-flex" : "none";
  bindCursor();
}

function bindUi() {
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filters .is-on")?.classList.remove("is-on");
      btn.classList.add("is-on");
      shown = PAGE;
      renderGrid();
    });
  });
  document.getElementById("more")?.addEventListener("click", () => {
    shown += PAGE;
    renderGrid();
  });
  document.querySelectorAll("[data-filter-jump]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const f = a.dataset.filterJump;
      document.querySelectorAll(".filters button").forEach((b) => b.classList.toggle("is-on", b.dataset.filter === f));
      shown = PAGE;
      renderGrid();
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
    });
  });
  window.addEventListener("scroll", () => {
    const p = document.getElementById("progress");
    const max = document.documentElement.scrollHeight - innerHeight;
    if (p) p.style.transform = `scaleX(${max ? scrollY / max : 0})`;
    const ids = ["work", "services", "about", "contact"];
    let cur = "";
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 120) cur = id;
    });
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === cur));
  }, { passive: true });
}

function bindCursor() {
  const cur = document.getElementById("cursor");
  if (!cur || !matchMedia("(pointer:fine)").matches) return;
  window.onpointermove = (e) => {
    cur.style.left = e.clientX + "px";
    cur.style.top = e.clientY + "px";
  };
  document.querySelectorAll(".card").forEach((el) => {
    el.onpointerenter = () => cur.classList.add("on");
    el.onpointerleave = () => cur.classList.remove("on");
  });
}

function tickIranClock() {
  const el = document.getElementById("iran_clock");
  if (!el) return;
  const now = new Date();
  const date = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran", year: "numeric", month: "long", day: "numeric", weekday: "long",
  }).format(now);
  const time = new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(now);
  el.innerHTML = `<b>${time}</b>${date}`;
}

fetch("/api/site")
  .then((r) => r.json())
  .then((s) => { applySite(s); bindUi(); tickIranClock(); setInterval(tickIranClock, 1000); })
  .catch(() => { bindUi(); tickIranClock(); setInterval(tickIranClock, 1000); });
