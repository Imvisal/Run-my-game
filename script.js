/* =========================================
   RUNMYGAME
   ========================================= */


let games = [];
let cpus = [];
let gpus = [];

let selectedCPU = null;
let selectedGPU = null;
let selectedGame = null;


/* =========================================
   ELEMENTS
   ========================================= */

const cpuInput =
    document.getElementById("cpuInput");

const gpuInput =
    document.getElementById("gpuInput");

const gameInput =
    document.getElementById("gameInput");


const cpuResults =
    document.getElementById("cpuResults");

const gpuResults =
    document.getElementById("gpuResults");

const gameResults =
    document.getElementById("gameResults");


const selectedCPUBox =
    document.getElementById("selectedCPU");

const selectedGPUBox =
    document.getElementById("selectedGPU");


const gameSelected =
    document.getElementById("gameSelected");


const ram =
    document.getElementById("ram");

const vram =
    document.getElementById("vram");


const gamesGrid =
    document.getElementById("gamesGrid");

const librarySearch =
    document.getElementById("librarySearch");


const checkBtn =
    document.getElementById("checkBtn");

const savePC =
    document.getElementById("savePC");


const result =
    document.getElementById("result");

const requirementsBox =
    document.getElementById("requirementsBox");

const comparison =
    document.getElementById("comparison");


/* =========================================
   LOAD DATABASE
   ========================================= */

async function loadData() {

    try {

        console.log("Loading database...");


        const gamesResponse =
            await fetch("./data/games.json");


        const cpusResponse =
            await fetch("./data/cpus.json");


        const gpusResponse =
            await fetch("./data/gpus.json");


        if (!gamesResponse.ok) {
            throw new Error(
                "games.json not found"
            );
        }


        if (!cpusResponse.ok) {
            throw new Error(
                "cpus.json not found"
            );
        }


        if (!gpusResponse.ok) {
            throw new Error(
                "gpus.json not found"
            );
        }


        games =
            await gamesResponse.json();


        cpus =
            await cpusResponse.json();


        gpus =
            await gpusResponse.json();


        console.log(
            "Games:",
            games.length
        );


        console.log(
            "CPUs:",
            cpus.length
        );


        console.log(
            "GPUs:",
            gpus.length
        );


        renderGames(games);


        console.log(
            "RunMyGame database loaded!"
        );


    }

    catch (error) {

        console.error(
            "Database error:",
            error
        );


        gamesGrid.innerHTML = `

            <div class="no-result">

                Database could not be loaded.

            </div>

        `;

    }

}


/* =========================================
   SEARCH FUNCTION
   ========================================= */

function searchDatabase(
    input,
    resultBox,
    database,
    selectFunction
) {

    input.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .trim()
                    .toLowerCase();


            resultBox.innerHTML = "";


            if (!search) {

                resultBox.classList.remove(
                    "show"
                );

                return;

            }


            const matches =
                database
                    .filter(item => {

                        if (!item.name) {
                            return false;
                        }


                        return item.name
                            .toLowerCase()
                            .includes(search);

                    })
                    .slice(0, 12);


            if (!matches.length) {

                resultBox.innerHTML = `

                    <div class="no-result">
                        No results found
                    </div>

                `;


                resultBox.classList.add(
                    "show"
                );


                return;

            }


            matches.forEach(item => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "result-item";


                div.textContent =
                    item.name;


                div.addEventListener(
                    "click",
                    function () {

                        selectFunction(item);


                        resultBox.classList.remove(
                            "show"
                        );

                    }
                );


                resultBox.appendChild(
                    div
                );

            });


            resultBox.classList.add(
                "show"
            );

        }
    );

}


/* =========================================
   CPU SEARCH
   ========================================= */

searchDatabase(
    cpuInput,
    cpuResults,
    cpus,
    selectCPU
);


/* =========================================
   GPU SEARCH
   ========================================= */

searchDatabase(
    gpuInput,
    gpuResults,
    gpus,
    selectGPU
);


/* =========================================
   GAME SEARCH
   ========================================= */

searchDatabase(
    gameInput,
    gameResults,
    games,
    selectGame
);


/* =========================================
   SELECT CPU
   ========================================= */

function selectCPU(cpu) {

    selectedCPU =
        cpu;


    cpuInput.value =
        cpu.name;


    selectedCPUBox.textContent =
        "✓ " + cpu.name;


    selectedCPUBox.style.color =
        "var(--green)";


    updatePCPreview();

}


/* =========================================
   SELECT GPU
   ========================================= */

function selectGPU(gpu) {

    selectedGPU =
        gpu;


    gpuInput.value =
        gpu.name;


    selectedGPUBox.textContent =
        "✓ " + gpu.name;


    selectedGPUBox.style.color =
        "var(--green)";


    updatePCPreview();

}


/* =========================================
   SELECT GAME
   ========================================= */

function selectGame(game) {

    selectedGame =
        game;


    gameInput.value =
        game.name;


    const image =
        game.image || "";


    gameSelected.innerHTML = `

        <div class="selected-game-content">

            <img
                src="${image}"
                alt="${escapeHTML(game.name)}"
                onerror="this.style.opacity='0'"
            >

            <div class="selected-game-info">

                <h3>
                    ${escapeHTML(game.name)}
                </h3>

                <p>
                    ${game.year || ""}
                </p>

                <p>
                    ${escapeHTML(
                        game.genre || "PC Game"
                    )}
                </p>

                <p>
                    Game selected ✓
                </p>

            </div>

        </div>

    `;


    updatePCPreview();

}


/* =========================================
   PC PREVIEW
   ========================================= */

function updatePCPreview() {

    const heroCPU =
        document.getElementById(
            "heroCPU"
        );


    const heroGPU =
        document.getElementById(
            "heroGPU"
        );


    const heroRAM =
        document.getElementById(
            "heroRAM"
        );


    const heroVRAM =
        document.getElementById(
            "heroVRAM"
        );


    const pcStatus =
        document.getElementById(
            "pcStatus"
        );


    heroCPU.textContent =
        selectedCPU
            ? selectedCPU.name
            : "Not set";


    heroGPU.textContent =
        selectedGPU
            ? selectedGPU.name
            : "Not set";


    heroRAM.textContent =
        ram.value + " GB";


    heroVRAM.textContent =
        vram.value + " GB";


    if (
        selectedCPU &&
        selectedGPU
    ) {

        pcStatus.textContent =
            "Gaming PC";

    }

    else {

        pcStatus.textContent =
            "Not configured";

    }

}


/* =========================================
   RAM / VRAM CHANGE
   ========================================= */

ram.addEventListener(
    "change",
    updatePCPreview
);


vram.addEventListener(
    "change",
    updatePCPreview
);


/* =========================================
   SAVE PC
   ========================================= */

savePC.addEventListener(
    "click",
    function () {

        if (!selectedCPU) {

            alert(
                "Please select a CPU."
            );

            return;

        }


        if (!selectedGPU) {

            alert(
                "Please select a GPU."
            );

            return;

        }


        const pc = {

            cpu: selectedCPU,

            gpu: selectedGPU,

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
            "Your PC has been saved!"
        );

    }
);


/* =========================================
   CHECK PC
   ========================================= */

checkBtn.addEventListener(
    "click",
    function () {

        if (!selectedCPU) {

            alert(
                "Select your CPU first."
            );

            return;

        }


        if (!selectedGPU) {

            alert(
                "Select your GPU first."
            );

            return;

        }


        if (!selectedGame) {

            alert(
                "Select a game first."
            );

            return;

        }


        checkGame();

    }
);


/* =========================================
   CHECK GAME
   ========================================= */

function checkGame() {

    const minimum =
        selectedGame.minimum || {};


    const recommended =
        selectedGame.recommended || {};


    const userRAM =
        Number(ram.value);


    const userVRAM =
        Number(vram.value);


    const cpuScore =
        compareCPU(
            selectedCPU,
            minimum.cpu,
            recommended.cpu
        );


    const gpuScore =
        compareGPU(
            selectedGPU,
            minimum.gpu,
            recommended.gpu
        );


    const ramScore =
        compareMemory(
            userRAM,
            Number(minimum.ram || 4),
            Number(recommended.ram || 8)
        );


    const vramScore =
        compareMemory(
            userVRAM,
            Number(minimum.vram || 1),
            Number(recommended.vram || 2)
        );


    const total =
        (
            cpuScore * .30 +
            gpuScore * .40 +
            ramScore * .20 +
            vramScore * .10
        );


    let status;


    if (total >= 85) {

        status = "good";

    }

    else if (total >= 65) {

        status = "playable";

    }

    else {

        status = "bad";

    }


    showResult(
        status,
        total,
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
    user,
    minimumName,
    recommendedName
) {

    const userScore =
        getCPUScore(user);


    const minimum =
        findCPU(
            minimumName
        );


    const recommended =
        findCPU(
            recommendedName
        );


    if (!minimum || !recommended) {

        return 70;

    }


    const minScore =
        getCPUScore(minimum);


    const recScore =
        getCPUScore(recommended);


    if (userScore >= recScore) {

        return 100;

    }


    if (userScore >= minScore) {

        return 70;

    }


    return 25;

}


/* =========================================
   GPU COMPARISON
   ========================================= */

function compareGPU(
    user,
    minimumName,
    recommendedName
) {

    const userScore =
        getGPUScore(user);


    const minimum =
        findGPU(
            minimumName
        );


    const recommended =
        findGPU(
            recommendedName
        );


    if (!minimum || !recommended) {

        return 70;

    }


    const minScore =
        getGPUScore(minimum);


    const recScore =
        getGPUScore(recommended);


    if (userScore >= recScore) {

        return 100;

    }


    if (userScore >= minScore) {

        return 70;

    }


    return 25;

}


/* =========================================
   MEMORY
   ========================================= */

function compareMemory(
    user,
    minimum,
    recommended
) {

    if (user >= recommended) {

        return 100;

    }


    if (user >= minimum) {

        return 70;

    }


    return 25;

}


/* =========================================
   CPU SCORE
   ========================================= */

function getCPUScore(cpu) {

    if (!cpu) {
        return 0;
    }


    if (
        cpu.performance !== undefined
    ) {

        return Number(
            cpu.performance
        );

    }


    const cores =
        Number(cpu.cores || 2);


    const threads =
        Number(
            cpu.threads ||
            cores
        );


    return (
        cores * 100 +
        threads * 50
    );

}


/* =========================================
   GPU SCORE
   ========================================= */

function getGPUScore(gpu) {

    if (!gpu) {
        return 0;
    }


    if (
        gpu.performance !== undefined
    ) {

        return Number(
            gpu.performance
        );

    }


    return (
        Number(gpu.vram || 1) * 100
    );

}


/* =========================================
   FIND CPU
   ========================================= */

function findCPU(name) {

    if (!name) {
        return null;
    }


    const search =
        name
            .toLowerCase()
            .trim();


    let found =
        cpus.find(
            cpu =>
                cpu.name
                    .toLowerCase()
                    .trim() === search
        );


    if (!found) {

        found =
            cpus.find(
                cpu =>
                    cpu.name
                        .toLowerCase()
                        .includes(search) ||
                    search.includes(
                        cpu.name
                            .toLowerCase()
                    )
            );

    }


    return found || null;

}


/* =========================================
   FIND GPU
   ========================================= */

function findGPU(name) {

    if (!name) {
        return null;
    }


    const search =
        name
            .toLowerCase()
            .trim();


    let found =
        gpus.find(
            gpu =>
                gpu.name
                    .toLowerCase()
                    .trim() === search
        );


    if (!found) {

        found =
            gpus.find(
                gpu =>
                    gpu.name
                        .toLowerCase()
                        .includes(search) ||
                    search.includes(
                        gpu.name
                            .toLowerCase()
                    )
            );

    }


    return found || null;

}


/* =========================================
   SHOW RESULT
   ========================================= */

function showResult(
    status,
    score,
    cpu,
    gpu,
    ramScore,
    vramScore
) {

    result.className =
        "result";


    result.classList.remove(
        "hidden"
    );


    result.classList.add(
        status
    );


    const icon =
        document.getElementById(
            "resultIcon"
        );


    const title =
        document.getElementById(
            "resultTitle"
        );


    const message =
        document.getElementById(
            "resultMessage"
        );


    if (status === "good") {

        icon.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';


        title.textContent =
            "Your PC Can Run It";


        message.textContent =
            "Your hardware meets the recommended requirements.";

    }


    else if (status === "playable") {

        icon.innerHTML =
            '<i class="fa-solid fa-check"></i>';


        title.textContent =
            "Likely Playable";


        message.textContent =
            "Your PC should run this game. You may need lower graphics settings.";

    }


    else {

        icon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';


        title.textContent =
            "Not Recommended";


        message.textContent =
            "Your hardware may be below the game's minimum requirements.";

    }


    document.getElementById(
        "fps"
    ).textContent =
        estimateFPS(score);


    showComparison(
        cpu,
        gpu,
        ramScore,
        vramScore
    );


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================
   FPS
   ========================================= */

function estimateFPS(score) {

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


/* =========================================
   COMPARISON
   ========================================= */

function showComparison(
    cpu,
    gpu,
    ramScore,
    vramScore
) {

    requirementsBox.classList.remove(
        "hidden"
    );


    comparison.innerHTML = `

        ${comparisonRow(
            "CPU",
            cpu
        )}

        ${comparisonRow(
            "GPU",
            gpu
        )}

        ${comparisonRow(
            "RAM",
            ramScore
        )}

        ${comparisonRow(
            "VRAM",
            vramScore
        )}

    `;

}


/* =========================================
   COMPARISON ROW
   ========================================= */

function comparisonRow(
    name,
    score
) {

    const pass =
        score >= 70;


    return `

        <div class="requirement-row">

            <span>
                ${name}
            </span>

            <strong
                class="${pass ? "pass" : "fail"}"
            >
                ${pass ? "PASS" : "BELOW"}
            </strong>

            <span>
                ${Math.round(score)}%
            </span>

        </div>

    `;

}


/* =========================================
   GAME LIBRARY
   ========================================= */

function renderGames(list) {

    gamesGrid.innerHTML = "";


    if (!list.length) {

        gamesGrid.innerHTML = `

            <div class="no-result">
                No games found.
            </div>

        `;

        return;

    }


    list.forEach(game => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "game-card";


        card.innerHTML = `

            <img
                src="${game.image || ""}"
                alt="${escapeHTML(game.name)}"
                loading="lazy"
                onerror="this.style.opacity='0'"
            >


            <div class="game-card-content">

                <h3>
                    ${escapeHTML(game.name)}
                </h3>

                <p>
                    ${game.year || ""}
                    ${
                        game.genre
                            ? " • " +
                              escapeHTML(
                                  game.genre
                              )
                            : ""
                    }
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
                function () {

                    openModal(game);

                }
            );


        gamesGrid.appendChild(
            card
        );

    });

}


/* =========================================
   LIBRARY SEARCH
   ========================================= */

librarySearch.addEventListener(
    "input",
    function () {

        const search =
            this.value
                .trim()
                .toLowerCase();


        const filtered =
            games.filter(
                game =>
                    game.name
                        .toLowerCase()
                        .includes(search)
            );


        renderGames(
            filtered
        );

    }
);


/* =========================================
   MODAL
   ========================================= */

function openModal(game) {

    selectedGame =
        game;


    document.getElementById(
        "modalImage"
    ).src =
        game.image || "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        game.name;


    document.getElementById(
        "modalMeta"
    ).textContent =
        `${game.year || ""} • ${game.genre || "PC Game"}`;


    const minimum =
        game.minimum || {};


    const recommended =
        game.recommended || {};


    document.getElementById(
        "minimumText"
    ).innerHTML = `

        CPU:
        ${escapeHTML(
            minimum.cpu || "Unknown"
        )}

        <br>

        GPU:
        ${escapeHTML(
            minimum.gpu || "Unknown"
        )}

        <br>

        RAM:
        ${minimum.ram || "?"} GB

        <br>

        VRAM:
        ${minimum.vram || "?"} GB

    `;


    document.getElementById(
        "recommendedText"
    ).innerHTML = `

        CPU:
        ${escapeHTML(
            recommended.cpu || "Unknown"
        )}

        <br>

        GPU:
        ${escapeHTML(
            recommended.gpu || "Unknown"
        )}

        <br>

        RAM:
        ${recommended.ram || "?"} GB

        <br>

        VRAM:
        ${recommended.vram || "?"} GB

    `;


    document.getElementById(
        "modal"
    ).classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================
   CLOSE MODAL
   ========================================= */

function closeGameModal() {

    document.getElementById(
        "modal"
    ).classList.add(
        "hidden"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


document.getElementById(
    "closeModal"
).addEventListener(
    "click",
    closeGameModal
);


document.getElementById(
    "modalOverlay"
).addEventListener(
    "click",
    closeGameModal
);


document.getElementById(
    "modalCheck"
).addEventListener(
    "click",
    function () {

        closeGameModal();


        document
            .getElementById(
                "checker"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   THEME
   ========================================= */

document.getElementById(
    "themeBtn"
).addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light"
        );


        const light =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            "theme",
            light
                ? "light"
                : "dark"
        );


        this.innerHTML =
            light
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';

    }
);


/* =========================================
   MOBILE MENU
   ========================================= */

document.getElementById(
    "menuBtn"
).addEventListener(
    "click",
    function () {

        document
            .getElementById(
                "navigation"
            )
            .classList.toggle(
                "active"
            );

    }
);


/* =========================================
   CLOSE SEARCH RESULTS
   ========================================= */

document.addEventListener(
    "click",
    function (event) {

        const boxes = [
            cpuResults,
            gpuResults,
            gameResults
        ];


        const inputs = [
            cpuInput,
            gpuInput,
            gameInput
        ];


        boxes.forEach(
            (box, index) => {

                if (
                    !inputs[index]
                        .contains(
                            event.target
                        ) &&
                    !box.contains(
                        event.target
                    )
                ) {

                    box.classList.remove(
                        "show"
                    );

                }

            }
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
   LOAD SAVED PC
   ========================================= */

function loadSavedPC() {

    const saved =
        localStorage.getItem(
            "runmygamePC"
        );


    if (!saved) {

        updatePCPreview();

        return;

    }


    try {

        const pc =
            JSON.parse(saved);


        if (pc.cpu) {

            selectedCPU =
                pc.cpu;

            cpuInput.value =
                pc.cpu.name;

            selectedCPUBox.textContent =
                "✓ " + pc.cpu.name;

        }


        if (pc.gpu) {

            selectedGPU =
                pc.gpu;

            gpuInput.value =
                pc.gpu.name;

            selectedGPUBox.textContent =
                "✓ " + pc.gpu.name;

        }


        if (pc.ram) {

            ram.value =
                pc.ram;

        }


        if (pc.vram) {

            vram.value =
                pc.vram;

        }


    }

    catch (error) {

        console.log(
            "No saved PC."
        );

    }


    updatePCPreview();

}


/* =========================================
   START
   ========================================= */

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light"
    );


    document.getElementById(
        "themeBtn"
    ).innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


loadData();

loadSavedPC();
