<?php
/**
 * This class manages all Dashboard related activity.
 * It handles the Options page, and adds the "Edit with Cornerstone"
 * links to the list table screens, and the toolbar.
 */

class Cornerstone_Admin extends Cornerstone_Plugin_Component {

	/**
	 * Cache settings locally
	 * @var array
	 */
	public $settings;

	/**
	 * Shortcut to our folder
	 * @var string
	 */
	public $path = 'includes/admin/';

	/**
	 * Initialize, and add hooks
	 */
	public function setup() {

		add_action( 'admin_bar_menu', array( $this, 'addToolbarEditLink' ), 999 );

		if ( !is_admin() )
			return;

		add_action( 'admin_menu',            array( $this, 'optionsPage' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_filter( 'page_row_actions',      array( $this, 'addRowActions' ), 10, 2 );
		add_filter( 'post_row_actions',      array( $this, 'addRowActions' ), 10, 2 );
		add_action( 'admin_notices',         array( $this, 'updateNotice' ), 20 );

		add_action( 'cornerstone_options_mb_settings',   array( $this, 'renderSettingsMB' ) );
		add_action( 'cornerstone_options_mb_validation', array( $this, 'renderValidationMB' ) );
	}

	public function ajaxHandler() {
		if ( isset( $_POST['post_id'] ) ) {
			update_post_meta( $_POST['post_id'], '_cornerstone_override', true );
		}
	}

	/**
	 * Enqueue Admin Scripts and Styles
	 */
	public function enqueue( $hook ) {

		wp_enqueue_style( 'cornerstone-admin-css', $this->plugin->css( 'admin/dashboard' ), array('wp-color-picker'), $this->plugin->version() );

    wp_register_script( 'cs-admin-js', $this->plugin->js( 'admin/dashboard' ) , array( 'jquery', 'wp-color-picker', 'postbox' ), $this->plugin->version(), true );

    $post = $this->plugin->common()->locatePost();
    $post_id = ($post) ? $post->ID : 'new';

		wp_localize_script( 'cs-admin-js', 'csAdmin', array(
			'homeURL' => home_url(),
    	'editURL' => $this->plugin->common()->getEditURL(),
    	'post_id' => $post_id,
    	'isSettingsPage' => ($hook == 'settings_page_cornerstone') ? "true" : "false",
    	'isPostEditor' => ( $this->isPostEditor( $hook ) ) ? "true" : "false",
    	'usesCornerstone' => ( $this->plugin->common()->uses_cornerstone() ) ? "true" : "false",
    	'strings' => $this->plugin->config( 'admin/strings-admin' ),
    	'editorTabMarkup' => $this->view( 'admin/editor-tab', false )
    ) );

    wp_enqueue_script( 'cs-admin-js' );

	}


	/**
	 * Determine if the post editor is being viewed, and Cornerstone is available
	 * @param  string  $hook passed through from admin_enqueue_scripts hook
	 * @return boolean
	 */
	public function isPostEditor( $hook ) {

		if ( $hook == 'post.php' && isset( $_GET['action']) && $_GET['action'] == 'edit')
		  return $this->plugin->common()->isPostTypeAllowed();

		if ( $hook == 'post-new.php' && isset( $_GET['post_type']) )
		  return in_array( $_GET['post_type'], $this->plugin->common()->getAllowedPostTypes() );

		if ( $hook == 'post-new.php' && !isset( $_GET['post_type']) )
		  return in_array( 'post', $this->plugin->common()->getAllowedPostTypes() );

		return false;
	}

	/**
	 * Register the Options page
	 */
	public function optionsPage() {
		$title = $this->plugin->common()->properTitle();
		add_options_page( $title, $title, 'manage_options', 'cornerstone', array( $this, 'renderOptionsPage' ) );
	}


	/**
	 * Callback to render the Options Page
	 */
	public function renderOptionsPage() {

		/* Let's call this class just for this option page */
		$this->settings = new Cornerstone_Settings_Handler;

		$this->view( 'admin/options-page', true, array(
			'info_items' => $this->plugin->config( 'admin/info-items' )
		) );

	}


	/**
	 * Add "Edit With Cornerstone" links to the WP List tables
	 * Filter applied to page_row_actions and post_row_actions
	 * @param array $actions
	 * @param object $post
	 */
	public function addRowActions( $actions, $post ) {

		if ( $this->plugin->common()->isPostTypeAllowed( $post ) ) {
			$url = $this->plugin->common()->getEditURL( $post );
			$label = __( 'Edit with Cornerstone', csl18n() );
			$actions['edit_cornerstone'] = "<a href=\"$url\">$label</a>";
		}

		return $actions;
	}


	/**
	 * Add "Edit with Cornerstone" button on the toolbar
	 * This is only added on singlular views, and if the post type is supported
	 */
	public function addToolbarEditLink() {

		if ( is_singular() && $this->plugin->common()->isPostTypeAllowed() && $this->plugin->common()->uses_cornerstone() )  {

			global $wp_admin_bar;

			$wp_admin_bar->add_menu( array(
				'id' => 'cornerstone-edit-link',
				'title' => __( 'Edit with Cornerstone', csl18n() ),
				'href' => $this->plugin->common()->getEditURL(),
				'meta' => array( 'class' => 'cornerstone-edit-link' )
			) );

		}

	}

	/**
	 * Load View files
	 */

	public function updateNotice() {
		if ( isset( $_POST['cornerstone_options_submitted'] )
  		&& strip_tags( $_POST['cornerstone_options_submitted'] ) == 'submitted'
  		&& current_user_can( 'manage_options' ) ) {
			$this->view( 'admin/options-notice' );
		}
	}

	public function renderSettingsMB() {
		$this->view( 'admin/mb-settings' );
	}

	public function renderDesignMB() {
		$this->view( 'admin/mb-design' );
	}

	public function renderValidationMB() {
		$this->view( 'admin/mb-product-validation' );
	}

}