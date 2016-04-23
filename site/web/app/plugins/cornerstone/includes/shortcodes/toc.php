<?php

// Table of Contents
// =============================================================================

function x_shortcode_toc( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'      => '',
    'class'   => '',
    'style'   => '',
    'type'    => '',
    'columns' => '',
    'title'   => ''
  ), $atts, 'x_toc' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-toc ' . esc_attr( $class ) : 'x-toc';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $type  = ( $type  != '' ) ? ' ' . $type : '';
  switch ( $columns ) {
    case '1' :
      $columns = ' one-column';
      break;
    case '2' :
      $columns = ' two-columns';
      break;
    case '3' :
      $columns = ' three-columns';
      break;
    default :
      $columns = '';
  }
  $title = ( $title != '' ) ? $title : __( 'Table of Contents', csl18n() );

  $output = "<div {$id} class=\"{$class}{$type}{$columns}\" {$style}><h4 class=\"h-toc\">{$title}</h4><ul class=\"unstyled cf\">" . do_shortcode( $content ) . '</ul></div>';

  return $output;
}

add_shortcode( 'x_toc', 'x_shortcode_toc' );



// Table of Contents Item
// =============================================================================

function x_shortcode_toc_item( $atts ) {
  extract( shortcode_atts( array(
    'id'     => '',
    'class'  => '',
    'style'  => '',
    'title'  => '',
    'page'   => ''
  ), $atts, 'x_toc_item' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-toc-item ' . esc_attr( $class ) : 'x-toc-item';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $title = ( $title != '' ) ? $title : '';
  switch ( $page ) {
    case 0 :
      $page = '';
      break;
    case 1 :
      $page = '';
      break;
    default :
      $page = $page . '/';
      $page = ( get_the_ID() == get_option( 'page_on_front' ) ) ? 'page/' . $page . '/' : $page . '/';
  }

  $link = esc_url( get_permalink() );

  $output = "<li {$id} class=\"{$class}\" {$style}><a href=" . $link . $page . " title=\"Go to {$title}\">" . $title . '</a></li>';

  return $output;
}

add_shortcode( 'x_toc_item', 'x_shortcode_toc_item' );