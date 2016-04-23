<?php

// Feature Headline
// =============================================================================

function x_shortcode_feature_headline( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'         => '',
    'class'      => '',
    'style'      => '',
    'type'       => '',
    'level'      => '',
    'looks_like' => '',
    'icon'       => ''
  ), $atts, 'x_feature_headline' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'h-feature-headline ' . esc_attr( $class ) : 'h-feature-headline';
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
  $level      = ( $level      != '' ) ? $level : 'h2';
  $looks_like = ( $looks_like != '' ) ? ' ' . $looks_like : '';
  $icon       = ( $icon       != '' ) ? $icon : '';

  if ( $icon != '' ) {
    $unicode = fa_unicode( $icon );
    $icon    = '<i class="x-icon-' . $icon . '" data-x-icon="&#x' . $unicode . ';"></i>';
  }

  $output = "<{$level} {$id} class=\"{$class}{$type}{$looks_like}\" {$style}><span>{$icon}" . do_shortcode( $content ) . "</span></{$level}>";

  return $output;
}

add_shortcode( 'x_feature_headline', 'x_shortcode_feature_headline' );