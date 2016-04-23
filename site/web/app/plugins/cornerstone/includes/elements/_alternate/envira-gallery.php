<?php

class CS_Envira_Gallery extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'envira-gallery',
      'title'       => __( 'Envira Gallery', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Place an Envira Gallery element into your content.', csl18n() ),
      'supports'    => array(),
      'can_preview' => false
    );
  }

  public function controls() {

    $found = array();

    if ( class_exists( 'Envira_Gallery' ) ) {

      $envira_galleries = Envira_Gallery::get_instance()->get_galleries();

      if ( is_array( $envira_galleries ) ) {
      	foreach ( $envira_galleries as $eg ) {
	        $found[] = array(
	          'value' => $eg['id'],
	          'label' => $eg['config']['title']
	        );
	      }
      }


    }

    if ( empty( $found ) ) {

      $found[] = array(
        'value'    => 'none',
        'label'    => __( 'No Galleries Available', csl18n() ),
        'disabled' => true
      );

    }

    $this->addControl(
      'source_id',
      'select',
      __( 'Select Gallery', csl18n() ),
      __( 'Choose from Envira Gallery elements that have already been created.', csl18n() ),
      $found[0]['value'],
      array(
        'choices' => $found
      )
    );

  }

  public function is_active() {
    return class_exists( 'Envira_Gallery' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[envira-gallery id=\"$source_id\"]";

    return $shortcode;

  }

}