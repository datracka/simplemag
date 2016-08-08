jQuery(document).ready(function ($) {

    "use strict";
    console.log('localStorage', sessionStorage.getItem(window.location.hostname + '-newsletter'));
    console.log('length', $('.slide-dock-news').length);
    if ($('.slide-dock-news').length && sessionStorage.getItem(window.location.hostname + '-newsletter') != 'true') {
        var $newsletter = $('.slide-dock-news');
        $('.js-slide-dock-trigger').on('inview', function (event, isInView, visiblePartX, visiblePartY) {
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