<?php

/**
 * @file
 * Functions used for defining core plugin UI funcitonality.  This
 * page will only be loaded when viewed as an administrator (ie
 * is_admin() is true).
 */

/**
 * Implements admin_menu action.
 */
function tp2wp_importer_attachments_admin_menu () {
    add_submenu_page(
        TP2WP_IMPORTER_MENU_ROOT,
        'TP2WP Import Attachments',
        '3. Attachments',
        'manage_options',
        'tp2wp-importer-attachments',
        'tp2wp_importer_attachments_page_callback'
    );
}
add_action( 'admin_menu', 'tp2wp_importer_attachments_admin_menu' );


function tp2wp_importer_attachments_page_callback () {

    $page_handle = 'tp2wp-importer-attachments-page';

    wp_enqueue_script(
        $page_handle,
        plugins_url( '/js/page.js' , __FILE__ ),
        array( 'jquery', 'tp2wp-importer' )
    );

    wp_enqueue_style(
        $page_handle,
        plugins_url( '/css/page.css' , __FILE__ )
    );

    $nonce = wp_create_nonce( TP2WP_IMPORTER_ATTACHMENTS_NONCE );
    $options = get_option( TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_OPTIONS_GROUP, null );
    $domains = $options ? $options['domains'] : array();

    $variables = array(
        'nonce' => $nonce,
        'domains' => $domains,
    );

    $template_name = dirname( __FILE__) . '/templates/page.php';
    echo tp2wp_importer_process_template( $template_name, $variables );
}
