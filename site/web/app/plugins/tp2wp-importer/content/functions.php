<?php

/**
 * Checks to see if a post already exits in the database that matches
 * a given posts name.  This is meant to be a replacement
 * for wordpress's `post_exists` function, which gives too many false
 * positivies for our purposes.
 *
 * @param string $name
 *   The possible `post_name` of a post
 *
 * @return int|NULL
 *   If there seems to be an existing post, then the unique id of that post,
 *   and otherwise NULL.
 */
function tp2wp_importer_content_post_name_exists ($name) {

  global $wpdb;

  $args = array( $name );
  $query = "
    SELECT
      ID
    FROM
      $wpdb->posts
    WHERE
      post_name = %s
    LIMIT
      1";

  $post_id = (int) $wpdb->get_var( $wpdb->prepare( $query, $args ) );
  return ( $post_id === 0 ) ? null : $post_id;
}


/**
 * Checks to see if a post already exists in the database that matches
 * the given post name, date and status.
 *
 * This is a more rigerious test than the above
 * `tp2wp_importer_content_post_name_exists` function. This function is used to
 * see if the same content has been imported, the above function is used
 * to check if the post's name is unique.
 *
 * @param string $name
 *   The possible `post_name` of a post
 * @param string $post_date
 *   The date a post was created, such as (ex 2010-06-28 08:45:15)
 * @param string $status
 *   Either "publish" or "draft", describing the status of a post to test.
 *
 * @return boolean
 *   Returns "true" if a post matching the above parameters exists, and
 *   otherwise "false".
 */
function tp2wp_importer_content_post_exists ($name, $post_date, $status) {

  global $wpdb;

  $args = array( $name, $post_date, $status );
  $query = "
    SELECT
      ID
    FROM
      $wpdb->posts
    WHERE
      post_name = %s AND
      post_date = %s AND
      post_status = %s
    LIMIT
      1";

  $post_id = (int) $wpdb->get_var( $wpdb->prepare( $query, $args ) );
  return ( $post_id !== 0 );
}


/**
 * Generates a post name that is similar to the given name, but which
 * is currently unique in the system.  This is similar to the core
 * `wp_unique_post_slug` function, but differs in that it doesn't require
 * that the post already exist in the database (ie it doesn't require an
 * existing database record).
 *
 * The funciton assumes that the existing post name does not exist, and
 * attempts to find a new unique post name by appending -[1...1000] to the
 * end of the name.
 *
 * @param string $name
 *   The possible `post_name` of a post
 *
 * @return string|null
 *   Identical to the output of `wp_unique_post_slug`, unless $name-[1...1000]
 *   are all already in the database, in which case null is returned.
 */
function tp2wp_importer_content_generate_unique_post_name ($name) {

  $index = 0;

  while ( ++$index <= 1000 ) {
    $attempted_stub = $name . '-' . $index;
    $existing_post_id = tp2wp_importer_content_post_name_exists( $attempted_stub );
    if ( $existing_post_id === null ) {
      return $attempted_stub;
    }
  }

  return null;
}
