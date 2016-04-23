<?php

// Responsive Text
// =============================================================================

function x_shortcode_responsive_text( $atts ) {

  extract( shortcode_atts( array(
    'selector'    => '',
    'compression' => '1.2',
    'min_size'    => '',
    'max_size'    => ''
  ), $atts, 'x_responsive_text' ) );

  $js_params = array(
    'selector'    => ( $selector    != '' ) ? $selector : '',
    'compression' => ( $compression != '' ) ? $compression : '1.2',
    'minFontSize' => ( $min_size    != '' ) ? $min_size : '',
    'maxFontSize' => ( $max_size    != '' ) ? $max_size : ''
  );

  static $count = 0; $count++;

  $data = cs_generate_data_attributes( 'responsive_text', $js_params );

  $output = "<span id=\"x-responsive-text-{$count}\" {$data}></span>";

  return $output;
}

add_shortcode( 'x_responsive_text', 'x_shortcode_responsive_text' );
add_shortcode( 'cs_responsive_text', 'x_shortcode_responsive_text' );