var SpawnCtrl = GameNode.extend({
    init: function(args) {
        var t = this;

        t._super(args);

        t.alive = true;

        t.max = 1;

        // Start time
        t.sTime = 0;
        // Action Delay
        t.aDelay = 0;
        // Action Counter
        t.aCounter = 0;

        // Delay until we increase rate
        t.aIncDelay = 0;
        // Counter
        t.aIncCounter = 0;
        // Increase (decrease) coef.
        t.aIncFactor = 1;

        AF.extend(t, args);
    },
    step: function(dt) {
        var t = this;

        t._super(dt);

        if (game.tTime < t.sTime) {
            return;
        }

        if (t.aCounter >= t.aDelay) {
            t.aCounter = 0;

            if (t.nodes.length < t.max) {
                t.spawnEntity();
            }
        }

        if (t.aIncCounter >= t.aIncDelay) {
            t.aIncCounter = 0;
            t.aDelay *= t.aIncFactor;
        }

        t.aCounter += dt;
        t.aIncCounter += dt;
    },
    spawnEntity: function() {},
    // random out of bounds spawn
    randOBSpawn: function() {
        var x, y;
        var b = game.bounds;
        // 
        // if (M.random() > 0.5) {
        //     // Spawn Above
        //     y = b.t - 100;
        //     x = AF.randRange(b.l, b.r);
        // } else {
            // Spawn Sides
            y = AF.randRange(b.t, b.b - 100);
            x = M.random() > 0.5 ? b.l - 100 : b.r + 100;
        // }
        return new V2(x, y);
    },
    // random spawn on water surface
    randWaterSpawn: function() {
        var b = game.bounds;
        return new V2(AF.randRange(b.l, b.r),0);
    }
});
