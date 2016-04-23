<?php

class CS_Line extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'line',
      'title'       => __( 'Line', csl18n() ),
      'section'     => 'structure',
      'description' => __( 'Line description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' )
    );
  }

  public function controls() { }

  public function xsg() {
  	$this->sg_map(array(
	    'id'        => 'x_line',
	    'title'        => __( 'Line', csl18n() ),
	    'section'    => __( 'Structure', csl18n() ),
	    'description' => __( 'Place a horizontal rule in your content', csl18n() ),
	    'demo' => 'http://theme.co/x/demo/integrity/1/shortcodes/line/',
	    'params'      => array(
	      Cornerstone_Shortcode_Generator::map_default_id( array( 'advanced' => false ) ),
	      Cornerstone_Shortcode_Generator::map_default_class(),
	      Cornerstone_Shortcode_Generator::map_default_style()
	    )
	  ));
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_line{$extra}]";

    return $shortcode;

  }

}