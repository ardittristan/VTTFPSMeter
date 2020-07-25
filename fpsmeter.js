let fpsArray = Array(4).fill(0);
let counter = 0;
/** @type {CanvasRenderingContext2D} */
let fpsCanvasContext;
let showFps = true;
let getFPSInterval;
let updateFPSInterval;

// register setting
Hooks.once('init', () => {
    game.settings.register("fpsmeter", "showFps", {
        name: "Show fps?",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });
    showFps = game.settings.get("fpsmeter", "showFps");
});

// when setting changed
Hooks.on("closeSettingsConfig", () => {
    showFps = game.settings.get("fpsmeter", "showFps");
    clearIntervals();
    if (showFps) {
        jQuery(".fpsCounter").css("display", "unset");
        setIntervals();
    } else {
        jQuery(".fpsCounter").css("display", "none");
    }
});

// when canvas ready
Hooks.once("canvasReady", () => {
    // on every frame
    canvas.app.ticker.add(() => counter++);
    setIntervals();

    // add fps box
    jQuery(document.body).prepend('<div class="fpsCounter"><canvas class="fpsCanvas" id="fpsCanvas" width="1" height="1"></canvas></div>');

    // hide if disabled
    if (!showFps) {
        jQuery(".fpsCounter").css("display", "none");
        clearIntervals()
    }
    // set canvas to right size
    resizeCanvas();

    // get context of canvas
    fpsCanvasContext = document.getElementById("fpsCanvas").getContext("2d");

    fpsCanvasContext.fillStyle = "#f0f0e0";

    // watch resizing of sidebar
    new ResizeObserver(resizeObserverEntry => {

        jQuery(".fpsCounter").css("right", (10 + jQuery(resizeObserverEntry[0].target).width()) + "px");

    }).observe(jQuery("div#sidebar.app")[0]);
});

function setIntervals() {
    getFPSInterval = setInterval(getFPS, 250);
    updateFPSInterval = setInterval(updateFPS, 250);
}

function clearIntervals() {
    clearInterval(getFPSInterval);
    clearInterval(updateFPSInterval);
}

// calc fps
function getFPS() {
    const framesLastSec = counter;
    counter = 0;
    fpsArray.shift();
    fpsArray.push(framesLastSec);
}

// update fps box
function updateFPS() {
    const fps = Math.ceil(fpsArray.reduce((partial_sum, a) => partial_sum + a, 0));
    let fpsCanvas = jQuery(".fpsCanvas")[0];
    const textHeight = fpsCanvas.height / 3 * 1.5;
    const offsetHeight = fpsCanvas.height / 6 + textHeight;

    fpsCanvasContext.clearRect(0, 0, fpsCanvas.width, fpsCanvas.height);
    fpsCanvasContext.font = `${textHeight}px Arial`;
    fpsCanvasContext.fillText(`${fps}`, 2, offsetHeight);
}

function resizeCanvas() {
    let con = jQuery(".fpsCounter"),
        fpsCanvas = jQuery(".fpsCanvas")[0];

    fpsCanvas.height = con.height();
    fpsCanvas.width = con.width();
}
