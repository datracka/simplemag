<?php

/**
 * Element Definition: Section
 */

class CSE_Row {

	public function ui() {
		return array(
      'title' => __( 'Row', csl18n() ),
    );
	}

	public function flags() {
		return array( 'context' => '_layout' );
	}

	public function _layout_defaults() {
		return array(
			'_column_layout' => '1/1',
			'elements' => array(
				array( '_type' => 'column', '_active' => true ),
				array( '_type' => 'column' ),
				array( '_type' => 'column' ),
				array( '_type' => 'column' ),
				array( '_type' => 'column' ),
				array( '_type' => 'column' ),
			)
		);
	}

	public function update_defaults( $defaults ) {
		return array_merge($defaults, $this->_layout_defaults() );
	}

	public function register_shortcode() {
  	return false;
  }

	public function update_build_shortcode_atts( $atts ) {

		unset( $atts['title'] );
		unset( $atts['_column_layout'] );
		unset( $atts['elements'] );

		$atts = Cornerstone_Control_Mixins::legacy_injections( $atts );
		return $atts;

	}

}