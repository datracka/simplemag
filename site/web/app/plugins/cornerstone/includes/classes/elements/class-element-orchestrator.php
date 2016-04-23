<?php

class Cornerstone_Element_Orchestrator extends Cornerstone_Plugin_Component {

	protected $class_prefix = 'CSE';
	protected $elements = array();
	protected $loaded = false;
	protected $registered = false;
	protected $magic_hooks;

	public function setup() {

		CS_Shortcode_Preserver::init();

		$this->magic_hooks = new Cornerstone_Magic_Hooks;

		$this->add_elements();
		$this->register_elements();

	}

	public function register_elements() {

		if ( $this->loaded )
			return;

		$actions = array(
			'register' => 'register',
			'after_register' => 'after_register',
			'preview_enqueue' => 'preview_enqueue'
		);

		$filters = array(
			'register_shortcode' => 'register_shortcode',
			'shortcode_output_atts' => 'shortcode_output_atts',
			'flags' => 'flags',
			'defaults' => 'defaults',
			'controls' => 'controls',
			'update_controls' => 'update_controls',
			'is_active' => 'is_active',
			'update_defaults' => 'update_defaults'
		);

		$this->magic_hooks->setup( $actions, $filters );

		$this->load_shortcodes();
		do_action( 'cornerstone_register_elements' );

		foreach ( $this->elements as $element ) {
			$name = $element->name();
			if ( $element->version() != 'mk1' ) {
				$this->magic_hooks->source( "cs_element_{$name}_", $element->definition() );
			}
			$element->register();
		}

		$this->registered = true;

		do_action( 'cornerstone_shortcodes_loaded' );

	}

	public function load_elements() {

		if ( $this->loaded )
			return;

		$actions = array();
		$filters = array(
			'ui' => 'ui',
			'preview' => array(
				'cb' => 'preview',
				'args' => 2
			),
			'should_have_markup' => array(
				'cb' => 'should_have_markup',
				'args' => 3
			),
			'update_build_shortcode_atts' => 'update_build_shortcode_atts',
			'update_build_shortcode_content' => 'update_build_shortcode_content',
			'always_close_shortcode' => 'always_close_shortcode'
		);

		$this->magic_hooks->setup( $actions, $filters );

		do_action( 'cornerstone_load_elements' );

		foreach ( $this->elements as $element ) {
			$name = $element->name();
			if ( $element->version() != 'mk1' ) {
				$this->magic_hooks->source( "cs_element_{$name}_", $element->definition() );
			}
		}

		$this->loaded = true;

	}

	/**
	 * Autoload shortcode definitions
	 */
	public function load_shortcodes() {

		// Load Shortcodes
		$path = $this->path( 'includes/shortcodes/' );
		foreach ( glob("$path*.php") as $filename ) {

			if ( !file_exists( $filename) ) continue;

			$words = explode('-', str_replace('.php', '', basename($filename) ) );
			if ( strpos($words[0], '_') === 0 ) continue;

			require_once( $filename );

		}

	}

	public function add_elements() {

		foreach ( glob( $this->path( 'includes/elements/*' ) ) as $folder ) {

			$name = basename( $folder );

			if ( strpos( $name, '_' ) === 0 )
				continue;

			$words = explode( '-', $name );

			foreach ($words as $key => $value) {
				$words[$key] = ucfirst($value);
			}

			$class_name = $this->class_prefix . '_' . implode( '_', $words );

			$this->add( $class_name, $name, $folder );

		}

	}


	/**
	 * Takes a class name, instantiate it, and add it to our list of elements
	 * @param string $class_name Class name - the class must already be defined
	 * @param string $name Unique name fo
	 * @param string $path Class name - the class must already be defined
	 * @return  boolean true if the class exists and could be loaded
	 */

	public function add( $class_name, $name = '', $path = '' ) {

		$filename = "$path/definition.php";

		if ( file_exists( $filename ) ) {
			require_once( $filename );
		}

		if ( !class_exists( $class_name ) ) {
			trigger_error( "Cornerstone_Element_Orchestrator::add | Failed to add element: $name. Class '$class_name' not found.", E_USER_WARNING );
			return false;
		}

		if ( $name == '' ) {
			trigger_error( "Cornerstone_Element_Orchestrator::add | Failed to add element: $name. A unique name must be provided.", E_USER_WARNING );
			return false;
		}

		if ( isset( $this->elements[$name] ) ) {
			trigger_error( "Cornerstone_Element_Orchestrator::add | Failed to add element: $name. An element with that name has already been registered.", E_USER_WARNING );
			return false;
		}



		$definition = new $class_name();

		if ( is_a( $definition, 'Cornerstone_Element_Base' ) ) { // mk1
			$element = $definition;
		} else { // mk2
			$element = new Cornerstone_Element_Wrapper( $name, trailingslashit( $path ), $definition, ( strpos( $class_name, $this->class_prefix) === 0 ) );
		}


		$error = $element->is_valid();
		if ( is_wp_error( $error ) ) {
			unset($element);
			trigger_error( "Cornerstone_Element_Orchestrator::add | Failed to add element: $name. | " . $error->get_error_message(), E_USER_WARNING );
			return false;
		}

		$this->elements[$name] = $element;
		return $element;

	}

	/**
	 * Remove a previously defined element from our library
	 * @param  string $name The unique element name
	 * @return boolean  true if successful and the element formerly existed.
	 */
	public function remove( $name ) {
		if (isset($this->elements[$name])) {
			unset($this->elements[$name]);
			return true;
		}
		return false;

	}

	public function get( $name ) {
		return ( isset( $this->elements[$name] ) ) ? $this->elements[$name] : $this->elements['undefined'];
	}

	public function getModels() {

		$this->load_elements();
		$model_data = array();

		foreach ( $this->elements as $element ) {
			$data = $element->model_data();
			$model_data[$data['name']] = $data;
		}

		ksort($model_data);
		return array_values( $model_data );

	}

	public function preview_enqueue() {
		foreach ( $this->elements as $element ) {
			if ( $element->is_active() )
				$element->preview_enqueue();
		}
	}

	public function elements() {
		return $this->elements;
	}

}