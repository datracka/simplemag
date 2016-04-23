<?php
/*
Plugin Name: Shortcodes Indep
Plugin URI: http://themesindep.com
Description: ThemesIndep shortcodes generator
Version: 3.5
Author: ThemesIndep
Author URI: http://themesindep.com
*/


if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

// Add Shortcodes button to the editor
function add_shortcodes_editor_button() {

	// Check user permissions
	if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
		return;
	}
	// Check if Editor is enabled
	if ( 'true' == get_user_option( 'rich_editing' ) ) {
		add_filter( 'mce_external_plugins', 'shortcodes_add_editor_plugin' );
		add_filter( 'mce_buttons', 'shortcodes_register_editor_button' );
	}

}
add_action( 'admin_head', 'add_shortcodes_editor_button' );


// Shortocdes editor menu
function shortcodes_add_editor_plugin( $plugin_array ) {
	$plugin_array['shortcodes_editor_button'] = plugin_dir_url( __FILE__ ) . 'js/editor-button-menu.js';
	return $plugin_array;
}


// Register the shortcodes editor button
function shortcodes_register_editor_button( $buttons ) {
	array_push( $buttons, 'shortcodes_editor_button' );
	return $buttons;
}


// Editor button image
function shortcodes_editor_css() {
	wp_enqueue_style( 'sc-editor-style', plugin_dir_url( __FILE__ ) . 'css/editor-style.css' );
}
add_action( 'admin_enqueue_scripts', 'shortcodes_editor_css' );



// All Shortcodes functions
require_once( plugin_dir_path( __FILE__ ) . 'shortcodes-functions.php' );



// Front-end scripts for accordion and tabs, shortcodes styles
if( !function_exists ( 'shortcodes_front_end_scripts' ) ){

	function shortcodes_front_end_scripts() {

		// Add CSS
		wp_enqueue_style( 'sc-frontend-style', plugin_dir_url( __FILE__ ) . 'css/frontend-style.css' );

		// Add Scripts
		wp_register_script( 'sc-frontend-tabs', plugin_dir_url( __FILE__ ) . 'js/frontend-tabs.js', 'jquery', '1.0', true );
		wp_register_script( 'sc-frontend-toggle', plugin_dir_url( __FILE__ ) . 'js/frontend-toggle.js', 'jquery', '1.0', true );

	}

	add_action( 'wp_enqueue_scripts', 'shortcodes_front_end_scripts' );

}