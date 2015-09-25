---
layout: post
title: Canvas compositing
tags: ["code", "programming", "javascript"]
---
Backcolor <select id="backcolor">
	<option value="grey">Grey</option>
	<option value="black">Black</option>
	<option value="white">White</option>
	<option value="yellow">Yellow</option>
	<option value="none">Just clear the canvas</option>

</select>

First circle: <select id="one" >
		<option value="red">Red</option>
		<option value="green">Green</option>
		<option value="blue">Blue</option>
		<option value="yellow">Yellow</option>
		<option value="gradient1">Gradient 1</option>
		<option value="gradient2">Gradient 2</option>
		<option value="gradient3">Gradient 3</option>
</select> Second circle: <select id="two" >
	<option value="green">Green</option>
	<option value="red">Red</option>
	<option value="blue">Blue</option>
	<option value="yellow">Yellow</option>
	option value="gradient1">Gradient 1</option>
	<option value="gradient2">Gradient 2</option>
	<option value="gradient3">Gradient 3</option>
</select> Third circle: <select id="three" >
	<option value="blue">Blue</option>
	<option value="red">Red</option>
	<option value="green">Green</option>
	<option value="yellow">Yellow</option>
	<option value="gradient1">Gradient 1</option>
	<option value="gradient2">Gradient 2</option>
	<option value="gradient3">Gradient 3</option>
</select>

Composition type: <select id="composite" style="height: 50px;font-size: large;">
	<option value="source-over"> source-over --- This is the default setting and draws new shapes on top of the existing canvas content. </option>
	<option value="source-in"> source-in --- The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent. </option>
	<option value="source-out"> source-out --- The new shape is drawn where it doesn't overlap the existing canvas content. </option>
	<option value="source-atop"> source-atop --- The new shape is only drawn where it overlaps the existing canvas content. </option>
	<option value="destination-over"> destination-over --- New shapes are drawn behind the existing canvas content. </option>
	<option value="destination-in"> destination-in --- The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent. </option>
	<option value="destination-out"> destination-out --- The existing content is kept where it doesn't overlap the new shape. </option>
	<option value="destination-atop"> destination-atop --- The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content. </option>
	<option value="lighter"> lighter --- Where both shapes overlap the color is determined by adding color values. </option>
	<option value="copy"> copy --- Only the existing canvas is present. </option>
	<option value="xor"> xor --- Shapes are made transparent where both overlap and drawn normal everywhere else. </option>
	<option value="multiply"> multiply --- The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result. </option>
	<option value="screen"> screen --- The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply) </option>
	<option value="overlay"> overlay --- A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter. </option>
	<option value="darken"> darken --- Retains the darkest pixels of both layers. </option>
	<option value="lighten"> lighten --- Retains the lightest pixels of both layers. </option>
	<option value="color-dodge"> color-dodge --- Divides the bottom layer by the inverted top layer. </option>
	<option value="color-burn"> color-burn --- Divides the inverted bottom layer by the top layer, and then inverts the result. </option>
	<option value="hard-light"> hard-light --- A combination of multiply and screen like overlay, but with top and bottom layer swapped. </option>
	<option value="soft-light"> soft-light --- A softer version of hard-light. Pure black or white does not result in pure black or white. </option>
	<option value="difference"> difference --- Subtracts the bottom layer from the top layer or the other way round to always get a positive value. </option>
	<option value="exclusion"> exclusion --- Like difference, but with lower contrast. </option>
	<option value="hue"> hue --- Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer. </option>
	<option value="saturation"> saturation --- Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer. </option>
	<option value="color"> color --- Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer. </option>
	<option value="luminosity"> luminosity --- Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer. </option>
</select>

<canvas id="canvas1" width="450px" height="400px">
<script src="/public/js/compositeCanvas.js"></script>



I don't feel like writing anything about this yet..

#Here's the source
```javascript
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

```
