<?php

// Supports matching scss style variables and string interpolation.

class Cornerstone_Style_Engine {

	protected $template;
	protected $data;

	public function __construct( $template = '', $data = array() ) {
		$this->template = $template;
		$this->data = $data;
	}

	public function identify_variables() {
		preg_match_all('/(?<=\$)\w+|(?<=#{\$)\w+(?=})/', $this->template, $matches );
		return $matches[0];
	}

	public function replace() {
		return preg_replace_callback('/\$\w+|#{\$\w+}/', array( $this, 'replacer' ), $this->template );
	}

	public function replacer( $matches ) {
		$key = str_replace( '$', '', trim( substr( $matches[0], 1 ), '{}' ) );
		return ( isset( $this->data[$key] ) ) ? $this->data[$key] : '';
	}

	public function add_template( $template = '' ) {
		$this->template .= $template;
	}

	public function add_data( $data ) {
		$this->data = array_merge( $this->data, $data );
	}

	public function get_rules() {
		// Split template into rules, and capture selectors
		preg_match_all('/(.+?)((?<!#){.+?(?<!\w)})/', $this->template, $matches );

	}
}