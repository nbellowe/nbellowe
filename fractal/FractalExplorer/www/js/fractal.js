(function (d) {
    var script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function () {
    };
    script.src = 'http://www.google-analytics.com/ga.js';
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));
function makeSlideInput(id, callbackOnChange, min, max, step) {
    var el = document.getElementById(id);
    if (!el) {
        console.error(id + " doesn't exist");
        return;
    }
    el.addEventListener("change", function (evt) {
        callbackOnChange(evt.srcElement.value);
        Render2D.fastRender();
    });
    if (step)
        el.step = step;
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
        Render2D.fastRender();
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
makeSlideInput("iLimit", function (val) { iLimit = +val; }, -1, 1, .01);
makeSlideInput("rLimit", function (val) { rLimit = +val; }, -1, 1, .01);
makeSlideInput("xIncr", function (val) { xIncr = +val; }, 1, 10);
makeSlideInput("yIncr", function (val) { yIncr = +val; }, 1, 10);
makeSlideInput("constantR", function (val) { constantR = +val; }, -1, 1, .01);
makeSlideInput("constantI", function (val) { constantI = +val; }, -1, 1, .01);
makeSlideInput("iterations", function (val) { iterations = +val; }, 0, 500);
makeSlideInput("centerX", function (val) { centerX = +val; }, -1000, 1000);
makeSlideInput("centerY", function (val) { centerY = +val; }, -1000, 1000);
makeSlideInput("zoom", function (val) { zoom = +val; }, .25, 20, .1);
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
var Render2D = (function () {
    function Render2D() {
    }
    Render2D._zoom = function (centerX, centerY, zoom, qualityDecr) {
        qualityDecr = Math.ceil(qualityDecr || 1);
        this._render(0, 0, -centerX, -centerY, width, height, xIncr * qualityDecr, yIncr * qualityDecr, this.xTor / zoom, this.yToi / zoom, type);
    };
    Render2D.mousedown = function (e) {
        this.dragging = true;
        this.startingX = e.x;
        this.startingY = e.y;
    };
    Render2D.mousemove = function (e) {
        if (!this.dragging)
            return;
        centerY -= this.startingY - e.y;
        centerX -= this.startingX - e.x;
        this.startingX = e.x;
        this.startingY = e.y;
        this.fastRender();
    };
    Render2D.click = function (e) {
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("click", this.click);
        this.startingX = null;
        this.startingY = null;
        this.dragging = false;
        this.render();
    };
    Render2D.onwheel = function (e) {
        var deltaY = 0;
        e.preventDefault();
        if (e.deltaY)
            deltaY = e.deltaY;
        else if (e.wheelDelta)
            deltaY = -e.wheelDelta;
        zoom = Math.max(0.1, zoom * (1 + (deltaY / 100)));
        this.fastRender();
    };
    Render2D.fastRender = function () {
        this._zoom(centerX, centerY, zoom, 8);
        this.makeRenderTimer(100);
    };
    Render2D.makeRenderTimer = function (time) {
        var _this = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () { return _this.render(); }, time);
    };
    Render2D._render = function (startX, startY, centerX, centerY, endX, endY, stepX, stepY, xTor, yToi, type) {
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
    Render2D.render = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.timer) {
                clearTimeout(_this.timer);
                _this.timer = null;
            }
            updateAll();
            _this.canvas.width = width;
            _this.canvas.height = height;
            console.time("fullRender");
            _this._zoom(centerX, centerY, zoom);
            console.timeEnd("fullRender");
        }, 0);
    };
    Render2D.canvas = document.getElementById("fractal");
    Render2D.ctx = Render2D.canvas.getContext("2d");
    Render2D.xTor = rLimit * 2 / width;
    Render2D.yToi = iLimit * 2 / height;
    Render2D.startingX = 0;
    Render2D.startingY = 0;
    Render2D.dragging = false;
    Render2D.timer = null;
    return Render2D;
})();
var Render3D = (function () {
    function Render3D() {
    }
    Render3D._zoom = function (centerX, centerY, zoom, qualityDecr) {
        qualityDecr = Math.ceil(qualityDecr || 1);
        this._render(0, 0, -centerX, -centerY, width, height, xIncr * qualityDecr, yIncr * qualityDecr, this.xTor / zoom, this.yToi / zoom, type);
    };
    Render3D.mousedown = function (e) {
        this.dragging = true;
        this.startingX = e.x;
        this.startingY = e.y;
    };
    Render3D.mousemove = function (e) {
        if (!this.dragging)
            return;
        centerY -= this.startingY - e.y;
        centerX -= this.startingX - e.x;
        this.startingX = e.x;
        this.startingY = e.y;
        this.fastRender();
    };
    Render3D.click = function (e) {
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("click", this.click);
        this.startingX = null;
        this.startingY = null;
        this.dragging = false;
        this.render();
    };
    Render3D.onwheel = function (e) {
        var deltaY = 0;
        e.preventDefault();
        if (e.deltaY)
            deltaY = e.deltaY;
        else if (e.wheelDelta)
            deltaY = -e.wheelDelta;
        zoom = Math.max(0.1, zoom * (1 + (deltaY / 100)));
        this.fastRender();
    };
    Render3D.fastRender = function () {
        this._zoom(centerX, centerY, zoom, 8);
        this.makeRenderTimer(100);
    };
    Render3D.makeRenderTimer = function (time) {
        var _this = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () { return _this.render(); }, time);
    };
    Render3D._render = function (startX, startY, centerX, centerY, endX, endY, stepX, stepY, xTor, yToi, type) {
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
    Render3D.render = function () {
        var _this = this;
        if (!this.initialized) {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth / 2, h, window.innerHeight / 2);
            document.body.appendChild(renderer.domElement);
            this.initialized = true;
        }
        else
            setTimeout(function () {
                if (_this.timer) {
                    clearTimeout(_this.timer);
                    _this.timer = null;
                }
                updateAll();
                _this.canvas.width = width;
                _this.canvas.height = height;
                console.time("fullRender");
                _this._zoom(centerX, centerY, zoom);
                console.timeEnd("fullRender");
            }, 0);
    };
    Render3D.initialized = false;
    Render3D.canvas = document.getElementById("fractal");
    Render3D.ctx = Render2D.canvas.getContext("2d");
    Render3D.xTor = rLimit * 2 / width;
    Render3D.yToi = iLimit * 2 / height;
    Render3D.startingX = 0;
    Render3D.startingY = 0;
    Render3D.dragging = false;
    Render3D.timer = null;
    return Render3D;
})();
Render3D.canvas.addEventListener("mousedown", Render2D.mousedown);
Render3D.canvas.addEventListener("wheel", Render2D.onwheel);
document.addEventListener("click", Render2D.click);
document.addEventListener("mousemove", Render2D.mousemove);
