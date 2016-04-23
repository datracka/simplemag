<?php

/**
 * Element Definition: Alert
 */

class CSE_Alert {

	public function ui() {
		return array(
      'title'       => __( 'Alert', csl18n() ),
      'autofocus' => array(
    		'heading' => '.x-alert .h-alert',
				'content' => '.x-alert'
    	)
    );
	}

}