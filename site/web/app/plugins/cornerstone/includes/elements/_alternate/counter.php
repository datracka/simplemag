<?php

class CS_Counter extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'counter',
      'title'       => __( 'Counter', csl18n() ),
      'section'     => 'information',
      'description' => __( 'Counter description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'text_above' => '.text-above',
    		'text_below' => '.text-below',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'num_start',
      'number',
      __( 'Starting Number', csl18n() ),
      __( 'Enter in the number that you would like your counter to start from.', csl18n() ),
      '0'
    );

    $this->addControl(
      'num_end',
      'number',
      __( 'Ending Number', csl18n() ),
      __( 'Enter in the number that you would like your counter to end at. This must be higher than your starting number.', csl18n() ),
      '1000'
    );

    $this->addControl(
      'num_speed',
      'number',
      __( 'Counter Speed', csl18n() ),
      __( 'The amount of time to transition between numbers in milliseconds.', csl18n() ),
      '1500'
    );

    $this->addControl(
      'num_prefix',
      'text',
      __( 'Number Prefix', csl18n() ),
      __( 'Prefix your number with a symbol or text.', csl18n() ),
      ''
    );

    $this->addControl(
      'num_suffix',
      'text',
      __( 'Number Suffix', csl18n() ),
      __( 'Suffix your number with a symbol or text.', csl18n() ),
      ''
    );

    $this->addControl(
      'num_color',
      'color',
      __( 'Number Color', csl18n() ),
      __( 'Select the color of your number.', csl18n() ),
      ''
    );

    $this->addControl(
      'text_above',
      'text',
      __( 'Text Above', csl18n() ),
      __( 'Optionally include text above your number.', csl18n() ),
      __( 'There Are', csl18n() )
    );

    $this->addControl(
      'text_below',
      'text',
      __( 'Text Below', csl18n() ),
      __( 'Optionally include text below your number.', csl18n() ),
      __( 'Options', csl18n() )
    );

    $this->addControl(
      'text_color',
      'color',
      __( 'Text Color', csl18n() ),
      __( 'Select the color of your text above and below the number if you have include any.', csl18n() ),
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_counter',
		    'title'        => __( 'Counter', csl18n() ),
		    'section'    => __( 'Information', csl18n() ),
		    'description' => __( 'Include an animated number counter in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/counter/',
		  'params'      => array(
		      array(
		        'param_name'  => 'num_start',
		        'heading'     => __( 'Starting Number', csl18n() ),
		        'description' => __( 'Enter in the number that you would like your counter to start from.', csl18n() ),
		        'type'        => 'textfield',

		        'value'       => '0'
		      ),
		      array(
		        'param_name'  => 'num_end',
		        'heading'     => __( 'Ending Number', csl18n() ),
		        'description' => __( 'Enter int he number that you would like your counter to end at. This must be higher than your starting number.', csl18n() ),
		        'type'        => 'textfield',

		        'value'       => '100'
		      ),
		      array(
		        'param_name'  => 'num_speed',
		        'heading'     => __( 'Counter Speed', csl18n() ),
		        'description' => __( 'The amount of time to transition between numbers in milliseconds.', csl18n() ),
		        'type'        => 'textfield',

		        'value'       => '1500'
		      ),
		      array(
		        'param_name'  => 'num_prefix',
		        'heading'     => __( 'Number Prefix', csl18n() ),
		        'description' => __( 'Prefix your number with a symbol or text.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'num_suffix',
		        'heading'     => __( 'Number Suffix', csl18n() ),
		        'description' => __( 'Suffix your number with a symbol or text.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'num_color',
		        'heading'     => __( 'Number Color', csl18n() ),
		        'description' => __( 'Select the color of your number.', csl18n() ),
		        'type'        => 'colorpicker',

		      ),
		      array(
		        'param_name'  => 'text_above',
		        'heading'     => __( 'Text Above', csl18n() ),
		        'description' => __( 'Optionally include text above your number.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'text_below',
		        'heading'     => __( 'Text Below', csl18n() ),
		        'description' => __( 'Optionally include text below your number.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'text_color',
		        'heading'     => __( 'Text Color', csl18n() ),
		        'description' => __( 'Select the color of your text above and below the number if you have include any.', csl18n() ),
		        'type'        => 'colorpicker',

		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_counter num_start=\"$num_start\" num_end=\"$num_end\" num_speed=\"$num_speed\" num_prefix=\"$num_prefix\" num_suffix=\"$num_suffix\" num_color=\"$num_color\" text_above=\"$text_above\" text_below=\"$text_below\" text_color=\"$text_color\"{$extra}]";

    return $shortcode;

  }

}