<?php

class Cornerstone_Control_Group {

	public $controls;

	protected $filter_op = true;
	protected $filter_context = null;
	protected $filter_keys = array();
	protected $uncontrolled = array();

	protected $memoized_contexts = array();

	final public static function factory( $controls = array(), $common_controls = false, $uncontrolled = array() ) {

		if ( !is_array( $controls ) )
			return false;

		if ( is_array( $common_controls ) )
			$controls = self::remap_common_controls( $controls, $common_controls );

		$control_list = array();

		foreach ($controls as $name => $config ) {

			$control = Cornerstone_Control::factory( $name, $config );

			if ( is_wp_error( $control ) ) {
				trigger_error( 'Failed to create Cornerstone_Control: ' . $control->get_error_message(), E_USER_WARNING );
				continue;
			}

			// Allow factory to send back a group of controls, or a single control
			if ( is_array( $control ) ) {
				$control_list = array_merge( $control_list, $control );
			} else {
				$control_list[] = $control;
			}

		}

		return new self( $control_list, $uncontrolled );

	}

	public static function remap_common_controls( $controls, $common ) {

		if ( isset( $controls['common'] ) ) {

			$common_controls = $controls['common'];
			unset($controls['common']);

			if ( $common_controls == 'none' ) {
				return $controls;
			}

			$common = array_merge( $common_controls, $common );

		}

		// ID, Class, Style are included by default, but can be flagged for removal
		foreach ( $common as $mixin ) {
			if ( strpos($mixin, '!') === false && !in_array( '!' . $mixin, $common ) )
				$controls[$mixin] = array( 'mixin' => $mixin );
		}

		return $controls;
	}

	public function __construct( $control_list, $uncontrolled = array() ) {
		$this->controls = $control_list;
		$this->uncontrolled = $uncontrolled;
	}

	public function _key_filter( $item ) {
		return ( $this->filter_op === in_array( $item, $this->filter_keys ) );
	}

	public function filter_atts_for_shortcode( $atts ) {

		$keys = $this->filter_atts_by_context( $atts, 'design', false );
		$controls = $this->get_controls_by_keys( array_keys( $keys ) );

		foreach ($atts as $key => $value) {
			if ( in_array( $key, $this->uncontrolled ) )
				continue;
			if ( isset($controls[$key] ) ) {
				$atts[$key] = $controls[$key]->transform( $value );
				continue;
			}
			unset($atts[$key]);
		}

		return $atts;

	}

	public function filter_atts_by_context( $data, $context, $op = true ) {
		$this->filter_keys = $this->get_keys_by_context( $context, $op );
		$this->filter_op = true;
		return cs_array_filter_use_keys( $data, array( $this, '_key_filter' ) );
	}

	public function get_keys_by_context( $context, $op = true ) {

		if ( !$op )
			$context = 'not_' . $context;

		if ( !isset( $this->memoized_contexts[$context] ) ) {
			$controls = $this->get_controls_in_context( $context, $op );
			$keys = array();
			foreach ($controls as $control) {
				if ( !isset( $control->key ) ) {
					if ( isset( $control->name ) ) {
						$keys[] = $control->name;
					}
					continue;
				}
				$keys[] = $control->key;
			}
			$this->memoized_contexts[$context] = $keys;
		}

		return $this->memoized_contexts[$context];

	}

	public function sanitize( $data ) {

		$controls = $this->get_controls_by_keys( array_keys( $data ) );

		foreach ($data as $key => $value) {
			if ( $key == 'elements' ) continue;
			$data[$key] = ( isset($controls[$key] ) ) ? $controls[$key]->sanitize( $value ) : Cornerstone_Control::fallback_sanitize( $value );
		}

		return $data;

	}

	public function backfill_content( $data ) {

		$suggestions = $this->get_suggestions();

		foreach ($suggestions as $key => $value) {
			if ( !isset( $data[$key] ) )
				$data[$key] = $value;
		}

		return $data;

	}

	public function get_controls_by_keys( $key_list = array() ) {
		$controls = array();
		foreach ( $this->controls as $control ) {
			if ( in_array( $control->key, $key_list ) )
				$controls[$control->key] = $control;
		}
		return $controls;
	}

	public function get_controls_in_context( $context, $op = true ) {
		$this->filter_op = $op;
		$this->filter_context = $context;
		return array_filter( $this->controls, array( $this, '_filter' ) );
	}

	protected function _filter( $item ) {

		if ( !isset( $item->context ) )
			return false;

		return ( $this->filter_op === ( $item->context == $this->filter_context ) );

	}

	public function get_suggestions() {
		$suggestions = array();
		foreach ( $this->controls as $control ) {
			if ( 'content' != $control->context || is_null( $control->suggest ) ) continue;
			$suggestions[$control->key] = $control->suggest;
		}
		return $suggestions;
	}

	public function model_data() {
		$models = array();
		foreach ( $this->controls as $control ) {
			$models[] = $control->model_data();
		}
		return $models;
	}

}