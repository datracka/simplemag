<?php
class Cornerstone_Builder_Renderer extends Cornerstone_Plugin_Component {

	public $raw_markup = false;

	public $dependencies = array( 'Front_End' );

	public function ajax_handler( $data ) {

		CS_Shortcode_Preserver::init();
		add_filter('cs_preserve_shortcodes_no_wrap', '__return_true' );

		$this->orchestrator = $this->plugin->component( 'Element_Orchestrator' );
		$this->orchestrator->load_elements();

		$this->mk1 = new Cornerstone_Legacy_Renderer( $this->plugin->component('Legacy_Elements') );

		global $post;
		if ( !isset( $data['post_id'] ) || !$post = get_post( (int) $data['post_id'] ) )
      wp_send_json_error( array('message' => 'post_id not set' ) );

    setup_postdata( $post );


    $this->enqueue_extractor = $this->plugin->loadComponent( 'Enqueue_Extractor' );
    $this->enqueue_extractor->start();

    if ( isset( $data['raw_markup'] ) )
    	$this->raw_markup = (bool) $data['raw_markup'];

    if ( !isset( $data['batch'] ) )
			wp_send_json_error( array('message' => 'No element data recieved' ) );

		$jobs = $this->batch( $data['batch'] );
		$scripts = $this->enqueue_extractor->get_scripts();

		if ( is_wp_error( $jobs ) )
			wp_send_json_error( array( 'message' => $jobs->get_error_message() ) );

		$result = array( 'jobs' => $jobs, 'scripts' => $scripts );

		//Suppress PHP error output unless debugging
		if ( CS()->common()->isDebug() )
			return wp_send_json_success( $result );
		return @wp_send_json_success( $result );

	}

	/**
	 * Run a batch of render jobs.
	 * This helps reduce AJAX request, as the javascript will send as many
	 * elements as it can to be rendered at once.
	 * @param  array $data list of jobs with element data
	 * @return array       finished jobs
	 */
	public function batch( $batch ) {

		$results = array();

		foreach ($batch as $job) {

			if ( !isset( $job['jobID'] ) || !isset( $job['data'] ) || !isset( $job['provider'] ) )
				return new WP_Error( 'cs_renderer', 'Malformed render job request');

			$markup =  $this->render_element( $job['data'], ( $job['provider'] != 'mk2' ) );

			$scripts = $this->enqueue_extractor->extract();

			$results[$job['jobID']] = array( 'markup' => $markup, 'ts' => $job['ts'] );

			if ( !empty($scripts) )
				$results[$job['jobID']]['scripts'] = $scripts;

		}

		return $results;

	}

	/**
	 * Return an element that has been rendered with data formatted for the preview window
	 * @param  array   $data   element data
	 * @param  boolean $legacy Whether or not to use the old render system.
	 * @return string          shortcode to be processed for preview window
	 */
	public function render_element( $element, $legacy = false ) {

		if ( $legacy ) {
			$markup = $this->mk1->renderElement( $element );
		} else {
			$definition = $this->orchestrator->get( $element['_type'] );
			unset( $element['_type'] );
			$markup = $definition->preview( $element );
		}

		$markup = ( $this->raw_markup ) ? $markup : apply_filters( 'the_content', $markup );

		if ( !is_string( $markup ) )
			$markup = '';

		return $markup;

	}

}