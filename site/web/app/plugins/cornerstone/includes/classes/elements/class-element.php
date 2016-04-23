<?php

/* class My_Custom_Element extends from Cornerstone_Element */

abstract class Cornerstone_Element {

	// If you're using Cornerstone's shortcode generation, it will use this prefix.
	// The final shortcode will be this prefix combined with the element name.
	// For example: 'myplugin_myelement'
	public $shortcode_prefix = 'myplugin_';

	// In controls.php and defaults.php you'll have acces to a '$td' variable for
	// quick shorthand reference to your text domain. If you'd like to utilize
	// this, assign it here first.
	public $text_domain = '';

	public function shortcodes() {

	}
	public function ui() {

		return array(

			// Used throughout Cornerstone to display what this element is called.
			// Remember to localize this value in your own elements.
      'title' => 'Custom Element',

      // Cornerstone icons are SVG files in a line-art style. A generic icon
      // will always be displayed, but you can provide your own if desired.
      // Icons must be SVG files, and should [TODO: provide specifictions]
      'icon'  => 'url/to/your-custom-icon.svg',

      // Clicking part of an element in the preview area can automatically
      // focus a control when the inspector is opened. Under this 'autofocus'
      // attribute you can provide a list of jQuery selectors that correspond to
      // a value key that should have it's control focused.
      'autofocus' => array(
    		'value_key' => '.jquery.selector',
				'content' => '.my-content'
    	),

      // If this element has special conditions for being active, you can provide
      // a message to be displayed in place of it's usual markup. For example,
      // if it depends on another plugin, you may want to let users know that
      // they should activate it. Remember to localize this message.
    	'inactive_message' => ''
    );
	}

	// These flags are used to designate special behavior for an element.
	// Override this function in your element definition and customize as needed.
	public function flags() {

		return array(

			// Determine what parts of Cornerstone will have this element available.
			// Possible values: all, builder, generator
			'context' => 'all',

			// Indicate this element as a "child". This will remove it from the main
			// library. Some elements will have an additional element as a child that
			// has it's own settings inside it. For example, with the Accordion there
			// is an "Accordion Item" which is registered as a child.
			'child' => false

		);

	}

	// Allow conditions to be met for an element to appear in the library.
	// For example, you may want to prevent users from adding an element to their
	// page unless a third party plguin is active. Override this function if you
	// need to set a condition.
	public function is_active() {

		// Examples:

		// return ( class_exists( 'Third_Party_Plugin' ) );
		// return ( defined( 'PLUGIN_CONSTANT' ) );

		return true;

	}


	/*
	// The following functions are OPTIONAL and can be added to your element
	// to further customize it interacts with Cornerstone.

	// Add this function to provide some additional initialization logic. It is
	// called right after the "defaults" are prepared, and just before a shortcode
	// is registered for this element
	public function register() {



	}

	// Add this function to your element definition if you want to source
	// the controls from an alternate location. You could return an array directly
	// from your definition class, or use your own custom logic.
	public function controls( ) {
		return array();
	}


	// Add this function to your element definition if you want to source
	// the defaults from an alternate location. You could return an array directly
	// from your definition class, or use your own custom logic.
	public function defaults() {
		return array();
	}


	// Add this to your element definition for a quick way to filter controls
	// after they are loaded. For example, in your controls.php file you may leave
	// some sections as placeholders, which can then be filled in programatically.
	// This runs immediately after controls.php is loaded.
	public function update_controls( $controls ) {
		// Example:
		$controls['something_else'] = $this->my_custom_control_generator();
		return $controls;
	}


	//

	public function update_generated_shortcode_atts( $atts ) {
		return $atts;
	}

	*/


	public function get_style_template() {
		$this->get_file_template( 'style' );
	}

	public function shortcode_output( $atts, $content = "" ) {

	}

	public function build_shortcode( $data, $children = '' ) {
		return $this->build_shortcode( $data, $children );
	}

}