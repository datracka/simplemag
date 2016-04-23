<?php

/**
 * Manage all the front end code for Cornerstone
 * including shortcode styling and scripts
 */

class Cornerstone_Front_End extends Cornerstone_Plugin_Component {

	/**
	 * Setup hooks
	 */
	public function setup() {

		// Enqueue Scripts & Styles

		add_action( 'wp_enqueue_scripts', array( $this, 'scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'styles' ) );
		add_action( 'template_redirect', array( $this,  'postLoaded' ), 9998, 0 );

		// Remove empty p and br HTML elements
		add_filter( 'the_content', array( $this, 'cleanShortcodes' ) );

		// Add Body Class
		add_filter( 'body_class', array( $this, 'addBodyClass' ), 10002 );

	}

	/**
	 * Enqueue Styles
	 */
	public function styles() {

		if ( apply_filters( 'cornerstone_enqueue_styles', true ) ) {
			wp_enqueue_style( 'cornerstone-shortcodes', $this->plugin->css( 'site/style' ), array(), $this->plugin->version() );
		}

		if ( apply_filters( 'cornerstone_legacy_font_classes', false ) ) {
			wp_enqueue_style( 'x-fa-icon-classes', $this->plugin->css( 'site/fa-icon-classes' ), array(), $this->plugin->version() );
		}

	}

	/**
	 * Enqueue Scripts
	 */
	public function scripts() {

  	wp_register_script( 'cornerstone-site-head', $this->url( 'assets/js/dist/site/cs-head.min.js' ), array( 'jquery' ), $this->plugin->version(), false );
  	wp_register_script( 'cornerstone-site-body', $this->url( 'assets/js/dist/site/cs-body.min.js' ), array( 'cornerstone-site-head' ), $this->plugin->version(), true );
  	wp_register_script( 'vendor-ilightbox',      $this->url( 'assets/js/dist/site/vendor-ilightbox.min.js' ), array( 'jquery' ), $this->plugin->version(), true );
	//wp_register_script( 'vendor-google-maps',    'https://maps.googleapis.com/maps/api/js?sensor=false', array( 'jquery' ) );

  	wp_enqueue_script( 'cornerstone-site-head' );
  	wp_enqueue_script( 'cornerstone-site-body' );

	}

	public function postLoaded() {

		if ( apply_filters( '_cornerstone_front_end', true ) ) {
			add_action( 'wp_head', array( $this,  'inlineStyles' ), 9998, 0 );
			add_action( 'wp_footer', array( $this, 'inlineScripts' ), 9998, 0 );
		}

		$postSettings = get_post_meta( get_the_ID(), '_cornerstone_settings', true );
		$this->postSettings = ( is_array( $postSettings ) ) ? $postSettings : array();

	}

	/**
	 * Remove empty <p> and <br> from around shortcodes
	 */
	public function cleanShortcodes( $content ) {

    $array = array (
      '<p>['    => '[',
      ']</p>'   => ']',
      ']<br />' => ']'
    );

    return strtr( $content, $array );

  }

  /**
	 * Add Body class from Cornerstone Version number
	 */
	public function addBodyClass( $classes ) {
		$classes[] = 'cornerstone-v' . str_replace( '.', '_', $this->plugin->version() );
	  return $classes;
	}

	/**
	 * Load generated CSS output and place style tag in wp_head
	 */
	public function inlineStyles() {

		ob_start();

		if ( apply_filters( 'cornerstone_inline_styles', true ) ) {

			echo '<style id="cornerstone-generated-css" type="text/css">';

			$data = array_merge( $this->plugin->settings(), $this->plugin->component( 'Customizer_Manager' )->optionData() );
    	$this->view( 'frontend/styles', true, $data, true );

    	do_action( 'cornerstone_head_css' );

	  	echo '</style>';

		}

		if ( has_action('cornerstone_custom_css') ) {
			echo '<style id="cornerstone-custom-css" type="text/css">';
				do_action( 'cornerstone_custom_css' );
	  	echo '</style>';
		}

		if ( apply_filters( '_cornerstone_custom_css', isset( $this->postSettings['custom_css'] ) ) ) {
			echo '<style id="cornerstone-custom-page-css" type="text/css">';
				echo $this->postSettings['custom_css'];
				do_action( 'cornerstone_custom_page_css' );
	  	echo '</style>';
		}

	  $css = ob_get_contents(); ob_end_clean();

	  //
	  // 1. Remove comments.
	  // 2. Remove whitespace.
	  // 3. Remove starting whitespace.
	  //

	  $output = preg_replace( '#/\*.*?\*/#s', '', $css );            // 1
	  $output = preg_replace( '/\s*([{}|:;,])\s+/', '$1', $output ); // 2
	  $output = preg_replace( '/\s\s+(.*)/', '$1', $output );        // 3

	  echo $output;
	}

	public function inlineScripts() {

		if ( has_action('cornerstone_custom_js') ) {
			echo '<script id="cornerstone-custom-js">';
				do_action( 'cornerstone_custom_js' );
	  	echo '</script>';
		}

		if ( apply_filters( '_cornerstone_custom_page_js', isset( $this->postSettings['custom_js_mini'] ) ) ) {
			echo '<script id="cornerstone-custom-js">';
				echo $this->postSettings['custom_js_mini'];
				do_action( 'cornerstone_custom_page_js' );
	  	echo '</script>';
		}

	}

}