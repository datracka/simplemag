<?php

// Creative CTA
// =============================================================================

function x_shortcode_creative_cta( $atts ) { // 1
  extract( shortcode_atts( array(
    'id'             => '',
    'class'          => '',
    'style'          => '',
    'padding'        => '',
    'text'           => '',
    'font_size'      => '',
    'icon'           => '',
    'icon_size'      => '',
    'image'          => '',
    'image_width'    => '',
    'animation'      => '',
    'link'           => '',
    'color'          => '',
    'bg_color'       => '',
    'bg_color_hover' => ''

  ), $atts, 'x_creative_cta' ) );

  $id             = ( $id             != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class          = ( $class          != '' ) ? 'x-creative-cta ' . esc_attr( $class ) : 'x-creative-cta';
  $style          = ( $style          != '' ) ? ' ' . $style : '';
  $padding        = ( $padding        != '' ) ? $padding : '35px';
  $text           = ( $text           != '' ) ? wp_specialchars_decode( $text ) : 'Place Your<br>Text Here';
  $font_size      = ( $font_size      != '' ) ? $font_size : '36px';
  $icon           = ( $icon           != '' ) ? $icon : '';
  $icon_size      = ( $icon_size      != '' ) ? $icon_size : '36px';
  $image          = ( $image          != '' ) ? $image : '';
  $image_width    = ( $image_width    != '' ) ? $image_width : '';
  $animation      = ( $animation      != '' ) ? ' ' . $animation : '';
  $link           = ( $link           != '' ) ? $link : '#';
  $color          = ( $color          != '' ) ? $color : '#ffffff';
  $bg_color       = ( $bg_color       != '' ) ? $bg_color : '#ff2a13';
  $bg_color_hover = ( $bg_color_hover != '' ) ? $bg_color_hover : '#d80f0f';

  if ( $animation != '' ) {
    if ( $image != '' ) {
      $graphic = '<span class="graphic"><img style="margin: 0; width: ' . $image_width . ';" src="' . $image . '"></span>';
    } else if ( $icon != '' ) {
      $graphic = '<span class="graphic"><i style="margin: 0; font-size: ' . $icon_size . ';" class="x-icon-' . $icon . '" data-x-icon="&#x' . fa_unicode( $icon ) . ';"></i></span>';
    }
  } else {
    $graphic = '';
  }

  $js_params = array(
    'animation'      => $animation,
    'bg_color'       => $bg_color,
    'bg_color_hover' => $bg_color_hover
  );

  $data = cs_generate_data_attributes( 'creative_cta', $js_params );

  $output = "<a {$id} class=\"{$class}{$animation}\" href=\"{$link}\" style=\"padding: {$padding}; color: {$color}; background-color: {$bg_color};{$style}\" {$data}>"
            . "<span class=\"text\" style=\"font-size: {$font_size};\">{$text}</span>"
            . $graphic
          . "</a>";

  return $output;
}

add_shortcode( 'x_creative_cta', 'x_shortcode_creative_cta' );