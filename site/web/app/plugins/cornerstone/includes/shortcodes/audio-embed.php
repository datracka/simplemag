<?php

// Audio Embed
// =============================================================================

function x_shortcode_audio_embed( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'     => '',
    'class'  => '',
    'style'  => ''
  ), $atts, 'x_audio_embed' ) );

  $id     = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class  = ( $class != '' ) ? 'x-audio embed ' . esc_attr( $class ) : 'x-audio embed';
  $style  = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>{$content}</div>";

  return $output;
}

add_shortcode( 'x_audio_embed', 'x_shortcode_audio_embed' );