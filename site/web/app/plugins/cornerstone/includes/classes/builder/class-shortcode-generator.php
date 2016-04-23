<?php

class Cornerstone_Shortcode_Generator extends Cornerstone_Plugin_Component {

  static $instance;
  private $shortcodes = array();
  private $sections = array();

  public function setup() {

		add_action( 'admin_init', array( $this, 'start' ) );
  	add_action( 'cornerstone_load_builder', array( $this, 'start' ) );
    add_action( 'wp_ajax_csg_list_shortcodes', array( &$this, 'modelEndpoint' ) );

  }

  public function start() {

    add_action( 'media_buttons', array( $this, 'addMediaButton' ), 999 );
    add_action( 'cornerstone_generator_preview_before', array( $this, 'previewBefore' ) );

  }

  public function enqueue( ) {

  	$this->plugin->component( 'Core_Scripts' )->register_scripts();

    wp_enqueue_style( 'cs-generator-css' , CS()->css( 'admin/generator' ), array(), CS()->version() );

    wp_register_script( 'cs-generator', CS()->js( 'admin/generator' ), array( 'backbone', 'jquery-ui-core', 'jquery-ui-accordion' ), CS()->version(), true );
    wp_localize_script( 'cs-generator', 'csgData', $this->getData() ) ;
    wp_enqueue_script( 'cs-generator' );

  }

  public function getData() {
    return array(
      'shortcodeCollectionUrl' => add_query_arg( array( 'action' => 'csg_list_shortcodes' ), admin_url( 'admin-ajax.php' ) ),
      'sectionNames'           => $this->get_sections(),
      'previewContentBefore' => $this->getPreviewContentBefore(),
      'previewContentAfter' => $this->getPreviewContentAfter(),
      'strings' => CS()->config( 'builder/strings-generator' )
    );
  }

  public function getPreviewContentBefore() {
    ob_start();
    do_action('cornerstone_generator_preview_before');
    return ob_get_clean();
  }

  public function getPreviewContentAfter() {
    ob_start();
    do_action('cornerstone_generator_preview_after');
    return ob_get_clean();
  }

  public function previewBefore() {
    return '<p>' . __('Click the button below to check out a live example of this shortcode', csl18n() ) . '</p>';
  }

  public function modelEndpoint() {
    wp_send_json( $this->get_collection() );
  }

  public function addMediaButton( $editor_id ) {
    $this->enqueue();
    $title = sprintf( __( 'Insert Shortcodes', csl18n() ) );
    $contents = CS()->view( 'svg/nav-elements-solid', false );
    echo "<button href=\"#\" title=\"{$title}\" id=\"cs-insert-shortcode-button\" class=\"button cs-insert-btn\">{$contents}</button>";
  }


  public function add( $attributes ) {

    $attributes = apply_filters( 'cornerstone_generator_map', $attributes );

    if ( !isset($attributes['id'])|| !is_string($attributes['id']) ) {
      return _doing_it_wrong( 'xsg_add', 'Invalid `id` attribute', '2.7' );
    }

    $this->shortcodes[$attributes['id']] = $attributes;

    if ( isset($attributes['section']) && !in_array( $attributes['section'], $this->sections) )
      array_push($this->sections, $attributes['section']);

  }

  public function remove( $id ) {
    if ( is_string($id) && isset($this->shortcodes[$id]) )
      unset($this->shortcodes[$id]);
  }

  public function get( $id = '' ) {
    return isset( $this->shortcodes[$id] ) ? $this->shortcodes[$id] : false;
  }

  public function get_collection() {
    return array_values( $this->shortcodes );
  }

  public function get_sections() {
    return $this->sections;
  }


  //
  // Relegated functions.
  // These will go away when the shortcode generator uses the same
  // controls registered for the page buikder.
  //

  public static function map_default( $args = array() ) {
  	return wp_parse_args( $args, array(
	    'param_name'  => 'generic',
	    'heading'     => __( 'Text', csl18n() ),
	    'description' => __( 'Enter your text.', csl18n() ),
	    'type'        => 'textfield',
	    'value'       => ''
	  ) );
  }

  public static function map_default_id( $args = array() ) {
  	return wp_parse_args( $args, self::map_default( array(
	    'param_name'  => 'id',
	    'heading'     => __( 'ID', csl18n() ),
	    'description' => __( '(Optional) Enter a unique ID.', csl18n() ),
	    'type'        => 'textfield',
	    'advanced'    => true
	  ) ) );
  }

  public static function map_default_class( $args = array() ) {
  	return wp_parse_args( $args, self::map_default( array(
	    'param_name'  => 'class',
	    'heading'     => __( 'Class', csl18n() ),
	    'description' => __( '(Optional) Enter a unique class name.', csl18n() ),
	    'type'        => 'textfield',
	    'advanced'    => true
	  ) ) );
  }

  public static function map_default_style( $args = array() ) {
  	return wp_parse_args( $args, self::map_default( array(
	    'param_name'  => 'style',
	    'heading'     => __( 'Style', csl18n() ),
	    'description' => __( '(Optional) Enter inline CSS.', csl18n() ),
	    'type'        => 'textfield',
	    'advanced'    => true
	  ) ) );
  }

}