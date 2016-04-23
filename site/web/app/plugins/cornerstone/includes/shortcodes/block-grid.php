<?php

// Block Grid
// =============================================================================

function x_shortcode_block_grid( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'type'  => ''
  ), $atts, 'x_block_grid' ) );

  $id     = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class  = ( $class != '' ) ? 'x-block-grid ' . esc_attr( $class ) : 'x-block-grid';
  $style  = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $type   = ( $type  != '' ) ? ' ' . $type : ' two-up';

  if ( $type == ' five-up' ) {
    $type = ' four-up';
  }

  $output = "<ul {$id} class=\"{$class}{$type}\" {$style}>" . do_shortcode( $content ) . "</ul>";

  return $output;
}

add_shortcode( 'x_block_grid', 'x_shortcode_block_grid' );



// Block Grid Item
// =============================================================================

function x_shortcode_block_grid_item( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_block_grid_item' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-block-grid-item ' . esc_attr( $class ) : 'x-block-grid-item';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<li {$id} class=\"{$class}\" {$style}>" . do_shortcode( $content ) . "</li>";

  return $output;
}

add_shortcode( 'x_block_grid_item', 'x_shortcode_block_grid_item' );