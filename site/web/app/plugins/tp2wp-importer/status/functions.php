<?php

/**
 * Returns a list of active plugins in the system.
 *
 * @return array
 *   An array of strings, naming each plugin active in the system.
 */
function tp2wp_importer_status_active_plugins () {
    return (array) get_option( 'active_plugins', array() );
}

/**
 * Returns the currently configured PHP memory limit
 *
 * @see http://php.net/manual/en/ini.core.php#ini.memory-limit
 *
 * @return int|null
 *   Returns the PHP memory limit, as a count of bytes,
 *   or null if the value is not set.
 */
function tp2wp_importer_status_memory_limit () {

    $limit = ini_get( 'memory_limit' );
    if ( $limit === '' OR $limit === false ) {
        return null;
    }

    return tp2wp_importer_status_convert_to_bytes( $limit );
}

/**
 * Returns the number of seconds wordpress can run before it's killed
 *
 * @see http://php.net/manual/en/info.configuration.php#ini.max-execution-time
 *
 * @return int|null
 *   The number of seconds before termination, or null if the setting could
 *   not be read.
 */
function tp2wp_importer_status_max_execution_time () {
    return tp2wp_importer_status_time_config_value( 'max_execution_time' );
}


/**
 * Returns a boolean description of whether the current file system supports
 * symlinks.
 *
 * @return bool
 *   TRUE if the current system supports symlinks, and false in all other
 *   cases.
 */
function tp2wp_importer_status_supports_symlinks () {

    // We test to see if the current system supports symlinks by creating
    // a temp file, and attemping to symlink it to another temp file.
    $temp_dir = sys_get_temp_dir();
    $temp_file_path = tempnam( $temp_dir, 'tp2wp-test-file' );

    // If creating the file failed for whatever reason, we know our test for
    // symlink support will fail too, so eary quit
    if ( $temp_file_path === false ) {
        return false;
    }

    // Otherwise, attempt to symlink our newly created test file to a new temp
    // file.
    $symlink_test_path = $temp_dir . DIRECTORY_SEPARATOR . 'tp2wp-test-symlink';
    $test_result = symlink( $temp_file_path, $symlink_test_path );

    // Finally clean everything up, and return whether we were able to
    // successfully create a symlink.
    unlink( $temp_file_path );
    unlink( $symlink_test_path );

    return $test_result;
}


/**
 * Returns a boolean description of whether there is a writeable path on
 * the system we can use to link / copy all uploads to, so that we can
 * determistically redirect all references to the old Typepad path
 * (ex /.a/<hash>) to a new location in Wordpress
 * (ex /wp-content/uploads/tp2wp-migration/<hash>).
 *
 * This is needed since by default Wordpress uploads files to paths like
 * (ex /wp-content/uploads/<year>/<month>/<hash>.<ext>), which isn't
 * regex rewriteable from a Typepad file path.
 *
 * If the upload directory does not exist, this function attempts to
 * create it.
 *
 * @return boolean
 *   `true` if the directory exists once this function has returned and is
 *   writeable.  `false` in all other cases (doesn't exist, not writeable, etc)
 */
function tp2wp_importer_status_alt_upload_location_correct () {

    tp2wp_importer_load_functions( 'attachments' );
    $upload_path = tp2wp_importer_attachments_alt_upload_path();
    $dir_exists = is_dir( $upload_path );

    if ( ! $dir_exists ) {
        $dir_exists = wp_mkdir_p( $upload_path );
    }

    return $dir_exists AND is_writable( $upload_path );
}


/**
 * Returns a configuration value set in PHP as a count of seconds.
 *
 * @param string $setting
 *   The name of a PHP config value to return
 *
 * @return int|null
 *   Either a number of seconds, or null if the setting could
 *   not be read.
 */
function tp2wp_importer_status_time_config_value ($setting) {

    $value = ini_get( $setting );
    if ( $value === '' OR $value === false ) {
        return null;
    }

    return $value;
}

/**
 * Returns a boolean description of whether the XML extension is installed
 * in the local PHP instance.
 *
 * @return bool
 *   true if it looks like the xml extension is installed, and otherwise false.
 */
function tp2wp_importer_status_xml_extension_exists () {
    return extension_loaded( 'xml' );
}

/**
 * Returns a boolean description of whether the currently enabled theme
 * is one that came shipped / bundled with wordpress (and thus can be
 * relied on to not do anything wonky or crazy).
 *
 * @return bool|null
 *   true if it looks like the current theme came with Wordpress, otherwise
 *   false.
 */
function tp2wp_importer_status_is_theme_bundled () {

    $default_themes = array(
        'classic' => 'WordPress Classic',
        'default' => 'WordPress Default',
        'twentyten' => 'Twenty Ten',
        'twentyeleven' => 'Twenty Eleven',
        'twentytwelve' => 'Twenty Twelve',
        'twentythirteen' => 'Twenty Thirteen',
        'twentyfourteen' => 'Twenty Fourteen',
        'twentyfifteen' => 'Twenty Fifteen',
    );

    $theme = wp_get_theme();
    $theme_name = $theme->get('Name');
    return in_array( $theme_name, $default_themes );
}

/**
 * Converts a integer count of bytes to a nicer, human readable size.
 * For example, from 1024 -> 1k.
 *
 * @param int $size
 *   A byte count
 *
 * @return string
 *   A human friendly file size
 */
function tp2wp_importer_status_bytes_to_human ($size) {

    if ( ( $size >= 1 << 30 ) ) {
        return number_format( $size / ( 1 << 30 ), 2 ) . "GB";
    }

    if ( ( $size >= 1 << 20 ) ) {
        return number_format( $size / ( 1 << 20 ), 2 ) . "MB";
    }

    if ( ( $size >= 1 << 10 ) ) {
        return number_format( $size / ( 1 << 10 ), 2 ) . "KB";
    }

    return number_format( $size ) . " bytes";
}


/**
 * Normalizes the representation of a configuration value, so
 * values like 12M or 1G can be instead calculated as a count of bytes
 *
 * @return int
 *   The given measurement, as a byte count
 */
function tp2wp_importer_status_convert_to_bytes ($size) {

    $label = strtolower( substr( $size, -1 ) );

    switch ($label) {

        case 'k':
            $size = (int) $size * 1024;
            break;

        case 'm':
            $size = (int) $size * 1048576;
            break;

        case 'g':
            $size = (int) $size * 1073741824;
            break;

        default:
            $size = (int) $size;
            break;
    }

    return $size;
}
