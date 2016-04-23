<?php

class CS_Responsive_Text extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'responsive-text',
      'title'       => __('Responsive Text', csl18n() ),
      'section'     => '_typography',
      'description' => __( 'Responsive Text description.', csl18n() ),
      'render'      => false
    );
  }

  public function controls() {

    $this->addControl(
      'title',
      'title',
      null,
      null,
      __( 'Responsive Text Item', csl18n() )
    );

    $this->addControl(
      'selector',
      'text',
      __( 'Selector', csl18n() ),
      __( 'Enter in the selector for your Responsive Text (e.g. if your class is "h-responsive" enter ".h-responsive").', csl18n() ),
      '.h-responsive'
    );

    $this->addControl(
      'compression',
      'text',
      __( 'Compression', csl18n() ),
      __( 'Enter the compression for your Responsive Text. Adjust up and down to desired level in small increments (e.g. 0.95, 1.15, et cetera).', csl18n() ),
      '1.0'
    );

    $this->addControl(
      'min_size',
      'text',
      __( 'Minimum Size', csl18n() ),
      __( 'Enter the minimum size of your Responsive Text.', csl18n() ),
      ''
    );

    $this->addControl(
      'max_size',
      'text',
      __( 'Maximum Size', csl18n() ),
      __( 'Enter the maximum size of your Responsive Text.', csl18n() ),
      ''
    );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_responsive_text selector=\"$selector\" compression=\"$compression\" min_size=\"$min_size\" max_size=\"$max_size\"]";

    return $shortcode;

  }

}