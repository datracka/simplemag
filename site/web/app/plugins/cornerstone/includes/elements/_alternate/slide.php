<?php

class CS_Slide extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'slide',
      'title'       => __( 'Slide', csl18n() ),
      'section'     => '_content',
      'description' => __( 'Slide description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'render'      => false,
      'delegate'    => true
    );
  }

  public function controls() {

    $this->addControl(
      'title',
      'title',
      NULL,
      NULL,
      ''
    );

    $this->addControl(
      'content',
      'editor',
      __( 'Content', csl18n() ),
      __( 'Include your desired content for your Slide here.', csl18n() ),
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_slide',
		    'title'            => __( 'Slide', csl18n() ),
		    'weight'          => 600,
		    'icon'            => 'slide',
		    'section'        => __( 'Media', csl18n() ),
		    'description'     => __( 'Include a slide into your slider', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/responsive-slider/',
		  'params'          => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',

		        'value'       => ''
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  // public function render( $atts ) {

  //   extract( $atts );

  //   $extra = $this->extra( array(
  //     'id'    => $id,
  //     'class' => $class,
  //     'style' => $style
  //   ) );

  //   $shortcode = "[x_slide{$extra}][/x_slide]";

  //   return $shortcode;

  // }

}