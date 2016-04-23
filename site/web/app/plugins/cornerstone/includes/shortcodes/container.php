<?php

// Container
// =============================================================================

function x_shortcode_container( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'         => '',
    'class'      => '',
    'style'      => ''
  ), $atts, 'x_container' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-container max width ' . esc_attr( $class ) : 'x-container max width';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'x_container', 'x_shortcode_container' );