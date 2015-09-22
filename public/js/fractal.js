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
    constantI = .67,
	iterations = 200;

makeInput("sizeX", sizeX, function(val){ sizeX = +val });
makeInput("sizeY", sizeY, function(val){ sizeY = +val });
makeInput("iLimit", iLimit, function(val){ iLimit = +val });
makeInput("rLimit", rLimit, function(val){ rLimit = +val });
makeInput("xIncr", xIncr, function(val){ xIncr = +val });
makeInput("yIncr", yIncr, function(val){ yIncr = +val });
makeInput("constantR", constantR, function(val){ constantR = +val });
makeInput("constantI", constantI, function(val){ constantI = +val });
makeInput("iterations", iterations, function(val){ iterations = +val });

function render()
{
    var canvas = document.getElementById("fractal"),
    	ctx = canvas.getContext("2d");
    canvas.width = sizeX;
    canvas.height = sizeY;

	var incrementI = Math.round((iLimit * 2) / sizeY), //go from -1 to 1 if iLimit is 1
		incrementR = Math.round((rLimit * 2) / sizeX),
        constant = new Complex(constantR, constantI);

	setTimeout(function(){
		_render(incrementI*4, incrementR*4, iterations/8);
	}, 50)
	setTimeout(function(){
//		_render(incrementI, incrementR, iterations);
	}, 55) //after the fast one

	function _render(stepX,stepY,iter){
		var iteratingComplex = new Complex(0,0);
		for (var x = 0; x < sizeX; x+=stepX)
			for (var y = 0; y < sizeY; y+=stepY)
			{
	 			iteratingComplex.r = -rLimit + incrementR * x
				iteratingComplex.i = -iLimit + incrementI * y
	            var s = Math.round(255*(julia(iteratingComplex, constant, iter)/iter));
	            ctx.fillStyle = "rgb(" + s + "," + s + "," + s + ")";
				ctx.fillRect(x, y, xIncr, yIncr);
			}
	}
}
render();
