var Player = Plane.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.r = -1.57; // Facing Down
        t.ts = AF.degToRad(7);
        t.maxSpeed = 500;
        t.fr = 30;
        t.hp = 100;
        t.power = 100;
        t.canPower = true;
        t.isPower = false;
        t.points = 0;

        t.soundCounter = 0;
        t.soundRate = 200;

        AF.extend(this, args);

        t.ammo = PBullet;
        t.breakable = false;

        t.jet = new Emitter({
            p: new V2(-t.img.w / 2, 0),
            dir: -M.PI,
            directionVariance: 15,
            speed: 100,
            speedVariance: 50,
            size: 4,
            sizeVariance: 2,
            life: 200,
            lifeVariance: 50,
            color: [255, 255, 255, 1],
            constColor: true,
            maxParticles: 20,
            duration: -1,
            on: false,
            g: false
        });

        t.addChild(t.jet);

        t.gun = new Emitter({
            p: new V2(t.img.w / 2, 0),
            directionVariance: 90,
            speed: 100,
            speedVariance: 50,
            size: 10,
            sizeVariance: 4,
            life: 200,
            lifeVariance: 100,
            color: [255, 255, 255, 1],
            constColor: true,
            maxParticles: 8,
            duration: -1,
            on: false,
            g: false
        });

        t.addChild(t.gun);

        t.smoke = new Emitter({
            position: t.p.copy(),
            dir: M.PI / 2,
            directionVariance: 90,
            speed: 175,
            speedVariance: 50,
            size: 6,
            sizeVariance: 2,
            endSize: 16,
            endSizeVariance: 2,
            life: 750,
            lifeVariance: 500,
            color: [106, 119, 127, 1],
            constColor: true,
            maxParticles: 10,
            duration: -1,
            on: false
        });

        game.addChild(t.smoke);

        t.sounds = {
            gun: 'gun',
            die: 'die',
            hit: 'hit'
        };
    },
    step: function(dt) {
        var t = this;
        t.a = new V2(); // TODO Why???
        t.handleInput(dt);
        t.smoke.position = t.p.copy();

        // Damage if out of bounds or under the water
        if (!AF.inBounds(t) || t.p.y > 0) {
            t.heal(-0.3);
        }

        if (t.hp < 50) {
            t.smoke.on = true;
            //if (lastHP > 50) {
            game.sfx.play('smoke');
            //}
        } else {
            t.smoke.on = false;
        }

        t._super(dt);
    },
    handleInput: function(dt) {
        var xD = 0,
            yD = 0,
            sign = 0,
            g = game,
            t = this;

        var ic = g.inputCtrl;

        if (ic.A || ic.L) {
            t.r -= t.ts;
        }

        if (ic.D || ic.R) {
            t.r += t.ts;
        }

        if (ic.W || ic.U) {
            xD = M.cos(t.r);
            yD = M.sin(t.r);
            t.a = t.a.add(new V2(xD, yD).mult(0.5));

            t.jet.on = true;
            t.g = false;

            t.soundCounter += dt;
            if (t.soundCounter > t.soundRate) {
                g.sfx.play('jet');
                t.soundCounter = 0;
            }
        } else {
            t.jet.on = false;
            t.g = true;
            t.soundCounter = t.soundRate;
        }

        if (ic.Space) {
            if (t.fc > t.fr) {
                t.fc = 0;
                t.fire();
                t.gun.on = true;
                g.cam.shake = 50;
            } else {
                t.gun.on = false;
            }
        } else {
            t.gun.on = false;
            t.heal(0.1);
        }

        if (ic.Shift) {
            if (t.canPower) {
                t.setSlomo(3, 1200);
                t.powerUp(-30 * dt / 1000);
                if (!t.isPower) {
                    g.sfx.play('pwr');
                }
                t.isPower = true;
            } else {
                t.deactivateSlomo(dt);
            }

            if (t.power === 0) {
                t.canPower = false;
            }
        } else {
            t.deactivateSlomo(dt);
            t.canPower = true;
            t.isPower = false;
        }
    },
    setSlomo: function(factor, dist) {
        game.cam.targetDistance = dist;
        game.slomo = factor;
    },
    deactivateSlomo: function(dt) {
        this.setSlomo(1, 1600);
        this.powerUp(10 * dt / 1000);
    },
    heal: function(amt) {
        var t = this;

        //var lastHP = t.hp;
        t.hp = AF.clamp(t.hp + amt, 0, 100);

        // if (t.hp < 50) {
        //     t.smoke.on = true;
        //     //if (lastHP > 50) {
        //         game.sfx.play('smoke');
        //     //}
        // } else {
        //     t.smoke.on = false;
        // }
    },
    powerUp: function(amt) {
        this.power = AF.clamp(this.power + amt, 0, 100);
    },
    collide: function(obj) {
        if (obj.isNPCWeapon()) {
            this.heal(-obj.damage);
            game.sfx.play(this.sounds.hit);
        }
    },
    kill: function() {
        this._super();
        this.jet.alive = false;
        this.smoke.alive = false;
    }
});
