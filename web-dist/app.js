const navButtons = document.querySelectorAll(".nav__button, .home-suggestion-link");
const viewPanels = document.querySelectorAll(".view");
const screenApp = document.querySelector(".screen-app");
const homeTriggerButtons = document.querySelectorAll("[data-home-trigger]");
const homeClockTime = document.querySelector("#homeClockTime");
const homeClockDate = document.querySelector("#homeClockDate");
const promoQrImage = document.querySelector("#promoQrImage");
const promoQrPlaceholder = document.querySelector("#promoQrPlaceholder");
const promoUploadUrl = document.querySelector("#promoUploadUrl");
const promoQrStatus = document.querySelector("#promoQrStatus");
const promoCopyButton = document.querySelector("#promoCopyButton");
const promoRefreshButton = document.querySelector("#promoRefreshButton");
const promoList = document.querySelector("#promoList");
const promoGrid = document.querySelector("#promoGrid");
const promoEmpty = document.querySelector("#promoEmpty");
const promoPrevButton = document.querySelector("#promoPrevButton");
const promoNextButton = document.querySelector("#promoNextButton");
const refreshPromoButton = document.querySelector("#refreshPromoButton");
const promoPlayCloseButton = document.querySelector("#promoPlayCloseButton");
const mediaGrid = document.querySelector("#mediaGrid");
const mediaEmpty = document.querySelector("#mediaEmpty");
const mediaCardTemplate = document.querySelector("#mediaCardTemplate");
const refreshMediaButton = document.querySelector("#refreshMediaButton");
const carouselPrevButton = document.querySelector("#carouselPrevButton");
const carouselNextButton = document.querySelector("#carouselNextButton");
const viewerOverlay = document.querySelector("#viewerOverlay");
const viewerBody = document.querySelector("#viewerBody");
const viewerTitle = document.querySelector("#viewerTitle");
const viewerMeta = document.querySelector("#viewerMeta");
const viewerType = document.querySelector("#viewerType");
const viewerOpenLink = document.querySelector("#viewerOpenLink");
const viewerCloseButton = document.querySelector("#viewerCloseButton");
const viewerCloseFloatingButton = document.querySelector("#viewerCloseFloatingButton");
const tradingFrame = document.querySelector("#tradingFrame");
const dataIpFrame = document.querySelector("#dataIpFrame");
const officialFrame = document.querySelector("#officialFrame");
const innovationFrame = document.querySelector("#innovationFrame");
const scanFrame = document.querySelector("#scanFrame");
const tradingRefreshButton = document.querySelector("#tradingRefreshButton");
const dataIpRefreshButton = document.querySelector("#dataIpRefreshButton");
const officialRefreshButton = document.querySelector("#officialRefreshButton");
const innovationRefreshButton = document.querySelector("#innovationRefreshButton");
const scanRefreshButton = document.querySelector("#scanRefreshButton");
const tradingCompatButton = document.querySelector("#tradingCompatButton");
const dataIpCompatButton = document.querySelector("#dataIpCompatButton");
const officialCompatButton = document.querySelector("#officialCompatButton");
const innovationCompatButton = document.querySelector("#innovationCompatButton");
const tradingBackButton = document.querySelector("#tradingBackButton");
const dataIpBackButton = document.querySelector("#dataIpBackButton");
const officialBackButton = document.querySelector("#officialBackButton");
const innovationBackButton = document.querySelector("#innovationBackButton");
const scanBackButton = document.querySelector("#scanBackButton");
const tradingCloseButton = document.querySelector("#tradingCloseButton");
const dataIpCloseButton = document.querySelector("#dataIpCloseButton");
const officialCloseButton = document.querySelector("#officialCloseButton");
const innovationCloseButton = document.querySelector("#innovationCloseButton");
const scanCloseButton = document.querySelector("#scanCloseButton");
const scanConnectButton = document.querySelector("#scanConnectButton");
const scanModeSelect = document.querySelector("#scanModeSelect");
const scanTerminatorSelect = document.querySelector("#scanTerminatorSelect");
const scanKeyGapInput = document.querySelector("#scanKeyGapInput");
const scanMinLengthInput = document.querySelector("#scanMinLengthInput");
const scanOpenModeSelect = document.querySelector("#scanOpenModeSelect");
const scanUrlTemplateInput = document.querySelector("#scanUrlTemplateInput");
const scanStatus = document.querySelector("#scanStatus");
const scanLatestResult = document.querySelector("#scanLatestResult");
const achievementForm = document.querySelector("#achievementForm");
const achievementFile = document.querySelector("#achievementFile");
const achievementTitle = document.querySelector("#achievementTitle");
const achievementOwner = document.querySelector("#achievementOwner");
const achievementPatentNo = document.querySelector("#achievementPatentNo");
const achievementDescription = document.querySelector("#achievementDescription");
const achievementStatus = document.querySelector("#achievementStatus");
const achievementList = document.querySelector("#achievementList");
const achievementSubmitButton = document.querySelector("#achievementSubmitButton");
const achievementCancelButton = document.querySelector("#achievementCancelButton");
const achievementSelectAll = document.querySelector("#achievementSelectAll");
const achievementBatchDeleteButton = document.querySelector("#achievementBatchDeleteButton");
const achievementSelectedCount = document.querySelector("#achievementSelectedCount");
const achievementUploadPreview = document.querySelector("#achievementUploadPreview");
const achievementUploadPreviewImage = document.querySelector("#achievementUploadPreviewImage");
const achievementUploadPreviewEmpty = document.querySelector("#achievementUploadPreviewEmpty");
const achievementUploadProgressBar = document.querySelector("#achievementUploadProgressBar");
const achievementUploadProgressText = document.querySelector("#achievementUploadProgressText");
const achievementPosterFile = document.querySelector("#achievementPosterFile");
const achievementOpenUploadButton = document.querySelector("#achievementOpenUploadButton");
const achievementUploadModal = document.querySelector("#achievementUploadModal");
const achievementModalCloseButton = document.querySelector("#achievementModalCloseButton");

let mediaItems = [];
let promotionItems = [];
let currentPage = 0;
let currentPromoPage = 0;
let viewerVisible = false;
let cardRotateId = null;
let homeClockTimerId = null;
let resourceVersion = 0;
let mobileUploadConfig = null;
let editingAchievementName = null;
let pendingPosterBlob = null;
let pendingPosterToken = "";
let promoQrCandidateUrls = [];
let promoQrCandidateIndex = 0;
let promoPlaybackTimerId = null;
const selectedAchievementNames = new Set();
const videoPreviewCache = new Map();
const CARD_ROTATE_MS = 9000;
const CARDS_PER_PAGE = 4;
const portalState = new WeakMap();
const VIEW_STORAGE_KEY = "tjipe-active-view";
const AVAILABLE_VIEWS = new Set(Array.from(viewPanels).map((panel) => panel.dataset.viewPanel).filter(Boolean));
const SCAN_CONFIG_KEY = "tjipe-scan-config";
const PREVIEW_QUERY_KEY = "view";
const PORTRAIT_PREVIEW_QUERY_KEY = "preview";
const PORTAL_VIEW_CONFIG = {
  trading: { title: "交易项目查询", url: "https://zscq.tpre.cn/ListedTec/Index", frame: tradingFrame },
  "data-ip": { title: "数据知识产权登记", url: "http://www.tjipe.com/data-asset/index", frame: dataIpFrame },
  official: { title: "中心官网", url: "http://www.tjipe.com", frame: officialFrame },
  innovation: { title: "创新专区", url: "https://zscq.tpre.cn/RoadShow/Home/Index", frame: innovationFrame },
};
const PREVIEW_SHORTCUT_VIEWS = {
  Digit1: "home",
  Digit2: "showcase",
  Digit3: "manage",
  Digit4: "push",
  Digit5: "promo-play",
  Digit6: "innovation",
  Digit7: "trading",
  Digit8: "data-ip",
  Digit9: "official",
};

let scanConnected = true;
let scanBuffer = "";
let scanLastTs = 0;
let scanIdleTimer = null;
let scanLogItems = [];
let scanConfig = {
  mode: "keyboard",
  terminator: "enter",
  keyGapMs: 80,
  minLength: 4,
  openMode: "inline",
  urlTemplate: "",
};

function isTauriRuntime() {
  return Boolean(window.__TAURI_INTERNALS__ || (window.__TAURI__ && typeof window.__TAURI__.invoke === "function"));
}

function getTauriInvoke() {
  if (window.__TAURI__ && typeof window.__TAURI__.invoke === "function") {
    return window.__TAURI__.invoke;
  }

  if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === "function") {
    return (command, args) => window.__TAURI_INTERNALS__.invoke(command, args);
  }

  return null;
}

function getTauriListen() {
  if (window.__TAURI__ && typeof window.__TAURI__.listen === "function") {
    return window.__TAURI__.listen;
  }

  return null;
}

function getStoredView() {
  try {
    return window.sessionStorage.getItem(VIEW_STORAGE_KEY) || window.localStorage.getItem(VIEW_STORAGE_KEY) || "";
  } catch (_error) {
    return "";
  }
}

function getPreviewRequest() {
  const params = new URLSearchParams(window.location.search || "");
  const requestedView = (params.get(PREVIEW_QUERY_KEY) || "").trim();
  const previewMode = (params.get(PORTRAIT_PREVIEW_QUERY_KEY) || "").trim().toLowerCase();
  return {
    view: AVAILABLE_VIEWS.has(requestedView) ? requestedView : "",
    portraitPreview: previewMode === "portrait" || previewMode === "vertical",
  };
}

function storeView(view) {
  try {
    window.sessionStorage.setItem(VIEW_STORAGE_KEY, view);
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  } catch (_error) {
    // Ignore storage errors.
  }
}

function getCurrentView() {
  const active = document.querySelector(".view.is-active");
  return active?.dataset?.viewPanel || "";
}

function ensureActiveView() {
  const stored = getStoredView();
  if (stored && AVAILABLE_VIEWS.has(stored)) {
    const current = getCurrentView();
    if (current !== stored) {
      switchView(stored, { persist: false });
    }
    return stored;
  }

  const current = getCurrentView();
  if (current && AVAILABLE_VIEWS.has(current)) {
    return current;
  }

  if (AVAILABLE_VIEWS.has("home")) {
    switchView("home", { persist: false });
    return "home";
  }

  return "";
}

function applyPreviewRequest() {
  const request = getPreviewRequest();
  if (request.portraitPreview) {
    document.body.classList.add("preview-portrait");
  }

  if (request.view) {
    switchView(request.view, { persist: false });
  }
}

async function waitForTauriInvoke(timeoutMs = 10000) {
  if (!isTauriRuntime()) {
    return null;
  }

  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const invoke = getTauriInvoke();
    if (invoke) {
      return invoke;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  }

  return getTauriInvoke();
}

function getPortalConfig(view) {
  return PORTAL_VIEW_CONFIG[view] || null;
}

function getStandbyItems() {
  return promotionItems.length > 0 ? promotionItems : mediaItems;
}

function getTotalPagesForItems(items) {
  return Math.ceil(items.length / CARDS_PER_PAGE);
}

function updateHomeClock() {
  if (!homeClockTime && !homeClockDate) {
    return;
  }
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  if (homeClockTime) {
    homeClockTime.textContent = `${hours}:${minutes}`;
  }
  if (homeClockDate) {
    homeClockDate.textContent = `${year}.${month}.${day} ${weekdays[now.getDay()]}`;
  }
}

function startHomeClock() {
  updateHomeClock();
  if (homeClockTimerId) {
    window.clearInterval(homeClockTimerId);
  }
  homeClockTimerId = window.setInterval(updateHomeClock, 1000 * 20);
}

function handlePreviewShortcut(event) {
  if (!event.ctrlKey || !event.shiftKey || event.altKey || event.metaKey) {
    return;
  }

  const targetView = PREVIEW_SHORTCUT_VIEWS[event.code];
  if (!targetView) {
    return;
  }

  event.preventDefault();
  resetStandbyTimer();
  switchView(targetView, { persist: false });
  if (targetView !== "manage") {
    closeUploadModal();
  }
}

async function invokePortalCommand(command, payload = {}) {
  const tauriInvoke = await waitForTauriInvoke(8000);
  if (!tauriInvoke) {
    throw new Error("桌面桥接尚未就绪，请稍后重试");
  }
  return tauriInvoke(command, payload);
}

function loadScanConfig() {
  try {
    const raw = window.localStorage.getItem(SCAN_CONFIG_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      scanConfig = {
        ...scanConfig,
        ...parsed,
        keyGapMs: Number(parsed.keyGapMs) > 0 ? Number(parsed.keyGapMs) : scanConfig.keyGapMs,
        minLength: Number(parsed.minLength) > 0 ? Number(parsed.minLength) : scanConfig.minLength,
      };
    }
  } catch (_error) {
    // Ignore invalid storage.
  }
}

function saveScanConfig() {
  try {
    window.localStorage.setItem(SCAN_CONFIG_KEY, JSON.stringify(scanConfig));
  } catch (_error) {
    // Ignore storage errors.
  }
}

function renderScanConfig() {
  if (scanModeSelect) {
    scanModeSelect.value = scanConfig.mode;
  }
  if (scanTerminatorSelect) {
    scanTerminatorSelect.value = scanConfig.terminator;
  }
  if (scanKeyGapInput) {
    scanKeyGapInput.value = String(scanConfig.keyGapMs);
  }
  if (scanMinLengthInput) {
    scanMinLengthInput.value = String(scanConfig.minLength);
  }
  if (scanOpenModeSelect) {
    scanOpenModeSelect.value = scanConfig.openMode;
  }
  if (scanUrlTemplateInput) {
    scanUrlTemplateInput.value = scanConfig.urlTemplate || "";
  }
}

function setScanStatus(text) {
  if (scanStatus) {
    scanStatus.textContent = text;
  }
}

function renderScanLog() {
  if (!scanLatestResult) {
    return;
  }
  if (scanLogItems.length === 0) {
    scanLatestResult.textContent = "最近结果：暂无";
    return;
  }
  const latest = scanLogItems[0];
  scanLatestResult.textContent = `最近结果：${latest.text}`;
}

function appendScanLog(text) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  scanLogItems.unshift({ time: `${hh}:${mm}:${ss}`, text: String(text || "") });
  scanLogItems = scanLogItems.slice(0, 12);
  renderScanLog();
}

function normalizeScannedUrl(raw) {
  const text = String(raw || "")
    .trim()
    .replace(/[：]/g, ":")
    .replace(/[。]/g, ".")
    .replace(/[／]/g, "/")
    .replace(/[？]/g, "?")
    .replace(/[＆]/g, "&")
    .replace(/[＝]/g, "=")
    .replace(/[＃]/g, "#")
    .replace(/[％]/g, "%");
  const repairedText = text
    .replace(/^https\/\//i, "https://")
    .replace(/^http\/\//i, "http://");
  if (!repairedText) {
    return "";
  }
  if (/^https?:\/\//i.test(repairedText)) {
    return repairedText;
  }
  const template = (scanConfig.urlTemplate || "").trim();
  if (template && template.includes("{code}")) {
    return template.replaceAll("{code}", encodeURIComponent(repairedText));
  }
  return "";
}

async function openScannedResult(rawText) {
  const url = normalizeScannedUrl(rawText);
  if (!url) {
    appendScanLog(`未匹配URL：${rawText}`);
    setScanStatus("扫码内容不是URL，且未配置模板。");
    return;
  }

  if (!scanFrame || !AVAILABLE_VIEWS.has("scan")) {
    setScanStatus("当前未启用扫码展示页。");
    return;
  }

  appendScanLog(url);
  if (scanConfig.openMode === "compat" && isTauriRuntime()) {
    await invokePortalCommand("open_portal", { url, title: "成果扫描（兼容模式）" });
    setScanStatus("已在兼容模式打开扫码链接。");
    return;
  }

  switchView("scan", { persist: true });
  navigateFrame(scanFrame, url, true);
  setScanStatus("已在本页容器打开扫码链接。");
}

function collectScanConfigFromUi() {
  scanConfig.mode = scanModeSelect?.value || "keyboard";
  scanConfig.terminator = scanTerminatorSelect?.value || "enter";
  scanConfig.keyGapMs = Math.max(20, Math.min(500, Number(scanKeyGapInput?.value || 80) || 80));
  scanConfig.minLength = Math.max(1, Math.min(64, Number(scanMinLengthInput?.value || 4) || 4));
  scanConfig.openMode = scanOpenModeSelect?.value || "inline";
  scanConfig.urlTemplate = (scanUrlTemplateInput?.value || "").trim();
}

function finalizeScanBuffer() {
  const text = scanBuffer.trim();
  scanBuffer = "";
  scanLastTs = 0;
  if (text.length < scanConfig.minLength) {
    return;
  }
  openScannedResult(text).catch((error) => {
    setScanStatus(`扫码打开失败：${error instanceof Error ? error.message : String(error)}`);
  });
}

function consumeScannerKey(key) {
  const now = Date.now();
  if (scanLastTs && now - scanLastTs > scanConfig.keyGapMs) {
    scanBuffer = "";
  }
  scanLastTs = now;

  const terminator = scanConfig.terminator;
  const isEnter = key === "Enter";
  const isTab = key === "Tab";
  const isTerminator = (terminator === "enter" && isEnter) || (terminator === "tab" && isTab);
  if (isTerminator) {
    finalizeScanBuffer();
    return true;
  }

  if (typeof key === "string" && key.length === 1) {
    scanBuffer += key;
    if (scanIdleTimer) {
      window.clearTimeout(scanIdleTimer);
    }
    if (terminator === "none") {
      scanIdleTimer = window.setTimeout(() => {
        finalizeScanBuffer();
      }, Math.max(120, scanConfig.keyGapMs + 40));
    }
  }
  return false;
}

function handleKeyboardScannerInput(event) {
  if (!scanConnected || scanConfig.mode !== "keyboard") {
    return;
  }
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }
  if (consumeScannerKey(event.key)) {
    event.preventDefault();
  }
}

async function openPortalForView(view) {
  const config = getPortalConfig(view);
  if (!config) {
    return;
  }
  if (!isTauriRuntime()) {
    navigateFrame(config.frame, config.url, true);
    return;
  }
  await invokePortalCommand("open_portal", { url: config.url, title: config.title });
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "未知大小";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function fileToken(file) {
  if (!file) {
    return "";
  }
  return `${file.name}|${file.size}|${file.lastModified}`;
}

function setUploadProgress(percent, label = "") {
  const safePercent = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  if (achievementUploadProgressBar) {
    achievementUploadProgressBar.style.width = `${safePercent}%`;
  }
  if (achievementUploadProgressText) {
    achievementUploadProgressText.textContent = label ? `${safePercent}% · ${label}` : `${safePercent}%`;
  }
}

function clearUploadPreview() {
  pendingPosterBlob = null;
  pendingPosterToken = "";
  if (achievementUploadPreviewImage) {
    achievementUploadPreviewImage.hidden = true;
    achievementUploadPreviewImage.removeAttribute("src");
  }
  if (achievementUploadPreviewEmpty) {
    achievementUploadPreviewEmpty.hidden = false;
    achievementUploadPreviewEmpty.textContent = "选择文件后自动生成预览图";
  }
  if (achievementPosterFile) {
    achievementPosterFile.value = "";
  }
  setUploadProgress(0);
}

function showUploadPreviewFromBlob(blob, emptyText = "已生成预览图") {
  if (!achievementUploadPreviewImage || !achievementUploadPreviewEmpty || !blob) {
    return;
  }
  const objectUrl = URL.createObjectURL(blob);
  achievementUploadPreviewImage.onload = () => {
    URL.revokeObjectURL(objectUrl);
  };
  achievementUploadPreviewImage.src = objectUrl;
  achievementUploadPreviewImage.hidden = false;
  achievementUploadPreviewEmpty.hidden = true;
  achievementUploadPreviewEmpty.textContent = emptyText;
}

function buildVersionedUrl(url) {
  if (isTauriRuntime()) {
    if (window.__TAURI__ && typeof window.__TAURI__.convertFileSrc === "function") {
      return window.__TAURI__.convertFileSrc(url);
    }
    if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.convertFileSrc === "function") {
      return window.__TAURI_INTERNALS__.convertFileSrc(url, "asset");
    }
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${resourceVersion}`;
}

function buildPromoQrCandidates() {
  const uploadPageUrl = mobileUploadConfig?.uploadPageUrl || "";
  if (!uploadPageUrl || mobileUploadConfig?.available === false) {
    return [];
  }

  const encoded = encodeURIComponent(uploadPageUrl);
  const candidates = [
    mobileUploadConfig?.qrImageUrl || "",
    `https://quickchart.io/qr?size=280&text=${encoded}`,
    `https://chart.googleapis.com/chart?cht=qr&chs=280x280&chl=${encoded}`,
  ].filter(Boolean);

  return Array.from(new Set(candidates));
}

function handlePromoQrFailure() {
  if (!promoQrImage || !promoQrPlaceholder) {
    return;
  }

  if (promoQrCandidateIndex + 1 < promoQrCandidateUrls.length) {
    promoQrCandidateIndex += 1;
    promoQrImage.src = promoQrCandidateUrls[promoQrCandidateIndex];
    return;
  }

  promoQrImage.hidden = true;
  promoQrImage.removeAttribute("src");
  promoQrPlaceholder.hidden = false;
  promoQrPlaceholder.textContent = "二维码加载失败，请使用下方地址在手机浏览器中打开";
}

function handlePromoQrSuccess() {
  if (!promoQrImage || !promoQrPlaceholder) {
    return;
  }

  promoQrImage.hidden = false;
  promoQrPlaceholder.hidden = true;
}

function buildTauriFileUrl(url) {
  if (!url || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
    return "";
  }

  const normalized = String(url).replace(/\\/g, "/");

  if (/^[a-zA-Z]:\//.test(normalized)) {
    return encodeURI(`file:///${normalized}`);
  }

  if (normalized.startsWith("/")) {
    return encodeURI(`file://${normalized}`);
  }

  return "";
}

function buildMediaUrlCandidates(url) {
  const candidates = [];
  const append = (value) => {
    if (!value) {
      return;
    }
    if (!candidates.includes(value)) {
      candidates.push(value);
    }
  };

  if (!isTauriRuntime()) {
    append(buildVersionedUrl(url));
    return candidates;
  }

  if (window.__TAURI__ && typeof window.__TAURI__.convertFileSrc === "function") {
    append(window.__TAURI__.convertFileSrc(url));
  }
  if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.convertFileSrc === "function") {
    append(window.__TAURI_INTERNALS__.convertFileSrc(url, "asset"));
  }

  append(buildTauriFileUrl(url));
  append(url);
  return candidates;
}

function extractVideoFrame(videoUrl) {
  const cached = videoPreviewCache.get(videoUrl);
  if (cached) {
    return cached;
  }

  const task = new Promise((resolve, reject) => {
    const video = document.createElement("video");
    let settled = false;

    const finish = (handler, payload) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      handler(payload);
    };

    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    const captureFrame = () => {
      const canvas = document.createElement("canvas");
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("无法创建预览画布");
      }

      context.drawImage(video, 0, 0, width, height);
      return canvas.toDataURL("image/jpeg", 0.86);
    };

    const seekTargets = [0, 0.01, 0.03];
    let seekIndex = 0;
    const seekNext = () => {
      if (seekIndex >= seekTargets.length) {
        finish(reject, new Error("无法读取视频首帧"));
        return;
      }

      const target = seekTargets[seekIndex];
      seekIndex += 1;

      try {
        // Some engines won't trigger `seeked` when currentTime stays at 0.
        video.currentTime = target === 0 ? 0.000001 : target;
      } catch (error) {
        if (seekIndex >= seekTargets.length) {
          finish(reject, error instanceof Error ? error : new Error(String(error)));
        } else {
          seekNext();
        }
      }
    };

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;

    const onError = () => {
      finish(reject, new Error("无法读取视频首帧"));
    };

    video.addEventListener("error", onError, { once: true });

    video.addEventListener(
      "loadeddata",
      () => {
        try {
          const canvas = document.createElement("canvas");
          const width = video.videoWidth || 1280;
          const height = video.videoHeight || 720;
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("无法创建预览画布");
          }
          context.drawImage(video, 0, 0, width, height);
          const imageUrl = canvas.toDataURL("image/jpeg", 0.86);
          finish(resolve, imageUrl);
        } catch (_error) {
          seekNext();
        }
      },
      { once: true }
    );

    video.addEventListener(
      "loadedmetadata",
      () => {
        seekNext();
      },
      { once: true }
    );

    video.addEventListener(
      "seeked",
      () => {
        try {
          const imageUrl = captureFrame();
          finish(resolve, imageUrl);
        } catch (error) {
          if (seekIndex >= seekTargets.length) {
            finish(reject, error instanceof Error ? error : new Error(String(error)));
          } else {
            seekNext();
          }
        }
      }
    );
  });

  videoPreviewCache.set(videoUrl, task);
  return task;
}

function extractVideoFrameFromCandidates(candidates) {
  const key = `multi:${candidates.join("|")}`;
  const cached = videoPreviewCache.get(key);
  if (cached) {
    return cached;
  }

  const task = (async () => {
    for (const candidate of candidates) {
      try {
        return await extractVideoFrame(candidate);
      } catch (_error) {
        // Try next candidate url.
      }
    }
    throw new Error("无法读取视频首帧");
  })();

  videoPreviewCache.set(key, task);
  return task;
}

function attachInlineVideoPoster(videoUrls, wrapper, imageElement) {
  const candidates = Array.isArray(videoUrls) ? videoUrls : [videoUrls];
  wrapper.classList.remove("is-failed");

  const tryAttach = (index) => {
    if (index >= candidates.length) {
      wrapper.classList.add("is-ready", "is-failed");
      return;
    }

    const candidate = candidates[index];
    const inlineVideo = document.createElement("video");
    inlineVideo.className = "media-card__inline-video";
    inlineVideo.src = candidate;
    inlineVideo.muted = true;
    inlineVideo.playsInline = true;
    inlineVideo.preload = "auto";
    inlineVideo.autoplay = false;
    inlineVideo.controls = false;

    const cleanupCandidate = () => {
      inlineVideo.pause();
      inlineVideo.removeAttribute("src");
      inlineVideo.load();
      inlineVideo.remove();
    };

    inlineVideo.addEventListener(
      "loadeddata",
      () => {
        try {
          inlineVideo.currentTime = 0.001;
        } catch (_error) {
          // Ignore and keep first decoded frame.
        }
        wrapper.classList.add("is-ready", "is-inline-video");
        imageElement.removeAttribute("src");
      },
      { once: true }
    );

    inlineVideo.addEventListener(
      "seeked",
      () => {
        inlineVideo.pause();
        wrapper.classList.add("is-ready", "is-inline-video");
        imageElement.removeAttribute("src");
      },
      { once: true }
    );

    inlineVideo.addEventListener(
      "error",
      () => {
        cleanupCandidate();
        tryAttach(index + 1);
      },
      { once: true }
    );

    wrapper.prepend(inlineVideo);
  };

  tryAttach(0);
}

function attachVideoPreview(item, imageElement, wrapper) {
  const previewCandidates = buildMediaUrlCandidates(item.url);

  extractVideoFrameFromCandidates(previewCandidates)
    .then((frameUrl) => {
      imageElement.src = frameUrl;
      wrapper.classList.add("is-ready");
      wrapper.classList.remove("is-failed", "is-inline-video");
    })
    .catch(() => {
      if (item.posterUrl) {
        const posterSrc = buildVersionedUrl(item.posterUrl);
        imageElement.onerror = () => {
          imageElement.onerror = null;
          attachInlineVideoPoster(previewCandidates, wrapper, imageElement);
        };
        imageElement.src = posterSrc;
        wrapper.classList.add("is-ready");
        wrapper.classList.remove("is-failed", "is-inline-video");
        return;
      }

      attachInlineVideoPoster(previewCandidates, wrapper, imageElement);
    });
}

function attachVideoPosterFromCandidates(video, candidates, onFailure) {
  let index = 0;

  const setSource = () => {
    if (index >= candidates.length) {
      onFailure?.();
      return;
    }

    video.src = candidates[index];
    video.load();
  };

  video.addEventListener("error", () => {
    index += 1;
    setSource();
  });

  setSource();
}

function buildViewerVideo(item, viewerBody, infoCard) {
  const inlineVideo = document.createElement("video");
  inlineVideo.className = "viewer-overlay__video";
  inlineVideo.controls = true;
  inlineVideo.autoplay = false;
  inlineVideo.playsInline = true;
  inlineVideo.preload = "auto";

  const videoCandidates = buildMediaUrlCandidates(item.url);
  let failed = false;
  attachVideoPosterFromCandidates(inlineVideo, videoCandidates, () => {
    failed = true;
    const hint = document.createElement("div");
    hint.className = "viewer-overlay__video-hint";
    hint.textContent = "当前视频无法在容器中解码播放，请优先使用 H.264 编码的 MP4。";
    viewerBody.appendChild(hint);
  });

  if (item.posterUrl) {
    inlineVideo.poster = buildVersionedUrl(item.posterUrl);
  } else {
    extractVideoFrameFromCandidates(videoCandidates)
      .then((frameUrl) => {
        inlineVideo.poster = frameUrl;
      })
      .catch(() => {
        // Keep empty poster when frame extraction fails.
      });
  }

  inlineVideo.addEventListener(
    "loadeddata",
    () => {
      if (failed) {
        return;
      }
      try {
        inlineVideo.currentTime = 0.001;
      } catch (_error) {
        // Keep native first decoded frame.
      }
      inlineVideo.pause();
    },
    { once: true }
  );

  viewerBody.appendChild(inlineVideo);
  viewerBody.appendChild(infoCard);
}

function supportsInlinePpt(item) {
  return item.name.toLowerCase().endsWith(".pdf");
}

function buildPdfPreviewUrl(url) {
  return `${buildVersionedUrl(url)}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`;
}

function createPreview(item, autoplay = false) {
  if (item.type === "image") {
    const image = document.createElement("img");
    image.src = buildVersionedUrl(item.url);
    image.alt = item.name;
    image.loading = "lazy";
    return image;
  }

  if (item.type === "video") {
    const wrapper = document.createElement("div");
    wrapper.className = autoplay ? "standby-slide__poster" : "media-card__poster";

    const image = document.createElement("img");
    image.alt = `${item.name} 首帧预览`;
    image.loading = "lazy";
    wrapper.append(image);

    if (item.posterUrl) {
      image.onload = () => {
        wrapper.classList.add("is-ready");
      };
      image.onerror = () => {
        image.onerror = null;
        image.removeAttribute("src");
        attachVideoPreview(item, image, wrapper);
      };
      image.src = buildVersionedUrl(item.posterUrl);
      return wrapper;
    }
    attachVideoPreview(item, image, wrapper);
    return wrapper;
  }

  if (item.type === "ppt" && supportsInlinePpt(item)) {
    const frame = document.createElement("iframe");
    frame.className = "media-card__pdf-preview";
    frame.src = buildPdfPreviewUrl(item.url);
    frame.title = `${item.name} PDF 预览`;
    frame.loading = "lazy";
    return frame;
  }

  const placeholder = document.createElement("div");
  placeholder.className = autoplay ? "standby-slide__placeholder" : "media-card__placeholder";
  placeholder.innerHTML = "<strong>PPT</strong><span>点击打开演示文件</span>";
  return placeholder;
}

function openViewer(item) {
  if (!viewerOverlay || !viewerBody) {
    return;
  }

  viewerVisible = true;
  viewerOverlay.hidden = false;
  viewerBody.innerHTML = "";

  if (viewerTitle) {
    viewerTitle.textContent = item.displayName;
  }

  if (viewerMeta) {
    viewerMeta.textContent = `${item.folderLabel} | ${formatFileSize(item.size)}`;
  }

  if (viewerType) {
    viewerType.textContent = item.type === "ppt" ? "PPT 预览" : item.type === "video" ? "视频播放" : "图片预览";
  }

  if (viewerOpenLink) {
    viewerOpenLink.href = buildVersionedUrl(item.url);
    const isPdf = item.type === "ppt" && supportsInlinePpt(item);
    viewerOpenLink.hidden = isPdf;
  }

  const infoCard = document.createElement("aside");
  infoCard.className = "viewer-overlay__info-card";
  const info = item.achievement || {};
  infoCard.innerHTML = `
    <h4>${info.title || item.displayName}</h4>
    <ul class="viewer-overlay__info-list">
      <li><span>成果名称</span><strong>${info.title || item.displayName || "未填写"}</strong></li>
      <li><span>成果持有方</span><strong>${info.owner || "未填写"}</strong></li>
      <li><span>专利号</span><strong>${info.patentNo || "未填写"}</strong></li>
      <li><span>文件名</span><strong>${item.name || "未填写"}</strong></li>
    </ul>
    ${info.description ? `<p class="viewer-overlay__info-desc">${info.description}</p>` : ""}
  `;

  if (item.type === "video") {
    buildViewerVideo(item, viewerBody, infoCard);
    return;
  }

  if (item.type === "image") {
    const image = document.createElement("img");
    image.className = "viewer-overlay__image";
    image.src = buildVersionedUrl(item.url);
    image.alt = item.name;
    viewerBody.appendChild(image);
    viewerBody.appendChild(infoCard);
    return;
  }

  if (supportsInlinePpt(item)) {
    const iframe = document.createElement("iframe");
    iframe.className = "viewer-overlay__frame";
    iframe.src = buildPdfPreviewUrl(item.url);
    iframe.title = item.displayName;
    viewerBody.appendChild(iframe);
    viewerBody.appendChild(infoCard);
    return;
  }

  const fallback = document.createElement("div");
  fallback.className = "viewer-overlay__fallback";
  fallback.innerHTML = `
    <h4>当前浏览器无法直接预览该 PPT 文件</h4>
    <p>建议上传同名 PDF 文件以获得最佳预览效果。</p>
    <p>支持当前页稳定预览的格式：PDF</p>
  `;
  viewerBody.appendChild(fallback);
  viewerBody.appendChild(infoCard);
}

function closeViewer() {
  if (!viewerOverlay || !viewerBody) {
    return;
  }

  viewerVisible = false;
  viewerOverlay.hidden = true;
  viewerBody.innerHTML = "";
}

function refreshEmbeddedFrame(frame) {
  if (!frame) {
    return;
  }

  frame.src = frame.src;
}

function getPortalState(frame) {
  if (!frame) {
    return null;
  }

  if (!portalState.has(frame)) {
    const homeUrl = frame.dataset.homeUrl || frame.src || "";
    portalState.set(frame, {
      homeUrl,
      history: homeUrl ? [homeUrl] : [],
      index: homeUrl ? 0 : -1,
    });
  }

  return portalState.get(frame);
}

function navigateFrame(frame, url, push = true) {
  if (!frame || !url) {
    return;
  }

  const state = getPortalState(frame);
  if (state) {
    if (push) {
      state.history = state.history.slice(0, state.index + 1);
      state.history.push(url);
      state.index = state.history.length - 1;
    }
  }
  frame.src = url;
}

function goBackFrame(frame) {
  const state = getPortalState(frame);
  if (!state || state.index <= 0) {
    return;
  }

  state.index -= 1;
  frame.src = state.history[state.index];
}

function closeFrameToHome(frame) {
  const state = getPortalState(frame);
  if (!state || !state.homeUrl) {
    return;
  }

  state.history = [state.homeUrl];
  state.index = 0;
  frame.src = state.homeUrl;
}

function getActivePortalFrame() {
  const active = document.querySelector(".view.is-active");
  if (!active) {
    return scanFrame || tradingFrame || dataIpFrame || officialFrame || null;
  }

  const panel = active.dataset.viewPanel;
  if (panel === "scan") {
    return scanFrame;
  }
  if (panel === "trading") {
    return tradingFrame;
  }
  if (panel === "data-ip") {
    return dataIpFrame;
  }
  if (panel === "official") {
    return officialFrame;
  }
  return scanFrame || tradingFrame || dataIpFrame || officialFrame || null;
}

function openUrlInActivePortal(url) {
  if (!url) {
    return;
  }
  const frame = getActivePortalFrame();
  if (!frame) {
    return;
  }
  navigateFrame(frame, url, true);
}

function getFrameCurrentUrl(frame) {
  if (!frame) {
    return "";
  }
  try {
    return frame.contentWindow?.location?.href || frame.src || "";
  } catch (_error) {
    return frame.src || "";
  }
}

function getTotalPages() {
  if (mediaItems.length === 0) {
    return 0;
  }

  return Math.ceil(mediaItems.length / CARDS_PER_PAGE);
}

function getPromoTotalPages() {
  if (promotionItems.length === 0) {
    return 0;
  }

  return Math.ceil(promotionItems.length / CARDS_PER_PAGE);
}

function changePage(direction) {
  const totalPages = getTotalPages();
  if (totalPages <= 1) {
    return;
  }

  currentPage = (currentPage + direction + totalPages) % totalPages;
  renderMedia();
}

function changePromoPage(direction) {
  const totalPages = getPromoTotalPages();
  if (totalPages <= 1) {
    return;
  }

  currentPromoPage = (currentPromoPage + direction + totalPages) % totalPages;
  renderPromotionMedia();
}

function updateCarouselButtons() {
  const totalPages = getTotalPages();
  const disabled = totalPages <= 1;

  if (carouselPrevButton) {
    carouselPrevButton.disabled = disabled;
  }

  if (carouselNextButton) {
    carouselNextButton.disabled = disabled;
  }
}

function updatePromoCarouselButtons() {
  const totalPages = getPromoTotalPages();
  const disabled = totalPages <= 1;

  if (promoPrevButton) {
    promoPrevButton.disabled = disabled;
  }

  if (promoNextButton) {
    promoNextButton.disabled = disabled;
  }
}

function createPromoPlaybackMedia(item) {
  if (!item) {
    return null;
  }

  if (item.type === "image") {
    const image = document.createElement("img");
    image.className = "promo-play__media promo-play__media--image";
    image.src = buildVersionedUrl(item.url);
    image.alt = item.displayName || item.name || "宣传物料";
    image.loading = "eager";
    return image;
  }

  if (item.type === "video") {
    const video = document.createElement("video");
    video.className = "promo-play__media promo-play__media--video";
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    video.preload = "auto";

    const candidates = buildMediaUrlCandidates(item.url);
    attachVideoPosterFromCandidates(video, candidates, () => {
      const fallback = document.createElement("div");
      fallback.className = "promo-play__fallback";
      fallback.textContent = "当前视频暂无法在页面内播放";
      video.replaceWith(fallback);
    });

    if (item.posterUrl) {
      video.poster = buildVersionedUrl(item.posterUrl);
    }

    return video;
  }

  if (item.type === "ppt" && supportsInlinePpt(item)) {
    const frame = document.createElement("iframe");
    frame.className = "promo-play__media promo-play__media--pdf";
    frame.src = buildPdfPreviewUrl(item.url);
    frame.title = `${item.displayName || item.name || "宣传物料"} PDF 预览`;
    frame.loading = "eager";
    return frame;
  }

  const fallback = document.createElement("div");
  fallback.className = "promo-play__fallback";
  fallback.innerHTML = `<strong>${item.typeLabel || "宣传物料"}</strong><span>当前物料将在外部演示文件中查看</span>`;
  return fallback;
}

function stopPromoPlaybackRotation() {
  if (promoPlaybackTimerId) {
    window.clearInterval(promoPlaybackTimerId);
    promoPlaybackTimerId = null;
  }
}

function startPromoPlaybackRotation() {
  stopPromoPlaybackRotation();
  if (promotionItems.length <= 1) {
    return;
  }

  promoPlaybackTimerId = window.setInterval(() => {
    if (getCurrentView() !== "promo-play") {
      stopPromoPlaybackRotation();
      return;
    }
    currentPromoPage = (currentPromoPage + 1) % promotionItems.length;
    renderPromotionMedia();
  }, 8000);
}

function setupEmbeddedFrameNavigation(frame) {
  if (!frame) {
    return;
  }

  getPortalState(frame);

  const forceCurrentWindow = () => {
    try {
      const doc = frame.contentDocument;
      const win = frame.contentWindow;
      if (!doc || !win) {
        return;
      }

      const normalizeLinkTarget = (root = doc) => {
        root.querySelectorAll("a[target='_blank']").forEach((link) => {
          link.setAttribute("target", "_self");
          link.removeAttribute("rel");
        });
      };

      const navigateInFrame = (url) => {
        if (!url || url.startsWith("javascript:")) {
          return;
        }
        navigateFrame(frame, new URL(url, win.location.href).toString(), true);
      };

      normalizeLinkTarget();

      const base = doc.querySelector("base") || doc.createElement("base");
      base.setAttribute("target", "_self");
      if (!base.parentElement) {
        (doc.head || doc.documentElement).prepend(base);
      }

      doc.addEventListener(
        "click",
        (event) => {
          const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
          if (!link) {
            return;
          }

          const href = link.getAttribute("href");
          if (!href || href.startsWith("#")) {
            return;
          }

          const target = (link.getAttribute("target") || "").toLowerCase();
          if (target === "_blank") {
            event.preventDefault();
            navigateInFrame(href);
          }
        },
        true
      );

      win.open = (url) => {
        if (!url) {
          return null;
        }

        navigateInFrame(url);
        return null;
      };

      const observer = new MutationObserver(() => {
        normalizeLinkTarget(doc);
      });
      observer.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["target"] });
    } catch (error) {
      // Cross-origin frame cannot be scripted in browser mode.
    }
  };

  frame.addEventListener("load", forceCurrentWindow);
}

function startCardRotation() {
  clearInterval(cardRotateId);

  if (!mediaGrid || mediaItems.length <= CARDS_PER_PAGE) {
    return;
  }

  cardRotateId = window.setInterval(() => {
    if (viewerVisible) {
      return;
    }

    changePage(1);
  }, CARD_ROTATE_MS);
}

function renderMedia() {
  if (!mediaGrid || !mediaEmpty || !mediaCardTemplate) {
    return;
  }

  const totalPages = getTotalPages();
  if (totalPages === 0) {
    currentPage = 0;
  } else if (currentPage >= totalPages) {
    currentPage = 0;
  }

  const startIndex = currentPage * CARDS_PER_PAGE;
  const visibleItems = mediaItems.slice(startIndex, startIndex + CARDS_PER_PAGE);

  mediaGrid.innerHTML = "";
  mediaEmpty.hidden = mediaItems.length > 0;
  updateCarouselButtons();

  visibleItems.forEach((item) => {
    const fragment = mediaCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".media-card");
    const preview = fragment.querySelector(".media-card__preview");
    const title = fragment.querySelector(".media-card__title");
    const infoLines = fragment.querySelectorAll(".media-card__info");
    const achievement = item.achievement || {};

    preview.appendChild(createPreview(item));
    const playButton = document.createElement("span");
    playButton.className = "media-card__play";
    playButton.textContent = "查看成果";
    preview.appendChild(playButton);

    title.textContent = item.displayName;
    if (infoLines[0]) {
      infoLines[0].textContent = `持有方：${achievement.owner || "未填写"}`;
    }
    if (infoLines[1]) {
      infoLines[1].textContent = `专利号：${achievement.patentNo || "未填写"}`;
    }

    if (card) {
      card.addEventListener("click", () => openViewer(item));
    }

    if (item.type === "video") {
      const badge = document.createElement("span");
      badge.className = "media-card__preview-badge";
      badge.textContent = "视频预览";
      preview.appendChild(badge);
    }

    mediaGrid.appendChild(fragment);
  });
}

function renderPromotionMedia() {
  if (!promoGrid || !promoEmpty) {
    return;
  }

  if (promotionItems.length === 0) {
    currentPromoPage = 0;
  } else if (currentPromoPage >= promotionItems.length) {
    currentPromoPage = 0;
  }

  promoGrid.innerHTML = "";
  promoEmpty.hidden = promotionItems.length > 0;
  updatePromoCarouselButtons();

  if (promotionItems.length === 0) {
    stopPromoPlaybackRotation();
    return;
  }

  const item = promotionItems[currentPromoPage];
  const stage = document.createElement("article");
  stage.className = "promo-play__item";

  const media = createPromoPlaybackMedia(item);
  if (media) {
    stage.appendChild(media);
  }

  promoGrid.appendChild(stage);

  if (getCurrentView() === "promo-play") {
    startPromoPlaybackRotation();
  } else {
    stopPromoPlaybackRotation();
  }
}

function resetAchievementFormMode(clearStatus = false) {
  editingAchievementName = null;

  if (achievementSubmitButton) {
    achievementSubmitButton.textContent = "上传成果";
  }
  if (achievementCancelButton) {
    achievementCancelButton.hidden = true;
  }
  if (achievementFile) {
    achievementFile.disabled = false;
    achievementFile.value = "";
  }
  if (achievementPosterFile) {
    achievementPosterFile.disabled = false;
    achievementPosterFile.value = "";
  }

  if (clearStatus && achievementStatus) {
    achievementStatus.textContent = "";
  }
  clearUploadPreview();
}

function openUploadModal() {
  if (!achievementUploadModal) {
    return;
  }
  achievementUploadModal.hidden = false;
}

function closeUploadModal() {
  if (!achievementUploadModal) {
    return;
  }
  achievementUploadModal.hidden = true;
}

function startAchievementEdit(item) {
  openUploadModal();
  editingAchievementName = item.name;
  const info = item.achievement || {};

  if (achievementTitle) {
    achievementTitle.value = info.title || item.displayName || "";
  }
  if (achievementOwner) {
    achievementOwner.value = info.owner || "";
  }
  if (achievementPatentNo) {
    achievementPatentNo.value = info.patentNo || "";
  }
  if (achievementDescription) {
    achievementDescription.value = info.description || "";
  }
  if (achievementFile) {
    achievementFile.value = "";
    achievementFile.disabled = true;
  }
  if (achievementPosterFile) {
    achievementPosterFile.value = "";
    achievementPosterFile.disabled = true;
  }
  if (achievementSubmitButton) {
    achievementSubmitButton.textContent = "保存修改";
  }
  if (achievementCancelButton) {
    achievementCancelButton.hidden = false;
  }
  if (achievementStatus) {
    achievementStatus.textContent = `正在编辑：${item.displayName}`;
  }

  // Editing metadata does not recapture poster; display current preview source.
  if (item.type === "video" && item.posterUrl) {
    if (achievementUploadPreviewImage && achievementUploadPreviewEmpty) {
      achievementUploadPreviewImage.src = buildVersionedUrl(item.posterUrl);
      achievementUploadPreviewImage.hidden = false;
      achievementUploadPreviewEmpty.hidden = true;
    }
  } else if (item.type === "image") {
    if (achievementUploadPreviewImage && achievementUploadPreviewEmpty) {
      achievementUploadPreviewImage.src = buildVersionedUrl(item.url);
      achievementUploadPreviewImage.hidden = false;
      achievementUploadPreviewEmpty.hidden = true;
    }
  } else if (achievementUploadPreviewEmpty) {
    if (achievementUploadPreviewImage) {
      achievementUploadPreviewImage.hidden = true;
      achievementUploadPreviewImage.removeAttribute("src");
    }
    achievementUploadPreviewEmpty.hidden = false;
    achievementUploadPreviewEmpty.textContent = "当前文件无可视预览图";
  }
}

async function updateAchievementMeta(name, payload) {
  if (isTauriRuntime()) {
    const tauriInvoke = await waitForTauriInvoke(8000);
    if (!tauriInvoke) {
      throw new Error("桌面桥接尚未就绪，请稍后重试");
    }
    try {
      const result = await tauriInvoke("update_achievement_meta", {
        fileName: name,
        title: payload.title,
        owner: payload.owner,
        patentNo: payload.patentNo,
        description: payload.description,
      });
      if (!result || !result.ok) {
        throw new Error("更新失败");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("update_achievement_meta") && message.includes("not found")) {
        throw new Error("桌面端命令未加载，请重启应用后重试");
      }
      throw error;
    }
    return;
  }

  const response = await fetch("/api/achievements/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      title: payload.title,
      owner: payload.owner,
      patentNo: payload.patentNo,
      description: payload.description,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
}

async function deleteAchievement(name) {
  if (isTauriRuntime()) {
    const tauriInvoke = await waitForTauriInvoke(8000);
    if (!tauriInvoke) {
      throw new Error("桌面桥接尚未就绪，请稍后重试");
    }
    try {
      const result = await tauriInvoke("delete_achievement", { fileName: name });
      if (!result || !result.ok) {
        throw new Error("删除失败");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("delete_achievement") && message.includes("not found")) {
        throw new Error("桌面端命令未加载，请重启应用后重试");
      }
      throw error;
    }
    return;
  }

  const response = await fetch("/api/achievements/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
}

function syncSelectedAchievements() {
  const validNames = new Set(mediaItems.map((item) => item.name));
  Array.from(selectedAchievementNames).forEach((name) => {
    if (!validNames.has(name)) {
      selectedAchievementNames.delete(name);
    }
  });
}

function updateManageSelectionUi() {
  const total = mediaItems.length;
  const selected = selectedAchievementNames.size;

  if (achievementSelectedCount) {
    achievementSelectedCount.textContent = selected > 0 ? `已选 ${selected} 项` : "未选择";
  }

  if (achievementBatchDeleteButton) {
    achievementBatchDeleteButton.disabled = selected === 0;
  }

  if (achievementSelectAll) {
    achievementSelectAll.disabled = total === 0;
    achievementSelectAll.checked = total > 0 && selected === total;
    achievementSelectAll.indeterminate = selected > 0 && selected < total;
  }
}

async function deleteAchievementsByNames(names) {
  if (!achievementStatus || !Array.isArray(names) || names.length === 0) {
    return;
  }

  storeView("manage");
  const uniqueNames = Array.from(new Set(names));
  achievementStatus.textContent = uniqueNames.length > 1 ? `正在删除 ${uniqueNames.length} 项成果...` : "删除中，请稍候...";
  if (achievementBatchDeleteButton) {
    achievementBatchDeleteButton.disabled = true;
  }

  const deleted = [];
  const failed = [];

  for (const name of uniqueNames) {
    try {
      await deleteAchievement(name);
      deleted.push(name);
    } catch (error) {
      failed.push(`${name}(${error instanceof Error ? error.message : String(error)})`);
    }
  }

  deleted.forEach((name) => {
    selectedAchievementNames.delete(name);
  });

  if (deleted.includes(editingAchievementName)) {
    achievementForm?.reset();
    resetAchievementFormMode(false);
  }

  if (deleted.length > 0) {
    await loadMedia();
  } else {
    updateManageSelectionUi();
  }

  if (failed.length === 0) {
    achievementStatus.textContent = `删除完成，共删除 ${deleted.length} 项。`;
    return;
  }

  achievementStatus.textContent = `已删除 ${deleted.length} 项，失败 ${failed.length} 项：${failed.slice(0, 2).join("；")}`;
}

async function handleDeleteAchievement(item) {
  await deleteAchievementsByNames([item.name]);
}

function renderAchievementList() {
  if (!achievementList) {
    return;
  }

  syncSelectedAchievements();
  achievementList.innerHTML = "";
  if (mediaItems.length === 0) {
    achievementList.innerHTML = `<p class="manage-list-empty">暂无成果记录，上传后会自动显示。</p>`;
    updateManageSelectionUi();
    return;
  }

  const table = document.createElement("table");
  table.className = "manage-table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th style="width: 56px;">选择</th>
      <th style="width: 96px;">预览图</th>
      <th style="min-width: 180px;">成果名称</th>
      <th style="min-width: 130px;">持有方</th>
      <th style="min-width: 140px;">专利号</th>
      <th style="min-width: 190px;">文件名</th>
      <th style="width: 90px;">类型</th>
      <th style="width: 110px;">大小</th>
      <th style="width: 176px;">操作</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  mediaItems.forEach((item) => {
    const info = item.achievement || {};
    const row = document.createElement("tr");

    const checkCell = document.createElement("td");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = selectedAchievementNames.has(item.name);
    check.addEventListener("change", () => {
      if (check.checked) {
        selectedAchievementNames.add(item.name);
      } else {
        selectedAchievementNames.delete(item.name);
      }
      updateManageSelectionUi();
    });
    checkCell.appendChild(check);
    row.appendChild(checkCell);

    const previewCell = document.createElement("td");
    previewCell.className = "manage-table__preview-cell";
    const previewBox = document.createElement("div");
    previewBox.className = "manage-table__preview";
    const previewImg = document.createElement("img");
    let previewSrc = "";
    if (item.type === "video" && item.posterUrl) {
      previewSrc = buildVersionedUrl(item.posterUrl);
    } else if (item.type === "image") {
      previewSrc = buildVersionedUrl(item.url);
    }

    if (previewSrc) {
      previewImg.src = previewSrc;
      previewImg.alt = `${item.displayName} 预览`;
      previewBox.appendChild(previewImg);
    } else {
      const text = document.createElement("span");
      text.className = "manage-table__preview-text";
      text.textContent = item.type === "ppt" ? "PDF/PPT" : item.typeLabel;
      previewBox.appendChild(text);
    }
    previewCell.appendChild(previewBox);
    row.appendChild(previewCell);

    const titleCell = document.createElement("td");
    titleCell.className = "manage-table__title";
    titleCell.textContent = info.title || item.displayName;
    row.appendChild(titleCell);

    const ownerCell = document.createElement("td");
    ownerCell.textContent = info.owner || "未填写";
    row.appendChild(ownerCell);

    const patentCell = document.createElement("td");
    patentCell.textContent = info.patentNo || "未填写";
    row.appendChild(patentCell);

    const fileCell = document.createElement("td");
    fileCell.textContent = item.name;
    row.appendChild(fileCell);

    const typeCell = document.createElement("td");
    const typeTag = document.createElement("span");
    typeTag.className = "manage-table__type";
    typeTag.textContent = item.typeLabel;
    typeCell.appendChild(typeTag);
    row.appendChild(typeCell);

    const sizeCell = document.createElement("td");
    sizeCell.textContent = formatFileSize(item.size);
    row.appendChild(sizeCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "manage-table__actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-link action-link--ghost manage-list-item__button";
    editButton.textContent = "编辑";
    editButton.addEventListener("click", () => {
      startAchievementEdit(item);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-link action-link--ghost manage-list-item__button";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => {
      handleDeleteAchievement(item);
    });

    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  achievementList.appendChild(table);
  updateManageSelectionUi();
}

function renderPromoHub() {
  if (promoUploadUrl) {
    promoUploadUrl.value = mobileUploadConfig?.uploadPageUrl || "";
  }

  if (promoQrImage && promoQrPlaceholder) {
    const qrCandidates = buildPromoQrCandidates();
    if (qrCandidates.length > 0) {
      promoQrCandidateUrls = qrCandidates;
      promoQrCandidateIndex = 0;
      promoQrPlaceholder.hidden = false;
      promoQrPlaceholder.textContent = "二维码加载中";
      promoQrImage.hidden = true;
      promoQrImage.src = promoQrCandidateUrls[promoQrCandidateIndex];
    } else {
      promoQrCandidateUrls = [];
      promoQrCandidateIndex = 0;
      promoQrImage.hidden = true;
      promoQrImage.removeAttribute("src");
      promoQrPlaceholder.hidden = false;
      promoQrPlaceholder.textContent = "二维码暂不可用";
    }
  }

  if (promoQrStatus) {
    promoQrStatus.textContent = mobileUploadConfig?.available
      ? `请使用与大屏同一网络下的手机扫描二维码。`
      : mobileUploadConfig?.reason || "当前环境暂不可生成手机投送地址。";
  }

  if (!promoList) {
    return;
  }

  promoList.innerHTML = "";
  if (promotionItems.length === 0) {
    promoList.innerHTML = `<p class="push-feed-empty">暂无宣传物料，手机上传后将在此处显示。</p>`;
    return;
  }

  promotionItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "push-feed-item";

    const preview = document.createElement("div");
    preview.className = "push-feed-item__preview";
    if (item.type === "image" || (item.type === "video" && item.posterUrl)) {
      const img = document.createElement("img");
      img.src = buildVersionedUrl(item.type === "video" ? item.posterUrl : item.url);
      img.alt = item.displayName;
      preview.appendChild(img);
    } else {
      preview.textContent = item.typeLabel || "物料";
    }

    const body = document.createElement("div");
    body.className = "push-feed-item__body";
    const title = document.createElement("h5");
    title.textContent = item.displayName || "未命名物料";
    const desc = document.createElement("p");
    desc.textContent = item.achievement?.description || "该宣传物料可直接进入宣传播放页面进行全屏展示。";
    body.append(title, desc);

    card.append(preview, body);
    promoList.appendChild(card);
  });
}

function switchView(view, options = {}) {
  const { persist = true } = options;
  if (!view || !AVAILABLE_VIEWS.has(view)) {
    return;
  }

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });

  viewPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.viewPanel === view);
  });
  if (screenApp) {
    const isFeatureView = view !== "home";
    const isPortalView = view === "trading" || view === "data-ip" || view === "official" || view === "innovation";
    screenApp.classList.toggle("is-feature-view", isFeatureView);
    screenApp.classList.toggle("is-portal-expanded", isPortalView);
  }

  if (view === "promo-play") {
    renderPromotionMedia();
  } else {
    stopPromoPlaybackRotation();
  }

  if (persist) {
    storeView(view);
  }
}

function resetStandbyTimer() {
  return;
}

function isVideoUploadFile(file) {
  if (!file || !file.name) {
    return false;
  }

  const name = file.name.toLowerCase();
  return [".mp4", ".webm", ".mov", ".m4v"].some((ext) => name.endsWith(ext));
}

async function captureVideoPosterBlob(file, timeoutMs = 12000) {
  if (!isVideoUploadFile(file)) {
    return null;
  }

  const sourceUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;

  return await new Promise((resolve) => {
    let settled = false;

    const finish = (value) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timeoutId);
      video.pause();
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(sourceUrl);
      resolve(value);
    };

    const capture = () => {
      try {
        const width = video.videoWidth || 0;
        const height = video.videoHeight || 0;
        if (!width || !height) {
          return false;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          return false;
        }

        context.drawImage(video, 0, 0, width, height);
        canvas.toBlob((blob) => finish(blob || null), "image/jpeg", 0.86);
        return true;
      } catch (_error) {
        return false;
      }
    };

    const timeoutId = window.setTimeout(() => {
      if (!settled) {
        finish(null);
      }
    }, timeoutMs);

    video.addEventListener("loadedmetadata", () => {
      try {
        video.currentTime = 0.001;
      } catch (_error) {
        // Keep the decoded first frame at current position.
      }
    });
    video.addEventListener("seeked", () => {
      if (!capture()) {
        finish(null);
      }
    }, { once: true });
    video.addEventListener(
      "loadeddata",
      () => {
        window.setTimeout(() => {
          if (!settled && !capture()) {
            finish(null);
          }
        }, 80);
      },
      { once: true }
    );
    video.addEventListener("error", () => finish(null), { once: true });

    video.src = sourceUrl;
    video.load();
  });
}

async function prepareUploadPreviewForFile(file) {
  clearUploadPreview();
  if (!file) {
    return null;
  }

  const token = fileToken(file);
  pendingPosterToken = token;

  if (isVideoUploadFile(file)) {
    setUploadProgress(8, "正在截取首帧");
    const posterBlob = await captureVideoPosterBlob(file);
    if (pendingPosterToken !== token) {
      return null;
    }
    pendingPosterBlob = posterBlob;
    if (posterBlob) {
      showUploadPreviewFromBlob(posterBlob, "视频首帧预览");
      setUploadProgress(12, "首帧已生成");
    } else if (achievementUploadPreviewEmpty) {
      achievementUploadPreviewEmpty.hidden = false;
      achievementUploadPreviewEmpty.textContent = "未能截取首帧，将在上传时继续尝试";
    }
    return posterBlob;
  }

  pendingPosterBlob = null;
  if (file.type.startsWith("image/")) {
    showUploadPreviewFromBlob(file, "图片预览");
    setUploadProgress(5, "已加载预览");
    return null;
  }

  if (achievementUploadPreviewEmpty) {
    achievementUploadPreviewEmpty.hidden = false;
    achievementUploadPreviewEmpty.textContent = "当前文件类型不支持预览图显示";
  }
  return null;
}

async function uploadByXhrWithProgress(url, formData, onProgress) {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress?.(percent);
    };

    xhr.onload = () => {
      let payload = null;
      try {
        payload = JSON.parse(xhr.responseText || "{}");
      } catch (_error) {
        // Keep payload null.
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload || { ok: true });
      } else {
        reject(new Error((payload && payload.error) || `HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("网络异常，上传失败"));
    xhr.onabort = () => reject(new Error("上传已取消"));
    xhr.send(formData);
  });
}

async function loadMedia() {
  try {
    let payload;

    const tauriInvoke = getTauriInvoke();
    if (tauriInvoke) {
      payload = await tauriInvoke("list_media");
    } else {
      const response = await fetch(`/api/media?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      payload = await response.json();
    }

    const items = Array.isArray(payload.items) ? payload.items : [];
    const promotions = Array.isArray(payload.promotions) ? payload.promotions : [];
    const changed =
      JSON.stringify(items) !== JSON.stringify(mediaItems) || JSON.stringify(promotions) !== JSON.stringify(promotionItems);

    mediaItems = items;
    promotionItems = promotions;
    mobileUploadConfig = payload.mobileUpload && typeof payload.mobileUpload === "object" ? payload.mobileUpload : mobileUploadConfig;
    if (editingAchievementName && !mediaItems.some((item) => item.name === editingAchievementName)) {
      achievementForm?.reset();
      resetAchievementFormMode(false);
    }
    resourceVersion += 1;
    renderMedia();
    renderPromotionMedia();
    renderPromoHub();
    renderAchievementList();
    startCardRotation();
    ensureActiveView();
  } catch (error) {
    mediaItems = [];
    promotionItems = [];
    renderMedia();
    renderPromotionMedia();
    renderPromoHub();
    renderAchievementList();
    startCardRotation();
    ensureActiveView();

    console.error("加载资源失败", error);
  }
}

async function uploadAchievement(event) {
  event.preventDefault();

  if (!achievementForm || !achievementStatus || !achievementSubmitButton) {
    return;
  }

  if (achievementTitle && !achievementTitle.value.trim()) {
    achievementStatus.textContent = "请填写成果名称。";
    return;
  }

  const isEditing = Boolean(editingAchievementName);
  const uploadFile = achievementFile?.files?.[0] || null;
  storeView("manage");

  if (isEditing && uploadFile) {
    achievementStatus.textContent = "编辑模式仅修改成果信息，不支持更换文件。请先取消编辑再上传新文件。";
    return;
  }

  if (!isEditing && !uploadFile) {
    achievementStatus.textContent = "请选择要上传的成果文件。";
    return;
  }

  achievementSubmitButton.disabled = true;
  achievementStatus.textContent = isEditing ? "保存中，请稍候..." : "上传中，请稍候...";
  setUploadProgress(isEditing ? 20 : 10, isEditing ? "保存信息" : "准备上传");

  if (isEditing) {
    try {
      await updateAchievementMeta(editingAchievementName, {
        title: achievementTitle ? achievementTitle.value.trim() : "",
        owner: achievementOwner ? achievementOwner.value.trim() : "",
        patentNo: achievementPatentNo ? achievementPatentNo.value.trim() : "",
        description: achievementDescription ? achievementDescription.value.trim() : "",
      });
      achievementStatus.textContent = "修改成功。";
      achievementForm.reset();
      resetAchievementFormMode(false);
      setUploadProgress(100, "完成");
      await loadMedia();
      closeUploadModal();
    } catch (error) {
      achievementStatus.textContent = `修改失败：${error instanceof Error ? error.message : String(error)}`;
    } finally {
      achievementSubmitButton.disabled = false;
    }
    return;
  }

  const currentToken = fileToken(uploadFile);
  let posterBlob = pendingPosterToken === currentToken ? pendingPosterBlob : null;
  if (!posterBlob && isVideoUploadFile(uploadFile)) {
    setUploadProgress(15, "生成预览图");
    posterBlob = await captureVideoPosterBlob(uploadFile);
    if (posterBlob && pendingPosterToken === currentToken) {
      pendingPosterBlob = posterBlob;
      showUploadPreviewFromBlob(posterBlob, "视频首帧预览");
    }
  }

  if (isTauriRuntime()) {
    try {
      setUploadProgress(35, "读取文件");
      const bytes = Array.from(new Uint8Array(await uploadFile.arrayBuffer()));
      const posterData = posterBlob ? Array.from(new Uint8Array(await posterBlob.arrayBuffer())) : null;
      const tauriInvoke = await waitForTauriInvoke(8000);
      if (!tauriInvoke) {
        throw new Error("桌面桥接尚未就绪，请稍后重试");
      }

      setUploadProgress(70, "上传中");
      const result = await tauriInvoke("upload_achievement", {
        fileName: uploadFile.name,
        data: bytes,
        posterData,
        title: achievementTitle ? achievementTitle.value.trim() : "",
        owner: achievementOwner ? achievementOwner.value.trim() : "",
        patentNo: achievementPatentNo ? achievementPatentNo.value.trim() : "",
        description: achievementDescription ? achievementDescription.value.trim() : "",
      });

      if (!result || !result.ok) {
        throw new Error("上传失败");
      }

      achievementStatus.textContent = "上传成功，成果展示区已更新。";
      achievementForm.reset();
      clearUploadPreview();
      setUploadProgress(100, "完成");
      await loadMedia();
      closeUploadModal();
      return;
    } catch (error) {
      achievementStatus.textContent = `上传失败：${error instanceof Error ? error.message : String(error)}`;
      setUploadProgress(0, "失败");
      return;
    } finally {
      achievementSubmitButton.disabled = false;
    }
  }

  const formData = new FormData(achievementForm);
  if (posterBlob) {
    const fileStem = uploadFile.name.replace(/\.[^.]+$/, "") || "video_preview";
    formData.append("posterFrame", posterBlob, `${fileStem}.jpg`);
  }

  try {
    const payload = await uploadByXhrWithProgress("/api/achievements/upload", formData, (percent) => {
      setUploadProgress(percent, "上传中");
    });
    if (!payload || !payload.ok) {
      throw new Error(payload?.error || "上传失败");
    }

    achievementStatus.textContent = "上传成功，成果展示区已更新。";
    achievementForm.reset();
    clearUploadPreview();
    setUploadProgress(100, "完成");
    await loadMedia();
    closeUploadModal();
  } catch (error) {
    achievementStatus.textContent = `上传失败：${error instanceof Error ? error.message : String(error)}`;
    setUploadProgress(0, "失败");
  } finally {
    achievementSubmitButton.disabled = false;
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetStandbyTimer();
    switchView(button.dataset.view, { persist: true });
    if (button.dataset.view !== "manage") {
      closeUploadModal();
    }
  });
});

if (refreshMediaButton) {
  refreshMediaButton.addEventListener("click", async () => {
    resetStandbyTimer();
    await loadMedia();
  });
}

if (promoRefreshButton) {
  promoRefreshButton.addEventListener("click", async () => {
    resetStandbyTimer();
    await loadMedia();
  });
}

if (refreshPromoButton) {
  refreshPromoButton.addEventListener("click", async () => {
    resetStandbyTimer();
    await loadMedia();
  });
}

if (promoPlayCloseButton) {
  promoPlayCloseButton.addEventListener("click", () => {
    resetStandbyTimer();
    switchView("home", { persist: true });
  });
}

if (promoCopyButton) {
  promoCopyButton.addEventListener("click", async () => {
    const value = promoUploadUrl?.value?.trim() || "";
    if (!value) {
      if (promoQrStatus) {
        promoQrStatus.textContent = "当前没有可复制的上传地址。";
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      if (promoQrStatus) {
        promoQrStatus.textContent = "上传地址已复制，可发送到手机打开。";
      }
    } catch (_error) {
      if (promoQrStatus) {
        promoQrStatus.textContent = "复制失败，请手动记录上传地址。";
      }
    }
  });
}

if (promoQrImage) {
  promoQrImage.addEventListener("error", handlePromoQrFailure);
  promoQrImage.addEventListener("load", handlePromoQrSuccess);
}

if (carouselPrevButton) {
  carouselPrevButton.addEventListener("click", () => {
    resetStandbyTimer();
    changePage(-1);
  });
}

if (carouselNextButton) {
  carouselNextButton.addEventListener("click", () => {
    resetStandbyTimer();
    changePage(1);
  });
}

window.addEventListener("message", (event) => {
  const payload = event?.data;
  if (!payload || typeof payload !== "object") {
    return;
  }
  if (payload.type === "tjipe-open-url") {
    if (typeof payload.url !== "string" || !payload.url) {
      return;
    }
    openUrlInActivePortal(payload.url);
    return;
  }
  if (payload.type === "tjipe-scan-key") {
    if (!scanConnected || scanConfig.mode !== "keyboard") {
      return;
    }
    const key = typeof payload.key === "string" ? payload.key : "";
    if (!key) {
      return;
    }
    consumeScannerKey(key);
  }
});

if (viewerCloseButton) {
  viewerCloseButton.addEventListener("click", () => {
    closeViewer();
    resetStandbyTimer();
  });
}

if (viewerCloseFloatingButton) {
  viewerCloseFloatingButton.addEventListener("click", () => {
    closeViewer();
    resetStandbyTimer();
  });
}

if (viewerOverlay) {
  viewerOverlay.addEventListener("click", (event) => {
    if (event.target === viewerOverlay || event.target.classList.contains("viewer-overlay__backdrop")) {
      closeViewer();
      resetStandbyTimer();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && viewerVisible) {
    closeViewer();
    resetStandbyTimer();
  }
  handleKeyboardScannerInput(event);
});

if (tradingRefreshButton) {
  tradingRefreshButton.addEventListener("click", () => {
    resetStandbyTimer();
    refreshEmbeddedFrame(tradingFrame);
  });
}

if (dataIpRefreshButton) {
  dataIpRefreshButton.addEventListener("click", () => {
    resetStandbyTimer();
    refreshEmbeddedFrame(dataIpFrame);
  });
}

if (officialRefreshButton) {
  officialRefreshButton.addEventListener("click", () => {
    resetStandbyTimer();
    refreshEmbeddedFrame(officialFrame);
  });
}

if (innovationRefreshButton) {
  innovationRefreshButton.addEventListener("click", () => {
    resetStandbyTimer();
    refreshEmbeddedFrame(innovationFrame);
  });
}

if (scanRefreshButton) {
  scanRefreshButton.addEventListener("click", () => {
    resetStandbyTimer();
    refreshEmbeddedFrame(scanFrame);
  });
}

if (tradingBackButton) {
  tradingBackButton.addEventListener("click", () => {
    resetStandbyTimer();
    goBackFrame(tradingFrame);
  });
}

if (dataIpBackButton) {
  dataIpBackButton.addEventListener("click", () => {
    resetStandbyTimer();
    goBackFrame(dataIpFrame);
  });
}

if (officialBackButton) {
  officialBackButton.addEventListener("click", () => {
    resetStandbyTimer();
    goBackFrame(officialFrame);
  });
}

if (innovationBackButton) {
  innovationBackButton.addEventListener("click", () => {
    resetStandbyTimer();
    goBackFrame(innovationFrame);
  });
}

if (scanBackButton) {
  scanBackButton.addEventListener("click", () => {
    resetStandbyTimer();
    goBackFrame(scanFrame);
  });
}

if (tradingCloseButton) {
  tradingCloseButton.addEventListener("click", () => {
    resetStandbyTimer();
    closeFrameToHome(tradingFrame);
    switchView("home", { persist: true });
  });
}

if (dataIpCloseButton) {
  dataIpCloseButton.addEventListener("click", () => {
    resetStandbyTimer();
    closeFrameToHome(dataIpFrame);
    switchView("home", { persist: true });
  });
}

if (officialCloseButton) {
  officialCloseButton.addEventListener("click", () => {
    resetStandbyTimer();
    closeFrameToHome(officialFrame);
    switchView("home", { persist: true });
  });
}

if (innovationCloseButton) {
  innovationCloseButton.addEventListener("click", () => {
    resetStandbyTimer();
    closeFrameToHome(innovationFrame);
    switchView("home", { persist: true });
  });
}

if (scanCloseButton) {
  scanCloseButton.addEventListener("click", () => {
    resetStandbyTimer();
    closeFrameToHome(scanFrame);
    switchView("home", { persist: true });
  });
}

homeTriggerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetStandbyTimer();
    switchView("home", { persist: true });
    closeUploadModal();
  });
});

if (scanConnectButton) {
  scanConnectButton.addEventListener("click", () => {
    scanConnected = !scanConnected;
    scanBuffer = "";
    scanLastTs = 0;
    scanConnectButton.textContent = scanConnected ? "断开扫码器" : "连接扫码器";
    setScanStatus(scanConnected ? "已连接（键盘扫码枪）" : "未连接");
  });
}

if (tradingCompatButton) {
  tradingCompatButton.addEventListener("click", async () => {
    resetStandbyTimer();
    if (!isTauriRuntime()) {
      return;
    }
    const url = getFrameCurrentUrl(tradingFrame) || (getPortalConfig("trading")?.url ?? "");
    await invokePortalCommand("open_portal", { url, title: "交易项目查询（兼容模式）" });
  });
}

if (dataIpCompatButton) {
  dataIpCompatButton.addEventListener("click", async () => {
    resetStandbyTimer();
    if (!isTauriRuntime()) {
      return;
    }
    const url = getFrameCurrentUrl(dataIpFrame) || (getPortalConfig("data-ip")?.url ?? "");
    await invokePortalCommand("open_portal", { url, title: "数据知识产权登记（兼容模式）" });
  });
}

if (officialCompatButton) {
  officialCompatButton.addEventListener("click", async () => {
    resetStandbyTimer();
    if (!isTauriRuntime()) {
      return;
    }
    const url = getFrameCurrentUrl(officialFrame) || (getPortalConfig("official")?.url ?? "");
    await invokePortalCommand("open_portal", { url, title: "中心官网（兼容模式）" });
  });
}

if (innovationCompatButton) {
  innovationCompatButton.addEventListener("click", async () => {
    resetStandbyTimer();
    if (!isTauriRuntime()) {
      return;
    }
    const url = getFrameCurrentUrl(innovationFrame) || (getPortalConfig("innovation")?.url ?? "");
    await invokePortalCommand("open_portal", { url, title: "创新专区（兼容模式）" });
  });
}

if (achievementForm) {
  achievementForm.addEventListener("submit", uploadAchievement);
}

if (achievementFile) {
  achievementFile.addEventListener("change", async () => {
    const file = achievementFile.files?.[0] || null;
    if (achievementPosterFile) {
      achievementPosterFile.value = "";
    }
    await prepareUploadPreviewForFile(file);
  });
}

if (achievementPosterFile) {
  achievementPosterFile.addEventListener("change", async () => {
    const poster = achievementPosterFile.files?.[0] || null;
    if (!poster) {
      return;
    }
    const uploadFile = achievementFile?.files?.[0] || null;
    if (!uploadFile) {
      if (achievementStatus) {
        achievementStatus.textContent = "请先选择成果文件，再设置预览图。";
      }
      achievementPosterFile.value = "";
      return;
    }
    pendingPosterBlob = poster;
    pendingPosterToken = fileToken(uploadFile);
    showUploadPreviewFromBlob(poster, "已使用手动预览图");
    setUploadProgress(12, "预览图已就绪");
  });
}

if (achievementCancelButton) {
  achievementCancelButton.addEventListener("click", () => {
    achievementForm?.reset();
    resetAchievementFormMode(true);
    closeUploadModal();
  });
}

if (achievementSelectAll) {
  achievementSelectAll.addEventListener("change", () => {
    if (achievementSelectAll.checked) {
      mediaItems.forEach((item) => selectedAchievementNames.add(item.name));
    } else {
      selectedAchievementNames.clear();
    }
    renderAchievementList();
  });
}

if (achievementBatchDeleteButton) {
  achievementBatchDeleteButton.addEventListener("click", async () => {
    const names = Array.from(selectedAchievementNames);
    if (names.length === 0) {
      return;
    }

    await deleteAchievementsByNames(names);
  });
}

if (achievementOpenUploadButton) {
  achievementOpenUploadButton.addEventListener("click", () => {
    achievementForm?.reset();
    resetAchievementFormMode(true);
    if (achievementStatus) {
      achievementStatus.textContent = "请选择成果文件并填写成果信息。";
    }
    openUploadModal();
  });
}

if (achievementModalCloseButton) {
  achievementModalCloseButton.addEventListener("click", () => {
    closeUploadModal();
  });
}

if (achievementUploadModal) {
  achievementUploadModal.addEventListener("click", (event) => {
    if (event.target === achievementUploadModal || event.target.classList.contains("manage-modal__backdrop")) {
      closeUploadModal();
    }
  });
}

setupEmbeddedFrameNavigation(tradingFrame);
setupEmbeddedFrameNavigation(dataIpFrame);
setupEmbeddedFrameNavigation(officialFrame);
setupEmbeddedFrameNavigation(innovationFrame);
setupEmbeddedFrameNavigation(scanFrame);

async function initializeApp() {
  startHomeClock();
  clearUploadPreview();
  closeUploadModal();
  loadScanConfig();
  renderScanConfig();
  renderScanLog();
  setScanStatus("已连接（键盘扫码枪）");
  scanConnected = true;
  ensureActiveView();

  if (isTauriRuntime()) {
    await waitForTauriInvoke(10000);
    const tauriListen = getTauriListen();
    if (tauriListen) {
      await tauriListen("portal-open-url", (event) => {
        openUrlInActivePortal(event.payload);
      });
    }
  }

  await loadMedia();
  ensureActiveView();
  if (mediaItems.length === 0) {
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    await loadMedia();
    ensureActiveView();
  }
  applyPreviewRequest();
  resetStandbyTimer();
}

window.addEventListener("keydown", handlePreviewShortcut);
initializeApp();
