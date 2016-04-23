<?php

// Dropcap
// =============================================================================

function x_shortcode_dropcap( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_dropcap' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-dropcap ' . esc_attr( $class ) : 'x-dropcap';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<span {$id} class=\"{$class}\" {$style}>{$content}</span>";

  return $output;
}

add_shortcode( 'x_dropcap', 'x_shortcode_dropcap' );