var GameObject = GameNode.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        // Velocity
        t.v = new V2();
        // Acceleration
        t.a = new V2();
        // Max Speed
        t.maxSpeed = 0;
        // Angular Velocity
        t.av = 0;
        // Turn Speed
        t.ts = 0;
        // Alive
        t.alive = true;
        // Health Points
        t.hp = 8;
        // Does it move?
        t.static = false;
        // Does gravity effect it?
        t.g = true;
        // Fire Rate
        t.fr = 100;
        // Fire Counter
        t.fc = 0;
        // Target
        t.target = null;
        // Target Distance
        t.tDist = null;
        // Target Angle
        t.tAngle = null;
        // AI Behavior
        t.behavior = null;
        // Vision Angle
        t.va = 180;
        // Range
        t.range = 500;
        // Bullet Type
        t.ammo = null;
        // Scale
        t.s = 1;
        // Age
        t.age = 0;
        // LifeSpan
        t.lifeSpan = -1;
        // Collision Bodies
        t.bodies = [];
        // Bounding Circle Radius
        t.radius = 10;
        // If it can 'shut down'
        t.breakable = false;
        // Points
        t.points = 0;
        // Sounds
        t.sounds = null;

        AF.extend(this, args);

        // Generate a random id
        t.id = AF.randRange(0, 100000);
    },
    addBodies: function(cfg) {
        for (var i = 0; i < cfg.length; i++) {
            var b = new Body({
                pOffset: cfg[i].pOffset || new V2(),
                radius: cfg[i].radius,
                obj: this
            });
            this.bodies.push(b);
            game.addCollider(b);
        }
    },
    step: function(dt) {
        var t = this;

        t.age += dt / game.slomo;

        var isBreak = false;
        // Determine Break Conditions
        if (t.lifeSpan !== -1 && t.age > t.lifeSpan) {
            t.kill();
            isBreak = true;
        }
        if (!t.alive) {
            isBreak = true;
        }
        if (t.hp <= 0) {
            t.kill();
            isBreak = true;
        }
        if (t.static) {
            isBreak = true;
        }
        if (t.p.y > game.h / 2) {
            t.kill();
            isBreak = true;
        }

        // if we're leaving early, we still need to step our kids
        if (isBreak) {
            t._super(dt);
            return;
        }

        // Frame-Rate Independent Movement
        var tt = dt / (1000 * game.slomo);

        if (t.behavior) {
            t.behavior.run();
        }

        // Calculate Acceleration
        var acceleration = new V2();
        acceleration.add(t.a);

        // Add gravity
        if (t.g) {
            acceleration.add(game.gravity);
        }

        // Add acceleration to velocity
        t.v.add(acceleration).limit(t.maxSpeed * tt);
        // step position
        t.p.add(t.v);
        // step rotation
        t.r = AF.wrapAngle(t.r + t.av);

        // step Fire Counter
        t.fc += dt;

        if (t.target) {

            var p = t.target.p.copy();
            var dV = p.sub(t.p);
            t.tDist = dV.length();

            var dA = M.atan2(dV.y, dV.x);
            var d = AF.wrapAngle(dA - t.r);

            //if the target is within this object's L.O.S.
            if (M.abs(d) <= AF.degToRad(t.va / 2) && t.tDist <= t.range) {
                if (t.fc > t.fr * game.slomo) {
                    t.fc = 0;
                    t.fire();
                }
            }
        }

        t._super(dt);
    },
    fire: function() {
        var t = this;
        if (t.ammo) {
            var t = this;

            var r = t.r + AF.degToRad(AF.randRange(-6, 6));
            var vec = new V2(M.cos(t.r) * t.img.w, M.sin(t.r) * t.img.w);

            var b = new t.ammo({
                p: t.p.copy().add(vec),
                v: new V2(M.cos(r), M.sin(r)).mult(500)
            });

            game.addChild(b);
            game.sfx.play(t.sounds.gun);
        }
    },
    collide: function(obj) {
        // Override in children
    },
    kill: function() {
        var t = this;
        t.alive = false;
        for (var i = 0; i < t.bodies.length; i++) {
            t.bodies[i].alive = false;
        }
        game.score += t.points;
        if (t.sounds) {
            game.sfx.play(t.sounds.die);
        }
    },
    isPlayerWeapon: function() {
        return this.is(PBullet);
    },
    isNPCWeapon: function() {
        return this.is(EBullet);
    },
    isNPC: function() {
        return !this.is(Bullet) && !this.is(Player);
    },
    is: function(type) {
        return this instanceof type;
    }
});
