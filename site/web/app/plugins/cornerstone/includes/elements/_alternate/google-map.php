<?php

class CS_Google_Map extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'google-map',
      'title'       => __( 'Google Map', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Google Map description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'renderChild' => true
    );
  }

  public function controls() {

    $this->addControl(
      'elements',
      'sortable',
      __( 'Map Markers', csl18n() ),
      __( 'Optionally include markers to your map to specify certain locations.', csl18n() ),
      NULL,
      array(
      	'element'   => 'google-map-marker',
        'newTitle' => __( 'Map Marker %s', csl18n() )
      )
    );

    $this->addControl(
      'lat',
      'text',
      __( 'Latitude', csl18n() ),
      __( 'Enter the latitude for the center of your map.', csl18n() ),
      '40.7056308'
    );

    $this->addControl(
      'lng',
      'text',
      __( 'Longitude', csl18n() ),
      __( 'Enter the longitude for the center of your map.', csl18n() ),
      '-73.9780035'
    );

    $this->addControl(
      'zoom',
      'number',
      __( 'Zoom', csl18n() ),
      __( 'Specify a number between 1 and 18 for the zoom level of your map.', csl18n() ),
      '12'
    );

    $this->addControl(
      'zoom_control',
      'toggle',
      __( 'Zoom Control', csl18n() ),
      __( 'Enable to display the zoom controls for your map.', csl18n() ),
      false
    );

    $this->addControl(
      'drag',
      'toggle',
      __( 'Draggable', csl18n() ),
      __( 'Enable to make your map draggable.', csl18n() ),
      false
    );

    $this->addControl(
      'height',
      'text',
      __( 'Height', csl18n() ),
      __( 'Specify a custom height for your map if desired. You may use pixels, ems, or percentages.', csl18n() ),
      ''
    );

    $this->addControl(
      'hue',
      'color',
      __( 'Map Hue', csl18n() ),
      __( 'Specifying a hexadecimal map hue will give your map a different color palette.', csl18n() ),
      false
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
		    'id'            => 'x_google_map',
		    'title'            => __( 'Google Map', csl18n() ),
		    'weight'          => 530,
		    'icon'            => 'google-map',
		    'section'        => __( 'Media', csl18n() ),
		    'description'     => __( 'Embed a customizable Google map', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/map/',
		  'params'          => array(
		      array(
		        'param_name'  => 'lat',
		        'heading'     => __( 'Latitude', csl18n() ),
		        'description' => __( 'Enter in the center latitude of your map.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'lng',
		        'heading'     => __( 'Longitude', csl18n() ),
		        'description' => __( 'Enter in the center longitude of your map.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'drag',
		        'heading'     => __( 'Draggable', csl18n() ),
		        'description' => __( 'Select to allow your users to drag the map view.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'zoom',
		        'heading'     => __( 'Zoom Level', csl18n() ),
		        'description' => __( 'Choose the initial zoom level of your map. This value should be between 1 and 18. 1 is fully zoomed out and 18 is right at street level.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'zoom_control',
		        'heading'     => __( 'Zoom Control', csl18n() ),
		        'description' => __( 'Select to activate the zoom control for the map.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'height',
		        'heading'     => __( 'Height', csl18n() ),
		        'description' => __( 'Choose an optional height for your map. If no height is selected, a responsive, proportional unit will be used. Any type of unit is acceptable (e.g. 450px, 30em, 40%, et cetera).', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'hue',
		        'heading'     => __( 'Custom Color', csl18n() ),
		        'description' => __( 'Choose an optional custom color for your map.', csl18n() ),
		        'type'        => 'colorpicker',
		      ),
		      array(
		        'param_name'  => 'no_container',
		        'heading'     => __( 'No Container', csl18n() ),
		        'description' => __( 'Select to remove the container around the map.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style(),
		    )
		  )
		);
  }

  public function render( $atts ) {

    extract( $atts );

    $elements = ( isset( $elements ) ) ? $elements : array();
    $contents = '';

    foreach ( $elements as $e ) {

      $contents .= '[x_google_map_marker lat="' . $e['lat'] . '" lng="' . $e['lng'] . '" info="' . $e['info'] . '" image="' . $e['image'] . '"]';

    }

    $shortcode = "[x_google_map lat=\"{$lat}\" lng=\"{$lng}\" zoom=\"{$zoom}\" zoom_control=\"{$zoom_control}\" drag=\"{$drag}\" height=\"{$height}\" hue=\"{$hue}\" no_container=\"{$no_container}\" {$extra}]{$contents}[/x_google_map]";

    return $shortcode;

  }

}