<?php
/**
 * Ever wanted a clean slate on the WordPress front end?
 * This class strips the entire page. All styles and scripts are removed.
 *
 * Usage:
 * 	1. Call `WP_Clean_Slate::init();`
 * 	2. Enqueue scripts and styles via wp_enqueue_scripts_clean
 * 	3. Output custom content with wp_clean_slate_content
 *
 * The following hooks are available:
 *     wp_enqueue_scripts_clean  Enqueue your styles here
 *     wp_clean_slate_content    Output any content you want following the opening body tag
 *     wp_clean_slate_options    Override default options (filter)
 *     wp_clean_slate_head       Outputs before wp_head
 *     wp_clean_slate_footer     Outputs after wp_footer
 */

class WP_Clean_Slate {

	/**
	 * I am a singleton
	 * @var object
	 */
	private static $instance;

	/**
	 * Filterable options for enabling / disabling various outputs
	 * @var array
	 */
	private $options;

	/**
	 * Instantiate class with filterable defaults
	 */
	public function __construct() {

		$this->options = apply_filters( 'wp_clean_slate_options', array(
			'addTitle' => true,
			'addCharset' => true,
			'addViewport' => true,
			'addBodyClasses' => true,
			'injectTemplate' => true, // Set false if you are filtering template_include yourself
			'removejQueryMigrate' => false, // We have full control, so we can probaly be sure we're using up to date jQuery APIs
			'mediaTemplates' => true,
			'resetFooter' => true,
			'showAdminBar' => false
		));

		if ($this->options['removejQueryMigrate'])
			add_action( 'wp_default_scripts', array( $this, 'removejQueryMigrate' ) );

		add_action( 'template_redirect', array( $this, 'hooks' ), 99999 );
	}

	/**
	 * Attach required actions and filters
	 * Strip WP actions
	 * @return none
	 */
	public function hooks() {

		if ($this->options['addTitle']) {
			add_action( 'wp_clean_slate_head', array( $this, 'addTitle' ) );
		}

		if ($this->options['addCharset'])
			add_action( 'wp_clean_slate_head', array( $this, 'addCharset' ) );

		if ($this->options['addViewport'])
			add_action( 'wp_clean_slate_head', array( $this, 'addViewport' ) );

		// Override Theme
		add_filter( 'template_include', array( $this, 'injectTemplate' ) );


		// Remove ALL actions to strip 3rd party plugins and unwanted WP functions
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_print_styles' );
		remove_all_actions( 'wp_print_head_scripts' );

		// Add back WP native actions that we need
		add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
		add_action( 'wp_head', 'wp_print_styles', 8 );
		add_action( 'wp_head', 'wp_print_head_scripts', 9 );

		// No Toolbar
		if ($this->options['showAdminBar'] == false) {
			add_filter( 'show_admin_bar', '__return_false' );
		} else {
			if ( !class_exists('WP_Admin_Bar') ) {
				_wp_admin_bar_init();
			}
			add_action('wp_enqueue_scripts_clean', array( $this, 'adminBarEnqueue' ));
		}

		// Strip all scripts and styles
		add_action( 'wp_head', array( $this, 'stripEnqueues' ), -1 );

	}

	/**
	 * Output our header, content, and footer.
	 * Returning false will also block WordPress from including a file
	 * @return boolean  always false
	 */
	public function injectTemplate() {
		$this->renderHeader();
		do_action( 'wp_clean_slate_content' );
		$this->renderFooter();
		return false;
	}

	/**
	 * Output opening HTML with wp_head and optional elements
	 * @return none
	 */
	public function renderHeader() {
		?><!DOCTYPE html><html <?php language_attributes(); ?>><head><?php do_action( 'wp_clean_slate_head' ); wp_head(); ?></head><body <?php if ( $this->options['addBodyClasses'] ) : body_class(); endif; ?>><?php
	}

	/**
	 * Output wp_footer and closing HTML
	 * @return none
	 */
	public function renderFooter() {
		if ($this->options['resetFooter']) {
			$this->resetFooter();
		}
		wp_footer(); do_action( 'wp_clean_slate_footer' );?></body></html><?php
	}

	/**
	 * Output wp_title
	 */
	public function addTitle() {
		echo '<title>'; wp_title(); echo '</title>';
	}

	/**
	 * Output charset meta tag
	 */
	public function addCharset() {
		echo '<meta charset="'; bloginfo( 'charset' ); echo '">';
	}

	/**
	 * Output viewport meta tag
	 */
	public function addViewport() {
		echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
	}

	/**
	 * Remove jQuery Migrate as a dependency from jQuery
	 */
	public function removejQueryMigrate( &$scripts ) {

		$jquery = $scripts->registered['jquery'];
		$version = $jquery->ver;

		$scripts->remove('jquery');
		$scripts->remove('jquery-migrate');
		$scripts->add('jquery', false, array('jquery-core'), $version );

	}

	/**
	 * Remove all enqueue actions as early as possible
	 */
	public function stripEnqueues() {

		remove_all_actions( 'wp_enqueue_scripts' );
		add_action( 'wp_enqueue_scripts', array( $this, 'resetEnqueues' ), 999999 );

	}

	/**
	 * Reset the style and script registries in case anything is still registered
	 *
	 */
	public function resetEnqueues() {

		global $wp_styles;
		global $wp_scripts;

		$wp_styles = new WP_Styles();
		$wp_scripts = new WP_Scripts();

		do_action( 'wp_enqueue_scripts_clean' );
	}

	/**
	 * Reset wp_footer to the minimum
	 */
	public function resetFooter() {
		remove_all_actions( 'wp_footer' );

		add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );
		add_action( 'wp_footer', 'wp_admin_bar_render', 1000 );

		if ($this->options['mediaTemplates'] && function_exists( 'wp_underscore_playlist_templates' ) && function_exists( 'wp_print_media_templates' ) ) {
			add_action( 'wp_footer', 'wp_underscore_playlist_templates', 0 );
			add_action( 'wp_footer', 'wp_print_media_templates' );
		}

	}

	/**
	 * Re-enqueue the Admin bar scripts and styles
	 * @return none
	 */
	public function adminBarEnqueue() {
		wp_enqueue_script( 'admin-bar' );
		wp_enqueue_style( 'admin-bar' );
	}

	/**
	 * Instance accessor. If instance doesn't exist, we'll initialize the class.
	 * @return object WP_Clean_Slate::$instance
	 */
	public static function instance() {
		if (!isset(self::$instance))
			self::$instance = new WP_Clean_Slate;
		return self::$instance;
	}

	/**
	 * Alias for ::instance
	 * For semantics. init can be called when the intention is the first initialization
	 * @return object WP_Clean_Slate::$instance
	 */
	public static function init() {
		return self::instance();
	}
}