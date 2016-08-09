<?php
/* Custom jQuery scripts */
function add_custom_scripts() {
    wp_enqueue_style( 'mailchimp_css', '//cdn-images.mailchimp.com/embedcode/classic-10_7.css' );
    wp_enqueue_script(
        'mailchimp_js',
        '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js',
        'jquery',
        '1.0',
        true
    );
    wp_enqueue_script(
        'ti-custom-child',
        get_stylesheet_directory_uri() . '/js/jquery.custom.child.js',
        'jquery',
        '1.0',
        true
    );
}

add_action('wp_enqueue_scripts', 'add_custom_scripts');
