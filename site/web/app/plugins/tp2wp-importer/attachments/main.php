<?php

/**
 * @file
 * This file is the main entry point for the tp2wp importer "sub-plugin"
 * that handles importing attachments from loaded content.
 *
 * This file is broken out from the main tp2wp importer plugin's script
 * for organizational purposes only.  This file is included by the plugin
 * on every load.
 */

define( 'TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_PAGE', 'tp2wp_importer_attachments_options_settings_page' );
define( 'TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_OPTIONS_GROUP', 'tp2wp_importer_attachments_options_group' );
define( 'TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG', 'tp2wp_importer_attachments_imported_date' );
define( 'TP2WP_IMPORTER_ATTACHMENTS_NONCE', 'tp2wp_importer_attachments_admin_page' );
define( 'TP2WP_IMPORTER_ATTACHMENTS_ALT_DIR_NAME', 'tp2wp-migrated' );

if ( is_admin() ) {
    include dirname( __FILE__ ) . '/ajax.php';
    include dirname( __FILE__ ) . '/page.php';
}

/**
 * Implements init action
 *
 * Done so that we can programtically redirect requests to Typepad attachments
 * to their Wordpress equivilents.
 */
function tp2wp_importer_attachment_init () {

    // We only want to redirect when a) the requested URL looks like the
    // types of URLs Typepad uses for attachments, and b) we have a copy
    // of the file we can redirect the user to.
    $typepad_attachment_pattern = '/\/\.a\/*/';
    $requested_url = $_SERVER["REQUEST_URI"];
    if ( ! preg_match( $typepad_attachment_pattern, $requested_url ) ) {
        return;
    }

    // Next, check that the current URL is at least sufficently well constructed
    // that we can extract the path part of it out.
    $requested_url_parts = parse_url( $requested_url );
    if ( ! $requested_url_parts ) {
        return;
    }
    $requested_file = $requested_url_parts['path'];

    // Just incase there is anything in the URL earlier, we just want to start
    // with the /.a/ part of the URL.
    $token = '/.a/';
    if ( ( $index = strpos( $requested_file, $token ) ) !== FALSE) {
        $requested_file = substr( $requested_file, $index + strlen( $token ) - 1 );
    }

    tp2wp_importer_load_functions( 'attachments' );

    // The, check and make sure that there is a directory on the system
    // currently where we've been creating / linking second copies of
    // imported files.  If not, then there is no way there is a file we
    // can redirect to.
    $base_alt_url = tp2wp_importer_attachments_alt_upload_url();
    if ( ! $base_alt_url ) {
        return;
    }

    // Last, see if there is a copy of the file being requested (at the
    // Typepad style address) in our collection of secondary imported
    // files.  If not, then don't redirect it.
    $alt_upload_dir_path = tp2wp_importer_attachments_alt_upload_path();

    $alt_upload_file_path = $alt_upload_dir_path . $requested_file;
    if ( ! is_file( $alt_upload_file_path ) && ! is_link( $alt_upload_file_path ) ) {
        return;
    }

    // But if there is, do the redirection w/o needing to bother with .htaccess
    // redirects.
    wp_redirect( $base_alt_url . $requested_file, 301 );
    exit;
}
add_action( 'init', 'tp2wp_importer_attachment_init' );


// ===================================
// ! Plugin Install / Uninstall Hooks
// ===================================

/**
 * When the plugin is deactivated, clean up the state we've stored in
 * the options table to keep things nice and tidy.
 */
function tp2wp_importer_attachments_deactivated () {
    // Maintained by the settings / options API
    delete_option( TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_OPTIONS_GROUP );
}
register_deactivation_hook( __FILE__, 'tp2wp_importer_attachments_deactivated' );
