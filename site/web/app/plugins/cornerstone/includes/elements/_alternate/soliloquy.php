<?php

class CS_Soliloquy extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'soliloquy',
      'title'       => __( 'Soliloquy', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Place an Soliloquy element into your content.', csl18n() ),
      'supports'    => array(),
      'can_preview' => false
    );
  }

  public function controls() {

    $found = array();

    if ( class_exists( 'Soliloquy' ) ) {

      $soliloquy_sliders = Soliloquy::get_instance()->get_sliders();

      if ( is_array( $soliloquy_sliders ) ) {
      	foreach ( $soliloquy_sliders as $ss ) {
	        if ( !isset( $ss['id'] ) && $ss['config']) continue;
	        $found[] = array(
	          'value' => $ss['id'],
	          'label' => $ss['config']['title']
	        );
	      }
      }

    }

    if ( empty( $found ) ) {

      $found[] = array(
        'value'    => 'none',
        'label'    => __( 'No Sliders Available', csl18n() ),
        'disabled' => true
      );

    }

    $this->addControl(
      'source_id',
      'select',
      __( 'Select Slider', csl18n() ),
      __( 'Choose from Soliloquy elements that have already been created.', csl18n() ),
      $found[0]['value'],
      array(
        'choices' => $found
      )
    );

  }

  public function is_active() {
    return class_exists( 'Soliloquy' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[soliloquy id=\"$source_id\"]";

    return $shortcode;

  }

}