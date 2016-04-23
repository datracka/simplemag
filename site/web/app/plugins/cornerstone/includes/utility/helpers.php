<?php

/**
 * Get all the Font Awesome unicode values
 * @return array Hash list of icon aliases and unicode values
 */
function fa_all_unicode() {
  return CS()->common()->getFontIcons();
}

/**
 * Returns a unicode value for a font icon
 * @param  string $key Icon to lookup
 * @return string      String containing unicode reference for the requested icon
 */
function fa_unicode( $key ) {
  return CS()->common()->getFontIcon( $key );
}


/**
 * Get an HTML entity for an icon
 * @param  string $key Icon to lookup
 * @return string      HTML entity
 */
function fa_entity( $key ) {
  return '&#x' . fa_unicode( $key ) . ';';
}

/**
 * Template function that returns a data attribute for an icon
 * @param  string $key Icon to lookup
 * @return string      Data attribute string that can be placed inside an element tag
 */
function fa_data_icon( $key ) {
  return 'data-x-icon="' . fa_icon( $key ) . '"';
}


/**
 * Alternate for wp_localize_script that outputs a function to return the data
 * @param  string $handle          Handle for the item in WP scripts
 * @param  string $function_name   Name of the function to be added to the window object
 * @param  object $data            Object or array containing data to be converted to JSON
 * @return none
 */
function wp_script_data_function( $handle, $function_name, $data ) {

  global $wp_scripts;

  foreach ( (array) $data as $key => $value ) {
    if ( !is_scalar($value) )
      continue;
    $data[$key] = html_entity_decode( (string) $value, ENT_QUOTES, 'UTF-8');
  }

  $script = "var $function_name=function(){ return " . wp_json_encode( $data ) . ';}';

  $data = $wp_scripts->get_data( $handle, 'data' );

  if ( !empty( $data ) )
    $script = "$data\n$script";

  return $wp_scripts->add_data( $handle, 'data', $script );
}

/**
 * Get a posts excerpt without the_content filters being applied
 * This is useful if you need to retreive an excerpt from within
 * a shortcode.
 * @return string Post excerpt
 */
function cs_get_raw_excerpt() {

  add_filter( 'get_the_excerpt', 'cs_trim_raw_excerpt'  );
  remove_filter( 'get_the_excerpt', 'wp_trim_excerpt'  );

  $excerpt = get_the_excerpt();

  add_filter( 'get_the_excerpt', 'wp_trim_excerpt'  );
  remove_filter( 'get_the_excerpt', 'cs_trim_raw_excerpt'  );

  return $excerpt;
}

/**
 * Themeco customized version of the wp_trim_excerpt function in WordPress formatting.php
 * Generates an excerpt from the content, if needed.
 *
 * @param string $text Optional. The excerpt. If set to empty, an excerpt is generated.
 * @return string The excerpt.
 */
function cs_trim_raw_excerpt( $text = '' ) {
  $raw_excerpt = $text;
  if ( '' == $text ) {
    $text = get_the_content('');

    $text = strip_shortcodes( $text );

    //$text = apply_filters( 'the_content', $text );
    $text = str_replace(']]>', ']]&gt;', $text);

    $excerpt_length = apply_filters( 'excerpt_length', 55 );

    $excerpt_more = apply_filters( 'excerpt_more', ' ' . '[&hellip;]' );
    $text = wp_trim_words( $text, $excerpt_length, $excerpt_more );
  }

  return apply_filters( 'wp_trim_excerpt', $text, $raw_excerpt );
}

// Data Attribute Generator
// =============================================================================

function cs_generate_data_attributes( $element, $params = array() ) {

  $data = 'data-x-element="' . $element . '"';

  if ( ! empty( $params ) ) {
    $params_json = htmlspecialchars( json_encode( $params ), ENT_QUOTES, 'UTF-8' );
    $data .= ' data-x-params="' . $params_json . '"';
  }

  return $data;

}



// Data Attribute Generator (Popovers and Tooltips)
// =============================================================================

function cs_generate_data_attributes_extra( $type, $trigger, $placement, $title = '', $content = '' ) {

  if ( ! in_array( $type, array( 'tooltip', 'popover' ) ) )
    return '';

  $js_params = array(
    'type'      => ( $type == 'tooltip' ) ? 'tooltip' : 'popover',
    'trigger'   => $trigger,
    'placement' => $placement,
    'title'     => htmlspecialchars_decode( $title ), // to avoid double encoding.
    'content'   => htmlspecialchars_decode( $content )
  );

  return cs_generate_data_attributes( 'extra', $js_params );

}



// Background Video Output
// =============================================================================

function cs_bg_video( $video, $poster ) {

  $output = do_shortcode( '[x_video_player class="bg transparent" src="' . $video . '" poster="' . $poster . '" hide_controls="true" autoplay="true" loop="true" muted="true" no_container="true"]' );

  return $output;

}



// Build Shortcode
// =============================================================================

function cs_build_shortcode( $name, $attributes, $extra = '', $content = '' ) {

  $output = "[{$name}";

  if ( isset( $attributes['class'] ) ) {
		$attributes['class'] = cs_sanitize_html_classes( $attributes['class'] );
	}

  foreach ($attributes as $attribute => $value) {
		$clean = cs_clean_shortcode_att( $value );
		$att = sanitize_key( $attribute );
    $output .= " {$att}=\"{$clean}\"";
  }

  if ($extra != '') {
    $output .= " {$extra}";
  }

  if ( $content == '' ) {
    $output .= "]";
  } else {
    $output .= "]{$content}[/{$name}]";
  }

  return $output;

}



// Animation Base Class
// =============================================================================

function cs_animation_base_class( $animation_string ) {

  if ( strpos( $animation_string, 'In' ) !== false ) {
    $base_class = ' animated-hide';
  } else {
    $base_class = '';
  }

  return $base_class;

}

function cs_att( $attribute, $content, $echo = true ) {
	$att = '';
	if ( $content ) {
		$att = $attribute . '="' . esc_attr( $content ) . '" ';
	}
	if ( $echo )
		echo $att;
	return $att;
}

function cs_atts( $atts, $echo = true ) {
	$result = '';
	foreach ( $atts as $att => $content) {
		$result .= cs_att( $att, $content, false ) . ' ';
	}
	if ( $result )
		echo $result;
	return $result;
}


function cs_deep_array_merge ( array &$defaults, array $data, $max_depth = -1 ) {

	if ( $max_depth-- == 1 ) {
		return $defaults;
	}

  foreach ( $defaults as $key => &$value ) {
    if ( isset ( $data[$key] ) && is_array( $value ) && is_array( $data[$key] ) ) {
      $data[$key] = cs_deep_array_merge( $value, $data[$key], $max_depth );
      continue;
    }
    $data[$key] = $value;
  }

  return $data;
}

function cs_alias_shortcode( $new_tag, $existing_tag, $filter_atts = true ) {

	if ( is_array( $new_tag ) ) {
		foreach ($new_tag as $tag) {
			cs_alias_shortcode( $tag, $existing_tag, $filter_atts );
		}
		return;
	}

	if ( !shortcode_exists( $existing_tag ) )
		return;

	global $shortcode_tags;
	add_shortcode( $new_tag, $shortcode_tags[$existing_tag] );

	if ( !$filter_atts || !has_filter( $tag = "shortcode_atts_$existing_tag" ) )
		return;

	global $wp_filter;

	foreach ( $wp_filter[$tag] as $priority => $filter ) {
		foreach ($filter as $tag => $value) {
			add_filter( "shortcode_atts_$new_tag", $value['function'], $priority, $value['accepted_args'] );
		}
	}

}

function cs_array_filter_use_keys( $array, $callback ) {
	return array_intersect_key( $array, array_flip( array_filter( array_keys( $array ), $callback ) ) );
}

/**
 * Call a potentially expensive function and store the results in a transient.
 * Future calls to cs_memoize for the same function will return the cached value
 * until the transient expires. For example:
 *
 * $result = cs_memoize( 'transient_key', 'my_remote_api_request', 15 * MINUTE_IN_SECONDS, $api_key, $secret );
 *
 * This is the equivalent of: $result = my_remote_api_request( $api_key, $secret );
 * but it will only truly run once every 15 minutes. It will only persist
 * successful calls, meaning it wont set the transient if the callback
 * returns false or a WP_Error object.
 *
 * @param string   $key        Key used to set the transient
 * @param callable $function   Function to call for the original result.
 * @param int      $expiration Optional. Time until expiration in seconds. Default 0.
 * Optionally pass any additional paramaters that you would passed into the callback.
 * @return mixed    $value    Value from the original call to $function
 */
function cs_memoize( $key, $callback, $expiration = 0 ) {

	$value = get_transient( $key );

	if ( false === $value ) {

		$args = func_get_args();
		$value = call_user_func_array( $callback, array_slice( $args, 3 ) );

		if ( false !== $value && !is_wp_error( $value ) ) {
			set_transient( $key, $value, $expiration );
		}

	}

	return $value;

}

/**
 * Sanitize a value for use in a shortcode attribute
 * @param  string $value Value to clean
 * @return string        Value ready for use in shortcode markup
 */
function cs_clean_shortcode_att( $value ) {

	$value = wp_kses( $value, wp_kses_allowed_html( 'post' ) );
	$value = esc_html( $value );
	$value = str_replace( ']', '&rsqb;', str_replace('[', '&lsqb;', $value ) );

	return $value;
}

/**
 * Sanitizes an HTML classname to ensure it only contains valid characters.
 *
 * Uses sanitize_html_class but allows spaces for multiple classes.
 *
 * @param string $class    The classname to be sanitized
 * @return string The sanitized value
 */
function cs_sanitize_html_classes( $class ) {

	$classes = explode(' ', $class );
  array_map( 'sanitize_html_class', $classes );
  $class = implode(' ', $classes );

	return $class;
}