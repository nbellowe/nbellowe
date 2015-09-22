function makeInput(id, val, callbackOnChange) {
    var el = document.getElementById(id);
    if (!el) {
        console.error(id + " doesn't exist");
        return;
    }
    el.setRangeText(val);
    el.addEventListener("change", function (evt) {
        callbackOnChange(evt.srcElement.value);
        render();
    });
}
var Complex = (function () {
    function Complex(r, i) {
        this.r = r;
        this.i = i;
    }
    Complex.prototype.plusBy = function (c) {
        this.r += c.r;
        this.i += c.i;
        return this;
    };
    Complex.prototype.timesBy = function (c) {
        var r = this.r * c.r - this.i * c.i;
        var i = this.r * c.i + this.i * c.r;
        this.r = r;
        this.i = i;
        return this;
    };
    Complex.prototype.abs = function (c) { return Math.sqrt(this.r * this.r + this.i * this.i); };
    return Complex;
})();
var memoized = {};
function julia(z, c, maxIterations) {
    var id = JSON.stringify(arguments);
    if (memoized[id])
        return memoized[id];
    memoized[id] = maxIterations;
    for (var n = 1; n < maxIterations; n++)
        if (z.timesBy(z).plusBy(c).abs() > 16) {
            memoized[id] = n - 1;
            break;
        }
    return memoized[id];
}
var width = 500, height = 500, iLimit = 1, rLimit = 1, xIncr = 1, yIncr = 1, constantR = -.06, constantI = .67, numBuffered = 10, iterations = 100;
makeInput("sizeX", height, function (val) { height = +val; });
makeInput("sizeY", width, function (val) { width = +val; });
makeInput("iLimit", iLimit, function (val) { iLimit = +val; });
makeInput("rLimit", rLimit, function (val) { rLimit = +val; });
makeInput("xIncr", xIncr, function (val) { xIncr = +val; });
makeInput("yIncr", yIncr, function (val) { yIncr = +val; });
makeInput("constantR", constantR, function (val) { constantR = +val; });
makeInput("constantI", constantI, function (val) { constantI = +val; });
makeInput("iterations", iterations, function (val) { iterations = +val; });
function render() {
    var canvas = document.getElementById("fractal"), ctx = canvas.getContext("2d");
    var constant = new Complex(constantR, constantI), xTor = rLimit * 2 / width, yToi = iLimit * 2 / height;
    canvas.width = width;
    canvas.height = height;
    for (var i = numBuffered; i > 0; i--)
        _render(0, 0, width, height, xIncr * i, yIncr * i, xTor, yToi);
    function _render(startX, startY, endX, endY, stepX, stepY, xTor, yToi) {
        var iteratingComplex = new Complex(0, 0);
        for (var x = startX; x < endX; x += stepX)
            for (var y = startY; y < endY; y += stepY) {
                iteratingComplex.r = xTor * (x - width / 2);
                iteratingComplex.i = yToi * (y - height / 2);
                var s = Math.round(255 * (julia(iteratingComplex, constant, iterations) / iterations));
                ctx.fillStyle = "hsl(" + s + ", 100%, 50%)";
                ctx.fillRect(x, y, stepX, stepY);
            }
    }
}
render();
