var Emitter = GameObject.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.maxParticles = 0;

        t.position = new V2();
        t.positionVariance = new V2();

        t.dir = 0;
        t.directionVariance = 0;

        t.speed = 0;
        t.speedVariance = 0;

        t.size = 0;
        t.sizeVariance = 0;


        t.endSize = 0;
        t.endSizeVariance = 0;

        t.life = 0;
        t.lifeVariance = 0;

        t.color = [0, 0, 0, 0];
        t.colorVariance = [0, 0, 0, 0];

        // Constant color?
        t.constColor = false;

        t.endColor = [0, 0, 0, 0];
        t.endColorVariance = [0, 0, 0, 0];

        t.emitCounter = 0;

        t.elapsedTime = 0;

        t.duration = -1;

        t.on = true;

        t.static = true;

        AF.extend(t, args);

        //explosion case
        if (t.duration === 0) {
            //var rate = 1 / t.maxParticles;

            while (t.nodes.length < t.maxParticles) {
                t.emit();
                //this.emitCounter -= rate;
            }
        }

    },
    step: function(dt) {
        var t = this;

        t._super(dt);

        //explosion
        if (t.duration === 0) {
            if (t.nodes.length <= 0) {
                t.kill();
            }
        } else {
            t.emissionRate = t.maxParticles / t.life;

            if (t.alive && t.emissionRate > 0) {
                var rate = 1 / t.emissionRate;
                t.emitCounter += dt;

                while (t.nodes.length < t.maxParticles && t.emitCounter > rate) {
                    if (t.on) {
                        t.emit();
                        t.emitCounter -= rate;
                    } else {
                        break;
                    }
                }

                t.elapsedTime += dt;
                if (t.duration !== -1 && t.duration < t.elapsedTime) {
                    t.kill();
                }
            }
        }
    },
    emit: function() {
        var t = this;

        var rPos = t.position.copy();
        rPos.x = rPos.x + t.positionVariance.x * AF.randPN();
        rPos.y = rPos.y + t.positionVariance.y * AF.randPN();

        var rAngle = t.dir + AF.degToRad(t.directionVariance * AF.randPN());
        var rSpeed = t.speed + t.speedVariance * AF.randPN();

        var rDir = new V2(M.cos(rAngle), M.sin(rAngle)).mult(rSpeed);

        var rSize = t.size + t.sizeVariance * AF.randPN();
        rSize = rSize < 0 ? 0 : ~~rSize;

        var rEndSize = t.endSize + t.endSizeVariance * AF.randPN();
        rEndSize = rEndSize < 0 ? 0 : ~~rEndSize;

        var rLife = t.life + t.lifeVariance * AF.randPN();

        var rDeltaSize = (rEndSize - rSize) / rLife;

        var end = [];
        var start = [];
        var rDeltaColor = [];

        for (var i = 0; i < 4; i++) {
            start.push(t.color[i] + t.colorVariance[i] * AF.randPN());
            end.push(t.endColor[i] + t.endColorVariance[i] * AF.randPN());
            rDeltaColor.push((end[i] - start[i]) / rLife);
        }

        var rColor = start;

        var part = new Particle({
            p: rPos,
            v: rDir,
            size: rSize,
            deltaSize: rDeltaSize,
            lifeSpan: rLife,
            colorArray: rColor,
            constColor: t.constColor,
            deltaColor: rDeltaColor,
            g: t.g,
            maxSpeed: rSpeed
        });

        t.nodes.push(part);
    }
});