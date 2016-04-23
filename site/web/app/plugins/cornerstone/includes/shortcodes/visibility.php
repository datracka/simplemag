<?php

// Responsive Visibility
// =============================================================================

function x_shortcode_visibility( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'     => '',
    'class'  => '',
    'style'  => '',
    'type'   => '',
    'inline' => ''
  ), $atts, 'x_visibility' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-visibility ' . esc_attr( $class ) : 'x-visibility';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $type  = ( $type  != '' ) ? ' x-' . $type : '';

  ( $inline == 'true' ) ? $output = "<span {$id} class=\"{$class}{$type}\" {$style}>" . do_shortcode( $content ) . "</span>" : $output = "<div {$id} class=\"{$class}{$type}\" {$style}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'x_visibility', 'x_shortcode_visibility' );