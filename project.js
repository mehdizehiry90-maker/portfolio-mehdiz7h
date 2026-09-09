function esc(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
}
function pic(src) { return "/" + String(src||"").replace(/^\//,""); }
function thumb(src, w) {
  const s = String(src||"").replace(/^\//,"");
  return s ? `/t/${w}/${s}` : "";
}
function catLabel(c) { return c === "yt" ? "YOUTUBE THUMBNAIL" : c === "cover" ? "COVER" : "SOCIAL CAMPAIGN"; }

const id = decodeURIComponent(location.pathname.split("/").pop() || "");

fetch("/api/site").then((r) => r.json()).then((site) => {
  const works = site.works || [];
  const i = works.findIndex((w) => w.id === id);
  const w = works[i];
  const root = document.getElementById("case");
  if (!w) {
    location.replace("/404");
    return;
  }
  const prev = works[(i - 1 + works.length) % works.length];
  const next = works[(i + 1) % works.length];
  const year = w.year || site.year || "2026";
  const client = w.client || "";
  const ideaImg = w.idea_src || "";
  const colors = (w.colors || []).filter(Boolean).slice(0, 3);
  const imgs = [w.src].concat(w.gallery || []).filter(Boolean);
  document.title = `${w.title} — ${site.brand || "mehdiz7h"}`;
  document.getElementById("meta_desc").setAttribute("content", `${w.title} · ${catLabel(w.cat)}`);
  document.getElementById("og_title").setAttribute("content", w.title);
  document.getElementById("og_img").setAttribute("content", pic(w.src));

  const more = works.filter((x) => x.id !== w.id).slice(0, 3);
  const ba = ideaImg
    ? `<h3>BEFORE AFTER</h3>
      <div class="ba" dir="ltr">
        <img class="ba-final" src="${esc(pic(w.src))}" alt="after" />
        <div class="ba-clip" style="--p:50%">
          <img src="${esc(pic(ideaImg))}" alt="before" />
        </div>
        <div class="ba-line" style="left:50%"></div>
        <input class="ba-range" type="range" min="0" max="100" value="50" />
      </div>`
    : `<img class="hero-img" src="${esc(pic(w.src))}" alt="${esc(w.title)}" />`;

  root.innerHTML = `
    <p class="kicker">PROJECT</p>
    <p class="meta">${String(i+1).padStart(2,"0")} / ${esc(catLabel(w.cat))}</p>
    <h1>${esc(w.title)}</h1>
    ${ba}
    <div class="case-meta">
      ${client ? `<span>${esc(client)}</span>` : ""}
      <span>${esc(w.kind || w.cat)}</span>
      <span>${esc(year)}</span>
    </div>
    ${colors.length ? `<h3>COLORS</h3><div class="swatches">${colors.map((c) => `<span class="swatch" style="background:${esc(c)}" title="${esc(c)}"></span>`).join("")}</div>` : ""}
    <h3>MORE PROJECTS</h3>
    <div class="more-grid">
      ${more.map((m) => `<a href="/work/${esc(m.id)}"><img src="${esc(pic(m.src))}" alt="${esc(m.title)}" loading="lazy" /></a>`).join("")}
    </div>
    <div class="case-nav">
      <a href="/work/${esc(prev.id)}">← ${esc(prev.title)}</a>
      <a href="/work/${esc(next.id)}">${esc(next.title)} →</a>
    </div>
  `;

  const baEl = root.querySelector(".ba");
  if (baEl) {
    const clip = baEl.querySelector(".ba-clip");
    const line = baEl.querySelector(".ba-line");
    const range = baEl.querySelector(".ba-range");
    const before = baEl.querySelector(".ba-clip img");
    const fit = () => { before.style.width = baEl.offsetWidth + "px"; };
    fit();
    baEl.querySelector(".ba-final").addEventListener("load", fit);
    window.addEventListener("resize", fit);
    const setP = (p) => {
      clip.style.width = p + "%";
      line.style.left = p + "%";
    };
    range.addEventListener("input", () => setP(range.value));
  }

  const lb = document.getElementById("lb");
  const lbImg = lb.querySelector("img");
  let zi = 0;
  function open(n) {
    zi = n;
    lbImg.src = pic(imgs[zi]);
    lb.hidden = false;
  }
  root.querySelectorAll(".open-lb").forEach((im) => im.addEventListener("click", () => open(+im.dataset.i)));
  lb.querySelector(".lb-x").onclick = () => { lb.hidden = true; lbImg.classList.remove("zoom"); };
  lb.querySelector(".prev").onclick = () => open((zi - 1 + imgs.length) % imgs.length);
  lb.querySelector(".next").onclick = () => open((zi + 1) % imgs.length);
  lbImg.onclick = () => lbImg.classList.toggle("zoom");
  window.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lb.hidden = true;
    if (e.key === "ArrowLeft") open((zi + 1) % imgs.length);
    if (e.key === "ArrowRight") open((zi - 1 + imgs.length) % imgs.length);
  });
});
