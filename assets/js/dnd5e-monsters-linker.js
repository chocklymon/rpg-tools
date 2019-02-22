/* globals jQuery:false */

(function($) {
    var miniatures = {},
        miniaturesIndexes = {};

    // Helper functions
    function loadMonsters() {
        $.getJSON('source/dnd-5e-creatures.json')
            .then(function(bestiary) {
                // Initialize the monsters
                monsters.add(bestiary.creatures);

                // Initialize the data lookup to display monsters
                $('[data-lookup]').each(function(i, el) {
                    $(el).addClass('lookup')
                        .on('click', pinMonster)
                        .hover(openMonsterDisplay, closeMonsterDisplay);
                });

                console.log('Monsters initialized');
            })
            .catch(function(err) {
                console.warn('Failed to load bestiary', err);
            });
        $.getJSON('source/miniatures.json')
            .then(function(minisData) {
                miniatures = minisData;
                $.each(miniatures.minis, function(i, m) {
                    miniaturesIndexes[m.name] = i;
                    if ('alt' in m) {
                        $.each(m.alt, function(j, n) {
                            miniaturesIndexes[n] = i;
                        });
                    }
                });
                console.log('Miniatures initialized');
            })
            .catch(function(err) {
                console.log('Failed to load miniatures', err)
            });
    }

    function buildMonsterTemplate(monster, compact) {
        var monsterTemplate = monsters.buildTemplateFor(monster, compact);
        if (monster in miniaturesIndexes) {
            var miniInfo = miniatures.minis[miniaturesIndexes[monster]];
            monsterTemplate = $(monsterTemplate).addClass('has-mini');

            var miniHtml = '';
            if ('mini' in miniInfo && miniInfo.mini.length > 0) {
                miniHtml += '<i class="ra ra-anvil"></i>';
            }
            if ('pawn' in miniInfo && miniInfo.pawn.length > 0) {
                miniHtml += '<i class="ra ra-pawn"></i>';
            }
            var icon = monsterTemplate.find('.mini-icon').html(miniHtml);
            if (!compact) {
                icon.hover(function(event) {openMiniDisplay(event, miniInfo);}, closeMiniDisplay);
            }
        }

        return monsterTemplate;
    }

    function createMiniInfo(appendTo, arr) {
        var el, p, source, quantity, size;
        $.each(arr, function(i, m) {
            el = $('<div>');
            if ('img' in m) {
                el.append($('<img>').attr({'src': m.img, alt: ''}));
            }
            if ('source' in m) {
                source = m.source;
                if (source in miniatures.sources) {
                    source = miniatures.sources[source];
                }
                el.append($('<p>').text(source));
            }

            p = $('<p>');
            el.append(p);

            quantity = '?';
            if ('qty' in m) {
                quantity = m.qty;
            }
            p.append($('<span>').text('Quantity: ' + quantity));

            size = '?';
            if ('size' in m && m.size in monsters.sizes) {
                size = monsters.sizes[m.size];
            }
            p.append($('<span>').addClass('size').text(' — Size: ' + size));

            appendTo.append(el);
        });
    }

    function closeMiniDisplay(/* event */) {
        $('#miniInfo').remove();
    }

    function openMiniDisplay(event, miniInfo) {
        var loc = getFlyInLocation($(event.target));

        var $el = $('<div>')
            .attr('id', 'miniInfo')
            .css({
                'top': loc.top + 'px',
                'left': loc.left + 'px'
            })
            .addClass('monster compact');
        if ('mini' in miniInfo && miniInfo.mini.length > 0) {
            $el.append($('<h3>').text('Miniatures'));
            createMiniInfo($el, miniInfo.mini);
        }
        if ('pawn' in miniInfo && miniInfo.pawn.length > 0) {
            $el.append($('<h3>').text('Pawns'));
            createMiniInfo($el, miniInfo.pawn);
        }

        $('.phb').append($el);
    }

    function closeMonsterDisplay(/* event */) {
        $('#monsterDisplay').css('display', 'none');
    }

    function openMonsterDisplay(event) {
        // Get the element triggering the event
        var $el = $(event.target);
        var loc = getFlyInLocation($el);

        // Build the template
        var monsterTemplate = buildMonsterTemplate($el.data('lookup'), true);

        // Attach the template the monster display box and set to visible
        $('#monsterDisplay').html(monsterTemplate)
            .css({
                'display': 'block',
                'top': loc.top + 'px',
                'left': loc.left + 'px'
            });
    }

    function getFlyInLocation($el) {
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
        return {
            left: left,
            top: top,
        }
    }

    function pinMonster(event) {
        var monsterTemplate = buildMonsterTemplate($(event.target).data('lookup'), false);

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
