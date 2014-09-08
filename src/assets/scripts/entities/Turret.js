var Turret = GameObject.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.w = 15;
        t.h = 5;

        t.g = false;
        t.fr = 1500;
        t.points = 15;

        AF.extend(t, args);

        t.ammo = SBullet;

        // Body Config
        var bc = [{
            radius: t.w / 2
        }];

        t.addBodies(bc);

        t.sounds = {
            gun: 'sgun',
            die: 'die',
            hit: 'hit'
        };
    },

    step: function(dt) {
        var t = this;

        t._super(dt);

        //var mp = t.target.p.copy();
        t.r = t.target.p.copy().sub(t.p).norm().heading();
    },
    draw: function(c) {
        var t = this;

        if (!t.alive) {
            return;
        }

        c.save();
        c.translate(t.p.x, t.p.y);
        c.rotate(t.r);
        c.fillStyle = '#000';
        c.fillRect(0, -t.h / 2, t.w, t.h);
        c.restore();
    },
    fire: function() {
        var t = this;

        // TODO this is mostly copied in the ace file
        var r = t.r + AF.degToRad(AF.randRange(-8, 8));
        var vec = new V2(M.cos(t.r) * t.w, M.sin(t.r) * t.w);

        var b = new t.ammo({
            p: t.p.copy().add(vec),
            v: new V2(M.cos(r), M.sin(r)).mult(500),
            r: r,
            damage: 8,
            maxSpeed: 1000
        });

        game.addChild(b);

        game.sfx.play(t.sounds.gun);
    },
    collide: function(obj) {
        if (obj.isPlayerWeapon()) {
            this.hp -= obj.damage;
            game.ace.powerUp(0.5);
            game.sfx.play(this.sounds.hit);
        }
    },
    kill: function() {
        this._super();

        game.addChild(new Emitter({
            position: this.p.copy(),
            positionVariance: new V2(10, 10),
            directionVariance: 360,
            size: 10,
            sizeVariance: 3,
            endSize: 10,
            endSizeVariance: 3,
            life: 300,
            lifeVariance: 200,
            color: [106, 119, 127, 1],
            constColor: true,
            maxParticles: 6,
            duration: 0
        }));
    }
});
