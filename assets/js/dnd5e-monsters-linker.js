/* globals jQuery:false */

(function($) {
    // Helper functions
    function loadMonsters() {
        $.getJSON('source/dnd-5e-creatures.json')
            .then(function(bestiary) {
                var $el;

                monsters.add(bestiary);
                $('strong').each(function(i, el) {
                    $el = $(el);
                    if (monsters.getName($el.text())) {
                        $el
                            .on('click', pinMonster)
                            .hover(openMonsterDisplay, closeMonsterDisplay);
                    }
                });
                console.log('Monsters initialized');
            })
            .catch(function(err) {
                console.warn('Failed to load bestiary', err);
            });
    }

    function closeMonsterDisplay(/* event */) {
        $('#monsterDisplay').css('display', 'none');
    }

    function openMonsterDisplay(event) {
        // Get the element triggering the event
        var $el = $(event.target);

        // Calculate where to put the fly-in
        var offset = $el.offset();
        var width = $('body').width();
        var left = offset.left + $el.width() + 20;
        var top = offset.top;

        if (left + 450 > width) {
            // Off the right side of the page, move to the left of the element
            left = offset.left - 490;
        }
        if (left < 0) {
            // Off the left side of the page, move to below the element
            left = 0;
            top = top + $el.height() + 20;
        }

        // Build the template
        var monsterTemplate = monsters.buildTemplateFor($el.text(), true);

        // Attach the template the monster display box and set to visible
        $('#monsterDisplay').html(monsterTemplate)
            .css({
                'display': 'block',
                'top': top + 'px',
                'left': left + 'px'
            });
    }

    function pinMonster(event) {
        var $el = $(event.target);
        var monsterTemplate = monsters.buildTemplateFor($el.text());

        $('#monsterContainer').append(
            $(monsterTemplate)
                .append($('<button type="button" class="close"><span>&times;</span></button>').on('click', function() {
                    $(this).parent().remove();
                }))
        );
    }

    var monsters = window.bestiary5e;

    // Load the monsters once the page has been loaded
    adventureLoader.onComplete(loadMonsters);
})(jQuery);
