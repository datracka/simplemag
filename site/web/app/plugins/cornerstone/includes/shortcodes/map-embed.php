<?php

// Map
// =============================================================================

function x_shortcode_map( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'           => '',
    'class'        => '',
    'style'        => '',
    'no_container' => ''
  ), $atts, 'x_map' ) );

  $id           = ( $id           != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class        = ( $class        != ''     ) ? 'x-map embed ' . esc_attr( $class ) : 'x-map embed';
  $style        = ( $style        != ''     ) ? 'style="' . $style . '"' : '';
  $no_container = ( $no_container == 'true' ) ? '' : ' with-container';

  $output = "<div {$id} class=\"{$class}{$no_container}\" {$style}><div class=\"x-map-inner\">{$content}</div></div>";

  return $output;
}

add_shortcode( 'x_map', 'x_shortcode_map' );