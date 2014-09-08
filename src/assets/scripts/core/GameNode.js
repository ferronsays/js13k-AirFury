var GameNode = Class.extend({
    init: function(args) {
        this.nodes = [];
        this.p = new V2();
        this.r = 0;

        AF.extend(this, args);
    },
    step: function(dt) {
        var len = this.nodes.length;
        while (len--) {
            var obj = this.nodes[len];
            obj.step(dt);
            if (!obj.alive) {
                this.nodes.splice(len, 1);
                continue;
            }
        }
    },
    draw: function(c) {
        var len = this.nodes.length;

        if (len === 0) {
            return;
        }
        
        c.save();

        c.translate(this.p.x, this.p.y);
        c.rotate(this.r);

        while (len--) {
            this.nodes[len].draw(c);
        }

        c.restore();
    },
    addChild: function(obj) {
        this.nodes.push(obj);
    }
});
