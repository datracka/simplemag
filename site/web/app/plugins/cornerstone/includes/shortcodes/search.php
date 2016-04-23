<?php

// Search
// =============================================================================

function x_shortcode_search( $atts ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_search' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-search-shortcode ' . esc_attr( $class ) : 'x-search-shortcode';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>" . get_search_form( false ) . '</div>';

  return $output;
}

add_shortcode( 'x_search', 'x_shortcode_search' );