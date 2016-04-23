<?php

// Card
// =============================================================================

function x_shortcode_card( $atts ) {
  extract( shortcode_atts( array(
    'id'                   => '',
    'class'                => '',
    'style'                => '',
    'animation'            => '',
    'center_vertically'    => '',
    'front_style'          => '',
    'front_icon'           => '',
    'front_icon_size'      => '',
    'front_icon_color'     => '',
    'front_image'          => '',
    'front_image_width'    => '',
    'front_title'          => '',
    'front_text'           => '',
    'back_style'           => '',
    'back_title'           => '',
    'back_text'            => '',
    'back_button_text'     => '',
    'back_button_link'     => '',
    'back_button_color'    => '',
    'back_button_bg_color' => '',
    'padding'              => ''
  ), $atts, 'x_card' ) );

  $id                   = ( $id                   != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class                = ( $class                != ''     ) ? 'x-card-outer ' . esc_attr( $class ) : 'x-card-outer';
  $style                = ( $style                != ''     ) ? 'style="' . $style . '"' : '';
  $animation            = ( $animation            != ''     ) ? ' ' . $animation : ' flip-from-left';
  $center_vertically    = ( $center_vertically    == 'true' ) ? ' center-vertically' : '';
  $front_style          = ( $front_style          != ''     ) ? $front_style : 'border: 1px solid #ddd; color: #272727; background-color: #fafafa;';
  $front_icon           = ( $front_icon           != ''     ) ? $front_icon : '';
  $front_icon_size      = ( $front_icon_size      != ''     ) ? $front_icon_size : '36px';
  $front_icon_color     = ( $front_icon_color     != ''     ) ? $front_icon_color : '#272727';
  $front_image          = ( $front_image          != ''     ) ? $front_image : '';
  $front_image_width    = ( $front_image_width    != ''     ) ? $front_image_width : 'auto';
  $front_title          = ( $front_title          != ''     ) ? wp_specialchars_decode( $front_title ) : 'Front Title';
  $front_text           = ( $front_text           != ''     ) ? wp_specialchars_decode( $front_text ) : 'This is where the text for the front of your card should go. It\'s best to keep it short and sweet.';
  $back_style           = ( $back_style           != ''     ) ? $back_style : 'border: 1px solid #ddd; color: #272727; background-color: #fafafa;';
  $back_title           = ( $back_title           != ''     ) ? wp_specialchars_decode( $back_title ) : 'Back Title';
  $back_text            = ( $back_text            != ''     ) ? wp_specialchars_decode( $back_text ) : 'This is where the text for the back of your card should go.';
  $back_button_text     = ( $back_button_text     != ''     ) ? $back_button_text : 'Click Me!';
  $back_button_link     = ( $back_button_link     != ''     ) ? $back_button_link : '#';
  $back_button_color    = ( $back_button_color    != ''     ) ? $back_button_color : '#ffffff';
  $back_button_bg_color = ( $back_button_bg_color != ''     ) ? $back_button_bg_color : '#ff2a13';
  $padding              = ( $padding              != ''     ) ? $padding : '35px';

  if ( $front_image != '' ) {
    $front_graphic = '<div class="x-face-graphic"><img style="margin: 0; width: ' . $front_image_width . ';" src="' . $front_image . '"></div>';
  } else if ( $front_icon != '' ) {
    $front_graphic = '<div class="x-face-graphic"><i style="margin: 0; font-size: ' . $front_icon_size . '; color: ' . $front_icon_color . ';" class="x-icon-' . $front_icon . '" data-x-icon="&#x' . fa_unicode( $front_icon ) . ';"></i></div>';
  } else {
    $front_graphic = '';
  }

  $data = cs_generate_data_attributes( 'card', array() );

  $output = "<div {$id} class=\"{$class}{$animation}{$center_vertically}\" {$data}{$style}>"
            . '<div class="x-card-inner">'
              . "<div class=\"x-face-outer front\" style=\"{$front_style}\">"
                . '<div class="x-face-inner">'
                  . "<div class=\"x-face-content\" style=\"padding: {$padding};\">"
                    . $front_graphic
                    . "<h4 class=\"x-face-title\">{$front_title}</h4>"
                    . "<p class=\"x-face-text\">{$front_text}</p>"
                  . '</div>'
                . '</div>'
              . '</div>'
              . "<div class=\"x-face-outer back\" style=\"{$back_style}\">"
                . '<div class="x-face-inner">'
                  . "<div class=\"x-face-content\" style=\"padding: {$padding};\">"
                    . "<h4 class=\"x-face-title\">{$back_title}</h4>"
                    . "<p class=\"x-face-text\">{$back_text}</p>"
                    . "<a class=\"x-face-button\" style=\"color: {$back_button_color}; background-color: {$back_button_bg_color};\" href=\"{$back_button_link}\">{$back_button_text}</a>"
                  . '</div>'
                . '</div>'
              . '</div>'
            . '</div>'
          . '</div>';

  return $output;
}

add_shortcode( 'x_card', 'x_shortcode_card' );