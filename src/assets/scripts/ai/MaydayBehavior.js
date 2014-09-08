var BMayday = Behavior.extend({
    run: function() {
        this.actor.r += 0.15 / game.slomo;
    }
});
