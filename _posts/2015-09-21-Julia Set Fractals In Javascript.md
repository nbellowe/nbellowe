---
layout: page
title: Javascript Fractals
summary: Make a Julia Fractal again!
tags: ["howto", "code", "programming", "typescript", "javascript"]
---

#Julia is great, but for flexible vizualisation, a browser is awesome!

<canvas id="fractal">

<label for="sizeX" > Width</label><input type="range" style="float:right" id="sizeX" /><br>
<label for="sizeY" > Height</label><input type="range" style="float:right" id="sizeY" /><br>
<label for="xIncr" > XIncr</label><input type="range" style="float:right" id="xIncr" /><br>
<label for="yIncr" > YIncr</label><input type="range" style="float:right" id="yIncr" /><br>
<label for="iLimit" > i Limit</label><input type="range" style="float:right" id="iLimit" /><br>
<label for="rLimit" > r Limit</label><input type="range" style="float:right" id="rLimit" /><br>
<label for="constantR" > ConstantR</label><input type="range" style="float:right" id="constantR" /><br>
<label for="constantI" > ConstantI</label><input type="range" style="float:right" id="constantI" /><br>
<label for="iterations" > Iterations</label><input type="range" style="float:right" id="iterations" /><br>
<label for="centerX" > CenterX</label><input type="range" style="float:right" id="centerX" /><br>
<label for="centerY" > CenterY</label><input type="range" style="float:right" id="centerY" /><br>
<label for="zoom" > Zoom</label><input type="range" style="float:right" id="zoom" /><br>


So I"m adapting the code in my last post to Typescript and making a more
configurable. Its pretty slow unfortunately. :(  It'll get better when I put some more time into it!

<script src="/fractal/fractal.js"> </script>

```javascript
function makeInput(id, callbackOnChange, min, max) {
    var el: any = document.getElementById(id)
    if (!el) {
        console.error(id + " doesn't exist")
        return;
    }
    el.addEventListener("change", function(evt) {
        callbackOnChange((<HTMLTextAreaElement> evt.srcElement).value);
        (new Renderer).render();
    })
    el.min = min || "";
    el.max = max || "";
}
function update(id, val){
    var el: any = document.getElementById(id)
    if (!el)
        console.error(id + " doesn't exist")
    else
        el.value = el.val = val;
}

class Complex {
    constructor(public r: number, public i: number) { }
    plusBy(c: Complex) {
        this.r += c.r;
        this.i += c.i;
        return this;
    }
    timesBy(c: Complex) {
        //(a+bi)(c+di)  == (ac-bd) + (ad + bc)i
        var r = this.r * c.r - this.i * c.i;
        var i = this.r * c.i + this.i * c.r;
        this.r = r;
        this.i = i;
        return this;
    }
    squareThenPlus(c) {
        var r = this.r * this.r - this.i * this.i;
        var i = this.r * this.i + this.i * this.r;
        this.r = r + c.r;
        this.i = i + c.i;
        return this;
    }
    abs(c: Complex) { return Math.sqrt(this.r * this.r + this.i * this.i) }
}

function julia(z, c, maxIterations) {
    for (var n = 1; n < maxIterations; n++)
        if (z.squareThenPlus(c).abs() > 16)
            return n - 1
    return maxIterations;
}

function julia2(z: Complex, c: Complex, maxIterations) {
    var zr = z.r;
    var zi = z.i;
    var iterations = 0;

    var zrNext, ziNext;
    while (true) {
        iterations++;
        if (iterations > maxIterations) return maxIterations;
        zrNext = zr * zr - zi * zi + c.r;
        ziNext = 2 * zi * zr + c.i;
        zr = zrNext;
        zi = ziNext;
        if (zr > 4 || zi > 4) return iterations;
    }
    return iterations;
}

//julia set param
var width = 500,
    height = 500,
    iLimit = 1,
    rLimit = 1,
    xIncr = 1,
    yIncr = 1,
    constantR = -.06,
    constantI = .67,
    numBuffered = 10,
    centerX = 0,
    centerY = 0,
    zoom = 1,
    iterations = 100;

makeInput("sizeX", val => { width = +val }, 0, 1000);
makeInput("sizeY", val => { height = +val }, 0, 1000);
makeInput("iLimit", val => { iLimit = +val }, -1.01, 1.01);
makeInput("rLimit", val => { rLimit = +val }, -1.01, 1.01);
makeInput("xIncr", val => { xIncr = +val }, 1, 10);
makeInput("yIncr", val => { yIncr = +val }, 1, 10);
makeInput("constantR", val => { constantR = +val }, -1.01, 1.01);
makeInput("constantI", val => { constantI = +val }, -1.01, 1.01);
makeInput("iterations", val => { iterations = +val }, 0, 500);
makeInput("centerX", val => { centerX = +val }, -1000, 1000);
makeInput("centerY", val => { centerY = +val }, -1000, 1000);
makeInput("zoom", val => { zoom = +val }, .25, 20);

function updateAll(){
    update("sizeX",width);
    update("sizeY",height);
    update("iLimit",iLimit);
    update("rLimit",rLimit);
    update("xIncr",xIncr);
    update("yIncr",yIncr);
    update("constantR",constantR);
    update("constantI",constantI);
    update("iterations",iterations);
    update("centerX",centerX);
    update("centerY",centerY);
    update("zoom",zoom);
}
class Renderer {
    canvas = <HTMLCanvasElement> document.getElementById("fractal");
    ctx = this.canvas.getContext("2d");

    xTor = rLimit * 2 / width;
    yToi = iLimit * 2 / height;

    constructor() {
        updateAll();
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.addEventListener("mousedown", this.mousedown.bind(this))
        document.addEventListener("click", this.click.bind(this));
        document.addEventListener("mousemove", this.mousemove.bind(this));
    }

    _zoom(centerX, centerY, zoom, qualityDecr?) {
        qualityDecr = Math.round(qualityDecr || 1);
        this._render(0, 0, -centerX, -centerY, width, height, xIncr * qualityDecr, yIncr * qualityDecr, this.xTor / zoom, this.yToi / zoom)
    }

    startingX = 0;
    startingY = 0;

    dragging = false;
    _mousedown: () => any;
    mousedown(e: MouseEvent) {
        this.dragging = true;
        this.startingX = e.x;
        this.startingY = e.y;
    }

    mousemove(e: MouseEvent) {
        if(this.dragging){
            centerY -= this.startingY - e.y;
            centerX -= this.startingX - e.x;

            this.startingX = e.x;
            this.startingY = e.y;

            this._zoom(centerX, centerY, zoom, 8)

        }
    }

    click(e: MouseEvent) {
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("click", this.click);
        this.startingX = null;
        this.startingY = null;
        this.dragging = false;
        this.render()
    }

    _render(startX, startY, centerX, centerY, endX, endY, stepX, stepY, xTor, yToi) {
        var iteratingComplex = new Complex(0, 0);
        var constant = new Complex(constantR, constantI);
        for (var x = startX; x < endX; x += stepX)
            for (var y = startY; y < endY; y += stepY) {
                iteratingComplex.r = xTor * ((centerX + x) - width / 2)
                iteratingComplex.i = yToi * ((centerY + y) - height / 2)
                this.ctx.fillStyle = "hsl(" + Math.round(255 * (julia2(iteratingComplex, constant, iterations) / iterations))
                + ", 100%, 50%)";
                this.ctx.fillRect(x, y, stepX, stepY);
            }
    }
    render() {
        console.time("fastRender")
        this._zoom(centerX, centerY, zoom, 8)
        console.timeEnd("fastRender")

        setTimeout(() => {
            console.time("fullRender")
            this._zoom(centerX, centerY, zoom)
            console.timeEnd("fullRender")
        }, 0)
    }
}
function debounce(fn, delay) {
    var timer = null;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}
(new Renderer).render();




```
