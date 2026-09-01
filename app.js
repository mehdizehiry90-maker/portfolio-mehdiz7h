function bindUi() {
  const cur = document.querySelector(".cursor");
  if (cur && matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (e) => {
      cur.style.left = e.clientX + "px";
      cur.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a, button, .card").forEach((el) => {
      el.addEventListener("pointerenter", () => cur.classList.add("big"));
      el.addEventListener("pointerleave", () => cur.classList.remove("big"));
    });
  }

  const cards = [...document.querySelectorAll(".card")];
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filters .is-on")?.classList.remove("is-on");
      btn.classList.add("is-on");
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        c.classList.toggle("is-off", f !== "all" && c.dataset.cat !== f);
      });
    });
  });

  const lb = document.getElementById("lb");
  const lbImg = lb.querySelector("img");
  const lbKind = lb.querySelector("small");
  const lbTitle = lb.querySelector("strong");

  cards.forEach((c, i) => {
    if (!c.querySelector(".idx")) {
      const n = document.createElement("span");
      n.className = "idx";
      n.textContent = String(i + 1).padStart(2, "0");
      n.style.cssText =
        "position:absolute;top:10px;inset-inline-end:12px;z-index:2;font-family:Syne,sans-serif;font-size:.7rem;letter-spacing:.12em;color:var(--acc)";
      c.appendChild(n);
    }
    c.addEventListener("click", () => {
      lbImg.src = c.querySelector("img").src;
      lbImg.alt = c.querySelector("img").alt;
      lbKind.textContent = c.dataset.kind;
      lbTitle.textContent = c.dataset.title;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }
  lb.querySelector(".lb-x").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lb.hidden) closeLb();
  });
}

function applySite(s) {
  document.title = `${s.brand} — Social · Cover · Thumbnail`;
  const root = document.documentElement;
  if (s.theme) {
    root.style.setProperty("--bg", s.theme.bg);
    root.style.setProperty("--ink", s.theme.ink);
    root.style.setProperty("--mute", s.theme.mute);
    root.style.setProperty("--acc", s.theme.acc);
  }
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el && v != null) el.textContent = v;
  };
  const h = s.hero || {};
  const logo = s.logo || "images/logo.png";
  const limg = document.getElementById("logoimg");
  if (limg) limg.src = logo;
  const fav = document.getElementById("favicon");
  if (fav) fav.href = logo;
  const ap = document.getElementById("appleicon");
  if (ap) ap.href = logo;
  set("brand", s.brand);
  set("year", s.year);
  set("eyebrow_en", h.eyebrow_en);
  set("eyebrow_sub", h.eyebrow_sub);
  const W = s.weights || {};
  setRich("line1", h.line1, W.line1);
  setRich("line2", h.line2, W.line2);
  setRich("line3", h.line3, W.line3);
  set("hero_meta", h.meta);
  set("mark_num", h.mark_num || "01");
  set("mark_label", h.mark_label || "STUDIO");
  set("spine", h.spine || "GRAPHIC DESIGN · SOCIAL · COVER · YT");
  set("work_kicker", h.work_kicker || "Archive / 2026");
  set("work_title", h.work_title || "Selected Work");

  const tick = h.ticker || "THUMBNAILS · COVERS · SOCIAL POSTS · STOP THE SCROLL";
  const parts = tick.split(/[·|,]+/).map((x) => x.trim()).filter(Boolean);
  const track = document.getElementById("ticker_track");
  if (track) {
    const bits = parts.map((p) => `<span>${esc(p)}</span>`).join("");
    track.innerHTML = bits + bits + bits + bits;
  }

  set("kicker", s.about.kicker);
  document.getElementById("about_title").innerHTML =
    `${esc(s.about.title_before)} <em>${esc(s.about.name)}</em> ${esc(s.about.title_after)}`;
  setRich("bio", s.about.bio, W.bio);
  document.getElementById("tags").innerHTML = (s.about.tags || [])
    .map((t) => `<li>${esc(t)}</li>`)
    .join("");
  set("fleft", s.footer.left);
  set("fright", s.footer.right);

  const c = s.contact || {};
  set("contact_kicker", c.kicker || "Contact");
  set("contact_title", c.title || "ارتباط با من");
  set("contact_text", c.text || "");
  const hint = c.copy_hint || "کلیک کن تا کپی بشه";
  const box = document.getElementById("socials");
  if (box) {
    let plats = c.platforms;
    if (!plats || !plats.length) {
      plats = [];
      if (c.telegram) {
        plats.push({
          name: "تلگرام",
          logo: "images/icon-telegram.svg",
          url: "https://t.me/" + String(c.telegram).replace(/^@/, ""),
          handle: "@" + String(c.telegram).replace(/^@/, ""),
        });
      }
      if (c.rubika) {
        plats.push({
          name: "روبیکا",
          logo: "images/icon-rubika.svg",
          url: "https://rubika.ir/" + String(c.rubika).replace(/^@/, ""),
          handle: "@" + String(c.rubika).replace(/^@/, ""),
        });
      }
    }
    box.innerHTML = plats
      .map((p) => {
        const logo = p.logo
          ? `<img src="${esc(p.logo)}" alt="" />`
          : `<span class="soc-fallback">${esc((p.name || "?").slice(0, 1))}</span>`;
        return `<article class="soc">
          <a class="soc-logo" href="${esc(p.url || "#")}" target="_blank" rel="noopener" aria-label="${esc(p.name || "")}">
            ${logo}
          </a>
          <div class="soc-meta">
            <b>${esc(p.name || "")}</b>
            <button type="button" class="soc-id" data-copy="${esc(p.handle || "")}">${esc(p.handle || "")}</button>
            <small>${esc(hint)}</small>
          </div>
        </article>`;
      })
      .join("");
    box.querySelectorAll(".soc-id").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const t = btn.dataset.copy || btn.textContent.trim();
        try {
          await navigator.clipboard.writeText(t);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = t;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        const old = btn.nextElementSibling;
        if (old) {
          const prev = old.textContent;
          old.textContent = "کپی شد";
          setTimeout(() => (old.textContent = prev), 1400);
        }
      });
    });
  }

  const grid = document.getElementById("grid");
  grid.innerHTML = (s.works || [])
    .map((w) => {
      const cap = w.cat === "yt" ? "YouTube" : w.cat === "cover" ? "Cover" : "Social";
      const ratio = w.ratio || (w.wide ? "16-9" : "1-1");
      return `<article class="card" data-ratio="${esc(ratio)}" data-cat="${esc(w.cat)}" data-title="${esc(w.title)}" data-kind="${esc(w.kind)}">
        <img src="${esc(w.src)}" alt="${esc(w.title)}" />
        <div class="cap"><span>${cap}</span><b>${esc(w.title)}</b></div>
      </article>`;
    })
    .join("");
}

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

function setRich(id, s, w) {
  const el = document.getElementById(id);
  if (!el || s == null) return;
  el.innerHTML = rich(s, w);
}

function tickIranClock() {
  const el = document.getElementById("iran_clock");
  if (!el) return;
  const now = new Date();
  const date = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
  const time = new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  el.innerHTML = `<b>${time}</b>${date}`;
}

fetch("/api/site")
  .then((r) => r.json())
  .then((s) => {
    applySite(s);
    bindUi();
    tickIranClock();
    setInterval(tickIranClock, 1000);
  })
  .catch(() => {
    bindUi();
    tickIranClock();
    setInterval(tickIranClock, 1000);
  });
