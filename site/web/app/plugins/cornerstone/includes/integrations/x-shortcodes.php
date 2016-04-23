<?php
/**
 * Cornerstone is quite akin to X Shortcodes (legacy plugin)
 * For seamless compatibility until X Shortcodes is delteted,
 * we're "hotswapping the boot process", preventing X Shortcodes
 * functionality from loading.
 *
 * For exisiting sites, we alias old X Shortcode names to Cornerstone
 */

class Cornerstone_Integration_X_Shortcodes {

	/**
	 * Each integration class should provide a shouldLoad static method
	 * This allows the integration loader to determine whether or not
	 * to instantiate the integration
	 * @return bool
	 */
	public static function shouldLoad() {
		return defined( 'X_SHORTCODES_VERSION' );
	}

	public function __construct() {
		add_action( 'init', array( $this, 'init'), -99999 );
	}

	public function init() {

		// Strip Hooks
		remove_action( 'init', 'x_shortcodes_init' );
	  remove_action( 'admin_init', array( XSG::instance(), 'admin_init' ) );
    remove_action( 'wp_ajax_xsg_list_shortcodes', array( XSG::instance(), 'model_endpoint' ) );
    remove_action( 'admin_init',    'x_shortcodes_version_migration' );
    remove_action( 'admin_notices', 'x_shortcodes_pairing_notice' );
    remove_filter( 'user_contactmethods', 'x_modify_contact_methods' );

    // Encourgage users to remove X Shortcodes
		add_action( 'admin_notices', array( $this, 'pleaseDeleteXShortcodes' ) );

    // Continue to output the X Shortcodes Body Class
		add_filter( 'body_class', array( $this, 'bodyClass' ), 10001 ); // 1


	}

	public function pleaseDeleteXShortcodes() { ?>

		<div class="updated x-notice warning">
      <p><strong>X &ndash; Shortcodes is still active</strong>. Now that you're using Cornerstone, X Shortcodes can be safely deactivated and deleted from the <a href="<?php echo admin_url('plugins.php'); ?>">plugins page</a>.</p>
    </div>
    <?php

	}

	public function bodyClass( $output ) {
	  $output[] = 'x-shortcodes-v' . str_replace( '.', '_', X_SHORTCODES_VERSION );
	  return $output;
	}

}