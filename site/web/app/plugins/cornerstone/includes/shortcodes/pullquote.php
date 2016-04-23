<?php

// Pullquote
// =============================================================================

function x_shortcode_pullquote( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'cite'  => '',
    'type'  => 'right'
  ), $atts, 'x_pullquote' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-blockquote x-pullquote ' . esc_attr( $class ) : 'x-blockquote x-pullquote';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $cite  = ( $cite  != '' ) ? '<cite class="x-cite">' . $cite . '</cite>' : '';
  $type  = ( $type  != '' ) ? ' ' . $type : '';

  $output = "<blockquote {$id} class=\"{$class}{$type}\" {$style}>" . do_shortcode( $content ) . $cite . "</blockquote>";

  return $output;
}

add_shortcode( 'x_pullquote', 'x_shortcode_pullquote' );