<?php
/**
 * Responsible for loading all Cornerstone elements
 */
class Cornerstone_Legacy_Elements extends Cornerstone_Plugin_Component {

	private $class_prefix = 'CS_';
	private $elements = array();


	/**
	 * Defer until the end of init
	 */
	public function setup() {
		add_action( 'cornerstone_register_elements', array( $this, 'loadNativeElements' ) );
	}

	/**
	 * Load all element classes from the elements folder.
	 * Elements are loaded by a convention of lowercase filenames and capitalized class names.
	 * Once the classes are loaded, each one is added to the manager library
	 * @return none
	 */
	public function loadNativeElements() {

		$path = $this->path( 'includes/elements/_alternate/' );
		foreach ( glob("$path*.php") as $filename ) {

			if ( !file_exists( $filename) )
				continue;

			$words = explode('-', str_replace('.php', '', basename($filename) ) );
			if ( strpos($words[0], '_') === 0 ) continue;

			require_once( $filename );

			foreach ($words as $key => $value) {
				$words[$key] = ucfirst($value);
			}

			$class_name = $this->class_prefix . implode('_', $words);

			$this->add( $class_name );

		}

	}

	/**
	 * Takes a class name, instantiate it, and add it to our list of elements
	 * @param string $class_name Class name - the class must already be defined
	 * @return  boolean true if the class exists and could be loaded
	 */
	public function add( $class_name ) {

		if ( !class_exists( $class_name ) )
			return false;

		$element = new $class_name();

		$error = $element->is_valid();
		if ( is_wp_error( $error ) ) {
			unset($element);
			trigger_error( 'Cornerstone_Legacy_Elements::add | Failed to add element: ' . $class_name . ' | ' . $error->get_error_message(), E_USER_WARNING );
			return false;
		}

		$data = $element->data();
		$name = ( isset( $data['name'] ) ) ? $data['name'] : '';

		$this->elements[$name] = $class_name;

		$orchestrator = $this->plugin->component( 'Element_Orchestrator' );
		$this->elements[$name] = $orchestrator->add( $class_name, $name );

		return true;

	}

	/**
	 * Remove a previously defined element from our library
	 * @param  string $name The unique element name
	 * @return boolean  true if successful and the element formerly existed.
	 */
	public function remove( $name ) {
		$this->plugin->component( 'Element_Orchestrator' )->remove( $name );
		unset($this->elements[$name]);
	}

	/**
	 * Get an instance from the registry by name
	 * @param  string $name
	 * @return object
	 */
	public function get( $name ) {
		return isset($this->elements[$name]) ? $this->elements[$name] : null;
	}

	/**
	 * Build a list of all elements and their data
	 * @return array JSON ready array of element data
	 */
	public function getAll() {
		$element_data = array();
		foreach ( $this->elements as $key => $value) {
			$element_data[] = $value->getData();
		}
		return $element_data;
	}

	/**
	 * Get our previously defined list of sections
	 * @return array Sections with name and title
	 */
	public function sections() {
		return $this->sections;
	}
}