/* RUNMYGAME - script.js
   FIX: search lists were bound to empty arrays before the JSON loaded
   (cpus = await ... replaced the array, so the search never saw data).
   Now the search reads from `db` at typing time. */

const db = { games: [], cpus: [], gpus: [] };
let selectedCPU = null, selectedGPU = null, selectedGame = null;

const $ = id => document.getElementById(id);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } }
};

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- load data ---------- */
async function loadData() {
    try {
        const [g, c, p] = await Promise.all(
            ["games", "cpus", "gpus"].map(n => fetch(`./data/${n}.json`).then(r => {
                if (!r.ok) throw new Error(n + ".json not found");
                return r.json();
            }))
        );
        db.games = g; db.cpus = c; db.gpus = p;
        renderGames(db.games);
        revealOnScroll();
    } catch (e) {
        console.error(e);
        $("gamesGrid").innerHTML = `<div class="no-result">Database could not be loaded. Open the site through a local server (for example "python -m http.server"), not by double clicking index.html.</div>`;
    }
}

/* ---------- searchable dropdown (local data + optional live search) ---------- */
function setupSearch(input, box, key, onSelect, opts = {}) {
    let timer, token = 0;
    const row = (item, label) => {
        const d = document.createElement("div");
        d.className = "result-item";
        d.textContent = item.name;
        const t = label || item.brand || item.year;
        if (t) { const s = document.createElement("small"); s.textContent = t; d.appendChild(s); }
        d.onclick = () => { onSelect(item); box.classList.remove("show"); };
        return d;
    };
    const render = () => {
        const q = input.value.trim(), ql = q.toLowerCase(), my = ++token;
        const list = db[key].filter(i => i.name && i.name.toLowerCase().includes(ql)).slice(0, 8);
        box.innerHTML = "";
        list.forEach(i => box.appendChild(row(i)));
        if (opts.custom && q.length > 1 && !list.some(i => i.name.toLowerCase() === ql))
            box.appendChild(row({ name: q, custom: true }, "use my own"));
        if (opts.live && q.length > 1) {
            const st = document.createElement("div");
            st.className = "no-result"; st.textContent = "Searching Steam...";
            box.appendChild(st);
            clearTimeout(timer);
            timer = setTimeout(async () => {
                let found = [];
                try { found = await opts.live(q); } catch { }
                if (my !== token) return;
                st.remove();
                const have = new Set(list.map(i => i.name.toLowerCase()));
                found.filter(i => !have.has(i.name.toLowerCase())).forEach(i => box.appendChild(row(i, "Steam")));
                if (!box.children.length) box.innerHTML = `<div class="no-result">No results found</div>`;
            }, 350);
        } else if (!box.children.length) {
            box.innerHTML = `<div class="no-result">${db[key].length ? "No results found" : "Loading database..."}</div>`;
        }
        box.classList.add("show");
    };
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
}

/* live Steam search through the Vercel function in /api/steam.js */
const steamSearch = q => fetch("/api/steam?q=" + encodeURIComponent(q)).then(r => r.json())
    .then(d => (d.items || []).map(i => ({ name: i.name, id: i.id, image: i.image, live: true })));
const steamGame = id => fetch("/api/steam?id=" + id).then(r => { if (!r.ok) throw new Error("no data"); return r.json(); });

setupSearch($("cpuInput"), $("cpuResults"), "cpus", cpu => {
    if (cpu.custom && cpuPerf(cpu.name) == null)
        return toast('Could not recognise that CPU. Try e.g. "Ryzen 5 3600" or "Core i5-12400F"');
    selectedCPU = cpu;
    $("cpuInput").value = cpu.name;
    markSelected($("selectedCPU"), cpu.name);
    updatePC();
}, { custom: true });

setupSearch($("gpuInput"), $("gpuResults"), "gpus", gpu => {
    if (gpu.custom && gpuPerf(gpu.name) == null)
        return toast('Could not recognise that GPU. Try e.g. "RTX 4060" or "RX 6600"');
    selectedGPU = gpu;
    $("gpuInput").value = gpu.name;
    markSelected($("selectedGPU"), gpu.name);
    if (gpu.vram && [...$("vram").options].some(o => +o.value === +gpu.vram)) $("vram").value = gpu.vram;
    updatePC();
}, { custom: true });

setupSearch($("gameInput"), $("gameResults"), "games", async g => {
    if (g.live) {
        toast("Loading requirements...");
        try { g = await steamGame(g.id); }
        catch { return toast("This game has no PC requirements on Steam"); }
    }
    selectGame(g);
}, { live: steamSearch });

function markSelected(el, name) {
    el.textContent = "✓ " + name;
    el.classList.remove("ok");
    void el.offsetWidth;
    el.classList.add("ok");
}

function selectGame(game) {
    selectedGame = game;
    $("gameInput").value = game.name;
    $("gameSelected").innerHTML = `
        <div class="selected-game-content">
            <img src="${esc(game.image || "")}" alt="${esc(game.name)}" onerror="this.style.opacity='0'">
            <div class="selected-game-info">
                <h3>${esc(game.name)}</h3>
                <p>${game.year || ""} ${game.genre ? "• " + esc(game.genre) : ""}</p>
                <p style="color:var(--green)">Game selected ✓</p>
            </div>
        </div>`;
}

/* ---------- PC preview ---------- */
function updatePC() {
    $("heroCPU").textContent = selectedCPU ? selectedCPU.name : "Not set";
    $("heroGPU").textContent = selectedGPU ? selectedGPU.name : "Not set";
    $("heroRAM").textContent = $("ram").value + " GB";
    $("heroVRAM").textContent = $("vram").value + " GB";
    $("pcStatus").textContent = selectedCPU && selectedGPU ? "Gaming PC" : "Not configured";
}
$("ram").onchange = $("vram").onchange = updatePC;

$("savePC").onclick = () => {
    if (!selectedCPU) return toast("Please select a CPU first");
    if (!selectedGPU) return toast("Please select a GPU first");
    store.set("runmygamePC", JSON.stringify({ cpu: selectedCPU, gpu: selectedGPU, ram: +$("ram").value, vram: +$("vram").value }));
    toast("Your PC has been saved ✓");
};

/* ---------- check ---------- */
$("checkBtn").onclick = () => {
    if (!selectedCPU) return toast("Select your CPU first");
    if (!selectedGPU) return toast("Select your GPU first");
    if (!selectedGame) return toast("Select a game first");
    const btn = $("checkBtn");
    btn.classList.add("loading");
    setTimeout(() => { btn.classList.remove("loading"); checkGame(); }, 700);
};

/* ---------- performance estimator (one scale for your PC and the game requirements) ---------- */
const GPUS = {
    gt710: 10, gt730: 15, gt1030: 35, gts450: 20, gtx460: 30, gtx470: 45, gtx480: 50, gtx550ti: 30, gtx560: 40, gtx560ti: 45, gtx570: 50, gtx580: 55,
    gtx650: 35, gtx650ti: 40, gtx660: 55, gtx670: 70, gtx680: 80, gtx750: 45, gtx750ti: 50, gtx760: 65, gtx770: 80, gtx780: 95,
    gtx950: 65, gtx960: 70, gtx970: 105, gtx980: 125, gtx980ti: 150,
    gtx1050: 58, gtx1050ti: 70, gtx1060: 100, gtx1070: 145, gtx1070ti: 170, gtx1080: 185, gtx1080ti: 240,
    gtx1630: 50, gtx1650: 75, gtx1650super: 100, gtx1660: 115, gtx1660super: 125, gtx1660ti: 125,
    rtx2060: 140, rtx2060super: 165, rtx2070: 175, rtx2070super: 195, rtx2080: 225, rtx2080super: 240, rtx2080ti: 290,
    rtx3050: 105, rtx3060: 165, rtx3060ti: 215, rtx3070: 250, rtx3070ti: 270, rtx3080: 330, rtx3080ti: 380, rtx3090: 400,
    rtx4060: 190, rtx4060ti: 230, rtx4070: 290, rtx4070super: 330, rtx4070ti: 370, rtx4080: 420, rtx4090: 600,
    rtx5060: 230, rtx5060ti: 270, rtx5070: 350, rtx5070ti: 450, rtx5080: 520, rtx5090: 700,
    rx460: 50, rx470: 85, rx480: 105, rx560: 55, rx570: 95, rx580: 110, rx590: 125, rx5500xt: 95, rx5600xt: 145, rx5700: 185, rx5700xt: 205,
    rx6500xt: 100, rx6600: 185, rx6600xt: 215, rx6650xt: 225, rx6700xt: 265, rx6800: 340, rx6800xt: 380, rx6900xt: 420,
    rx7600: 200, rx7600xt: 215, rx7700xt: 290, rx7800xt: 370, rx7900gre: 400, rx7900xt: 480, rx7900xtx: 560, rx9060xt: 260, rx9070: 400, rx9070xt: 470
};
const OLD_NV = { 9800: 20, 8800: 25, 8600: 10, 7900: 15, 7600: 12, 6600: 8 };
const AMD_HD = { 5770: 30, 6850: 35, 6950: 50, 7770: 40, 7850: 50, 7870: 60, 7950: 70, 7970: 80 };
const AMD_R = { r7260x: 45, r9270: 70, r9270x: 75, r9280: 75, r9280x: 85, r9285: 80, r9290: 105, r9380: 75, r9390: 120 };
const INTEL_HD = { 3000: 15, 4000: 25, 4600: 35, 5000: 40, 530: 45, 620: 50, 630: 55 };

function gpuPerf(raw) {
    const s = String(raw).toLowerCase().replace(/[()]/g, " ");
    let m = s.match(/\b(gtx|rtx|gts|gt|rx)\s*(\d{3,4})(?:\s*(ti|super|xtx|xt|gre))?(?:\s*(ti|super))?/);
    if (m) {
        const k = m[1] + m[2];
        for (const key of [k + (m[3] || "") + (m[4] || ""), k + (m[3] || ""), k]) if (GPUS[key]) return GPUS[key];
    }
    if (/radeon/.test(s) && (m = s.match(/hd\s*(\d{4})/))) return AMD_HD[m[1]] ?? 40;
    if ((m = s.match(/\br([79])\s*(\d{3}x?)/))) return AMD_R["r" + m[1] + m[2]] ?? null;
    if ((m = s.match(/u?hd\s*(?:graphics)?\s*(\d{3,4})/))) return INTEL_HD[m[1]] ?? 30;
    if (/iris\s*xe/.test(s)) return 90;
    if ((m = s.match(/vega\s*(\d+)/))) return m[1] >= 11 ? 90 : 70;
    if ((m = s.match(/\b(\d{4})\s*(?:gt|gs)\b/)) || (m = s.match(/geforce\s*(\d{4})/))) return OLD_NV[m[1]] ?? null;
    return null;
}

function cpuPerf(raw) {
    const s = String(raw).toLowerCase().replace(/\((r|tm)\)|®|™/g, "");
    let m;
    if ((m = s.match(/core\s*ultra\s*([579])/))) return { 5: 300, 7: 380, 9: 450 }[m[1]];
    if ((m = s.match(/\bi([3579])[-\s]*(\d{3,5})(k|f|kf|x)?/))) {
        const t = +m[1], n = m[2], gen = n.length === 5 ? +n.slice(0, 2) : n.length === 4 ? +n[0] : 1;
        const base = { 1: 60, 2: 55, 3: 62, 4: 70, 5: 75, 6: 85, 7: 92, 8: 125, 9: 140, 10: 155, 11: 175, 12: 230, 13: 270, 14: 285 }[gen] ?? 150;
        const mul = { 3: gen >= 8 ? .8 : .62, 5: 1, 7: 1.25, 9: 1.5 }[t];
        return Math.round(base * mul * (m[3] === "k" || m[3] === "kf" || m[3] === "x" ? 1.05 : 1));
    }
    if ((m = s.match(/core\s*i([3579])\b/))) return { 3: 55, 5: 85, 7: 105, 9: 140 }[m[1]];
    if ((m = s.match(/core\s*2\s*(duo|quad)/))) return m[1] === "duo" ? 30 : 45;
    if ((m = s.match(/ryzen\s*([3579])\s*(\d)\d{3}/))) {
        const base = { 1: 120, 2: 140, 3: 165, 4: 165, 5: 225, 6: 260, 7: 290, 8: 300, 9: 330 }[m[2]];
        return Math.round(base * { 3: .65, 5: 1, 7: 1.25, 9: 1.55 }[m[1]]);
    }
    if ((m = s.match(/\bfx[-\s]*(\d{4})/))) return { 4300: 45, 6300: 60, 8320: 72, 8350: 75, 9590: 85 }[m[1]] ?? 65;
    if (/phenom/.test(s)) return 45;
    if (/athlon/.test(s)) return 30;
    if (/pentium\s*4/.test(s)) return 15;
    if (/pentium|celeron/.test(s)) return 30;
    if ((m = s.match(/(\d(?:\.\d+)?)\s*ghz/))) return Math.min(Math.round(m[1] * 15), 60);
    if (/quad/.test(s)) return 50;
    if (/dual/.test(s)) return 30;
    return null;
}

const perf = (name, kind) => kind === "cpu" ? cpuPerf(name) : gpuPerf(name);
const score = i => (i ? Number(i.performance ?? (i.vram || 1) * 100) : 0);

// "Intel Core i5-2500K or AMD FX-8350" -> either works, so the requirement is the weaker one
function reqPerf(str, kind) {
    if (!str) return null;
    const vals = String(str).split(/\s+or\s+|\s*\/\s*|;|\s+and\s+/i).map(a => perf(a, kind)).filter(v => v != null);
    return vals.length ? Math.min(...vals) : null;
}

function compare(user, minStr, recStr, kind) {
    const u = perf(user.name, kind) ?? score(user);
    let mn = reqPerf(minStr, kind), rc = reqPerf(recStr, kind);
    if (mn == null && rc == null) return 70;
    mn = mn ?? rc * .7;
    rc = Math.max(rc ?? mn * 1.4, mn);
    return u >= rc * .95 ? 100 : u >= mn * .95 ? 70 : 25;
}
function compareMem(user, min, rec) { return user >= rec ? 100 : user >= min ? 70 : 25; }

function checkGame() {
    const mn = selectedGame.minimum || {}, rc = selectedGame.recommended || {};
    const cpu = compare(selectedCPU, mn.cpu, rc.cpu, "cpu");
    const gpu = compare(selectedGPU, mn.gpu, rc.gpu, "gpu");
    const mr = +(mn.ram || 4), mv = +(mn.vram || 1);
    const r = compareMem(+$("ram").value, mr, +(rc.ram || Math.max(mr, 8)));
    const v = compareMem(+$("vram").value, mv, +(rc.vram || Math.max(mv, 2)));
    const total = cpu * .3 + gpu * .4 + r * .2 + v * .1;
    showResult(total >= 85 ? "good" : total >= 65 ? "playable" : "bad", total, cpu, gpu, r, v);
}

const fpsFor = s => s >= 95 ? 80 : s >= 85 ? 65 : s >= 75 ? 55 : s >= 65 ? 45 : s >= 50 ? 30 : 20;

const TEXT = {
    good: ["fa-circle-check", "Your PC Can Run It", "Your hardware meets the recommended requirements."],
    playable: ["fa-check", "Likely Playable", "Your PC should run this game. You may need lower graphics settings."],
    bad: ["fa-xmark", "Not Recommended", "Your hardware may be below the game's minimum requirements."]
};

function showResult(status, total, cpu, gpu, r, v) {
    const box = $("result");
    box.className = "result " + status;
    void box.offsetWidth; // restart the animation on every check
    $("resultIcon").innerHTML = `<i class="fa-solid ${TEXT[status][0]}"></i>`;
    $("resultTitle").textContent = TEXT[status][1];
    $("resultMessage").textContent = TEXT[status][2];
    countUp($("fps"), fpsFor(total));

    $("requirementsBox").classList.remove("hidden");
    $("comparison").innerHTML = [["CPU", cpu], ["GPU", gpu], ["RAM", r], ["VRAM", v]].map(([n, s]) => `
        <div class="requirement-row">
            <span>${n}</span>
            <div class="bar"><i class="${s >= 70 ? "" : "fail"}" data-w="${s}"></i></div>
            <strong class="${s >= 70 ? "pass" : "fail"}">${s >= 70 ? "PASS" : "BELOW"}</strong>
            <span>${Math.round(s)}%</span>
        </div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() =>
        document.querySelectorAll("#comparison .bar i").forEach(b => b.style.width = b.dataset.w + "%")));

    box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function countUp(el, to) {
    const t0 = performance.now();
    const step = t => {
        const p = Math.min((t - t0) / 900, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ---------- game library ---------- */
function renderGames(list) {
    const grid = $("gamesGrid");
    grid.innerHTML = list.length ? "" : `<div class="no-result">No games found.</div>`;
    list.forEach((g, i) => {
        const card = document.createElement("div");
        card.className = "game-card reveal";
        card.style.transitionDelay = Math.min(i, 8) * 60 + "ms";
        card.innerHTML = `
            <img src="${esc(g.image || "")}" alt="${esc(g.name)}" loading="lazy" onerror="this.style.opacity='0'">
            <div class="game-card-content">
                <h3>${esc(g.name)}</h3>
                <p>${g.year || ""}${g.genre ? " • " + esc(g.genre) : ""}</p>
                <button>View Requirements</button>
            </div>`;
        card.querySelector("button").onclick = () => openModal(g);
        grid.appendChild(card);
    });
    revealOnScroll();
}
$("librarySearch").oninput = e => {
    const q = e.target.value.trim().toLowerCase();
    renderGames(db.games.filter(g => g.name.toLowerCase().includes(q)));
};

/* ---------- modal ---------- */
const reqText = r => `CPU: ${esc(r.cpu || "Unknown")}<br>GPU: ${esc(r.gpu || "Unknown")}<br>RAM: ${r.ram || "?"} GB<br>VRAM: ${r.vram || "?"} GB`;
let modalGame = null;

function openModal(g) {
    modalGame = g;
    $("modalImage").src = g.image || "";
    $("modalTitle").textContent = g.name;
    $("modalMeta").textContent = `${g.year || ""} • ${g.genre || "PC Game"}`;
    $("minimumText").innerHTML = reqText(g.minimum || {});
    $("recommendedText").innerHTML = reqText(g.recommended || {});
    $("modal").classList.remove("hidden");
    document.body.classList.add("modal-open");
}
function closeModal() {
    $("modal").classList.add("hidden");
    document.body.classList.remove("modal-open");
}
$("closeModal").onclick = $("modalOverlay").onclick = closeModal;
document.addEventListener("keydown", e => e.key === "Escape" && closeModal());
$("modalCheck").onclick = () => {
    closeModal();
    if (modalGame) selectGame(modalGame); // FIX: game is now really selected in the checker
    $("checker").scrollIntoView({ behavior: "smooth" });
};

/* ---------- theme + menu ---------- */
function applyTheme(light) {
    document.body.classList.toggle("light", light);
    $("themeBtn").innerHTML = `<i class="fa-solid ${light ? "fa-sun" : "fa-moon"}"></i>`;
}
$("themeBtn").onclick = () => {
    const light = !document.body.classList.contains("light");
    applyTheme(light);
    store.set("theme", light ? "light" : "dark");
};
$("menuBtn").onclick = () => $("navigation").classList.toggle("active");
$("navigation").onclick = e => e.target.tagName === "A" && $("navigation").classList.remove("active");

document.addEventListener("click", e => {
    [["cpuInput", "cpuResults"], ["gpuInput", "gpuResults"], ["gameInput", "gameResults"]].forEach(([i, b]) => {
        if (!$(i).contains(e.target) && !$(b).contains(e.target)) $(b).classList.remove("show");
    });
});

/* ---------- scroll reveal ---------- */
let io;
function revealOnScroll() {
    if (!("IntersectionObserver" in window)) return document.querySelectorAll(".reveal").forEach(e => e.classList.add("in"));
    io = io || new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .12 });
    document.querySelectorAll(".reveal:not(.in)").forEach(e => io.observe(e));
}
document.querySelectorAll(".section-heading,.card,.library-search").forEach(e => e.classList.add("reveal"));

/* ---------- saved PC ---------- */
function loadSavedPC() {
    try {
        const pc = JSON.parse(store.get("runmygamePC") || "null");
        if (pc) {
            if (pc.cpu) { selectedCPU = pc.cpu; $("cpuInput").value = pc.cpu.name; markSelected($("selectedCPU"), pc.cpu.name); }
            if (pc.gpu) { selectedGPU = pc.gpu; $("gpuInput").value = pc.gpu.name; markSelected($("selectedGPU"), pc.gpu.name); }
            if (pc.ram) $("ram").value = pc.ram;
            if (pc.vram) $("vram").value = pc.vram;
        }
    } catch { }
    updatePC();
}

/* ---------- start ---------- */
applyTheme(store.get("theme") === "light");
loadData();
loadSavedPC();
revealOnScroll();
