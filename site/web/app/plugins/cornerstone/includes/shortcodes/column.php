<?php

// Column
// =============================================================================

function x_shortcode_column( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'                    => '',
    'class'                 => '',
    'style'                 => '',
    'type'                  => '',
    'last'                  => '',
    'fade'                  => '',
    'fade_animation'        => '',
    'fade_animation_offset' => '',
    'fade_duration'         => '',
    'bg_color'              => ''
  ), $atts, 'x_column' ) );

  $id                    = ( $id                    != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class                 = ( $class                 != ''     ) ? 'x-column x-sm ' . esc_attr( $class ) : 'x-column x-sm';
  $style                 = ( $style                 != ''     ) ? $style : '';
  $type                  = ( $type                  != ''     ) ? $type : ' x-1-2';
  $last                  = ( $last                  == 'true' ) ? ' last' : '';
  $fade_animation        = ( $fade_animation        != ''     ) ? $fade_animation : 'in';
  $fade_animation_offset = ( $fade_animation_offset != ''     ) ? $fade_animation_offset : '45px';
  $bg_color              = ( $bg_color              != ''     ) ? ' background-color:' . $bg_color . ';' : '';

  switch ( $type ) {
    case '1/1'   :
    case 'whole' :
      $type = ' x-1-1';
      break;
    case '1/2'      :
    case 'one-half' :
      $type = ' x-1-2';
      break;
    case '1/3'       :
    case 'one-third' :
      $type = ' x-1-3';
      break;
    case '2/3'        :
    case 'two-thirds' :
      $type = ' x-2-3';
      break;
    case '1/4'        :
    case 'one-fourth' :
      $type = ' x-1-4';
      break;
    case '3/4'           :
    case 'three-fourths' :
      $type = ' x-3-4';
      break;
    case '1/5'       :
    case 'one-fifth' :
      $type = ' x-1-5';
      break;
    case '2/5'        :
    case 'two-fifths' :
      $type = ' x-2-5';
      break;
    case '3/5'          :
    case 'three-fifths' :
      $type = ' x-3-5';
      break;
    case '4/5'         :
    case 'four-fifths' :
      $type = ' x-4-5';
      break;
    case '1/6'       :
    case 'one-sixth' :
      $type = ' x-1-6';
      break;
    case '5/6'       :
    case 'five-sixths' :
      $type = ' x-5-6';
      break;
    default:
      $type = ' x-1-1';
      break;
  }

  if ( $fade == 'true' ) {
    $fade = 'data-fade="true"';

    $js_params = array(
      'fade'      => true,
      'animation' => $fade_animation
    );

    if ( $fade_duration != '' ) {
      $js_params['duration'] = (int) $fade_duration;
    }

    $data = cs_generate_data_attributes( 'column', $js_params );

    switch ( $fade_animation ) {
      case 'in' :
        $fade_animation_offset = '';
        break;
      case 'in-from-top' :
        $fade_animation_offset = ' top: -' . $fade_animation_offset . ';';
        break;
      case 'in-from-left' :
        $fade_animation_offset = ' left: -' . $fade_animation_offset . ';';
        break;
      case 'in-from-right' :
        $fade_animation_offset = ' right: -' . $fade_animation_offset . ';';
        break;
      case 'in-from-bottom' :
        $fade_animation_offset = ' bottom: -' . $fade_animation_offset . ';';
        break;
    }
  } else {
    $data                  = '';
    $fade                  = '';
    $fade_animation_offset = '';
  }

  $output = "<div {$id} class=\"{$class}{$type}{$last}\" style=\"{$style}{$fade_animation_offset}{$bg_color}\" {$data} {$fade}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'cs_column', 'x_shortcode_column' );
add_shortcode( 'x_column', 'x_shortcode_column' );