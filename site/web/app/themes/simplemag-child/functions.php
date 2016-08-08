<?php
/* Custom jQuery scripts */
function add_custom_scripts() {
    wp_enqueue_script(
        'ti-custom-child',
        get_stylesheet_directory_uri() . '/js/jquery.custom.child.js',
        'jquery',
        '1.0',
        true
    );
}

add_action('wp_enqueue_scripts', 'add_custom_scripts');