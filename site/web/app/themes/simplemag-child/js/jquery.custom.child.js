jQuery(document).ready(function ($) {

    "use strict";
    var $trigger = $('.js-slide-dock-trigger'),
        $newsletter = $('.slide-dock-news');
    
    if ($newsletter.length && sessionStorage.getItem(window.location.hostname + '-newsletter') != 'true') {
        $trigger.on('inview', function (event, isInView, visiblePartX, visiblePartY) {
            if (isInView) {
                $newsletter.addClass('slide-dock-news-on');
            } else {
                $newsletter.removeClass('slide-dock-news-on');
            }
        });

        $('.close-dock').click(function (e) {
            e.preventDefault();
            sessionStorage.setItem(window.location.hostname + '-newsletter', 'true');
            $newsletter.addClass('slide-dock-news-off');

        });

    }
});// - document ready