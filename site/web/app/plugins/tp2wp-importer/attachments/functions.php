<?php

/**
 * @file
 * Contains functions and helpers for interacting with and manipulating
 * the wordpress posts and imported attachments.
 */

// ======================
// ! Importing Functions
// ======================

/**
 * Imports attachments from the excerpt and body of the given post.  Any
 * extracted files are rewritten in the body of the message to be locally
 * served files, and associated with the post as attachments.
 *
 * @param int $post_id
 *   The post ID of a wordpress post, of type 'post'
 *
 * @return array
 *   Returns a pair of values.
 *
 *   The first value is a boolean description of whether any import was
 *   performed at all.  False indicates that we were not able to load and
 *   examine a post at all, and true indicates that a post was loaded and
 *   examined.
 *
 *   The second value will be a string, describing the error, if we were
 *   not able to load a post at all.  Otherwise, the second value will be an
 *   array.  Keys of this array will be urls of found attachments, and the
 *   corresponding values will be another array, with the first value being
 *   a boolean description of whether the file was imported, and the second
 *   value being either an error description (if false), or the local url
 *   the file is now served from.
 */
function tp2wp_importer_attachments_import_for_post ($post_id) {

    // First check and make sure we're able to load any post at all with the
    // given post id.  If not, we can early out since there is nothing
    // further to process.
    $post = get_post( $post_id );
    if ( $post === null ) {
        return array( false, 'Unable to load post with ID "' . $post_id . '".' );
    }

    // Next, check and make sure that the loaded item looks like a post,
    // the type of content we import from Typepad / MoveableType.  If
    // its not a post, it could be something wacky / unexpected (gallery,
    // attachment, etc) outside of our supported use cases, so ignore it.
    if ( $post->post_type !== 'post' ) {
        return array( false, 'Loaded post is of type "' . $post->post_type . '", not "post".' );
    }

    // Check to see if we support symlinks on the current system.  If we do,
    // we will create a symlink from a predictable path
    // (/wp-content/uploads/tp2wp-migration/<hash>) to the standard wordpress
    // path (/wp-content/uploads/<year>/<month>/<hash>.<extension>).
    // Otherwise, we'll just copy the file to both locations.
    tp2wp_importer_load_functions( 'status' );
    $should_create_links = tp2wp_importer_status_alt_upload_location_correct();
    if ( $should_create_links ) {
        $supports_symlinks = tp2wp_importer_status_supports_symlinks();
        $alt_upload_path = tp2wp_importer_attachments_alt_upload_path();
        $alt_version_func = $supports_symlinks ? 'symlink' : 'copy';
        $upload_dir_info = wp_upload_dir();
        $root_upload_dir = $upload_dir_info['basedir'];
        $root_upload_dir_length = strlen( $root_upload_dir );
    }

    $options = get_option( TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_OPTIONS_GROUP, null );
    $domains = $options ? $options['domains'] : array();

    // Directory were we should upload any files we find for this post
    $post_ts = strtotime( $post->post_date );

    $body = $post->post_content;
    $teaser = $post->post_excerpt;
    $body_attach = tp2wp_importer_attachments_extract_attachments( $body );
    $excerpt_attach = tp2wp_importer_attachments_extract_attachments( $teaser );

    $attachments = array_merge( $body_attach, $excerpt_attach );
    $attachments = array_unique( $attachments );
    $work_performed = array();

    foreach ( $attachments as $url ) {

        // There are some cases where we want to modify the URL as we're
        // processing it, so want to have a copy of the original url
        // before processing, so that we are sure to rewrite all references
        // in the body and the excerpt.
        $found_attachment_url = $url;

        // First, check and see if the given attachment is on a domain
        // we're watching for files to import.  If its not, then we
        // can trivially skip it.
        $is_on_domain = tp2wp_importer_attachments_is_url_on_domains( $url, $domains );
        if ( ! $is_on_domain ) {
            $work_performed[$found_attachment_url] = array( false, __( 'Not from a domain being imported from.' ) );
            continue;
        }

        // Next, we can also quickly check to see if the given URL looks like
        // a TypePad popup URL, which doesn't actually point to a new file,
        // but instead just points to the file with "-popup" attached to the end.
        // In this case, we don't want to worry about the attachment itself,
        // we just instead want to always rewrite the link with the -popup
        // removed (and then fallback on the redirection from the /.a/ version
        // of the attachment (using the old typepad pattern) to the wordpress
        // location.
        if ( tp2wp_importer_attachments_is_popup_url( $url ) ) {
            $url = substr( $url, 0, strlen( $url ) - 6 );
        }

        // Next, check and see if the extracted attachment looks like a file
        // that should be imported at all.  If its not, we can store that
        // result and continue on to the next item quickly.
        $rs = tp2wp_importer_attachments_should_import_attachment( $url );
        list( $should_be_imported, $error ) = $rs;

        if ( ! $should_be_imported ) {
            $work_performed[$found_attachment_url] = $rs;
            continue;
        }

        // Try to download the file from the remote URL.  If we're not
        // able to fetch the file and copy it locally, then we don't need
        // to consider this attachment any further
        $fetched_rs = tp2wp_importer_attachments_import_attachment( $url, $post_ts, $domains );
        list( $fetched_succeded, $fetched_details ) = $fetched_rs;
        if ( ! $fetched_succeded ) {
            $work_performed[$found_attachment_url] = $fetched_rs;
            continue;
        }
        list ( $local_path, $local_url ) = $fetched_details;

        $attachment = tp2wp_importer_attachments_prepare_attachment_post(
            $local_url,
            $url,
            $local_path
        );

        $attachment_id = wp_insert_attachment( $attachment, $local_path, $post->ID );
        $attachment_metadata = wp_generate_attachment_metadata( $attachment_id, $local_path );
        wp_update_attachment_metadata( $attachment_id, $attachment_metadata );

        add_post_meta( $attachment_id, TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG, time() );

        // If the attachment import was successful, and we have a valid
        // alternate upload directory, then also create a second reference
        // to the imported file so that we can redirect to it.
        if ( $should_create_links ) {

            $imported_file_path_info = pathinfo( $local_path );
            $imported_file_basename = $imported_file_path_info['basename'];
            // This stores the name of the file w/o the extension
            $imported_file_filename = $imported_file_path_info['filename'];

            // We want this path to be relative, so that it can be moved
            // between installs and still be correct (ie not be dependent
            // on the absolute path of the file).  The above relative path
            // directs from a path like
            // wp-content/uploads/<YEAR>/<MONTH>/<HASH>.<EXT> ->
            // wp-content/uploads/tp2wp-migrated/<HASH>
            $relative_path = substr($imported_file_path_info['dirname'], $root_upload_dir_length);
            $relative_path_to_upload = '..' . $relative_path . '/' . $imported_file_basename;

            // Will be either 'symlink' or 'copy', depending on what the
            // local filesystem / OS supports.
            $second_version_path = $alt_upload_path . DIRECTORY_SEPARATOR . $imported_file_filename;

            // But make sure we're not trying to symlink (or equiv) ontop
            // of an existing file, since the same file could be linked
            // to elsewhere already.
            if ( ! is_file( $second_version_path ) && ! is_link( $second_version_path ) ) {
                $alt_version_func( $relative_path_to_upload, $second_version_path );
            }
        }

        // At this point we have successfully fetched this attachment.
        // Note that we haven't yet changed the text of the post, which we'll
        // do after we've finished importing all of the attachments.
        $work_performed[$found_attachment_url] = array( true, $local_url );
    }

    // Now that we've fetched all the attachments that we can, we need to
    // rewrite the URLs to any of the attachments we imported in the body
    // of the posts we're considering.   To make sure we don't mangle
    // any attachments' urls, we replace them longest to shortest.
    uksort( $work_performed, 'tp2wp_importer_attachments_cmpr_strlen' );
    foreach ( $work_performed as $url => $fetch_result ) {

        list( $is_fetch_successful, $fetched_url ) = $fetch_result;
        if ( ! $is_fetch_successful ) {
            continue;
        }

        $body = str_replace( $url, $fetched_url, $body );
        $teaser = str_replace( $url, $fetched_url, $teaser );
    }

    $update_query = array(
        'ID' => $post_id,
        'post_content' => $body,
        'post_excerpt' => $teaser
    );
    wp_update_post( $update_query );

    // Finally, add a meta post tag, indicating that we've now
    // completed importing attachments from this post, so that we don't
    // need to go over it again.
    add_post_meta( $post->ID, TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG, time() );

    return array( true, $work_performed );
}

/**
 * Extracts the URL to all external attachments that exist in the given domain.
 *
 * @param string $text
 *   A HTML or plain text string to look for attachments in
 *
 * @return array
 *   Returns an array of URLs to remote attachments.
 */
function tp2wp_importer_attachments_extract_attachments ($text) {

    // Extremely gross regular expression to look for images
    // and other well know file types in <img> and <a> tags
    $attachment_pattern = '/<img(?:[^\/>]+?)?src=(?:"|\')(?P<img_asset>.*?)(?:"|\')|<a(?:[^\/>]+?)?href=(?:"|\')(?P<a_asset>[^\'"]+?)\.(?P<a_asset_extension>pdf|doc|docx|ppt|pptx|pps|ppsx|odt|xls|xlsx|mp3|m4a|ogg|wav|mp4|m4v|mov|wmv|avi|mpg|ogv|3gp|3g2|jpg|jpeg|png|gif)(?:"|\')|<a(?:[^\/>]+?)?href=(?:"|\')(?P<tp_img_asset>[^\'"]+?\/\.a\/[^\'"]+?)(?:"|\')/im';

    $attachments = array();
    $assets = array();

    if ( preg_match_all( $attachment_pattern, $text, $matches, PREG_SET_ORDER ) > 0) {

        foreach ($matches as $match) {

            if ( empty( $match['a_asset'] )) {

                if ( ! empty( $match['img_asset'] ) ) {

                    // Make sure we don't loop in base64 embedded images
                    if ( strpos( $match['img_asset'], 'data:image' ) === 0) {
                        continue;
                    }

                    $asset_url = $match['img_asset'];

                } elseif ( ! empty( $match['tp_img_asset'] ) ) {

                    $asset_url = $match['tp_img_asset'];

                } else {

                    continue;

                }

            } else {

                $asset_url = $match['a_asset'] . '.' . $match['a_asset_extension'];

            }

            $attachments[] = $asset_url;
        }
    }

    return $attachments;
}

/**
 * Returns the mime type and size of the file hosted at the given url by doing a
 * HEAD request, so that we can learn about the attachment without having to
 * actually fetch the file.
 *
 * @param string $url
 *   An absolute URL to a file
 *
 * @return array|NULL
 *   Returns NULL if we were not able to find information about the requested
 *   file. Otherwise returns an array of three values:
 *
 *   First, the server returned mime type of the file.
 *
 *   Second, the name of the file as advertised by the server.
 *
 *   Third, the file extension if available.  Note that this value is first
 *   determined by looking at the name of the file.  If no extension is
 *   available, then its guessed from the mime type.  If still not available,
 *   NULL is returned.
 */
function tp2wp_importer_attachments_remote_file_info ($url) {

    // We statically cache requests for a URL during each execution,
    // since it is very unlikely that files will be change in the time
    // span we're interested in, and saving the time needed for multiple
    // requests, and the corresponding simplification in the code is worth
    // that minor possibility of "error"
    static $cache = array();

    if ( isset( $cache[$url] ) ) {
        return $cache[$url];
    }

    $mime = null;
    $filename = null;
    $extension = null;

    $curl = curl_init();
    curl_setopt( $curl, CURLOPT_URL, $url );
    curl_setopt( $curl, CURLOPT_HEADER, true );
    curl_setopt( $curl, CURLOPT_NOBODY, true );
    curl_setopt( $curl, CURLOPT_FOLLOWLOCATION, true );
    curl_setopt( $curl, CURLOPT_MAXREDIRS, 10 );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $curl, CURLOPT_CONNECTTIMEOUT, 5 );
    $header_info = curl_exec( $curl );
    curl_close( $curl );

    if ( ! $header_info) {
        return null;
    }

    $file_type_pattern = '/Content-Type:\s?([^\s]+)/i';
    $file_type_matches = array();
    if ( preg_match( $file_type_pattern, $header_info, $file_type_matches ) ) {
        $mime = trim( $file_type_matches[1] );
    }

    $file_name_pattern = '/filename=([^\s]+)/i';
    $file_name_matches = array();

    if ( preg_match( $file_name_pattern, $header_info, $file_name_matches ) ) {

        $filename = trim( $file_name_matches[1] );

    } else {

        $url_parts = parse_url( $url );
        $filename = basename( $url_parts['path'] );
    }

    if ( ( $index = strripos( $filename, '.' ) ) !== false ) {

        $extension = substr( $filename, $index + 1 );

    // If we can't extract the extension from the filename, guess from the
    // content type
    } elseif ( ! empty ( $mime )) {

        $mime_parts = explode( '/', $mime );
        $extension = $mime_parts[1];

    }

    $rs = array( $mime, $filename, $extension );
    $cache[$url] = $rs;
    return $rs;
}

/**
 * Checks to see if the attachment referred to in the given URL should be
 * imported into the current wordpress install.
 *
 * @param string $url
 *   An absolute URL to a HTTP hosted file.
 *
 * @return array
 *   Returns a pair of values, the first being a boolean description
 *   of whether the given file should be imported, and the second
 *   a human readable description of why the file should not be imported.
 *   If the first value is true, the second will always be an empty string.
 */
function tp2wp_importer_attachments_should_import_attachment ($url) {

    $url_parts = parse_url( $url );

    // If the URL is unpredictably oddly formatted, don't try to make
    // any more sense of it, just quick fail it
    if ( ! $url_parts ) {
        return array( false, __( 'Unparsable URL' ) );
    }

    // Similarly, if we're not able to get any information about the file
    // from the remote host (ie HEAD requests are not served, or
    // are formatted oddly, or it doesn't look like a file at all),
    // quick fail.
    $attachment_info = tp2wp_importer_attachments_remote_file_info( $url );
    if ( ! $attachment_info ) {
        return array( false, __( 'Unable to fetch attachment details from server.' ) );
    }

    // Finally, if the file does not seem to be a valid type that wordpress
    // support, also quick return.
    list( $mime, $filename, $ext ) = $attachment_info;
    $file_type = wp_check_filetype( $filename );
    if ( empty( $file_type['ext'] ) OR empty( $file_type['type'] ) ) {
        return array( false, __( 'Attachment is not of valid Wordpress upload type.' ) );
    }

    // Otherwise, if all the above checkout, it looks like the attachment should
    // be imported.  Huzzah!
    return array( true, '' );
}

/**
 * Returns a boolean description of whether the given URL is hosted on one
 * of a given array of domains (used to determine whether an attachment
 * should be imported).
 *
 * @param string $url
 *   An absolute URL to a HTTP hosted file.
 * @param array $domains
 *   An array of domains that should be imported from.  Files served
 *   from hosts not in this list will be ignored.  If this is not provided,
 *   than the domain check is ignored.
 *
 * @return bool
 *   Returns true if the given url is hosted from one of given domains.
 */
function tp2wp_importer_attachments_is_url_on_domains ($url, $domains = null) {

    $url_parts = parse_url( $url );

    // If the URL is unpredictably oddly formatted, don't try to make
    // any more sense of it, just quick fail it
    if ( ! $url_parts ) {
        return false;
    }

    // Similarly, if the remote file is hosted on a domain other than
    // one we've been told to import from, ignore it.
    $domain = strtolower( $url_parts['host'] );
    if ( $domains && ! in_array( $domain, $domains ) ) {
        return false;
    }

    return true;
}

/**
 * Returns a boolean description of whether the given URL appears to be
 * a TypePad / MoveableType popup url (ie if it just has '-popup' at the end
 * of the URL).
 *
 * @param string $url
 *   A valid URL to a HTTP(s) hosted file.
 *
 * @return bool
 *   A boolean description of whether, from the URL, this looks like a popup
 *   version of an attachment.
 */
function tp2wp_importer_attachments_is_popup_url ($url) {

    $popup_index = stripos( $url, '-popup' );

    if ($popup_index === false) {
        return false;
    }

    $url_length = strlen( $url );
    return ( $popup_index === ( $url_length - 6 ) );
}


/**
 * Returns what the local path for an attachment should be, given a specified
 * upload directory.
 *
 * @param string $url
 *   An absolute URL to a HTTP hosted file.
 * @param int $date
 *   An optional date to use to prefix the upload (ie to stick the uploaded
 *   file in YYYY/MM).
 *
 * @return array
 *   Returns an array of two values.  The first value is a boolean
 *   description of whether we were successful in fetching the remote file.
 *
 *   If the fetch was a failure, the second value will be an error
 *   message, explaining why the import failed.
 *
 *   If the fetch succeeded, the second value will be an array,
 *   with the first value being the path of the newly imported file on disk,
 *   and the second being the url of the newly imported.
 */
function tp2wp_importer_attachments_import_attachment ($url, $date = null) {

    $local_filename = tp2wp_importer_attachments_generate_local_filename( $url );
    $upload_info = wp_upload_dir( date( 'Y/m', $date ) );
    $possible_existing_file = $upload_info['path'] . '/' . $local_filename;
    $possible_existing_url = $upload_info['url'] . '/' . $local_filename;

    // If this file already exists on the disk, then we can save having to
    // fetch it agian, and just use the existing version.
    if ( is_file( $possible_existing_file ) && filesize( $possible_existing_file ) > 0 ) {
        return array( true, array( $possible_existing_file, $possible_existing_url ) );
    }

    $response = wp_remote_get( $url, array( 'timeout' => 30 ) );
    $request_body = wp_remote_retrieve_body( $response );
    $request_code = wp_remote_retrieve_response_code( $response );

    // The simplest error case we can check for is seeing if the request
    // timed out
    if ( ! $request_body ) {
        return array( false, __( 'Timeout when fetching attachment.' ) );
    }

    // Next, check and make sure that we received a valid, success response from
    // the server before responding
    if ( $request_code != '200' ) {
        @unlink( $fetched_file_path );
        $error_msg = sprintf(
            __( 'Remote server returned error response %1$d %2$s.' ),
            esc_html( $request_code ),
            get_status_header_desc( $request_code )
        );
        return array( false, $error_msg );
    }

    $file = wp_upload_bits( $local_filename, null, $request_body, date( 'Y/m', $date ) );
    $fetched_file_path = $file['file'];
    $fetched_file_url = $file['url'];

    // Next, check and make sure that we successfully downloaded something, that
    // it wasn't quick closed or something else odd.  Just a simple sanity
    // check...
    $filesize = filesize( $fetched_file_path );
    if ( ! $filesize ) {
        @unlink( $fetched_file_path );
        return array( false, __( 'Zero size file downloaded.' ) );
    }

    return array( true, array( $fetched_file_path, $fetched_file_url ) );
}

/**
 * Returns a post array suitable for inserting a post of type 'attachment'
 * describing an imported file.
 *
 * @param string $local_url
 *   An absolute URL to a file that was just imported, which should be
 *   in the local domain
 * @param string $remote_url
 *   An absolute URL to a file on a remote server, that was just imported
 * @param string $path
 *   The absolute file path to a file that was just imported into the local
 *   wordpress install.
 *
 * @return array
 *   An array describing an attachment post, suitable for using in the
 *   `wp_insert_attachment` function.  Returns null if no able to prepare
 *   an insert (such as if mime information could not be fetched).
 */
function tp2wp_importer_attachments_prepare_attachment_post ($local_url, $remote_url, $path) {

    $file_info = tp2wp_importer_attachments_remote_file_info( $remote_url );
    if ( ! $file_info ) {
        return null;
    }

    list( $mime, $filename, $extension ) = $file_info;

    $attachment = array(
        'guid' => $local_url,
        'post_mime_type' => $mime,
        'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $path ) ),
        'post_content' => '',
        'post_status' => 'inherit'
    );

    return $attachment;
}

/**
 * Generates a local friendly version of the attachment name.  This
 * function takes the following steps to generate a local filename.
 *
 *  - Attempts to ask the remote server for the name of the file
 *  - If thats not available, just use the last section of the url (ie
 *    file.data in http://example.org/dir/file.data)
 *  - Adds a best guess at an extension if the file name does not include an
 *    extension, and we are able to learn something about its mime type.
 *
 * @param string $url
 *   An absolute URL to a HTTP hosted file.
 *
 * @return string
 *   A best guess at a good filename for the file.
 */
function tp2wp_importer_attachments_generate_local_filename ($url) {

    list( $mime, $filename, $extension ) = tp2wp_importer_attachments_remote_file_info( $url );
    $unescaped_file_name = urldecode( $filename );

    $parts = explode( ".", $unescaped_file_name );
    $num_parts = count( $parts );
    if ( ! $num_parts || strlen( $parts[$num_parts - 1] ) > 4 ) {
        $filename .= '.' . $extension;
    }

    return $filename;
}


/**
 * Returns the path used to link / copy each imported attachment, so that
 * we can redirect all references to the old Typepad path
 * (ex /.a/<hash>) to a new location in Wordpress
 * (ex /wp-content/uploads/tp2wp-migrated/<hash>).
 *
 * @return string
 *   The absolute path to the alternate / second directory used for
 *   uploaded files.
 */
function tp2wp_importer_attachments_alt_upload_path () {

    $upload_dir_info = wp_upload_dir();
    $alt_location = $upload_dir_info['basedir'] . DIRECTORY_SEPARATOR . TP2WP_IMPORTER_ATTACHMENTS_ALT_DIR_NAME;
    return $alt_location;
}


/**
 * Returns a string representation of the path part of a URL where
 * alternate version of each file is stored.  This is used, for example, when
 * doing 301 redirects.
 *
 * @return string|NULL
 *   If the directory exists, a string version of the base part of the path.
 *   Or, if the directory does not exist, NULL.
 */
function tp2wp_importer_attachments_alt_upload_url () {

    // First check and make sure the directory exists.  For the purposes
    // of this check, we don't care if its writeable, only that it
    // exists.
    $alt_upload_dir_path = tp2wp_importer_attachments_alt_upload_path();
    if ( ! is_dir( $alt_upload_dir_path ) ) {
        return NULL;
    }

    $upload_dir_info = wp_upload_dir();
    return $upload_dir_info['baseurl'] . '/' . TP2WP_IMPORTER_ATTACHMENTS_ALT_DIR_NAME;
}


/**
 * Simple callback for sorting strings by string length.
 *
 * This is defined as a separate function, instead of lambda, to maintain PHP
 * 5.2 compatibility.
 *
 * @param string $a
 *   A string to sort
 * @param string $b
 *   Another string to sort
 *
 * @return int
 * An integer less than, equal to, or greater than zero if the first argument
 * is considered to be respectively less than, equal to, or greater than the
 * second.
 */
function tp2wp_importer_attachments_cmpr_strlen ($a, $b) {
    return strlen( $b ) - strlen( $a );
}

// ==================
// ! Model Functions
// ==================

/**
 * Returns the count of the number of posts in the system that have not
 * been checked and updated for attachments since the tp2wp import.
 *
 * @return int
 *   The number of posts that have not been checked for attachments so far.
 */
function tp2wp_importer_attachments_posts_unprocessed () {

    global $wpdb;
    $post_count_query = "
        SELECT
            COUNT(*) AS count
        FROM
            {$wpdb->posts} AS p
        WHERE
            p.post_type = 'post'
    ";
    $num_posts = $wpdb->get_var( $post_count_query );

    return ($num_posts - tp2wp_importer_attachments_posts_processed());
}

function tp2wp_importer_attachments_attachments_imported_count () {

    global $wpdb;
    $attachments_imported_query = "
        SELECT
            COUNT(*) AS count
        FROM
            {$wpdb->posts} AS p
        JOIN
            {$wpdb->postmeta} AS pm ON (p.ID = pm.post_id)
        WHERE
            p.post_type = 'attachment' AND
            pm.meta_key = '" . TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG . "'
    ";

    return $wpdb->get_var( $attachments_imported_query );
}

/**
 * Returns a count of the number of posts that have already been processed
 * for attachments and updated.
 *
 * @return int
 *   The count of posts that have already had their attachments updated.
 */
function tp2wp_importer_attachments_posts_processed () {

    global $wpdb;
    $processed_count_query = "
        SELECT
            COUNT(*) AS count
        FROM
            {$wpdb->posts} AS p
        JOIN
            {$wpdb->postmeta} AS pm ON (p.ID = pm.post_id)
        WHERE
            p.post_type = 'post' AND
            pm.meta_key = '" . TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG . "'
    ";
    return $wpdb->get_var( $processed_count_query );
}

/**
 * Returns an array of post ids that have not yet been parsed by the plugin,
 * and which optionally fall in the given range.
 *
 * @param int $min
 *   If provided, the minimum post ID, inclusive, that will be imported.
 * @param int $max
 *   If provided, the maximum post ID, inclusive, that will be imported.
 *
 * @return array
 *   An array of zero or more post IDs to process for attachments.
 */
function tp2wp_importer_attachments_post_ids_to_process ($min = null, $max = null) {

    global $wpdb;
    $processed_posts_query = "
        SELECT
            p2.ID AS ID
        FROM
            {$wpdb->posts} AS p2
        LEFT JOIN
            {$wpdb->postmeta} AS pm ON (p2.ID = pm.post_id)
        WHERE
            p2.post_type = 'post' AND
            pm.meta_key = '" . TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG . "'
    ";

    $all_posts_query = "
        SELECT
            p.ID AS ID
        FROM
            {$wpdb->posts} AS p
        WHERE
            p.post_type = 'post'
    ";

    if ( $min !== null && is_numeric( $min ) ) {
        $processed_posts_query .= ' AND p.ID >= ' . $min;
        $all_posts_query .= ' AND p.ID >= ' . $min;
    }

    if ( $max !== null && is_numeric( $max ) ) {
        $processed_posts_query .= ' AND p.ID <= ' . $max;
        $all_posts_query .= ' AND p.ID <= ' . $max;
    }

    $combined_query = $all_posts_query . ' AND p.ID NOT IN (' . $processed_posts_query . ') ORDER BY p.ID';
    return $wpdb->get_col( $combined_query );
}

/**
 * Remove all tracking / status information about previous attachment imports.
 * Note that this doesn't affect the content of posts or attachments
 * stored in the system, only the information about which posts have
 * already been processed.
 *
 * @return int
 *   The count of the number of affected posts.
 */
function tp2wp_importer_attachments_reset () {

    global $wpdb;

    $tracking_count_query = "
        SELECT
            COUNT(*) AS count
        FROM
            {$wpdb->postmeta} AS pm
        WHERE
            pm.meta_key = '" . TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG . "';
    ";
    $num_posts = $wpdb->get_var($tracking_count_query);

    $delete_query = "
        DELETE FROM
            {$wpdb->postmeta}
        WHERE
            meta_key = '" . TP2WP_IMPORTER_ATTACHMENTS_SETTINGS_META_TAG . "';
    ";
    $wpdb->query( $delete_query );

    return $num_posts;
}
