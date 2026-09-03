function esc(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
}
function webp(src) { return String(src||"").replace(/\.(jpe?g|png)$/i, ".webp"); }
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
  const year = w.year || "2026";
  const client = w.client || "Personal project";
  const idea = w.idea || w.kind || "";
  const imgs = [w.src].concat(w.gallery || []).filter(Boolean);
  document.title = `${w.title} — ${site.brand || "mehdiz7h"}`;
  document.getElementById("meta_desc").setAttribute("content", `${w.title} · ${catLabel(w.cat)}`);
  document.getElementById("og_title").setAttribute("content", w.title);
  document.getElementById("og_img").setAttribute("content", "/" + webp(w.src));

  const more = works.filter((x) => x.id !== w.id).slice(0, 3);
  root.innerHTML = `
    <p class="kicker">PROJECT</p>
    <p class="meta">${String(i+1).padStart(2,"0")} / ${esc(catLabel(w.cat))}</p>
    <h1>${esc(w.title)}</h1>
    <img class="hero-img" src="${esc(webp(w.src))}" alt="${esc(w.title)}" />
    <div class="case-meta">
      <span>${esc(client)}</span>
      <span>${esc(w.kind || w.cat)}</span>
      <span>${esc(year)}</span>
    </div>
    <h3>THE IDEA</h3>
    <p class="bio">${esc(idea)}</p>
    <h3>FINAL DESIGN</h3>
    <div class="finals">
      ${imgs.map((src, n) => `<img class="open-lb" data-i="${n}" src="${esc(webp(src))}" alt="${esc(w.title)} ${n+1}" />`).join("")}
    </div>
    <h3>MORE PROJECTS</h3>
    <div class="more-grid">
      ${more.map((m) => `<a href="/work/${esc(m.id)}"><img src="${esc(webp(m.src))}" alt="${esc(m.title)}" /><p>${esc(m.title)}</p></a>`).join("")}
    </div>
    <div class="case-nav">
      <a href="/work/${esc(prev.id)}">← ${esc(prev.title)}</a>
      <a href="/work/${esc(next.id)}">${esc(next.title)} →</a>
    </div>
  `;

  const lb = document.getElementById("lb");
  const lbImg = lb.querySelector("img");
  let zi = 0;
  function open(n) {
    zi = n;
    lbImg.src = webp(imgs[zi]);
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
