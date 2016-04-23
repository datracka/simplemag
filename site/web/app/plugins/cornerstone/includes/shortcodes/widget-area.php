<?php

// Widget Area
// =============================================================================

function x_shortcode_widget_area( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'     => '',
    'class'  => '',
    'style'  => '',
    'sidebar'   => '',
  ), $atts, 'x_widget_area' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-widget-area ' . esc_attr( $class ) : 'x-widget-area';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  ob_start();
  dynamic_sidebar( $sidebar );
  $sidebar = ob_get_clean();

  $output = "<div {$id} class=\"{$class}\" {$style}>" . $sidebar . "</div>";

  return $output;
}

add_shortcode( 'x_widget_area', 'x_shortcode_widget_area' );