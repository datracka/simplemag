<?php

// Code
// =============================================================================

function x_shortcode_code( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'       => '',
    'class'    => '',
    'style'    => '',
    'sanitize' => ''
  ), $atts, 'x_code' ) );

  $id       = ( $id       != ''      ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class    = ( $class    != ''      ) ? 'x-code ' . esc_attr( $class ) : 'x-code';
  $style    = ( $style    != ''      ) ? 'style="' . $style . '"' : '';
  $sanitize = ( $sanitize == 'false' ) ? 'false' : 'true';

  $content = ( $sanitize == 'true' ) ? htmlspecialchars( $content ) : $content;

  $output = "<pre {$id} class=\"{$class}\" {$style}><code>{$content}</code></pre>";

  return $output;
}

add_shortcode( 'x_code', 'x_shortcode_code' );
CS_Shortcode_Preserver::preserve('x_code');