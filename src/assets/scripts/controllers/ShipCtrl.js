var ShipCtrl = SpawnCtrl.extend({
    init: function() {
        var t = this;
        t._super();

        t.max = 8;

        t.sTime = 1000;
        t.aDelay = 5000;
        //start it at the delay so we get one right at startTime
        t.aCounter = 5000;

        t.aIncDelay = 60000;
        t.aIncCounter = 0;
        t.aIncFactor = 0.85;
    },
    spawnEntity: function() {
        this.nodes.push(new Ship({
            p: this.getSpawnPoint(),
            target: game.ace,
        }));
    },
    getSpawnPoint: function() {
        var found = false;
        var p = null;
        var limit = 10;
        var count = 0;

        l1: while (!found) {
            p = this.randWaterSpawn();
            // Fake an object at point to see if it would be in view
            if (!AF.inViewport({p: p, radius: 62})) {
                count += 1;
                if (count > limit) {
                    break l1;
                }
                // Not in view, continue with our next check
                var len = this.nodes.length;
                if (len === 0) {
                    found = true;
                    break l1;
                }

                // If not, check if it's near other ships
                for (var i = 0; i < len; i++) {
                    var check = this.nodes[i];
                    // Check 2 times width plus some buffer room
                    if (p.copy().sub(check.p).length() < 175) {
                        continue l1;
                    }
                }

                found = true;
            }
        }
        return p;
    }
});
