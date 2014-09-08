var Ocean = GameObject.extend({
    init: function(args) {
        var t = this;
        t._super(args);

        t.width = game.w;
        t.height = 1000;

        AF.extend(t, args);

        t.canvas = document.getElementById(args.cid);

        // Own canvas for reflection rendering
        t.c = t.canvas.getContext('2d');
        t.w = t.canvas.width = t.canvas.clientWidth;
        t.h = t.canvas.height = t.canvas.clientHeight;


        t.c.strokeStyle = '#fff';
        t.c.lineWidth = 2;
        //t.c.rotate(M.PI/2);
    },
    draw: function(c) {
        var t = this;

        t.c.clearRect(0, 0, t.w, t.h);

        var pp = game.cam.worldToScreen(0, 0);

        if (pp.y < t.canvas.height) {
            t.c.save();
            t.c.translate(0, pp.y);
            t.c.scale(1, -1);
            t.c.drawImage(
                c.canvas,
                // Start Clip
                0,
                // Start Clip
                0,
                // Clip Width
                c.canvas.width,
                // Clip Height
                pp.y,
                // Draw Point
                0, -pp.y,
                // Size
                c.canvas.width,
                pp.y
            );
            t.c.fillStyle = 'rgba(67,103,127,0.50)';
            t.c.beginPath();
            t.c.rect(-2, -pp.y - 1000, c.canvas.width + 4, pp.y + 1000);
            t.c.fill();
            t.c.stroke();
            t.c.restore();
        }
    }
});
