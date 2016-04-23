<?php

class Cornerstone_Plugin extends Cornerstone_Plugin_Base {

	public static $instance;
	protected $init_priority = -1000;

	/**
	 * Common Component Accessor
	 * @return object reference to Cornerstone_Common instance
	 */
	public function common() {
		return $this->component( 'Common' );
	}

	/**
	 * Shortcut to getting javascript asset URLs.
	 * @param  string asset name. For example: "admin/builder"
	 * @return string URL to asset
	 */
	public function js( $asset ) {
		return $this->url( "assets/js/dist/$asset" . $this->component( 'Common' )->jsSuffix() );
	}

	/**
	 * Shortcut to getting css asset URLs.
	 * @param  string asset name. For example: "admin/builder"
	 * @return string URL to asset
	 */
	public function css( $asset ) {
		return $this->url( "assets/css/$asset.css" );
	}

	/**
	 * Get array of Cornerstone settings with defaults applied
	 * @return array
	 */
	public function settings() {
		return get_option( 'cornerstone_settings', $this->config( 'common/default-settings' ) );
	}

	/**
   * Return plugin instance.
   * @return object  Singleton instance
   */
  public static function instance() {
    return (isset( self::$instance )) ? self::$instance : false;
  }

  /**
   * Run immediately after object instantiation, before anything else is loaded.
   * @return void
   */
  public function preinitBefore() {

  	// Register class autoloader
  	$this->autoload_directories = glob( self::$instance->path( 'includes/classes' ) . '/*' );
  	spl_autoload_register( array( __CLASS__, 'autoloader' ) );

  }

  public function adminBefore() {
  	// Version migrations
  	add_action( 'cornerstone_updated', array( $this, 'update' ) );
  }

  public function update( $prior ) {

  	// Before 1.0.7
  	if ( version_compare( $prior, '1.0.7', '<' ) ) {

  	}

  }

  /**
   * Cornerstone class autoloader.
   * @param  string $class_name
   * @return void
   */
  public static function autoloader( $class_name ) {

  	if ( strpos( $class_name, self::$instance->name ) === false ) return;

  	$class = str_replace( self::$instance->name . '_', '', $class_name );
  	$file = 'class-' . str_replace( '_', '-', strtolower( $class ) ) . '.php';

		foreach ( self::$instance->autoload_directories as $directory ) {

			$path = $directory . '/' . $file;
			if ( !file_exists( $path ) )
				continue;

			require_once( $path );

		}

  }

}


/**
 * Access Cornerstone without a global variable
 * @return object  main Cornerstone instance.
 */
function CS() {
	return Cornerstone_Plugin::instance();
}


/**
 * Text Domain helper method
 * @return string  text domain
 */
function csl18n() {
	return CS()->td();
}