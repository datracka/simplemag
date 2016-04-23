<?php

class CS_Block_Grid_Item extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'block-grid-item',
      'title'       => __( 'Block Grid Item', csl18n() ),
      'section'     => '_content',
      'description' => __( 'Block Grid Item description.', csl18n() ),
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
      __( 'Include your desired content for your Block Grid Item here.', csl18n() ),
      __( 'Add some content to your block grid item here. The block grid responds a little differently than traditional columns, allowing you to mix and match for cool effects.', csl18n() )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_block_grid_item',
		    'title'            => __( 'Block Grid Item', csl18n() ),
		    'weight'          => 870,
		    'icon'            => 'block-grid-item',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include a block grid item in your block grid', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/block-grid/',
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

  //   $shortcode = "[x_block_grid_item{$extra}][/x_block_grid_item]";

  //   return $shortcode;

  // }

}