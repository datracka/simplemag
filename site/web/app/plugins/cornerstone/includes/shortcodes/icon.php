<?php

// Icon
// =============================================================================

function x_shortcode_icon( $atts ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'type'  => ''
  ), $atts, 'x_icon' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-icon ' . esc_attr( $class ) : 'x-icon';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $type  = ( $type  != '' ) ? $type : '';

  $unicode = fa_unicode( $type );

  $output = "<i {$id} class=\"{$class} x-icon-{$type}\" {$style} data-x-icon=\"&#x{$unicode};\" aria-hidden=\"true\"></i>";

  return $output;
}

add_shortcode( 'x_icon', 'x_shortcode_icon' );