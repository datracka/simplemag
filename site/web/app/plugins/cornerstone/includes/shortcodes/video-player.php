<?php

// Video Player
// =============================================================================

function x_shortcode_video_player( $atts ) {
  extract( shortcode_atts( array(
    'id'                => '',
    'class'             => '',
    'style'             => '',
    'type'              => '',
    'src'               => '',
    'poster'            => '',
    'preload'           => '',
    'advanced_controls' => '',
    'hide_controls'     => '',
    'autoplay'          => '',
    'loop'              => '',
    'muted'             => '',
    'no_container'      => '',
    'm4v'               => '',
    'ogv'               => ''
  ), $atts, 'x_video_player' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-video player ' . esc_attr( $class ) : 'x-video player';
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
  $src               = ( $src               != ''     ) ? explode( '|', $src ) : array();
  $poster            = ( $poster            != ''     ) ? $poster : '';
  $preload           = ( $preload           != ''     ) ? ' preload="' . $preload . '"' : ' preload="metadata"';
  $advanced_controls = ( $advanced_controls == 'true' ) ? ' advanced-controls' : '';
  $hide_controls     = ( $hide_controls     == 'true' ) ? ' hide-controls' : '';
  $autoplay          = ( $autoplay          == 'true' ) ? ' autoplay' : '';
  $loop              = ( $loop              == 'true' ) ? ' loop' : '';
  $muted             = ( $muted             == 'true' ) ? ' muted' : '';
  $no_container      = ( $no_container      == 'true' ) ? '' : ' with-container';


  //
  // Deprecated parameters.
  //

  $m4v = ( $m4v != '' ) ? '<source src="' . $m4v . '" type="video/mp4">' : '';
  $ogv = ( $ogv != '' ) ? '<source src="' . $ogv . '" type="video/ogg">' : '';


  //
  // Variable markup.
  //

  if ( is_numeric( $poster ) ) {
    $poster_info = wp_get_attachment_image_src( $poster, 'full' );
    $poster      = $poster_info[0];
  }

  $is_bg             = ( strpos( $class, 'bg' ) !== false ) ? true : false;
  $bg_template_start = ( $is_bg ) ? '<script type="text/template">' : '';
  $bg_template_end   = ( $is_bg ) ? '</script>' : '';
  $poster_attr       = ( $poster != '' ) ? ' poster="' . $poster . '"' : '';
  $data              = cs_generate_data_attributes( 'x_mejs', array( 'poster' => $poster ) );


  //
  // Enqueue scripts.
  //

  wp_enqueue_script( 'mediaelement' );


  //
  // Build sources.
  //

  $sources = array();
  $vimeo   = '';
  $youtube = '';

  foreach( $src as $file ) {

    if ( preg_match( '#webm|mp4|ogv#', $file ) ) {
      $is_vimeo   = false;
      $is_youtube = false;
    } else {
      $is_vimeo   = preg_match( '#^https?://(.+\.)?vimeo\.com/.*#', $file );
      $is_youtube = preg_match( '#^https?://(?:www\.)?(?:youtube\.com/watch|youtu\.be/)#', $file );
    }

    if ( $is_vimeo ) {
      $mime  = array( 'type' => 'video/vimeo' );
      $vimeo = ' vimeo';
      wp_enqueue_script( 'froogaloop' );
    } else if ( $is_youtube ) {
      $mime    = array( 'type' => 'video/youtube' );
      $youtube = ' youtube';
    } else {
      $parts  = parse_url( $file );
      $scheme = isset( $parts['scheme'] ) ? $parts['scheme'] . '://' : '//';
      $host   = isset( $parts['host'] ) ? $parts['host'] : '';
      $path   = isset( $parts['path'] ) ? $parts['path'] : '';
      $clean  = $scheme . $host . $path;
      $mime   = wp_check_filetype( $clean, wp_get_mime_types() );
    }

    $sources[] = '<source src="' . esc_url( $file ) . '" type="' . $mime['type'] . '">';

  }

  if ( $m4v != '' ) {
    $sources[] = $m4v;
  }

  if ( $ogv != '' ) {
    $sources[] = $ogv;
  }


  //
  // Markup.
  //

  $output = "<div {$id} class=\"{$class}{$hide_controls}{$autoplay}{$loop}{$muted}{$no_container}{$vimeo}{$youtube}\" {$data} {$style}>"
            . $bg_template_start
              . "<div class=\"x-video-inner{$type}\">"
                . "<video class=\"x-mejs{$advanced_controls}\"{$poster_attr}{$preload}{$autoplay}{$loop}{$muted}>"
                  . implode( '', $sources )
                . '</video>'
              . '</div>'
            . $bg_template_end
          . '</div>';

  return $output;
}

add_shortcode( 'x_video_player', 'x_shortcode_video_player' );