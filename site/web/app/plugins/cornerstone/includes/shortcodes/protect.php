<?php

// Protect
// =============================================================================

function x_shortcode_protect( $atts, $content = null ) {
  extract( shortcode_atts( array(
    'id'    => '',
    'class' => '',
    'style' => ''
  ), $atts, 'x_protect' ) );

  GLOBAL $user_login;

  $id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class = ( $class != '' ) ? 'x-protect ' . esc_attr( $class ) : 'x-protect';
  $style = ( $style != '' ) ? 'style="' . $style . '"' : '';

  if ( is_user_logged_in() ) {
    $output = do_shortcode( $content );
  } else {
    $output = "<div {$id} class=\"{$class}\" {$style}>"
              . '<form action="' . esc_url( site_url( 'wp-login.php' ) ) . '" method="post" class="mbn">'
                . '<h6 class="h-protect man">' . esc_html__( 'Restricted Content Login', csl18n() ) . '</h6>'
                . '<div><label>' . esc_html__( 'Username', csl18n() ) . '</label><input type="text" name="log" id="log" value="' . esc_attr( $user_login ) . '" /></div>'
                . '<div><label>' . esc_html__( 'Password', csl18n() ) . '</label><input type="password" name="pwd" id="pwd" /></div>'
                . '<div><input type="submit" name="submit" value="' . esc_html__( 'Login', csl18n() ) . '" class="x-btn x-btn-protect" /></div>'
                . '<input type="hidden" name="redirect_to" value="' . esc_url( get_permalink() ) . '">'
              . '</form>'
            . '</div>';
  }

  return $output;
}

add_shortcode( 'x_protect', 'x_shortcode_protect' );