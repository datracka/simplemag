<?php
/**
 * These defaults are applied to the cornerstone_settings option.
 * To access cornerstone_settings with them applied use this:
 * $settings = CS()->settings();
 */

return array(
  'allowed_post_types'  => array( 'post', 'page' ),
  'permitted_roles'     => array( 'administrator' ),
  'visual_enhancements' => true,
  'show_wp_toolbar'     => false,
  'api_key'             => ''
);