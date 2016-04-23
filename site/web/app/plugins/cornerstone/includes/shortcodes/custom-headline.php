<?php

// Custom Headline
// =============================================================================

function x_shortcode_custom_headline( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'         => '',
    'class'      => '',
    'style'      => '',
    'type'       => '',
    'level'      => '',
    'looks_like' => '',
    'accent'     => ''
  ), $atts, 'x_custom_headline' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'h-custom-headline ' . esc_attr( $class ) : 'h-custom-headline';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  switch ( $type ) {
    case 'right' :
      $type = ' right-text';
      break;
    case 'center' :
      $type = ' center-text';
      break;
    default :
      $type = '';
  }
  $level      = ( $level      != ''     ) ? $level : 'h2';
  $looks_like = ( $looks_like != ''     ) ? ' ' . $looks_like : '';
  $accent     = ( $accent     == 'true' ) ? ' ' . 'accent' : '';

  $output = "<{$level} {$id} class=\"{$class}{$type}{$looks_like}{$accent}\" {$style}><span>" . do_shortcode( $content ) . "</span></{$level}>";

  return $output;
}

add_shortcode( 'x_custom_headline', 'x_shortcode_custom_headline' );