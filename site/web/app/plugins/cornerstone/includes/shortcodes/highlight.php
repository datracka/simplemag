<?php

// Highlight
// =============================================================================

function x_shortcode_highlight( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'type'  => ''
  ), $atts, 'x_highlight' ) );

  $id    = ( $id    != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != ''     ) ? 'x-highlight ' . esc_attr( $class ) : 'x-highlight';
  $style = ( $style != ''     ) ? 'style="' . $style . '"' : '';
  $type  = ( $type  == 'dark' ) ? ' dark' : '';

  $output = "<mark {$id} class=\"{$class}{$type}\" {$style}>{$content}</mark>";

  return $output;
}

add_shortcode( 'x_highlight', 'x_shortcode_highlight' );