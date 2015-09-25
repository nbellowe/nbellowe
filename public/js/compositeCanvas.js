function drawCirc(ctx, coord, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(coord[0], coord[1], r, 0, 2 * Math.PI, false);
    ctx.fill();
}
var ctx1 = document.getElementById("canvas1").getContext("2d");
function draw(op) {
    var sideLength = 150, halfLength = sideLength / 2, base = sideLength, first = [base + 0, base + 0], second = [base + sideLength, base + 0], third = [base + halfLength, base + (halfLength * Math.sqrt(2))];
    ctx1.globalCompositeOperation = op;
    drawCirc(ctx1, first, halfLength * 3 / 2, "blue");
    drawCirc(ctx1, second, halfLength * 3 / 2, "red");
    drawCirc(ctx1, third, halfLength * 3 / 2, "green");
}
document.getElementById("composite").addEventListener("change", function (evt) { return draw(evt.srcElement.value); });
draw("source-over");
