<?php

class CS_Search extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'search',
      'title'       => __( 'Search', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Search description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' )
    );
  }

  public function controls() { }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_search',
		    'title'        => __( 'Search', csl18n() ),
		    'section'    => __( 'Content', csl18n() ),
		    'description' => __( 'Include a search field in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/search/',
		  'params'      => array(
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_search{$extra}]";

    return $shortcode;

  }

}