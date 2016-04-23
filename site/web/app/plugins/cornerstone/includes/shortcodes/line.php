<?php

// Line
// =============================================================================

function x_shortcode_line( $atts ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_line' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-hr ' . esc_attr( $class ) : 'x-hr';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<hr {$id} class=\"{$class}\" {$style}>";

  return $output;
}

add_shortcode( 'x_line', 'x_shortcode_line' );