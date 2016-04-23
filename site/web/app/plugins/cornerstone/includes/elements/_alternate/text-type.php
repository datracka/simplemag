<?php

class CS_Text_Type extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'text-type',
      'title'       => __( 'Text Type', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Text Type description.', csl18n() ),
      'supports'    => array( 'text_align', 'id', 'class', 'style' ),
      'autofocus'   => array(
				'prefix' => '.x-text-type .prefix',
		 		'strings' => '.x-text-type .text',
				'suffix' => '.x-text-type .suffix'
    	)
    );
  }

  public function controls() {

    //
    // Content.
    //

    $this->addControl(
      'prefix',
      'text',
      __( 'Prefix, Strings, &amp; Suffix', csl18n() ),
      __( 'Enter in your prefix text in the first input and suffix text in the last input. Typing strings go in the textarea and are separated by a new line.', csl18n() ),
      __( 'This is the ', csl18n() )
    );

    $this->addControl(
      'strings',
      'textarea',
      NULL,
      NULL,
      __( 'first string' . "\n" . 'second string' . "\n" . 'third string', csl18n() ),
      array(
        'expandable' => false
      )
    );

    $this->addControl(
      'suffix',
      'text',
      NULL,
      NULL,
      __( ' of the sentence.', csl18n() )
    );

    $this->addControl(
      'tag',
      'select',
      __( 'Tag', csl18n() ),
      __( 'Specify the HTML tag you would like to use to output this shortcode.', csl18n() ),
      'h3',
      array(
        'choices' => array(
          array( 'value' => 'h1',   'label' => __( 'h1', csl18n() ) ),
          array( 'value' => 'h2',   'label' => __( 'h2', csl18n() ) ),
          array( 'value' => 'h3',   'label' => __( 'h3', csl18n() ) ),
          array( 'value' => 'h4',   'label' => __( 'h4', csl18n() ) ),
          array( 'value' => 'h5',   'label' => __( 'h5', csl18n() ) ),
          array( 'value' => 'h6',   'label' => __( 'h6', csl18n() ) ),
          array( 'value' => 'p',    'label' => __( 'p', csl18n() ) ),
          array( 'value' => 'div',  'label' => __( 'div', csl18n() ) ),
          array( 'value' => 'span', 'label' => __( 'span', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'looks_like',
      'select',
      __( 'Looks Like', csl18n() ),
      __( 'Allows you to alter the appearance of the heading, while still outputting it as a different HTML tag.', csl18n() ),
      'h3',
      array(
        'choices' => array(
          array( 'value' => 'h1', 'label' => __( 'h1', csl18n() ) ),
          array( 'value' => 'h2', 'label' => __( 'h2', csl18n() ) ),
          array( 'value' => 'h3', 'label' => __( 'h3', csl18n() ) ),
          array( 'value' => 'h4', 'label' => __( 'h4', csl18n() ) ),
          array( 'value' => 'h5', 'label' => __( 'h5', csl18n() ) ),
          array( 'value' => 'h6', 'label' => __( 'h6', csl18n() ) )
        ),
        'condition' => array(
          'tag' => array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' )
        )
      )
    );


    //
    // Timing.
    //

    $this->addControl(
      'type_speed',
      'number',
      __( 'Type Speed (ms)', csl18n() ),
      __( 'How fast in milliseconds each character should appear.', csl18n() ),
      50
    );

    $this->addControl(
      'start_delay',
      'number',
      __( 'Start Delay (ms)', csl18n() ),
      __( 'How long in milliseconds until typing should start.', csl18n() ),
      0
    );

    $this->addControl(
      'back_speed',
      'number',
      __( 'Back Speed (ms)', csl18n() ),
      __( 'How fast in milliseconds each character should be deleted.', csl18n() ),
      50
    );

    $this->addControl(
      'back_delay',
      'number',
      __( 'Back Delay (ms)', csl18n() ),
      __( 'How long in milliseconds each string should remain visible.', csl18n() ),
      3000
    );


    //
    // Functionality.
    //

    $this->addControl(
      'loop',
      'toggle',
      __( 'Loop', csl18n() ),
      __( 'Enable to have the typing effect loop continuously.', csl18n() ),
      false
    );

    $this->addControl(
      'show_cursor',
      'toggle',
      __( 'Show Cursor', csl18n() ),
      __( 'Enable to display a cursor for your typing effect.', csl18n() ),
      true
    );

    $this->addControl(
      'cursor',
      'text',
      __( 'Cursor', csl18n() ),
      __( 'Specify the character you would like to use for your cursor.', csl18n() ),
      '|',
      array(
        'condition' => array(
          'show_cursor' => true
        )
      )
    );

  }

  public function xsg() { }

  public function render( $atts ) {

    extract( $atts );

    $strings = htmlspecialchars( str_replace( "\n", '|', $strings ) );

    if ( $tag == 'h1' || $tag == 'h2' || $tag == 'h3' || $tag == 'h4' || $tag == 'h5' || $tag == 'h6' ) {
      $looks_like = ' looks_like="' . $looks_like . '"';
    } else {
      $looks_like = '';
    }

    $shortcode = "[x_text_type prefix=\"$prefix\" strings=\"$strings\" suffix=\"$suffix\" tag=\"$tag\" type_speed=\"$type_speed\" start_delay=\"$start_delay\" back_speed=\"$back_speed\" back_delay=\"$back_delay\" loop=\"$loop\" show_cursor=\"$show_cursor\" cursor=\"$cursor\"{$looks_like}{$extra}]";

    return $shortcode;

  }

}