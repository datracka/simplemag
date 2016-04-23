<?php

class CS_Icon_List extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'icon-list',
      'title'       => __( 'Icon List', csl18n() ),
      'section'     => 'typography',
      'description' => __( 'Icon List description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'renderChild' => true
    );
  }

  public function controls() {

    $this->addControl(
      'elements',
      'sortable',
      __( 'Icon List Items', csl18n() ),
      __( 'Add new items to your Icon List.', csl18n() ),
      array(
        array( 'title' => __( 'Icon List Item 1', csl18n() ), 'type' => 'check' ),
        array( 'title' => __( 'Icon List Item 2', csl18n() ), 'type' => 'check' ),
        array( 'title' => __( 'Icon List Item 3', csl18n() ), 'type' => 'times' )
      ),
      array(
      	'element'  => 'icon-list-item',
      	'newTitle' => __( 'Icon List Item %s', csl18n() ),
      	'floor'    => 1
      )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_icon_list',
		    'title'            => __( 'Icon List', csl18n() ),
		    'weight'          => 780,
		    'icon'            => 'icon-list',
		    'section'        => __( 'Typography', csl18n() ),
		    'description'     => __( 'Include an icon list in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/icon-list/',
		  'params'          => array(
		      Cornerstone_Shortcode_Generator::map_default_id( array( 'advanced' => false) ),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {

    extract( $atts );

    $contents = '';

    foreach ( $elements as $e ) {

      $item_extra = $this->extra( array(
        'id'    => $e['id'],
        'class' => $e['class'],
        'style' => $e['style']
      ) );

      $contents .= '[x_icon_list_item type="' . $e['type'] .'"' . $item_extra . ']' . $e['title'] . '[/x_icon_list_item]';

    }

    $shortcode = "[x_icon_list{$extra}]{$contents}[/x_icon_list]";

    return $shortcode;

  }

}