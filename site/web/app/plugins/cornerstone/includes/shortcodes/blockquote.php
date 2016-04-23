<?php

// Blockquote
// =============================================================================

function x_shortcode_blockquote( $atts, $content = null ) { // 1
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'cite'  => '',
    'type'  => ''
  ), $atts, 'x_blockquote' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-blockquote ' . esc_attr( $class ) : 'x-blockquote';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $cite  = ( $cite  != '' ) ? '<cite class="x-cite">' . $cite . '</cite>' : '';
  switch ( $type ) {
    case 'right' :
      $type = ' right-text';
      break;
    case 'center' :
      $type = ' center-text';
      break;
    default :
      $type = '';
  }

  $output = "<blockquote {$id} class=\"{$class}{$type}\" {$style}>" . do_shortcode( $content ) . $cite . "</blockquote>";

  return $output;
}

add_shortcode( 'x_blockquote', 'x_shortcode_blockquote' );