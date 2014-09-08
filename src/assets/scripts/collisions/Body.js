var Body = Class.extend({
    init: function(args) {
        var t = this;

        t.p = new V2();
        t.type = 'circle';
        t.radius = 0;
        t.obj = null;
        t.pOffset = new V2();
        t.alive = true; // TODO This shouldn't be necessary

        AF.extend(t, args);

        t.id = AF.randRange(0, 100000);
    },
    step: function(dt) {
        this.p = this.obj.p.copy().add(this.pOffset);
    },
    draw: function(c) {
        if (this.type === 'circle') {
            c.beginPath();
            c.arc(this.p.x, this.p.y, this.radius, 0, 2 * M.PI, false);
            c.lineWidth = 1;
            c.strokeStyle = '#f00';
            c.stroke();
        }
    }
});
