<?php

// Row
// =============================================================================

function x_shortcode_row( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'                 => '',
    'class'              => '',
    'style'              => '',
    'inner_container'    => '',
    'marginless_columns' => '',
    'bg_color'           => ''
  ), $atts, 'x_row' ) );

  $id                 = ( $id                 != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class              = ( $class              != ''     ) ? 'x-container ' . esc_attr( $class ) : 'x-container';
  $style              = ( $style              != ''     ) ? $style : '';
  $inner_container    = ( $inner_container    == 'true' ) ? ' max width' : '';
  $marginless_columns = ( $marginless_columns == 'true' ) ? ' marginless-columns' : '';
  $bg_color           = ( $bg_color           != ''     ) ? ' background-color:' . $bg_color . ';' : '';

  $output = "<div {$id} class=\"{$class}{$inner_container}{$marginless_columns}\" style=\"{$style}{$bg_color}\">"
            . do_shortcode( $content )
          . '</div>';

  return $output;
}

add_shortcode( 'cs_row', 'x_shortcode_row' );
add_shortcode( 'x_row', 'x_shortcode_row' );