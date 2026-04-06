use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::{Emitter, Manager};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct MediaItem {
    name: String,
    display_name: String,
    r#type: String,
    type_label: String,
    folder_label: String,
    url: String,
    size: u64,
    mime_type: String,
    poster_url: String,
    achievement: AchievementMeta,
}

#[derive(Serialize)]
struct MediaPayload {
    items: Vec<MediaItem>,
}

#[derive(Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct AchievementMeta {
    title: String,
    owner: String,
    patent_no: String,
    description: String,
    created_at: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct UploadResult {
    ok: bool,
    file_name: String,
    media_type: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ActionResult {
    ok: bool,
}

const ACHIEVEMENT_META_FILE: &str = "achievement_meta.json";
const POSTER_FOLDER: &str = "posters";

fn resources_dir(app: &tauri::AppHandle) -> PathBuf {
    let base = app
        .path()
        .app_data_dir()
        .or_else(|_| app.path().local_data_dir())
        .or_else(|_| app.path().resource_dir())
        .unwrap_or_else(|_| PathBuf::from("."));
    base.join("resources")
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> Result<(), String> {
    if !src.exists() {
        return Ok(());
    }
    fs::create_dir_all(dst).map_err(|error| error.to_string())?;
    for entry in fs::read_dir(src).map_err(|error| error.to_string())? {
        let entry = entry.map_err(|error| error.to_string())?;
        let source_path = entry.path();
        let target_path = dst.join(entry.file_name());
        if source_path.is_dir() {
            copy_dir_recursive(&source_path, &target_path)?;
        } else if !target_path.exists() {
            if let Some(parent) = target_path.parent() {
                fs::create_dir_all(parent).map_err(|error| error.to_string())?;
            }
            fs::copy(&source_path, &target_path).map_err(|error| error.to_string())?;
        }
    }
    Ok(())
}

fn has_any_media(resources: &Path) -> bool {
    for (_, folder, _, _) in media_types() {
        let dir = resources.join(folder);
        if !dir.exists() {
            continue;
        }
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                if entry.path().is_file() {
                    return true;
                }
            }
        }
    }
    false
}

fn initialize_resources(app: &tauri::AppHandle) -> Result<(), String> {
    let writable = resources_dir(app);
    fs::create_dir_all(&writable).map_err(|error| error.to_string())?;
    for (_, folder, _, _) in media_types() {
        fs::create_dir_all(writable.join(folder)).map_err(|error| error.to_string())?;
    }
    fs::create_dir_all(writable.join(POSTER_FOLDER)).map_err(|error| error.to_string())?;

    let should_seed = !has_any_media(&writable) && !writable.join(ACHIEVEMENT_META_FILE).exists();
    if !should_seed {
        return Ok(());
    }

    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(resource_base) = app.path().resource_dir() {
        candidates.push(resource_base.join("resources"));
    }
    if let Ok(current) = std::env::current_dir() {
        candidates.push(current.join("resources"));
        candidates.push(current.join("src-tauri").join("target").join("debug").join("resources"));
    }

    for source in candidates {
        if source.exists() && source != writable {
            copy_dir_recursive(&source, &writable)?;
        }
    }

    Ok(())
}

fn media_types() -> Vec<(&'static str, &'static str, &'static str, Vec<&'static str>)> {
    vec![
        ("video", "videos", "视频目录", vec!["mp4", "webm", "mov", "m4v"]),
        ("image", "images", "图片目录", vec!["jpg", "jpeg", "png", "gif", "webp", "bmp"]),
        ("ppt", "ppt", "PPT 目录", vec!["ppt", "pptx", "pps", "ppsx", "pdf"]),
    ]
}

fn mime_for_path(path: &Path) -> String {
    match path
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or_default()
        .to_ascii_lowercase()
        .as_str()
    {
        "mp4" => "video/mp4",
        "webm" => "video/webm",
        "mov" | "m4v" => "video/quicktime",
        "jpg" | "jpeg" => "image/jpeg",
        "png" => "image/png",
        "gif" => "image/gif",
        "webp" => "image/webp",
        "bmp" => "image/bmp",
        "pdf" => "application/pdf",
        "ppt" => "application/vnd.ms-powerpoint",
        "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "pps" => "application/vnd.ms-powerpoint",
        "ppsx" => "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        _ => "application/octet-stream",
    }
    .to_string()
}

fn normalize_filename(name: &str) -> String {
    let mut cleaned = String::new();
    for ch in name.trim().chars() {
        if ch.is_ascii_alphanumeric() || matches!(ch, '.' | '-' | '_') || ('\u{4e00}'..='\u{9fff}').contains(&ch) {
            cleaned.push(ch);
        } else {
            cleaned.push('_');
        }
    }

    let trimmed = cleaned.trim_start_matches('.').to_string();
    if trimmed.is_empty() {
        "achievement_file".to_string()
    } else {
        trimmed
    }
}

fn unique_file_path(folder_path: &Path, filename: &str) -> PathBuf {
    let mut candidate = folder_path.join(filename);
    if !candidate.exists() {
        return candidate;
    }

    let stem = Path::new(filename)
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or("achievement_file");
    let extension = Path::new(filename)
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("");

    let mut index = 1;
    while candidate.exists() {
        let next = if extension.is_empty() {
            format!("{stem}_{index}")
        } else {
            format!("{stem}_{index}.{extension}")
        };
        candidate = folder_path.join(next);
        index += 1;
    }

    candidate
}

fn load_achievement_meta(resources: &Path) -> HashMap<String, AchievementMeta> {
    let path = resources.join(ACHIEVEMENT_META_FILE);
    if !path.exists() {
        return HashMap::new();
    }

    let content = match fs::read_to_string(path) {
        Ok(value) => value,
        Err(_) => return HashMap::new(),
    };

    let parsed: Result<Value, _> = serde_json::from_str(&content);
    let Some(map) = parsed.ok().and_then(|value| value.as_object().cloned()) else {
        return HashMap::new();
    };

    map.into_iter()
        .filter_map(|(key, value)| serde_json::from_value::<AchievementMeta>(value).ok().map(|meta| (key, meta)))
        .collect()
}

fn save_achievement_meta(resources: &Path, payload: &HashMap<String, AchievementMeta>) -> Result<(), String> {
    fs::create_dir_all(resources).map_err(|error| error.to_string())?;
    let path = resources.join(ACHIEVEMENT_META_FILE);
    let body = serde_json::to_string_pretty(payload).map_err(|error| error.to_string())?;
    fs::write(path, body).map_err(|error| error.to_string())
}

fn find_video_poster(resources: &Path, video_name: &str) -> String {
    let stem = Path::new(video_name)
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or_default();

    let poster_dir = resources.join(POSTER_FOLDER);
    if poster_dir.exists() {
        for extension in ["jpg", "jpeg", "png", "gif", "webp", "bmp"] {
            let candidate = poster_dir.join(format!("{stem}.{extension}"));
            if candidate.exists() {
                return candidate.to_string_lossy().to_string();
            }
        }
    }

    let image_dir = resources.join("images");
    if image_dir.exists() {
        for extension in ["jpg", "jpeg", "png", "gif", "webp", "bmp"] {
            let candidate = image_dir.join(format!("{stem}.{extension}"));
            if candidate.exists() {
                return candidate.to_string_lossy().to_string();
            }
        }
    }

    String::new()
}

fn save_video_poster(resources: &Path, video_name: &str, poster_data: &[u8]) -> Result<(), String> {
    if poster_data.is_empty() {
        return Ok(());
    }

    let stem = Path::new(video_name)
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or_default();

    if stem.is_empty() {
        return Ok(());
    }

    let poster_dir = resources.join(POSTER_FOLDER);
    fs::create_dir_all(&poster_dir).map_err(|error| error.to_string())?;
    let poster_path = poster_dir.join(format!("{stem}.jpg"));
    fs::write(poster_path, poster_data).map_err(|error| error.to_string())
}

fn try_generate_video_poster(resources: &Path, saved_video_path: &Path, video_name: &str) {
    if !find_video_poster(resources, video_name).is_empty() {
        return;
    }

    let stem = Path::new(video_name)
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or_default();
    if stem.is_empty() {
        return;
    }

    let poster_dir = resources.join(POSTER_FOLDER);
    if fs::create_dir_all(&poster_dir).is_err() {
        return;
    }

    let poster_path = poster_dir.join(format!("{stem}.jpg"));
    let input = saved_video_path.to_string_lossy().to_string();
    let output = poster_path.to_string_lossy().to_string();
    let attempts: Vec<Vec<&str>> = vec![
        vec!["-y", "-ss", "0.20", "-i", &input, "-frames:v", "1", "-q:v", "2", &output],
        vec!["-y", "-i", &input, "-frames:v", "1", "-q:v", "2", &output],
    ];

    for args in attempts {
        let status = Command::new("ffmpeg").args(args).stdout(std::process::Stdio::null()).stderr(std::process::Stdio::null()).status();
        if let Ok(exit) = status {
            if exit.success() {
                if poster_path.exists() {
                    return;
                }
            }
        }
    }

    // macOS fallback without ffmpeg: QuickLook thumbnail.
    let temp_dir = std::env::temp_dir().join(format!("tjipe-ql-{}", std::process::id()));
    if fs::create_dir_all(&temp_dir).is_err() {
        return;
    }

    let ql_status = Command::new("qlmanage")
        .args([
            "-t",
            "-s",
            "1024",
            "-o",
            &temp_dir.to_string_lossy(),
            &saved_video_path.to_string_lossy(),
        ])
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .status();

    if let Ok(exit) = ql_status {
        if exit.success() {
            let source_name = format!(
                "{}.png",
                saved_video_path.file_name().and_then(|v| v.to_str()).unwrap_or_default()
            );
            let quicklook_png = temp_dir.join(source_name);
            if quicklook_png.exists() {
                let target_png = poster_dir.join(format!("{stem}.png"));
                let _ = fs::copy(quicklook_png, target_png);
            }
        }
    }
}

fn folder_for_media_type(media_type: &str) -> &'static str {
    match media_type {
        "video" => "videos",
        "image" => "images",
        _ => "ppt",
    }
}

fn media_type_for_extension(extension: &str) -> Option<&'static str> {
    let ext = extension.to_ascii_lowercase();
    for (media_type, _, _, extensions) in media_types() {
        if extensions.iter().any(|value| *value == ext) {
            return Some(media_type);
        }
    }
    None
}

fn find_media_file_by_name(resources: &Path, file_name: &str) -> Option<PathBuf> {
    for (_, folder, _, _) in media_types() {
        let candidate = resources.join(folder).join(file_name);
        if candidate.exists() {
            return Some(candidate);
        }
    }
    None
}

fn collect_video_stems(resources: &Path) -> HashSet<String> {
    let mut stems = HashSet::new();
    let video_dir = resources.join("videos");
    if !video_dir.exists() {
        return stems;
    }

    let Ok(entries) = fs::read_dir(video_dir) else {
        return stems;
    };

    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let extension = path
            .extension()
            .and_then(|value| value.to_str())
            .unwrap_or_default()
            .to_ascii_lowercase();
        if media_type_for_extension(&extension) == Some("video") {
            if let Some(stem) = path.file_stem().and_then(|value| value.to_str()) {
                stems.insert(stem.to_string());
            }
        }
    }

    stems
}

fn delete_video_posters(resources: &Path, file_name: &str) -> Result<(), String> {
    let stem = Path::new(file_name)
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or_default();
    if stem.is_empty() {
        return Ok(());
    }

    for directory in [resources.join(POSTER_FOLDER), resources.join("images")] {
        if !directory.exists() {
            continue;
        }

        for extension in ["jpg", "jpeg", "png", "gif", "webp", "bmp"] {
            let candidate = directory.join(format!("{stem}.{extension}"));
            if candidate.exists() {
                fs::remove_file(candidate).map_err(|error| error.to_string())?;
            }
        }
    }

    Ok(())
}

#[tauri::command]
fn list_media(app: tauri::AppHandle) -> Result<MediaPayload, String> {
    let resources_dir = resources_dir(&app);
    let metadata_map = load_achievement_meta(&resources_dir);
    let video_stems = collect_video_stems(&resources_dir);
    let mut entries_with_time: Vec<(MediaItem, u128)> = Vec::new();

    for (media_type, folder, label, extensions) in media_types() {
        let dir = resources_dir.join(folder);
        if !dir.exists() {
            continue;
        }

        let entries = fs::read_dir(&dir).map_err(|error| error.to_string())?;
        let mut files: Vec<PathBuf> = entries
            .filter_map(|entry| entry.ok().map(|value| value.path()))
            .filter(|path| path.is_file())
            .collect();
        files.sort();

        for path in files {
            let extension = path
                .extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or_default()
                .to_ascii_lowercase();

            if !extensions.iter().any(|value| value == &extension) {
                continue;
            }

            if media_type == "image" {
                if let Some(stem) = path.file_stem().and_then(|value| value.to_str()) {
                    if video_stems.contains(stem) {
                        // Skip generated poster images for videos.
                        continue;
                    }
                }
            }

            let metadata = fs::metadata(&path).map_err(|error| error.to_string())?;
            let name = path
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or_default()
                .to_string();
            let default_title = path
                .file_stem()
                .and_then(|name| name.to_str())
                .unwrap_or_default()
                .to_string();
            let achievement = metadata_map.get(&name).cloned().unwrap_or_default();
            let title = if achievement.title.trim().is_empty() {
                default_title
            } else {
                achievement.title.clone()
            };

            let item = MediaItem {
                name,
                display_name: title.clone(),
                r#type: media_type.to_string(),
                type_label: match media_type {
                    "video" => "视频".to_string(),
                    "image" => "图片".to_string(),
                    _ => "PPT".to_string(),
                },
                folder_label: label.to_string(),
                url: path.to_string_lossy().to_string(),
                size: metadata.len(),
                mime_type: mime_for_path(&path),
                poster_url: if media_type == "video" {
                    find_video_poster(&resources_dir, &path.file_name().and_then(|v| v.to_str()).unwrap_or_default().to_string())
                } else {
                    String::new()
                },
                achievement: AchievementMeta {
                    title,
                    owner: achievement.owner,
                    patent_no: achievement.patent_no,
                    description: achievement.description,
                    created_at: achievement.created_at,
                },
            };

            let modified = metadata
                .modified()
                .ok()
                .and_then(|value| value.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|value| value.as_millis())
                .unwrap_or(0);
            entries_with_time.push((item, modified));
        }
    }

    entries_with_time.sort_by(|left, right| right.1.cmp(&left.1));
    let items = entries_with_time.into_iter().map(|value| value.0).collect();

    Ok(MediaPayload { items })
}

#[tauri::command]
fn upload_achievement(
    app: tauri::AppHandle,
    file_name: String,
    data: Vec<u8>,
    poster_data: Option<Vec<u8>>,
    title: String,
    owner: String,
    patent_no: String,
    description: String,
) -> Result<UploadResult, String> {
    if data.is_empty() {
        return Err("上传文件内容为空".to_string());
    }

    let cleaned_name = normalize_filename(&file_name);
    let extension = Path::new(&cleaned_name)
        .extension()
        .and_then(|value| value.to_str())
        .map(|value| value.to_ascii_lowercase())
        .unwrap_or_default();

    let media_type = media_type_for_extension(&extension)
        .ok_or_else(|| "文件格式不受支持".to_string())?
        .to_string();
    let folder = folder_for_media_type(&media_type);
    let resources = resources_dir(&app);
    let target_dir = resources.join(folder);
    fs::create_dir_all(&target_dir).map_err(|error| error.to_string())?;

    let target_path = unique_file_path(&target_dir, &cleaned_name);
    let mut file = fs::File::create(&target_path).map_err(|error| error.to_string())?;
    file.write_all(&data).map_err(|error| error.to_string())?;

    let saved_name = target_path
        .file_name()
        .and_then(|value| value.to_str())
        .unwrap_or_default()
        .to_string();

    if media_type == "video" {
        if let Some(bytes) = poster_data.as_ref() {
            save_video_poster(&resources, &saved_name, bytes)?;
        }
        if find_video_poster(&resources, &saved_name).is_empty() {
            try_generate_video_poster(&resources, &target_path, &saved_name);
        }
    }

    let fallback_title = target_path
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or("成果")
        .to_string();

    let mut meta = load_achievement_meta(&resources);
    meta.insert(
        saved_name.clone(),
        AchievementMeta {
            title: if title.trim().is_empty() {
                fallback_title
            } else {
                title.trim().to_string()
            },
            owner: owner.trim().to_string(),
            patent_no: patent_no.trim().to_string(),
            description: description.trim().to_string(),
            created_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|value| value.as_secs().to_string())
                .unwrap_or_default(),
        },
    );
    save_achievement_meta(&resources, &meta)?;

    Ok(UploadResult {
        ok: true,
        file_name: saved_name,
        media_type,
    })
}

#[tauri::command]
fn update_achievement_meta(
    app: tauri::AppHandle,
    file_name: String,
    title: String,
    owner: String,
    patent_no: String,
    description: String,
) -> Result<ActionResult, String> {
    let resources = resources_dir(&app);
    let mut meta = load_achievement_meta(&resources);
    let file_exists = find_media_file_by_name(&resources, &file_name).is_some();

    if !file_exists && !meta.contains_key(&file_name) {
        return Err("未找到该成果".to_string());
    }

    let fallback_title = Path::new(&file_name)
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or("成果")
        .to_string();
    let old = meta.get(&file_name).cloned().unwrap_or_default();
    meta.insert(
        file_name,
        AchievementMeta {
            title: if title.trim().is_empty() {
                fallback_title
            } else {
                title.trim().to_string()
            },
            owner: owner.trim().to_string(),
            patent_no: patent_no.trim().to_string(),
            description: description.trim().to_string(),
            created_at: if old.created_at.trim().is_empty() {
                std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .map(|value| value.as_secs().to_string())
                    .unwrap_or_default()
            } else {
                old.created_at
            },
        },
    );
    save_achievement_meta(&resources, &meta)?;

    Ok(ActionResult { ok: true })
}

#[tauri::command]
fn delete_achievement(app: tauri::AppHandle, file_name: String) -> Result<ActionResult, String> {
    let resources = resources_dir(&app);
    let mut deleted_file = false;
    let extension = Path::new(&file_name)
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or_default()
        .to_ascii_lowercase();
    let mut is_video = media_type_for_extension(&extension) == Some("video");

    if let Some(path) = find_media_file_by_name(&resources, &file_name) {
        let file_extension = path
            .extension()
            .and_then(|value| value.to_str())
            .unwrap_or_default()
            .to_ascii_lowercase();
        if media_type_for_extension(&file_extension) == Some("video") {
            is_video = true;
        }
        fs::remove_file(path).map_err(|error| error.to_string())?;
        deleted_file = true;
    }

    if is_video {
        delete_video_posters(&resources, &file_name)?;
    }

    let mut meta = load_achievement_meta(&resources);
    let removed_meta = meta.remove(&file_name).is_some();
    if removed_meta {
        save_achievement_meta(&resources, &meta)?;
    }

    if !deleted_file && !removed_meta {
        return Err("未找到该成果".to_string());
    }

    Ok(ActionResult { ok: true })
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            initialize_resources(&app.handle())?;
            let handle = app.handle().clone();
            tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("index.html".into()))
                .title("天津知识产权交易中心触摸屏展示软件")
                .inner_size(1600.0, 900.0)
                .resizable(true)
                .fullscreen(true)
                .on_new_window(move |url, _features| {
                    let _ = handle.emit("portal-open-url", url.as_str().to_string());
                    tauri::webview::NewWindowResponse::Deny
                })
                .build()?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_media,
            upload_achievement,
            update_achievement_meta,
            delete_achievement
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
