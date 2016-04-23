<?php

/**
 * @file
 * This file is the main entry point for the tp2wp importer "sub-plugin"
 * that handles providing an overview of the plugin, particularly
 * checking that the system is ready to use the importer.
 *
 * This file is broken out from the main tp2wp importer plugin's script
 * for organizational purposes only.  This file is included by the plugin
 * on every load.
 */

define( 'TP2WP_IMPORTER_STATUS_PERMALINK_STRUCTURE', '/%year%/%monthnum%/%postname%.html' );

if ( is_admin() ) {
    include dirname( __FILE__ ) . '/page.php';
}
