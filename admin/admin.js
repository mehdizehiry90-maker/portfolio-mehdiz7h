let site = null;

const $ = (s) => document.querySelector(s);
const toast = (t) => {
  const el = $("#toast");
  el.textContent = t;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 1800);
};

async function j(url, opt) {
  const r = await fetch(url, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...opt,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "خطا");
  return data;
}

function fill() {
  $("#brand").value = site.brand || "";
  if (!site.logo) site.logo = "images/logo.png";
  const lp = $("#logo_preview");
  if (lp) lp.src = "/" + site.logo.replace(/^\//, "");
  $("#year").value = site.year || "";
  $("#eyebrow_en").value = site.hero.eyebrow_en || "";
  $("#eyebrow_sub").value = site.hero.eyebrow_sub || "";
  $("#line1").value = site.hero.line1 || "";
  $("#line2").value = site.hero.line2 || "";
  $("#line3").value = site.hero.line3 || "";
  $("#meta").value = site.hero.meta || "";
  $("#mark_num").value = site.hero.mark_num || "01";
  $("#mark_label").value = site.hero.mark_label || "STUDIO";
  $("#ticker").value = site.hero.ticker || "";
  $("#spine").value = site.hero.spine || "";
  $("#work_kicker").value = site.hero.work_kicker || "";
  $("#work_title").value = site.hero.work_title || "";
  $("#kicker").value = site.about.kicker || "";
  $("#title_before").value = site.about.title_before || "";
  $("#aname").value = site.about.name || "";
  $("#title_after").value = site.about.title_after || "";
  $("#bio").value = site.about.bio || "";
  $("#tags").value = (site.about.tags || []).join("، ");
  $("#fleft").value = site.footer.left || "";
  $("#fright").value = site.footer.right || "";
  $("#contact_kicker").value = (site.contact || {}).kicker || "";
  $("#contact_title").value = (site.contact || {}).title || "";
  $("#contact_text").value = (site.contact || {}).text || "";
  $("#copy_hint") && ($("#copy_hint").value = (site.contact || {}).copy_hint || "کلیک کن تا کپی بشه");
  if (!site.contact) site.contact = {};
  if (!site.contact.platforms) {
    site.contact.platforms = [];
    if (site.contact.telegram) {
      site.contact.platforms.push({
        id: "tg",
        name: "تلگرام",
        logo: "images/icon-telegram.svg",
        url: "https://t.me/" + String(site.contact.telegram).replace(/^@/, ""),
        handle: "@" + String(site.contact.telegram).replace(/^@/, ""),
      });
    }
    if (site.contact.rubika) {
      site.contact.platforms.push({
        id: "ru",
        name: "روبیکا",
        logo: "images/icon-rubika.svg",
        url: "https://rubika.ir/" + String(site.contact.rubika).replace(/^@/, ""),
        handle: "@" + String(site.contact.rubika).replace(/^@/, ""),
      });
    }
  }
  renderPlats();
  $("#c_bg").value = site.theme.bg || "#070707";
  $("#c_ink").value = site.theme.ink || "#f3efe6";
  $("#c_mute").value = site.theme.mute || "#8a857a";
  $("#c_acc").value = site.theme.acc || "#d6ff3f";
  renderWorks();
}

function collect() {
  site.brand = $("#brand").value;
  site.year = $("#year").value;
  site.hero = {
    eyebrow_en: $("#eyebrow_en").value,
    eyebrow_sub: $("#eyebrow_sub").value,
    line1: $("#line1").value,
    line2: $("#line2").value,
    line3: $("#line3").value,
    meta: $("#meta").value,
    mark_num: $("#mark_num").value,
    mark_label: $("#mark_label").value,
    ticker: $("#ticker").value,
    spine: $("#spine").value,
    work_kicker: $("#work_kicker").value,
    work_title: $("#work_title").value,
  };
  site.about = {
    kicker: $("#kicker").value,
    title_before: $("#title_before").value,
    name: $("#aname").value,
    title_after: $("#title_after").value,
    bio: $("#bio").value,
    tags: $("#tags").value.split(/[،,]+/).map((s) => s.trim()).filter(Boolean),
  };
  site.contact = {
    kicker: $("#contact_kicker").value,
    title: $("#contact_title").value,
    text: $("#contact_text").value,
    copy_hint: ($("#copy_hint") && $("#copy_hint").value) || "کلیک کن تا کپی بشه",
    platforms: site.contact.platforms || [],
  };
  site.footer = { left: $("#fleft").value, right: $("#fright").value };
  site.theme = {
    bg: $("#c_bg").value,
    ink: $("#c_ink").value,
    mute: $("#c_mute").value,
    acc: $("#c_acc").value,
  };
}

function renderWorks() {
  const box = $("#works");
  box.innerHTML = "";
  site.works.forEach((w, i) => {
    const el = document.createElement("div");
    el.className = "witem";
    el.innerHTML = `
      <img src="/${w.src}" alt="" />
      <div>
        <input data-k="title" data-i="${i}" value="${escapeAttr(w.title)}" placeholder="عنوان" />
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px">
          <select data-k="cat" data-i="${i}">
            <option value="social" ${w.cat === "social" ? "selected" : ""}>سوشال</option>
            <option value="cover" ${w.cat === "cover" ? "selected" : ""}>کاور</option>
            <option value="yt" ${w.cat === "yt" ? "selected" : ""}>تامنیل</option>
          </select>
          <select data-k="ratio" data-i="${i}">
            <option value="1-1" ${ (w.ratio||"1-1")==="1-1" ? "selected" : ""}>1:1 مربع</option>
            <option value="4-5" ${w.ratio==="4-5" ? "selected" : ""}>4:5 عمودی</option>
            <option value="16-9" ${w.ratio==="16-9" || w.wide ? "selected" : ""}>16:9 افقی</option>
            <option value="9-16" ${w.ratio==="9-16" ? "selected" : ""}>16:9 عمودی</option>
          </select>
          <input data-k="kind" data-i="${i}" value="${escapeAttr(w.kind || "")}" placeholder="برچسب" />
        </div>
        <p style="margin:8px 0 0;color:#666;font-size:.75rem">نسبت نمایش در گالری</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn ghost" type="button" data-up="${i}">↑</button>
        <button class="btn ghost" type="button" data-dn="${i}">↓</button>
        <button class="btn danger" type="button" data-del="${i}">حذف</button>
      </div>`;
    box.appendChild(el);
  });
}

function renderPlats() {
  const box = $("#plats");
  if (!box) return;
  if (!site.contact) site.contact = {};
  if (!site.contact.platforms) site.contact.platforms = [];
  box.innerHTML = "";
  site.contact.platforms.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "witem";
    el.style.gridTemplateColumns = "72px 1fr auto";
    el.innerHTML = `
      <img src="/${escapeAttr(p.logo || "")}" alt="" style="width:72px;height:72px;object-fit:contain;background:#000;border-radius:12px" />
      <div>
        <input data-pk="name" data-i="${i}" value="${escapeAttr(p.name || "")}" placeholder="نام پلتفرم" />
        <input data-pk="url" data-i="${i}" value="${escapeAttr(p.url || "")}" placeholder="لینک کامل پیوی https://..." style="margin-top:6px" />
        <input data-pk="handle" data-i="${i}" value="${escapeAttr(p.handle || "")}" placeholder="آیدی یا شماره مثل @mehdiz7h" style="margin-top:6px" />
        <input type="file" accept="image/*,.svg" data-logo="${i}" style="margin-top:8px" />
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn ghost" type="button" data-pup="${i}">↑</button>
        <button class="btn ghost" type="button" data-pdn="${i}">↓</button>
        <button class="btn danger" type="button" data-pdel="${i}">حذف</button>
      </div>`;
    box.appendChild(el);
  });
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

async function boot() {
  try {
    await j("/api/me");
    site = await j("/api/site");
    $("#gate").style.display = "none";
    $("#shell").style.display = "block";
    try {
      fill();
    } catch (err) {
      console.error(err);
    }
  } catch {
    $("#gate").style.display = "grid";
    $("#shell").style.display = "none";
  }
}

$("#login").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#login-err").textContent = "";
  const fd = new FormData(e.target);
  try {
    await j("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });
    await boot();
  } catch (err) {
    $("#login-err").textContent = err.message;
  }
});

$("#out").addEventListener("click", async () => {
  await j("/api/logout", { method: "POST", body: "{}" });
  location.reload();
});

$("#save").addEventListener("click", async () => {
  collect();
  await j("/api/site", { method: "POST", body: JSON.stringify(site) });
  toast("ذخیره شد");
});

document.querySelector(".tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll(".tabs button").forEach((x) => x.classList.toggle("on", x === b));
  document.querySelectorAll(".pane").forEach((p) => p.classList.toggle("on", p.id === "tab-" + b.dataset.tab));
});

$("#works").addEventListener("input", (e) => {
  const t = e.target;
  const i = +t.dataset.i;
  if (Number.isNaN(i)) return;
  if (t.dataset.k === "wide") site.works[i].wide = t.checked;
  else site.works[i][t.dataset.k] = t.value;
});

$("#works").addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.del != null) {
    const i = +t.dataset.del;
    const src = site.works[i] && site.works[i].src;
    if (src && src.startsWith("images/uploads/")) {
      j("/api/delete-image", { method: "POST", body: JSON.stringify({ src }) }).catch(() => {});
    }
    site.works.splice(i, 1);
    renderWorks();
  }
  if (t.dataset.up != null) {
    const i = +t.dataset.up;
    if (i > 0) [site.works[i - 1], site.works[i]] = [site.works[i], site.works[i - 1]];
    renderWorks();
  }
  if (t.dataset.dn != null) {
    const i = +t.dataset.dn;
    if (i < site.works.length - 1) [site.works[i + 1], site.works[i]] = [site.works[i], site.works[i + 1]];
    renderWorks();
  }
});

$("#addwork").addEventListener("click", async () => {
  const file = $("#upfile").files[0];
  if (!file) return toast("اول عکس را انتخاب کن");
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
  const data = await r.json();
  if (!r.ok) return toast(data.error || "آپلود نشد");
  site.works.unshift({
    id: "w" + Date.now(),
    src: data.src,
    title: "کار جدید",
    kind: "Social Post",
    cat: "social",
    ratio: "1-1",
  });
  $("#upfile").value = "";
  renderWorks();
  toast("اضافه شد — ذخیره را بزن");
});

(function bindPlats() {
  const add = $("#addplat");
  const box = $("#plats");
  if (add) {
    add.addEventListener("click", () => {
      if (!site.contact) site.contact = {};
      if (!site.contact.platforms) site.contact.platforms = [];
      site.contact.platforms.push({
        id: "p" + Date.now(),
        name: "",
        logo: "",
        url: "",
        handle: "",
      });
      renderPlats();
    });
  }
  if (!box) return;
  box.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.pk == null) return;
    const i = +t.dataset.i;
    site.contact.platforms[i][t.dataset.pk] = t.value;
  });
  box.addEventListener("change", async (e) => {
    const t = e.target;
    if (t.dataset.logo == null || !t.files || !t.files[0]) return;
    const i = +t.dataset.logo;
    const fd = new FormData();
    fd.append("file", t.files[0]);
    const r = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
    const data = await r.json();
    if (!r.ok) return toast(data.error || "آپلود لوگو نشد");
    const old = site.contact.platforms[i].logo;
    if (old && old.startsWith("images/uploads/")) {
      j("/api/delete-image", { method: "POST", body: JSON.stringify({ src: old }) }).catch(() => {});
    }
    site.contact.platforms[i].logo = data.src;
    renderPlats();
    toast("لوگو آپلود شد — ذخیره را بزن");
  });
  box.addEventListener("click", (e) => {
    const t = e.target;
    const list = site.contact.platforms || [];
    if (t.dataset.pdel != null) {
      const i = +t.dataset.pdel;
      const src = list[i] && list[i].logo;
      if (src && src.startsWith("images/uploads/")) {
        j("/api/delete-image", { method: "POST", body: JSON.stringify({ src }) }).catch(() => {});
      }
      list.splice(i, 1);
      renderPlats();
    }
    if (t.dataset.pup != null) {
      const i = +t.dataset.pup;
      if (i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
      renderPlats();
    }
    if (t.dataset.pdn != null) {
      const i = +t.dataset.pdn;
      if (i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
      renderPlats();
    }
  });
})();

const logof = $("#logofile");
if (logof) {
  logof.addEventListener("change", async () => {
    const file = logof.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
    const data = await r.json();
    if (!r.ok) return toast(data.error || "آپلود لوگو نشد");
    site.logo = data.src;
    if ($("#logo_preview")) $("#logo_preview").src = "/" + data.src;
    toast("لوگو آپلود شد — ذخیره را بزن");
  });
}

$("#changepw").addEventListener("click", async () => {
  try {
    await j("/api/password", {
      method: "POST",
      body: JSON.stringify({ old: $("#pold").value, new: $("#pnew").value }),
    });
    toast("رمز عوض شد");
    $("#pold").value = $("#pnew").value = "";
  } catch (err) {
    toast(err.message);
  }
});

boot();
