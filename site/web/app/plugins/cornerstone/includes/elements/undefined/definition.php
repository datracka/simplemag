<?php

/**
 * Element Definition: Alert
 */

class CSE_Undefined {

	public function ui() {
		return array(
      'title'       => __( 'Element Missing', csl18n() ),
    );
	}

	public function flags() {
		return array( 'context' => '_internal' );
	}

	public function controls() {
		return array(
			'common' => array( '!id', '!class', '!style' ),
			'unregistered' => array(
				'type' => 'info-box',
				'ui' => array(
					'title' => __( 'Where did it go?', csl18n() ),
					'message' => __( 'The element that calls itself <strong>%%element-name%%</strong> could not be found. It was probably registered by a plugin not currently active on your site. <br/><br/>Not to worry, the settings have been preserved in hope of this element&apos;s return.', csl18n() ),
				),
				'options' => array( 'help-text' => false )
			)
		);
	}

	public function shortcode_output() {
  	return '<!--cs_undefined-->';
  }

	public function defaults() {
		return array();
	}

	public function preview() {
		return '<div class="cs-empty-element"><div class="cs-empty-element-icon"><svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve"><path d="M-262.1,403.9C-262.1,403.8-262.1,403.8-262.1,403.9c0.1-0.1,0.1-0.1,0.1-0.2c0,0,0,0,0-0.1v-13.2l0,0c0,0,0,0,0-0.1c0,0,0,0,0-0.1c0,0,0,0,0-0.1l0,0l0,0c0,0,0,0,0-0.1l0,0c0,0,0,0-0.1,0l0,0l-12.2-6.6l0,0h-0.1h-0.1h-0.1h-0.1l0,0l-13,6.6l0,0c0,0,0,0-0.1,0l0,0c0,0,0,0,0,0.1l0,0l0,0l0,0v0.1v0.1l0,0v13.2c0,0,0,0,0,0.1v0.1v0.1c0,0,0,0.1,0.1,0.1c0,0,0.1,0,0.1,0.1c0,0,0,0,0.1,0l12.9,6.6l0,0c0.1,0,0.1,0.1,0.2,0.1l0,0c0.1,0,0.2,0,0.2-0.1l0,0l11.9-6.6l0,0C-262.2,404-262.2,404-262.1,403.9C-262.2,403.9-262.2,403.9-262.1,403.9z M-274.5,384.4l10.9,6l-10.9,6l-11.8-6L-274.5,384.4z M-286.9,391.2l11.9,6.1v12.1l-11.9-6.1V391.2z M-274,397.3l10.9-6.1v12.1l-10.9,6.1V397.3z"/></svg></div></div>';
	}
}