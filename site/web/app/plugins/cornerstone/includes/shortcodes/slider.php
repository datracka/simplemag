<?php

// Slider
// =============================================================================

function x_shortcode_slider( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'            => '',
    'class'         => '',
    'style'         => '',
    'animation'     => '',
    'slide_time'    => '',
    'slide_speed'   => '',
    'slideshow'     => '',
    'random'        => '',
    'control_nav'   => '',
    'prev_next_nav' => '',
    'no_container'  => '',
    'touch'         => ''
  ), $atts, 'x_slider' ) );

  static $count = 0; $count++;

  $id            = ( $id            != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class         = ( $class         != ''     ) ? "x-flexslider-shortcode-container " . esc_attr( $class ) : "x-flexslider-shortcode-container";
  $style         = ( $style         != ''     ) ? 'style="' . $style . '"' : '';
  $no_container  = ( $no_container  == 'true' ) ? '' : ' with-container';

  $js_params = array(
    'animation'   => ( $animation     == 'fade'  ) ? 'fade' : 'slide',
    'slideTime'   => ( $slide_time    != ''      ) ? $slide_time : '7000',
    'slideSpeed'  => ( $slide_speed   != ''      ) ? $slide_speed : '600',
    'controlNav'  => ( $control_nav   == 'true'  ),
    'prevNextNav' => ( $prev_next_nav == 'true'  ),
    'slideshow'   => ( $slideshow     == 'true'  ),
    'random'      => ( $random        == 'true'  ),
    'touch'       => ( $touch         != 'false' )
  );

  $data = cs_generate_data_attributes( 'slider', $js_params );

  $output = "<div class=\"{$class}{$no_container}\">"
            . "<div {$id} class=\"x-flexslider x-flexslider-shortcode x-flexslider-shortcode-{$count}\" {$data} {$style}>"
              . '<ul class="x-slides">'
                . do_shortcode( $content )
              . '</ul>'
            . '</div>'
          . '</div>';

  return $output;
}

add_shortcode( 'x_slider', 'x_shortcode_slider' );



// Slide
// =============================================================================

function x_shortcode_slide( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_slide' ) );

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-slide ' . esc_attr( $class ) : 'x-slide';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  $output = "<li {$id} class=\"{$class}\" {$style}>" . do_shortcode( $content ) . "</li>";

  return $output;
}

add_shortcode( 'x_slide', 'x_shortcode_slide' );