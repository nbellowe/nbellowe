function makeSlideInput(id, callbackOnChange, min, max) {
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
        (new Renderer).render();
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

// parameters
var type: TYPE = TYPE.JULIA2,
    width = 500,
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

makeSlideInput("sizeX", val => { width = +val }, 0, 1000);
makeSlideInput("sizeY", val => { height = +val }, 0, 1000);
makeSlideInput("iLimit", val => { iLimit = +val }, -1.01, 1.01);
makeSlideInput("rLimit", val => { rLimit = +val }, -1.01, 1.01);
makeSlideInput("xIncr", val => { xIncr = +val }, 1, 10);
makeSlideInput("yIncr", val => { yIncr = +val }, 1, 10);
makeSlideInput("constantR", val => { constantR = +val }, -1.01, 1.01);
makeSlideInput("constantI", val => { constantI = +val }, -1.01, 1.01);
makeSlideInput("iterations", val => { iterations = +val }, 0, 500);
makeSlideInput("centerX", val => { centerX = +val }, -1000, 1000);
makeSlideInput("centerY", val => { centerY = +val }, -1000, 1000);
makeSlideInput("zoom", val => { zoom = +val }, .25, 20);
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
        this.canvas.addEventListener("wheel", this.onwheel.bind(this))
        document.addEventListener("click", this.click.bind(this));
        document.addEventListener("mousemove", this.mousemove.bind(this));
        this.render();
    }

    _zoom(centerX, centerY, zoom, qualityDecr?) {
        qualityDecr = Math.ceil(qualityDecr || 1);
        this._render(0, 0, -centerX, -centerY, width, height, xIncr * qualityDecr, yIncr * qualityDecr, this.xTor / zoom, this.yToi / zoom, type)
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
        if (!this.dragging) return;

        centerY -= this.startingY - e.y;
        centerX -= this.startingX - e.x;
        this.startingX = e.x;
        this.startingY = e.y;
        this.fastRender();
    }

    click(e: MouseEvent) {
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("click", this.click);
        this.startingX = null;
        this.startingY = null;
        this.dragging = false;
        this.render()
    }
    onwheel(e) {
        var deltaY = 0;
        e.preventDefault();

        if (e.deltaY)  // FireFox 17+ (IE9+, Chrome 31+?)
            deltaY = e.deltaY;
        else if (e.wheelDelta)
            deltaY = -e.wheelDelta;

        zoom = Math.max(0.1, zoom * (1 + (deltaY / 100)));
        this.fastRender();
    }

    timer = null;
    fastRender() {
        this._zoom(centerX, centerY, zoom, 8);
        if (!this.timer)
            this.timer = setTimeout(() => {
                this.render()
            }, 100);
        else {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.render()
            }, 100);
        }
    }

    _render(startX, startY, centerX, centerY, endX, endY, stepX, stepY, xTor, yToi, type: TYPE) {
        var iteratingComplex = new Complex(0, 0);
        var constant = new Complex(constantR, constantI);
        var alg = julia2;
        if (type === TYPE.JULIA)
            alg = julia;
        else if (type === TYPE.MANDELBROT)
            alg = null
        for (var x = startX; x < endX; x += stepX)
            for (var y = startY; y < endY; y += stepY) {
                iteratingComplex.r = xTor * ((centerX + x) - width / 2)
                iteratingComplex.i = yToi * ((centerY + y) - height / 2)
                this.ctx.fillStyle = "hsl(" + Math.round(255 * (alg(iteratingComplex, constant, iterations) / iterations))
                + ", 100%, 50%)";
                this.ctx.fillRect(x, y, stepX, stepY);
            }
    }
    render() {
        setTimeout(() => {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            console.time("fullRender")
            this._zoom(centerX, centerY, zoom)
            console.timeEnd("fullRender")
        }, 0)
    }
}
/*
class WebGLFractal {
    vertices: Uint8Array;
    canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("fractal");
    gl: WebGLRenderingContext = this.canvas.getContext("experimental-webgl");
    shaderProgram = this.gl.createProgram();
    vertexPositionBuffer = this.gl.createBuffer();
    fragmentShader = this.getShader(this.gl, "shader-fs");
    vertexShader = this.getShader(this.gl, "shader-vs");
    aVertexPosition: number;
    aPlotPosition: number;
    centerOffsetX = 0;
    centerOffsetY = 0;
    baseCorners = [
        [0.7, 1.2],
        [-2.2, 1.2],
        [0.7, -1.2],
        [-2.2, -1.2],
    ];
    corners = [];
    itemSize = 2;
    numItems = 4;


    webGLStart() {
        window["wgl"] = this;
        //init shaders

        this.gl.attachShader(this.shaderProgram, this.vertexShader);
        this.gl.attachShader(this.shaderProgram, this.fragmentShader);
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS))
            alert("Could not initialise shaders");


        this.aVertexPosition = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.aVertexPosition);
        this.aPlotPosition = this.gl.getAttribLocation(this.shaderProgram, "aPlotPosition");
        this.gl.enableVertexAttribArray(this.aPlotPosition);
        this.gl.useProgram(this.shaderProgram);

        //init buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        var vertices = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        //draw scene
        console.error("Drawing scene.")
        this.drawScene();
        setInterval(this.drawScene.bind(this), 15);
    }

    drawScene() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.aVertexPosition, this.itemSize, this.gl.FLOAT, false, 0, 0);
        var plotPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, plotPositionBuffer);
        var cornerIx;
        for (cornerIx in this.baseCorners) {
            var x = this.baseCorners[cornerIx][0];
            var y = this.baseCorners[cornerIx][1];
            this.corners.push(x / zoom + this.centerOffsetX);
            this.corners.push(y / zoom + this.centerOffsetY);
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.corners), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aPlotPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.deleteBuffer(plotPositionBuffer)
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }

    getShader(gl, id) {
        var shaderScript = <any> document.getElementById(id);
        if (!shaderScript)
            return null;
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3)
                str += k.textContent;
            k = k.nextSibling;
        }
        var shader;
        if (shaderScript.type === "x-shader/x-fragment")
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        else if (shaderScript.type === "x-shader/x-vertex")
            shader = gl.createShader(gl.VERTEX_SHADER);
        else
            return null;
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
}*/
new Renderer;
