<?php

class Cornerstone_Element_Reducer {

	public $data_sets = array();
	public $set_ids = array();

	public function __construct( $post_id ) {

		$elements = get_post_meta( $post_id, '_cornerstone_data', true );
		$data = is_array( $elements ) ? array( 'elements' => $elements ) : array();
		$walker = new Cornerstone_Element_Walker( $data );

		$walker->walk( array( $this, 'reduceElements' ) );
	}

	public function reduceElements( $element ) {

		$name = $element->definition->name();

		if ( !isset( $this->data_sets[$name] ) ) {
			$this->data_sets[$name] = array();
		}

		$data = $element->data();

		$id = $data['_elID'];
		unset( $data['_elID'] );

		$key = md5(serialize($data));

		if ( !isset( $this->set_ids[$key] ) ) {
			$this->set_ids[$key] = array();
		}

		$this->set_ids[$key][] = $id;
		$this->data_sets[$name][$key] = $data;

	}


}