<?php

// Promo
// =============================================================================

function x_shortcode_promo( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'image' => '',
    'alt'   => ''
  ), $atts, 'x_promo' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-promo ' . esc_attr( $class ) : 'x-promo';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $image = ( $image != '' ) ? $image : '';
  $alt   = ( $alt   != '' ) ? 'alt="' . $alt . '"' : '';

  if ( is_numeric( $image ) ) {
    $image_info = wp_get_attachment_image_src( $image, 'full' );
    $image      = $image_info[0];
  }

  $output = "<div {$id} class=\"{$class}\" {$style}>"
            . '<div class="x-promo-image-wrap">'
              . "<img src=\"{$image}\" {$alt}/>"
            . '</div>'
            . '<div class="x-promo-content">'
              . do_shortcode( $content )
            . '</div>'
          . "</div>";

  return $output;
}

add_shortcode( 'x_promo', 'x_shortcode_promo' );