jQuery(document).ready(function ($) {

    "use strict";
    var $trigger = $('.js-slide-dock-trigger'),
        $newsletter = $('.slide-dock-news');
    
    if ($newsletter.length && sessionStorage.getItem(window.location.hostname + '-newsletter') != 'true') {
        $trigger.on('inview', function (event, isInView, visiblePartX, visiblePartY) {
            if (isInView) {
                $newsletter.addClass('slide-dock-news-on');
            }
        });

        $('.close-dock').click(function (e) {
            e.preventDefault();
            sessionStorage.setItem(window.location.hostname + '-newsletter', 'true');
            $newsletter.addClass('slide-dock-news-off');

        });

    }

    //mailchimp
    window.fnames = new Array();
    window.ftypes = new Array();
    fnames[0] = 'EMAIL';
    ftypes[0] = 'email';
    fnames[1] = 'FNAME';
    ftypes[1] = 'text';
    fnames[2] = 'LNAME';
    ftypes[2] = 'text';
    /*
     * Translated default messages for the $ validation plugin.
     * Locale: ES
     */
    $.extend($.validator.messages, {
        required: "Este campo es obligatorio.",
        remote: "Por favor, rellena este campo.",
        email: "Por favor, escribe una dirección de correo válida",
        url: "Por favor, escribe una URL válida.",
        date: "Por favor, escribe una fecha válida.",
        dateISO: "Por favor, escribe una fecha (ISO) válida.",
        number: "Por favor, escribe un número entero válido.",
        digits: "Por favor, escribe sólo dígitos.",
        creditcard: "Por favor, escribe un número de tarjeta válido.",
        equalTo: "Por favor, escribe el mismo valor de nuevo.",
        accept: "Por favor, escribe un valor con una extensión aceptada.",
        maxlength: $.validator.format("Por favor, no escribas más de {0} caracteres."),
        minlength: $.validator.format("Por favor, no escribas menos de {0} caracteres."),
        rangelength: $.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        range: $.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        max: $.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        min: $.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
    });

/*    $(window).resize(function() {
        $('.vf-form').css('height', window.innerHeight);
    });*/

    //event handlers
/*
    var $openModalButton = $(".vf-js-open-modal");
    var $signupPopup = $(".vf-js-sign-up-form");
    var $overlay = $(".vf-form");
    $openModalButton.click(function(e) {
        $overlay.css("display","block");
     //   disableScroll();
    });
9
    $signupPopup.on('click', function(e) {
        e.preventDefault();
        $overlay.css("display","none");
        $signupPopup.css("display","none");
    //    enableScroll();
    })

    $overlay.on('click', function(e) {
        e.preventDefault();
        $overlay.css("display","none");
        $signupPopup.css("display","none");
    //    enableScroll();
    })
*/




});// - document ready

/** scroll cancelation */

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

// end scroll cancellation
