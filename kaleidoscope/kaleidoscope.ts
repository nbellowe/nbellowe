var HALF_PI = Math.PI / 2,
    TWO_PI = Math.PI * 2,
    //20 times a second
    TIMESLICE = 1000 / 20;

class Kaleidoscope {
    domElement = <HTMLCanvasElement>document.getElementById('canv');
    context = this.domElement.getContext('2d')
    image: HTMLImageElement;
    offsetRotation = 0.0
    offsetScale = 1.0
    offsetX = 0.0
    offsetY = 0.0
    radius = 260
    slices = 12
    zoom = 1.0
    constructor(options) {
        options = options || {};
        for (var key in options)
            this[key] = options[key];
        this.context.fillStyle = "purple";
        this.context.fillRect(0, 0, this.radius / 3, this.radius)
    }
    draw() {
        this.domElement.width = this.domElement.height = this.radius * 2
        this.context.fillStyle = this.context.createPattern(this.image, 'repeat')

        var scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height))
        var step = TWO_PI / this.slices
        var cx = this.image.width / 2;
        //console.error("Attempted draw");
        range(0, this.slices).forEach(index => {
            this.context.save()
            this.context.translate(this.radius, this.radius)
            this.context.rotate(index * step)

            this.context.beginPath()
            this.context.moveTo(- 0.5, -0.5)
            this.context.arc(0, 0, this.radius, step * -0.51, step * 0.51)
            this.context.lineTo(0.5, 0.5)
            this.context.closePath()

            this.context.rotate(HALF_PI)
            this.context.scale(scale, scale)
            this.context.scale([-1, 1][index % 2], 1)
            this.context.translate(this.offsetX - cx, this.offsetY)
            this.context.rotate(this.offsetRotation)
            this.context.scale(this.offsetScale, this.offsetScale)

            this.context.fill()
            this.context.restore()
        });
        this.context.fill()
        this.context.restore()
    }

    disable(event) {
        event.stopPropagation()
        event.preventDefault()
        this.context.canvas.addEventListener('dragleave', this.disable.bind(this))
        this.context.canvas.addEventListener('dragenter', this.disable.bind(this))
        this.context.canvas.addEventListener('dragover', this.disable.bind(this))
        this.context.canvas.addEventListener('drop', this.onDrop.bind(this))
    }

    onDrop(event) {
        var context = document,
            filter = /^image/i;
        event.stopPropagation()
        event.preventDefault()
        var file = event.dataTransfer.files[0]
        if (filter.test(file.type)) {
            var reader = new FileReader()
            reader.onload = (event) => this.image.src = (<any>event.target).result;
            debugger;
            reader.readAsDataURL(file)
        }
    }
}
// Init view
var kaleidoscope = new Kaleidoscope({ radius: 400 }),
    gui = <IGui><any>new dat.GUI(),
    options = {
        interactive: true,
        ease: 0.1
    },
    // Mouse events
    tx = kaleidoscope.offsetX,
    ty = kaleidoscope.offsetY,
    tr = kaleidoscope.offsetRotation,
    updateK = (k: Kaleidoscope) => {
        if (options.interactive) {
            var delta = tr - k.offsetRotation,
                theta = Math.atan2(Math.sin(delta), Math.cos(delta));
            k.offsetX += (tx - k.offsetX) * options.ease;
            k.offsetY += (ty - k.offsetY) * options.ease;
            k.offsetRotation += (theta - k.offsetRotation) * options.ease;
            //console.error("Redrawing at ", k.offsetX, k.offsetY)
            k.draw()
        }
        setTimeout(() => updateK(k), TIMESLICE)
    },
    onMouseMoved = (event) => {
        var cx = window.innerWidth / 2,
            cy = window.innerHeight / 2,
            dx = event.pageX / window.innerWidth,
            dy = event.pageY / window.innerHeight,
            hx = dx - 0.5,
            hy = dy - 0.5;

        this.tx = hx * kaleidoscope.radius * -2;
        this.ty = hy * kaleidoscope.radius * 2;
        this.tr = Math.atan2(hy, hx)
        //console.error("mouse moved", this.tr)
        updateK(kaleidoscope)
    },
    onChange = (k: Kaleidoscope) => {
        k.draw()
        gui.__controllers.forEach(v => options.interactive ? null : v.onChange())
    },
    boot = (k: Kaleidoscope, g: IGui) => {
        k.domElement.style.left = '50%';
        k.domElement.style.top = '50%';

        g.add(k, 'zoom').min(0.25).max(2.0)
        g.add(k, 'slices').min(6).max(32).step(2)
        g.add(k, 'radius').min(200).max(500)
        g.add(k, 'offsetX').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen()
        g.add(k, 'offsetY').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen()
        g.add(k, 'offsetRotation').min(-Math.PI).max(Math.PI).listen()
        g.add(k, 'offsetScale').min(0.5).max(4.0)
        g.add(options, 'interactive').listen()
        g.close()

        kaleidoscope.image = new Image();
        kaleidoscope.image.onload = evt => onChange(kaleidoscope);
        kaleidoscope.image.src = 'http://blogjob.com/jordana/files/2014/11/Fruit-Candy-Sweet-HD-Photoshoot.jpg'

        window.addEventListener('mousemove', onMouseMoved)

    }

boot(kaleidoscope, gui);

interface IGui {
    add(a?, b?, c?, d?, e?): IGui;
    min(num: number): IGui;
    max(num: number): IGui;
    step(num: number): IGui;
    listen(): IGui;
    close();
    __controllers: any[];
}

function range(start, end, step?) {
    var range = []
    for (var count = start; count <= end; count += (step || 1))
        range.push(count);
    return range;
}
