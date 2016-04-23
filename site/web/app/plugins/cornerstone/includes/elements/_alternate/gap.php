<?php

class CS_Gap extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'gap',
      'title'       => __( 'Gap', csl18n() ),
      'section'     => 'structure',
      'description' => __( 'Gap description.', csl18n() ),
      'supports'    => array( 'visibility', 'id', 'class', 'style' ),
      'render'      => false,
      'autofocus' => array(
    		'gap_size' => '.cs-gap',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'gap_size',
      'text',
      __( 'Size', csl18n() ),
      __( 'Enter in the size of your gap. Pixels, ems, and percentages are all valid units of measurement.', csl18n() ),
      '50px'
    );

  }

  public function xsg() {

		$this->sg_map(
		  array(
		    'id'        => 'x_gap',
		    'title'        => __( 'Gap', csl18n() ),
		    'section'    => __( 'Structure', csl18n() ),
		    'description' => __( 'Insert a vertical gap in your content', csl18n() ),
		    'demo' => 'http://theme.co/x/demo/integrity/1/shortcodes/gap/',
		  'params'      => array(
		      array(
		        'param_name'  => 'size',
		        'heading'     => __( 'Size', csl18n() ),
		        'description' => __( 'Enter in the size of your gap. Pixels, ems, and percentages are all valid units of measurement.', csl18n() ),
		        'type'        => 'textfield',
		        'value'       => '1.313em'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style(),
		    )
		  )
		);

  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_gap size=\"$gap_size\"{$extra}]";

    return $shortcode;

  }

}