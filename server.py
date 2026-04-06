#!/usr/bin/env python3
import cgi
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import quote, urlparse


HOST = "127.0.0.1"
PORT = 8000
if getattr(sys, "frozen", False):
    BASE_DIR = getattr(sys, "_MEIPASS", os.path.dirname(sys.executable))
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESOURCE_ROOT = os.path.join(BASE_DIR, "resources")
ACHIEVEMENT_META_FILE = os.path.join(RESOURCE_ROOT, "achievement_meta.json")
POSTER_DIR = os.path.join(RESOURCE_ROOT, "posters")

MEDIA_FOLDERS = {
    "video": {
        "directory": "videos",
        "label": "视频目录",
        "extensions": {".mp4", ".webm", ".mov", ".m4v"},
        "type_label": "视频",
    },
    "image": {
        "directory": "images",
        "label": "图片目录",
        "extensions": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"},
        "type_label": "图片",
    },
    "ppt": {
        "directory": "ppt",
        "label": "PPT 目录",
        "extensions": {".ppt", ".pptx", ".pps", ".ppsx", ".pdf"},
        "type_label": "PPT",
    },
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}


def quoted_resource_url(path: str) -> str:
    relative_path = os.path.relpath(path, BASE_DIR).replace(os.sep, "/")
    quoted_path = "/".join(quote(part) for part in relative_path.split("/"))
    return f"/{quoted_path}"


def collect_video_stems() -> set:
    folder_path = os.path.join(RESOURCE_ROOT, MEDIA_FOLDERS["video"]["directory"])
    if not os.path.isdir(folder_path):
        return set()

    stems = set()
    for entry in os.scandir(folder_path):
        if not entry.is_file():
            continue
        extension = os.path.splitext(entry.name)[1].lower()
        if extension in MEDIA_FOLDERS["video"]["extensions"]:
            stems.add(os.path.splitext(entry.name)[0])
    return stems


def load_achievement_meta() -> dict:
    if not os.path.isfile(ACHIEVEMENT_META_FILE):
        return {}

    try:
        with open(ACHIEVEMENT_META_FILE, "r", encoding="utf-8") as file:
            payload = json.load(file)
            if isinstance(payload, dict):
                return payload
    except (OSError, json.JSONDecodeError):
        return {}

    return {}


def save_achievement_meta(payload: dict):
    os.makedirs(RESOURCE_ROOT, exist_ok=True)
    with open(ACHIEVEMENT_META_FILE, "w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)


def normalize_filename(name: str) -> str:
    cleaned = re.sub(r"[^\w.\-\u4e00-\u9fff]+", "_", name.strip())
    cleaned = cleaned.lstrip(".")
    return cleaned or "achievement_file"


def unique_file_path(folder_path: str, filename: str) -> str:
    stem, extension = os.path.splitext(filename)
    candidate = os.path.join(folder_path, filename)
    index = 1

    while os.path.exists(candidate):
        candidate = os.path.join(folder_path, f"{stem}_{index}{extension}")
        index += 1

    return candidate


def media_type_for_extension(extension: str) -> str:
    normalized = extension.lower()
    for media_type, config in MEDIA_FOLDERS.items():
        if normalized in config["extensions"]:
            return media_type
    return ""


def find_video_poster(video_name: str) -> str:
    stem = os.path.splitext(video_name)[0]

    if os.path.isdir(POSTER_DIR):
        for extension in sorted(IMAGE_EXTENSIONS):
            candidate = os.path.join(POSTER_DIR, f"{stem}{extension}")
            if os.path.isfile(candidate):
                return quoted_resource_url(candidate)

    image_dir = os.path.join(RESOURCE_ROOT, "images")
    if os.path.isdir(image_dir):
        for extension in sorted(IMAGE_EXTENSIONS):
            candidate = os.path.join(image_dir, f"{stem}{extension}")
            if os.path.isfile(candidate):
                return quoted_resource_url(candidate)

    return ""


def save_video_poster(saved_video_name: str, poster_field):
    if not saved_video_name or poster_field is None:
        return

    if isinstance(poster_field, list):
        poster_field = poster_field[0] if poster_field else None
        if poster_field is None:
            return

    file_obj = getattr(poster_field, "file", None)
    if file_obj is None:
        return

    poster_data = file_obj.read()
    if not poster_data:
        return

    os.makedirs(POSTER_DIR, exist_ok=True)

    stem = os.path.splitext(saved_video_name)[0]
    poster_path = os.path.join(POSTER_DIR, f"{stem}.jpg")
    with open(poster_path, "wb") as output:
        output.write(poster_data)


def poster_exists_for_video(video_name: str) -> bool:
    return bool(find_video_poster(video_name))


def try_generate_video_poster(saved_video_path: str, saved_video_name: str):
    if not saved_video_path or not saved_video_name:
        return

    stem = os.path.splitext(saved_video_name)[0]
    if not stem:
        return

    if poster_exists_for_video(saved_video_name):
        return

    os.makedirs(POSTER_DIR, exist_ok=True)
    poster_path = os.path.join(POSTER_DIR, f"{stem}.jpg")
    commands = [
        [
            "ffmpeg",
            "-y",
            "-ss",
            "0.20",
            "-i",
            saved_video_path,
            "-frames:v",
            "1",
            "-q:v",
            "2",
            poster_path,
        ],
        [
            "ffmpeg",
            "-y",
            "-i",
            saved_video_path,
            "-frames:v",
            "1",
            "-q:v",
            "2",
            poster_path,
        ],
    ]

    for command in commands:
        try:
            completed = subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            if completed.returncode == 0 and os.path.isfile(poster_path) and os.path.getsize(poster_path) > 0:
                return
        except OSError:
            break

    # macOS fallback without ffmpeg: use QuickLook thumbnail generator.
    try:
        temp_dir = tempfile.mkdtemp(prefix="tjipe-ql-")
        quicklook = [
            "qlmanage",
            "-t",
            "-s",
            "1024",
            "-o",
            temp_dir,
            saved_video_path,
        ]
        completed = subprocess.run(quicklook, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        if completed.returncode == 0:
            expected_name = f"{os.path.basename(saved_video_path)}.png"
            quicklook_png = os.path.join(temp_dir, expected_name)
            if os.path.isfile(quicklook_png) and os.path.getsize(quicklook_png) > 0:
                target_png = os.path.join(POSTER_DIR, f"{stem}.png")
                shutil.copyfile(quicklook_png, target_png)
    except OSError:
        return


def build_media_items() -> list:
    metadata_map = load_achievement_meta()
    video_stems = collect_video_stems()
    items = []

    for media_type, config in MEDIA_FOLDERS.items():
        folder_path = os.path.join(RESOURCE_ROOT, config["directory"])
        if not os.path.isdir(folder_path):
            continue

        entries = [entry for entry in os.scandir(folder_path) if entry.is_file()]
        entries.sort(key=lambda item: item.stat().st_mtime, reverse=True)

        for entry in entries:
            if not entry.is_file():
                continue

            extension = os.path.splitext(entry.name)[1].lower()
            if extension not in config["extensions"]:
                continue

            if media_type == "image" and os.path.splitext(entry.name)[0] in video_stems:
                # Skip poster images generated from uploaded videos.
                continue

            quoted_path = quoted_resource_url(entry.path).lstrip("/")
            mime_type = mimetypes.guess_type(entry.name)[0] or "application/octet-stream"

            achievement = metadata_map.get(entry.name, {})
            default_title = os.path.splitext(entry.name)[0]
            title = achievement.get("title", "").strip() or default_title

            items.append(
                {
                    "name": entry.name,
                    "displayName": title,
                    "type": media_type,
                    "typeLabel": config["type_label"],
                    "folderLabel": config["label"],
                    "url": f"/{quoted_path}",
                    "size": entry.stat().st_size,
                    "mimeType": mime_type,
                    "posterUrl": find_video_poster(entry.name) if media_type == "video" else "",
                    "achievement": {
                        "title": title,
                        "owner": achievement.get("owner", ""),
                        "patentNo": achievement.get("patentNo", ""),
                        "description": achievement.get("description", ""),
                        "createdAt": achievement.get("createdAt", ""),
                    },
                    "_sortKey": entry.stat().st_mtime,
                }
            )

    items.sort(key=lambda item: item.get("_sortKey", 0), reverse=True)
    for item in items:
        item.pop("_sortKey", None)

    return items


class TouchscreenHandler(SimpleHTTPRequestHandler):
    def send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self) -> dict:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            parsed = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return {}
        return parsed if isinstance(parsed, dict) else {}

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/media":
            self.send_json(
                {
                    "items": build_media_items(),
                    "folders": {
                        media_type: os.path.join("resources", config["directory"])
                        for media_type, config in MEDIA_FOLDERS.items()
                    },
                }
            )
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/achievements/update":
            payload = self.read_json_body()
            name = str(payload.get("name", "")).strip()
            if not name:
                self.send_json({"ok": False, "error": "缺少成果文件名"}, HTTPStatus.BAD_REQUEST)
                return

            metadata_map = load_achievement_meta()
            file_exists = any(
                os.path.isfile(os.path.join(RESOURCE_ROOT, config["directory"], name))
                for config in MEDIA_FOLDERS.values()
            )
            if not file_exists and name not in metadata_map:
                self.send_json({"ok": False, "error": "未找到该成果"}, HTTPStatus.NOT_FOUND)
                return

            old_entry = metadata_map.get(name, {})
            fallback_title = os.path.splitext(name)[0]
            title = str(payload.get("title", "")).strip() or fallback_title
            metadata_map[name] = {
                "title": title,
                "owner": str(payload.get("owner", "")).strip(),
                "patentNo": str(payload.get("patentNo", "")).strip(),
                "description": str(payload.get("description", "")).strip(),
                "createdAt": old_entry.get("createdAt", datetime.now().isoformat(timespec="seconds")),
            }
            save_achievement_meta(metadata_map)
            self.send_json({"ok": True})
            return

        if parsed.path == "/api/achievements/delete":
            payload = self.read_json_body()
            name = str(payload.get("name", "")).strip()
            if not name:
                self.send_json({"ok": False, "error": "缺少成果文件名"}, HTTPStatus.BAD_REQUEST)
                return

            deleted_file = False
            delete_errors = []
            for config in MEDIA_FOLDERS.values():
                candidate = os.path.join(RESOURCE_ROOT, config["directory"], name)
                if os.path.isfile(candidate):
                    try:
                        os.remove(candidate)
                        deleted_file = True
                    except OSError as error:
                        delete_errors.append(str(error))

            media_type = media_type_for_extension(os.path.splitext(name)[1])
            if media_type == "video":
                stem = os.path.splitext(name)[0]
                for directory in [POSTER_DIR, os.path.join(RESOURCE_ROOT, MEDIA_FOLDERS["image"]["directory"])]:
                    for ext in IMAGE_EXTENSIONS:
                        poster_path = os.path.join(directory, f"{stem}{ext}")
                        if os.path.isfile(poster_path):
                            try:
                                os.remove(poster_path)
                            except OSError as error:
                                delete_errors.append(str(error))

            metadata_map = load_achievement_meta()
            removed_meta = metadata_map.pop(name, None) is not None
            if removed_meta:
                save_achievement_meta(metadata_map)

            if delete_errors and not deleted_file and not removed_meta:
                self.send_json({"ok": False, "error": f"删除失败：{delete_errors[0]}"}, HTTPStatus.INTERNAL_SERVER_ERROR)
                return

            if not deleted_file and not removed_meta:
                self.send_json({"ok": False, "error": "未找到该成果"}, HTTPStatus.NOT_FOUND)
                return

            self.send_json({"ok": True})
            return

        if parsed.path != "/api/achievements/upload":
            self.send_json({"ok": False, "error": "Not found"}, HTTPStatus.NOT_FOUND)
            return

        content_type = self.headers.get("Content-Type", "")
        if not content_type.startswith("multipart/form-data"):
            self.send_json({"ok": False, "error": "仅支持 multipart/form-data"}, HTTPStatus.BAD_REQUEST)
            return

        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": content_type,
            },
        )

        upload_file = form["file"] if "file" in form else None
        if upload_file is None or not getattr(upload_file, "filename", ""):
            self.send_json({"ok": False, "error": "请上传成果文件"}, HTTPStatus.BAD_REQUEST)
            return

        raw_filename = normalize_filename(upload_file.filename)
        extension = os.path.splitext(raw_filename)[1].lower()
        media_type = media_type_for_extension(extension)
        if not media_type:
            self.send_json({"ok": False, "error": "文件格式不受支持"}, HTTPStatus.BAD_REQUEST)
            return

        folder_name = MEDIA_FOLDERS[media_type]["directory"]
        folder_path = os.path.join(RESOURCE_ROOT, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        saved_path = unique_file_path(folder_path, raw_filename)
        with open(saved_path, "wb") as target:
            data = upload_file.file.read()
            target.write(data)

        saved_name = os.path.basename(saved_path)
        poster_file = form["posterFrame"] if "posterFrame" in form else None
        if media_type == "video":
            save_video_poster(saved_name, poster_file)
            if not poster_exists_for_video(saved_name):
                try_generate_video_poster(saved_path, saved_name)

        now_iso = datetime.now().isoformat(timespec="seconds")
        title = form.getfirst("title", "").strip() or os.path.splitext(saved_name)[0]
        owner = form.getfirst("owner", "").strip()
        patent_no = form.getfirst("patentNo", "").strip()
        description = form.getfirst("description", "").strip()

        metadata_map = load_achievement_meta()
        metadata_map[saved_name] = {
            "title": title,
            "owner": owner,
            "patentNo": patent_no,
            "description": description,
            "createdAt": now_iso,
        }
        save_achievement_meta(metadata_map)

        self.send_json(
            {
                "ok": True,
                "fileName": saved_name,
                "mediaType": media_type,
            }
        )

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def create_server():
    os.chdir(BASE_DIR)
    return ThreadingHTTPServer((HOST, PORT), TouchscreenHandler)


def run():
    server = create_server()
    print(f"Serving touchscreen app at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
