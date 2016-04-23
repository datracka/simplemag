<?php

/**
 * This component exists to allow feature flagging in Cornerstone development.
 */

class Cornerstone_Alpha extends Cornerstone_Plugin_Component {

	public function setup() {

		add_filter( 'cornerstone_config_builder_keybindings', array( $this, 'keybindings' ) );

	}

	public function keybindings( $bindings ) {
		return array_merge( $bindings, $this->plugin->config( 'alpha/keybindings' ) );
	}
}