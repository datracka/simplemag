<?php

// Audio Player
// =============================================================================

function x_shortcode_audio_player( $atts ) {
  extract( shortcode_atts( array(
    'id'                => '',
    'class'             => '',
    'style'             => '',
    'src'               => '',
    'advanced_controls' => '',
    'preload'           => '',
    'autoplay'          => '',
    'loop'              => '',
    'mp3'               => '',
    'oga'               => ''
  ), $atts, 'x_audio_player' ) );

  $id                 = ( $id                != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class              = ( $class             != ''     ) ? 'x-audio player ' . esc_attr( $class ) : 'x-audio player';
  $style              = ( $style             != ''     ) ? 'style="' . $style . '"' : '';
  $src                = ( $src               != ''     ) ? explode( '|', $src ) : array();
  $advanced_controls  = ( $advanced_controls == 'true' ) ? ' advanced-controls' : '';
  $preload            = ( $preload           != ''     ) ? ' preload="' . $preload . '"' : ' preload="metadata"';
  $autoplay           = ( $autoplay          == 'true' ) ? ' autoplay' : '';
  $loop               = ( $loop              == 'true' ) ? ' loop' : '';


  //
  // Deprecated parameters.
  //

  $mp3 = ( $mp3 != '' ) ? '<source src="' . $mp3 . '" type="audio/mpeg">' : '';
  $oga = ( $oga != '' ) ? '<source src="' . $oga . '" type="audio/ogg">' : '';


  //
  // Variable markup.
  //

  $data = cs_generate_data_attributes( 'x_mejs' );


  //
  // Enqueue scripts.
  //

  wp_enqueue_script( 'mediaelement' );


  //
  // Build sources.
  //

  $sources = array();

  foreach( $src as $file ) {
    $mime      = wp_check_filetype( $file, wp_get_mime_types() );
    $sources[] = '<source src="' . esc_url( $file ) . '" type="' . $mime['type'] . '">';
  }

  if ( $mp3 != '' ) {
    $sources[] = $mp3;
  }

  if ( $oga != '' ) {
    $sources[] = $oga;
  }


  //
  // Markup.
  //

  $output = "<div {$id} class=\"{$class}{$autoplay}{$loop}\" {$data} {$style}>"
            . "<audio class=\"x-mejs{$advanced_controls}\"{$preload}{$autoplay}{$loop}>"
              . implode( '', $sources )
            . '</audio>'
          . '</div>';

  return $output;
}

add_shortcode( 'x_audio_player', 'x_shortcode_audio_player' );