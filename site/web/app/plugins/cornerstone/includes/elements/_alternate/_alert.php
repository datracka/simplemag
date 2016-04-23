<?php

class CS_Alert extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'alert',
      'title'       => __( 'Alert', csl18n() ),
      'section'     => 'information',
      'description' => __( 'Alert description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'heading' => '.x-alert .h-alert',
				'content' => '.x-alert'
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'heading',
      'text',
      __( 'Heading &amp; Content', csl18n() ),
      __( 'Text for your alert heading and content.', csl18n() ),
      __( 'Alert Title', csl18n() )
    );

    $this->addControl(
      'content',
      'textarea',
      NULL,
      NULL,
      __( 'Click to inspect, then edit as needed.', csl18n() ),
      array(
        'expandable' => true
      )
    );

    $this->addControl(
      'type',
      'choose',
      __( 'Type', csl18n() ),
      __( 'There are multiple alert types for different situations. Select the one that best suits your needs.', csl18n() ),
      'success',
      array(
        'columns' => '5',
        'choices' => array(
          array( 'value' => 'muted',   'tooltip' => __( 'Muted', csl18n() ),   'icon' => fa_entity( 'ban' ) ),
          array( 'value' => 'success', 'tooltip' => __( 'Success', csl18n() ), 'icon' => fa_entity( 'check' ) ),
          array( 'value' => 'info',    'tooltip' => __( 'Info', csl18n() ),    'icon' => fa_entity( 'info' ) ),
          array( 'value' => 'warning', 'tooltip' => __( 'Warning', csl18n() ), 'icon' => fa_entity( 'exclamation-triangle' ) ),
          array( 'value' => 'danger',  'tooltip' => __( 'Danger', csl18n() ),  'icon' => fa_entity( 'exclamation-circle' ) )
        )
      )
    );

    $this->addControl(
      'close',
      'toggle',
      __( 'Close Button', csl18n() ),
      __( 'Enabling the close button will make the alert dismissible, allowing your users to remove it if desired.', csl18n() ),
      false
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_alert',
		    'title'        => __( 'Alert', csl18n() ),
		    'section'    => __( 'Information', csl18n() ),
		    'description' => __( 'Provide information to users with alerts', csl18n() ),
		    'demo' => 'http://theme.co/x/demo/integrity/1/shortcodes/alert/',
		  'params'      => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'heading',
		        'heading'     => __( 'Heading', csl18n() ),
		        'description' => __( 'Enter the heading of your alert.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Type', csl18n() ),
		        'description' => __( 'Select the alert style.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'Success' => 'success',
		          'Info'    => 'info',
		          'Warning' => 'warning',
		          'Danger'  => 'danger',
		          'Muted'   => 'muted'
		        )
		      ),
		      array(
		        'param_name'  => 'close',
		        'heading'     => __( 'Close', csl18n() ),
		        'description' => __( 'Select to display the close button.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {
  	// jsond( $atts );
    extract( $atts );

    $shortcode = "[x_alert type=\"$type\" close=\"$close\" heading=\"$heading\"{$extra}]{$content}[/x_alert]";

    return $shortcode;

  }

}