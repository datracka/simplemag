<?php

class Cornerstone_Control_Sortable extends Cornerstone_Control {

	protected $default_options = array(
		'element' => 'undefined',
		'title_field' => 'title'
	);

	public function sanitize( $items ) {
		return $items;
	}

	public function transformSuggestion( $suggestions = array() ) {

		if ( is_null( $suggestions ) )
			return $suggestions;

		if ( !is_array( $suggestions ) ) {
			trigger_error( 'Cornerstone_Control_Sortable: $suggestion must be an array', E_USER_WARNING );
			return array();
		}

		$items = array();

		foreach ($suggestions as $suggestion ) {

			if ( !isset( $suggestion['_type'] ) )
				$suggestion['_type'] = $this->options['element'];

			$items[] = $suggestion;

		}

		return $items;

	}

}