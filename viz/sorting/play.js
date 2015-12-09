var BACKGROUND_COLOR = "black";
timerGraph(function (x) { return Math.sin(x); }, "red", 1);
timerGraph(function (x) { return .5 * Math.sin(.75 * x); }, "blue", 2);
function makeContext() {
    var canv = document.createElement("canvas");
    var ctx = canv.getContext("2d");
    document.body.appendChild(canv);
    ctx.canvas.style.position = "absolute";
    ctx.canvas.style.top = ctx.canvas.style.left = "0px";
    ctx.canvas.width = window.innerWidth - 50;
    ctx.canvas.height = window.innerHeight - 50;
    return ctx;
}
function fillColorRect(ctx, col, x, y, w, h) {
    var old = ctx.fillStyle;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = old;
}
function clear(ctx) {
    fillColorRect(ctx, BACKGROUND_COLOR, 0, 0, ctx.canvas.width, ctx.canvas.height);
}
function colorScale(x) {
    return Number(parseInt(x, 10)).toString(16);
}
function timerGraph(fn, color, speed) {
    var ctx = makeContext();
    console.log("The timer is now initializing");
    var CIRCLE = false, PIXEL_HEIGHT = 4, PIXEL_WIDTH = 4, PIXEL_COLOR = color || "red", speed = speed || 1, STEP_BY = Math.ceil(8 * speed), STEP_EVERY = Math.ceil(50 / speed), XSCALE = 50, YSCALE = ctx.canvas.height / 2, x = 0, interval = setInterval(drawPoint, STEP_EVERY);
    drawPoint();
    function drawPoint() {
        var halfHeight = ctx.canvas.height / 2;
        if (x === 0)
            clear();
        else if (x >= ctx.canvas.width)
            x = 0;
        else
            x += STEP_BY;
        var relativeX = x / ctx.canvas.width, relativeY = fn(relativeX * XSCALE), y = Math.ceil(relativeY * YSCALE + halfHeight);
        fillColorRect(ctx, PIXEL_COLOR, x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
    }
}
