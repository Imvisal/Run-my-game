/* =========================================
   RUNMYGAME
   COMPLETE SCRIPT.JS
   ========================================= */


/* =========================================
   HARDWARE DATABASE
   ========================================= */

const CPUs = {

    i3_4: {
        name: "Intel Core i3 4th Gen",
        score: 25
    },

    i5_4: {
        name: "Intel Core i5 4th Gen",
        score: 42
    },

    i5_6: {
        name: "Intel Core i5 6th Gen",
        score: 52
    },

    i5_8: {
        name: "Intel Core i5 8th Gen",
        score: 66
    },

    i7_8: {
        name: "Intel Core i7 8th Gen",
        score: 76
    },

    ryzen3: {
        name: "AMD Ryzen 3",
        score: 45
    },

    ryzen5: {
        name: "AMD Ryzen 5",
        score: 66
    },

    ryzen7: {
        name: "AMD Ryzen 7",
        score: 82
    }

};


const GPUs = {

    igpu: {
        name: "Integrated Graphics",
        score: 10
    },

    gtx750: {
        name: "GTX 750",
        score: 25
    },

    gtx950: {
        name: "GTX 950",
        score: 35
    },

    gtx960: {
        name: "GTX 960 2GB",
        score: 43
    },

    gtx1050: {
        name: "GTX 1050",
        score: 48
    },

    gtx1060: {
        name: "GTX 1060",
        score: 62
    },

    gtx1650: {
        name: "GTX 1650",
        score: 58
    },

    gtx1660: {
        name: "GTX 1660",
        score: 73
    },

    rtx2060: {
        name: "RTX 2060",
        score: 82
    },

    rtx3060: {
        name: "RTX 3060",
        score: 93
    },

    rtx4060: {
        name: "RTX 4060",
        score: 100
    }

};


/* =========================================
   GAME DATABASE
   ========================================= */

const games = [

    {
        id: "gta5",
        name: "Grand Theft Auto V",
        genre: "Action",
        year: 2015,
        cover: "cover-gta",
        icon: "fa-car",
        description:
            "Explore Los Santos in one of the most popular open-world action games ever made.",

        min: {
            cpu: "Core 2 Quad Q6600",
            gpu: "GT 640 / HD 4870",
            ram: 4,
            vram: 1,
            storage: 110
        },

        rec: {
            cpu: "Core i5 3470",
            gpu: "GTX 660",
            ram: 8,
            vram: 2,
            storage: 110
        },

        cpuReq: 35,
        gpuReq: 40,

        baseFPS: 72
    },


    {
        id: "gta4",
        name: "Grand Theft Auto IV",
        genre: "Action",
        year: 2008,
        cover: "cover-gta4",
        icon: "fa-car",

        description:
            "Experience Liberty City as Niko Bellic in Rockstar's classic open-world action game.",

        min: {
            cpu: "Core 2 Duo 1.8 GHz",
            gpu: "GeForce 7900",
            ram: 1.5,
            vram: 0.5,
            storage: 22
        },

        rec: {
            cpu: "Core 2 Quad",
            gpu: "GTX 460",
            ram: 4,
            vram: 1,
            storage: 22
        },

        cpuReq: 28,
        gpuReq: 30,

        baseFPS: 75
    },


    {
        id: "rdr2",
        name: "Red Dead Redemption 2",
        genre: "Adventure",
        year: 2019,
        cover: "cover-rdr",
        icon: "fa-horse",

        description:
            "A massive open-world western adventure with a detailed story and realistic world.",

        min: {
            cpu: "Core i5-2500K",
            gpu: "GTX 770",
            ram: 8,
            vram: 2,
            storage: 150
        },

        rec: {
            cpu: "Core i7-4770K",
            gpu: "GTX 1060 6GB",
            ram: 12,
            vram: 6,
            storage: 150
        },

        cpuReq: 55,
        gpuReq: 65,

        baseFPS: 55
    },


    {
        id: "farcry4",
        name: "Far Cry 4",
        genre: "Shooter",
        year: 2014,
        cover: "cover-farcry",
        icon: "fa-crosshairs",

        description:
            "Fight your way through the Himalayan region of Kyrat in this open-world shooter.",

        min: {
            cpu: "Core i5-750",
            gpu: "GTX 460",
            ram: 4,
            vram: 1,
            storage: 30
        },

        rec: {
            cpu: "Core i5-2400S",
            gpu: "GTX 680",
            ram: 8,
            vram: 2,
            storage: 30
        },

        cpuReq: 35,
        gpuReq: 40,

        baseFPS: 70
    },


    {
        id: "farcry6",
        name: "Far Cry 6",
        genre: "Shooter",
        year: 2021,
        cover: "cover-farcry",
        icon: "fa-crosshairs",

        description:
            "Join the revolution against a dictatorship on the fictional island of Yara.",

        min: {
            cpu: "Ryzen 3 1200",
            gpu: "RX 460",
            ram: 8,
            vram: 4,
            storage: 60
        },

        rec: {
            cpu: "Ryzen 5 3600X",
            gpu: "RTX 2070 Super",
            ram: 16,
            vram: 8,
            storage: 60
        },

        cpuReq: 60,
        gpuReq: 65,

        baseFPS: 55
    },


    {
        id: "nfs",
        name: "Need for Speed: Most Wanted",
        genre: "Racing",
        year: 2005,
        cover: "cover-nfs",
        icon: "fa-car-side",

        description:
            "Race through Rockport and build your reputation in the classic Need for Speed game.",

        min: {
            cpu: "Pentium 4",
            gpu: "GeForce 2",
            ram: 0.5,
            vram: 0.1,
            storage: 3
        },

        rec: {
            cpu: "Pentium 4 2.8 GHz",
            gpu: "GeForce 6600",
            ram: 1,
            vram: 0.2,
            storage: 3
        },

        cpuReq: 15,
        gpuReq: 15,

        baseFPS: 120
    },


    {
        id: "minecraft",
        name: "Minecraft",
        genre: "Sandbox",
        year: 2011,
        cover: "cover-minecraft",
        icon: "fa-cubes",

        description:
            "Build, explore and survive in an endless block-based world.",

        min: {
            cpu: "Intel Core i3-3210",
            gpu: "Intel HD Graphics 4000",
            ram: 4,
            vram: 0.5,
            storage: 4
        },

        rec: {
            cpu: "Core i5",
            gpu: "GTX 1050",
            ram: 8,
            vram: 2,
            storage: 4
        },

        cpuReq: 25,
        gpuReq: 25,

        baseFPS: 120
    },


    {
        id: "valorant",
        name: "Valorant",
        genre: "Shooter",
        year: 2020,
        cover: "cover-valorant",
        icon: "fa-crosshairs",

        description:
            "Competitive 5v5 tactical shooter designed to run on a wide range of PCs.",

        min: {
            cpu: "Intel Core 2 Duo E8400",
            gpu: "Intel HD 4000",
            ram: 4,
            vram: 1,
            storage: 25
        },

        rec: {
            cpu: "Core i3-4150",
            gpu: "GT 730",
            ram: 8,
            vram: 2,
            storage: 25
        },

        cpuReq: 20,
        gpuReq: 15,

        baseFPS: 160
    },


    {
        id: "cs2",
        name: "Counter-Strike 2",
        genre: "Shooter",
        year: 2023,
        cover: "cover-cs",
        icon: "fa-gun",

        description:
            "Valve's competitive tactical shooter with updated Source 2 technology.",

        min: {
            cpu: "4 hardware threads",
            gpu: "GTX 750 Ti",
            ram: 8,
            vram: 1,
            storage: 85
        },

        rec: {
            cpu: "Core i5",
            gpu: "GTX 1060",
            ram: 16,
            vram: 3,
            storage: 85
        },

        cpuReq: 45,
        gpuReq: 45,

        baseFPS: 95
    },


    {
        id: "cyberpunk",
        name: "Cyberpunk 2077",
        genre: "RPG",
        year: 2020,
        cover: "cover-cyberpunk",
        icon: "fa-city",

        description:
            "Explore Night City in a futuristic open-world action RPG.",

        min: {
            cpu: "Core i7-6700",
            gpu: "GTX 1060 6GB",
            ram: 12,
            vram: 6,
            storage: 70
        },

        rec: {
            cpu: "Core i7-12700",
            gpu: "RTX 2060 Super",
            ram: 16,
            vram: 8,
            storage: 70
        },

        cpuReq: 70,
        gpuReq: 75,

        baseFPS: 52
    },


    {
        id: "witcher3",
        name: "The Witcher 3",
        genre: "RPG",
        year: 2015,
        cover: "cover-witcher",
        icon: "fa-wolf-pack-battalion",

        description:
            "Follow Geralt of Rivia through a massive fantasy world full of monsters and quests.",

        min: {
            cpu: "Core i5-2500K",
            gpu: "GTX 660",
            ram: 6,
            vram: 2,
            storage: 50
        },

        rec: {
            cpu: "Core i7-3770",
            gpu: "GTX 770",
            ram: 8,
            vram: 4,
            storage: 50
        },

        cpuReq: 45,
        gpuReq: 48,

        baseFPS: 70
    },


    {
        id: "elden",
        name: "Elden Ring",
        genre: "RPG",
        year: 2022,
        cover: "cover-elden",
        icon: "fa-ring",

        description:
            "Explore a vast fantasy world filled with powerful enemies and challenging combat.",

        min: {
            cpu: "Core i5-8400",
            gpu: "GTX 1060 3GB",
            ram: 12,
            vram: 3,
            storage: 60
        },

        rec: {
            cpu: "Core i7-8700K",
            gpu: "GTX 1070",
            ram: 16,
            vram: 8,
            storage: 60
        },

        cpuReq: 62,
        gpuReq: 68,

        baseFPS: 60
    },


    {
        id: "forza",
        name: "Forza Horizon 5",
        genre: "Racing",
        year: 2021,
        cover: "cover-forza",
        icon: "fa-car",

        description:
            "Drive hundreds of cars across a beautiful open-world Mexico.",

        min: {
            cpu: "Ryzen 3 1200",
            gpu: "GTX 970",
            ram: 8,
            vram: 4,
            storage: 110
        },

        rec: {
            cpu: "Ryzen 5 1500X",
            gpu: "GTX 1070",
            ram: 16,
            vram: 8,
            storage: 110
        },

        cpuReq: 55,
        gpuReq: 62,

        baseFPS: 65
    }

];


/* =========================================
   DOM
   ========================================= */

const cpu = document.getElementById("cpu");
const gpu = document.getElementById("gpu");
const ram = document.getElementById("ram");
const vram = document.getElementById("vram");
const storage = document.getElementById("storage");

const gameSelect = document.getElementById("gameSelect");
const resolution = document.getElementById("resolution");
const preset = document.getElementById("preset");

const checkBtn = document.getElementById("checkBtn");
const savePcBtn = document.getElementById("savePcBtn");
const quickBtn = document.getElementById("quickBtn");

const gamesGrid = document.getElementById("gamesGrid");
const gameSearch = document.getElementById("gameSearch");
const genreFilter = document.getElementById("genreFilter");

const resultPanel = document.getElementById("resultPanel");
const componentScores = document.getElementById("componentScores");

const gameModal = document.getElementById("gameModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalCheck = document.getElementById("modalCheck");
const favoriteBtn = document.getElementById("favoriteBtn");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

let selectedModalGame = null;


/* =========================================
   POPULATE GAME SELECT
   ========================================= */

function populateGameSelect() {

    games.forEach(game => {

        const option = document.createElement("option");

        option.value = game.id;
        option.textContent = game.name;

        gameSelect.appendChild(option);

    });

}


/* =========================================
   GAME CARDS
   ========================================= */

function renderGames(list = games) {

    gamesGrid.innerHTML = "";

    document
        .getElementById("noGames")
        .classList.toggle("hidden", list.length !== 0);


    list.forEach(game => {

        const favorite =
            getFavorites().includes(game.id);

        const card = document.createElement("article");

        card.className = "game-card";

        card.innerHTML = `

            <div class="game-cover ${game.cover}">

                <i class="fa-solid ${game.icon}"></i>

            </div>

            <div class="game-card-body">

                <h3>${game.name}</h3>

                <div class="game-meta">

                    <span>${game.genre}</span>
                    <span>${game.year}</span>

                </div>

                <div class="game-actions">

                    <button
                        class="game-details-btn"
                        data-details="${game.id}">
                        View Requirements
                    </button>

                    <button
                        class="game-favorite ${favorite ? "active" : ""}"
                        data-favorite="${game.id}">
                        <i class="${favorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>

                </div>

            </div>

        `;

        gamesGrid.appendChild(card);

    });

}


/* =========================================
   SEARCH
   ========================================= */

function filterGames() {

    const search =
        gameSearch.value.toLowerCase().trim();

    const genre =
        genreFilter.value;


    const filtered = games.filter(game => {

        const matchesSearch =
            game.name.toLowerCase().includes(search);

        const matchesGenre =
            genre === "all" ||
            game.genre === genre;

        return matchesSearch && matchesGenre;

    });

    renderGames(filtered);

}

gameSearch.addEventListener("input", filterGames);
genreFilter.addEventListener("change", filterGames);


/* =========================================
   GAME CARD EVENTS
   ========================================= */

gamesGrid.addEventListener("click", event => {

    const detailsButton =
        event.target.closest("[data-details]");

    const favoriteButton =
        event.target.closest("[data-favorite]");


    if (detailsButton) {

        openGameModal(
            detailsButton.dataset.details
        );

    }


    if (favoriteButton) {

        toggleFavorite(
            favoriteButton.dataset.favorite
        );

        renderGames();

    }

});


/* =========================================
   FAVORITES
   ========================================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("runmygame-favorites") || "[]"
    );

}


function toggleFavorite(id) {

    let favorites = getFavorites();

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(item => item !== id);

        showToast("Removed from favorites");

    } else {

        favorites.push(id);

        showToast("Added to favorites");

    }

    localStorage.setItem(
        "runmygame-favorites",
        JSON.stringify(favorites)
    );

}


/* =========================================
   GAME MODAL
   ========================================= */

function openGameModal(id) {

    const game =
        games.find(item => item.id === id);

    if (!game) return;

    selectedModalGame = game;

    document.getElementById("modalTitle")
        .textContent = game.name;

    document.getElementById("modalGenre")
        .textContent = game.genre;

    document.getElementById("modalMeta")
        .textContent =
        `${game.genre} • ${game.year}`;

    document.getElementById("modalDescription")
        .textContent = game.description;

    document.getElementById("minCpu")
        .textContent = game.min.cpu;

    document.getElementById("minGpu")
        .textContent = game.min.gpu;

    document.getElementById("minRam")
        .textContent = `${game.min.ram} GB`;

    document.getElementById("minVram")
        .textContent = `${game.min.vram} GB`;

    document.getElementById("minStorage")
        .textContent = `${game.min.storage} GB`;

    document.getElementById("recCpu")
        .textContent = game.rec.cpu;

    document.getElementById("recGpu")
        .textContent = game.rec.gpu;

    document.getElementById("recRam")
        .textContent = `${game.rec.ram} GB`;

    document.getElementById("recVram")
        .textContent = `${game.rec.vram} GB`;

    document.getElementById("recStorage")
        .textContent = `${game.rec.storage} GB`;


    const cover =
        document.getElementById("modalCover");

    cover.className =
        `modal-cover ${game.cover}`;


    const favorite =
        getFavorites().includes(game.id);

    updateModalFavorite(favorite);


    gameModal.classList.remove("hidden");

    document.body.classList.add("modal-open");

}


function updateModalFavorite(active) {

    favoriteBtn.classList.toggle(
        "active",
        active
    );

    favoriteBtn.innerHTML =
        `<i class="${active ? "fa-solid" : "fa-regular"} fa-heart"></i>`;

}


function closeModal() {

    gameModal.classList.add("hidden");

    document.body.classList.remove("modal-open");

}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);


favoriteBtn.addEventListener("click", () => {

    if (!selectedModalGame) return;

    toggleFavorite(selectedModalGame.id);

    updateModalFavorite(
        getFavorites().includes(
            selectedModalGame.id
        )
    );

    renderGames();

});


modalCheck.addEventListener("click", () => {

    if (!selectedModalGame) return;

    gameSelect.value =
        selectedModalGame.id;

    closeModal();

    document
        .getElementById("checker")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* =========================================
   PC STORAGE
   ========================================= */

function getPc() {

    return JSON.parse(
        localStorage.getItem("runmygame-pc") || "null"
    );

}


function savePc() {

    if (
        !cpu.value ||
        !gpu.value ||
        !ram.value ||
        !vram.value ||
        !storage.value
    ) {

        showToast("Please complete your PC specs");

        return;

    }


    const pc = {

        cpu: cpu.value,
        gpu: gpu.value,
        ram: Number(ram.value),
        vram: Number(vram.value),
        storage: Number(storage.value)

    };


    localStorage.setItem(
        "runmygame-pc",
        JSON.stringify(pc)
    );


    updatePcPreview();

    updateUpgradeAdvisor();

    showToast("Your PC has been saved");

}


function loadPc() {

    const pc = getPc();

    if (!pc) return;

    cpu.value = pc.cpu;
    gpu.value = pc.gpu;
    ram.value = pc.ram;
    vram.value = pc.vram;
    storage.value = pc.storage;

    updatePcPreview();
    updateUpgradeAdvisor();

}


function updatePcPreview() {

    const pc = getPc();

    if (!pc) return;

    document.getElementById("heroCpu")
        .textContent =
        CPUs[pc.cpu]?.name || "Not set";

    document.getElementById("heroGpu")
        .textContent =
        GPUs[pc.gpu]?.name || "Not set";

    document.getElementById("heroRam")
        .textContent =
        `${pc.ram} GB`;

    document.getElementById("heroVram")
        .textContent =
        `${pc.vram} GB`;

    document.getElementById("heroPcName")
        .textContent =
        `${CPUs[pc.cpu]?.name || "Gaming PC"}`;

}


savePcBtn.addEventListener(
    "click",
    savePc
);


/* =========================================
   PERFORMANCE CALCULATOR
   ========================================= */

function calculatePerformance() {

    if (
        !cpu.value ||
        !gpu.value ||
        !ram.value ||
        !vram.value ||
        !storage.value ||
        !gameSelect.value
    ) {

        showToast(
            "Select your PC specs and a game first"
        );

        return;

    }


    const pc = {

        cpuScore: CPUs[cpu.value].score,
        gpuScore: GPUs[gpu.value].score,

        ram: Number(ram.value),
        vram: Number(vram.value),

        storage: Number(storage.value)

    };


    const game =
        games.find(
            item => item.id === gameSelect.value
        );

    if (!game) return;


    /* CPU */

    const cpuRatio =
        pc.cpuScore / game.cpuReq;


    /* GPU */

    const gpuRatio =
        pc.gpuScore / game.gpuReq;


    /* RAM */

    let ramRatio =
        pc.ram / game.rec.ram;


    if (ramRatio > 1.25)
        ramRatio = 1.25;


    /* VRAM */

    let vramRatio =
        pc.vram / game.rec.vram;


    if (game.rec.vram === 0)
        vramRatio = 1;

    if (vramRatio > 1.25)
        vramRatio = 1.25;


    /* STORAGE */

    const storageEnough =
        pc.storage >= game.min.storage;


    /* OVERALL */

    const hardwareRatio =
        (
            gpuRatio * .55 +
            cpuRatio * .25 +
            ramRatio * .12 +
            vramRatio * .08
        );


    /* BASE FPS */

    let fps =
        game.baseFPS * hardwareRatio;


    /* RESOLUTION */

    const resolutionMultiplier = {

        720: 1.25,
        900: 1.10,
        1080: 1,
        1440: .72,
        2160: .42

    };


    fps *=
        resolutionMultiplier[
            resolution.value
        ];


    /* GRAPHICS PRESET */

    const presetMultiplier = {

        verylow: 1.35,
        low: 1.15,
        medium: 1,
        high: .78,
        ultra: .62

    };


    fps *=
        presetMultiplier[
            preset.value
        ];


    fps =
        Math.max(
            5,
            Math.min(
                Math.round(fps),
                240
            )
        );


    /* STATUS */

    let status;


    if (
        !storageEnough ||
        hardwareRatio < .45
    ) {

        status = "danger";

    } else if (
        hardwareRatio < .75
    ) {

        status = "warning";

    } else if (
        hardwareRatio < 1
    ) {

        status = "playable";

    } else {

        status = "good";

    }


    showResult(
        status,
        fps,
        game,
        cpuRatio,
        gpuRatio,
        ramRatio,
        vramRatio,
        storageEnough
    );

}


/* =========================================
   RESULT UI
   ========================================= */

function showResult(
    status,
    fps,
    game,
    cpuRatio,
    gpuRatio,
    ramRatio,
    vramRatio,
    storageEnough
) {

    resultPanel.classList.remove(
        "hidden",
        "warning",
        "danger"
    );


    const icon =
        document.getElementById("resultStatus");

    const title =
        document.getElementById("resultTitle");

    const text =
        document.getElementById("resultText");


    if (status === "good") {

        title.textContent =
            "Excellent — Your PC Can Run This";

        text.textContent =
            `${game.name} should run comfortably with your selected settings.`;

        icon.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';

    }

    else if (status === "playable") {

        title.textContent =
            "Playable";

        text.textContent =
            `${game.name} should run, but lowering some settings may improve stability.`;

        icon.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }

    else if (status === "warning") {

        resultPanel.classList.add("warning");

        title.textContent =
            "Low Settings Recommended";

        text.textContent =
            `Your PC is below the recommended target. Try lower graphics settings.`;

        icon.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';

    }

    else {

        resultPanel.classList.add("danger");

        title.textContent =
            "Your PC May Struggle";

        text.textContent =
            storageEnough
                ? `Your hardware is below the expected performance target.`
                : `You do not have enough free storage for this game.`;

        icon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

    }


    document.getElementById("fpsValue")
        .textContent = fps;

    document.getElementById("fpsRange")
        .textContent =
        `${resolution.value}p • ${preset.options[preset.selectedIndex].text}`;


    document.getElementById("recommendedSettings")
        .textContent =
        getRecommendedPreset(
            gpuRatio,
            cpuRatio
        );


    document.getElementById("resolutionText")
        .textContent =
        `${resolution.value}p`;


    /* Scores */

    setScore(
        "cpuScoreText",
        "cpuBar",
        cpuRatio
    );

    setScore(
        "gpuScoreText",
        "gpuBar",
        gpuRatio
    );

    setScore(
        "ramScoreText",
        "ramBar",
        ramRatio
    );

    setScore(
        "vramScoreText",
        "vramBar",
        vramRatio
    );


    document.getElementById("gameAnalysisName")
        .textContent = game.name;


    componentScores.classList.remove(
        "hidden"
    );


    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function setScore(
    textId,
    barId,
    ratio
) {

    const percentage =
        Math.max(
            0,
            Math.min(
                Math.round(ratio * 100),
                100
            )
        );


    document.getElementById(textId)
        .textContent =
        `${percentage}%`;

    document.getElementById(barId)
        .style.width =
        `${percentage}%`;

}


function getRecommendedPreset(
    gpuRatio,
    cpuRatio
) {

    const score =
        Math.min(
            gpuRatio,
            cpuRatio
        );


    if (score >= 1.45)
        return "Ultra";

    if (score >= 1.15)
        return "High";

    if (score >= .9)
        return "Medium";

    if (score >= .65)
        return "Low";

    return "Very Low";

}


/* =========================================
   QUICK CHECK
   ========================================= */

quickBtn.addEventListener("click", () => {

    const pc = getPc();

    if (!pc) {

        showToast(
            "Save your PC specs first"
        );

        document
            .getElementById("checker")
            .scrollIntoView({
                behavior: "smooth"
            });

        return;

    }


    if (!gameSelect.value) {

        showToast(
            "Choose a game first"
        );

        return;

    }


    cpu.value = pc.cpu;
    gpu.value = pc.gpu;
    ram.value = pc.ram;
    vram.value = pc.vram;
    storage.value = pc.storage;

    calculatePerformance();

});


/* =========================================
   CHECK BUTTON
   ========================================= */

checkBtn.addEventListener(
    "click",
    calculatePerformance
);


/* =========================================
   UPGRADE ADVISOR
   ========================================= */

function updateUpgradeAdvisor() {

    const pc = getPc();

    const title =
        document.getElementById("upgradeTitle");

    const text =
        document.getElementById("upgradeText");


    if (!pc) {

        title.textContent =
            "Save your PC first";

        text.textContent =
            "Enter your hardware above and save it to get an upgrade recommendation.";

        return;

    }


    const cpuScore =
        CPUs[pc.cpu]?.score || 0;

    const gpuScore =
        GPUs[pc.gpu]?.score || 0;


    let upgrade;
    let explanation;


    if (pc.ram < 16) {

        upgrade = "RAM → 16 GB";

        explanation =
            "Increasing RAM to 16 GB is the most useful general upgrade for modern gaming.";

    }

    else if (gpuScore < 55) {

        upgrade = "GPU";

        explanation =
            "Your graphics card is likely to be the biggest gaming performance bottleneck.";

    }

    else if (cpuScore < 50) {

        upgrade = "CPU";

        explanation =
            "Your processor may limit performance in newer CPU-heavy games.";

    }

    else if (pc.vram < 4) {

        upgrade = "GPU with 4 GB+ VRAM";

        explanation =
            "More VRAM can help with modern textures and higher graphics settings.";

    }

    else {

        upgrade = "You're in good shape";

        explanation =
            "Your selected hardware is reasonably balanced. Upgrade only when a game requires it.";

    }


    title.textContent = upgrade;
    text.textContent = explanation;

}


/* =========================================
   THEME
   ========================================= */

const themeBtn =
    document.getElementById("themeBtn");


function loadTheme() {

    const theme =
        localStorage.getItem(
            "runmygame-theme"
        );


    if (theme === "light") {

        document.body.classList.add("light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const light =
        document.body.classList.contains("light");


    localStorage.setItem(
        "runmygame-theme",
        light ? "light" : "dark"
    );


    themeBtn.innerHTML =
        light
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

});


/* =========================================
   MOBILE MENU
   ========================================= */

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");


menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const icon =
        menuBtn.querySelector("i");


    if (navLinks.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


navLinks.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            const icon =
                menuBtn.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });


/* =========================================
   TOAST
   ========================================= */

let toastTimer;


function showToast(message) {

    toastText.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* =========================================
   ACTIVE NAV
   ========================================= */

const sections =
    document.querySelectorAll("section[id]");

const navItems =
    document.querySelectorAll(".nav-links a");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top =
            section.offsetTop - 130;

        if (window.scrollY >= top) {

            current =
                section.getAttribute("id");

        }

    });


    navItems.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================
   INITIALIZE
   ========================================= */

populateGameSelect();

renderGames();

loadTheme();

loadPc();

updateUpgradeAdvisor();

document.getElementById("heroGameCount")
    .textContent =
    `${games.length}+`;

console.log(
    "🎮 RunMyGame loaded successfully."
);
