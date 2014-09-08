var Plane = Sprite.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.r = -1.57; // Facing Up
        t.ts = 0.034; // 2 degrees
        t.maxSpeed = 350;
        t.va = 45;
        t.fr = 1250;

        AF.extend(this, args);

        t.ammo = EBullet;
        t.breakable = true;
        t.points = 25;

        t.radius = 20 * t.s;

        // Default Sprite
        t.img = t.cfg['p5'];

        // Body Config
        var bc = [{
            radius: t.radius
        }];

        this.addBodies(bc);

        t.sounds = {
            gun: 'egun',
            die: 'edie',
            hit: 'ehit'
        };
    },
    step: function(dt) {
        var t = this;
        t._super(dt);

        if (t.breakable && t.broken === undefined && t.hp < 6) {
            t.broken = M.random() > 0.5 ? true : false;
            if (t.broken) {
                t.g = true;
                t.behavior = new BMayday(t);
                t.target = null;
            }
        }

        if (AF.inViewport(t)) {
            var dirD = AF.wrapAngle(t.r - M.PI);
            var absA = M.abs(AF.radToDeg(dirD));

            var imgCode;

            if (108 >= absA && absA >= 72) {
                imgCode = 'p5';
            } else if (126 >= absA && absA >= 54) {
                imgCode = 'p4';
            } else if (144 >= absA && absA >= 38) {
                imgCode = 'p3';
            } else if (162 >= absA && absA >= 18) {
                imgCode = 'p2';
            } else {
                imgCode = 'p1';
            }

            t.img = t.cfg[imgCode];
        }
    },
    collide: function(obj) {
        if (obj.isPlayerWeapon()) {
            this.hp -= obj.damage;
            game.ace.powerUp(2);
            game.sfx.play(this.sounds.hit);
        }
    },
    kill: function() {
        this._super();
        game.cam.shake = 50;

        game.addChild(new Emitter({
            position: this.p.copy(),
            positionVariance: new V2(25, 25),
            directionVariance: 360,
            size: 20,
            sizeVariance: 5,
            endSize: 20,
            endSizeVariance: 5,
            life: 300,
            lifeVariance: 200,
            color: [106, 119, 127, 1],
            constColor: true,
            maxParticles: 6,
            duration: 0
        }));
    }
});

var Mig = Plane.extend({
    step: function(dt) {
        var t = this;

        if (!t.broken) {
            var ahead = t.p.copy().add(t.v.copy().norm().mult(t.range));

            if (t.p.y + ahead.y >= 0 && t.p.y < 0) {
                // Simple ocean avoidance with abitrary chase point to turn away
                t.behavior = new BChase(t, {
                    p: new V2(t.p.x + t.v.x * 20, t.p.y - 230)
                });
            } else if (t.tDist < 300) {
                // Evade if ace is close
                t.behavior = new BEvade(t, t.target);
            } else {
                t.behavior = new BChase(t, t.target);
            }
        }

        t._super(dt);
    }
});
