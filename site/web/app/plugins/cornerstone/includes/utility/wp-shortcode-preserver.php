<?php

/**
 * Utility class for preserving shortcode content. This prevents filters
 * like wptexturize and wpautop from affecting your content.
 */

class CS_Shortcode_Preserver {

	/**
	 * I am a singleton
	 * @var object
	 */
	private static $instance;

	/**
	 * List of shortcode tags.
	 * @var array
	 */
	private $shortcodes;

	/**
	 * Internal cache of placeholders and content.
	 * @var [type]
	 */
	private $cache;

	public function __construct() {
		$this->shortcodes = array();
		$this->cache = array();
		add_filter( 'the_content', array( $this, 'preserve_shortcodes' ), 9 );
		add_filter( 'the_content', array( $this, 'restore_shortcodes' ), 11 );
	}

	/**
	 * Pre-filter the_content and replace our shortcodes with placeholders using
	 * a regex filter similar to the original WordPress shortcode replacements.
	 * @param  string $content Original content, before WordPress filters applied.
	 * @return string          Content with placeholders
	 */
	public function preserve_shortcodes( $content ) {

		$this->shortcodes = apply_filters( 'cs_preserve_shortcodes', $this->shortcodes );

		if ( empty( $this->shortcodes ) )
			return $content;

		global $shortcode_tags;
    $original = $shortcode_tags;
    remove_all_shortcodes();

    foreach ( $this->shortcodes as $shortcode ) {
    	add_shortcode( $shortcode, '__return_empty_string' );
    }

    $pattern = get_shortcode_regex();

		$content = preg_replace_callback( "/$pattern/s", array( $this, 'preserve_shortcode' ), $content );
		$shortcode_tags = $original;

		return $content;
	}

	/**
	 * Swap out placeholders for the original unscathed content.
	 * @param  string $content Content after WordPress filters have been applied.
	 * @return string          Final content
	 */
	public function restore_shortcodes( $content ) {

		foreach ($this->cache as $key => $value) {

			if ( apply_filters( 'cs_preserve_shortcodes_no_wrap', false ) ) {
				$content = str_replace( '<p>' . $key . '</p>', $key, $content );
			}

			$content = do_shortcode( str_replace( $key, $value, $content ), true );
		}

		return $content;

	}

	/**
	 * Callback for regex replacement. This caches the match, and returns a placeholder.
	 * @param  array $matches Matches for an individual shortcode
	 * @return string         A placeholder we can target later.
	 */
	public function preserve_shortcode( $matches ) {
		$placeholder = '{{{'. uniqid() . '}}}';
		$this->cache[$placeholder] = $matches[0];
		return $placeholder;
	}

	/**
	 * Instance accessor. If instance doesn't exist, we'll initialize the class.
	 * @return object CS_Shortcode_Preserver::$instance
	 */
	public static function instance() {
		if (!isset(self::$instance))
			self::$instance = new CS_Shortcode_Preserver;
		return self::$instance;
	}

	/**
	 * Alias for ::instance
	 * For semantics. init can be called when the intention is the first initialization
	 * @return object CS_Shortcode_Preserver::$instance
	 */
	public static function init() {
		return self::instance();
	}

	/**
	 * Mark a shortcode for preservation. A more direct approach than using the filter.
	 * @param  string $shortcode Tag of shortcode to preserve.
	 * @return none
	 */
	public static function preserve( $shortcode ) {
		if ( !isset(self::$instance) || in_array( $shortcode, self::$instance->shortcodes ) )
			return;

		self::$instance->shortcodes[] = $shortcode;
	}

}