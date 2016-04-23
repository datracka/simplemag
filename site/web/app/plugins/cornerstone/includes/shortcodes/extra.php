<?php

// Popovers and Tooltips
// =============================================================================

function x_shortcode_extra( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'           => '',
    'class'        => '',
    'style'        => '',
    'href'         => '',
    'title'        => '',
    'target'       => '',
    'info'         => '',
    'info_place'   => '',
    'info_trigger' => '',
    'info_content' => ''
  ), $atts, 'x_extra' ) );

  $id     = ( $id     != ''      ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class  = ( $class  != ''      ) ? 'x-extra ' . esc_attr( $class ) : 'x-extra';
  $style  = ( $style  != ''      ) ? 'style="' . $style . '"' : '';
  $href   = ( $href   != ''      ) ? $href : '#';
  $title  = ( $title  != ''      ) ? 'title="' . $title . '"' : '';
  $target = ( $target == 'blank' ) ? 'target="_blank"' : '';

  $data = cs_generate_data_attributes_extra( $info, $info_trigger, $info_place, $title, $info_content );

  $output = "<a {$id} class=\"{$class}\" {$data} {$style} href=\"{$href}\" {$title} {$target}>" . do_shortcode( $content ) . "</a>";

  return $output;
}

add_shortcode( 'x_extra', 'x_shortcode_extra' );