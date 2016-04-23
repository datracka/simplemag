<?php

class CS_Row extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'row',
      'title'       => __( 'Row', csl18n() ),
      'section'     => '_internal',
      'description' => __( 'Row description.', csl18n() ),
      'supports'    => array( 'text_align', 'visibility', 'id', 'class', 'style' ),
      'render'      => false
    );
  }

  public function controls() {

    $this->addControl(
      'inner_container',
      'toggle',
      __( 'Column Container', csl18n() ),
      __( 'Disabling this control will allow your columns to be as wide as the browser window.', csl18n() ),
      true
    );

    $this->addControl(
      'marginless_columns',
      'toggle',
      __( 'Marginless Columns', csl18n() ),
      __( 'This will remove the margin around your columns, allowing their borders to be flush with one another. This is often used to create block or grid layouts.', csl18n() ),
      false
    );

    $this->addControl(
      'bg_color',
      'color',
      __( 'Background Color', csl18n() ),
      __( 'Select the background color of your Row.', csl18n() ),
      ''
    );

    $this->addControl(
      'margin',
      'dimensions',
      __( 'Margin', csl18n() ),
      __( 'Specify the margins for your Row utilizing the controls below. For most situations you will likely want no margin. Can accept CSS units like px, ems, and % (default unit is px).', csl18n() ),
      array( '0px', 'auto', '0px', 'auto', 'unlinked' ),
      array( 'lock' => array( 'left' => 'auto', 'right' => 'auto' ) )
    );

    $this->addControl(
      'padding',
      'dimensions',
      __( 'Padding', csl18n() ),
      __( 'Specify a custom padding for each side of this element. Can accept CSS units like px, ems, and % (default unit is px).', csl18n() ),
      array( '0px', '0px', '0px', '0px', 'unlinked' )
    );

    $this->addSupport( 'border' );

  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_row inner_container=\"{$inner_container}\" marginless_columns=\"{$marginless_columns}\" bg_color=\"{$bg_color}\"{$extra}]{$content}[/x_row]";

    return $shortcode;

  }

}