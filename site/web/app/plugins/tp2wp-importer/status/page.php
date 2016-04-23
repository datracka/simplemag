<?php


/**
 * Implements admin_menu action.
 */
function tp2wp_importer_page_admin_menu () {
    add_submenu_page(
        TP2WP_IMPORTER_MENU_ROOT,
        'TP2WP Status Check',
        '1. Status Check',
        'manage_options',
        TP2WP_IMPORTER_MENU_ROOT,
        'tp2wp_importer_status_page_callback'
    );
}
add_action( 'admin_menu', 'tp2wp_importer_page_admin_menu' );

/**
 * Menu callback function to define the contents of the plugin's status
 * page.
 */
function tp2wp_importer_status_page_callback () {

    tp2wp_importer_load_functions( 'status' );
    $page_handle = 'tp2wp-importer-status-page';

    wp_enqueue_style(
        $page_handle,
        plugins_url( '/css/page.css' , __FILE__ )
    );

    // Check to see if there are other plugins enabled currently
    // other than the importer.
    $active_plugins = tp2wp_importer_status_active_plugins();
    $allowed_plugins = array(
        'tp2wp-importer/tp2wp-importer.php',
    );
    $bad_plugins = array_diff( $active_plugins, $allowed_plugins );

    // Check to see if the current permalink stucture matches what is needed
    // in the default case to match Typepad / Moveabletype posts
    $current_permalink_structure = get_option( 'permalink_structure' );
    $ideal_permalink_structure = TP2WP_IMPORTER_STATUS_PERMALINK_STRUCTURE;

    $mem_limit = tp2wp_importer_status_memory_limit();
    $max_execution_time = tp2wp_importer_status_max_execution_time();

    $ideal_mem_limit_bytes = 268435456; // 256M
    $ideal_max_execution_time = 180; // 3 minutes

    $variables = array(
        'ideal_mem_limit_bytes' => $ideal_mem_limit_bytes,
        'current_mem_limit_bytes' => $mem_limit,

        'ideal_mem_limit' => tp2wp_importer_status_bytes_to_human( $ideal_mem_limit_bytes ),
        'current_mem_limit' => tp2wp_importer_status_bytes_to_human( $mem_limit ),

        'ideal_max_execution_time' => $ideal_max_execution_time,
        'current_max_execution_time' => $max_execution_time,

        'ideal_permalink_structure' => $ideal_permalink_structure,
        'current_permalink_structure' => $current_permalink_structure,

        'is_default_theme' => tp2wp_importer_status_is_theme_bundled(),
        'bad_plugins' => $bad_plugins,
        'xml_extension_installed' => tp2wp_importer_status_xml_extension_exists(),

        'supports_symlinks' => tp2wp_importer_status_supports_symlinks(),
        'upload_directory_is_writeable' => tp2wp_importer_status_alt_upload_location_correct(),
        'upload_directory_path' => tp2wp_importer_attachments_alt_upload_path(),

        'supports_url_rewrite' => got_url_rewrite(),
    );

    $template_name = dirname( __FILE__ ) . '/templates/page.php';
    echo tp2wp_importer_process_template( $template_name, $variables );
}
