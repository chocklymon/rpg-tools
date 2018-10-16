/* globals jQuery:false */

(function() {
    var loadedCallbacks = [];
    var chaptersLoaded = {};
    var initialized = false;

    function allTrue(list) {
        var isAllTrue = true;
        jQuery.each(list, function(s, value) {
            if (!value) {
                isAllTrue = false;
                return isAllTrue;
            }
        });
        return isAllTrue;
    }

    function addCallback(cb) {
        if (cb && typeof cb === 'function') {
            if (initialized) {
                // Already done, run now
                cb();
            } else {
                loadedCallbacks.push(cb);
            }
        }
    }

    jQuery(function load($) {
        $('.load').each(function(i, el) {
            var $el = $(el);
            var source = $el.data('source');
            if (source) {
                chaptersLoaded[source] = false;
                $el.load(source, function() {
                    chaptersLoaded[source] = true;
                    if (allTrue(chaptersLoaded)) {
                        initialized = true;

                        // Scroll to the currently selected id (if any)
                        if (window.location.hash) {
                            $('html, body').animate({
                                scrollTop: $(window.location.hash).offset().top
                            }, 500);
                        }

                        // Call the callback function
                        $.each(loadedCallbacks, function(i, cb) {
                            cb();
                        });
                    }
                });
            }
        });
    });


    window.adventureLoader = {
        onComplete: addCallback
    };
})();



