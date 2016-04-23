<?php

class CS_Skill_Bar extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'skill-bar',
      'title'       => __( 'Skill Bar', csl18n() ),
      'section'     => 'information',
      'description' => __( 'Skill Bar description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'heading' => '.h-skill-bar',
    		'bar_text' => '.x-skill-bar',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'heading',
      'text',
      __( 'Heading', csl18n() ),
      __( 'Enter the heading of your Skill Bar.', csl18n() ),
      __( 'Skill Bar Title', csl18n() )
    );

    $this->addControl(
      'percent',
      'text',
      __( 'Percent', csl18n() ),
      __( 'Enter the percentage of your skill and be sure to include the percentage sign (e.g. 90%).', csl18n() ),
      '90%'
    );

    $this->addControl(
      'bar_text',
      'text',
      __( 'Bar Text', csl18n() ),
      __( 'Enter in some alternate text in place of the percentage inside the Skill Bar.', csl18n() ),
      ''
    );

    $this->addControl(
      'bar_bg_color',
      'color',
      __( 'Bar Background Color', csl18n() ),
      __( 'Select the background color of your Skill Bar.', csl18n() ),
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_skill_bar',
		    'title'        => __( 'Skill Bar', csl18n() ),
		    'section'    => __( 'Information', csl18n() ),
		    'description' => __( 'Include an informational skill bar', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/skill-bar/',
		  'params'      => array(
		      array(
		        'param_name'  => 'heading',
		        'heading'     => __( 'Heading', csl18n() ),
		        'description' => __( 'Enter the heading of your skill bar.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'percent',
		        'heading'     => __( 'Percent', csl18n() ),
		        'description' => __( 'Enter the percentage of your skill and be sure to include the percentage sign (i.e. 90%).', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'bar_text',
		        'heading'     => __( 'Bar Text', csl18n() ),
		        'description' => __( 'Enter in some alternate text in place of the percentage inside the skill bar.', csl18n() ),
		        'type'        => 'textfield',
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

    $shortcode = "[x_skill_bar heading=\"$heading\" percent=\"$percent\" bar_text=\"$bar_text\" bar_bg_color=\"{$bar_bg_color}\"{$extra}]";

    return $shortcode;

  }

}