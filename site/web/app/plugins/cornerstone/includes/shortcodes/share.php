<?php

// Share
// =============================================================================

function x_shortcode_share( $atts ) {
  extract( shortcode_atts( array(
    'id'          => '',
    'class'       => '',
    'style'       => '',
    'title'       => '',
    'share_title' => '',
    'facebook'    => '',
    'twitter'     => '',
    'google_plus' => '',
    'linkedin'    => '',
    'pinterest'   => '',
    'reddit'      => '',
    'email'       => '',
    'email_subject' => ''
  ), $atts, 'x_share' ) );

  $share_url        = urlencode( get_permalink() );

  if ( is_singular() ) {
    $share_url = urlencode( get_permalink() );
  } else {
    global $wp;
    $share_url = urlencode( home_url( ($wp->request) ? $wp->request : '' ) );
  }

  if ( is_singular() ) {
    $share_title = ( $share_title    != '' ) ? esc_attr( $share_title ) : urlencode( get_the_title() );
  } else {
    $share_title = ( $share_title    != '' ) ? esc_attr( $share_title ) : urlencode( apply_filters( 'the_title', get_page( get_option( 'page_for_posts' ) )->post_title) );
  }

  $share_source     = urlencode( get_bloginfo( 'name' ) );
  $share_image_info = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full' );
  $share_image      = ( function_exists( 'x_get_featured_image_with_fallback_url' ) ) ? urlencode( x_get_featured_image_with_fallback_url() ) : urlencode( $share_image_info[0] );

  if ( $linkedin    == 'true' ) {
    $share_content    = urlencode( cs_get_raw_excerpt() );
  }

  $tooltip_attr = cs_generate_data_attributes_extra( 'tooltip', 'hover', 'bottom' );

  $id          = ( $id          != ''     ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class       = ( $class       != ''     ) ? 'x-entry-share ' . esc_attr( $class ) : 'x-entry-share';
  $style       = ( $style       != ''     ) ? 'style="' . $style . '"' : '';
  $title       = ( $title       != ''     ) ? $title : __( 'Share this Post', csl18n() );
  $facebook    = ( $facebook    == 'true' ) ? "<a href=\"#share\" {$tooltip_attr} class=\"x-share\" title=\"" . __( 'Share on Facebook', csl18n() ) . "\" onclick=\"window.open('http://www.facebook.com/sharer.php?u={$share_url}&amp;t={$share_title}', 'popupFacebook', 'width=650, height=270, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;\"><i class=\"x-icon-facebook-square\" data-x-icon=\"&#xf082;\"></i></a>" : '';
  $twitter     = ( $twitter     == 'true' ) ? "<a href=\"#share\" {$tooltip_attr} class=\"x-share\" title=\"" . __( 'Share on Twitter', csl18n() ) . "\" onclick=\"window.open('https://twitter.com/intent/tweet?text={$share_title}&amp;url={$share_url}', 'popupTwitter', 'width=500, height=370, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;\"><i class=\"x-icon-twitter-square\" data-x-icon=\"&#xf081;\"></i></a>" : '';
  $google_plus = ( $google_plus == 'true' ) ? "<a href=\"#share\" {$tooltip_attr} class=\"x-share\" title=\"" . __( 'Share on Google+', csl18n() ) . "\" onclick=\"window.open('https://plus.google.com/share?url={$share_url}', 'popupGooglePlus', 'width=650, height=226, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;\"><i class=\"x-icon-google-plus-square\" data-x-icon=\"&#xf0d4;\"></i></a>" : '';
  $linkedin    = ( $linkedin    == 'true' ) ? "<a href=\"#share\" {$tooltip_attr} class=\"x-share\" title=\"" . __( 'Share on LinkedIn', csl18n() ) . "\" onclick=\"window.open('http://www.linkedin.com/shareArticle?mini=true&amp;url={$share_url}&amp;title={$share_title}&amp;summary={$share_content}&amp;source={$share_source}', 'popupLinkedIn', 'width=610, height=480, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;\"><i class=\"x-icon-linkedin-square\" data-x-icon=\"&#xf08c;\"></i></a>" : '';
  $pinterest   = ( $pinterest   == 'true' ) ? "<a href=\"#share\" {$tooltip_attr} class=\"x-share\" title=\"" . __( 'Share on Pinterest', csl18n() ) . "\" onclick=\"window.open('http://pinterest.com/pin/create/button/?url={$share_url}&amp;media={$share_image}&amp;description={$share_title}', 'popupPinterest', 'width=750, height=265, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;\"><i class=\"x-icon-pinterest-square\" data-x-icon=\"&#xf0d3;\"></i></a>" : '';
  $reddit      = ( $reddit      == 'true' ) ? "<a href=\"#share\" {$tooltip_attr} class=\"x-share\" title=\"" . __( 'Share on Reddit', csl18n() ) . "\" onclick=\"window.open('http://www.reddit.com/submit?url={$share_url}', 'popupReddit', 'width=875, height=450, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;\"><i class=\"x-icon-reddit-square\" data-x-icon=\"&#xf1a2;\"></i></a>" : '';
  $email_subject = ( $email_subject != '' ) ? esc_attr( $email_subject ) : __( 'Hey, thought you might enjoy this! Check it out when you have a chance:', csl18n() );
  $email       = ( $email       == 'true' ) ? "<a href=\"mailto:?subject=" . get_the_title() . "&amp;body=" . $email_subject . " " . get_permalink() . "\" {$tooltip_attr} class=\"x-share email\" title=\"" . __( 'Share via Email', csl18n() ) . "\"><span><i class=\"x-icon-envelope-square\" data-x-icon=\"&#xf199;\"></i></span></a>" : '';

  $output = "<div {$id} class=\"{$class}\" {$style}>"
            . '<p>' . $title . '</p>'
            . '<div class="x-share-options">'
              . $facebook . $twitter . $google_plus . $linkedin . $pinterest . $reddit . $email
            . '</div>'
          . '</div>';

  return $output;
}

add_shortcode( 'x_share', 'x_shortcode_share' );