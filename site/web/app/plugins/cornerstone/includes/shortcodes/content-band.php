<?php

// Content Band
// =============================================================================

function x_shortcode_content_band( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'class'              => '',
    'style'              => '',
    'border'             => '',
    'bg_color'           => '',
    'bg_pattern'         => '',
    'bg_image'           => '',
    'bg_video'           => '',
    'bg_video_poster'    => '',
    'no_margin'          => '',
    'padding_top'        => '',
    'padding_bottom'     => '',
    'inner_container'    => '',
    'parallax'           => '',
    'marginless_columns' => ''
  ), $atts, 'x_content_band' ) );

  $class = ( $class != '' ) ? 'x-content-band ' . esc_attr( $class ) : 'x-content-band';
  $style = ( $style != '' ) ? ' ' . $style : '';
  switch ( $border ) {
    case 'top' :
      $border = ' border-top';
      break;
    case 'left' :
      $border = ' border-left';
      break;
    case 'right' :
      $border = ' border-right';
      break;
    case 'bottom' :
      $border = ' border-bottom';
      break;
    case 'vertical' :
      $border = ' border-top border-bottom';
      break;
    case 'horizontal' :
      $border = ' border-left border-right';
      break;
    case 'all' :
      $border = ' border-top border-left border-right border-bottom';
      break;
    default :
      $border = '';
  }
  $bg_color         = ( $bg_color        != ''     ) ? $bg_color : 'transparent';
  $bg_pattern       = ( $bg_pattern      != ''     ) ? $bg_pattern : '';
  $bg_pattern_class = ( $bg_pattern      != ''     ) ? ' bg-pattern' : '';
  $bg_image         = ( $bg_image        != ''     ) ? $bg_image : '';
  $bg_image_class   = ( $bg_image        != ''     ) ? ' bg-image' : '';
  $bg_video         = ( $bg_video        != ''     ) ? $bg_video : '';
  $bg_video_poster  = ( $bg_video_poster != ''     ) ? $bg_video_poster : '';
  $bg_video_class   = ( $bg_video        != ''     ) ? ' bg-video' : '';
  $no_margin        = ( $no_margin       == 'true' ) ? ' man' : '';
  $padding_top      = ( $padding_top     != ''     ) ? ' padding-top: ' . $padding_top . ';' : '';
  $padding_bottom   = ( $padding_bottom  != ''     ) ? ' padding-bottom: ' . $padding_bottom . ';' : '';
  switch ( $inner_container ) {
    case 'true' :
      $container_start = '<div class="x-container max width">';
      $container_end   = '</div>';
      break;
    default :
      $container_start = '<div class="x-container">';
      $container_end   = '</div>';
  }
  $parallax                 = ( $parallax           == 'true' ) ? $parallax : '';
  $parallax_class           = ( $parallax           == 'true' ) ? ' parallax' : '';
  $marginless_columns       = ( $marginless_columns == 'true' ) ? $marginless_columns : '';
  $marginless_columns_class = ( $marginless_columns == 'true' ) ? ' marginless-columns' : '';

  if ( is_numeric( $bg_video_poster ) ) {
    $bg_video_poster_info = wp_get_attachment_image_src( $bg_video_poster, 'full' );
    $bg_video_poster      = $bg_video_poster_info[0];
  }

  if ( is_numeric( $bg_image ) ) {
    $bg_image_info = wp_get_attachment_image_src( $bg_image, 'full' );
    $bg_image      = $bg_image_info[0];
  }

  if ( is_numeric( $bg_pattern ) ) {
    $bg_pattern_info = wp_get_attachment_image_src( $bg_pattern, 'full' );
    $bg_pattern      = $bg_pattern_info[0];
  }

  static $count = 0; $count++;

  if ( $bg_video != '' ) {

    $js_params = array(
      'type' => 'video'
    );

    $data = cs_generate_data_attributes( 'content_band', $js_params );

    $output = "<div id=\"x-content-band-{$count}\" class=\"{$class}{$bg_video_class}{$marginless_columns_class}{$border}{$no_margin}\" {$data} style=\"{$padding_top}{$padding_bottom}{$style}\">"
              . cs_bg_video( $bg_video, $bg_video_poster )
              . $container_start . do_shortcode( $content ) . $container_end
            . '</div>';

  } elseif ( $bg_image != '' ) {

    $js_params = array(
      'type'     => 'image',
      'parallax' => ( $parallax == 'true' )
    );

    $data = cs_generate_data_attributes( 'content_band', $js_params );

    $output = "<div id=\"x-content-band-{$count}\" class=\"{$class}{$bg_image_class}{$parallax_class}{$marginless_columns_class}{$border}{$no_margin}\" {$data} style=\"background-image: url({$bg_image}); background-color: {$bg_color};{$padding_top}{$padding_bottom}{$style}\">"
              . $container_start . do_shortcode( $content ) . $container_end
            . '</div>';

  } elseif ( $bg_pattern != '' ) {

    $js_params = array(
      'type'     => 'pattern',
      'parallax' => ( $parallax == 'true' )
    );

    $data = cs_generate_data_attributes( 'content_band', $js_params );

    $output = "<div id=\"x-content-band-{$count}\" class=\"{$class}{$bg_pattern_class}{$parallax_class}{$marginless_columns_class}{$border}{$no_margin}\" style=\"background-image: url({$bg_pattern}); background-color: {$bg_color};{$padding_top}{$padding_bottom}{$style}\">"
              . $container_start . do_shortcode( $content ) . $container_end
            . '</div>';

  } else {

    $output = "<div id=\"x-content-band-{$count}\" class=\"{$class}{$marginless_columns_class}{$border}{$no_margin}\" style=\"background-color: {$bg_color};{$padding_top}{$padding_bottom}{$style}\">"
              . $container_start . do_shortcode( $content ) . $container_end
            . '</div>';

  }

  return $output;
}

add_shortcode( 'x_content_band', 'x_shortcode_content_band' );