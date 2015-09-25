var World = (function () {
    function World() {
        this.items = [];
        this.size = { x: 720, y: 480 };
        this.renderer = new Renderer("canvas", this.size);
        this.intervalMs = 50;
        this.interval = setInterval(this.onTimeSlice.bind(this), this.intervalMs);
        this.lastRendered = Date.now();
        this.timesliceListeners = [this.moveAll.bind(this)];
        for (var i = 0; i < 20; i++)
            this.items.push(randomize(new Person, this.size));
    }
    World.prototype.moveAll = function (ms) {
        var _this = this;
        var t = Date.now();
        forEach(this.items, Person, function (v) {
            _this.movePerson(v, ms);
            if (v.death < t)
                _this.items.splice(_this.items.indexOf(v), 1);
        });
    };
    World.prototype.movePerson = function (v, ms) {
        v.move(ms);
        if (v.x > this.size.x
            || v.y > this.size.y
            || v.x < 0
            || v.y < 0)
            v.direction = Math.random() * 360;
    };
    World.prototype.onTimeSlice = function () {
        this.renderer.clearScene();
        var msElapsed = this.lastRendered - Date.now();
        for (var i = 0; i < this.timesliceListeners.length; i++)
            this.timesliceListeners[i](msElapsed);
        this.renderer.render(this.items);
        this.lastRendered = Date.now();
    };
    return World;
})();
var GENDER;
(function (GENDER) {
    GENDER[GENDER["MALE"] = 0] = "MALE";
    GENDER[GENDER["FEMALE"] = 1] = "FEMALE";
})(GENDER || (GENDER = {}));
function forEach(arr, c, cb) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] instanceof c)
            cb(arr[i]);
    }
}
function percentChance(a, b) {
    if ((Math.random() * 100) < a)
        b();
}
function randomize(a, b) {
    a.x = Math.floor(Math.random() * b.x);
    a.y = Math.floor(Math.random() * b.y);
    if (a instanceof Person) {
        a.birth = Date.now() - Math.floor(Math.random() * 20000);
        a.gender = GENDER.FEMALE;
        percentChance(50, function () { return a.gender = GENDER.MALE; });
        a.speed = Math.random() * 30;
        a.direction = Math.random() * 360;
    }
    return a;
}
var Person = (function () {
    function Person() {
        this.movePlugins = [];
        this.birth = Date.now();
        this.death = this.birth + Math.floor(Math.random() * 50000);
        this.x = 0;
        this.y = 0;
        this.size = 10;
    }
    Object.defineProperty(Person.prototype, "child", {
        get: function () {
            return (Date.now() - this.birth) < 10000;
        },
        enumerable: true,
        configurable: true
    });
    Person.prototype.move = function (ms) {
        var length = this.speed * (ms / 1000);
        this.x += Math.cos(this.direction) * length;
        this.y += Math.sin(this.direction) * length;
    };
    Person.prototype.reverse = function () {
        this.direction = (this.direction + 180) % 360;
    };
    Object.defineProperty(Person.prototype, "color", {
        get: function () {
            if (this.gender === GENDER.MALE)
                return this.child ? "orange" : "blue";
            if (this.gender === GENDER.FEMALE)
                return this.child ? "pink" : "purple";
        },
        enumerable: true,
        configurable: true
    });
    Person.prototype.render = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };
    return Person;
})();
var Renderer = (function () {
    function Renderer(id, bounds) {
        this.canvasId = id;
        this.canvas = document.getElementById(this.canvasId);
        this.canvas.width = bounds.x;
        this.canvas.height = bounds.y;
        this.ctx = this.canvas.getContext("2d");
    }
    Renderer.prototype.render = function (items) {
        for (var i = 0; i < items.length; i++)
            items[i].render(this.ctx);
    };
    Renderer.prototype.clearScene = function () {
        this.canvas.width = this.canvas.width;
    };
    return Renderer;
})();
new World;
