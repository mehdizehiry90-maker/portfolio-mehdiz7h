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
  $("#telegram").value = (site.contact || {}).telegram || "mehdiz7h";
  $("#rubika").value = (site.contact || {}).rubika || "mehdiz7h";
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
    telegram: $("#telegram").value.replace(/^@/, ""),
    rubika: $("#rubika").value.replace(/^@/, ""),
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

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

async function boot() {
  try {
    await j("/api/me");
    site = await j("/api/site");
    $("#gate").style.display = "none";
    $("#shell").style.display = "block";
    fill();
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
