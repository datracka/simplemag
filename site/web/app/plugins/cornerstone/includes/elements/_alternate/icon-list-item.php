<?php

class CS_Icon_List_Item extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'icon-list-item',
      'title'       => __( 'Icon List Item', csl18n() ),
      'section'     => '_typography',
      'description' => __( 'Icon List Item description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'render'      => false,
      'delegate'    => true
    );
  }

  public function controls() {

    $this->addControl(
      'title',
      'title',
      NULL,
      NULL,
      ''
    );

    $this->addControl(
      'type',
      'icon-choose',
      __( 'Icon', csl18n() ),
      __( 'Specify the icon you would like to use as the bullet for your Icon List Item.', csl18n() ),
      'check'
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_icon_list_item',
		    'title'            => __( 'Icon List Item', csl18n() ),
		    'weight'          => 770,
		    'icon'            => 'icon-list-item',
		    'section'        => __( 'Typography', csl18n() ),
		    'description'     => __( 'Include an icon list item in your icon list', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/icon-list/',
		  'params'          => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Type', csl18n() ),
		        'description' => __( 'Select your icon.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array_keys( fa_all_unicode() )
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  // public function render( $atts ) {

  //   extract( $atts );

  //   $extra = $this->extra( array(
  //     'id'    => $id,
  //     'class' => $class,
  //     'style' => $style
  //   ) );

  //   $shortcode = "[x_icon_list_item type=\"{$type}\"{$extra}]{$title}[/x_icon_list_item]";

  //   return $shortcode;

  // }

}