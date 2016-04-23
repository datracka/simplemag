<?php
class CS_Settings_Responsive_Text {

	public $priority = 30;

	public function ui() {
		return array( 'title' => __( 'Responsive Text', csl18n() ) );
	}

	public function defaults() {
		return array(
			'elements' => array()
		);
	}

	public function controls() {
		return array(
			'elements' => array(
				'type' => 'sortable',
				'options' => array(
					'element' => 'responsive-text'
				)
			)
		);
	}

	public function get_data( $key ) {

		global $post;

		$settings = array();

		if ( isset( $this->manager->post_meta['_cornerstone_settings'] ) )
			$settings = maybe_unserialize( $this->manager->post_meta['_cornerstone_settings'][0] );

		if ( 'elements' == $key && isset( $settings['responsive_text'] ) ) {
			$controller = CS()->loadComponent( 'Data_Controller' );
			return $controller->migrate($settings['responsive_text']);
		}

		return null;

	}

	public function handler( $data ) {

    global $post;

    $settings = get_post_meta( $post->ID, '_cornerstone_settings', true );
    $settings['responsive_text'] = ( isset( $data['elements'] ) ) ? $data['elements'] : array();

    update_post_meta( $post->ID, '_cornerstone_settings', $settings );

    $save_handler = CS()->component( 'Save_Handler' );

    foreach ($settings['responsive_text'] as $element ) {
    	$save_handler->append_element( $element );
    }
	}

}