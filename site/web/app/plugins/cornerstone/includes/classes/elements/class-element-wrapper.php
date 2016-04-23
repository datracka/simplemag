<?php
/**
 * Parent class for Cornerstone Elements
 * All element inherit from this class for underlying functionality
 */

class Cornerstone_Element_Wrapper {

	public $register_shortcodes = true;
	public $text_domain = '';
	public $shortcode_prefix = 'cs_';
	public $preserve_content = false;

	// The following properties are for internal use. Do not override
	protected $name;
	protected $path;
	protected $definition;
	protected $defaults;
	protected $flags;
	protected $control_group;
	protected $hook_prefix;

	protected $shortcode_template = null;

	protected static $default_flags = array( 'context' => 'all', 'child' => false, '_v' => 'mk2', 'can_preview' => true );
	protected static $default_ui = array( 'title' => 'Element', 'description' => '', 'autofocus' => '' );
	protected static $common_controls = array( 'id', 'class', 'style' );

	protected static $valid_contexts = array( 'all', 'content', 'design' );
	protected static $internal_whitelist = array( 'section', 'row', 'column', 'responsive-text', 'undefined' );

	public function __construct( $name, $path, $definition, $native ) {

		$this->name = $name;
		$this->path = $path;

		$this->definition = $definition;
		$this->definition->register_shortcodes = true;
		$this->definition->shortcodes = array();

		if ( isset( $this->definition->shortcode_name ) && is_scalar( $this->definition->shortcode_name ) ) {
			$this->shortcode_name = $this->definition->shortcode_name;
		} else {
			if ( isset( $this->definition->shortcode_prefix ) && is_scalar( $this->definition->shortcode_prefix ) )
				$this->shortcode_prefix = $this->definition->shortcode_prefix;
			$this->shortcode_name = $this->shortcode_prefix . str_replace( '-', '_', $this->name );
		}

		if ( $native )
			$this->definition->text_domain = csl18n();

		if ( isset( $this->definition->text_domain ) )
			$this->text_domain = $this->definition->text_domain;

		if ( isset( $this->definition->preserve_content ) )
			$this->preserve_content = $this->definition->preserve_content;

		$this->hook_prefix = "cs_element_{$this->name}_";

	}

	/**
	 * Each element is registered with every page load. This involves the minimal
	 * amount of overhead, and most often involves only shortcode registration
	 * @return void
	 */
	public function register() {

		do_action( $this->hook_prefix . 'register' );

		if ( apply_filters( $this->hook_prefix . 'register_shortcode', true ) )
			$this->register_shortcode();

		do_action( $this->hook_prefix . 'after_register' );

	}

	public function register_shortcode() {

		$source = $this;

		if ( method_exists( $this->definition, 'shortcode_output' ) ) {
			$source = $this->definition;
		} else {

			$filename = $this->path . "shortcode.php";

			if ( !file_exists( $filename ) ) {
				$filename = $this->path . "shortcode-{$this->name}.php";
				if ( !file_exists( $filename ) ) {
					trigger_error( "Cornerstone shortcode template file for {$this->name}' not found.", E_USER_WARNING );
					return;
				}
			}

			$this->shortcode_template = $filename;

		}

		add_shortcode( $this->shortcode_name, array( $source, 'shortcode_output' ) );
		add_filter( "shortcode_atts_{$this->shortcode_name}", array( $this, 'shortcode_output_atts' ), 10, 3 );

		if ( $this->preserve_content )
			add_filter( 'cs_preserve_shortcodes', array( $this, 'preserve_content' ) );

	}

	public function defaults() {

		if ( !isset( $this->defaults ) ) {

			$defaults = apply_filters( $this->hook_prefix . 'defaults', false );

			if ( false === $defaults ) {
				$defaults = $this->get_file_array( 'defaults' );
			}

			$this->defaults = apply_filters( $this->hook_prefix . 'update_defaults', $defaults );

		}

		return $this->defaults;

	}

	public function flags() {

		if ( !isset( $this->flags ) ) {
			$this->flags = wp_parse_args( apply_filters( $this->hook_prefix . 'flags', array() ), self::$default_flags );

			// Force elements into a valid context, unless given special privledges internally.
			if ( !in_array($this->flags['context'], self::$valid_contexts )
				&& !in_array( $this->name, self::$internal_whitelist ) ) {

				$this->flags['context'] = 'all';

			}

		}

		return $this->flags;

	}


	public function shortcode_output( $atts, $content = "", $shortcode_name ) {

		$atts = shortcode_atts( $this->defaults(), $atts, $shortcode_name );

		if ( isset( $atts['content'] ) )
			unset( $atts['content'] );

		extract( $atts );

		ob_start();

		include( $this->shortcode_template );

		return ob_get_clean();

	}

	/**
	 * Filter our shortcode attributes for a little assistance.
	 * Replace string 'true'|'false' with booleans to keep shortcode
	 * templates clean.
	 */
	public function shortcode_output_atts( $out, $pairs, $atts ) {

		$atts = apply_filters( $this->hook_prefix . 'shortcode_output_atts', $atts );

		foreach ( $out as $key => $value) {
			if ( 'false' == $value || 'true' == $value ) {
				$out[$key] = ( 'true' == $value );
				continue;
			}
			if ( is_array( $value ) && 5 == count( $value ) && ( $value[4] == 'linked' || $value[4] == 'unlinked' ) ) {
				$out[$key] = Cornerstone_Control_Dimensions::simplify( $value );
				continue;
			}
		}
		return $out;
	}



	public function ui() {

		if ( !isset( $this->ui ) ) {
			$this->ui = wp_parse_args( apply_filters( $this->hook_prefix . 'ui', array() ), self::$default_ui );
		}

		return $this->ui;

	}

	public function controls() {

		if ( !isset( $this->controls ) ) {

			$controls = apply_filters( $this->hook_prefix . 'controls', false );

			if ( false === $controls ) {
				$controls = $this->get_file_array( 'controls' );
			}

			$this->controls = Cornerstone_Control_Group::factory( apply_filters( $this->hook_prefix . 'update_controls', $controls ), self::$common_controls, array_keys( $this->defaults() ) );

		}

		return $this->controls;

	}

	/**
	 * Internal safety check to make sure element is registered properly
	 * @return boolean
	 */
	public function is_valid() {
		return true;
	}

	public function name() {
		return $this->name;
	}

	public function definition() {
		return $this->definition;
	}

	public function model_data() {

		$flags = $this->flags();
		$data = array(
			'name'          => $this->name,
			'ui'            => $this->ui(),
			'flags'         => $flags,
			'active'        => $this->is_active(),
			'base_defaults' => $this->transform_defaults( $this->defaults() ),
			'defaults'      => $this->transform_defaults( $this->get_applied_defaults() ),
			'controls'      => $this->controls()->model_data()
		);

		$context_default_key = $flags['context'] . '_defaults';

		if ( method_exists( $this->definition, $context_default_key ) ) {
			$data[$context_default_key] = call_user_func_array( array( $this->definition, $context_default_key ), array() );
		}

		return $data;

	}

	protected function transform_defaults( $defaults ) {

		foreach ($defaults as $key => $value) {
			if ( $key == 'id' ) {
				$defaults['custom_id'] = $value;
				unset( $defaults['id'] );
			}
		}

		return $defaults;

	}

	protected function get_applied_defaults() {

		$option = get_option( 'cs_element_' . $this->name, array() );

		if ( !is_array( $option ) ) {
			trigger_error( "Cornerstone. Customizer data for 'cs_element_{$this->name}' is malformed. Recommend deleting that option key so it can be saved again.", E_USER_WARNING );
			return $this->defaults();
		}

		$applied_defaults = wp_parse_args( $option, $this->defaults() );


		foreach ( $this->controls()->get_suggestions() as $key => $value ) {
			if ( isset( $option[$key] ) ) continue;
			$applied_defaults[$key] = $value;
		}

		return $applied_defaults;

	}

	protected function get_file_array( $file = '' ) {
		$td = $this->text_domain;
		$filename = $this->path . $file . '.php';
		return ( file_exists( $filename) ) ? include( $filename ): array();
	}

	protected function get_file_template( $file = '' ) {
		$td = $this->text_domain;
		$filename = $this->path . $file . '.php';
		if ( !file_exists( $filename) )
			return '';

		ob_start();
		include( $filename );
		return ob_get_clean();
	}

	public function build_shortcode( $atts, $content = '') {

		if ( !apply_filters( $this->hook_prefix . 'should_have_markup', true, $atts, $content ) ) {
			return '';
		}

		$atts = wp_parse_args( $atts, $this->get_applied_defaults() );

		// if ( apply_filters( $this->hook_prefix . 'explicit_defaults', true ) ) {

		// }

		$atts = $this->controls()->backfill_content( $atts );

		$atts = $this->controls()->filter_atts_for_shortcode( $atts );

		$atts = apply_filters( $this->hook_prefix . 'update_build_shortcode_atts', $atts );

		$atts = $this->build_shortcode_clean_atts( $atts );

		if ( '' == $content && isset( $atts['content'] ) ) {
			$content = $atts['content'];
			unset( $atts['content'] );
		}

		$content = apply_filters( $this->hook_prefix . 'update_build_shortcode_content', $content );

	  $output = "[{$this->shortcode_name}";

	  foreach ($atts as $attribute => $value) {
			$clean = cs_clean_shortcode_att( $value );
			$att = sanitize_key( $attribute );
	    $output .= " {$att}=\"{$clean}\"";
	  }

	  if ( $content == '' && !apply_filters( $this->hook_prefix . 'always_close_shortcode', false ) ) {
	    $output .= "]";
	  } else {
	    $output .= "]{$content}[/{$this->shortcode_name}]";
	  }

	  return $output;

	}

	public function build_shortcode_clean_atts( $atts ) {

		unset( $atts['_type'] );
		unset( $atts['elements'] );

		foreach ($atts as $key => $value) {
			if ( $value == '' || !is_scalar( $value ) ) {
				unset($atts[$key]);
				continue;
			}
			if ( $value === true ) {
				$atts[$key] = 'true';
				continue;
			}
			if ( $value === false ) {
				$atts[$key] = 'false';
				continue;
			}

			if ( is_array( $value ) && 5 == count( $value ) && ( $value[4] == 'linked' || $value[4] == 'unlinked' ) ) {
				$atts[$key] = Cornerstone_Control_Dimensions::simplify( $value );
				continue;
			}

		}

		if ( isset( $atts['class'] ) ) {
			$atts['class'] = cs_sanitize_html_classes( $atts['class'] );
		}

		return $atts;

	}

	public function preview( $element ) {

		$element = $this->sanitize( $element );

		$markup = apply_filters( $this->hook_prefix . 'preview', '', $element );

		if ( '' === $markup ) {
			$content = '';
			if ( isset( $element['elements'] ) && !empty( $element['elements'] ) )
				$content = '<div class="cs-inception"></div>';
			$markup = $this->build_shortcode( $element, $content );
		}

		return $markup;

	}

	public function migrate( $element, $version ) {

		if ( method_exists( $this->definition, 'migrate' ) )
			return $this->definition->migrate( $element, $version );

		return $element;
	}

	public function sanitize( $data ) {
		return $this->controls()->sanitize( $data );
	}

	public function is_active() {
		return apply_filters( $this->hook_prefix . 'is_active', true );
	}

	public function preview_enqueue() {
		do_action( $this->hook_prefix . 'preview_enqueue' );
	}

	public function preserve_content( $shortcodes ) {
		$shortcodes[] = $this->shortcode_name;
		return $shortcodes;
	}

	public function version() {
		return 'mk2';
	}

}