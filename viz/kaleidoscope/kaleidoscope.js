var _this = this;
var HALF_PI = Math.PI / 2, TWO_PI = Math.PI * 2, TIMESLICE = 1000 / 20;
var Kaleidoscope = (function () {
    function Kaleidoscope(options) {
        this.domElement = document.getElementById('canv');
        this.context = this.domElement.getContext('2d');
        this.offsetRotation = 0.0;
        this.offsetScale = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.radius = 260;
        this.slices = 12;
        this.zoom = 1.0;
        options = options || {};
        for (var key in options)
            this[key] = options[key];
        this.context.fillStyle = "purple";
        this.context.fillRect(0, 0, this.radius / 3, this.radius);
    }
    Kaleidoscope.prototype.draw = function () {
        var _this = this;
        this.domElement.width = this.domElement.height = this.radius * 2;
        this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
        var scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
        var step = TWO_PI / this.slices;
        var cx = this.image.width / 2;
        range(0, this.slices - 1).forEach(function (index) {
            _this.context.save();
            _this.context.translate(_this.radius, _this.radius);
            _this.context.rotate(index * step);
            _this.context.beginPath();
            _this.context.moveTo(-0.5, -0.5);
            _this.context.arc(0, 0, _this.radius, step * -0.51, step * 0.51);
            _this.context.lineTo(0.5, 0.5);
            _this.context.closePath();
            _this.context.rotate(HALF_PI);
            _this.context.scale(scale, scale);
            _this.context.scale([-1, 1][index % 2], 1);
            _this.context.translate(_this.offsetX - cx, _this.offsetY);
            _this.context.rotate(_this.offsetRotation);
            _this.context.scale(_this.offsetScale, _this.offsetScale);
            _this.context.fill();
            _this.context.restore();
        });
        this.context.fill();
        this.context.restore();
    };
    Kaleidoscope.prototype.disable = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.context.canvas.addEventListener('dragleave', this.disable.bind(this));
        this.context.canvas.addEventListener('dragenter', this.disable.bind(this));
        this.context.canvas.addEventListener('dragover', this.disable.bind(this));
        this.context.canvas.addEventListener('drop', this.onDrop.bind(this));
    };
    Kaleidoscope.prototype.onDrop = function (event) {
        var _this = this;
        var context = document, filter = /^image/i;
        event.stopPropagation();
        event.preventDefault();
        var file = event.dataTransfer.files[0];
        if (filter.test(file.type)) {
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.image.onload = function () { return _this.draw(); };
                _this.image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    return Kaleidoscope;
})();
var kaleidoscope = new Kaleidoscope({ radius: 400 }), gui = new dat.GUI(), options = {
    interactive: true,
    ease: 0.1
}, tx = kaleidoscope.offsetX, ty = kaleidoscope.offsetY, tr = kaleidoscope.offsetRotation, updateK = function (k) {
    if (options.interactive) {
        var delta = tr - k.offsetRotation, theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        k.offsetX += (tx - k.offsetX) * options.ease;
        k.offsetY += (ty - k.offsetY) * options.ease;
        k.offsetRotation += (theta - k.offsetRotation) * options.ease;
        k.draw();
    }
    setTimeout(function () { return updateK(k); }, TIMESLICE);
}, onMouseMoved = function (event) {
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, dx = event.pageX / window.innerWidth, dy = event.pageY / window.innerHeight, hx = dx - 0.5, hy = dy - 0.5;
    _this.tx = hx * kaleidoscope.radius * -2;
    _this.ty = hy * kaleidoscope.radius * 2;
    _this.tr = Math.atan2(hy, hx);
    updateK(kaleidoscope);
}, onChange = function (k) {
    k.draw();
    gui.__controllers.forEach(function (v) { return options.interactive ? null : v.onChange(); });
}, boot = function (k, g) {
    k.domElement.style.left = '50%';
    k.domElement.style.top = '50%';
    g.add(k, 'zoom').min(0.25).max(2.0);
    g.add(k, 'slices').min(6).max(32).step(2);
    g.add(k, 'radius').min(200).max(500);
    g.add(k, 'offsetX').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen();
    g.add(k, 'offsetY').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen();
    g.add(k, 'offsetRotation').min(-Math.PI).max(Math.PI).listen();
    g.add(k, 'offsetScale').min(0.5).max(4.0);
    g.add(options, 'interactive').listen();
    g.close();
    kaleidoscope.image = new Image();
    kaleidoscope.image.onload = function (evt) { return onChange(kaleidoscope); };
    kaleidoscope.image.src = 'http://blogjob.com/jordana/files/2014/11/Fruit-Candy-Sweet-HD-Photoshoot.jpg';
    window.addEventListener('mousemove', onMouseMoved);
};
boot(kaleidoscope, gui);
function range(start, end, step) {
    var range = [];
    for (var count = start; count <= end; count += (step || 1))
        range.push(count);
    return range;
}
