<?php

// Lightbox
// =============================================================================

function x_shortcode_lightbox( $atts ) {
  extract( shortcode_atts( array(
    'selector'     => '',
    'deeplink'     => '',
    'opacity'      => '',
    'prev_scale'   => '',
    'prev_opacity' => '',
    'next_scale'   => '',
    'next_opacity' => '',
    'orientation'  => '',
    'thumbnails'   => ''
  ), $atts, 'x_lightbox' ) );

  static $count = 0; $count++;

  wp_enqueue_script( 'vendor-ilightbox' );

  $js_params = array(
    'selector'    => ( $selector     != ''     ) ? $selector : '.x-img-link',
    'deeplink'    => ( $deeplink     == 'true' ),
    'opacity'     => ( $opacity      != ''     ) ? $opacity : '0.85',
    'prevScale'   => ( $prev_scale   != ''     ) ? $prev_scale : '0.85',
    'prevOpacity' => ( $prev_opacity != ''     ) ? $prev_opacity : '0.65',
    'nextScale'   => ( $next_scale   != ''     ) ? $next_scale : '0.85',
    'nextOpacity' => ( $next_opacity != ''     ) ? $next_opacity : '0.65',
    'orientation' => ( $orientation  != ''     ) ? $orientation : 'horizontal',
    'thumbnails'  => ( $thumbnails   == 'true' )
  );

  $data = cs_generate_data_attributes( 'lightbox', $js_params );

  $output = "<span id=\"x-lightbox-{$count}\" {$data}></span>";

  return $output;
}

add_shortcode( 'x_lightbox', 'x_shortcode_lightbox' );