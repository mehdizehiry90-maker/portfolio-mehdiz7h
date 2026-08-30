#!/usr/bin/env python3
import json
import os
import uuid
from functools import wraps
from pathlib import Path

from flask import (
    Flask,
    jsonify,
    redirect,
    request,
    send_from_directory,
    session,
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
SITE_FILE = DATA / "site.json"
CFG_FILE = DATA / "config.json"
UPLOAD_DIR = ROOT / "images" / "uploads"
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}

DATA.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def load_cfg():
    return json.loads(CFG_FILE.read_text(encoding="utf-8"))


def save_cfg(cfg):
    CFG_FILE.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")


def load_site():
    return json.loads(SITE_FILE.read_text(encoding="utf-8"))


def save_site(data):
    SITE_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


cfg0 = load_cfg()
app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get("SECRET_KEY") or cfg0["secret_key"]
app.config["MAX_CONTENT_LENGTH"] = 12 * 1024 * 1024
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"


def login_required(fn):
    @wraps(fn)
    def wrap(*a, **k):
        if not session.get("ok"):
            return jsonify({"error": "unauthorized"}), 401
        return fn(*a, **k)

    return wrap


@app.after_request
def headers(res):
    res.headers["Cache-Control"] = "no-store"
    return res


@app.get("/api/site")
def api_site():
    return jsonify(load_site())


@app.post("/api/login")
def api_login():
    body = request.get_json(silent=True) or {}
    cfg = load_cfg()
    user = (body.get("username") or "").strip()
    pw = body.get("password") or ""
    if user == cfg["username"] and check_password_hash(cfg["password_hash"], pw):
        session["ok"] = True
        session["user"] = user
        return jsonify({"ok": True})
    return jsonify({"ok": False, "error": "نام کاربری یا رمز اشتباه است"}), 401


@app.post("/api/logout")
def api_logout():
    session.clear()
    return jsonify({"ok": True})


@app.get("/api/me")
def api_me():
    if session.get("ok"):
        return jsonify({"ok": True, "user": session.get("user")})
    return jsonify({"ok": False}), 401


@app.post("/api/site")
@login_required
def api_save_site():
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        return jsonify({"error": "bad json"}), 400
    save_site(body)
    return jsonify({"ok": True})


def upload_path(src):
    if not src or not str(src).startswith("images/uploads/"):
        return None
    p = (ROOT / src).resolve()
    try:
        p.relative_to(UPLOAD_DIR.resolve())
    except ValueError:
        return None
    return p


@app.post("/api/delete-image")
@login_required
def api_delete_image():
    body = request.get_json(silent=True) or {}
    p = upload_path(body.get("src"))
    if p and p.is_file():
        p.unlink()
        return jsonify({"ok": True, "deleted": True})
    return jsonify({"ok": True, "deleted": False})


@app.post("/api/upload")
@login_required
def api_upload():
    f = request.files.get("file")
    if not f or not f.filename:
        return jsonify({"error": "فایلی انتخاب نشده"}), 400
    ext = Path(f.filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        return jsonify({"error": "فقط jpg / png / webp / gif"}), 400
    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / secure_filename(name)
    f.save(dest)
    return jsonify({"ok": True, "src": f"images/uploads/{dest.name}"})


@app.post("/api/password")
@login_required
def api_password():
    body = request.get_json(silent=True) or {}
    old = body.get("old") or ""
    new = body.get("new") or ""
    cfg = load_cfg()
    if not check_password_hash(cfg["password_hash"], old):
        return jsonify({"error": "رمز فعلی اشتباه است"}), 400
    if len(new) < 6:
        return jsonify({"error": "رمز جدید حداقل ۶ کاراکتر"}), 400
    cfg["password_hash"] = generate_password_hash(new)
    save_cfg(cfg)
    return jsonify({"ok": True})


@app.get("/admin")
@app.get("/admin/")
def admin_index():
    return send_from_directory(ROOT / "admin", "index.html")


@app.get("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.get("/<path:path>")
def static_files(path):
    target = ROOT / path
    if target.is_file() and ROOT in target.resolve().parents:
        return send_from_directory(ROOT, path)
    return ("not found", 404)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "3000"))
    app.run(host="0.0.0.0", port=port, debug=False)
