<?php

class CS_Visibility extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'visibility',
      'title'       => __( 'Visibility', csl18n() ),
      'context'     => 'generator'
    );
  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_visibility',
		    'title'            => __( 'Visibility', csl18n() ),
		    'weight'          => 850,
		    'icon'            => 'visibility',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Alter content based on screen size', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/responsive-visibility/',
		  'params'          => array(
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Visibility Type', csl18n() ),
		        'description' => __( 'Select how you want to hide or show your content.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'Hidden Phone'    => 'hidden-phone',
		          'Hidden Tablet'   => 'hidden-tablet',
		          'Hidden Desktop'  => 'hidden-desktop',
		          'Visible Phone'   => 'visible-phone',
		          'Visible Tablet'  => 'visible-tablet',
		          'Visible Desktop' => 'visible-desktop'
		        )
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {
  	return '';
  }

}