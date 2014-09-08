var MigCtrl = SpawnCtrl.extend({
    init: function() {
        var t = this;
        t._super();

        t.max = 115;

        t.sTime = 1000;
        t.aDelay = 1100;
        //start it at the delay so we get one right at startTime
        t.aCounter = 1200;

        t.aIncDelay = 60000;
        t.aIncCounter = 0;
        t.aIncFactor = 0.85;
    },
    spawnEntity: function() {
        this.nodes.push(new Mig({
            s: 0.75,
            p: this.randOBSpawn(),
            target: game.ace,
            g: false
        }));
    }
});
