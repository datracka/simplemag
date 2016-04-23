<?php
/**
 * This houses all the code to integrate with X
 */

class Cornerstone_Integration_X_Theme {

	/**
	 * Theme integrations should provide a stylesheet function returning the stylesheet name
	 * This will be matched with get_stylesheet() to determine if the integration will load
	 */
	public static function stylesheet() {
		return 'x';
	}

	/**
	 * Theme integrations are loaded on the after_theme_setup hook
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
		add_filter( 'cornerstone_config_common_default-settings', array( $this, 'addDefaultSettings' ) );

		// Don't enqueue native styles
		add_filter( 'cornerstone_enqueue_styles', '__return_false' );
		add_filter( 'cornerstone_inline_styles',  '__return_false' );

		// Don't load the Customizer
		add_filter( 'cornerstone_use_customizer',  '__return_false' );

		// Enable X specific settings pane items
		add_filter( 'x_settings_pane', '__return_true' );

		// Shortcode generator tweaks
		add_action('cornerstone_generator_preview_before', array( $this, 'shortcodeGeneratorPreviewBefore' ), -9999 );
		add_filter('cornerstone_generator_map', array( $this, 'shortcodeGeneratorDemoURL' ) );

	  // Alias legacy shortcode names.
	  add_action('cornerstone_shortcodes_loaded', array( $this, 'aliasShortcodes' ) );


	  add_filter('cornerstone_scrolltop_selector', array( $this, 'scrollTopSelector' ) );
	  add_filter('cs_recent_posts_post_types', array( $this, 'recentPostTypes' ) );

	  // Use Audio and Video shortcodes for X native players.
	  add_filter( 'wp_audio_shortcode_library', 'x_wp_audio_shortcode_library' );
		add_filter( 'wp_audio_shortcode', 'x_wp_audio_shortcode' );
		add_filter( 'wp_audio_shortcode_class', 'x_wp_audio_shortcode_class' );
		add_filter( 'wp_video_shortcode_library', 'x_wp_video_shortcode_library' );
		add_filter( 'wp_video_shortcode', 'x_wp_video_shortcode' );
		add_filter( 'wp_video_shortcode_class', 'x_wp_video_shortcode_class' );
	}

	public function init() {

		// Add Logic for additional contact methods if not overridden in a child theme
		if ( ! function_exists( 'x_modify_contact_methods' ) )
			add_filter( 'user_contactmethods', array( $this, 'modifyContactMethods' ) );

		add_action( 'admin_menu', array( $this, 'optionsPage' ) );


		// Enqueue Legacy font classes
		$settings = CS()->settings();
		if ( isset( $settings['enable_legacy_font_classes'] ) && $settings['enable_legacy_font_classes'] ) {
			add_filter( 'cornerstone_legacy_font_classes', '__return_true' );
		}

	}

	public function aliasShortcodes() {

		//
		// Alias [social] to [icon] for backwards compatability.
		//

		cs_alias_shortcode( 'social', 'x_icon', false );


		//
		// Alias deprecated shortcode names.
		//

		// Mk2
		cs_alias_shortcode( array( 'alert', 'x_alert' ), 'cs_alert' );
		cs_alias_shortcode( array( 'x_text' ), 'cs_text' );

		// Mk1
		cs_alias_shortcode( 'accordion',            'x_accordion', false );
		cs_alias_shortcode( 'accordion_item',       'x_accordion_item', false );
		cs_alias_shortcode( 'author',               'x_author', false );
		cs_alias_shortcode( 'block_grid',           'x_block_grid', false );
		cs_alias_shortcode( 'block_grid_item',      'x_block_grid_item', false );
		cs_alias_shortcode( 'blockquote',           'x_blockquote', false );
		cs_alias_shortcode( 'button',               'x_button', false );
		cs_alias_shortcode( 'callout',              'x_callout', false );
		cs_alias_shortcode( 'clear',                'x_clear', false );
		cs_alias_shortcode( 'code',                 'x_code', false );
		cs_alias_shortcode( 'column',               'x_column', false );
		cs_alias_shortcode( 'columnize',            'x_columnize', false );
		cs_alias_shortcode( 'container',            'x_container', false );
		cs_alias_shortcode( 'content_band',         'x_content_band', false );
		cs_alias_shortcode( 'counter',              'x_counter', false );
		cs_alias_shortcode( 'custom_headline',      'x_custom_headline', false );
		cs_alias_shortcode( 'dropcap',              'x_dropcap', false );
		cs_alias_shortcode( 'extra',                'x_extra', false );
		cs_alias_shortcode( 'feature_headline',     'x_feature_headline', false );
		cs_alias_shortcode( 'gap',                  'x_gap', false );
		cs_alias_shortcode( 'google_map',           'x_google_map', false );
		cs_alias_shortcode( 'google_map_marker',    'x_google_map_marker', false );
		cs_alias_shortcode( 'highlight',            'x_highlight', false );
		cs_alias_shortcode( 'icon_list',            'x_icon_list', false );
		cs_alias_shortcode( 'icon_list_item',       'x_icon_list_item', false );
		cs_alias_shortcode( 'icon',                 'x_icon', false );
		cs_alias_shortcode( 'image',                'x_image', false );
		cs_alias_shortcode( 'lightbox',             'x_lightbox', false );
		cs_alias_shortcode( 'line',                 'x_line', false );
		cs_alias_shortcode( 'map',                  'x_map', false );
		cs_alias_shortcode( 'pricing_table',        'x_pricing_table', false );
		cs_alias_shortcode( 'pricing_table_column', 'x_pricing_table_column', false );
		cs_alias_shortcode( 'promo',                'x_promo', false );
		cs_alias_shortcode( 'prompt',               'x_prompt', false );
		cs_alias_shortcode( 'protect',              'x_protect', false );
		cs_alias_shortcode( 'pullquote',            'x_pullquote', false );
		cs_alias_shortcode( 'raw_output',           'x_raw_output', false );
		cs_alias_shortcode( 'recent_posts',         'x_recent_posts', false );
		cs_alias_shortcode( 'responsive_text',      'x_responsive_text', false );
		cs_alias_shortcode( 'search',               'x_search', false );
		cs_alias_shortcode( 'share',                'x_share', false );
		cs_alias_shortcode( 'skill_bar',            'x_skill_bar', false );
		cs_alias_shortcode( 'slider',               'x_slider', false );
		cs_alias_shortcode( 'slide',                'x_slide', false );
		cs_alias_shortcode( 'tab_nav',              'x_tab_nav', false );
		cs_alias_shortcode( 'tab_nav_item',         'x_tab_nav_item', false );
		cs_alias_shortcode( 'tabs',                 'x_tabs', false );
		cs_alias_shortcode( 'tab',                  'x_tab', false );
		cs_alias_shortcode( 'toc',                  'x_toc', false );
		cs_alias_shortcode( 'toc_item',             'x_toc_item', false );
		cs_alias_shortcode( 'visibility',           'x_visibility', false );

	}


	public function recentPostTypes( $types ) {
		$types['portfolio'] = 'x-portfolio';
		return $types;
	}

	public function scrollTopSelector() {
		return '.x-navbar-fixed-top';
	}

	public function modifyContactMethods( $user_contactmethods ) {

		if ( isset( $user_contactmethods['yim'] ) )
    	unset( $user_contactmethods['yim'] );

    if ( isset( $user_contactmethods['aim'] ) )
    	unset( $user_contactmethods['aim'] );

    if ( isset( $user_contactmethods['jabber'] ) )
    	unset( $user_contactmethods['jabber'] );

    $user_contactmethods['facebook']   = 'Facebook Profile';
    $user_contactmethods['twitter']    = 'Twitter Profile';
    $user_contactmethods['googleplus'] = 'Google+ Profile';

    return $user_contactmethods;
  }

  public function cleanShortcodes( $content ) {

    $array = array (
      '<p>['    => '[',
      ']</p>'   => ']',
      ']<br />' => ']'
    );

    $content = strtr( $content, $array );

    return $content;

  }

  public function shortcodeGeneratorPreviewBefore() {

  	remove_all_actions( 'cornerstone_generator_preview_before' );

	  $list_stacks = array(
	    'integrity' => __( 'Integrity',  '__x__' ),
	    'renew'     => __( 'Renew',  '__x__' ),
	    'icon'      => __( 'Icon',  '__x__' ),
	    'ethos'     => __( 'Ethos',  '__x__' )
	  );

	  $stack = x_get_stack();
	  $stack_name = ( isset( $list_stacks[ $stack ] ) ) ? $list_stacks[ $stack ] : 'X';

		printf(
	    __('You&apos;re using %s. Click the button below to check out a live example of this shortcode when using this Stack.', '__x__' ),
	    '<strong>' . $stack_name . '</strong>'
	  );
	}

	public function shortcodeGeneratorDemoURL( $attributes ) {

	  if ( isset($attributes['demo']) )
	    $attributes['demo'] = str_replace( 'integrity', x_get_stack(), $attributes['demo'] );

	  return $attributes;
	}

	public function addDefaultSettings( $settings ) {
		$settings['enable_legacy_font_classes'] = get_option( 'x_pre_v4', false );
		return $settings;
	}

	/**
	 * Swap out the Design and Product Validation Metaboxes on the Options page
	 */
	public function optionsPage() {

		remove_action( 'cornerstone_options_mb_validation', array( CS()->component( 'Admin' ), 'renderValidationMB' ) );
		add_action( 'cornerstone_options_mb_settings',      array( $this, 'legacyFontClasses' ) );
		add_action( 'cornerstone_options_mb_validation',    array( $this, 'renderValidationMB' ) );
		add_filter( 'cornerstone_config_admin_info-items',  array( $this, 'removeInfoItems' ) );
	}

	/**
	 *
	 */
	public function legacyFontClasses() {

		?>
		<tr>
	    <th>
	      <label for="cornerstone-fields-enable_legacy_font_classes">
	        <strong><?php _e( 'Enable Legacy Font Classes', csl18n() ); ?></strong>
	        <span><?php _e( 'Check to enable legacy font classes.', csl18n() ); ?></span>
	      </label>
	    </th>
	    <td>
	      <fieldset>
	        <?php echo CS()->component( 'Admin' )->settings->renderField( 'enable_legacy_font_classes', array( 'type' => 'checkbox', 'value' => '1', 'label' => 'Enable' ) ) ?>
	      </fieldset>
	    </td>
	  </tr>

	  <?php

	}


	/**
	 * Output custom Product Validation Metabox
	 */
	public function renderValidationMB() { ?>

		<?php if ( x_is_validated() ) : ?>
			<p class="cs-validated"><strong>Congrats! X is active and validated</strong>. Because of this you don't need to validate Cornerstone and automatic updates are up and running.</p>
		<?php else : ?>
			<p class="cs-not-validated"><strong>Uh oh! It looks like X isn't validated</strong>. Cornerstone validates through X, which enables automatic updates. Head over to the product validation page to get that setup.<br><a href="<?php echo x_addons_get_link_product_validation(); ?>">Validate</a></p>
		<?php endif;

	}

	public function removeInfoItems( $info_items ) {

		unset( $info_items['api-key'] );
		unset( $info_items['design-options'] );

		$info_items['enable-legacy-font-classes' ] = array(
			'title' => __( 'Enable Legacy Font Classes', csl18n() ),
			'content' => __( 'X no longer provides the <strong>.x-icon*</strong> classes. This was done for performance reasons. If you need these classes, you can enable them again with this setting.', csl18n() )
		);

		return $info_items;
	}

}


// Native shortcode alterations.
// =============================================================================

// [audio]
// =============================================================================

//
// 1. Library.
// 2. Output.
// 3. Class.
//

function x_wp_audio_shortcode_library() { // 1
  wp_enqueue_script( 'mediaelement' );
  return false;
}

function x_wp_audio_shortcode( $html ) { // 2
  return '<div class="x-audio player" data-x-element="x_mejs">' . $html . '</div>';
}

function x_wp_audio_shortcode_class() { // 3
  return 'x-mejs x-wp-audio-shortcode advanced-controls';
}

// [video]
// =============================================================================

//
// 1. Library.
// 2. Output.
// 3. Class.
//

function x_wp_video_shortcode_library() { // 1
  wp_enqueue_script( 'mediaelement' );
  return false;
}

function x_wp_video_shortcode( $output ) { // 2
  return '<div class="x-video player" data-x-element="x_mejs">' . preg_replace('/<div(.*?)>/', '<div class="x-video-inner">', $output ) . '</div>';
}

function x_wp_video_shortcode_class() { // 3
  return 'x-mejs x-wp-video-shortcode advanced-controls';
}

