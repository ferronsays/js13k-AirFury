var Bullet = Sprite.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.g = false;
        t.lifeSpan = 5000;
        t.damage = 4;
        t.radius = 10;
        t.maxSpeed = 500;

        AF.extend(t, args);

        // Default img
        this.img = this.cfg['b'];

        // Body Config
        var bc = [{
            pOffset: new V2(0, 0),
            radius: t.radius
        }];

        this.addBodies(bc);
    },
    step: function(dt) {
        var t = this;
        var tt = dt / 1000;

        t.v = t.v.norm().mult(t.maxSpeed * tt);

        // Collide with water
        if (t.p.y >= 0) {
            t.kill(true);
        }

        t._super(dt);
    },
    collide: function(obj) {
        if (obj instanceof Player) {
            this.kill();
        }
    },
    kill: function(isWaterDeath) {
        this._super();

        if (!AF.inViewport(this)) {
            return;
        }

        if (isWaterDeath) {
            game.addChild(new Emitter({
                position: this.p.copy(),
                dir: -M.PI/2,
                directionVariance: 0,
                size: 10,
                sizeVariance: 4,
                speed: 100,
                life: 400,
                lifeVariance: 200,
                color: [255, 255, 255, 1],
                constColor: true,
                maxParticles: 6,
                duration: 0,
                g: true
            }));
        } else {
            game.addChild(new Emitter({
                position: this.p.copy(),
                directionVariance: 360,
                size: 6,
                sizeVariance: 2,
                speed: 100,
                life: 200,
                lifeVariance: 25,
                color: [255, 255, 255, 1],
                constColor: true,
                maxParticles: 6,
                duration: 0
            }));
        }
    }
});

// Player Bullet
var PBullet = Bullet.extend({
    init: function(args) {
        this._super(args);

        this.maxSpeed = 2000;
    },
    collide: function(obj) {
        if (obj.isNPC()) {
            this.kill();
        }
    }
});

// Enemy Bullet
var EBullet = Bullet.extend({
    init: function(args) {
        this._super(args);

        // Default img
        this.img = this.cfg['b2'];
    }
});

var SBullet = EBullet.extend({
    init: function(args) {
        this._super(args);
        this.img = this.cfg['b3'];
    }
});
