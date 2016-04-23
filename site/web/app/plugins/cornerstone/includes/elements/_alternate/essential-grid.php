<?php

class CS_Essential_Grid extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'essential-grid',
      'title'       => __( 'Essential Grid', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Place an Essential Grid element into your content.', csl18n() ),
      'supports'    => array()
    );
  }

  public function controls() {

    $found = array();

    if ( class_exists( 'Essential_Grid' ) ) {

      $essential_grids = Essential_Grid::get_essential_grids();

      foreach ( $essential_grids as $eg ) {
        $found[] = array(
          'value' => $eg->handle,
          'label' => $eg->name
        );
      }

    }

    if ( empty( $found ) ) {

      $found[] = array(
        'value'    => 'none',
        'label'    => __( 'No Grids Available', csl18n() ),
        'disabled' => true
      );

    }

    $this->addControl(
      'alias',
      'select',
      __( 'Select Grid', csl18n() ),
      __( 'Choose from Essential Grid elements that have already been created.', csl18n() ),
      $found[0]['value'],
      array(
        'choices' => $found
      )
    );

  }

  public function is_active() {
    return class_exists( 'Essential_Grid' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[ess_grid alias=\"$alias\"]";

    return $shortcode;
  }

}