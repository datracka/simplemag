<?php

// Alert
// =============================================================================

function x_shortcode_alert( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'      => '',
    'class'   => '',
    'style'   => '',
    'type'    => '',
    'heading' => '',
    'close'   => ''
  ), $atts, 'x_alert' ) );

  $id      = ( $id      != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class   = ( $class   != '' ) ? 'x-alert ' . esc_attr( $class ) : 'x-alert';
  $style   = ( $style   != '' ) ? 'style="' . $style . '"' : '';
  $type    = ( $type    != '' ) ? ' x-alert-' . $type : '';
  $heading = ( $heading != '' ) ? $heading = '<h6 class="h-alert">' . $heading . '</h6>' : $heading = '';
  if ( $close == 'true' ) {
    $close = ' fade in';
    $close_btn = '<button type="button" class="close" data-dismiss="alert">&times;</button>';
  } else {
    $close = ' x-alert-block';
    $close_btn = '';
  }

  $output = "<div {$id} class=\"{$class}{$type}{$close}\" {$style}>{$close_btn}{$heading}" . do_shortcode( $content ) . "</div>";

  return $output;
}

//add_shortcode( 'x_alert', 'x_shortcode_alert' );