<?php

/**
 * Element Definition: Responsive Text
 */

class CSE_Responsive_Text {

	public function ui() {
		return array(
      'title' => __( 'Responsive Text', csl18n() ),
    );
	}

	public function flags() {
		return array( 'context' => '_internal' );
	}

	public function register_shortcode() {
  	return false;
  }

	public function defaults() {
		return array(
			'title' => '',
			'selector' => '',
			'compression' => '1.0',
			'min_size' => '',
			'max_size' => ''
		);
	}

	public function controls() {
		return array(
			'common' => 'none',
			'title' => array(
				'type' => 'title',
				'context' => 'content',
		    'suggest' => __( 'Responsive Text Item', $this->text_domain ),
			),
			'selector' => array(
				'ui' => array(
					'title'   => __( 'Selector', $this->text_domain ),
					'tooltip' => __( 'Enter in the selector for your Responsive Text (e.g. if your class is "h-responsive" enter ".h-responsive").', $this->text_domain ),
				),
				'context' => 'content',
		    'suggest' => '.h-responsive',
			),
			'compression' => array(
				'type' => 'text',
				'ui' => array(
					'title'   => __( 'Compression', $this->text_domain ),
					'tooltip' => __( 'Enter the compression for your Responsive Text. Adjust up and down to desired level in small increments (e.g. 0.95, 1.15, et cetera).', $this->text_domain ),
				)
			),
			'min_size' => array(
				'type' => 'text',
				'ui' => array(
					'title'   => __( 'Minimum Size', $this->text_domain ),
					'tooltip' => __( 'Enter the minimum size of your Responsive Text.', $this->text_domain ),
				)
			),
			'max_size' => array(
				'type' => 'text',
				'ui' => array(
					'title'   => __( 'Maximum Size', $this->text_domain ),
					'tooltip' => __( 'Enter the maximum size of your Responsive Text.', $this->text_domain ),
				)
			)
		);
	}

	public function update_build_shortcode_atts( $atts ) {

		unset( $atts['title'] );

		return $atts;

	}

}