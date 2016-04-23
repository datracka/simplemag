<?php

// Video Embed
// =============================================================================

function x_shortcode_video_embed( $atts, $content = null  ) {
  extract( shortcode_atts( array(
    'id'           => '',
    'class'        => '',
    'style'        => '',
    'type'         => '',
    'no_container' => ''
  ), $atts, 'x_video_embed' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-video embed ' . esc_attr( $class ) : 'x-video embed';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  switch ( $type ) {
    case '5:3' :
      $type = ' five-by-three';
      break;
    case '5:4' :
      $type = ' five-by-four';
      break;
    case '4:3' :
      $type = ' four-by-three';
      break;
    case '3:2' :
      $type = ' three-by-two';
      break;
    default :
      $type = '';
  }
  $no_container = ( $no_container == 'true' ) ? '' : ' with-container';

  static $count = 0; $count++;

  $output = "<div {$id} class=\"{$class}{$no_container}\" {$style}><div class=\"x-video-inner{$type}\">{$content}</div></div>";

  return $output;
}

add_shortcode( 'x_video_embed', 'x_shortcode_video_embed' );