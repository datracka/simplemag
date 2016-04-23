<?php

class CS_Block_Grid extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'block-grid',
      'title'       => __( 'Block Grid', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Block Grid description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'renderChild' => true
    );
  }

  public function controls() {

    $this->addControl(
      'elements',
      'sortable',
      __( 'Block Grid Items', csl18n() ),
      __( 'Add a new item to your Block Grid.', csl18n() ),
      array(
        array( 'title' => __( 'Block Grid Item 1', csl18n() ) ),
        array( 'title' => __( 'Block Grid Item 2', csl18n() ) )
      ),
      array(
      	'element'   => 'block-grid-item',
        'newTitle' => __( 'Block Grid Item %s', csl18n() ),
        'floor'    => 2
      )
    );

    $this->addControl(
      'type',
      'select',
      __( 'Columns', csl18n() ),
      __( 'Select how many columns of items should be displayed on larger screens. These will update responsively based on screen size.', csl18n() ),
      'two-up',
      array(
        'choices' => array(
          array( 'value' => 'two-up',   'label' => __( '2', csl18n() ) ),
          array( 'value' => 'three-up', 'label' => __( '3', csl18n() ) ),
          array( 'value' => 'four-up',  'label' => __( '4', csl18n() ) )
        )
      )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_block_grid',
		    'title'            => __( 'Block Grid', csl18n() ),
		    'weight'          => 880,
		    'icon'            => 'block-grid',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include a block grid container in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/block-grid/',
		  'params'          => array(
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Type', csl18n() ),
		        'description' => __( 'Select how many block grid items you want per row.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'Two'   => 'two-up',
		          'Three' => 'three-up',
		          'Four'  => 'four-up',
		          'Five'  => 'five-up'
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

    extract( $atts );

    $contents = '';

    foreach ( $elements as $e ) {

      $item_extra = $this->extra( array(
        'id'    => $e['id'],
        'class' => $e['class'],
        'style' => $e['style']
      ) );

      $contents .= '[x_block_grid_item' . $item_extra . ']' . $e['content'] . '[/x_block_grid_item]';

    }

    $shortcode = "[x_block_grid type=\"$type\"{$extra}]{$contents}[/x_block_grid]";

    return $shortcode;

  }

}