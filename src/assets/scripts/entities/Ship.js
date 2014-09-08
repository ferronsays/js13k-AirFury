var Ship = Sprite.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.turrets = [];

        t.hp = 50;

        t.radius = 60;

        AF.extend(t, args);

        t.points = 75;

        // Turret cfg
        var tc = [
            [-17, 0],
            [50, 5]
        ];

        // Default img
        this.img = this.cfg['s1'];
        // Update position off the water level.  Half width because the spire
        this.p.y -= this.img.w / 2;

        for (var i = 0; i < tc.length; i++) {
            var tr = new Turret({
                p: t.p.copy().add(new V2(tc[i][0], tc[i][1])),
                target: t.target,
                range: 1200
            });
            t.turrets.push(tr);
            game.nodes.push(tr);
        }
        // Nullify the ship's target since it doesn't need it
        t.target = null;

        // Body Config
        var bc = [{
            pOffset: new V2(15, 5),
            radius: 20
        }, {
            pOffset: new V2(-45, 15),
            radius: 18
        }, {
            pOffset: new V2(50, 12),
            radius: 8
        }];

        this.addBodies(bc);

        t.sounds = {
            die: 'sdie',
            hit: 'shit'
        };
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
        for (var i = 0; i < this.turrets.length; i++) {
            this.turrets[i].kill();
        }

        game.addChild(new Emitter({
            position: new V2(this.p.x, this.p.y - 30),
            positionVariance: new V2(45, 25),
            dir: -M.PI / 2,
            directionVariance: 30,
            speed: 150,
            speedVariance: 25,
            size: 25,
            sizeVariance: 10,
            endSize: 25,
            endSizeVariance: 10,
            life: 800,
            lifeVariance: 300,
            color: [106, 119, 127, 1],
            constColor: true,
            maxParticles: 15,
            duration: 0
        }));
    }
});
