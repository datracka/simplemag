<?php

/**
 * Parent class for Cornerstone Setting Sections
 * All setting sections inherit from this class for underlying functionality
 */

abstract class Cornerstone_Legacy_Setting_Section {

	/**
	 * Contains element data (id, title, callbacks etc.)
	 * @var array
	 */
	private $data;
	public $priority;

	/**
	 * Instantiate element with supplied data
	 */
	public function __construct( $name, $path ) {
		$this->data = array();
		$this->name = sanitize_key( $name );
		$this->path = $path;
		$this->legacy_controls = array();
		$this->controls();

		$data = $this->_convergeControlData();
		$this->data = $data['defaults'];
		$this->data['_section'] = $this->name;

		$this->defaults = $data['defaults'];
		$this->control_list = $data['controls'];

	}

	public function register() {

		$data = wp_parse_args( $this->data(), array(
			'title'       => __('Settings', csl18n() ),
			'priority'    => 10
		));

		$this->priority = $data['priority'];
		$this->ui = array( 'title' => $data['title'] );

	}

	public function load() {	}

	/**
	 * Basic validation consists of requiring a string id
	 * @return boolean  true if data is valid
	 */
	final public function is_valid() {

		$reserved = array( 'title', 'columnLayout', 'builder', 'elements', 'parentElement', 'active', 'size', 'rank', 'name', 'elType', 'section', 'icon', 'description', 'controls', 'supports', 'defaultValue', 'options', 'tooltip' );
		$whitelist = array( 'title', 'sortable' );

		$names = array();
		foreach( $this->legacy_controls as $control ) {

			if ( in_array($control['controlType'], $whitelist) )
				continue;

			$names[] = $control['name'];
		}

		if (count( array_intersect( $names, $reserved ) ) > 0)
				return new WP_Error( 'cornerstone_add_settings_section', 'Control names can not use a reserved keyword: ' . implode( ', ', $reserved ) );

		return true;
	}

	/**
	 * Gets element name
	 * @return string name from element data
	 */
	public function name() {
		return $this->name;
	}


	final public function model_data() {

		return array(
			'name'          => $this->name,
			'ui'            => $this->ui,
		 	'defaults'      => $this->defaults,
		 	'priority'      => $this->priority(),
		 	'controls'      => $this->control_list
		 );

	}

	final public function _convergeControlData() {

		$control_objects = array();
		$defaults = array();

		foreach ($this->legacy_controls as $item ) {
			$name = $item['name'];
			$config = array(
				'type' => $item['controlType'],
				'ui' => array(),
				'options' => $item['options'],
				'suggest' => $item['defaultValue']
			);

			if ( !is_null( $item['controlTitle'] ) )
				$config['ui']['title'] = $item['controlTitle'];

			if ( !is_null( $item['controlTooltip'] ) )
				$config['ui']['tooltip'] = $item['controlTooltip'];

			$control = Cornerstone_Control::factory( $name, $config );

			if ( is_wp_error( $control ) ) {
				trigger_error( 'Failed to create Cornerstone_Control: ' . $control->get_error_message(), E_USER_WARNING );
				continue;
			}

			// Factory can send back an array, but we don't need to add that support for legacy elements
			if ( is_array( $control ) ) {
				trigger_error( 'Failed to create Cornerstone_Control: Old element version does not support groups. ' . $name , E_USER_WARNING );
			} else {
				$defaults[ $control->name ] = $control->transformSuggestion( $item['defaultValue'] );
				$control_objects[] = $control;
			}

		}

		$control_models = array();
		foreach ( $control_objects as $control ) {
			$control_models[] = $control->model_data();
		}

		return array( 'controls' => $control_models, 'defaults' => $defaults );

	}



	/**
	 * Call from the elements's control method. Map controls in order you'd like them in the inspector pane.
	 * @param string $name     Required. Control name - will become an attribute name for the element
	 * @param string $type     Type of view used to create the UI for this control
	 * @param string $title    Localized title. Set null to compact this control
	 * @param string $tooltip  Localized tooltip. Only visible if title is set
	 * @param array  $default  Values used to populate the control if the element doesn't have values of it's own
	 * @param array  $options  Information specific to this control. For example, the names and data of items in a dropdown
	 */
	public function addControl( $name, $type, $title = null, $tooltip = null, $default = array(), $options = array() ) {
		$control = array( 'name' => $name, 'controlType' => $type, 'controlTitle' => $title, 'controlTooltip' => $tooltip, 'defaultValue' => $default, 'options' => $options );
		$this->legacy_controls[] = $control;
	}

	/**
	 * Iterate over the controls and retrieve a list
	 * of default values by control name
	 * @return array
	 */
	public function get_defaults() {

		$defaults = array();

		foreach ( $this->legacy_controls as $control ) {
			$defaults[ $control['name'] ] = $control['defaultValue'];
		}

		return $defaults;
	}

	/**
	 * Data provider. Override in child class to set element data
	 * This is for SETUP ONLY. To access element data later on, use Cornerstone_Element_Base::getData
	 * Should contain: name, title, section, icon, description
	 * @return array element data
	 */
	public function data(){
		return array();
	}

	/**
	 * Stub controls. This should be overriden in the child element, and contain calls to addControl
	 * @return none
	 */
	public function controls() { }

	/**
	 * Override in child element to provide a custom condition for whether a section should be added.
	 * For example, "Page Attributes" is only when that post type support is available.
	 * @return bool
	 */
	public function condition() {
		return true;
	}

	public function all_data() {
		return $this->data;
	}

	public function priority() {
		return (int) $this->priority;
	}

	final public function save( $data ) {
		$this->handler( wp_parse_args( $data, $this->get_defaults() ) );
		return true;
	}

}