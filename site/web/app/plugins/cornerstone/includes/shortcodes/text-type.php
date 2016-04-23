<?php

// Text Type
// =============================================================================

function x_shortcode_text_type( $atts ) {
  extract( shortcode_atts( array(
    'id'          => '',
    'class'       => '',
    'style'       => '',
    'prefix'      => '',
    'strings'     => '',
    'suffix'      => '',
    'type_speed'  => '',
    'start_delay' => '',
    'back_speed'  => '',
    'back_delay'  => '',
    'loop'        => '',
    'show_cursor' => '',
    'cursor'      => '',
    'tag'         => '',
    'looks_like'  => ''

  ), $atts, 'x_text_type' ) );

  $id         = ( $id         != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class      = ( $class      != '' ) ? 'x-text-type ' . esc_attr( $class ) : 'x-text-type';
  $style      = ( $style      != '' ) ? 'style="' . $style . '"' : '';
  $prefix     = ( $prefix     != '' ) ? '<span class="prefix">' . $prefix . '</span>' : '';
  $suffix     = ( $suffix     != '' ) ? '<span class="suffix">' . $suffix . '</span>' : '';
  $tag        = ( $tag        != '' ) ? $tag : 'span';
  $looks_like = ( $looks_like != '' ) ? ' ' . $looks_like : '';

  $js_params = array(
    'strings'     => ( $strings     != ''     ) ? explode( '|', $strings ) : '',
    'type_speed'  => ( $type_speed  != ''     ) ? intval( $type_speed ) : 50,
    'start_delay' => ( $start_delay != ''     ) ? intval( $start_delay ) : 0,
    'back_speed'  => ( $back_speed  != ''     ) ? intval( $back_speed ) : 50,
    'back_delay'  => ( $back_delay  != ''     ) ? intval( $back_delay ) : 1000,
    'loop'        => ( $loop        == 'true' ),
    'show_cursor' => ( $show_cursor == 'true' ),
    'cursor'      => ( $cursor      != ''     ) ? $cursor : '|',
  );

  $data = cs_generate_data_attributes( 'text_type', $js_params );

  $output = "<{$tag} {$id} class=\"{$class}{$looks_like}\" {$style} {$data}>"
            . $prefix
            . '<span class="text"></span>'
            . $suffix
          . "</{$tag}>";

  return $output;
}

add_shortcode( 'x_text_type', 'x_shortcode_text_type' );