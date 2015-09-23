---
layout: page
title: Javascript Fractals
summary: Make a Julia Fractal again!
tags: ["howto", "code", "programming", "typescript", "javascript"]
---
<label for="sizeX" style="float:left"> Width</label><input type="range" id="sizeX" style="float:left"/>
<label for="sizeY" style="float:left"> Height</label><input type="range" id="sizeY" style="float:left"/><br>
<label for="xIncr" style="float:left"> XIncr</label><input type="range" id="xIncr" style="float:left"/>
<label for="yIncr" style="float:left"> YIncr</label><input type="range" id="yIncr" style="float:left"/><br>
<label for="iLimit" style="float:left"> i Limit</label><input type="range" id="iLimit" style="float:left"/>
<label for="rLimit" style="float:left"> r Limit</label><input type="range" id="rLimit" style="float:left"/><br>
<label for="constantR" style="float:left"> ConstantR</label><input type="range" id="constantR" style="float:left"/>
<label for="constantI" style="float:left"> ConstantI</label><input type="range" id="constantI" style="float:left"/><br>
<label for="iterations" style="float:left"> Iterations</label><input type="range" id="iterations" style="float:left"/><br>
<label for="centerX" style="float:left"> CenterX</label><input type="range" id="centerX" style="float:left"/>
<label for="centerY" style="float:left"> CenterY</label><input type="range" id="centerY" style="float:left"/><br>
<label for="zoom" style="float:left"> Zoom</label><input type="range" id="zoom" style="float:left"/>

<canvas id="fractal">

#Julia is great, but for flexible vizualisation, a browser is awesome!

So I"m adapting the code in my last post to Typescript and making a more
configurable. Its pretty slow unfortunately. :(  It'll get better when I put some more time into it!

<script src="/fractal/fractal.js"> </script>

```javascript
function makeInput(id, val, callbackOnChange) {
    var el: any = document.getElementById(id)
    if (!el) {
        console.error(id + " doesn't exist")
        return;
    }
    el.setRangeText(val);
    el.addEventListener("change", function(evt) {
        callbackOnChange((<HTMLTextAreaElement> evt.srcElement).value);
        render();
    })
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
    abs(c: Complex) { return Math.sqrt(this.r * this.r + this.i * this.i) }
}

function julia(z, c, maxIterations) {
    for (var n = 1; n < maxIterations; n++)
        if (z.timesBy(z).plusBy(c).abs() > 16)
            return n - 1
    return maxIterations;
}

//default params
var width = 500,
    height = 500,
    iLimit = 1,
    rLimit = 1,
    xIncr = 1,
    yIncr = 1,
    constantR = -.06,
    constantI = .67,
    numBuffered = 10,
    iterations = 100,
    centerX = 0,
    centerY = 0;

makeInput("sizeX", height, val => { height = +val });
makeInput("sizeY", width, val => { width = +val });
makeInput("iLimit", iLimit, val => { iLimit = +val });
makeInput("rLimit", rLimit, val => { rLimit = +val });
makeInput("xIncr", xIncr, val => { xIncr = +val });
makeInput("yIncr", yIncr, val => { yIncr = +val });
makeInput("constantR", constantR, val => { constantR = +val });
makeInput("constantI", constantI, val => { constantI = +val });
makeInput("iterations", iterations, val => { iterations = +val });
makeInput("constantI", constantI, val => { constantI = +val });
makeInput("centerX", centerX, val => { centerX = +val });
makeInput("centerY", centerY, val => { centerY = +val });

function render() {
    var canvas = <HTMLCanvasElement> document.getElementById("fractal"),
        ctx = canvas.getContext("2d");

    var constant = new Complex(constantR, constantI),
        xTor = rLimit * 2 / width,
        yToi = iLimit * 2 / height;

    canvas.width = width;
    canvas.height = height;
    _zoom(centerX, centerY)

    function _zoom(centerX, centerY, zoom){
        _render(0, 0, width, height, xIncr, yIncr, xTor, yToi)
    }

    function _render(startX, startY, endX, endY, stepX, stepY, xTor, yToi) {
        var iteratingComplex = new Complex(0, 0)
        for (var x = startX; x < endX; x += stepX)
            for (var y = startY; y < endY; y += stepY) {
                iteratingComplex.r = xTor * (x - width / 2)
                iteratingComplex.i = yToi * (y - height / 2)
                var s = Math.round(255 * (julia(iteratingComplex, constant, iterations) / iterations));
                ctx.fillStyle = "hsl(" + s + ", 100%, 50%)";
                ctx.fillRect(x, y, stepX, stepY);
            }
    }
}
render();



```
