<?php

// Text Output
// =============================================================================

function x_shortcode_vc_text_output( $atts, $content = null ) {

  $output = do_shortcode( wpautop( $content ) );

  return $output;

}

add_shortcode( 'text_output', 'x_shortcode_vc_text_output' );