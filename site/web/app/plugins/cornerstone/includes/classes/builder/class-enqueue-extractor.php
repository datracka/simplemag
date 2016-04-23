<?php

class Cornerstone_Enqueue_Extractor extends Cornerstone_Plugin_Component {

	protected $script_handles;
	protected $style_delta;
	protected $scripts;

	public function setup() {
		add_filter( 'script_loader_tag', array( $this, 'preview_script_element' ), 10, 3 );
	}

	public function preview_script_element( $tag, $handle, $src ) {
		return str_replace('src=', 'data-handle="' . esc_attr( $handle ) . '" src=', $tag );
	}

	public function start() {

		//global $wp_styles;
		//$this->styles = $wp_styles->queue;

		$wp_scripts = wp_scripts();
		$this->script_handles = array_values( $wp_scripts->queue );
		$this->isolated_handles = array();

	}

	public function extract() {
		$wp_scripts = wp_scripts();
		$isolated = array_diff( $wp_scripts->queue, $this->script_handles );
		$this->script_handles = array_unique( array_merge( $isolated, $this->script_handles ) );
		return $isolated;
	}

	public function get_scripts() {

		$wp_scripts = wp_scripts();
		$this->scripts = array();
		add_filter( 'script_loader_tag', array( $this, 'catch_script_tags' ), 99, 3 );

		ob_start();
		$wp_scripts->do_items( $this->script_handles );
		ob_get_clean();

		return $this->scripts;

	}

	public function catch_script_tags( $tag, $handle, $src ) {

		// preg_match('/src=[\"\'](.*?)[\"\']/', $tag, $matches );
		// if ( $matches ) {
		// 	$src = $matches[0];
		// }

		$this->scripts[$handle] = array(
			'tag' => $tag,
			'src' => $src
		);

		return $tag;

	}

}