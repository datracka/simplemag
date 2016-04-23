<?php

// Author
// =============================================================================

function x_shortcode_author( $atts ) {
  extract( shortcode_atts( array(
    'id'        => '',
    'class'     => '',
    'style'     => '',
    'title'     => '',
    'author_id' => ''
  ), $atts, 'x_author' ) );

  $id        = ( $id        != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class     = ( $class     != '' ) ? 'x-author-box cf ' . esc_attr( $class ) : 'x-author-box cf';
  $style     = ( $style     != '' ) ? 'style="' . $style . '"' : '';
  $title     = ( $title     != '' ) ? $title : __( 'About the Author', csl18n() );
  $author_id = ( $author_id != '' ) ? $author_id : get_the_author_meta( 'ID' );

  $description  = get_the_author_meta( 'description', $author_id );
  $display_name = get_the_author_meta( 'display_name', $author_id );
  $facebook     = get_the_author_meta( 'facebook', $author_id );
  $twitter      = get_the_author_meta( 'twitter', $author_id );
  $googleplus   = get_the_author_meta( 'googleplus', $author_id );

  $facebook_output   = ( $facebook )   ? "<a href=\"{$facebook}\" class=\"x-author-social\" title=\"Visit the Facebook Profile for {$display_name}\" target=\"_blank\"><i class=\"x-icon-facebook-square\" data-x-icon=\"&#xf082;\"></i> Facebook</a>" : '';
  $twitter_output    = ( $twitter )    ? "<a href=\"{$twitter}\" class=\"x-author-social\" title=\"Visit the Twitter Profile for {$display_name}\" target=\"_blank\"><i class=\"x-icon-twitter-square\" data-x-icon=\"&#xf081;\"></i> Twitter</a>" : '';
  $googleplus_output = ( $googleplus ) ? "<a href=\"{$googleplus}\" class=\"x-author-social\" title=\"Visit the Google+ Profile for {$display_name}\" target=\"_blank\"><i class=\"x-icon-google-plus-square\" data-x-icon=\"&#xf0d4;\"></i> Google+</a>" : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>"
            . "<h6 class=\"h-about-the-author\">{$title}</h6>"
            . get_avatar( $author_id, 180 )
            . '<div class="x-author-info">'
              . "<h4 class=\"h-author mtn\">{$display_name}</h4>"
                . $facebook_output
                . $twitter_output
                . $googleplus_output
              . "<p class=\"p-author mbn\">{$description}</p>"
            . '</div>'
          . '</div>';

  return $output;
}

add_shortcode( 'x_author', 'x_shortcode_author' );