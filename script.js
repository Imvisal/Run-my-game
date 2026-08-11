/* =========================================
   RUNMYGAME
   LOCAL DATABASE VERSION
   ========================================= */


let games = [];
let cpus = [];
let gpus = [];

let selectedGame = null;
let selectedCPU = null;
let selectedGPU = null;


/* =========================================
   DOM
   ========================================= */

const cpuSearch =
    document.getElementById("cpuSearch");

const gpuSearch =
    document.getElementById("gpuSearch");

const gameSearch =
    document.getElementById("gameSearch");

const cpuSuggestions =
    document.getElementById("cpuSuggestions");

const gpuSuggestions =
    document.getElementById("gpuSuggestions");

const gameSuggestions =
    document.getElementById("gameSuggestions");

const selectedGameBox =
    document.getElementById("selectedGame");

const gamesGrid =
    document.getElementById("gamesGrid");

const libraryInput =
    document.getElementById("libraryInput");

const checkBtn =
    document.getElementById("checkBtn");

const savePC =
    document.getElementById("savePC");

const ram =
    document.getElementById("ram");

const vram =
    document.getElementById("vram");

const result =
    document.getElementById("result");

const comparison =
    document.getElementById("comparison");

const comparisonRows =
    document.getElementById("comparisonRows");

const modal =
    document.getElementById("modal");

const modalBg =
    document.getElementById("modalBg");

const closeModal =
    document.getElementById("closeModal");

const modalCheck =
    document.getElementById("modalCheck");

const themeBtn =
    document.getElementById("themeBtn");

const menuBtn =
    document.getElementById("menuBtn");

const nav =
    document.getElementById("nav");


/* =========================================
   LOAD DATABASE
   ========================================= */

async function loadDatabase() {

    try {

        const [
            gamesResponse,
            cpusResponse,
            gpusResponse
        ] = await Promise.all([

            fetch("data/games.json"),

            fetch("data/cpus.json"),

            fetch("data/gpus.json")

        ]);


        if (
            !gamesResponse.ok ||
            !cpusResponse.ok ||
            !gpusResponse.ok
        ) {

            throw new Error(
                "Database files could not be loaded."
            );

        }


        games =
            await gamesResponse.json();

        cpus =
            await cpusResponse.json();

        gpus =
            await gpusResponse.json();


        renderGames(games);

        console.log(
            `Loaded ${games.length} games, ${cpus.length} CPUs, ${gpus.length} GPUs`
        );


    } catch (error) {

        console.error(error);

        gamesGrid.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Database could not be loaded.
                    Run the website through a local server.
                </p>
            </div>
        `;

    }

}


/* =========================================
   SEARCH HELPER
   ========================================= */

function setupSearch(
    input,
    box,
    data,
    type
) {

    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                box.classList.remove(
                    "active"
                );

                return;

            }


            const results =
                data
                    .filter(item =>
                        item.name
                            .toLowerCase()
                            .includes(query)
                    )
                    .slice(0, 10);


            box.innerHTML = "";


            if (!results.length) {

                box.innerHTML = `
                    <div class="suggestion">
                        No results found
                    </div>
                `;

                box.classList.add(
                    "active"
                );

                return;

            }


            results.forEach(item => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "suggestion";


                div.textContent =
                    item.name;


                div.addEventListener(
                    "click",
                    () => {

                        input.value =
                            item.name;


                        box.classList.remove(
                            "active"
                        );


                        if (type === "cpu") {

                            selectedCPU =
                                item;

                            updateHero();

                        }


                        if (type === "gpu") {

                            selectedGPU =
                                item;

                            updateHero();

                        }


                        if (type === "game") {

                            selectGame(item);

                        }

                    }
                );


                box.appendChild(div);

            });


            box.classList.add(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !input.contains(event.target) &&
                !box.contains(event.target)
            ) {

                box.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   SEARCH SETUP
   ========================================= */

setupSearch(
    cpuSearch,
    cpuSuggestions,
    cpus,
    "cpu"
);


setupSearch(
    gpuSearch,
    gpuSuggestions,
    gpus,
    "gpu"
);


setupSearch(
    gameSearch,
    gameSuggestions,
    games,
    "game"
);


/* =========================================
   SELECT GAME
   ========================================= */

function selectGame(game) {

    selectedGame =
        game;


    selectedGameBox.innerHTML = `

        <div class="selected-game-content">

            <img
                src="${game.image}"
                alt="${escapeHTML(game.name)}"
            >

            <div>

                <h3>
                    ${escapeHTML(game.name)}
                </h3>

                <p>
                    ${game.year}
                    •
                    ${escapeHTML(game.genre)}
                </p>

                <p>
                    Game selected.
                    Click CHECK MY PC below.
                </p>

            </div>

        </div>

    `;


    updateHero();


    document
        .getElementById("checker")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


/* =========================================
   HERO UPDATE
   ========================================= */

function updateHero() {

    document.getElementById(
        "heroPcName"
    ).textContent =
        selectedCPU && selectedGPU
            ? "Gaming PC"
            : "Not configured";


    document.getElementById(
        "heroCpu"
    ).textContent =
        selectedCPU
            ? selectedCPU.name
            : "Not set";


    document.getElementById(
        "heroGpu"
    ).textContent =
        selectedGPU
            ? selectedGPU.name
            : "Not set";


    document.getElementById(
        "heroRam"
    ).textContent =
        `${ram.value} GB`;


    document.getElementById(
        "heroVram"
    ).textContent =
        `${vram.value} GB`;

}


/* =========================================
   SAVE PC
   ========================================= */

savePC.addEventListener(
    "click",
    () => {

        if (
            !selectedCPU ||
            !selectedGPU
        ) {

            alert(
                "Please select your CPU and GPU first."
            );

            return;

        }


        const pc = {

            cpu:
                selectedCPU,

            gpu:
                selectedGPU,

            ram:
                Number(ram.value),

            vram:
                Number(vram.value)

        };


        localStorage.setItem(
            "runmygamePC",
            JSON.stringify(pc)
        );


        alert(
            "Your PC has been saved."
        );

    }
);


/* =========================================
   LOAD SAVED PC
   ========================================= */

function loadSavedPC() {

    const saved =
        localStorage.getItem(
            "runmygamePC"
        );


    if (!saved)
        return;


    try {

        const pc =
            JSON.parse(saved);


        selectedCPU =
            pc.cpu;

        selectedGPU =
            pc.gpu;


        ram.value =
            pc.ram;


        vram.value =
            pc.vram;


        cpuSearch.value =
            selectedCPU.name;


        gpuSearch.value =
            selectedGPU.name;


        updateHero();


    } catch (error) {

        console.error(error);

    }

}


/* =========================================
   CHECK PC
   ========================================= */

checkBtn.addEventListener(
    "click",
    () => {

        if (!selectedGame) {

            alert(
                "Please select a game first."
            );

            return;

        }


        if (
            !selectedCPU ||
            !selectedGPU
        ) {

            alert(
                "Please select your CPU and GPU."
            );

            return;

        }


        checkPerformance();

    }
);


/* =========================================
   PERFORMANCE CHECK
   ========================================= */

function checkPerformance() {

    const minimum =
        selectedGame.minimum;


    const recommended =
        selectedGame.recommended;


    const userRAM =
        Number(ram.value);


    const userVRAM =
        Number(vram.value);


    /*
       CPU score
    */

    const cpuScore =
        compareCPU(
            selectedCPU,
            minimum.cpu,
            recommended.cpu
        );


    /*
       GPU score
    */

    const gpuScore =
        compareGPU(
            selectedGPU,
            minimum.gpu,
            recommended.gpu
        );


    const ramScore =
        userRAM >= recommended.ram
            ? 100
            : userRAM >= minimum.ram
                ? 70
                : 30;


    const vramScore =
        userVRAM >= recommended.vram
            ? 100
            : userVRAM >= minimum.vram
                ? 70
                : 30;


    const score =
        (
            cpuScore * .30 +
            gpuScore * .40 +
            ramScore * .20 +
            vramScore * .10
        );


    let status;


    if (score >= 85) {

        status = "good";

    }

    else if (score >= 65) {

        status = "playable";

    }

    else {

        status = "danger";

    }


    showResult(
        status,
        score,
        cpuScore,
        gpuScore,
        ramScore,
        vramScore
    );

}


/* =========================================
   CPU COMPARISON
   ========================================= */

function compareCPU(
    userCPU,
    minimumCPU,
    recommendedCPU
) {

    const userScore =
        getCPUScore(
            userCPU
        );


    const minScore =
        findDatabaseScore(
            minimumCPU,
            cpus
        );


    const recScore =
        findDatabaseScore(
            recommendedCPU,
            cpus
        );


    if (
        minScore === null ||
        recScore === null
    ) {

        return 70;

    }


    if (
        userScore >= recScore
    ) {

        return 100;

    }


    if (
        userScore >= minScore
    ) {

        return 70;

    }


    return 25;

}


/* =========================================
   GPU COMPARISON
   ========================================= */

function compareGPU(
    userGPU,
    minimumGPU,
    recommendedGPU
) {

    const userScore =
        getGPUScore(
            userGPU
        );


    const minScore =
        findDatabaseScore(
            minimumGPU,
            gpus
        );


    const recScore =
        findDatabaseScore(
            recommendedGPU,
            gpus
        );


    if (
        minScore === null ||
        recScore === null
    ) {

        return 70;

    }


    if (
        userScore >= recScore
    ) {

        return 100;

    }


    if (
        userScore >= minScore
    ) {

        return 70;

    }


    return 25;

}


/* =========================================
   DATABASE SCORE
   ========================================= */

function getCPUScore(cpu) {

    return Number(
        cpu.performance ||
        (
            cpu.cores *
            cpu.threads
        )
    );

}


function getGPUScore(gpu) {

    return Number(
        gpu.performance ||
        (
            gpu.vram * 100
        )
    );

}


/* =========================================
   FIND REQUIREMENT
   ========================================= */

function findDatabaseScore(
    requirement,
    database
) {

    if (!requirement)
        return null;


    const req =
        requirement
            .toLowerCase();


    const item =
        database.find(
            element =>
                element.name
                    .toLowerCase()
                    .includes(
                        req
                    ) ||
                req.includes(
                    element.name
                        .toLowerCase()
                )
        );


    if (!item)
        return null;


    return database === cpus
        ? getCPUScore(item)
        : getGPUScore(item);

}


/* =========================================
   RESULT
   ========================================= */

function showResult(
    status,
    score,
    cpuScore,
    gpuScore,
    ramScore,
    vramScore
) {

    result.className =
        "result";


    result.classList.add(
        status
    );


    result.classList.remove(
        "hidden"
    );


    const icon =
        document.getElementById(
            "resultIcon"
        );


    const title =
        document.getElementById(
            "resultTitle"
        );


    const text =
        document.getElementById(
            "resultText"
        );


    if (status === "good") {

        icon.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';

        title.textContent =
            "Your PC Can Run It";

        text.textContent =
            "Your selected hardware meets or exceeds the available requirements.";

    }

    else if (status === "playable") {

        icon.innerHTML =
            '<i class="fa-solid fa-check"></i>';

        title.textContent =
            "Likely Playable";

        text.textContent =
            "Your PC should be able to run this game, but lower settings may be needed.";

    }

    else {

        icon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

        title.textContent =
            "Not Recommended";

        text.textContent =
            "One or more major components are below the game's minimum requirements.";

    }


    const estimatedFPS =
        calculateFPS(
            score
        );


    document.getElementById(
        "fps"
    ).textContent =
        estimatedFPS;


    comparison.classList.remove(
        "hidden"
    );


    comparisonRows.innerHTML = `

        ${createCompareRow(
            "CPU",
            cpuScore
        )}

        ${createCompareRow(
            "GPU",
            gpuScore
        )}

        ${createCompareRow(
            "RAM",
            ramScore
        )}

        ${createCompareRow(
            "VRAM",
            vramScore
        )}

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================
   COMPARISON ROW
   ========================================= */

function createCompareRow(
    name,
    score
) {

    const good =
        score >= 70;


    return `

        <div class="compare-row">

            <span>
                ${name}
            </span>

            <strong
                class="${good ? "good" : "bad"}">

                ${good ? "PASS" : "BELOW"}

            </strong>

            <span>
                ${Math.round(score)}%
            </span>

        </div>

    `;

}


/* =========================================
   FPS
   ========================================= */

function calculateFPS(score) {

    if (score >= 95)
        return 80;

    if (score >= 85)
        return 65;

    if (score >= 75)
        return 55;

    if (score >= 65)
        return 45;

    if (score >= 50)
        return 30;

    return 20;

}


/*
    NOTE:

    FPS is an estimate.

    Exact FPS requires real benchmark
    data for the specific CPU + GPU +
    game + resolution + graphics settings.
*/


/* =========================================
   RENDER GAMES
   ========================================= */

function renderGames(list) {

    gamesGrid.innerHTML = "";


    if (!list.length) {

        gamesGrid.innerHTML = `
            <div class="empty">
                No games found.
            </div>
        `;

        return;

    }


    list.forEach(game => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "game-card";


        card.innerHTML = `

            <img
                src="${game.image}"
                alt="${escapeHTML(game.name)}"
                loading="lazy"
            >

            <div class="game-card-content">

                <h3>
                    ${escapeHTML(game.name)}
                </h3>

                <p>
                    ${game.year}
                    •
                    ${escapeHTML(game.genre)}
                </p>

                <button>
                    View Requirements
                </button>

            </div>

        `;


        card
            .querySelector("button")
            .addEventListener(
                "click",
                () => openGameModal(game)
            );


        gamesGrid.appendChild(
            card
        );

    });

}


/* =========================================
   LIBRARY SEARCH
   ========================================= */

libraryInput.addEventListener(
    "input",
    () => {

        const query =
            libraryInput.value
                .toLowerCase()
                .trim();


        const filtered =
            games.filter(
                game =>
                    game.name
                        .toLowerCase()
                        .includes(query)
            );


        renderGames(
            filtered
        );

    }
);


/* =========================================
   MODAL
   ========================================= */

function openGameModal(game) {

    document.getElementById(
        "modalImage"
    ).src =
        game.image;


    document.getElementById(
        "modalTitle"
    ).textContent =
        game.name;


    document.getElementById(
        "modalGenre"
    ).textContent =
        `${game.year} • ${game.genre}`;


    document.getElementById(
        "modalDescription"
    ).textContent =
        "PC system requirements for this game.";


    document.getElementById(
        "modalMinimum"
    ).innerHTML = `

        CPU: ${escapeHTML(game.minimum.cpu)}
        <br>

        GPU: ${escapeHTML(game.minimum.gpu)}
        <br>

        RAM: ${game.minimum.ram} GB
        <br>

        VRAM: ${game.minimum.vram} GB

    `;


    document.getElementById(
        "modalRecommended"
    ).innerHTML = `

        CPU: ${escapeHTML(game.recommended.cpu)}
        <br>

        GPU: ${escapeHTML(game.recommended.gpu)}
        <br>

        RAM: ${game.recommended.ram} GB
        <br>

        VRAM: ${game.recommended.vram} GB

    `;


    selectedGame =
        game;


    modal.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function hideModal() {

    modal.classList.add(
        "hidden"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


closeModal.addEventListener(
    "click",
    hideModal
);


modalBg.addEventListener(
    "click",
    hideModal
);


modalCheck.addEventListener(
    "click",
    () => {

        hideModal();

        document
            .getElementById("checker")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   THEME
   ========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const light =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            "runmygameTheme",
            light
                ? "light"
                : "dark"
        );


        themeBtn.innerHTML =
            light
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';

    }
);


/* =========================================
   MOBILE MENU
   ========================================= */

menuBtn.addEventListener(
    "click",
    () => {

        nav.classList.toggle(
            "active"
        );

    }
);


/* =========================================
   ESCAPE HTML
   ========================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   START
   ========================================= */

const savedTheme =
    localStorage.getItem(
        "runmygameTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light"
    );

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


loadDatabase();

loadSavedPC();
