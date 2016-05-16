<?php

/*
Plugin Name: TP2WP Importer
Plugin URI: https://tp2wp.com
Description: Collection of functionality to ease importing Typepad data into Wordpress.
Author: Peter Snyder, ReadyMadeWeb
Author URI: https://tp2wp.com
Version: 1.0.13
Text Domain: tp2wp-importer
License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/

define( 'TP2WP_IMPORTER_MENU_ROOT', 'tp2wp-importer' );



// ==========
// ! Actions
// ==========

/**
 * Implements admin_menu action.
 */
function tp2wp_importer_admin_menu () {
    add_menu_page(
        'TP2WP Status Check',
        'TP2WP Importer',
        'manage_options',
        TP2WP_IMPORTER_MENU_ROOT,
        'tp2wp_importer_status_page_callback'
    );
}

/**
 * Implements admin_init action.
 *
 * Add basic script used through the entire plugin.
 */
function tp2wp_importer_admin_init () {
    wp_register_script(
        'tp2wp-importer',
        plugins_url( 'tp2wp-importer.js' , __FILE__ )
    );
}


if ( is_admin() ) {
    add_action( 'admin_init', 'tp2wp_importer_admin_init', 0 );
    add_action( 'admin_menu', 'tp2wp_importer_admin_menu' );
}

// ==========
// ! Helpers
// ==========

function tp2wp_importer_url ($step) {
    $admin_url = get_admin_url();
    $urls = array(
        'status' => $admin_url . 'admin.php?page=tp2wp-importer',
        'content' => $admin_url . 'admin.php?import=tp2wp',
        'attachments' => $admin_url . 'admin.php?page=tp2wp-importer-attachments',
    );
    return $urls[$step];
}

function tp2wp_importer_tabs ($step = 'status') {
    $template = dirname( __FILE__ ) . '/general/templates/tabs.php';
    $params = array(
        'step' => $step,
    );
    return tp2wp_importer_process_template( $template, $params );
}

/**
 * Processes an included template, and returns the results as a string,
 * including the provided variables as placeholders in the output.
 *
 * @param string $template_name
 *   The name of a template, in the plugin's 'templates' directory,
 *   to process and return
 * @param array $variables
 *   An array of key -> value pairs to use when processing the given template
 *
 * @return string
 *   Returns the result of processing the template.
 */
function tp2wp_importer_process_template ($template_name, $variables) {

    extract( $variables, EXTR_REFS );
    ob_start();
    include $template_name;
    $output = ob_get_clean();
    return $output;
}

/**
 * Loads up the functions file associated with a given subsection of the plugin.
 * Use this function, instead hardcoding "include" statements so that that
 * we can use the faster "include" with a local static cache of which files
 * have been loaded.
 *
 * @param string $section
 *   The name of one of the subsections of the plugin to load.  This should
 *   be something like "status", "attachments", etc.
 */
function tp2wp_importer_load_functions ($section) {

    static $cache = array();

    if ( isset( $cache[$section] ) ) {
        return;
    }

    include dirname( __FILE__ ) . '/' . $section . '/functions.php';
    $cache[$section] = true;
}

// Load up the main scripts for all the other includes "sub" plugins.
// Most of the content of this plugin is handed in these submodules, but is
// seperated for ease of organization
include dirname( __FILE__ ) . '/status/main.php';
include dirname( __FILE__ ) . '/content/main.php';
include dirname( __FILE__ ) . '/attachments/main.php';
