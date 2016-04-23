<?php

// Raw Output
// =============================================================================

//
// This is a shortcode used specifically in Visual Composer and should not be
// overwritten in how it works for backwards compatibility.
//

//
// 1. Remove any new lines already in there.
// 2. Remove all <p> tags.
// 3. Replace <br> with \n.
// 4. Replace </p> with \n\n.
//

function x_shortcode_raw_output( $atts, $content = null ) {

  $content = str_replace( '\n', '', $content );                               // 1
  $content = str_replace( '<p>', '', $content );                              // 2
  $content = str_replace( array('<br />', '<br>', '<br/>'), '\n', $content ); // 3
  $content = str_replace( '</p>', '\n\n', $content );                         // 4

  $output = do_shortcode( $content );

  return $output;

}

add_shortcode( 'x_raw_output', 'x_shortcode_raw_output' );