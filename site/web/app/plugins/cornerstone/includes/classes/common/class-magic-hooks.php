<?php

class Cornerstone_Magic_Hooks {

	public $prefix;
	public $hooks;
	public $source;

	public function setup( $actions, $filters ) {

		$defaults = array( 'hook' => '', 'cb' => '', 'priority' => 10, 'args' => 1, 'op' => 'add_action' );

		$this->hooks = array();

		foreach ($actions as $key => $value) {
			if ( is_scalar( $value ) ) {
				$value = array( 'cb' => $value );
			}
			$item = array_merge( $defaults, $value );
			$item['hook'] = $key;
			$this->hooks[] = array_values( $item );
		}


		foreach ($filters as $key => $value) {
			if ( is_scalar( $value ) ) {
				$value = array( 'cb' => $value );
			}
			$item = array_merge( $defaults, $value );
			$item['op'] = 'add_filter';
			$item['hook'] = $key;
			$this->hooks[] = array_values( $item );
		}

	}

	public function source( $prefix, $source ) {

		$this->prefix = $prefix;
		$this->source = $source;

		foreach ( $this->hooks as $hook => $item ) {

			if ( !method_exists( $this->source, $item[1] ) )
				continue;

			$item[0] = $this->prefix . $item[0];
			$item[1] = array( $this->source, $item[1] );

			$op = array_pop( $item );
			call_user_func_array( $op, $item );

		}

	}

}