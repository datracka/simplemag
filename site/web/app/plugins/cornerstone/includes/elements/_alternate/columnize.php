<?php

class CS_Columnize extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'columnize',
      'title'       => __( 'Columnize', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Columnize description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'content' => '' ),
      'autofocus' => array(
    		'content' => '.x-columnize',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'editor',
      NULL,
      NULL,
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_columnize',
		    'title'        => __( 'Columnize', csl18n() ),
		    'section'    => __( 'Content', csl18n() ),
		    'description' => __( 'Split your text into multiple columns', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/columnize/',
		  'params'      => array(
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

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_columnize{$extra}]{$content}[/x_columnize]";

    return $shortcode;

  }

}