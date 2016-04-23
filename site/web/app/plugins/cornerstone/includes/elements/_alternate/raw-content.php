<?php

class CS_Raw_Content extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'raw-content',
      'title'       => __( 'Raw Content', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Raw Content description.', csl18n() ),
      'helpText'   => array(
        'title' => __( 'Using Javascript?', csl18n() ),
        'message' => sprintf( __( 'We recommend using <strong>Custom JS</strong> in <strong class="glue">%s Settings</strong>. Be sure to test on the front end, as it may not work as expected in the preview.', csl18n() ), '%%icon-nav-settings-solid%%' ),
      ),
      'supports'    => array( 'id', 'class', 'style' ),
      'htmlhint' => true
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'textarea',
      __( 'Content', csl18n() ),
      __( 'Accepts shortcodes and no special formatting is applied to this output. Keep in mind if your markup is empty or styled in a way that you cannot see it and you click away, you will not be able to get back to this element.', csl18n() ),
      '',
      array(
        'monospace' => true,
        'expandable' => true,
        'htmlhint' => true
      )
    );

  }

  public function xsg() { }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_raw_content{$extra}]{$content}[/x_raw_content]";

    return $shortcode;

  }

}