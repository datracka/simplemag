<?php

class CS_Protect extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'protect',
      'title'       => __( 'Protect', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Protect description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'content' => '' )
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'textarea',
      __( 'Content', csl18n() ),
      __( 'Enter the text to go inside your Protect shortcode. This will only be visible to users who are logged in.', csl18n() ),
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_protect',
		    'title'        => __( 'Protect', csl18n() ),
		    'section'    => __( 'Content', csl18n() ),
		    'description' => __( 'Protect content from non logged in users', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/protected-content/',
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

    $shortcode = "[x_protect{$extra}]{$content}[/x_protect]";

    return $shortcode;

  }

}