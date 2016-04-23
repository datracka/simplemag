<?php

class Cornerstone_Customizer_Manager extends Cornerstone_Plugin_Component {

	/**
	 * List of option names and default values
	 * @var array
	 */
	private $defaults;

	/**
	 * Register hooks
	 */
	public function setup() {

		if ( apply_filters( 'cornerstone_use_customizer', true ) ) {
			add_action( 'customize_register', array( $this, 'register' ) );
		}

		$this->defaults = $this->plugin->config( 'customizer/defaults' );

		if ( defined('WP_DEBUG') && WP_DEBUG ) {
			add_shortcode( 'cornerstone_customizer_debug', array( $this, 'debugShortcode' ) );
		}
	}

	/**
	 * Return all registered options as an array of keys.
	 * @return array
	 */
	public function optionList() {
		return array_keys( $this->defaults );
	}

	/**
	 * Get all of our registered options and apply their defaults
	 * @return array
	 */
	public function optionData() {
		$retrieved = array();
		foreach ($this->defaults as $name => $default) {
			$retrieved[$name] = get_option( $name, $default );
		}
		return $retrieved;
	}

	public function debugShortcode() {
		ob_start();
		echo '<pre>';
		print_r( $this->optionData() );
		echo '</pre>';
		return ob_get_clean();
	}

	/**
	 * Register Customizer Sections, Settings, and Controls.
	 */
	public function register( $wp_customize ) {

		$cs = array();

		// =============================================================================
		// TABLE OF CONTENTS
		// -----------------------------------------------------------------------------
		//   01. Register Options
		//       a. Lists
		//       b. Sections
		//       c. Options - Layout
		// =============================================================================

		// Register Options
		// =============================================================================

		//
		// Lists.
		//

		$list_on_off = array(
		  '1' => 'On',
		  ''  => 'Off'
		);

		$list_button_styles = array(
		  'real'        => __( '3D', csl18n() ),
		  'flat'        => __( 'Flat', csl18n() ),
		  'transparent' => __( 'Transparent', csl18n() )
		);

		$list_button_shapes = array(
		  'square'  => __( 'Square', csl18n() ),
		  'rounded' => __( 'Rounded', csl18n() ),
		  'pill'    => __( 'Pill', csl18n() )
		);

		$list_button_sizes = array(
		  'mini'    => __( 'Mini', csl18n() ),
		  'small'   => __( 'Small', csl18n() ),
		  'regular' => __( 'Regular', csl18n() ),
		  'large'   => __( 'Large', csl18n() ),
		  'x-large' => __( 'Extra Large', csl18n() ),
		  'jumbo'   => __( 'Jumbo', csl18n() )
		);


		//
		// Sections.
		//

		$cs['sec'][] = array( 'cs_customizer_section_layout',     __( 'Cornerstone &ndash; Layout', csl18n() ),     1 );
		$cs['sec'][] = array( 'cs_customizer_section_typography', __( 'Cornerstone &ndash; Typography', csl18n() ), 2 );
		$cs['sec'][] = array( 'cs_customizer_section_buttons',    __( 'Cornerstone &ndash; Buttons', csl18n() ),    3 );


		//
		// Options - Layout.
		//

		$cs['set'][] = array( 'cs_base_margin', '1.5em', 'refresh' );
		$cs['con'][] = array( 'cs_base_margin', 'text', __( 'Base Margin', csl18n() ), 'cs_customizer_section_layout' );

		$cs['set'][] = array( 'cs_container_width', '88%', 'refresh' );
		$cs['con'][] = array( 'cs_container_width', 'text', __( 'Container Width', csl18n() ), 'cs_customizer_section_layout' );

		$cs['set'][] = array( 'cs_container_max_width', '1200px', 'refresh' );
		$cs['con'][] = array( 'cs_container_max_width', 'text', __( 'Container Max Width', csl18n() ), 'cs_customizer_section_layout' );



		//
		// Options - Typography.
		//

		$cs['set'][] = array( 'cs_link_color', '#ff2a13', 'refresh' );
		$cs['con'][] = array( 'cs_link_color', 'color', __( 'Link Color', csl18n() ), 'cs_customizer_section_typography' );

		$cs['set'][] = array( 'cs_link_color_hover', '#d80f0f', 'refresh' );
		$cs['con'][] = array( 'cs_link_color_hover', 'color', __( 'Link Hover Color', csl18n() ), 'cs_customizer_section_typography' );



		//
		// Options - Buttons.
		//

		$cs['set'][] = array( 'cs_button_style', 'real', 'refresh' );
		$cs['con'][] = array( 'cs_button_style', 'select', __( 'Button Style', csl18n() ), $list_button_styles, 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_shape', 'rounded', 'refresh' );
		$cs['con'][] = array( 'cs_button_shape', 'select', __( 'Button Shape', csl18n() ), $list_button_shapes, 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_size', 'regular', 'refresh' );
		$cs['con'][] = array( 'cs_button_size', 'select', __( 'Button Size', csl18n() ), $list_button_sizes, 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_color', '#ffffff', 'refresh' );
		$cs['con'][] = array( 'cs_button_color', 'color', __( 'Button Text', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_bg_color', '#ff2a13', 'refresh' );
		$cs['con'][] = array( 'cs_button_bg_color', 'color', __( 'Button Background', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_border_color', '#ac1100', 'refresh' );
		$cs['con'][] = array( 'cs_button_border_color', 'color', __( 'Button Border', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_bottom_color', '#a71000', 'refresh' );
		$cs['con'][] = array( 'cs_button_bottom_color', 'color', __( 'Button Bottom', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_color_hover', '#ffffff', 'refresh' );
		$cs['con'][] = array( 'cs_button_color_hover', 'color', __( 'Button Text', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_bg_color_hover', '#ef2201', 'refresh' );
		$cs['con'][] = array( 'cs_button_bg_color_hover', 'color', __( 'Button Background', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_border_color_hover', '#600900', 'refresh' );
		$cs['con'][] = array( 'cs_button_border_color_hover', 'color', __( 'Button Border', csl18n() ), 'cs_customizer_section_buttons' );

		$cs['set'][] = array( 'cs_button_bottom_color_hover', '#a71000', 'refresh' );
		$cs['con'][] = array( 'cs_button_bottom_color_hover', 'color', __( 'Button Bottom', csl18n() ), 'cs_customizer_section_buttons' );

	  //
	  // Output - Sections.
	  //

	  foreach ( $cs['sec'] as $section ) {

	    $wp_customize->add_section( $section[0], array(
	      'title'    => $section[1],
	      'priority' => $section[2],
	    ) );

	  }


	  //
	  // Output - Settings.
	  //

	  foreach ( $cs['set'] as $setting ) {

	    $wp_customize->add_setting( $setting[0], array(
	      'type'      => 'option',
	      'default'   => $this->defaults[$setting[0]],
	      'transport' => 'refresh' //(isset( $setting[2] ) ) ? $setting[2] : 'refresh'
	    ));

	  }


	  //
	  // Output - Controls.
	  //

	  foreach ( $cs['con'] as $control ) {

	    static $i = 1;

	    if ( $control[1] == 'radio' ) {

	      $wp_customize->add_control( $control[0], array(
	        'type'     => $control[1],
	        'label'    => $control[2],
	        'section'  => $control[4],
	        'priority' => $i,
	        'choices'  => $control[3]
	      ));

	    } elseif ( $control[1] == 'select' ) {

	      $wp_customize->add_control( $control[0], array(
	        'type'     => $control[1],
	        'label'    => $control[2],
	        'section'  => $control[4],
	        'priority' => $i,
	        'choices'  => $control[3]
	      ));

	    } elseif ( $control[1] == 'slider' ) {

	      $wp_customize->add_control(
	        new X_Customize_Control_Slider( $wp_customize, $control[0], array(
	          'label'    => $control[2],
	          'section'  => $control[4],
	          'settings' => $control[0],
	          'priority' => $i,
	          'choices'  => $control[3]
	        ))
	      );

	    } elseif ( $control[1] == 'text' ) {

	      $wp_customize->add_control( $control[0], array(
	        'type'     => $control[1],
	        'label'    => $control[2],
	        'section'  => $control[3],
	        'priority' => $i
	      ));

	    } elseif ( $control[1] == 'textarea' ) {

	      $wp_customize->add_control(
	        new X_Customize_Control_Textarea( $wp_customize, $control[0], array(
	          'label'    => $control[2],
	          'section'  => $control[3],
	          'settings' => $control[0],
	          'priority' => $i
	        ))
	      );

	    } elseif ( $control[1] == 'checkbox' ) {

	      $wp_customize->add_control( $control[0], array(
	        'type'     => $control[1],
	        'label'    => $control[2],
	        'section'  => $control[3],
	        'priority' => $i
	      ));

	    } elseif ( $control[1] == 'color' ) {

	      $wp_customize->add_control(
	        new WP_Customize_Color_Control( $wp_customize, $control[0], array(
	          'label'    => $control[2],
	          'section'  => $control[3],
	          'settings' => $control[0],
	          'priority' => $i
	        ))
	      );

	    } elseif ( $control[1] == 'image' ) {

	      $wp_customize->add_control(
	        new WP_Customize_Image_Control( $wp_customize, $control[0], array(
	          'label'    => $control[2],
	          'section'  => $control[3],
	          'settings' => $control[0],
	          'priority' => $i
	        ))
	      );

	    }

	    $i++;

	  }
	}

}