<?php

class Cornerstone_Code_Editor {

  static $instance;

  public static function init() {

    self::$instance = new Cornerstone_Code_Editor;
  }

  public static function instance() {
    return self::$instance;
  }

  function __construct() {
    $this->register();
  }

  public function register() {
    wp_register_style( 'cs-code-editor-style' , CS()->css( 'admin/code-editor' ), array(), CS()->version() );

    wp_register_script( 'cs-code-editor', CS()->js( 'admin/code-editor' ), array( 'jquery' ), CS()->version(), true );
    wp_localize_script( 'cs-code-editor', 'csCodeEditor', array() );

  }

  public static function enqueue() {
    if ( !isset( self::$instance ) ) {
      self::init();
    }
    wp_enqueue_style( 'cs-code-editor-style' );
    wp_enqueue_script( 'cs-code-editor' );
  }

}
