/* =====================================================================
   THIỆP MỜI LỄ TỐT NGHIỆP – NGUYỄN THANH HƯNG
   Chỉ cần sửa object CONFIG bên dưới.
   ===================================================================== */
const CONFIG = {
  name: "Nguyễn Thanh Hưng",
  shortName: "Hưng",
  major: "Trường Công nghệ Thông tin và Truyền thông",   // SOICT
  school: "Đại học Bách khoa Hà Nội",

  // Ngày giờ lễ (giờ Việt Nam, +07:00).
  // ⚠ Ngày 27/09/2026 lấy theo thiệp của các bạn cùng trường – hãy kiểm tra lại.
  eventStart: "2026-09-27T09:00:00+07:00",
  // Chưa biết giờ kết thúc: để null. Lịch (Google Calendar/.ics) sẽ dùng thời lượng mặc định bên dưới.
  eventEnd: null,                 // ví dụ: "2026-09-27T11:30:00+07:00"
  defaultDurationHours: 2,        // có thể chỉnh

  venueName: "Tòa C2, Đại học Bách khoa Hà Nội",
  venueAddress: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Tòa C2 Đại học Bách khoa Hà Nội"),

  phone: "",                      // ví dụ "0912 345 678" – để trống thì nút Gọi tự ẩn
  music: "music.mp3",             // đặt file cạnh index.html; không có file thì nút nhạc tự ẩn

  defaultGuest: "Bạn",            // khi link không có ?name=
  defaultSelf: "mình"             // cách xưng mặc định; link có thể đổi bằng &xung=em
};

(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const reduce = document.documentElement.classList.contains("reduce");

  /* ---------- 1. Tên khách & cách xưng từ URL ---------- */
  function clean(raw, max) {
    if (!raw) return "";
    return String(raw).replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  }
  const params = new URLSearchParams(location.search);
  const guest = clean(params.get("name") || params.get("to"), 60) || CONFIG.defaultGuest;
  const self = clean(params.get("xung"), 12) || CONFIG.defaultSelf;
  const hasGuest = guest !== CONFIG.defaultGuest;

  $("guestName").textContent = guest;
  $("celebrant").textContent = CONFIG.name;
  $("majorText").textContent = CONFIG.major;
  $("schoolText").textContent = CONFIG.school;
  $("message").textContent =
    `Sau những năm tháng miệt mài bên giảng đường Bách Khoa, ${self} rất vui được chia sẻ khoảnh khắc đặc biệt này. ` +
    `Sự hiện diện của ${guest} sẽ là niềm vinh hạnh và niềm vui lớn đối với ${self}.`;
  $("closingLine").textContent = `Rất mong được gặp ${guest}!`;
  if (hasGuest) document.title = `Thiệp mời tốt nghiệp – gửi ${guest}`;

  /* ---------- 2. Ngày giờ ---------- */
  const start = new Date(CONFIG.eventStart);
  const end = CONFIG.eventEnd ? new Date(CONFIG.eventEnd) : new Date(start.getTime() + CONFIG.defaultDurationHours * 3600e3);
  const vn = (opts) => new Intl.DateTimeFormat("vi-VN", Object.assign({ timeZone: "Asia/Ho_Chi_Minh" }, opts)).formatToParts(start);
  const part = (parts, t) => (parts.find((p) => p.type === t) || {}).value || "";
  const p = vn({ weekday: "long", day: "numeric", month: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: false });
  const hh = parseInt(part(p, "hour"), 10), mm = part(p, "minute");
  const weekday = part(p, "weekday");
  $("whenMonth").textContent = "Tháng " + part(p, "month");
  $("whenWeekday").textContent = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  $("whenDay").textContent = part(p, "day");
  $("whenYear").textContent = part(p, "year");
  $("whenTime").textContent = `${hh}:${mm} ${hh < 11 ? "sáng" : hh < 13 ? "trưa" : hh < 18 ? "chiều" : "tối"}`;
  $("venueName").textContent = CONFIG.venueName;
  $("venueAddr").textContent = CONFIG.venueAddress;

  /* ---------- 3. Bản đồ, gọi ---------- */
  $("mapLink").href = CONFIG.mapUrl;
  if (CONFIG.phone && CONFIG.phone.trim()) {
    $("callLink").href = "tel:" + CONFIG.phone.replace(/[^\d+]/g, "");
    $("callText").textContent = `Gọi cho ${CONFIG.shortName} · ${CONFIG.phone}`;
    $("callLink").hidden = false;
  }

  /* ---------- 4. Đếm ngược ---------- */
  const two = (n) => String(n).padStart(2, "0");
  function tick() {
    const now = Date.now();
    if (now < start.getTime()) {
      let s = Math.floor((start.getTime() - now) / 1000);
      const d = Math.floor(s / 86400); s %= 86400;
      $("cdD").textContent = d; $("cdH").textContent = two(Math.floor(s / 3600));
      $("cdM").textContent = two(Math.floor((s % 3600) / 60)); $("cdS").textContent = two(s % 60);
      return true;
    }
    $("cdGrid").hidden = true; $("cdDone").hidden = false;
    if (now < end.getTime()) {
      $("cdLabel").textContent = "> status: LIVE";
      $("cdDone").textContent = "Buổi lễ đang diễn ra – hẹn gặp bạn tại Tòa C2!";
      return true;
    }
    $("cdLabel").textContent = "> process exited with code 0";
    $("cdDone").textContent = `Cảm ơn ${guest} đã cùng ${self} đi đến ngày hôm nay! ♥`;
    return false;
  }
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }

  /* ---------- 5. Intro terminal ---------- */
  const body = $("termBody");
  const lines = [
    { h: `<span class="p">➜</span> <span class="p">~</span> sudo graduate --name "${CONFIG.name}"`, type: true },
    { h: `<span class="dim">[sudo] password for hung: ********</span>`, pause: 350 },
    { h: `Compiling 4 years... `, type: true, bar: true },
    { h: `<span class="dim">✓ bugs fixed · deadlines survived · coffee consumed: ∞</span>`, pause: 300 },
    { h: `<span class="ok">Build succeeded ✓</span>`, pause: 350 },
    { h: `Sending invitation to: <span class="hl" id="termGuest"></span><span class="dim">...</span>`, type: true },
    { h: `<span class="ok">✉ Delivered.</span> <span class="dim">Nhấn “Mở thiệp” để xem.</span>`, pause: 250 }
  ];
  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let skipped = false, timers = [];
  const wait = (ms) => new Promise((r) => { const t = setTimeout(r, skipped ? 0 : ms); timers.push(t); });

  function renderAll() {
    body.innerHTML = lines.map((l) => l.h + (l.bar ? `<span class="bar">██████████</span> <span class="ok">100%</span>` : "")).join("\n") + '<span class="caret"></span>';
    const g = $("termGuest"); if (g) g.textContent = guest;
    showOpen();
  }
  function showOpen() { $("btnOpen").hidden = false; $("btnSkip").hidden = true; $("btnOpen").focus({ preventScroll: true }); }

  async function typeIntro() {
    for (const l of lines) {
      if (skipped) return;
      const lineEl = document.createElement("span");
      body.appendChild(lineEl);
      const caret = document.createElement("span"); caret.className = "caret"; body.appendChild(caret);
      if (l.type) {
        // gõ từng ký tự của phần text (giữ nguyên thẻ span tô màu)
        const tmp = document.createElement("div"); tmp.innerHTML = l.h;
        const nodes = [...tmp.childNodes];
        for (const n of nodes) {
          const target = n.nodeType === 3 ? document.createTextNode("") : n.cloneNode(false);
          lineEl.appendChild(target);
          let txt = n.textContent;
          if (n.id === "termGuest") txt = guest;
          const sink = target.nodeType === 3 ? target : target.appendChild(document.createTextNode(""));
          for (const ch of txt) { if (skipped) return; sink.data += ch; await wait(28 + Math.random() * 30); }
        }
      } else {
        lineEl.innerHTML = l.h;
      }
      if (l.bar) {
        const bar = document.createElement("span"); bar.className = "bar"; lineEl.appendChild(bar);
        for (let i = 1; i <= 10; i++) { if (skipped) return; bar.textContent = "█".repeat(i) + "░".repeat(10 - i); await wait(110); }
        const pct = document.createElement("span"); pct.className = "ok"; pct.textContent = " 100%"; lineEl.appendChild(pct);
      }
      caret.remove();
      body.appendChild(document.createTextNode("\n"));
      await wait(l.pause || 260);
    }
    skipped = true;
    body.insertAdjacentHTML("beforeend", '<span class="caret"></span>');
    showOpen();
  }
  function skip() { if (skipped) return; skipped = true; timers.forEach(clearTimeout); renderAll(); }
  $("btnSkip").addEventListener("click", skip);
  if (reduce) { skipped = true; renderAll(); } else { typeIntro(); }

  /* ---------- 6. Mở thiệp ---------- */
  let opened = false;
  function openCard() {
    if (opened) return;
    opened = true;
    requestTiltPermission();          // phải gọi trong cú chạm (iOS)
    startMusic();
    $("intro").classList.add("gone");
    document.body.classList.remove("locked");
    document.body.classList.add("opened");
    $("stage").setAttribute("aria-hidden", "false");
    window.scrollTo(0, 0);
    const card = $("card");
    card.addEventListener("animationend", (e) => { if (e.target === card) card.classList.add("ready"); }, { once: false });
    if (reduce) card.classList.add("ready");
    setupReveal();
    if (!reduce) { setTimeout(() => celebrate(1), 250); startDust(); }
    setTimeout(() => { const i = $("intro"); if (i) i.remove(); }, 900);
  }
  $("btnOpen").addEventListener("click", openCard);
  document.addEventListener("keydown", (e) => {
    if (opened) return;
    if (e.key === "Enter" && !$("btnOpen").hidden) { e.preventDefault(); openCard(); }
    else if (e.key === "Escape") skip();
  });
  // Chạm vào terminal khi đang gõ = tua nhanh
  $("intro").addEventListener("click", (e) => { if (!e.target.closest("button")) skip(); });

  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    els.forEach((el, i) => { el.style.transitionDelay = Math.min(i, 6) * 70 + "ms"; io.observe(el); });
  }

  /* ---------- 7. Pháo giấy vàng + mũ tốt nghiệp (canvas) ---------- */
  const fx = $("fx"), fctx = fx.getContext("2d");
  let parts = [], fxRunning = false;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function sizeCanvas(c, ctx) { c.width = innerWidth * DPR; c.height = innerHeight * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  function celebrate(scale) {
    sizeCanvas(fx, fctx);
    const W = innerWidth, H = innerHeight, colors = ["#C9A24E", "#E8CF8A", "#F6E7B8", "#B3122E", "#FFFFFF"];
    const nConf = Math.round((W < 520 ? 90 : 140) * scale), nCaps = Math.round((W < 520 ? 7 : 11) * scale);
    for (let i = 0; i < nConf; i++) {
      const fromLeft = i % 2 === 0;
      parts.push({ k: "c", x: fromLeft ? -10 : W + 10, y: H * (0.55 + Math.random() * 0.3),
        vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 7), vy: -(9 + Math.random() * 9),
        w: 5 + Math.random() * 5, h: 8 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
        c: colors[(Math.random() * colors.length) | 0], life: 0 });
    }
    for (let i = 0; i < nCaps; i++) {
      parts.push({ k: "cap", x: W * (0.2 + Math.random() * 0.6), y: H + 30, vx: (Math.random() - 0.5) * 4,
        vy: -(12 + Math.random() * 7), s: 22 + Math.random() * 14, r: (Math.random() - 0.5) * 0.6, vr: (Math.random() - 0.5) * 0.12, life: 0 });
    }
    if (!fxRunning) { fxRunning = true; requestAnimationFrame(fxFrame); }
  }
  function drawCap(ctx, s) {
    ctx.fillStyle = "#0B1F3A"; ctx.strokeStyle = "#C9A24E"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.35); ctx.lineTo(s * 0.6, 0); ctx.lineTo(0, s * 0.35); ctx.lineTo(-s * 0.6, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillRect(-s * 0.3, s * 0.1, s * 0.6, s * 0.28);
    ctx.strokeStyle = "#E8CF8A"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * 0.45, s * 0.08); ctx.lineTo(s * 0.45, s * 0.45); ctx.stroke();
    ctx.fillStyle = "#E8CF8A"; ctx.fillRect(s * 0.4, s * 0.42, s * 0.1, s * 0.16);
  }
  function fxFrame() {
    const W = innerWidth, H = innerHeight;
    fctx.clearRect(0, 0, W, H);
    parts = parts.filter((q) => q.y < H + 60 && q.life < 420);
    for (const q of parts) {
      q.life++;
      if (q.k === "c") { q.vy += 0.28; q.vx *= 0.985; q.vy = Math.min(q.vy, 4.2); q.x += q.vx + Math.sin(q.life / 9) * 0.6; }
      else { q.vy += 0.3; q.vx *= 0.99; q.x += q.vx; }
      q.y += q.vy; q.r += q.vr;
      fctx.save(); fctx.translate(q.x, q.y); fctx.rotate(q.r);
      if (q.k === "c") { fctx.fillStyle = q.c; fctx.scale(1, Math.cos(q.life / 6)); fctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); }
      else drawCap(fctx, q.s);
      fctx.restore();
    }
    if (parts.length) requestAnimationFrame(fxFrame);
    else { fxRunning = false; fctx.clearRect(0, 0, W, H); }
  }

  /* ---------- 8. Bụi vàng nền ---------- */
  function startDust() {
    const c = $("dust"), ctx = c.getContext("2d"); let motes = [];
    function seed() { sizeCanvas(c, ctx); const n = innerWidth < 520 ? 18 : 30; motes = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 0.6 + Math.random() * 1.6,
      sp: 0.12 + Math.random() * 0.25, a: 0.15 + Math.random() * 0.35, ph: Math.random() * 6.28 })); }
    seed(); addEventListener("resize", seed);
    (function f(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const m of motes) {
        m.y -= m.sp; m.x += Math.sin(t / 2600 + m.ph) * 0.2;
        if (m.y < -5) { m.y = innerHeight + 5; m.x = Math.random() * innerWidth; }
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283);
        ctx.fillStyle = `rgba(232,207,138,${(m.a * (0.6 + 0.4 * Math.sin(t / 1500 + m.ph))).toFixed(3)})`; ctx.fill();
      }
      requestAnimationFrame(f);
    })(0);
  }

  /* ---------- 9. Nghiêng 3D ---------- */
  const card = $("card");
  const setTilt = (rx, ry) => { card.style.setProperty("--rx", rx.toFixed(2) + "deg"); card.style.setProperty("--ry", ry.toFixed(2) + "deg"); };
  if (!reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    addEventListener("pointermove", (e) => {
      if (!opened) return;
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      setTilt(-y * 6, x * 8);
    });
    document.addEventListener("pointerleave", () => setTilt(0, 0));
  }
  let orientOn = false;
  function onOrient(e) {
    if (e.beta == null || e.gamma == null) return;
    const b = Math.max(-20, Math.min(20, e.beta - 45)), g = Math.max(-20, Math.min(20, e.gamma));
    setTilt(-b / 6, g / 5);
  }
  function requestTiltPermission() {
    if (reduce || orientOn || !("DeviceOrientationEvent" in window)) return;
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) return; // desktop dùng chuột
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((s) => { if (s === "granted") { addEventListener("deviceorientation", onOrient); orientOn = true; } })
          .catch(() => {});
      } else { addEventListener("deviceorientation", onOrient); orientOn = true; }
    } catch (e) {}
  }

  /* ---------- 10. Nhạc nền (ẩn nếu không có file) ---------- */
  const bgm = $("bgm"), mbtn = $("musicBtn");
  let musicReady = false, wantMusic = true;
  bgm.addEventListener("loadedmetadata", () => { musicReady = true; mbtn.hidden = false; if (opened && wantMusic) startMusic(); });
  bgm.addEventListener("error", () => { musicReady = false; mbtn.hidden = true; });
  if (CONFIG.music) bgm.src = CONFIG.music;
  function fade(to, ms) {
    const from = bgm.volume, t0 = performance.now();
    (function s(n) { const k = Math.min(1, (n - t0) / ms); bgm.volume = from + (to - from) * k; if (k < 1) requestAnimationFrame(s); })(t0);
  }
  function startMusic() {
    if (!musicReady || !wantMusic) return;
    bgm.volume = 0;
    const pr = bgm.play();
    if (pr && pr.then) pr.then(() => { mbtn.setAttribute("aria-pressed", "true"); fade(0.8, 2000); }).catch(() => {});
  }
  mbtn.addEventListener("click", () => {
    if (bgm.paused) { wantMusic = true; startMusic(); }
    else { wantMusic = false; bgm.pause(); mbtn.setAttribute("aria-pressed", "false"); }
  });
  document.addEventListener("visibilitychange", () => {
    if (!musicReady) return;
    if (document.hidden) bgm.pause(); else if (wantMusic && opened) bgm.play().catch(() => {});
  });

  /* ---------- 11. Easter egg: chạm mũ 5 lần hoặc Konami code ---------- */
  let taps = 0, tapTimer, toastTimer, eggRunning = false;
  function toast(html, ms) {
    const t = $("toast"); t.innerHTML = html; t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms || 5400);
  }

  function playCameraShutterSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      const t0 = ctx.currentTime;

      const makeNoise = (dur, decay) => {
        const len = Math.floor(ctx.sampleRate * dur);
        const b = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * decay));
        }
        return b;
      };

      // 1. Tiếng mở màn trập (t0)
      const n1 = ctx.createBufferSource();
      n1.buffer = makeNoise(0.045, 0.015);
      const f1 = ctx.createBiquadFilter();
      f1.type = "bandpass"; f1.frequency.setValueAtTime(2400, t0); f1.Q.setValueAtTime(3.5, t0);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.7, t0); g1.gain.exponentialRampToValueAtTime(0.01, t0 + 0.04);
      n1.connect(f1); f1.connect(g1); g1.connect(ctx.destination);
      n1.start(t0);

      // 2. Tiếng đập gương lật & đóng màn trập (TÁCH!)
      const t1 = t0 + 0.06;
      const osc = ctx.createOscillator();
      const oscG = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, t1);
      osc.frequency.exponentialRampToValueAtTime(80, t1 + 0.045);
      oscG.gain.setValueAtTime(0.85, t1);
      oscG.gain.exponentialRampToValueAtTime(0.001, t1 + 0.045);
      osc.connect(oscG); oscG.connect(ctx.destination);
      osc.start(t1); osc.stop(t1 + 0.05);

      const n2 = ctx.createBufferSource();
      n2.buffer = makeNoise(0.065, 0.02);
      const f2 = ctx.createBiquadFilter();
      f2.type = "highpass"; f2.frequency.setValueAtTime(2800, t1);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.9, t1); g2.gain.exponentialRampToValueAtTime(0.01, t1 + 0.06);
      n2.connect(f2); f2.connect(g2); g2.connect(ctx.destination);
      n2.start(t1);

      setTimeout(() => { ctx.close().catch(() => {}); }, 450);
    } catch (e) {
      /* AudioContext fallback */
    }
  }

  function egg() {
    if (eggRunning) return;
    eggRunning = true;

    const overlay = $("cameraEgg");
    const flash = $("cameraFlash");
    const vf = $("cameraViewfinder");
    const cam = $("cameraUnit");
    const shutter = $("camShutterBtn");
    const iris = $("camIris");
    const snapText = $("camSnapText");

    if (reduce) {
      toast(`<b>🏆 Achievement unlocked!</b><br>&gt; 📸 <i>*Tách!*</i> Bạn đã tìm ra easter egg.<br>&gt; Phần thưởng: 1 tấm ảnh chung với ${escapeHtml(CONFIG.shortName)} vào ngày lễ! 🎓`);
      eggRunning = false;
      return;
    }

    overlay.hidden = false;
    requestAnimationFrame(() => {
      vf.classList.add("active");
      cam.classList.add("pop-in");
    });

    // Lúc 550ms: máy ảnh chụp TÁCH!
    setTimeout(() => {
      if (shutter) shutter.classList.add("press");
      if (iris) iris.classList.add("closed");

      playCameraShutterSound();

      // Màn hình chớp sáng
      flash.classList.add("flash-boom");
      setTimeout(() => { flash.classList.remove("flash-boom"); }, 60);

      cam.classList.add("recoil");
      snapText.classList.add("boom");

      celebrate(0.8);

      setTimeout(() => {
        if (shutter) shutter.classList.remove("press");
        if (iris) iris.classList.remove("closed");
      }, 160);
    }, 550);

    // Lúc 1400ms: thu gọn máy ảnh
    setTimeout(() => {
      vf.classList.remove("active");
      cam.classList.remove("pop-in");
      cam.style.opacity = "0";
      cam.style.transform = "translate(-50%, -50%) scale(0.7) translateY(60px)";
    }, 1400);

    // Lúc 1750ms: hoàn thành và hiện Achievement
    setTimeout(() => {
      overlay.hidden = true;
      cam.style.opacity = "";
      cam.style.transform = "";
      cam.classList.remove("recoil");
      snapText.classList.remove("boom");
      eggRunning = false;

      toast(`<b>🏆 Achievement unlocked!</b><br>&gt; 📸 <i>*Tách!*</i> Đã bắt trọn khoảnh khắc tốt nghiệp.<br>&gt; Phần thưởng: 1 tấm ảnh check-in chung với ${escapeHtml(CONFIG.shortName)} vào ngày lễ! 🎓`);
    }, 1750);
  }
  $("capBtn").addEventListener("click", () => {
    const b = $("capBtn"); b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle");
    taps++; clearTimeout(tapTimer); tapTimer = setTimeout(() => { taps = 0; }, 1600);
    if (taps >= 5) { taps = 0; egg(); }
  });
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  document.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = k === konami[kpos] ? kpos + 1 : (k === konami[0] ? 1 : 0);
    if (kpos === konami.length) { kpos = 0; if (opened) egg(); }
  });

  addEventListener("resize", () => { if (fxRunning) sizeCanvas(fx, fctx); });
  console.log("%c🎓 Nguyễn Thanh Hưng – Graduation 2026", "color:#C9A24E;font-weight:bold;font-size:14px", "\nThử chạm vào chiếc mũ 5 lần xem 😉");
})();
