var ctx1 = document.getElementById("canvas1").getContext("2d");
var op = "source-over";
var int = 3000;
var interval = setInterval(function () { return draw(op, int); }, int);
var backcolor = "grey";
var color1 = "red";
var color2 = "green";
var color3 = "blue";
addSelectListener("composite", function (v) {
    op = v;
    clearInterval(interval);
    interval = setInterval(function () { return draw(op, int); }, int);
});
addSelectListener("backcolor", function (v) { return backcolor = v; });
addSelectListener("one", function (v) { return color1 = v; });
addSelectListener("two", function (v) { return color2 = v; });
addSelectListener("three", function (v) { return color3 = v; });
function addSelectListener(id, cb) {
    document
        .getElementById(id)
        .addEventListener("change", function (evt) { return cb(evt.srcElement.value); });
}
function drawCirc(ctx, coord, r, color) {
    setColor(ctx, color);
    ctx.beginPath();
    ctx.arc(coord[0], coord[1], r, 0, 2 * Math.PI, false);
    ctx.fill();
}
function draw(op, time) {
    var sideLength = 150, halfLength = sideLength / 2, base = sideLength, first = [base + 0, base + 0], second = [base + sideLength, base + 0], third = [base + halfLength, base + (halfLength * Math.sqrt(2))];
    clear(ctx1);
    ctx1.globalCompositeOperation = op;
    setTimeout(function () { return drawCirc(ctx1, first, halfLength * 3 / 2, color1); }, time / 4);
    setTimeout(function () { return drawCirc(ctx1, second, halfLength * 3 / 2, color2); }, time / 2);
    setTimeout(function () { return drawCirc(ctx1, third, halfLength * 3 / 2, color3); }, time * (3 / 4));
}
function setColor(ctx, col) {
    if (col == "gradient1") {
        var grd = ctx.createRadialGradient(238, 50, 10, 238, 50, 300);
        grd.addColorStop(0, '#f51710');
        grd.addColorStop(1, '#ffed00');
        ctx.fillStyle = grd;
    }
    else if (col == "gradient2") {
        var grd = ctx.createRadialGradient(238, 50, 10, 238, 50, 300);
        grd.addColorStop(0, '#38632f');
        grd.addColorStop(1, '#bdff00');
        ctx.fillStyle = grd;
    }
    else if (col == "gradient3") {
        var grd = ctx.createRadialGradient(238, 50, 10, 238, 50, 300);
        grd.addColorStop(0, '#27275c');
        grd.addColorStop(1, '#00ffe0');
        ctx.fillStyle = grd;
    }
    else if (col != "none") {
        ctx.fillStyle = col;
    }
}
function clear(ctx) {
    ctx.globalCompositeOperation = "source-over";
    setColor(ctx, backcolor);
    if (backcolor == "none")
        ctx.canvas.width = ctx.canvas.width;
    else
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
