var Particle = GameObject.extend({

    init: function(args) {
        var t = this;

        t._super(args);

        // Init particle-specific props
        t.size = null;
        t.deltaSize = null;
        t.colorArray = null;
        t.deltaColor = null;

        // Default to no gravity
        t.g = false;

        // Life of 0 caused problems...
        t.age = 1;

        t.drawColor = null;
        t.constColor = false;

        AF.extend(t, args);

        t.calcColor(0);
    },

    step: function(dt) {
        var t = this;

        t._super(dt);

        var adt = dt / game.slomo;
        // step our sizes
        t.size += t.deltaSize * adt;

        if (!t.drawColor || !t.constColor) {
            t.calcColor(adt);
        }
    },
    calcColor: function(dt) {
        var t = this;

        // linear easing the color
        var r = t.colorArray[0] += (t.deltaColor[0] * dt);
        var g = t.colorArray[1] += (t.deltaColor[1] * dt);
        var b = t.colorArray[2] += (t.deltaColor[2] * dt);
        var a = t.colorArray[3] += (t.deltaColor[3] * dt);

        // clamp 'em
        r = (r > 255 ? 255 : r < 0 ? 0 : ~~r),
        g = (g > 255 ? 255 : g < 0 ? 0 : ~~g),
        b = (b > 255 ? 255 : b < 0 ? 0 : ~~b),
        a = (a > 1 ? 1 : a < 0 ? 0 : a.toFixed(2));

        t.drawColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    },
    draw: function(c) {
        var t = this;

        if (!t.alive) {
            return;
        }

        t.p.toInt(); // TODO does this help perf?

        c.save();
        c.fillStyle = t.drawColor;
        c.beginPath();
        c.arc(t.p.x, t.p.y, t.size, 0, 2 * M.PI, false);
        c.fill();
        c.closePath();
        c.restore();
    }
});
