<?php

// Image
// =============================================================================

function x_shortcode_image( $atts ) {
  extract( shortcode_atts( array(
    'id'               => '',
    'class'            => '',
    'style'            => '',
    'type'             => '',
    'float'            => '',
    'src'              => '',
    'alt'              => '',
    'link'             => '',
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
  ), $atts, 'x_image' ) );

  $id               = ( $id               != ''      ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class            = ( $class            != ''      ) ? 'x-img ' . esc_attr( $class ) : 'x-img';
  $style            = ( $style            != ''      ) ? 'style="' . $style . '"' : '';
  $type             = ( $type             != ''      ) ? ' x-img-' . $type : '';
  $float            = ( $float            != ''      ) ? ' ' . $float : '';
  $src              = ( $src              != ''      ) ? $src : '';
  $alt              = ( $alt              != ''      ) ? 'alt="' . $alt . '"' : '';
  $link             = ( $link             == 'true'  ) ? 'true' : '';
  $link_class       = ( $link             == 'true'  ) ? ' x-img-link' : '';
  $href             = ( $href             != ''      ) ? $href : $src;
  $title            = ( $title            != ''      ) ? 'title="' . $title . '"' : '';
  $target           = ( $target           == 'blank' ) ? 'target="_blank"' : '';
  $lightbox_thumb   = ( $lightbox_thumb   != ''      ) ? $lightbox_thumb : $src;
  $lightbox_video   = ( $lightbox_video   == 'true'  ) ? ', width: 1080, height: 608' : '';
  $lightbox_caption = ( $lightbox_caption != ''      ) ? 'data-caption="' . $lightbox_caption . '"' : '';

  $tooltip_attr = ( $info != '' ) ? cs_generate_data_attributes_extra( $info, $info_trigger, $info_place, '', $info_content ) : '';

  if ( is_numeric( $src ) ) {
    $src_info = wp_get_attachment_image_src( $src, 'full' );
    $src      = $src_info[0];
  }

  if ( is_numeric( $href ) ) {
    $href_info = wp_get_attachment_image_src( $href, 'full' );
    $href      = $href_info[0];
  }

  if ( is_numeric( $lightbox_thumb ) ) {
    $lightbox_thumb_info = wp_get_attachment_image_src( $lightbox_thumb, 'full' );
    $lightbox_thumb      = $lightbox_thumb_info[0];
  }

  if ( $lightbox_video != '' ) {
    $lightbox_options = "data-options=\"thumbnail: '" . $lightbox_thumb . "'{$lightbox_video}\"";
  } else {
    $lightbox_options = "data-options=\"thumbnail: '" . $lightbox_thumb . "'\"";
  }

  if ( $link == 'true' ) {
    $output = "<a {$id} class=\"{$class}{$link_class}{$type}{$float}\" {$style} href=\"{$href}\" {$title} {$target} {$tooltip_attr} {$lightbox_caption} {$lightbox_options}><img src=\"{$src}\" {$alt}></a>";
  } else {
    $output = "<img {$id} class=\"{$class}{$type}{$float}\" {$style} src=\"{$src}\" {$alt}>";
  }

  return $output;
}

add_shortcode( 'x_image', 'x_shortcode_image' );