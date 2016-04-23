<?php

// Section
// =============================================================================

function x_shortcode_section( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'                 => '',
    'class'              => '',
    'style'              => '',
    'bg_color'           => '',
    'bg_pattern'         => '',
    'bg_image'           => '',
    'bg_video'           => '',
    'bg_video_poster'    => '',
    'parallax'           => ''
  ), $atts, 'x_section' ) );

  static $count = 0; $count++;

  $id               = ( $id              != ''     ) ? $id : 'x-section-' . $count;
  $class            = ( $class           != ''     ) ? 'x-section ' . esc_attr( $class ) : 'x-section';
  $style            = ( $style           != ''     ) ? ' ' . $style : '';
  $bg_color         = ( $bg_color        != ''     ) ? $bg_color : 'transparent';
  $bg_pattern       = ( $bg_pattern      != ''     ) ? $bg_pattern : '';
  $bg_image         = ( $bg_image        != ''     ) ? $bg_image : '';
  $bg_video         = ( $bg_video        != ''     ) ? $bg_video : '';
  $bg_video_poster  = ( $bg_video_poster != ''     ) ? $bg_video_poster : '';
  $parallax         = ( $parallax        == 'true' ) ? $parallax : '';
  $parallax_class   = ( $parallax        == 'true' ) ? ' parallax' : '';

  if ( $bg_video != '' ) {

    $data     = cs_generate_data_attributes( 'section', array( 'type' => 'video' ) );
    $before   = cs_bg_video( $bg_video, $bg_video_poster );
    $bg_style = 'background-color: ' . $bg_color . ';';
    $bg_class = ' bg-video';

  } elseif ( $bg_image != '' ) {

    $data     = cs_generate_data_attributes( 'section', array( 'type' => 'image', 'parallax' => ( $parallax == 'true' ) ) );
    $before   = '';
    $bg_style = 'background-image: url(' . $bg_image . '); background-color: ' . $bg_color . ';';
    $bg_class = ' bg-image' . $parallax_class;

  } elseif ( $bg_pattern != '' ) {

    $data     = cs_generate_data_attributes( 'section', array( 'type' => 'pattern', 'parallax' => ( $parallax == 'true' ) ) );
    $before   = '';
    $bg_style = 'background-image: url(' . $bg_pattern . '); background-color: ' . $bg_color . ';';
    $bg_class = ' bg-pattern' . $parallax_class;

  } else {

    $data     = '';
    $before   = '';
    $bg_style = 'background-color: ' . $bg_color . ';';
    $bg_class = '';

  }

  $output = "<div id=\"{$id}\" class=\"{$class}{$bg_class}\" style=\"{$style}{$bg_style}\" {$data}>"
            . $before
            . do_shortcode( $content )
          . '</div>';

  return $output;
}

add_shortcode( 'cs_section', 'x_shortcode_section' );
add_shortcode( 'x_section', 'x_shortcode_section' );