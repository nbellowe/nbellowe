function makeSlideInput(id, callbackOnChange, min, max) {
    var el = document.getElementById(id);
    if (!el) {
        console.error(id + " doesn't exist");
        return;
    }
    el.addEventListener("change", function (evt) {
        callbackOnChange(evt.srcElement.value);
        (new Renderer).render();
    });
    el.min = min || "";
    el.max = max || "";
    el.style.width = "500px";
}
function makeComboInput(id, callbackOnChange) {
    var el = document.getElementById(id);
    if (!el) {
        console.error(id + " doesn't exist");
        return;
    }
    el.addEventListener("change", function (evt) {
        callbackOnChange(evt.srcElement.value);
        (new Renderer).render();
    });
}
function update(id, val) {
    var el = document.getElementById(id);
    if (!el)
        return console.error(id + " doesn't exist");
    el.value = el.val = val;
    el.width = "500px";
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
    Complex.prototype.squareThenPlus = function (c) {
        var r = this.r * this.r - this.i * this.i;
        var i = this.r * this.i + this.i * this.r;
        this.r = r + c.r;
        this.i = i + c.i;
        return this;
    };
    Complex.prototype.abs = function (c) { return Math.sqrt(this.r * this.r + this.i * this.i); };
    return Complex;
})();
function julia(z, c, maxIterations) {
    for (var n = 1; n < maxIterations; n++)
        if (z.squareThenPlus(c).abs() > 16)
            return n - 1;
    return maxIterations;
}
function julia2(z, c, maxIterations) {
    var zr = z.r;
    var zi = z.i;
    var iterations = 0;
    var zrNext, ziNext;
    while (true) {
        iterations++;
        if (iterations > maxIterations)
            return maxIterations;
        zrNext = zr * zr - zi * zi + c.r;
        ziNext = 2 * zi * zr + c.i;
        zr = zrNext;
        zi = ziNext;
        if (zr > 4 || zi > 4)
            return iterations;
    }
    return iterations;
}
var TYPE;
(function (TYPE) {
    TYPE[TYPE["JULIA2"] = 0] = "JULIA2";
    TYPE[TYPE["JULIA"] = 1] = "JULIA";
    TYPE[TYPE["MANDELBROT"] = 2] = "MANDELBROT";
})(TYPE || (TYPE = {}));
var type = TYPE.JULIA2, width = 500, height = 500, iLimit = 1, rLimit = 1, xIncr = 1, yIncr = 1, constantR = -.06, constantI = .67, numBuffered = 10, centerX = 0, centerY = 0, zoom = 1, iterations = 100;
makeSlideInput("sizeX", function (val) { width = +val; }, 0, 1000);
makeSlideInput("sizeY", function (val) { height = +val; }, 0, 1000);
makeSlideInput("iLimit", function (val) { iLimit = +val; }, -1.01, 1.01);
makeSlideInput("rLimit", function (val) { rLimit = +val; }, -1.01, 1.01);
makeSlideInput("xIncr", function (val) { xIncr = +val; }, 1, 10);
makeSlideInput("yIncr", function (val) { yIncr = +val; }, 1, 10);
makeSlideInput("constantR", function (val) { constantR = +val; }, -1.01, 1.01);
makeSlideInput("constantI", function (val) { constantI = +val; }, -1.01, 1.01);
makeSlideInput("iterations", function (val) { iterations = +val; }, 0, 500);
makeSlideInput("centerX", function (val) { centerX = +val; }, -1000, 1000);
makeSlideInput("centerY", function (val) { centerY = +val; }, -1000, 1000);
makeSlideInput("zoom", function (val) { zoom = +val; }, .25, 20);
makeComboInput("type", function (val) { type = val; });
function updateAll() {
    update("sizeX", width);
    update("sizeY", height);
    update("iLimit", iLimit);
    update("rLimit", rLimit);
    update("xIncr", xIncr);
    update("yIncr", yIncr);
    update("constantR", constantR);
    update("constantI", constantI);
    update("iterations", iterations);
    update("centerX", centerX);
    update("centerY", centerY);
    update("zoom", zoom);
}
var Renderer = (function () {
    function Renderer() {
        this.canvas = document.getElementById("fractal");
        this.ctx = this.canvas.getContext("2d");
        this.xTor = rLimit * 2 / width;
        this.yToi = iLimit * 2 / height;
        this.startingX = 0;
        this.startingY = 0;
        this.dragging = false;
        this.timer = null;
        updateAll();
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.addEventListener("mousedown", this.mousedown.bind(this));
        this.canvas.addEventListener("wheel", this.onwheel.bind(this));
        document.addEventListener("click", this.click.bind(this));
        document.addEventListener("mousemove", this.mousemove.bind(this));
        this.render();
    }
    Renderer.prototype._zoom = function (centerX, centerY, zoom, qualityDecr) {
        qualityDecr = Math.ceil(qualityDecr || 1);
        this._render(0, 0, -centerX, -centerY, width, height, xIncr * qualityDecr, yIncr * qualityDecr, this.xTor / zoom, this.yToi / zoom, type);
    };
    Renderer.prototype.mousedown = function (e) {
        this.dragging = true;
        this.startingX = e.x;
        this.startingY = e.y;
    };
    Renderer.prototype.mousemove = function (e) {
        if (!this.dragging)
            return;
        centerY -= this.startingY - e.y;
        centerX -= this.startingX - e.x;
        this.startingX = e.x;
        this.startingY = e.y;
        this.fastRender();
    };
    Renderer.prototype.click = function (e) {
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("click", this.click);
        this.startingX = null;
        this.startingY = null;
        this.dragging = false;
        this.render();
    };
    Renderer.prototype.onwheel = function (e) {
        var deltaY = 0;
        e.preventDefault();
        if (e.deltaY)
            deltaY = e.deltaY;
        else if (e.wheelDelta)
            deltaY = -e.wheelDelta;
        zoom = Math.max(0.1, zoom * (1 + (deltaY / 100)));
        this.fastRender();
    };
    Renderer.prototype.fastRender = function () {
        var _this = this;
        this._zoom(centerX, centerY, zoom, 8);
        if (!this.timer)
            this.timer = setTimeout(function () {
                _this.render();
            }, 100);
        else {
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                _this.render();
            }, 100);
        }
    };
    Renderer.prototype._render = function (startX, startY, centerX, centerY, endX, endY, stepX, stepY, xTor, yToi, type) {
        var iteratingComplex = new Complex(0, 0);
        var constant = new Complex(constantR, constantI);
        var alg = julia2;
        if (type === TYPE.JULIA)
            alg = julia;
        else if (type === TYPE.MANDELBROT)
            alg = null;
        for (var x = startX; x < endX; x += stepX)
            for (var y = startY; y < endY; y += stepY) {
                iteratingComplex.r = xTor * ((centerX + x) - width / 2);
                iteratingComplex.i = yToi * ((centerY + y) - height / 2);
                this.ctx.fillStyle = "hsl(" + Math.round(255 * (alg(iteratingComplex, constant, iterations) / iterations))
                    + ", 100%, 50%)";
                this.ctx.fillRect(x, y, stepX, stepY);
            }
    };
    Renderer.prototype.render = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.timer) {
                clearTimeout(_this.timer);
                _this.timer = null;
            }
            console.time("fullRender");
            _this._zoom(centerX, centerY, zoom);
            console.timeEnd("fullRender");
        }, 0);
    };
    return Renderer;
})();
