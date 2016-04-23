<?php

class CS_Promo extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'promo',
      'title'       => __( 'Promo', csl18n() ),
      'section'     => 'marketing',
      'description' => __( 'Promo description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'content' => '.x-promo-content',
    	)
    );
  }


  public function controls() {

    $this->addControl(
      'content',
      'editor',
      __( 'Content', csl18n() ),
      __( 'Enter your Promo content.', csl18n() ),
      ''
    );

    $this->addControl(
      'image',
      'image',
      __( 'Promo Image &amp; Alt Text', csl18n() ),
      __( 'Include an image for your Promo element and provide the alt text in the input below. Alt text is used to describe an image to search engines.', csl18n() ),
      CS()->common()->placeholderImage( 650, 1500 )
    );


    $this->addControl(
      'alt',
      'text',
      NULL,
      NULL,
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_promo',
		    'title'        => __( 'Promo', csl18n() ),
		    'section'    => __( 'Marketing', csl18n() ),
		    'description' => __( 'Include a marketing promo in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/promo/',
		  'params'      => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',

		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'image',
		        'heading'     => __( 'Promo Image', csl18n() ),
		        'description' => __( 'Include an image for your promo element.', csl18n() ),
		        'type'        => 'attach_image',

		      ),
		      array(
		        'param_name'  => 'alt',
		        'heading'     => __( 'Alt', csl18n() ),
		        'description' => __( 'Enter in the alt text for your promo image.', csl18n() ),
		        'type'        => 'textfield',

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

    $shortcode = "[x_promo image=\"$image\" alt=\"$alt\"{$extra}]{$content}[/x_promo]";

    return $shortcode;

  }

}