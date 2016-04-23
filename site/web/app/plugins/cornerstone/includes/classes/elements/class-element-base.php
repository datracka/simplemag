<?php

/**
 * LEGACY Class. Original Cornerstone elements will inherit from this class
 */

abstract class Cornerstone_Element_Base {

	/**
	 * Contains element data (id, title, callbacks etc.)
	 * @var array
	 */
	private $data;

	protected $loaded = false;

	/**
	 * Instantiate element with supplied data
	 */
	public function __construct() {

		$this->data = wp_parse_args( $this->data(), array(
			'name'        => '',
			'title'       => __('Generic Element', csl18n() ),
			'section'     =>  'content',
			'description' => __( 'Generic Element', csl18n() ),
			'autofocus'   => '',
			'controls'    => array(),
			'empty'       => false,
			'context'     => 'all',
			'render'      => true,
			'htmlhint'    => false,
			'delegate'    => false,
			'childType'   => false,
			'childRender' => true,
			'can_preview' => true,
			'active'      => $this->is_active()
		) );

	}

	public function register() {

		// Temporary Shortcode generator mapping
		if ( method_exists( $this, 'xsg' ) )
			$this->xsg();

	}

	public function load_controls() {

		if ( $this->loaded )
			return;

		$this->controls();
		$this->controlMixins();

		$this->loaded = true;

	}

	public function get_defaults() {
		$this->load_controls();
		$data = $this->_convergeControlData();
		return $data['defaults'];
	}

	final public function model_data() {

		$this->load_controls();

		$data = $this->_convergeControlData();

		$ui = array( 'title' => $this->data['title'] );

		if ( isset( $this->data['autofocus'] ) ) {
			$ui['autofocus']	= $this->data['autofocus'];
		}

		if ( isset( $this->data['helpText'] ) ) {
			$ui['helpText']	= $this->data['helpText'];
		}

		return array(
			'name'          => $this->data['name'],
			'active'        => $this->is_active(),
			'ui'            => $ui,
		  'flags'         => array(
		  	'_v'          => 'mk1',
		  	'context'     => $this->data['context'],
		  	'child'       => $this->data['delegate'],
		  	'delegate'    => $this->data['delegate'],
		  	'childType'   => $this->data['childType'],
		  	'empty'       => $this->data['empty'],
  			'render'      => $this->data['render'],
  			'htmlhint'    => $this->data['htmlhint'],
  			'can_preview' => $this->can_preview(),
    		'manageChild' => $this->data['childRender'],
		  ),
		 	'base_defaults' => $data['defaults'],
		 	'defaults'      => $data['defaults'],
		 	'controls'      => $data['controls']
		 );

	}

	/**
	 * Basic validation consists of requiring a string id
	 * @return boolean  true if data is valid
	 */
	public function is_valid() {

		if ( '' == $this->data['name'] )
			return new WP_Error( 'cornerstone_add_element', 'Missing Name' );

		$reserved = array( 'title', 'columnLayout', 'builder', 'elements', 'parentElement', 'active', 'size', 'rank', 'name', 'elType', 'section', 'icon', 'description', 'controls', 'supports', 'defaultValue', 'options', 'tooltip' );
		$whitelist = array( 'title', 'sortable' );

		$names = array();
		foreach( $this->data['controls'] as $control ) {

			if ( in_array($control['controlType'], $whitelist) )
				continue;

			$names[] = $control['name'];
		}

		if ( isset( $names['name'] ) )

		if ( count( array_intersect( $names, $reserved ) ) > 0 )
				return new WP_Error( 'cornerstone_add_element', 'Control names can not use a reserved keyword: ' . implode( ', ', $reserved ) );

		return true;
	}

	/**
	 * Gets element name
	 * @return string name from element data
	 */
	public function name() {
		return $this->data['name'];
	}

	/**
	 * Gets element childType
	 * @return string childType from element data
	 */
	public function childType() {
		return $this->data['childType'];
	}

	/**
	 * Gets element empty condition
	 * @return string childType from element data
	 */
	public function emptyCondition() {
		return $this->data['empty'];
	}

	/**
	 * Get the element data after it's been
	 * @return array element data
	 */
	public function getData() {
		return $this->data;
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
		$this->data['controls'][] = $control;
	}

	/**
	 * Allow a mixin to be added inline. This allows you to determine it's position
	 * in the order of mapped controls.
	 * @param string $support name of the mixin
	 */
	public function addSupport( $support ) {

		$numargs = func_num_args();
		$count = 0;

		$mixin_controls = apply_filters( '_cornerstone_control_mixin_' . $support, array() );
		if ( !empty( $mixin_controls ) ) {
			foreach ($mixin_controls as $mixin) {

				$override = ( $numargs > ++$count ) ? func_get_arg($count) : array();
				$control = wp_parse_args( $override, $mixin );

				if ( isset( $override['options'] ) && isset( $mixin['options'] ) ) {
					$control['options'] = wp_parse_args( $override['options'], $mixin['options'] );
				}

				$this->data['controls'][] = $control;

			}
		}
	}

	/**
	 * Add control mixins. Looks for a 'supports' array, and adds additional controls.
	 * Don't use `_cornerstone_control_mixin_$name` filter. Use `cornerstone_control_mixins` instead
	 * @return none
	 */
	public function controlMixins() {

		if ( !isset( $this->data['supports'] ) || !is_array( $this->data['supports'] ) )
			return;

		foreach ( $this->data['supports'] as $support ) {
			$mixin_controls = apply_filters( '_cornerstone_control_mixin_' . $support, array() );
			if ( !empty( $mixin_controls ) ) {
				foreach ($mixin_controls as $mixin) {
					$this->data['controls'][] = $mixin;
				}
			}
		}

	}

	final public function _convergeControlData() {

		$control_objects = array();
		$defaults = array();

		foreach ($this->data['controls'] as $item ) {
			$name = $item['name'];

			$condition = null;

			if ( isset($item['options']['condition'] ) ) {
				$condition = $item['options']['condition'];
				unset($item['options']['condition']);
			}

			$config = array(
				'type' => $item['controlType'],
				'ui' => array(),
				'options' => $item['options'],
				'suggest' => $item['defaultValue']
			);

			if ( !is_null( $condition ) ) {
				$config['condition'] = $condition;
			}

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

		$this->control_list = $control_models;
		$this->control_defaults = $defaults;

		return array( 'controls' => $control_models, 'defaults' => $defaults );

	}

	public function render_transforms( $data ) {

		$this->_convergeControlData();

	}
	/**
	 * Helper function used in render methods.
	 * This creates a string that can be used to speed up shortcode building.
	 * @param  array $params
	 * @return string
	 */
	public function extra( $atts ) {

		$extra = '';

		if ( isset($atts['id']) && $atts['id'] != '' )
			$extra .= " id=\"{$atts['id']}\"";

		if ( isset($atts['class']) && $atts['class'] != '' ) {
			$class = cs_sanitize_html_classes( $atts['class'] );
			$extra .= " class=\"{$class}\"";
		}

		if ( isset($atts['style']) && $atts['style'] != '' )
			$extra .= " style=\"{$atts['style']}\"";

		return $extra;
	}

	public function shouldRender() {
		return $this->data['delegate'];
	}

	public function renderElement( $atts ) {

		return $this->render( $this->injectAtts( $atts ) );
	}

	/**
	 * Perform common operations such as mixin class injection
	 * @param  array $atts
	 * @return array
	 */
	public function injectAtts( $atts ) {

    // Set custom values to blank strings to prepare for injections
    if ( !isset( $atts['class'] ) )
			$atts['class'] = '';

		if ( !isset( $atts['style'] ) )
			$atts['style'] = '';


		// Split generated and user values for access in render method
    $atts['user_class'] = $atts['class'];
		$atts['user_style'] = $atts['style'];
    $atts['injected_classes'] = array();
		$atts['injected_styles'] = array();

		// BEGIN
		//
		if ( isset( $atts['margin'] ) && $atts['margin'] != '' ) {
      $atts['injected_styles'][] = 'margin: ' . implode( $atts['margin'], ' ' ) . ';';
    }

    if ( isset( $atts['padding'] ) && $atts['padding'] != '' ) {
      $atts['injected_styles'][] = 'padding: ' . implode( $atts['padding'], ' ' ) . ';';
    }

    if ( isset( $atts['border_style'] ) && $atts['border_style'] != 'none' ) {

      $atts['injected_styles'][] = 'border-style: ' . $atts['border_style'] . ';';

      if ( isset( $atts['border'] ) && $atts['border'] != '' ) {
        $atts['injected_styles'][] = 'border-width: ' . implode( ' ', $atts['border'] ) . ';';
      }

      if ( isset( $atts['border_color'] ) && $atts['border_color'] != '' ) {
        $atts['injected_styles'][] = 'border-color: ' . $atts['border_color'] . ';';
      }

    }

    if ( isset( $atts['visibility'] ) && is_array( $atts['visibility'] ) && count( $atts['visibility'] ) > 0 ) {
      $atts['injected_classes'] = array_merge( $atts['injected_classes'], $atts['visibility'] );
    }

    if ( isset( $atts['text_align'] ) && $atts['text_align'] != 'none' ) {
      $atts['injected_classes'][] = $atts['text_align'];
    }

		// END



		// Combine user and injected values for shortcode injection
		if ( count( $atts['injected_classes'] ) > 0 )
			$atts['class'] = implode( $atts['injected_classes'], ' ' ) . ' ' . $atts['class'];

		if ( count( $atts['injected_styles'] ) > 0 )
			$atts['style'] = implode( $atts['injected_styles'], ' ' ) . ' ' . $atts['style'];

		// Apply helper function to create a string of id, class, and style attributes.
		$atts['extra'] = $this->extra( $atts );

    return $atts;
	}

	/**
	 * Helper function used in render methods.
	 * This creates a string that can be used to speed up shortcode building.
	 * @param  array  $width
	 * @param  string $style
	 * @param  string $color
	 * @return string
	 */
	public function borderStyle( $width, $style, $color ) {

		$width = 'border-width: ' . implode( ' ', $width ) . '; ';
		$style = 'border-style: ' . $style . '; ';
		$color = 'border-color: ' . $color . ';';

		return $width . $style . $color;

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

	public function is_active() { return true; }

	public function sg_map( $map ) {
		CS()->component( 'Shortcode_Generator' )->add( $map );
	}

	public function can_preview() {
		return $this->data['can_preview'];
	}

	public function migrate( $element, $version ) {
		return $element;
	}

	public function preview_enqueue() { }

	final public function version() {
		return 'mk1';
	}

}