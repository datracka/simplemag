<?php

/**
 * Parent class for Cornerstone Setting Sections
 * All setting sections inherit from this class for underlying functionality
 */

class Cornerstone_Settings_Section {

	protected $name;
	protected $path;
	protected $all_defaults = null;
	protected $all_controls = null;
	protected $notset;
	protected $available_data;
	protected $control_list;
	protected $registered;
	protected $loaded;
	protected $settings;

	public $post_type_object;
	public $post_meta;
	public $manager;

	protected static $default_ui = array( 'title' => 'Settings' );

	public function __construct( $name, $path, $definition, $native = false ) {

		$this->name = sanitize_key( $name );
		$this->path = $path;

		$this->definition = $definition;
		$this->definition->manager = $this;

		if ( $native ) {
			$this->definition->text_domain = csl18n();
		}

		$this->text_domain = ( isset( $this->definition->text_domain ) ) ? $this->definition->text_domain : $this->definition->name();
		$this->hook_prefix = "cs_settings_section_{$this->name}_";

	}

	public function condition() {
		return ( method_exists( $this->definition, 'condition' ) ) ? $this->definition->condition() : true;
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

			$controls = cs_array_filter_use_keys( $controls, array( $this, 'can_use' ) );

			foreach ($controls as $key => $value) {
				$controls[$key]['context'] = 'settings';
			}

			$this->controls = Cornerstone_Control_Group::factory( apply_filters( $this->hook_prefix . 'update_controls', $controls ) );

		}

		return $this->controls;

	}

	public function available_data() {

		if ( !isset( $this->available_data ) ) {

			$this->available_data = cs_array_filter_use_keys( $this->defaults(), array( $this, 'condition_filter' ) );
			//$this->available_data = array();

			foreach ( $this->available_data as $key => $value) {
				$item = $this->get_data( $key );
				if ( is_null( $item ) )
					continue;
				$this->available_data[$key] = $item;
			}

		}

		return $this->available_data;

	}

	public function available_defaults() {
		return cs_array_filter_use_keys( $this->defaults(), array( $this, 'can_use' ) );
	}

	public function can_use( $key ) {
		$data = $this->available_data();
		return ( isset( $data[$key] ) );
	}

	public function condition_filter( $key ) {
		return apply_filters( $this->hook_prefix . 'condition_filter', true, $this->post_meta, $this->post_type_object );
	}

	final public function register() {

		if ( $this->registered )
			return;

		$this->post_meta = $this->manager->post_meta;
		$this->post_type_object = $this->manager->post_type_object;

		do_action( $this->hook_prefix . 'register' );

		$this->registered = true;
	}

	public function get_data( $key ) {
		return apply_filters( $this->hook_prefix . 'get_data', $key );
	}

	final public function load() {

		if ( $this->loaded )
			return;

		$this->register();
		do_action( $this->hook_prefix . 'load' );

		$this->loaded = true;

	}

	final public function save( $data ) {

		$data = $this->controls()->sanitize( $data );
		if( isset( $data['elements'] ) ) {
			$data['elements'] = $this->sanitize_elements( $data['elements'] );
		}

		return $this->definition->handler( wp_parse_args( $data, $this->available_defaults() ) );
	}

	public function sanitize_elements( $elements ) {

		$orchestrator = CS()->component( 'Element_Orchestrator' );
		$orchestrator->load_elements();
		$sanitized = array();

		foreach ( $elements as $element) {
			if ( !isset( $element['_type'] ) )
				continue;
			$definition = $orchestrator->get( $element['_type'] );
			$sanitized[] = $definition->sanitize( $element );
		}

		return $sanitized;
	}

	final protected function get_file_array( $file = '' ) {
		$td = $this->text_domain;
		$definition = $this->definition;
		$filename = $this->path . $file . '.php';
		return ( file_exists( $filename) ) ? include( $filename ) : array();
	}

	final public function model_data() {
		return array(
			'name'     => $this->name,
			'ui'       => $this->ui(),
			'priority' => $this->priority(),
			'defaults' => $this->available_defaults(),
			'controls' => $this->controls()->model_data()
		);
	}

	final public function is_valid() {
		return true;
	}

	public function name(){
		return $this->name;
	}

	public function definition(){
		return $this->definition;
	}

	public function priority() {
		return ( isset( $this->definition->priority ) ) ? $this->definition->priority : 100;
	}

	public function all_data() {
		return wp_parse_args( $this->available_data(), array( '_section' => $this->name ) );
	}

}