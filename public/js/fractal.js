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
