<?php

// Tab Navigation
// =============================================================================

function x_shortcode_tab_nav( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => '',
    'type'  => '',
    'float' => ''
  ), $atts, 'x_tab_nav' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-nav x-nav-tabs ' . esc_attr( $class ) : 'x-nav x-nav-tabs';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
  $type  = ( $type  != '' ) ? ' ' . $type : '';
  $float = ( $float != '' ) ? ' ' . $float : ' top';

  $output = "<ul {$id} class=\"{$class}{$type}{$float}\" {$style}>" . do_shortcode( $content ) . "</ul>";

  return $output;
}

add_shortcode( 'x_tab_nav', 'x_shortcode_tab_nav' );



// Tab Navigation Item
// =============================================================================

function x_shortcode_tab_nav_item( $atts ) {
  extract( shortcode_atts( array(
    'id'     => '',
    'class'  => '',
    'style'  => '',
    'title'  => '',
    'active' => ''
  ), $atts, 'x_tab_nav_item' ) );

  $id     = ( $id     != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class  = ( $class  != ''     ) ? 'x-nav-tabs-item ' . esc_attr( $class ) : 'x-nav-tabs-item';
  $style  = ( $style  != ''     ) ? 'style="' . $style . '"' : '';
  $title  = ( $title  != ''     ) ? $title : 'Make Sure to Set a Title';
  $active = ( $active == 'true' ) ? ' active' : '';

  static $count = 0; $count++;

  $output = "<li {$id} class=\"{$class}{$active}\" {$style}><a href=\"#tab-{$count}\" data-toggle=\"tab\">{$title}</a></li>";

  return $output;
}

add_shortcode( 'x_tab_nav_item', 'x_shortcode_tab_nav_item' );



// Tabs
// =============================================================================

function x_shortcode_tabs( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_tabs' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-tab-content ' . esc_attr( $class ) : 'x-tab-content';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'x_tabs', 'x_shortcode_tabs' );



// Tab
// =============================================================================

function x_shortcode_tab( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'class'  => '',
    'style'  => '',
    'active' => ''
  ), $atts, 'x_tab' ) );

  $class  = ( $class  != ''     ) ? 'x-tab-pane fade in ' . esc_attr( $class ) : 'x-tab-pane fade in';
  $style  = ( $style  != ''     ) ? 'style="' . $style . '"' : '';
  $active = ( $active == 'true' ) ? ' fade in active' : '';

  static $count = 0; $count++;

  $output = "<div id=\"tab-{$count}\" class=\"{$class}{$active}\" {$style}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'x_tab', 'x_shortcode_tab' );