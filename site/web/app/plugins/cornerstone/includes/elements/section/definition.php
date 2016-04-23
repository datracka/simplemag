<?php

/**
 * Element Definition: Section
 */

class CSE_Section {

	public function ui() {
		return array(
      'title'       => __( 'Section', csl18n() ),
    );
	}

	public function flags() {
		return array( 'context' => '_layout' );
	}

	public function _layout_defaults() {
		return array(
			'elements' => array( array( '_type' => 'row' ) )
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
		unset( $atts['elements'] );

		if ( isset($atts['bg_type'])  ) {

			if ( $atts['bg_type'] == 'image' && isset($atts['bg_pattern_toggle']) && $atts['bg_pattern_toggle'] ) {
				$atts['bg_pattern'] = $atts['bg_image'];
				unset( $atts['bg_image'] );
			}

			if ( $atts['bg_type'] != 'image' ) {
				unset( $atts['bg_image'] );
			}

			if ( $atts['bg_type'] != 'video' ) {
				unset( $atts['bg_video'] );
				unset( $atts['bg_video_poster'] );
			}

			if ( $atts['bg_type'] == 'none' ) {
				unset( $atts['bg_color'] );
			}

			unset( $atts['bg_pattern_toggle'] );
			unset( $atts['bg_type'] );

		}



		$atts = Cornerstone_Control_Mixins::legacy_injections( $atts );

		return $atts;

	}
}