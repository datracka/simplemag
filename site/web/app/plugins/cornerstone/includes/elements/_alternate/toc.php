<?php

class CS_Toc extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'toc',
      'title'       => __( 'Table of Contents', csl18n() ),
      'section'     => 'typography',
      'context'     => 'generator'
    );
  }

  public function controls() { }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_toc',
		    'title'            => __( 'Table of Contents', csl18n() ),
		    'weight'          => 630,
		    'icon'            => 'toc',
		    'section'        => __( 'Information', csl18n() ),
		    'description'     => __( 'Include a table of contents in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/table-of-contents/',
		  'params'          => array(
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Set the title of the table of contents.', csl18n() ),
		        'type'        => 'textfield',

		        'value'       => 'Table of Contents'
		      ),
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Alignment', csl18n() ),
		        'description' => __( 'Select the alignment of your table of contents.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'Left'      => 'left',
		          'Right'     => 'right',
		          'Fullwidth' => 'block'
		        )
		      ),
		      array(
		        'param_name'  => 'columns',
		        'heading'     => __( 'Columns', csl18n() ),
		        'description' => __( 'Select a column count for your links if you have chosen "Fullwidth" as your alignment.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          '1' => '1',
		          '2' => '2',
		          '3' => '3'
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