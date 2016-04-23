<?php

class CS_Toc_Item extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'toc-item',
      'title'       => __( 'TOC Item', csl18n() ),
      'section'     => '_content',
      'render'      => false,
      'delegate'    => true,
      'context'     => 'generator'
    );
  }

  public function controls() { }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_toc_item',
		    'title'            => __( 'Table of Contents Item', csl18n() ),
		    'weight'          => 620,
		    'icon'            => 'toc-item',
		    'section'        => __( 'Information', csl18n() ),
		    'description'     => __( 'Include a table of contents item', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/table-of-contents/',
		  'params'          => array(
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Set the title of the table of contents item.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'page',
		        'heading'     => __( 'Page', csl18n() ),
		        'description' => __( 'Set the page of the table of contents item.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

}