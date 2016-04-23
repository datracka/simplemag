<?php

class CS_Google_Map_Marker extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'google-map-marker',
      'title'       => __( 'Google Map Marker', csl18n() ),
      'section'     => '_media',
      'description' => __( 'Google Map Marker description.', csl18n() ),
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
      'lat',
      'text',
      __( 'Latitude', csl18n() ),
      __( 'Enter the latitude for your map marker.', csl18n() ),
      '40.7056308'
    );

    $this->addControl(
      'lng',
      'text',
      __( 'Longitude', csl18n() ),
      __( 'Enter the longitude for your map marker.', csl18n() ),
      '-73.9780035'
    );

    $this->addControl(
      'info',
      'text',
      __( 'Text', csl18n() ),
      __( 'Enter in optional text to appear if your map marker is hovered over.', csl18n() ),
      ''
    );

    $this->addControl(
      'image',
      'image',
      __( 'Image', csl18n() ),
      __( 'Upload an optional alternate image to use in place of the standard map marker.', csl18n() ),
      ''
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_google_map_marker',
		    'title'            => __( 'Google Map Marker', csl18n() ),
		    'weight'          => 530,
		    'icon'            => 'google-map-marker',
		    'section'        => __( 'Media', csl18n() ),
		    'description'     => __( 'Place a location marker on your Google map', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/map/',
		  'params'          => array(
		      array(
		        'param_name'  => 'lat',
		        'heading'     => __( 'Latitude', csl18n() ),
		        'description' => __( 'Enter in the latitude of your marker.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'lng',
		        'heading'     => __( 'Longitude', csl18n() ),
		        'description' => __( 'Enter in the longitude of your marker.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'info',
		        'heading'     => __( 'Additional Information', csl18n() ),
		        'description' => __( 'Optional description text to appear in a popup when your marker is clicked on.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'image',
		        'heading'     => __( 'Custom Marker Image', csl18n() ),
		        'description' => __( 'Utilize a custom marker image instead of the default provided by Google.', csl18n() ),
		        'type'        => 'attach_image',
		      ),
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

  //   $shortcode = "[x_google_map_marker lat=\"{$lat}\" lng=\"{$lng}\" info=\"{$info}\" image=\"{$image}\"]";

  //   return $shortcode;

  // }

}