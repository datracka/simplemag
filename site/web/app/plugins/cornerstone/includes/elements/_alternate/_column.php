<?php

class CS_Column extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'column',
      'title'       => __( 'Column', csl18n() ),
      'section'     => '_internal',
      'description' => __( 'Column description.', csl18n() ),
      'supports'    => array( 'text_align', 'id', 'class', 'style' ),
      'helpText'   => array(
        'title' => __( 'Want to add content?', csl18n() ),
        'message' => sprintf( __( 'Click the <strong class="glue">%s Elements</strong> icon and drag your elements into a column.', csl18n() ), '%%icon-nav-elements-solid%%' ),
      ),
      'render'      => false,
    );
  }

  public function controls() {

    $this->addControl(
      'bg_color',
      'color',
      __( 'Background Color', csl18n() ),
      __( 'Select the background color of your Column.', csl18n() ),
      ''
    );

    $this->addControl(
      'padding',
      'dimensions',
      __( 'Padding', csl18n() ),
      __( 'Specify a custom padding for each side of this element. Can accept CSS units like px, ems, and % (default unit is px).', csl18n() ),
      array( '0px', '0px', '0px', '0px', 'linked' )
    );

    $this->addSupport( 'border' );

    $this->addControl(
      'fade',
      'toggle',
      __( 'Enable Fade Effect', csl18n() ),
      __( 'Activating will make this column fade into view when the user scrolls to it for the first time.', csl18n() ),
      false
    );

    $this->addControl(
      'fade_animation',
      'choose',
      __( 'Fade Direction', csl18n() ),
      __( 'Choose a direction to fade from. "None" will allow the column to fade in without coming from a particular direction.', csl18n() ),
      'in',
      array(
        'condition' => array(
          'fade' => true
        ),
        'columns' => '5',
        'choices' => array(
          array( 'value' => 'in',             'tooltip' => __( 'None', csl18n() ),   'icon' => fa_entity( 'ban' ) ),
          array( 'value' => 'in-from-bottom', 'tooltip' => __( 'Top', csl18n() ),    'icon' => fa_entity( 'arrow-up' ) ),
          array( 'value' => 'in-from-left',   'tooltip' => __( 'Right', csl18n() ),  'icon' => fa_entity( 'arrow-right' ) ),
          array( 'value' => 'in-from-top',    'tooltip' => __( 'Bottom', csl18n() ), 'icon' => fa_entity( 'arrow-down' ) ),
          array( 'value' => 'in-from-right',  'tooltip' => __( 'Left', csl18n() ),   'icon' => fa_entity( 'arrow-left' ) )
        )
      )
    );

    $this->addControl(
      'fade_animation_offset',
      'text',
      __( 'Offset', csl18n() ),
      __( 'Determines how drastic the fade effect will be.', csl18n() ),
      '45px',
      array(
        'condition' => array(
          'fade'           => true,
          'fade_animation' => array( 'in-from-top', 'in-from-left', 'in-from-right', 'in-from-bottom' )
        )
      )
    );

    $this->addControl(
      'fade_duration',
      'text',
      __( 'Duration', csl18n() ),
      __( 'Determines how long the fade effect will be.', csl18n() ),
      '750',
      array(
        'condition' => array(
          'fade' => true
        )
      )
    );

  }

  public function render( $atts ) {

    extract( $atts );

    if ( $fade == 'true' ) {
      $fade = ' fade="' . $fade . '" fade_animation="' . $fade_animation . '" fade_animation_offset="' . $fade_animation_offset . '"';
      if ( $fade_duration != '750' ) {
        $fade .= " fade_duration=\"{$fade_duration}\"";
      }
    } else {
      $fade = '';
    }

    $type = ( $size != '' ) ? 'type="' . $size . '" ' : '';

    if ( trim( $content ) == '' ) {
      $content = '<span>&nbsp;</span>';
    }

    $shortcode = "[x_column bg_color=\"{$bg_color}\" {$type}{$fade}{$extra}]{$content}[/x_column]";

    return $shortcode;

  }

}