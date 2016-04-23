<?php

// Raw Content
// =============================================================================

function x_shortcode_raw_content( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'          => '',
    'class'       => '',
    'style'       => ''
  ), $atts, 'x_raw_content' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-raw-content ' . esc_attr( $class ) : 'x-raw-content';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>"
            . do_shortcode( $content )
          . '</div>';

  return $output;
}

add_shortcode( 'x_raw_content', 'x_shortcode_raw_content' );
CS_Shortcode_Preserver::preserve('x_raw_content');