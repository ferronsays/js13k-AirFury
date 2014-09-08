var AF = (function() {
    /**
     * Constructor
     */
    var AF = function() {
        this.init();
    };

    /**
     * Static Helpers
     */
    AF.extend = function(to, from, allowNew) {
        for (var i in from) {
            if (allowNew || to.hasOwnProperty(i)) {
                to[i] = from[i];
            }
        }
        return to;
    };

    AF.randPN = function() {
        return M.random() * 2 - 1;
    };

    AF.degToRad = function(degrees) {
        return (degrees * M.PI) / 180;
    };

    AF.radToDeg = function(radians) {
        return (radians * 180) / M.PI;
    };

    AF.wrapAngle = function(r) {
        while (r < -M.PI) {
            r += M.PI * 2;
        }
        while (r > M.PI) {
            r -= M.PI * 2;
        }

        return r;
    };

    AF.randRange = function(from, to) {
        return M.floor(M.random() * (to - from + 1) + from);
    };

    AF.clamp = function(value, min, max) {
        return value < min ? min : value < max ? value : max;
    };

    AF.inRange = function(value, min, max) {
        return (value >= min && value <= max);
    };

    AF.inViewport = function(obj) {
        return AF.inRange(obj.p.x, game.cam.vp.l - obj.radius, game.cam.vp.r + obj.radius) && AF.inRange(obj.p.y, game.cam.vp.t - obj.radius, game.cam.vp.b + obj.radius);
    };

    AF.inBounds = function(obj) {
        return AF.inRange(obj.p.x, game.bounds.l, game.bounds.r) && AF.inRange(obj.p.y, game.bounds.t, game.bounds.b);
    };

    AF.pad = function(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    };

    AF.prototype = {
        init: function() {
            var t = this;

            t.w = 4500;
            t.h = 1500;

            t.bounds = {
                l: -t.w / 2,
                r: t.w / 2,
                t: -t.h,
                b: 400
            };

            //delta time between steps
            t.dt = 0;

            //current time, used to calculate dt
            t.currentTime = new Date().getTime();

            // Gravity acceleration vector
            t.gravity = new V2(0, 0.05);

            t.slomo = 1;

            // Image object for spritesheet
            t.img = new Image();

            // 
            t.img.onload = function() {
                game.initGame();

                t.$ldng.style.display = "none";

                t.draw();
            };

            // Get our sprite sheet
            t.img.src = 'assets/media/sprite.png';

            // Generate Background
            t.bg = new Background(6000, 3000);

            // Scene Graph
            t.nodes = [];

            // Ref to canvas
            t.cvs = document.getElementById('g');

            // Set dimension properties
            // TODO Magic numbers to save space
            t.resetDimensions(800, 500);

            // Shortcut to canvas context
            t.c = t.cvs.getContext('2d');

            //
            this.storage = window['localStorage'];

            // Camera
            t.cam = new Camera(t);

            // Input controller
            t.inputCtrl = new InputCtrl();

            t.started = false;

            // Audio
            t.sfx = new SFX();
            if (W.chrome) {
                t.sfx.add('gun', 6, [
                    [2, , 0.299, 0.0289, 0.391, 0.8259, 0.0381, -0.5939, , , , , , 0.2965, 0.0699, , 0.1943, -0.0108, 1, , , 0.109, , 0.3]
                ]);
                t.sfx.add('hit', 4, [
                    [3, 0.0072, 0.6334, 0.5806, 0.8231, 0.6134, , 0.3234, 0.0409, 0.0003, 0.3446, -0.154, -0.4408, 0.2995, -0.4789, , 0.0002, 0.9689, 0.9331, -0.5453, , 0.0041, 0.009, 0.3]
                ]);
                t.sfx.add('die', 1, [
                    [3, , 0.3858, 0.6116, 0.4334, 0.0786, , 0.0482, , , , 0.6687, 0.6914, , , , -0.2659, -0.2109, 1, , , , , 0.3]
                ]);
                t.sfx.add('egun', 10, [
                    [2, , 0.1356, , 0.3599, 0.599, 0.2, -0.2762, , , , , , 0.1688, 0.1182, , , , 1, , , 0.0376, , 0.3],
                    [2, , 0.2608, 0.0037, 0.1332, 0.821, 0.2811, -0.3038, , , , , , 0.3193, 0.1014, , , , 1, , , 0.0663, , 0.3]
                ]);
                t.sfx.add('ehit', 6, [
                    [0, , 0.0889, , 0.1981, 0.4033, , -0.3139, , , , , , 0.2536, , , , , 1, , , , , 0.3]
                ]);
                t.sfx.add('edie', 6, [
                    [3, , 0.104, 0.492, 0.4726, 0.1641, , , 0.009, , 0.0056, -0.3286, 0.7063, , -0.0332, , -0.1521, -0.1666, 1, -0.0473, , 0.0172, -0.0041, 0.3],
                    [3, , 0.1161, 0.5124, 0.4854, 0.1889, , , , , , -0.3396, 0.7434, , , , -0.1828, -0.1666, 1, , , , , 0.3]
                ]);
                t.sfx.add('sgun', 6, [
                    [3, , 0.3123, 0.7895, 0.4729, 0.1296, , -0.2453, , , , , , , , , -0.2225, -0.0724, 1, , , , , 0.3],
                    [3, , 0.14, 0.3018, 0.4, 0.1876, , -0.2173, , , , , , , , , 0.1772, -0.1164, 1, , , , , 0.3]
                ]);
                t.sfx.add('shit', 12, [
                    [3, , 0.2495, 0.5831, 0.3162, 0.2813, , -0.3806, , , , , , , , 0.4055, -0.2867, -0.1401, 1, , , , , 0.3],
                    [3, , 0.1346, 0.3738, 0.3166, 0.2031, , -0.3183, , , , , , , , 0.5275, , , 1, , , , , 0.3]
                ]);
                t.sfx.add('sdie', 3, [
                    [3, , 0.2562, 0.5918, 0.52, 0.174, , -0.2348, , , , , , , , , -0.1262, -0.0519, 1, , , , , 0.3],
                    [3, , 0.3008, 0.5579, 0.52, 0.1982, , -0.1875, , , 0.0422, 0.0439, 0.0349, , -0.0319, , -0.1262, -0.053, 1, , , , , 0.3]
                ]);
                t.sfx.add('jet', 10, [
                    [3, , 0.42, , 0.19, 0.0359, , 0.1088, , , , , , , , 0.7225, 0.3642, -0.1748, 1, , , , , 0.3]
                ]);
                t.sfx.add('pwr', 3, [
                    [3, 0.5809, 0.2183, 0.029, 0.3452, 0.53, , -0.0035, , -0.4453, 0.9188, 0.8925, -0.2872, -0.372, -0.0262, 0.6806, 0.0002, 0.1227, 0.2517, -0.1135, 0.6981, 0.2448, -0.011, 0.4]
                ]);
                t.sfx.add('smoke', 2, [
                    [3, , 0.1853, 0.7711, 0.32, 0.055, , -0.0568, , , , , , , , 0.5535, , , 1, , , , , 0.3],
                    [3, , 0.1853, 0.7711, 0.22, 0.055, , -0.0568, , , , , , , , 0.5535, , , 1, , , , , 0.3]
                ]);
            }

            // splash
            //3,0.0802,0.0444,0.3049,0.337,0.0159,,0.6248,-0.0658,0.111,0.3629,0.0251,0.8896,,-0.3024,-0.2693,-0.1736,0.8901,0.9049,-0.0967,-0.0362,0.4001,0.1615,0.3

            t.listen();
        },
        listen: function() {
            var t = this,
                d = document.getElementById.bind(document);

            // Pause game if the user gets distracted
            W.onblur = function() {
                if (t.started) {
                    t.pause();
                }
            };
            t.$hp = d('hp');
            t.$score = d('score');
            t.$fscore = d('fscore');
            t.$power = d('power');
            t.$hud = d('hud');
            t.$gmo = d('gmo');
            t.$ss = d('ss');
            t.$pz = d('pz');
            t.$ldng = d('ldng');
            t.$hscore = d('hscore');

            var k = 'keydown';
            var sg = function(e) {
                if (e.keyCode === 87 || e.keyCode === 38) {
                    t.enable();
                    W.removeEventListener(k, sg);

                    // var els = document.getElementsByClassName('ss');
                    // for (var i = 0; i < els.length; i++) {
                    //     els[i].classList.add('hide');
                    // }
                    t.toggleScreens(t.$hud, t.$ss);
                }
            };

            W.addEventListener(k, sg);

            W.addEventListener(k, function(e) {
                if (e.keyCode === 80) {
                    if (t.pzd) {
                        t.resume();
                    } else {
                        t.pause();
                    }
                }
            });
        },
        // Initialize Game Objects
        initGame: function() {
            var t = this;

            // Total time the game has been running
            t.tTime = 0;
            // Score
            t.score = 0;

            t.phys = new Collisions({
                debugDraw: true
            });

            t.addChild(new Ocean({
                cid: 'h2o'
            }));

            // player
            t.ace = new Player({
                p: new V2(0, -500)
            });

            t.cam.lookat = t.ace.p.copy();

            t.addChild(t.ace);

            t.addChild(new MigCtrl());

            t.addChild(new ShipCtrl());
        },
        // Start game Loop
        enable: function() {
            this.started = true;

            this.animate(new Date().getTime());
        },
        // Execute Game Loop
        animate: function(time) {
            var t = this;
            t.animationFrame = requestAnimationFrame(function() {
                t.animate(new Date().getTime());
            });

            var dt = time - t.currentTime;
            t.currentTime = time;
            t.step(dt);
        },
        // Turn off game loop
        disable: function() {
            cancelAnimationFrame(this.animationFrame);
        },
        toggleScreens: function(on, off) {
            on.style.display = "block";
            off.style.display = "none";
        },
        // Pause
        pause: function() {
            var t = this;
            t.disable();
            t.pzd = true;
            t.toggleScreens(t.$pz, t.$hud);
        },
        // Unpause
        resume: function() {
            var t = this;
            if (t.pzd) {
                t.currentTime = new Date().getTime();
                t.enable();
                t.pzd = false;
                t.toggleScreens(t.$hud, t.$pz);
            }
        },
        // Game Over
        over: function() {
            var t = this;
            t.started = false;
            t.disable();

            var highScore = this.storage.getItem('score');
            if (this.score > highScore) {
                this.storage.setItem('score', t.score);
                t.$hscore.style.display = "block";
            } else {
                t.$hscore.style.display = "none";
            }

            t.toggleScreens(t.$gmo, t.$hud);

            var k = 'keydown';
            var sg = function(e) {
                if (e.keyCode === 87 || e.keyCode === 38) {
                    W.removeEventListener(k, sg);

                    t.restart();
                    t.toggleScreens(t.$hud, t.$gmo);
                }
            };

            W.setTimeout(function() {
                W.addEventListener(k, sg);
            }, 1000);
        },
        restart: function() {
            var t = this;

            t.started = false;

            t.disable();

            // Wipe away current
            while (t.nodes.length) {
                t.nodes.pop();
            }

            t.ace = null;
            t.phys = null;

            // Restart/init
            t.initGame();
            t.enable();
        },
        resetDimensions: function(w, h) {
            this.w = this.cvs.width = w;
            this.h = this.cvs.height = h;
        },
        addChild: function(obj) {
            this.nodes.push(obj);
        },
        addCollider: function(obj) {
            this.phys.addChild(obj);
        },
        step: function(dt) {
            // After pausing where dt is 0, causes projectiles to stick
            if (!dt) {
                return;
            }

            var t = this;

            var len = t.nodes.length;
            while (len--) {
                var entity = t.nodes[len];
                entity.step(dt);
                if (!entity.alive) {
                    t.nodes.splice(len, 1);
                    continue;
                }
            }

            t.cam.step(dt); // TODO Should this be a child?
            t.phys.step(dt);

            t.draw();

            t.$hp.style.width = t.ace.hp + '%';
            t.$score.innerHTML = t.$fscore.innerHTML = AF.pad(t.score, 9);
            t.$power.style.width = t.ace.power + '%';

            t.tTime += dt;

            // If the player dies, slow the game to a stop, then cue game over state
            if (!t.ace.alive) {
                game.slomo += 0.1;
                if (game.slomo >= 10) {
                    t.over();
                }
            }
        },
        draw: function() {
            var t = this;

            //t.c.clearRect(0, 0, t.w, t.h);
            t.c.fillStyle = '#87CEFF';
            t.c.fillRect(0, 0, t.w, t.h);

            if (t.ace) {
                // Have the camera look at a point ahead of the player
                var dd = t.ace.v.length() * 25;
                var offset = new V2(M.cos(t.ace.r - M.PI) * dd, M.sin(t.ace.r - M.PI) * dd);
                var cp = t.ace.p.copy().sub(offset);
                t.cam.moveTo(cp.x, cp.y);
            }

            t.cam.begin();

            t.bg.draw(t.c);

            var len = t.nodes.length;
            while (len--) {
                t.nodes[len].draw(t.c);
            }

            // if (t.phys.debugDraw) {
            //     t.phys.draw(t.c);
            // }

            t.cam.end();
        }
    };

    return AF;
}());
