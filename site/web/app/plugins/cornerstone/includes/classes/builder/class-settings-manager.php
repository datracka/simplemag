<?php

class Cornerstone_Settings_Manager extends Cornerstone_Plugin_Component {

	protected $class_prefix = 'CS_Settings';
	protected $sections = array();
	protected $registered = false;
	protected $loaded = false;
	protected $magic_hooks;

	public function setup() {
		$this->magic_hooks = new Cornerstone_Magic_Hooks;
	}

	public function register() {

		if ( $this->registered )
			return;

		$actions = array( 'register' => 'register' );

		$filters = array(
			'get_data' => 'get_data',
			'condition_filter' => 'condition_filter',
			'defaults' => 'defaults',
			'controls' => 'controls',
			'update_defaults' => 'update_defaults'
		);

		$this->magic_hooks->setup( $actions, $filters );

		$this->register_sections();

		global $post;
    $this->post_meta = get_post_meta( $post->ID );
    $this->post_type_object = get_post_type_object( $post->post_type );

		foreach ( $this->sections as $section ) {
			$name = $section->name();
			if ( !is_a( $section, 'Cornerstone_Legacy_Setting_Section' ) ) {
				$this->magic_hooks->source( "cs_settings_section_{$name}_", $section->definition() );
			}

			$section->manager = $this;
			$section->register();

		}

		$this->registered = true;

	}

	public function load() {

		$this->register();

		if ( $this->loaded )
			return;

		$actions = array( 'register' => 'register' );

		$filters = array(
			'ui' => 'ui',
			'update_controls' => 'update_controls'
		);

		$this->magic_hooks->setup( $actions, $filters );


		foreach ( $this->sections as $section ) {
			$name = $section->name();
			if ( !is_a( $section, 'Cornerstone_Legacy_Setting_Section' ) ) {
				$this->magic_hooks->source( "cs_settings_section_{$name}_", $section->definition() );
			}

			$section->load();

		}

		$this->loaded = true;
	}

	public function ajax_handler( $data ) {

		global $post;

		if ( !isset( $data['post_id'] ) || !$post = get_post( (int) $data['post_id'] ) )
      wp_send_json_error( array('message' => 'post_id not set' ) );

    setup_postdata( $post );

    $result = array(
    	'data' => $this->get_data(),
    	'models' => $this->get_models()
		);

		//Suppress PHP error output unless debugging
		if ( CS()->common()->isDebug() )
			return wp_send_json_success( $result );
		return @wp_send_json_success( $result );

	}

	public function register_sections() {

		foreach ( glob( $this->path( 'includes/settings/*' ) ) as $folder ) {

			$filename = "$folder/definition.php";
			$name = basename( $folder );

			if ( strpos( $name, '_' ) === 0 || !file_exists( $filename ) )
				continue;

			require_once( $filename );

			$words = explode( '-', $name );

			foreach ($words as $key => $value) {
				$words[$key] = ucfirst($value);
			}

			$class_name = $this->class_prefix . '_' . implode( '_', $words );

			$this->add( $class_name, $name, $folder );

		}

		$this->load_legacy_sections();

		do_action( 'cornerstone_register_setting_sections' );

	}

	/**
	 * Takes a class name, instantiate it, and add it to our list of sections
	 * @param string $class_name Class name - the class must already be defined
	 * @param string $name Unique name fo
	 * @param string $path Class name - the class must already be defined
	 * @return  boolean true if the class exists and could be loaded
	 */

	public function add( $class_name, $name = '', $path = '' ) {

		if ( !class_exists( $class_name ) ) {
			trigger_error( "Cornerstone_Settings_Manager::add | Failed to add section: $name. Class '$class_name' not found.", E_USER_WARNING );
			return false;
		}

		if ( $name == '' ) {
			trigger_error( "Cornerstone_Settings_Manager::add | Failed to add section: $name. A unique name must be provided.", E_USER_WARNING );
			return false;
		}

		if ( isset( $this->sections[$name] ) ) {
			trigger_error( "Cornerstone_Settings_Manager::add | Failed to add section: $name. An section with that name has already been registered.", E_USER_WARNING );
			return false;
		}

		$definition = new $class_name( $name, trailingslashit( $path ) );


		if ( is_a( $definition, 'Cornerstone_Legacy_Setting_Section' ) ) { // mk1
			$section = $definition;
		} else { // mk2
			$section = new Cornerstone_Settings_Section( $name, trailingslashit( $path ), $definition, ( strpos( $class_name, $this->class_prefix) === 0 ) );
		}

		$error = $section->is_valid();
		if ( is_wp_error( $error ) ) {
			unset($section);
			trigger_error( "Cornerstone_Settings_Manager::add | Failed to add section: $name. | " . $error->get_error_message(), E_USER_WARNING );
			return false;
		}

		if ( !$section->condition() )
			return false;

		$this->sections[$name] = $section;
		return $section;

	}

	/**
	 * Remove a previously defined section
	 * @param  string $name The unique section name
	 * @return boolean  true if successful and the section formerly existed.
	 */
	public function remove( $name ) {
		if (isset($this->sections[$name])) {
			unset($this->sections[$name]);
			return true;
		}
		return false;

	}

	public function get( $name ) {
		return ( isset( $this->sections[$name] ) ) ? $this->sections[$name] : null;
	}

	public function get_data() {

		$this->register();
		$models = array();

		foreach ( $this->sections as $section ) {
			if ( !$section->condition() ) continue;
			$setting = $section->all_data();
			$setting['_priority'] = $section->priority();
			$models[] = $setting;
		}

		usort( $models, array( $this, 'priority_sort') );
		$models = array_map( array( $this, 'clean_data'), $models );
		return $models;

	}

	public function get_models() {

		$this->register();
		$this->load();
		$models = array();

		foreach ( $this->sections as $section ) {
			if ( !$section->condition() ) continue;
			$models[] = $section->model_data();
		}

		return $models;

	}

	public function clean_data( $item ) {
		unset( $item['_priority'] );
		return $item;
	}

	public function priority_sort( $a, $b ) {
		return ( $a['_priority'] > $b['_priority'] );
	}

	public function sections() {
		return $this->sections;
	}

	public function load_legacy_sections() {

		$path = CS()->path( 'includes/settings/_alternate/' );
		foreach ( glob("$path*.php") as $filename ) {

			if ( !file_exists( $filename) )
				continue;

			require_once( $filename );
			$name = str_replace('.php', '', basename( $filename ) );
			$words = explode('-', $name );

			foreach ($words as $key => $value) {
				$words[$key] = ucfirst($value);
			}

			$class_name = $this->class_prefix . '_' . implode('_', $words);
			$this->add( $class_name, $name, null );

		}

	}

	public function legacy_save( $data ) {
		$section = $this->get( $data['name'] );
		return $section->handler( $this->legacy_format( $data, $section ) );
	}

	private function legacy_format( $data, $section ) {

		if ( !isset( $data['elements'] ) ) {
			$data['elements'] = array();
		}

		$data = wp_parse_args( $data, $section->get_defaults() );

		// Get around id being a reserved keyword. This way we can still use it in render methods for elements
		if ( isset( $data['custom_id'] ) )
			$data['id'] = $data['custom_id'];

		// Format data before rendering
		foreach ($data as $key => $item) {

			if ( is_array($item) && count($item) == 5 && ( $item[4] == 'linked' || $item[4] == 'unlinked' ) ) {
				$data[$key . '_linked' ] = array_pop($item);
				$data[$key] = array_map( 'esc_html', array( $item[0],$item[1],$item[2],$item[3] ) );
				continue;
			}

			// Convert boolean to string
			if ( $item === true ) {
				$data[$key] = 'true';
				continue;
			}

			if ( $item === false ) {
				$data[$key] = 'false';
				continue;
			}

			if ( is_string( $item ) && !current_user_can( 'unfiltered_html' ) ) {
				$data[$key] = wp_kses( $item, wp_kses_allowed_html( 'post' ) );
				continue;
			}

		}

		return $data;

	}

}