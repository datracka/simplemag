<?php

// Counter
// =============================================================================

function x_shortcode_counter( $atts ) {
  extract( shortcode_atts( array(
    'id'         => '',
    'class'      => '',
    'style'      => '',
    'num_color'  => '',
    'num_start'  => '',
    'num_end'    => '',
    'num_speed'  => '',
    'num_prefix' => '',
    'num_suffix' => '',
    'text_color' => '',
    'text_above' => '',
    'text_below' => ''
  ), $atts, 'x_counter' ) );

  $id         = ( $id         != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class      = ( $class      != '' ) ? 'x-counter ' . esc_attr( $class ) : 'x-counter';
  $style      = ( $style      != '' ) ? 'style="' . $style . '"' : '';
  $num_color  = ( $num_color  != '' ) ? 'style="color: ' . $num_color . ';"' : '';
  $num_start  = ( $num_start  != '' ) ? $num_start : 0;
  $num_end    = ( $num_end    != '' ) ? $num_end : 0;
  $num_speed  = ( $num_speed  != '' ) ? $num_speed : 1500;
  $num_prefix = ( $num_prefix != '' ) ? '<span class="prefix">' . $num_prefix . '</span>' : '';
  $num_suffix = ( $num_suffix != '' ) ? '<span class="suffix">' . $num_suffix . '</span>' : '';
  $text_color = ( $text_color != '' ) ? 'style="color: ' . $text_color . ';"' : '';
  $text_above = ( $text_above != '' ) ? '<span class="text-above" ' . $text_color . '>' . $text_above . '</span>' : '';
  $text_below = ( $text_below != '' ) ? '<span class="text-below" ' . $text_color . '>' . $text_below . '</span>' : '';

  $js_params = array(
    'numEnd'   => floatval($num_end),
    'numSpeed' => floatval($num_speed)
  );

  if ( floatval($num_start) > 0 ) {
    $js_params['numStart'] = floatval($num_start);
  }

  $data = cs_generate_data_attributes( 'counter', $js_params );

  $output = "<div {$id} class=\"{$class}\" {$data} {$style}>"
            . $text_above
            . "<div class=\"number-wrap w-h\" {$num_color}>"
              . $num_prefix
              . "<span class=\"number\">{$num_start}</span>"
              . $num_suffix
            . '</div>'
            . $text_below
          . '</div>';

  return $output;
}

add_shortcode( 'x_counter', 'x_shortcode_counter' );