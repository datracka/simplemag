<?php

// Clear
// =============================================================================

function x_shortcode_clear( $atts ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_clear' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-clear ' . esc_attr( $class ) : 'x-clear';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<hr {$id} class=\"{$class}\" {$style}>";

  return $output;
}

add_shortcode( 'x_clear', 'x_shortcode_clear' );