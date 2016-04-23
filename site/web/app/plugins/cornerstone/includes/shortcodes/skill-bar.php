<?php

// Skill Bar
// =============================================================================

function x_shortcode_skill_bar( $atts ) {
  extract( shortcode_atts( array(
    'id'           => '',
    'class'        => '',
    'style'        => '',
    'heading'      => '',
    'bar_text'     => '',
    'bar_bg_color' => '',
    'percent'      => ''
  ), $atts, 'x_skill_bar' ) );

  $id           = ( $id           != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class        = ( $class        != '' ) ? 'x-skill-bar ' . esc_attr( $class ) : 'x-skill-bar';
  $style        = ( $style        != '' ) ? ' ' . $style : '';
  $heading      = ( $heading      != '' ) ? '<h6 class="h-skill-bar">' . $heading . '</h6>' : '';
  $bar_text     = ( $bar_text     != '' ) ? $bar_text : '';
  $bar_bg_color = ( $bar_bg_color != '' ) ? ' background-color: ' . $bar_bg_color . ';' : '';

  $js_params = array(
    'percent' => ( $percent != '' ) ? $percent : ''
  );

  $data = cs_generate_data_attributes('skill_bar', $js_params );

  if ( $bar_text != '' ) {
    $bar_text = $bar_text;
  } else {
    $bar_text = $percent;
  }

  $output = "{$heading}<div {$id} class=\"{$class}\" {$data}><div class=\"bar\" style=\"{$style}{$bar_bg_color}\"><div class=\"percent\">{$bar_text}</div></div></div>";

  return $output;
}

add_shortcode( 'x_skill_bar', 'x_shortcode_skill_bar' );