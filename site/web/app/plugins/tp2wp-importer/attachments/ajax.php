<?php

/**
 * Callbacks for handling ajax requests and responses for interacting with
 * the importer.
 */

/**
 * Implements wp_ajax_(aciton) action.
 */
function tp2wp_importer_attachments_ajax_tp2wp_handler () {

    // This function serves for routing all incoming ajax requests.  All
    // incoming requests must have at least two values though: "action",
    // a string defining what action we want to perform, and "token",
    // the current nonce the client is holding.

    // All requests receive JSON in return, with at least two values.
    // First, all responses will have an 'error' property, with a boolean
    // description of whether a response was received correctly.  And
    // second, a 'data' property, which will be null if 'error' is true,
    // or a value appropriate for the request if 'error' if false.
    $response = array(
        'data' => null,
    );

    $is_error = false;

    // Process the nonce here if needed
    if ( ! check_ajax_referer( TP2WP_IMPORTER_ATTACHMENTS_NONCE, 'security' ) ) {
        $response['data'] = "Invalid nonce provided";
        $is_error = true;
    }

    if ( ! $is_error && ! empty( $_POST['request'] ) ) {

        tp2wp_importer_load_functions( 'attachments' );

        switch ( $_POST['request'] ) {

            case 'status':
                $response['data'] = array(
                    'posts_unprocessed' => tp2wp_importer_attachments_posts_unprocessed(),
                    'posts_processed' => tp2wp_importer_attachments_posts_processed(),
                    'attachments' => tp2wp_importer_attachments_attachments_imported_count(),
                );
                break;

            case 'reset':
                $response['date'] = tp2wp_importer_attachments_reset();
                break;

            case 'import':
                set_time_limit(300);
                if ( empty( $_POST['id'] ) OR ! is_numeric( $_POST['id'] ) ) {
                    $is_error = true;
                    $response['data'] = __( 'Unable to find post with given id to process.' );
                } else {
                    list ( $is_successful, $data ) = tp2wp_importer_attachments_import_for_post( $_POST['id'] );
                    $is_error = ! $is_successful;
                    $response['data'] = $data;
                }
                break;

            case 'posts-ids':
                if ( ! empty( $_POST['min'] ) && is_numeric( $_POST['min'] ) ) {
                    $min = $_POST['min'];
                } else {
                    $min = null;
                }

                if ( ! empty( $_POST['max'] ) && is_numeric( $_POST['max'] ) ) {
                    $max = $_POST['max'];
                } else {
                    $max = null;
                }

                $response['data'] = tp2wp_importer_attachments_post_ids_to_process( $min, $max );
                break;

            case 'domains':
                if ( empty( $_POST['domains'] ) OR
                    ! is_array( $_POST['domains'] ) OR
                    ( count( $_POST['domains'] ) === 1 && empty( $_POST['domains'][0] ) ) ) {
                    $is_error = true;
                    $response['data'] = 'No valid domains set.';
                } else {
                    $trimmed_domains = array_map( 'strtolower', array_map( 'trim', $_POST['domains'] ) );
                    $options = array( 'domains' => $trimmed_domains );
                    update_option( TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_OPTIONS_GROUP, $options );
                    $response['data'] = $trimmed_domains;
                }
                break;

            default:
                $is_error = true;
                break;
        }
    }

    $response['error'] = $is_error;
    die( json_encode( $response ) );
}
add_action( 'wp_ajax_tp2wp_importer_attachments', 'tp2wp_importer_attachments_ajax_tp2wp_handler' );
