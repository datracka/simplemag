<?php

class CS_Code extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'code',
      'title'       => __( 'Code Snippet', csl18n() ),
      'section'     => 'typography',
      'description' => __( 'Code Snippet description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'content' => '.x-code',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'textarea',
      __( 'Content', csl18n() ),
      __( 'The content you want output. Keep in mind that this shortcode is meant to display code snippets, not output functioning code.', csl18n() ),
      __( 'This shortcode is great for outputting code snippets or preformatted text.', csl18n() )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_code',
		    'title'        => __( 'Code', csl18n() ),
		    'section'    => __( 'Typography', csl18n() ),
		    'description' => __( 'Add a block of example code to your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/code/',
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

    $shortcode = "[x_code{$extra}]{$content}[/x_code]";

    return $shortcode;

  }

}