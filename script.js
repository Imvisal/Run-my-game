/* =========================================
   RUNMYGAME - SCRIPT.JS
   ========================================= */

// ===============================
// ELEMENTS
// ===============================

const checkerForm = document.getElementById("checkerForm");

const cpuSelect = document.getElementById("cpu");
const gpuSelect = document.getElementById("gpu");
const ramSelect = document.getElementById("ram");
const vramSelect = document.getElementById("vram");
const gameSelect = document.getElementById("game");

const resultBox = document.getElementById("resultBox");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const fpsResult = document.getElementById("fpsResult");
const settingsResult = document.getElementById("settingsResult");

const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");


// ===============================
// HARDWARE SCORES
// ===============================

const cpuScores = {

    i3_4: 25,
    i5_4: 40,
    i5_6: 50,
    i5_8: 65,
    i7_8: 75,

    ryzen3: 45,
    ryzen5: 65,
    ryzen7: 80

};


const gpuScores = {

    igpu: 10,

    gtx750: 25,
    gtx950: 35,
    gtx960: 42,
    gtx1050: 48,
    gtx1060: 62,
    gtx1650: 58,
    gtx1660: 72,

    rtx2060: 82,
    rtx3060: 92,
    rtx4060: 100

};


// ===============================
// GAME REQUIREMENTS
// ===============================

const games = {

    gta5: {

        name: "Grand Theft Auto V",

        cpu: 35,
        gpu: 40,
        ram: 8,
        vram: 2,

        baseFPS: 75,

        lowFPS: 55,
        mediumFPS: 45,
        highFPS: 30

    },


    gta4: {

        name: "Grand Theft Auto IV",

        cpu: 30,
        gpu: 30,
        ram: 4,
        vram: 1,

        baseFPS: 70,

        lowFPS: 55,
        mediumFPS: 45,
        highFPS: 30

    },


    rdr2: {

        name: "Red Dead Redemption 2",

        cpu: 55,
        gpu: 65,
        ram: 12,
        vram: 4,

        baseFPS: 65,

        lowFPS: 40,
        mediumFPS: 30,
        highFPS: 22

    },


    farcry4: {

        name: "Far Cry 4",

        cpu: 35,
        gpu: 40,
        ram: 8,
        vram: 2,

        baseFPS: 70,

        lowFPS: 55,
        mediumFPS: 45,
        highFPS: 30

    },


    farcry6: {

        name: "Far Cry 6",

        cpu: 60,
        gpu: 65,
        ram: 12,
        vram: 4,

        baseFPS: 55,

        lowFPS: 38,
        mediumFPS: 28,
        highFPS: 20

    },


    nfs_mw: {

        name: "Need for Speed: Most Wanted (2005)",

        cpu: 15,
        gpu: 15,
        ram: 2,
        vram: 1,

        baseFPS: 120,

        lowFPS: 100,
        mediumFPS: 80,
        highFPS: 60

    },


    minecraft: {

        name: "Minecraft",

        cpu: 25,
        gpu: 25,
        ram: 4,
        vram: 1,

        baseFPS: 100,

        lowFPS: 80,
        mediumFPS: 60,
        highFPS: 40

    },


    valorant: {

        name: "Valorant",

        cpu: 20,
        gpu: 15,
        ram: 4,
        vram: 1,

        baseFPS: 150,

        lowFPS: 130,
        mediumFPS: 110,
        highFPS: 80

    },


    cs2: {

        name: "Counter-Strike 2",

        cpu: 45,
        gpu: 45,
        ram: 8,
        vram: 2,

        baseFPS: 90,

        lowFPS: 65,
        mediumFPS: 50,
        highFPS: 35

    }

};


// ===============================
// CHECK PC
// ===============================

checkerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const cpu = cpuSelect.value;
    const gpu = gpuSelect.value;
    const ram = Number(ramSelect.value);
    const vram = Number(vramSelect.value);
    const gameKey = gameSelect.value;

    if (!cpu || !gpu || !ram || !gameKey) {

        alert("Please select all your PC specifications.");

        return;

    }


    const game = games[gameKey];

    if (!game) {

        alert("Game data not found.");

        return;

    }


    const cpuScore = cpuScores[cpu];
    const gpuScore = gpuScores[gpu];


    // ===============================
    // HARDWARE SCORE
    // ===============================

    let hardwareScore =
        (cpuScore * 0.35) +
        (gpuScore * 0.65);


    // ===============================
    // REQUIREMENT SCORE
    // ===============================

    let requirementScore =
        (game.cpu * 0.35) +
        (game.gpu * 0.65);


    // ===============================
    // RAM CHECK
    // ===============================

    let ramMultiplier = 1;

    if (ram < game.ram) {

        ramMultiplier = 0.65;

    } else if (ram === game.ram) {

        ramMultiplier = 0.9;

    } else if (ram >= game.ram * 2) {

        ramMultiplier = 1.05;

    }


    // ===============================
    // VRAM CHECK
    // ===============================

    let vramMultiplier = 1;

    if (vram < game.vram) {

        vramMultiplier = 0.7;

    } else if (vram === game.vram) {

        vramMultiplier = 0.95;

    } else if (vram >= game.vram * 2) {

        vramMultiplier = 1.05;

    }


    hardwareScore *= ramMultiplier;
    hardwareScore *= vramMultiplier;


    // ===============================
    // COMPATIBILITY RATIO
    // ===============================

    const ratio = hardwareScore / requirementScore;


    // ===============================
    // FPS CALCULATION
    // ===============================

    let fps;
    let settings;
    let status;


    if (ratio >= 1.35) {

        fps = game.baseFPS + 15;
        settings = "High";
        status = "excellent";

    }

    else if (ratio >= 1.05) {

        fps = game.mediumFPS + 10;
        settings = "High / Medium";
        status = "good";

    }

    else if (ratio >= 0.85) {

        fps = game.mediumFPS;
        settings = "Medium";
        status = "playable";

    }

    else if (ratio >= 0.65) {

        fps = game.lowFPS;
        settings = "Low";
        status = "warning";

    }

    else {

        fps = Math.max(15, Math.round(game.lowFPS * ratio));
        settings = "Very Low";
        status = "danger";

    }


    // ===============================
    // FPS LIMIT
    // ===============================

    fps = Math.round(fps);

    if (fps > 200) {
        fps = 200;
    }


    // ===============================
    // RESULT UI
    // ===============================

    resultBox.classList.remove(
        "hidden",
        "warning",
        "danger"
    );


    if (status === "excellent") {

        resultIcon.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';

        resultTitle.textContent =
            "Excellent — Your PC Can Run This";

        resultDescription.textContent =
            `${game.name} should run smoothly on your PC.`;

    }


    else if (status === "good") {

        resultIcon.innerHTML =
            '<i class="fa-solid fa-check"></i>';

        resultTitle.textContent =
            "Your PC Can Run This Game";

        resultDescription.textContent =
            `${game.name} should be playable with good performance.`;

    }


    else if (status === "playable") {

        resultIcon.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';

        resultTitle.textContent =
            "Playable";

        resultDescription.textContent =
            `${game.name} should run, but Medium settings are recommended.`;

    }


    else if (status === "warning") {

        resultBox.classList.add("warning");

        resultIcon.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';

        resultTitle.textContent =
            "Playable With Low Settings";

        resultDescription.textContent =
            `Your PC is below the recommended hardware. Try Low settings.`;

    }


    else {

        resultBox.classList.add("danger");

        resultIcon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

        resultTitle.textContent =
            "Your PC May Struggle";

        resultDescription.textContent =
            `Your hardware is below the minimum target for ${game.name}.`;

    }


    fpsResult.textContent = fps;

    settingsResult.textContent = settings;


    // ===============================
    // SCROLL TO RESULT
    // ===============================

    setTimeout(() => {

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

});


// ===============================
// GAME CARD BUTTONS
// ===============================

const gameButtons =
    document.querySelectorAll(".game-check");


gameButtons.forEach(button => {

    button.addEventListener("click", function () {

        const game = this.dataset.game;

        gameSelect.value = game;

        document
            .getElementById("checker")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ===============================
// MOBILE MENU
// ===============================

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


// ===============================
// DARK / LIGHT MODE
// ===============================

const savedTheme =
    localStorage.getItem("runmygame-theme");


if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    const isLight =
        document.body.classList.contains("light-mode");


    if (isLight) {

        localStorage.setItem(
            "runmygame-theme",
            "light"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem(
            "runmygame-theme",
            "dark"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});


// ===============================
// ACTIVE NAVIGATION
// ===============================

const sections =
    document.querySelectorAll("section[id]");

const navItems =
    document.querySelectorAll(".nav-links a");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

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


// ===============================
// INITIAL MESSAGE
// ===============================

console.log(
    "🎮 RunMyGame loaded successfully!"
);
