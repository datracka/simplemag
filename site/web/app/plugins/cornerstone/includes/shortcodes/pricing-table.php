<?php

// Pricing Table
// =============================================================================

function x_shortcode_pricing_table( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'      => '',
    'class'   => '',
    'style'   => '',
    'columns' => ''
  ), $atts, 'x_pricing_table' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-pricing-table cf ' . esc_attr( $class ) : 'x-pricing-table cf';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';
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
    case '4' :
      $columns = ' four-columns';
      break;
    case '5' :
      $columns = ' five-columns';
      break;
    default :
      $columns = '';
  }

  $output = "<div {$id} class=\"{$class}{$columns}\" {$style}>" . do_shortcode( $content ) . "</div>";

  return $output;
}

add_shortcode( 'x_pricing_table', 'x_shortcode_pricing_table' );



// Pricing Table Column
// =============================================================================

function x_shortcode_pricing_table_column( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'           => '',
    'class'        => '',
    'style'        => '',
    'featured'     => '',
    'featured_sub' => '',
    'title'        => '',
    'currency'     => '',
    'price'        => '',
    'interval'     => ''
  ), $atts, 'x_pricing_table_column' ) );

  $id           = ( $id    != ''        ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class        = ( $class != ''        ) ? 'x-pricing-column ' . esc_attr( $class ) : 'x-pricing-column';
  $style        = ( $style != ''        ) ? 'style="' . $style . '"' : '';
  $featured     = ( $featured == 'true' ) ? ' featured' : '';
  $featured_sub = ( $featured_sub != '' ) ? ' <span>' . $featured_sub . '</span>' : '';
  $title        = ( $title != ''        ) ? $title : '';
  $currency     = ( $currency != ''     ) ? $currency : '';
  $price        = ( $price != ''        ) ? $price : '';
  $interval     = ( $interval != ''     ) ? $interval : '';

  $output = "<div {$id} class=\"{$class}{$featured}\" {$style}>"
            . '<h2 class="man">'
              . $title
              . $featured_sub
            . '</h2>'
            . '<div class="x-pricing-column-info">'
              . "<h3 class=\"x-price\">{$currency}{$price}</h3>"
              . "<span>{$interval}</span>"
              . do_shortcode( $content )
            . '</div>'
          . '</div>';

  return $output;
}

add_shortcode( 'x_pricing_table_column', 'x_shortcode_pricing_table_column' );