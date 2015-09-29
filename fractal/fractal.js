/// <reference path="../libs/three/three.d.ts"/>
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
        Render3D.fastRender();
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
        Render3D.fastRender();
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
var type = TYPE.JULIA2, width = 500, height = 500, depth = 1, iLimit = 1, rLimit = 1, xIncr = 1, yIncr = 1, zIncr = 1000, constantR = -.06, constantI = .67, numBuffered = 10, centerX = 0, centerY = 0, centerZ = 0, zoom = 1, iterations = 100;
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
var Render3D = (function () {
    function Render3D() {
    }
    Render3D.fastRender = function () {
        Render3D.makeRenderTimer(100);
    };
    Render3D.makeRenderTimer = function (time) {
        clearTimeout(Render3D.timer);
        Render3D.timer = setTimeout(function () { return Render3D.render(); }, time);
    };
    Render3D.makeCube = function (x, y, z, sizeX, sizeY, sizeZ, hex) {
        console.error(arguments);
        var cube = new THREE.Mesh(new THREE.BoxGeometry(sizeX / 100, sizeY / 100, sizeZ / 100), new THREE.MeshLambertMaterial({ color: hex }));
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        Render3D.scene.add(cube);
    };
    Render3D.render = function () {
        updateAll();
        if (Render3D.timer) {
            clearTimeout(Render3D.timer);
            Render3D.timer = null;
        }
        if (!Render3D.initialized) {
            document.getElementById("fractal").appendChild(Render3D.renderer.domElement);
            Render3D.initialized = true;
        }
        Render3D.renderer.setSize(500, 500);
        Render3D.camera.position.z = 5;
        Render3D.scene = new THREE.Scene();
        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 10;
        Render3D.scene.add(pointLight);
        console.time("3dfullRender");
        var width = Render3D.renderer.domElement.width;
        var height = Render3D.renderer.domElement.height;
        var depth = 10;
        var iteratingComplex = new Complex(0, 0);
        var constant = new Complex(constantR, constantI);
        var alg = julia2;
        var max = 0xFF;
        if (type === TYPE.JULIA)
            alg = julia;
        else if (type === TYPE.MANDELBROT)
            alg = null;
        var geometry = new THREE.Geometry();
        for (var i = 3; i < 20000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = i;
            vertex.y = i;
            vertex.z = i;
            geometry.vertices.push(vertex);
        }
        var color = [1, 1, 0.5];
        var size = 5;
        var material = new THREE.PointsMaterial({ size: size });
        var particles = new THREE.Points(geometry, material);
        Render3D.scene.add(particles);
        this.camera.lookAt(this.scene.position);
        Render3D.renderer.render(this.scene, this.camera);
        console.timeEnd("3dfullRender");
    };
    Render3D.initialized = false;
    Render3D.xTor = rLimit * 2 / width;
    Render3D.yToi = iLimit * 2 / height;
    Render3D.zTocr = rLimit * 2 / height;
    Render3D.startX = 0;
    Render3D.startY = 0;
    Render3D.startZ = 0;
    Render3D.endX = 500;
    Render3D.endY = 500;
    Render3D.endZ = 1;
    Render3D.stepX = 50;
    Render3D.stepY = 50;
    Render3D.stepZ = 50;
    Render3D.timer = null;
    Render3D.scene = new THREE.Scene();
    Render3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    Render3D.renderer = new THREE.WebGLRenderer();
    return Render3D;
})();
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l;
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
