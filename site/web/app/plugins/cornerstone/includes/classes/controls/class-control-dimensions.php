<?php
class Cornerstone_Control_Dimensions extends Cornerstone_Control {

	protected $default_value = array( '0px', '0px', '0px', '0px', 'linked' );

	public function sanitize( $item ) {

		if ( !is_array( $item ) || count($item) != 5 )
			return $this->default_value;

		return array_map( 'esc_html', $item );

	}

	// Convert stored data into something usable in CSS
	public function transform( $item ) {
		return self::simplify( $item );
	}

	public static function simplify( $item ) {

		array_pop( $item ); // remove 'linked'

		// Single value (unlinked, but still equal)
		if ( count( array_unique( $item ) ) === 1 )
			return $item[0];

		// Vertical, Horizontal
		if ( ( $item[0] == $item[2] ) && ( $item[1] == $item[3] ) )
			return $item[0] . ' ' . $item[1];

		// Top, Left/Right, Bottom
		if ( $item[1] == $item[3] )
			return $item[0] . ' ' . $item[1] . ' ' . $item[2];

		// Unique sides
		return implode( ' ', $item );

	}

}