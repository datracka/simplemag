<?php

class CS_Clear extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'clear',
      'title'       => __( 'Clear', csl18n() ),
      'section'     => 'structure',
      'description' => __( 'Clear description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'can_preview' => false
    );
  }

  public function controls() { }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_clear',
		    'title'        => __( 'Clear', csl18n() ),
		    'section'    => __( 'Structure', csl18n() ),
		    'description' => __( 'Clear floated elements in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/clear/',
		  'params'      => array(
		      Cornerstone_Shortcode_Generator::map_default_id( array( 'advanced' => false) ),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {

    extract( $atts );

    return "[x_clear{$extra}]";

  }

}