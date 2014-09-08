var Collisions = GameNode.extend({
    init: function(args) {
        this._super();

        this.debugDraw = false;

        AF.extend(this, args);
    },
    step: function(dt) {
        var t = this;

        t._super(dt);

        var l = t.nodes.length;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l; j++) {
                var a = t.nodes[i];
                var b = t.nodes[j];
                t.check(a, b);
            }
        }
    },
    hit: function(a, b) {
        a.obj.collide(b.obj);
        b.obj.collide(a.obj);
    },
    check: function(a, b) {
        if (
            a.id === b.id ||
            a.obj.id === b.obj.id ||
            !a.obj.alive || !b.obj.alive ||
            this.grouped(a, b)
        ) {
            return;
        }

        var dx = b.p.x - a.p.x;
        var dy = b.p.y - a.p.y;
        var dist = M.sqrt(dx * dx + dy * dy);
        if (dist < b.radius + a.radius) {
            this.hit(a, b);
        }
    },
    grouped: function(a, b) {
        var cs = [Bullet, Mig];
        for (var i = 0; i < cs.length; i++) {
            if (a instanceof cs[i] && b instanceof cs[i]) {
                return true;
            }
        }
        return false;
    }
});
