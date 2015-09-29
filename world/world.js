var World = (function () {
    function World() {
        this.items = [];
        this.size = { x: 720, y: 480 };
        this.renderer = new Renderer("canvas", this.size);
        this.intervalMs = 10;
        this.interval = setInterval(this.onTimeSlice.bind(this), this.intervalMs);
        this.lastRendered = Date.now();
        this.timesliceListeners = [this.moveAll.bind(this)];
        for (var i = 0; i < 20; i++)
            this.makeRandomPerson();
    }
    World.prototype.moveAll = function (ms) {
        var _this = this;
        var t = Date.now();
        forEach(this.items, Person, function (v) {
            _this.movePerson(v, sortByDist(v, _this.items), ms);
            if (v.death < t)
                _this.items.splice(_this.items.indexOf(v), 1);
        });
    };
    World.prototype.movePerson = function (me, distSorted, ms) {
        me.move(ms);
        if (me.x > this.size.x
            || me.y > this.size.y
            || me.x < 0
            || me.y < 0)
            me.goRandomDirection();
        var closestPerson = distSorted[1], closestDist = dist(me, closestPerson);
        if (closestDist <= me.size) {
            if (me.gender !== closestPerson.gender)
                this.makePerson(me, closestPerson);
            me.goRandomDirection();
            closestPerson.goRandomDirection();
        }
    };
    World.prototype.makePerson = function (a, b) {
        var p = randomize(new Person, this.size);
        p.x = a.x;
        p.y = a.y;
        this.items.push(p);
    };
    World.prototype.makeRandomPerson = function () {
        this.items.push(randomize(new Person, this.size));
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
function sortByDist(p, ps) {
    return ps.map(function (b, i) { return ({
        i: i,
        val: dist(p, b)
    }); })
        .sort(function (a, b) { return a.val - b.val; })
        .map(function (x) { return ps[x.i]; });
}
function dist(a, b) {
    var x = a.x - b.x, y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
}
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
    Person.prototype.goRandomDirection = function () {
        this.direction = Math.random() * 360;
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
