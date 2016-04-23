<?php
/**
 * This is a centralized place to declare AJAX handlers
 * and point them to their respective classes.
 */
class Cornerstone_Router extends Cornerstone_Plugin_Component {

	protected $endpoint = 'cornerstone-endpoint';
	/**
	 * Instantiate and register AJAX handlers
	 */
	public function setup () {

		add_rewrite_endpoint( $this->endpoint, EP_ALL );
		add_action( 'template_redirect', array( $this, 'endpoint' ), -99999 );

		// Register Cornerstone endpoint routes
		add_action( 'cornerstone_endpoint_cs_endpoint_save', array( $this, 'save' ) );
		add_action( 'cornerstone_endpoint_cs_render_element', array( $this, 'render' ) );
		add_action( 'cornerstone_endpoint_cs_setting_sections', array( $this, 'settings' ) );
		add_action( 'cornerstone_endpoint_cs_templates', array( $this, 'templates' ) );
		add_action( 'cornerstone_endpoint_cs_template_migration', array( $this, 'template_migration' ) );
		add_action( 'cornerstone_endpoint_cs_save_template', array( $this, 'template_save' ) );
		add_action( 'cornerstone_endpoint_cs_delete_template', array( $this, 'template_delete' ) );

		// Register Admin-Ajax fallback routes
		add_action( 'wp_ajax_cs_endpoint_save', array( $this, 'save' ) );
		add_action( 'wp_ajax_cs_render_element', array( $this, 'render' ) );
		add_action( 'wp_ajax_cs_setting_sections', array( $this, 'settings' ) );
		add_action( 'wp_ajax_cs_templates', array( $this, 'templates' ) );
		add_action( 'wp_ajax_cs_template_migration', array( $this, 'template_migration' ) );
		add_action( 'wp_ajax_cs_save_template', array( $this, 'template_save' ) );
		add_action( 'wp_ajax_cs_delete_template', array( $this, 'template_delete' ) );

		// Admin Ajax Only
		add_action( 'wp_ajax_cs_override', array( $this, 'override' ) );
		add_action( 'wp_ajax_cs_legacy_ajax', array( $this, 'enable_legacy_ajax' ) );

	}

	public function endpoint() {

		global $wp_query;

    if ( ! isset( $wp_query->query_vars[$this->endpoint] ) )
      return;

    do_action( 'cornerstone_before_endpoint' );
    send_origin_headers();

    if ( empty( $_REQUEST['action'] ) )
			die( '0' );

		@header( 'X-Robots-Tag: noindex' );
		@header( 'Cornerstone: true' );
		send_nosniff_header();
		nocache_headers();

    $action = ( is_user_logged_in()) ? 'cornerstone_endpoint_' : 'cornerstone_endpoint_nopriv_';
    do_action( $action . $_REQUEST['action'] );

    die('0');

	}

	public function save() {
		$this->plugin->loadComponent( 'Save_Handler' )->ajax_handler( $this->getJSON() );
	}

	public function render() {
		$this->plugin->loadComponent( 'Builder_Renderer' )->ajax_handler( $this->getJSON() );
	}

	public function settings() {
		$this->plugin->loadComponent( 'Settings_Manager' )->ajax_handler( $this->getJSON() );
	}

	public function templates() {
		$this->plugin->loadComponent( 'Layout_Manager' )->ajax_templates( $this->getJSON() );
	}

	public function template_migration() {
		$this->plugin->loadComponent( 'Layout_Manager' )->ajax_template_migration( $this->getJSON() );
	}

	public function override() {
		$this->plugin->loadComponent( 'Admin' )->ajaxHandler();
	}

	public function template_save() {
		$this->plugin->loadComponent( 'Layout_Manager' )->ajax_save( $this->getJSON() );
	}

	public function template_delete() {
		$this->plugin->loadComponent( 'Layout_Manager' )->ajax_delete( $this->getJSON() );
	}

	public function enable_legacy_ajax() {
		update_option( 'cs_legacy_ajax', true );
		wp_send_json_success( true );
	}

	public function getJSON() {

		$data = array();

		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			if ( isset( $_POST['data'] ) ) {
				$data = json_decode( base64_decode( $_POST['data'] ), true );
			} else {
				$data = json_decode( file_get_contents("php://input"), true );
			}
		}

		return $data;
	}

	public function use_legacy_ajax() {
		if ( defined( 'CS_LEGACY_AJAX' ) )
			return CS_LEGACY_AJAX;
		return get_option( 'cs_legacy_ajax', false );
	}

	public function get_ajax_url() {

		if ( !isset( $this->ajax_url) ) {
			$this->ajax_url = ( $this->maybe_do_rewrite_rules() )
			? home_url( $this->endpoint )
			: $this->get_fallback_ajax_url();
		}

		return $this->ajax_url;

	}

	public function get_fallback_ajax_url() {
		return admin_url( 'admin-ajax.php', 'relative' );
	}

	public function maybe_do_rewrite_rules() {

		if ( $this->use_legacy_ajax() )
			return false;

		$structure = get_option('permalink_structure');

		// Permalinks disabled
		if ( !$structure )
			return false;

		if ( false !== strpos( $structure, 'index.php') )
			return false; // Don't support PATHINFO rules

		$rules = get_option( 'rewrite_rules' );

		// No rules generated (permalinks disabled)
		if ( false == $rules )
			return false;

		// Check if our rules are present
		foreach ($rules as $rule) {
			if ( false === strpos( $rule, 'cornerstone-endpoint') ) continue;
			return true;
		}

		// If not present, and conditions are favorable, generate the rules.

		// flush_rewrite_rules is expensive, so only call under specific conditions:
		// * Permalinks are enabled
		// * Only if permalinks are enabled
		// * Confirm our rules don't already exist
		// * On init, or later
		if ( did_action( 'init' ) ) {
			flush_rewrite_rules();
		} else {
			add_action( 'init', 'flush_rewrite_rules', 9999 );
		}

		return false;

	}

}