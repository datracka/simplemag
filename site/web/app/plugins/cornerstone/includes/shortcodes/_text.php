<?php

// Text
// =============================================================================

function x_shortcode_text( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_text' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-text ' . esc_attr( $class ) : 'x-text';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>"
            . do_shortcode( wpautop( $content ) )
          . '</div>';

  return $output;

}

add_shortcode( 'x_text', 'x_shortcode_text' );