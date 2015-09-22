---
layout: post
title: The Julia Function, Julia Set, and Julia Fractal, written in Javascript
summary: Make a Julia Fractal again!
tags: ["howto", "code", "programming", "javascript"]
---
<label for="sizeX" style="float:left"> Width</label><input type="text" id="sizeX" style="float:left"/>
<label for="sizeY" style="float:left"> Height</label><input type="text" id="sizeY" style="float:left"/><br>
<label for="xIncr" style="float:left"> XIncr</label><input type="text" id="xIncr" style="float:left"/>
<label for="yIncr" style="float:left"> YIncr</label><input type="text" id="yIncr" style="float:left"/><br>
<label for="iLimit" style="float:left"> i Limit</label><input type="text" id="iLimit" style="float:left"/>
<label for="rLimit" style="float:left"> r Limit</label><input type="text" id="rLimit" style="float:left"/><br>
<label for="constantR" style="float:left"> ConstantR</label><input type="text" id="constantR" style="float:left"/>
<label for="constantI" style="float:left"> ConstantI</label><input type="text" id="constantI" style="float:left"/><br>
<label for="iterations" style="float:left"> Iterations</label><input type="text" id="iterations" style="float:left"/>

<canvas id="fractal">

#Julia is great, but for flexible vizualisation, a browser is awesome!

So I"m adapting the code in my last post to Javascript and making a more
configurable. Its pretty slow unfortunately. :(  It'll get better when I put some more time into it!

<script src="/public/js/fractal.js"> </script>

```javascript
function Complex(r, i)
{
	this.r = r;
	this.i = i;
}
Complex.prototype.plusBy = function (c)
{
    this.r += c.r;
    this.i += c.i;
    return this;
}
Complex.prototype.timesBy = function (c)
{
    //(a+bi)(c+di)  == (ac-bd) + (ad + bc)i
    var r = this.r * c.r - this.i * c.i;
    var i = this.r * c.i + this.i * c.r;
    this.r = r;
    this.i = i;
    return this;
}
Complex.prototype.abs = function (c)
{
    return Math.sqrt(this.r * this.r + this.i * this.i);
}


function makeInput(id, val, callbackOnChange){
    var el = document.getElementById(id)
    if(!el){
        console.error(id + " doesn't exist")
        return;
    }
    el.setRangeText(val);
    el.addEventListener("change",function(evt){
        callbackOnChange(evt.srcElement.value);
        render();
    })
}

function julia(z, c, maxIterations)
{
	if (!maxIterations) maxIterations = 255
	for (n = 1; n < maxIterations; n++)
		if (z.timesBy(z)
			.plusBy(c)
			.abs() > 16) return n - 1
	return maxIterations;
}
//julia set param
var sizeX = 500,
	sizeY = 500,
	iLimit = 1,
	rLimit = 1,
    xIncr = 1,
    yIncr =1,
    constantR = -.06,
    constantI = .67

makeInput("sizeX", sizeX, function(val){ sizeX = +val });
makeInput("sizeY", sizeY, function(val){ sizeY = +val });
makeInput("iLimit", iLimit, function(val){ iLimit = +val });
makeInput("rLimit", rLimit, function(val){ rLimit = +val });
makeInput("xIncr", xIncr, function(val){ xIncr = +val });
makeInput("yIncr", yIncr, function(val){ yIncr = +val });
makeInput("constantR", constantR, function(val){ constantR = +val });
makeInput("constantI", constantI, function(val){ constantI = +val });

function render()
{
    var canvas = document.getElementById("fractal"),
    	ctx = canvas.getContext("2d");
    canvas.width = sizeX;
    canvas.height = sizeY;

	var incrementI = (iLimit * 2) / sizeY,
		incrementR = (rLimit * 2) / sizeX,
        constant = new Complex(constantR, constantI),
		arr2d = [];
	for (var x = 0; x < sizeX; x+=xIncr)
	{
		arr2d[x] = [];
		for (var y = 0; y < sizeY; y+=yIncr)
		{
			var r = -rLimit + incrementR * x,
				i = -iLimit + incrementI * y,
                s = arr2d[x][y] = julia(new Complex(r, i), constant);
            ctx.fillStyle = "rgb(" + s + "," + s + "," + s + ")";
			ctx.fillRect(x, y, xIncr, yIncr);
		}
	}
}
render();


```
