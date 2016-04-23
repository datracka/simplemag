<?php

class CS_Map_Embed extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'map-embed',
      'title'       => __( 'Map Embed', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Map Embed description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'content' => '' )
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'textarea',
      __( 'Embed Code', csl18n() ),
      __( 'Input your &lt;iframe&gt; or &lt;embed&gt; code from a third party service.', csl18n() ),
      ''
    );

    $this->addControl(
      'no_container',
      'toggle',
      __( 'No Container', csl18n() ),
      __( 'Select to remove the container around the map.', csl18n() ),
      false
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_map',
		    'title'        => __( 'Map (Embed)', csl18n() ),
		    'section'    => __( 'Media', csl18n() ),
		    'description' => __( 'Embed a map from a third-party provider', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/map/',
		  'params'      => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Code (See Notes Below)', csl18n() ),
		        'description' => __( 'Switch to the "text" editor and do not place anything else here other than your &lsaquo;iframe&rsaquo; or &lsaquo;embed&rsaquo; code.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'no_container',
		        'heading'     => __( 'No Container', csl18n() ),
		        'description' => __( 'Select to remove the container around the map.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style(),
		    )
		  )
		);
  }

  public function is_active() {
    return current_user_can( 'unfiltered_html' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_map no_container=\"$no_container\"{$extra}]{$content}[/x_map]";

    return $shortcode;

  }

}