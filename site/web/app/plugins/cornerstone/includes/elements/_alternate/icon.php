<?php

class CS_Icon extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'icon',
      'title'       => __( 'Icon', csl18n() ),
      'section'     => 'typography',
      'description' => __( 'Icon description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' )
    );
  }

  public function controls() {

    $this->addControl(
      'type',
      'icon-choose',
      __( 'Icon', csl18n() ),
      __( 'Specify the icon you would like to use.', csl18n() ),
      'check'
    );

  }

  public function xsg() { }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_icon type=\"{$type}\"{$extra}]";

    return $shortcode;

  }

}