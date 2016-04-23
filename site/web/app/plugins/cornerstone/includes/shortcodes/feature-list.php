<?php

// Feature List
// =============================================================================

function x_shortcode_feature_list( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'                      => '',
    'class'                   => '',
    'style'                   => '',
    'animation_offset'        => '',
    'animation_delay_initial' => '',
    'animation_delay_between' => ''
  ), $atts, 'x_feature_list' ) );

  $id                      = ( $id                      != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class                   = ( $class                   != '' ) ? 'x-feature-list ' . esc_attr( $class ) : 'x-feature-list';
  $style                   = ( $style                   != '' ) ? 'style="' . $style . '"' : '';
  $animation_offset        = ( $animation_offset        != '' ) ? $animation_offset : '50';
  $animation_delay_initial = ( $animation_delay_initial != '' ) ? $animation_delay_initial : '0';
  $animation_delay_between = ( $animation_delay_between != '' ) ? $animation_delay_between : '300';

  $data = cs_generate_data_attributes( 'feature_list', array(
    'animationOffset'       => $animation_offset,
    'animationDelayInitial' => $animation_delay_initial,
    'animationDelayBetween' => $animation_delay_between
  ) );

  $output = "<ul {$id} class=\"{$class}\" {$style} {$data}>"
            . do_shortcode( $content )
          . '</ul>';

  return $output;
}

add_shortcode( 'x_feature_list', 'x_shortcode_feature_list' );