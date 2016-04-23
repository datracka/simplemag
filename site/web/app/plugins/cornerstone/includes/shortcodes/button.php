<?php

// Button
// =============================================================================

function x_shortcode_button( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'               => '',
    'class'            => '',
    'style'            => '',
    'type'             => '',
    'shape'            => '',
    'size'             => '',
    'float'            => '',
    'block'            => '',
    'circle'           => '',
    'icon_only'        => '',
    'href'             => '',
    'title'            => '',
    'target'           => '',
    'info'             => '',
    'info_place'       => '',
    'info_trigger'     => '',
    'info_content'     => '',
    'lightbox_thumb'   => '',
    'lightbox_video'   => '',
    'lightbox_caption' => ''
  ), $atts, 'x_button' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? ' ' . esc_attr( $class ) : '';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $type  = ( $type  != '' ) ? ' x-btn-' . $type : '';
  $shape = ( $shape != '' ) ? ' x-btn-' . $shape : '';
  $size  = ( $size  != '' ) ? ' x-btn-' . $size : '';
  switch ( $float ) {
    case 'left' :
      $float = ' alignleft';
      break;
    case 'right' :
      $float = ' alignright';
      break;
    default :
      $float = '';
  }
  $block            = ( $block            == 'true'  ) ? ' x-btn-block' : '';
  $icon_only        = ( $icon_only        == 'true'  ) ? ' x-btn-icon-only' : '';
  $href             = ( $href             != ''      ) ? $href : '#';
  $title            = ( $title            != ''      ) ? 'title="' . $title . '"' : '';
  $target           = ( $target           == 'blank' ) ? 'target="_blank"' : '';
  $lightbox_thumb   = ( $lightbox_thumb   != ''      ) ? $lightbox_thumb : '';
  $lightbox_video   = ( $lightbox_video   == 'true'  ) ? ', width: 1080, height: 608' : '';
  $lightbox_caption = ( $lightbox_caption != ''      ) ? 'data-caption="' . $lightbox_caption . '"' : '';

  $tooltip_attr = ( $info != '' ) ? cs_generate_data_attributes_extra( $info, $info_trigger, $info_place, '', $info_content ) : '';

  if ( is_numeric( $lightbox_thumb ) ) {
    $lightbox_thumb_info = wp_get_attachment_image_src( $lightbox_thumb, 'full' );
    $lightbox_thumb      = $lightbox_thumb_info[0];
  }

  if ( $lightbox_video != '' ) {
    $lightbox_options = "data-options=\"thumbnail: '" . $lightbox_thumb . "'{$lightbox_video}\"";
  } else {
    $lightbox_options = "data-options=\"thumbnail: '" . $lightbox_thumb . "'\"";
  }

  if ( $circle == 'true' ) {
    $output = "<div {$id} class=\"x-btn-circle-wrap{$size}{$block}{$float}\" {$style}><a class=\"x-btn{$class}{$type}{$shape}{$size}{$block}{$icon_only}\" href=\"{$href}\" {$title} {$target} {$tooltip_attr} {$lightbox_caption} {$lightbox_options}>" . do_shortcode( $content ) . "</a></div>";
  } else {
    $output = "<a {$id} class=\"x-btn{$class}{$type}{$shape}{$size}{$block}{$float}{$icon_only}\" {$style} href=\"{$href}\" {$title} {$target} {$tooltip_attr} {$lightbox_caption} {$lightbox_options}>" . do_shortcode( $content ) . "</a>";
  }

  return $output;
}

add_shortcode( 'x_button', 'x_shortcode_button' );