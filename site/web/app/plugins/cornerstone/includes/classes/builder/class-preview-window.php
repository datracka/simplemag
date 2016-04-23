<?php
/**
 * This class is responsible for settings up everything that happens
 * inside the preview iframe
 */
class Cornerstone_Preview_Window extends Cornerstone_Plugin_Component {

	public $dependencies = array( 'Enqueue_Extractor' );
	public $content_cache = '';

	/**
	 * Setup hooks
	 */
	public function setup() {

		do_action( 'cornerstone_before_load_preview' );

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ), 999 );
		add_action( 'template_redirect', array( $this, 'pageLoading' ), 9999999 );
		add_filter( 'show_admin_bar', '__return_false' );

		add_filter( '_cornerstone_custom_css', '__return_true' );
		add_action( 'wp_head', array( $this, 'inlineStyles' ), 9998, 0 );

	}

	/**
	 * Hook in to filter the content as late as possible.
	 */
	public function pageLoading() {

		add_filter( 'the_content', array( $this, 'wrap_content' ), -9999999 );
		add_action( 'wp_footer', array( $this, 'process_content' ), -999999 );

		do_action( 'cornerstone_load_preview' );

	}

	/**
	 * Load Preview Scripts / Styles
	 */
	public function enqueue() {

		// Preview CSS
		wp_enqueue_style( 'cs-preview', $this->plugin->css( 'admin/preview' ), null, $this->plugin->version() );

		// Piggy back off the builder to enqueue main scripts
		$this->plugin->component( 'Builder' )->enqueueScripts();

		// Vendor Scripts
		wp_enqueue_script( 'mediaelement' );
		//wp_enqueue_script( 'vendor-ilightbox' );

		$this->plugin->component( 'Element_Orchestrator' )->preview_enqueue();

	}

	/**
	 * Load generated CSS output and place style tag in wp_head
	 */
	public function inlineStyles() {

		$data = array_merge( $this->plugin->settings(), $this->plugin->component( 'Customizer_Manager' )->optionData() );
		$styles = $this->view( 'builder/styles', false, $data, true );

		ob_start();
		do_action( 'cornerstone_generated_preview_css' );
		$extra = ob_get_clean();

	  //
	  // 1. Remove comments.
	  // 2. Remove whitespace.
	  // 3. Remove starting whitespace.
	  //

	  $output = preg_replace( '#/\*.*?\*/#s', '', $styles . $extra ); // 1
	  $output = preg_replace( '/\s*([{}|:;,])\s+/', '$1', $output );  // 2
	  $output = preg_replace( '/\s\s+(.*)/', '$1', $output );         // 3

	  echo '<style id="cornerstone-generated-preview-css" type="text/css">' . $output . '</style>';
	}

	/**
	 * Replace the page content with a wrapping div that will be re-populated
	 * with our javascript application.
	 */
	public function wrap_content( $content ) {
		remove_filter( 'the_content', array( $this, 'wrap_content' ), -9999999 );
		$this->content_cache = $content;
		return '<div id="cornerstone-preview-entry" class="cs-preview-loading"></div>';
	}

	/**
	 * Process all the page shortcodes, but don't output anything.
	 * This allows shortcodes to enqueue scripts to the footer even if they
	 * were previously removed by the content wrapper.
	 */
	public function process_content() {
		apply_filters( 'the_content', $this->content_cache );
	}
}