<?php

class Cornerstone_Integration_Conflict_Resolution {

	public static function shouldLoad() {

		return true;
	}

	public function __construct() {

		add_action( 'cornerstone_load_builder', array( $this, 'disableCaching' ) );
		add_action( 'cornerstone_before_endpoint', array( $this, 'disableCaching' ) );
		add_action( 'cornerstone_before_load_preview', array( $this, 'disableCaching' ) );
		add_action( 'cornerstone_before_load_preview', array( $this, 'beforeLoadPreview' ) );

		//WPML Integration - pre_get_posts only works on __construct
		if ( class_exists( 'SitePress' ) && apply_filters( 'cornerstone_enable_wpml_integration', true ) ) {

     			add_filter( 'pre_get_posts', array( $this, 'wpml_get_posts') );
     			add_filter( 'the_title', array( $this, 'wpml_title'), 99, 2 );
     			add_filter( 'the_permalink', array( $this, 'wpml_permalink') );
     			//Due to deep connection with cornerstone to the_excerpt, let's not add another excerpt filter for now
     			//add_filter( 'get_the_excerpt', array( $this, 'wpml_excerpt') );
		}

	}

	public static function preInit() {

		// Disable NextGEN Resource Manager
		add_filter('run_ngg_resource_manager', '__return_false' );

		global $wp_version;

		if ( version_compare( $wp_version, '4.2', '<' ) ) {
			require_once( CS()->path('includes/utility/wp.php') );
		}

	}

	public function disableCaching() {

		// General DONOTCACHEPAGE for WP Super Cache, W3TC and others.
		if (!defined('DONOTCACHEPAGE'))
			define( 'DONOTCACHEPAGE', true );

		// Disable W3TC
		if ( class_exists('W3_Root') && apply_filters( 'cornerstone_compat_w3tc', true ) ) {

			if ( !defined( 'DONOTMINIFY') )
				define( 'DONOTMINIFY', true );

			if ( !defined( 'DONOTCDN') )
				define( 'DONOTCDN', true );
		}

	}

	public function beforeLoadPreview() {

		if ( function_exists( 'wpseo_frontend_head_init' ) ) {
			remove_action( 'template_redirect', 'wpseo_frontend_head_init', 999 );
		}

		if ( function_exists( 'csshero_add_footer_trigger' ) ) {
			add_filter( 'pre_option_wpcss_hidetrigger', '__return_true' );
		}

	}

	public function wpml_get_posts ( $query ) {

		global $sitepress;

		if ( !is_callable( array( $sitepress, 'switch_lang' ) ) || !is_callable( array( $sitepress, 'get_current_language' ) ) )
			return;

		$sitepress->switch_lang( $sitepress->get_current_language() ); //Make sure that even custom query gets the current language

		$query->query_vars['suppress_filters'] = false;

		return $query;

	}

	//WPML Post object usable by multiple filters
	private function wpml_post () {

		global $post, $sitepress;

		if ( !function_exists('icl_object_id') || !is_callable( array( $sitepress, 'get_current_language' ) ) )
			return;

		return get_post( icl_object_id( $post->ID, 'post', false, $sitepress->get_current_language() ) );
	}

	public function wpml_title ( $title, $id ) {

		$post = $this->wpml_post();

		return $post->ID !== $id ? $title :
			//Let's apply the_title filters (apply_filters causes loop)
			trim (
			convert_chars (
			wptexturize (
				esc_html ( $post->post_title )
			) ) );
	}

	public function wpml_permalink ( $permalink ) {

		$post = $this->wpml_post();

		return get_permalink( $post->ID );

	}

}
