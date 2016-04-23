<?php

/**
 * This class manages loading and delegating both
 * offically supported and 3rd party integrations.
 */

class Cornerstone_Integration_Manager extends Cornerstone_Plugin_Component {

	private $registry;
	private $instances;
	private $themes;

	/**
	 * Defer until plugins are loaded
	 */
	public function setup() {

		$this->registerNativeIntegrations();

		if ( class_exists('Cornerstone_Integration_Conflict_Resolution') ) {
			Cornerstone_Integration_Conflict_Resolution::preInit();
		}

		add_action( 'plugins_loaded', array( $this, 'load') );
		add_action( 'after_setup_theme', array( $this, 'themeIntegration' ) );
	}

	/**
	 * Load all integrations
	 */
	public function load() {

		/*
		 * Allow integrations to be registered in plugins.
		 */
		do_action( 'cornerstone_integrations' );

		/**
		 * Process the registry. Instantiate any integrations whose shouldLoad method passes.
		 */
		foreach ($this->registry as $handle => $class_name) {

			if ( is_callable( array( $class_name, 'stylesheet' ) ) ) {
				$this->themes[$handle] = $class_name;
				continue;
			}

			$shouldLoad = array( $class_name, 'shouldLoad' );

			if ( !is_callable( $shouldLoad ) ) {
				trigger_error( "Cornerstone_Integration_Manager | Failed to load integration | $class_name::shouldLoad method missing", E_USER_WARNING );
				continue;
			}

			if ( !call_user_func( $shouldLoad ) )
				continue;

			$this->instances[$handle] = new $class_name;

		}

	}

	/**
	 * Directly add a class for theme integration by it's stylesheet
	 */
	public function themeIntegration() {

		foreach ($this->registry as $handle => $class_name) {

			$stylesheet = array( $class_name, 'stylesheet' );

			if ( !class_exists( $class_name) || !is_callable( $stylesheet ))
				continue;

			$current_theme = get_stylesheet();
			if (is_child_theme()) {
				$child_theme = wp_get_theme();
				$current_theme = $child_theme->Template;
			}

			if ( call_user_func( $stylesheet ) == $current_theme ) {
				$this->instances[$handle] = new $class_name;
				return;
			}

		}

	}

	/**
	 * Register integrations included with Cornerstone
	 * @return none
	 */
	public function registerNativeIntegrations() {

		$this->registry = array();
		$this->themes = array();

		$path = $this->path( 'includes/integrations/' );

		foreach ( glob("$path*.php") as $filename ) {

			if ( !file_exists( $filename) )
				continue;

			require_once( $filename );
			$handle = str_replace('.php', '', basename($filename) );

			$words = explode('-', $handle );
			foreach ($words as $key => $value) {
				$words[$key] = ucfirst($value);
			}

			$this->registry[ $handle ] = 'Cornerstone_Integration_' . implode('_', $words);

		}

	}

	/**
	 * Register an Integration. This will store an object reference in our registry
	 * @param string $name       Unique handle to store the item under
	 * @param string $class_name Class being used
	 */
	public function register( $name, $class_name ) {
		$this->registry[ $name ] = $class_name;
	}

	/**
	 * Register an Integration. This will store an object reference in our registry
	 * @param string $name       Unique handle to store the item under
	 * @param string $class_name Class being used
	 */
	public function unregister( $name ) {
		if ( isset( $this->registry[ $name ] ) )
			unset( $this->registry[ $name ] );
	}

	/**
	 * Get a specific integration instance, or all of them
	 * Defaults to returning all, unless an id is provided
	 * @param  string $id
	 * @return obj|array
	 */
	public function get( $id = '') {
		if ( isset( $this->instances[$id] ) )
			return $this->instances[$id];
		return $this->instances;
	}

}