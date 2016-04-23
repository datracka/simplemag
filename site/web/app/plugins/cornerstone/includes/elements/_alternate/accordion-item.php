<?php

class CS_Accordion_Item extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'accordion-item',
      'title'       => __( 'Accordion Item', csl18n() ),
      'section'     => '_content',
      'description' => __( 'Accordion Item description.', csl18n() ),
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
      __( 'Include your desired content for your Accordion Item here.', csl18n() ),
      ''
    );

    $this->addControl(
      'open',
      'toggle',
      __( 'Starts Open', csl18n() ),
      __( 'If the Accordion Items are linked, only one can start open.', csl18n() ),
      false
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_accordion_item',
		    'title'            => __( 'Accordion Item', csl18n() ),
		    'weight'          => 940,
		    'icon'            => 'accordion-item',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include an accordion item in your accordion', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/accordion/',
		  'params'          => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'parent_id',
		        'heading'     => __( 'Parent ID', csl18n() ),
		        'description' => __( 'Optionally include an ID given to the parent accordion to only allow one toggle to be open at a time.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Include a title for your accordion item.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'open',
		        'heading'     => __( 'Open', csl18n() ),
		        'description' => __( 'Select for your accordion item to be open by default.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
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

  //   $shortcode = "[x_accordion_item title=\"$title\" open=\"$open\"{$extra}]{$content}[/x_accordion_item]";

  //   return $shortcode;

  // }

}