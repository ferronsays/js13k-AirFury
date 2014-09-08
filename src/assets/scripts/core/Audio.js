var SFX = Class.extend({
    init: function() {
        this.sounds = {};
    },
    add: function(key, count, settings) {
        this.sounds[key] = [];
        for (var i = 0; i < settings.length; i++) {
            var elem = settings[i];
            this.sounds[key].push({
                tick: 0,
                count: count,
                pool: []
            });
            for (var j = 0; j < count; j++) {
                var audio = new Audio();
                audio.src = jsfxr(elem);
                this.sounds[key][i].pool.push(audio);
            }
        }
    },
    play: function(key) {
        if (W.chrome) {
            var sound = this.sounds[key];
            var soundData = sound.length > 1 ? sound[M.floor(M.random() * sound.length)] : sound[0];
            soundData.pool[soundData.tick].play();
            soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
        }
    }
});
