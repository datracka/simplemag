<?php
/**
 * This class manages all settings related activity.
 * It handles the process and rendering for Options fields.
 *
 * Option fields are group as array with cornerstone-fields[] naming - all values inside this array are considered valid settings at POST submit
 * With this naming, all fields will be cleaned using strip_tags() without coding them one by one.
 * And if necessary, validation is easier to apply
 */

class Cornerstone_Settings_Handler {

	/**
	* Settings holder
	* @var array
	*/
	private static $settings;

	/* The constructor handles initialization and data processing */

	public function __construct() {

		/* Get all saved data and put them in self::$settings for later use */
		self::$settings = CS()->settings();

		/* Handles post data */
		if ( isset( $_POST['cornerstone_options_submitted'] ) && isset($_POST['cornerstone-fields']) ) {

  		if ( strip_tags( $_POST['cornerstone_options_submitted'] ) == 'submitted' && current_user_can( 'manage_options' ) ) {

				$fields = $_POST['cornerstone-fields'];

				// Empty checkboxes
				if(isset($_POST['cornerstone-checkboxes'])) {

					foreach ( $_POST['cornerstone-checkboxes'] as $name ) {

						if ( !in_array( $name, $fields) )
							self::$settings[ $name ] = array();
					}

				}

				// Convert checkbox to boolean
				if(isset($_POST['cornerstone-checkbox'])) {

					foreach ( $_POST['cornerstone-checkbox'] as $name) {
						self::$settings[ $name ] = in_array( $name, $fields );
					}

				}

  		 	foreach ( $fields as $name => $value ) {

					// remove html tags
  		 		self::$settings[ $name ] = is_array( $value ) ? array_map( 'strip_tags', $value ) : strip_tags( $value );

  		 	}

  		 	update_option( 'cornerstone_settings', self::$settings );

			}
		}



	}

	/**
	* Get all post types needed for option rendering, rather than directly coding it at view file.
	* Locally added for admin as for listing purposes only
	*/
	public function getPostTypes() { //Get valid post types where cornerstone is applicable

		$post_types = get_post_types( array( 'public'   => true, 'show_ui' => true, 'exclude_from_search' => false ) , 'names' );
		unset( $post_types['attachment'] );
		return $post_types;

	}

	/**
	* Get all editable user roles assignable for cornerstone
	* Administrator role will be skip since it can't be turned off and on when it should be permitted for everything
	*/
	public function getRoles () {

		$roles = get_editable_roles();
		$active_roles = array();

		foreach ( $roles as $name => $info ) {
			if ( $name !== 'administrator') $active_roles[ $info['name'] ] = $name;
		}

		return $active_roles;
	}

	/**
	* Method for rendering field for options page
	*/
	public function renderField( $name, $options ) {

		if ( !isset( $options['default'] ) )
			$options['default'] = '';

    $current_value = self::$settings[ $name ];

		switch ( $options['type'] ) {

			case 'checkboxes':

				$checkbox = "<div class=\"cs_setting_checkbox\"><label><input type=\"hidden\" name=\"cornerstone-checkboxes[{$name}]\" value=\"{$name}\"> <input type=\"checkbox\" class=\"checkbox\" %s> %s</label></div>";

				$checkbox_html = '';
				$checkbox_id   = 0;

				foreach ( $options['value'] as $key => $value ) {

				$checkbox_id++;

					$checkbox_html .= sprintf(
						$checkbox,
						'name="cornerstone-fields['.$name.'][]" id="cornerstone-fields-'.$name.'-'.$checkbox_id.'" value="'.$value.'" ' . checked( in_array( $value, $current_value ), true, false ) ,
						__(  is_string( $key ) ? $key : $value, csl18n() )
					 );

				}

				return $checkbox_html;

			break;

			case 'checkbox':

				$checkbox = "<div class=\"cs_setting_checkbox\"><label><input type=\"hidden\" name=\"cornerstone-checkbox[{$name}]\" value=\"{$name}\"> <input type=\"checkbox\" class=\"checkbox\" %s> %s</label></div>";

				return sprintf(
					$checkbox,
					'name="cornerstone-fields['.$name.']" id="cornerstone-fields-'.$name.'" value="'.$options['value'].'" ' . checked( $current_value, $options['value'], false ) ,
					__( empty( $options['label'] ) ? $options['value'] : $options['label'], csl18n() )
				);

			break;

			case 'color' :

				return '<div class="cs_setting_color">
				<input name="cornerstone-fields['.$name.']" id="cornerstone-fields-'.$name.'" type="text" value="'.$current_value.'" class="wp-color-picker cs-picker" data-title="'.__(  $options['label'], csl18n() ).'" data-default-color="'.$options['default'].'"></div>';

			break;

			case 'text' :

				return '<div class="cs_setting_color"><input name="cornerstone-fields['.$name.']" id="cornerstone-fields-'.$name.'" type="text" value="'.$current_value.'"></div>';

			break;

		}

	}

}