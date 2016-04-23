<?php

class Cornerstone_Style_Loader extends Cornerstone_Plugin_Component {

	protected $page_style = '';

	public function setup() {
		//add_action( 'wp_head', array( $this, 'setup_styles' ), 9999 );
	}

	public function setup_styles() {

		$this->global_style = get_option( '_cornerstone_style_cache', '' );
		if ( '' == $this->global_style ) {
			$this->global_style = $this->generate_global_styles();
			update_option( '_cornerstone_style_cache', $this->global_style );
		}

		$this->view( 'frontend/global-style' );

		if ( !is_singular() ) return;

		global $post;

		//delete_post_meta( $post->ID, '_cornerstone_style_cache' );
		$this->page_style = get_post_meta( $post->ID, '_cornerstone_style_cache', true );
		if ( '' == $this->page_style ) {
			$this->page_style = $this->generate_page_styles( $post->ID );
			update_post_meta( $post->ID, '_cornerstone_style_cache', $this->page_style );
		}

		$this->view( 'frontend/page-style' );

	}

	public function generate_page_styles( $post_id ) {
		//new Cornerstone_Page_Styler( $post_id );
		return '';// 'body { color: black; }';
	}

	public function generate_global_styles() {
		$styler = new Cornerstone_Style_Engine;
	}

}