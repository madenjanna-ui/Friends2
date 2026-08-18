const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

const scenes = [...document.querySelectorAll(".scene")];

const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skip");
const musicBtn = document.getElementById("musicBtn");

const song = document.getElementById("song");
const backgroundMusic = document.getElementById("backgroundMusic");

const progress = document.querySelector("#progress i");

let W = 0;
let H = 0;

let stars = [];
let comets = [];

let currentScene = 0;
let started = false;

let timers = [];


/* =========================
   КОСМОС
========================= */

function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

    stars = [];

    for (let i = 0; i < 180; i++) {

        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.4 + 0.2,
            a: Math.random() * 0.8 + 0.2
        });

    }

    createComets();
}


function createComets() {

    comets = [

        {
            x: -180,
            y: H * 0.32,
            vx: 3.1,
            vy: 0.7
        },

        {
            x: W + 180,
            y: H * 0.68,
            vx: -3.1,
            vy: -0.7
        }

    ];

}


function drawStars(time) {

    ctx.fillStyle = "#02030a";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    stars.forEach(star => {

        const twinkle =
            0.55 +
            Math.sin(
                time * 0.001 +
                star.x
            ) * 0.45;

        ctx.globalAlpha =
            star.a * twinkle;

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.r,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });


    ctx.globalAlpha = 1;

}


function drawComet(c) {

    const angle =
        Math.atan2(
            c.vy,
            c.vx
        );

    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(angle);


    const tail =
        ctx.createLinearGradient(
            -200,
            0,
            30,
            0
        );

    tail.addColorStop(
        0,
        "rgba(255,120,20,0)"
    );

    tail.addColorStop(
        0.7,
        "rgba(255,200,100,.35)"
    );

    tail.addColorStop(
        1,
        "rgba(255,245,220,.95)"
    );


    ctx.fillStyle = tail;

    ctx.beginPath();

    ctx.moveTo(
        -200,
        0
    );

    ctx.quadraticCurveTo(
        -70,
        -22,
        10,
        -6
    );

    ctx.quadraticCurveTo(
        -70,
        22,
        -200,
        0
    );

    ctx.fill();


    const glow =
        ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            30
        );

    glow.addColorStop(
        0,
        "#ffffff"
    );

    glow.addColorStop(
        0.2,
        "#ffe5a0"
    );

    glow.addColorStop(
        0.65,
        "#ff9e3d"
    );

    glow.addColorStop(
        1,
        "rgba(255,70,10,0)"
    );


    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}


function animation(time) {

    drawStars(time);


    if (
        started &&
        currentScene <= 1
    ) {

        comets.forEach(comet => {

            comet.x += comet.vx;
            comet.y += comet.vy;

            drawComet(comet);

        });

    }


    requestAnimationFrame(
        animation
    );

}


/* =========================
   СЦЕНЫ
========================= */

function showScene(number) {

    currentScene =
        number;


    scenes.forEach(
        (scene, index) => {

            scene.classList.toggle(
                "active",
                index === number
            );

        }
    );

}


/* =========================
   ВСПЫШКА
========================= */

function flash() {

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "flash";

    document.body.appendChild(
        element
    );


    requestAnimationFrame(
        () => {

            element.classList.add(
                "go"
            );

        }
    );


    setTimeout(
        () => {

            element.remove();

        },
        1000
    );

}


/* =========================
   ФОНОВАЯ МУЗЫКА
========================= */

async function startBackgroundMusic() {

    if (!backgroundMusic) {

        console.error(
            "backgroundMusic не найден"
        );

        return false;

    }


    try {

        /*
         * Сбрасываем музыку
         */

        backgroundMusic.pause();

        backgroundMusic.currentTime = 0;

        /*
         * Громкость
         */

        backgroundMusic.volume = 0.28;


        /*
         * ВАЖНО:
         * play() вызывается непосредственно
         * из действия пользователя.
         */

        await backgroundMusic.play();


        console.log(
            "Фоновая музыка запущена"
        );


        return true;

    }

    catch (error) {

        console.error(
            "Не удалось запустить фоновую музыку:",
            error
        );


        return false;

    }

}


/* =========================
   ОСТАНОВКА ФОНА
========================= */

function stopBackgroundMusic() {

    if (!backgroundMusic)
        return;


    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;

}


/* =========================
   ПЛАВНОЕ ЗАТУХАНИЕ
========================= */

function fadeBackgroundMusic() {

    if (!backgroundMusic)
        return;


    const startVolume =
        backgroundMusic.volume;

    const startTime =
        performance.now();

    const duration =
        2000;


    function fade(time) {

        const progress =
            Math.min(
                1,
                (time - startTime) /
                duration
            );


        backgroundMusic.volume =
            startVolume *
            (1 - progress);


        if (progress < 1) {

            requestAnimationFrame(
                fade
            );

        }

        else {

            stopBackgroundMusic();

            backgroundMusic.volume =
                0.28;

        }

    }


    requestAnimationFrame(
        fade
    );

}


/* =========================
   СЦЕНАРИЙ
========================= */

const timeline = [

    [0, 0],

    [16000, 1],

    [34000, 2],

    [78000, 3],

    [125000, 4],

    [188000, 5]

];


function startTimeline() {

    timers.forEach(
        timer =>
            clearTimeout(timer)
    );


    timers = [];


    timeline.forEach(
        ([time, scene]) => {

            const timer =
                setTimeout(
                    () => {

                        if (
                            scene === 1
                        ) {

                            flash();

                        }


                        showScene(
                            scene
                        );


                    },
                    time
                );


            timers.push(timer);

        }
    );


    /*
     * Индикатор прогресса
     */

    const progressTimer =
        setInterval(
            () => {

                if (
                    !started ||
                    currentScene === 5
                ) {

                    clearInterval(
                        progressTimer
                    );

                    return;

                }


                progress.style.width =
                    Math.min(
                        100,
                        (performance.now() %
                            188000) /
                            188000 *
                            100
                    ) + "%";


            },
            100
        );


    timers.push(
        progressTimer
    );

}


/* =========================
   КНОПКА «НАЧАТЬ»
========================= */

startBtn.onclick =
    async function (event) {

        event.preventDefault();


        if (started)
            return;


        started = true;


        /*
         * КНОПКА СРАЗУ УХОДИТ
         */

        startBtn.style.display =
            "none";


        /*
         * Сначала запускаем фон.
         */

        const backgroundStarted =
            await startBackgroundMusic();


        /*
         * Запускаем сценарий
         */

        startTimeline();


        console.log(
            "Старт открытки.",
            "Фоновая музыка:",
            backgroundStarted
        );

    };


/* =========================
   КНОПКА «ПРОПУСТИТЬ»
========================= */

skipBtn.onclick =
    function (event) {

        event.preventDefault();


        timers.forEach(
            timer =>
                clearTimeout(timer)
        );


        showScene(5);


        stopBackgroundMusic();

    };


/* =========================
   ФИНАЛЬНАЯ ПЕСНЯ
========================= */

musicBtn.onclick =
    async function (event) {

        event.preventDefault();


        /*
         * Останавливаем фон
         */

        fadeBackgroundMusic();


        /*
         * Кнопка исчезает сразу
         */

        musicBtn.style.display =
            "none";


        /*
         * Запускаем вашу песню
         */

        try {

            song.currentTime = 0;

            await song.play();


            console.log(
                "Основная песня запущена"
            );

        }

        catch (error) {

            console.error(
                "Не удалось запустить песню:",
                error
            );


            /*
             * Если браузер всё-таки
             * заблокировал воспроизведение,
             * возвращаем кнопку.
             */

            musicBtn.style.display =
                "inline-block";

            musicBtn.textContent =
                "▶ Нажмите ещё раз";

        }

    };


/* =========================
   ПЕСНЯ ЗАКОНЧИЛАСЬ
========================= */

song.onended =
    function () {

        console.log(
            "Песня закончилась"
        );

    };


/* =========================
   ЗАПУСК
========================= */

resize();

window.addEventListener(
    "resize",
    resize
);

requestAnimationFrame(
    animation
);