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
        "position:absolute;top:10px;inset-inline-end:12px;z-index:2;font-family:Syne,sans-serif;font-size:.7rem;letter-spacing:.12em;color:#d6ff3f";
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
    document.body.style.background = s.theme.bg;
  }
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el && v != null) el.textContent = v;
  };
  set("brand", s.brand);
  set("year", s.year);
  set("eyebrow_en", s.hero.eyebrow_en);
  set("eyebrow_sub", s.hero.eyebrow_sub);
  set("line1", s.hero.line1);
  set("line2", s.hero.line2);
  set("line3", s.hero.line3);
  set("hero_meta", s.hero.meta);
  set("kicker", s.about.kicker);
  document.getElementById("about_title").innerHTML =
    `${esc(s.about.title_before)} <em>${esc(s.about.name)}</em> ${esc(s.about.title_after)}`;
  set("bio", s.about.bio);
  document.getElementById("tags").innerHTML = (s.about.tags || [])
    .map((t) => `<li>${esc(t)}</li>`)
    .join("");
  set("fleft", s.footer.left);
  set("fright", s.footer.right);

  const grid = document.getElementById("grid");
  grid.innerHTML = (s.works || [])
    .map((w) => {
      const cap = w.cat === "yt" ? "YouTube" : w.cat === "cover" ? "Cover" : "Social";
      return `<article class="card${w.wide ? " w2" : ""}" data-cat="${esc(w.cat)}" data-title="${esc(w.title)}" data-kind="${esc(w.kind)}">
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

fetch("/api/site")
  .then((r) => r.json())
  .then((s) => {
    applySite(s);
    bindUi();
  })
  .catch(() => bindUi());
