<?php

class Cornerstone_Element_Walker {

	public $parent = null;
	public $definition = null;
	public $data = array();
	public $elements = array();

	public function __construct( $data, $parent = null ) {

		$this->parent = $parent;
		$this->data = $data;
		$type = isset( $this->data['_type'] ) ? $this->data['_type'] : 'undefined';
		$this->definition = CS()->component( 'Element_Orchestrator' )->get( $type );

		if ( isset( $data['elements'] ) ) {
			unset( $this->data['elements'] );
			foreach ( $data['elements'] as $element ) {
				$this->elements[] = new self( $element, $this );
			}
		}

	}

	public function walk( $callable ) {

		foreach ( $this->elements as $element ) {
			$element->walk( $callable );
		}

		call_user_func_array( $callable, array( $this ) );

	}

	public function data() {
		return $this->data;
	}

}