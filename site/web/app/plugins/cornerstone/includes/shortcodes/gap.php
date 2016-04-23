<?php

// Gap
// =============================================================================

function x_shortcode_gap( $atts ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'size'  => ''
  ), $atts, 'x_gap' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-gap ' . esc_attr( $class ) : 'x-gap';
  $style = ( $style != '' ) ? $style : '';
  $size  = ( $size  != '' ) ? "margin: {$size} 0 0 0;" : 'margin: 0;';

  $output = "<hr {$id} class=\"{$class}\" style=\"{$style}{$size}\">";

  return $output;
}

add_shortcode( 'x_gap', 'x_shortcode_gap' );