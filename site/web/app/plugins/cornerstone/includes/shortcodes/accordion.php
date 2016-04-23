<?php

// Accordion
// =============================================================================

function x_shortcode_accordion( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_accordion' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-accordion ' . esc_attr( $class ) : 'x-accordion';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'x_accordion', 'x_shortcode_accordion' );



// Accordion Item
// =============================================================================

function x_shortcode_accordion_item( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'        => '',
    'class'     => '',
    'style'     => '',
    'parent_id' => '',
    'title'     => '',
    'open'      => ''
  ), $atts, 'x_accordion_item' ) );

  $id        = ( $id        != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class     = ( $class     != ''     ) ? 'x-accordion-group ' . esc_attr( $class ) : 'x-accordion-group';
  $style     = ( $style     != ''     ) ? 'style="' . $style . '"' : '';
  $parent_id = ( $parent_id != ''     ) ? 'data-parent="#' . $parent_id . '"' : '';
  $title     = ( $title     != ''     ) ? $title : 'Make Sure to Set a Title';
  $open      = ( $open      == 'true' ) ? 'collapse in' : 'collapse';

  static $count = 0; $count++;

  if ( $open == 'collapse in' ) {

    $output = "<div {$id} class=\"{$class}\" {$style}>"
              . '<div class="x-accordion-heading">'
                . "<a class=\"x-accordion-toggle\" data-toggle=\"collapse\" {$parent_id} href=\"#collapse-{$count}\">{$title}</a>"
              . '</div>'
              . "<div id=\"collapse-{$count}\" class=\"accordion-body {$open}\">"
                . '<div class="x-accordion-inner">'
                  . do_shortcode( $content )
                . '</div>'
              . '</div>'
            . '</div>';

  } else {

    $output = "<div {$id} class=\"{$class}\" {$style}>"
              . '<div class="x-accordion-heading">'
                . "<a class=\"x-accordion-toggle collapsed\" data-toggle=\"collapse\" {$parent_id} href=\"#collapse-{$count}\">{$title}</a>"
              . '</div>'
              . "<div id=\"collapse-{$count}\" class=\"accordion-body {$open}\">"
                . '<div class="x-accordion-inner">'
                  . do_shortcode( $content )
                . '</div>'
              . '</div>'
            . '</div>';

  }

  return $output;
}

add_shortcode( 'x_accordion_item', 'x_shortcode_accordion_item' );