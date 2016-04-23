<?php

class CS_Author extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'author',
      'title'       => __( 'Author', csl18n() ),
      'section'     => 'social',
      'description' => __( 'Author description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'heading' => '.x-author-box',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'heading',
      'text',
      __( 'Title', csl18n() ),
      __( 'Enter in a title for your author information.', csl18n() ),
      __( 'About the Author', csl18n() )
    );

    $this->addControl(
      'author_id',
      'text',
      __( 'Author ID', csl18n() ),
      __( 'By default the author of the post or page will be output by leaving this input blank. If you would like to output the information of another author, enter in their user ID here.', csl18n() ),
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_author',
		    'title'        => __( 'Author', csl18n() ),
		    'section'    => __( 'Social', csl18n() ),
		    'description' => __( 'Include post author information', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/author',
		  'params'      => array(
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Enter in a title for your author information.', csl18n() ),
		        'type'        => 'textfield',

		        'value'       => 'About the Author'
		      ),
		      array(
		        'param_name'  => 'author_id',
		        'heading'     => __( 'Author ID', csl18n() ),
		        'description' => __( 'By default the author of the post or page will be output by leaving this input blank. If you would like to output the information of another author, enter in their user ID here.', csl18n() ),
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

    $shortcode = "[x_author title=\"$heading\" author_id=\"$author_id\"{$extra}]";

    return $shortcode;

  }

}