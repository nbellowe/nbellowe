/// <reference path="../libs/three/three.d.ts"/>


(function(d) {
    var script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function() {
        // remote script has loaded
    };
    script.src = 'http://www.google-analytics.com/ga.js';
    d.getElementsByTagName('head')[0].appendChild(script);
} (document));
function makeSlideInput(id, callbackOnChange, min, max, step?) {
    var el: any = document.getElementById(id)
    if (!el) {
        console.error(id + " doesn't exist")
        return;
    }
    el.addEventListener("change", function(evt) {
        callbackOnChange((<HTMLTextAreaElement> evt.srcElement).value);
        Render3D.fastRender()
    })
    if (step) el.step = step;
    el.min = min || "";
    el.max = max || "";
    el.style.width = "500px";
}

function makeComboInput(id, callbackOnChange) {
    var el: any = document.getElementById(id)
    if (!el) {
        console.error(id + " doesn't exist")
        return;
    }
    el.addEventListener("change", function(evt) {
        callbackOnChange((<HTMLTextAreaElement> evt.srcElement).value);
        Render3D.fastRender();
    })
}

function update(id, val) {
    var el: any = document.getElementById(id)
    if (!el)
        return console.error(id + " doesn't exist")
    el.value = el.val = val;
    el.width = "500px";
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
enum TYPE { JULIA2, JULIA, MANDELBROT }

var type: TYPE = TYPE.JULIA2,
    width = 500,
    height = 500,
    depth = 1,
    iLimit = 1,
    rLimit = 1,
    xIncr = 1,
    yIncr = 1,
    zIncr = 1000,
    constantR = -.06,
    constantI = .67,
    numBuffered = 10,
    centerX = 0,
    centerY = 0,
    centerZ = 0,
    zoom = 1,
    iterations = 100;

makeSlideInput("sizeX", val => { width = +val }, 0, 1000);
makeSlideInput("sizeY", val => { height = +val }, 0, 1000);
makeSlideInput("iLimit", val => { iLimit = +val }, -1, 1, .01);
makeSlideInput("rLimit", val => { rLimit = +val }, -1, 1, .01);
makeSlideInput("xIncr", val => { xIncr = +val }, 1, 10);
makeSlideInput("yIncr", val => { yIncr = +val }, 1, 10);
makeSlideInput("constantR", val => { constantR = +val }, -1, 1, .01);
makeSlideInput("constantI", val => { constantI = +val }, -1, 1, .01);
makeSlideInput("iterations", val => { iterations = +val }, 0, 500);
makeSlideInput("centerX", val => { centerX = +val }, -1000, 1000);
makeSlideInput("centerY", val => { centerY = +val }, -1000, 1000);
makeSlideInput("zoom", val => { zoom = +val }, .25, 20, .1);
makeComboInput("type", val => { type = val });

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

class Render3D {
    static initialized = false;

    static xTor = rLimit * 2 / width;
    static yToi = iLimit * 2 / height;
    static zTocr = rLimit * 2 / height;
    static startX = 0;
    static startY = 0;
    static startZ = 0;
    static endX = 500;
    static endY = 500;
    static endZ = 1;
    static stepX = 50;
    static stepY = 50;
    static stepZ = 50;

    static timer = null;
    static fastRender() {
        Render3D.makeRenderTimer(100);
    }

    static makeRenderTimer(time: number) {
        clearTimeout(Render3D.timer);
        Render3D.timer = setTimeout(() => Render3D.render(), time);
    }

    static scene = new THREE.Scene()
    static camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    static renderer = new THREE.WebGLRenderer();
    static makeCube(x, y, z, sizeX, sizeY, sizeZ, hex) {
        console.error(arguments)
        var cube = new THREE.Mesh(new THREE.BoxGeometry(sizeX / 100, sizeY / 100, sizeZ / 100), new THREE.MeshLambertMaterial({ color: hex }));
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        Render3D.scene.add(cube);
    }
    static render() {
        updateAll();
        // create the particle variables

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
        Render3D.scene = new THREE.Scene()

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
        var max = 0xFF
        if (type === TYPE.JULIA)
            alg = julia;
        else if (type === TYPE.MANDELBROT)
            alg = null

        var geometry = new THREE.Geometry();
        for (var i = 3; i < 20000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = i;
            vertex.y = i;
            vertex.z = i;
            geometry.vertices.push(vertex);
        }

        var color = [1, 1, 0.5]
        var size = 5;

        var material = new (<any> THREE).PointsMaterial({ size: size });
        var particles = new (<any> THREE).Points(geometry, material);

        Render3D.scene.add(particles);

        this.camera.lookAt(this.scene.position);


        /*
            var material = new THREE.ParticleBasicMaterial({ color: 0x3AB2F9 });
            for (var x = Render3D.startX; x < Render3D.endX; x += Render3D.stepX)
                for (var y = Render3D.startY; y < Render3D.endY; y += Render3D.stepY)
                    for (var z = Render3D.startZ; z < Render3D.endZ; z += Render3D.stepZ) {
                        iteratingComplex.r = Render3D.xTor * ((centerX + x) - width / 2)
                        iteratingComplex.i = Render3D.yToi * ((centerY + y) - height / 2)
                        constant.i = Render3D.zTocr * ((centerZ + z) - depth / 2)
                        var a = alg(iteratingComplex, constant, iterations)
                        if(a < 50){
                            //var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                            //Render3D.makeCube(x, y, z, Render3D.stepX, Render3D.stepY, Render3D.stepZ, color);
                            console.error(x,y,z, a);
                            scene.add(new THREE.Points(new THREE.Vector3(x,y,z));
                        }
                    }
        */
        Render3D.renderer.render(this.scene, this.camera);
        console.timeEnd("3dfullRender")
        //    window.requestAnimationFrame(Render3D.render);
    }
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
