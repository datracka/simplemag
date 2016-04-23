<?php

class CS_Layerslider extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'layerslider',
      'title'       => __( 'LayerSlider', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Place a LayerSlider element into your content.', csl18n() ),
      'supports'    => array()
    );
  }

  public function controls() {

    $found = array();

    if ( class_exists( 'LS_Sliders' ) ) {

      $layersliders = LS_Sliders::find( array( 'order' => 'ASC', 'limit' => 100 ) );

      foreach ( $layersliders as $ls ) {
        $found[] = array(
          'value' => $ls['id'],
          'label' => $ls['name']
        );
      }

    }

    if ( empty( $found ) ) {

      $found[] = array(
        'value'    => 'none',
        'label'    => __( 'No Slider Available', csl18n() ),
        'disabled' => true
      );

    }

    $this->addControl(
      'source_id',
      'select',
      __( 'Select Slider', csl18n() ),
      __( 'Choose from LayerSlider elements that have already been created.', csl18n() ),
      $found[0]['value'],
      array(
        'choices' => $found
      )
    );

  }

  public function is_active() {
    return class_exists( 'LS_Sliders' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[layerslider id=\"$source_id\"]";

    return $shortcode;

  }

}