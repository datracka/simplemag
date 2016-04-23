<?php

class CS_Revolution_Slider extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'revolution-slider',
      'title'       => __( 'Revolution Slider', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Place a Revolution Slider element into your content.', csl18n() ),
      'supports'    => array()
    );
  }

  public function controls() {

    $found = array();

    if ( class_exists( 'RevSlider' ) ) {

      $new_rev_slider = new RevSlider();
      $rev_sliders    = $new_rev_slider->getArrSliders();

      foreach ( $rev_sliders as $rs ) {
        $found[] = array(
          'value' => $rs->getAlias(),
          'label' => $rs->getTitle()
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
      'alias',
      'select',
      __( 'Select Slider', csl18n() ),
      __( 'Choose from Revolution Slider elements that have already been created.', csl18n() ),
      $found[0]['value'],
      array(
        'choices' => $found
      )
    );

  }

  public function is_active() {
    return class_exists( 'RevSlider' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[rev_slider $alias]";

    return $shortcode;

  }

}