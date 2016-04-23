<?php
class Cornerstone_Save_Handler extends Cornerstone_Plugin_Component {

	public $append;

	public function ajax_handler( $data ) {

		if ( !isset( $data['elements'] )  )
			wp_send_json_error( array('message' => 'No element data recieved' ) );

		if ( !isset( $data['settings'] ) )
			wp_send_json_error( array('message' => 'No setting data recieved' ) );

		if ( !is_array( $data['elements'] )  )
			wp_send_json_error( array('message' => 'Element data invalid' ) );

		if ( !is_array( $data['settings'] ) )
			wp_send_json_error( array('message' => 'Setting data invalid' ) );

		global $post;

		if ( !isset( $data['post_id'] ) || !$post = get_post( (int) $data['post_id'] ) )
      wp_send_json_error( array('message' => 'post_id not set' ) );

    setup_postdata( $post );

    $this->append = array();

    $this->post_id = $data['post_id'];

    $this->legacy = new Cornerstone_Legacy_Renderer( $this->plugin->component('Legacy_Elements') );

		$settings = $this->save_settings( $data['settings'] );

		if ( is_wp_error( $settings ) )
			wp_send_json_error( array( 'message' => $settings->get_error_message() ) );

		$elements = $this->save_elements( $data['elements'] );

		wp_reset_postdata();

		if ( is_wp_error( $elements ) )
			wp_send_json_error( array( 'message' => $elements->get_error_message() ) );

		update_post_meta( $this->post_id, '_cornerstone_version', $this->plugin->version() );

		$result = array(
			'elements' => $elements,
			'settings' => $settings,
		);

		//Suppress PHP error output unless debugging
		if ( CS()->common()->isDebug() )
			return wp_send_json_success( $result );
		return @wp_send_json_success( $result );

	}

	public function save_settings( $settings ) {

		$this->settings_manager = $this->plugin->loadComponent( 'Settings_Manager' );
		$this->settings_manager->load();

		foreach ( $settings as $setting ) {
			$result = $this->save_setting( $setting );
			if ( is_wp_error( $result ) )
				return $result;
		}

		return true;
	}

	public function save_elements( $elements ) {

		$this->orchestrator = $this->plugin->component( 'Element_Orchestrator' );
		$this->orchestrator->load_elements();

		// Santize values according to their kind
		foreach ( $elements as $index => $child ) {
			$elements[$index] = $this->sanitize_element( $child );
		}

		if ( !isset( $this->append ) )
			$this->append = array();

		foreach ( $this->append as $index => $child ) {
			$this->append[$index] = $this->sanitize_element( $child );
		}

		// Generate shortcodes
		$element_data = array_merge($elements, $this->append );
		$buffer = '';
		foreach ( $element_data as $element ) {
			$content = $this->save_element( $element );
			if ( is_wp_error( $content ) )
				return $content;
			$buffer .= $content;
		}

		update_post_meta( $this->post_id, '_cornerstone_data', $elements );
		delete_post_meta( $this->post_id, '_cornerstone_override' );

		$buffer = $this->process_content( $buffer );

		wp_update_post( array(
      'ID'           => $this->post_id,
      'post_content' => $buffer
    ) );

		return $buffer;
	}

	public function save_setting( $setting ) {

		if ( !isset( $setting['_section'] ) )
			return new WP_Error( 'Cornerstone_Save_Handler', 'Element _section not set: ' . maybe_serialize( $setting ) );

		$section = $this->settings_manager->get( $setting['_section'] );
		if ( is_null( $section ) )
			return null;

		unset( $setting['_section'] );
		return $section->save( $setting );

	}

	public function save_element( $element ) {

		if ( !isset( $element['_type'] ) )
			return new WP_Error( 'Cornerstone_Save_Handler', 'Element _type not set: ' . maybe_serialize( $element ) );

		$definition = $this->orchestrator->get( $element['_type'] );

		if ( 'mk1' == $definition->version() )
			return $this->legacy->save_element( $element );

		$buffer = '';

		if ( isset( $element['elements'] ) ) {
			foreach ( $element['elements'] as $child ) {
				$content = $this->save_element( $child );
				if ( is_wp_error( $content ) )
					return $content;
				$buffer .= $content;
			}
		}


		$output = $definition->build_shortcode( $element, $buffer );

		return $output;

	}

	public function sanitize_element( $element ) {

		if ( !isset( $element['_type'] ) )
			return new WP_Error( 'Cornerstone_Save_Handler', 'Element _type not set: ' . maybe_serialize( $element ) );

		$definition = $this->orchestrator->get( $element['_type'] );

		if ( 'mk1' == $definition->version() )
			return $this->legacy->formatData( $element, true );

		if ( isset( $element['elements'] ) ) {
			foreach ( $element['elements'] as $index => $child ) {
				$element['elements'][$index] = $this->sanitize_element( $child );
			}
		}

		return $definition->sanitize( $element );

	}

	public function append_element( $element ) {

		if ( !isset( $this->append ) )
			$this->append = array();

		$this->append[] = $element;

	}

	public function process_content( $content ) {

		// Move all <!--nextpage--> directives to outside their section.
		$content = preg_replace('#(?:<!--nextpage-->.*?)(\[\/cs_section\])#', '$0<!--nextpage-->', $content );

		//Strip all <!--nextpage--> directives still within sections
		$content = preg_replace('#(?<!\[\/cs_section\])<!--nextpage-->#', '', $content );

		$content = str_replace( '<!--more-->', '', $content );

		return $content;
	}

}