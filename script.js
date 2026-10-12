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

/* ---------- searchable dropdown ---------- */
function setupSearch(input, box, key, onSelect) {
    const render = () => {
        const q = input.value.trim().toLowerCase();
        const list = db[key].filter(i => i.name && i.name.toLowerCase().includes(q)).slice(0, 12);
        box.innerHTML = list.length
            ? ""
            : `<div class="no-result">${db[key].length ? "No results found" : "Loading database..."}</div>`;
        list.forEach(item => {
            const d = document.createElement("div");
            d.className = "result-item";
            d.textContent = item.name;
            if (item.brand || item.year) {
                const s = document.createElement("small");
                s.textContent = item.brand || item.year;
                d.appendChild(s);
            }
            d.onclick = () => { onSelect(item); box.classList.remove("show"); };
            box.appendChild(d);
        });
        box.classList.add("show");
    };
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
}

setupSearch($("cpuInput"), $("cpuResults"), "cpus", cpu => {
    selectedCPU = cpu;
    $("cpuInput").value = cpu.name;
    markSelected($("selectedCPU"), cpu.name);
    updatePC();
});
setupSearch($("gpuInput"), $("gpuResults"), "gpus", gpu => {
    selectedGPU = gpu;
    $("gpuInput").value = gpu.name;
    markSelected($("selectedGPU"), gpu.name);
    updatePC();
    // auto-fill VRAM from the GPU when the data has it
    if (gpu.vram && [...$("vram").options].some(o => +o.value === +gpu.vram)) {
        $("vram").value = gpu.vram;
        updatePC();
    }
});
setupSearch($("gameInput"), $("gameResults"), "games", g => selectGame(g));

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

const find = (list, name) => {
    if (!name) return null;
    const s = name.toLowerCase().trim();
    return list.find(i => i.name.toLowerCase().trim() === s)
        || list.find(i => i.name.toLowerCase().includes(s) || s.includes(i.name.toLowerCase())) || null;
};
const score = i => (i ? Number(i.performance ?? (i.vram || 1) * 100) : 0);

function compare(userItem, minName, recName, list) {
    const mn = find(list, minName), rc = find(list, recName);
    if (!mn || !rc) return 70;
    const u = score(userItem);
    return u >= score(rc) ? 100 : u >= score(mn) ? 70 : 25;
}
function compareMem(user, min, rec) { return user >= rec ? 100 : user >= min ? 70 : 25; }

function checkGame() {
    const mn = selectedGame.minimum || {}, rc = selectedGame.recommended || {};
    const cpu = compare(selectedCPU, mn.cpu, rc.cpu, db.cpus);
    const gpu = compare(selectedGPU, mn.gpu, rc.gpu, db.gpus);
    const r = compareMem(+$("ram").value, +(mn.ram || 4), +(rc.ram || 8));
    const v = compareMem(+$("vram").value, +(mn.vram || 1), +(rc.vram || 2));
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
