<?php

class CS_Callout extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'callout',
      'title'       => __( 'Callout', csl18n() ),
      'section'     => 'marketing',
      'description' => __( 'Callout description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'heading' => '.h-callout',
				'message' => '.p-callout',
				'button_text' => '.x-btn',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'heading',
      'text',
      __( 'Title &amp; Message', csl18n() ),
      __( 'Enter the title and message for your Callout below.', csl18n() ),
      __( 'Callout Title', csl18n() )
    );

    $this->addControl(
      'message',
      'textarea',
      NULL,
      NULL,
      __( 'The message text for your Callout goes here.', csl18n() ),
      array(
        'expandable' => __( 'Message', csl18n() )
      )
    );

    $this->addControl(
      'button_text',
      'text',
      __( 'Button Text', csl18n() ),
      __( 'Enter the text for your Callout button.', csl18n() ),
      __( 'Enter Your Text', csl18n() )
    );

    $this->addControl(
      'button_icon',
      'icon-choose',
      __( 'Button Icon', csl18n() ),
      __( 'Optionally enter the button icon.', csl18n() ),
      'lightbulb-o'
    );

    $this->addControl(
      'circle',
      'toggle',
      __( 'Marketing Circle', csl18n() ),
      __( 'Select to include a marketing circle around your button.', csl18n() ),
      false
    );

    $this->addSupport( 'link' );

    $this->addControl(
      'type',
      'choose',
      __( 'Alignment', csl18n() ),
      __( 'Select the alignment for your Callout.', csl18n() ),
      'left',
      array(
        'columns' => '3',
        'choices' => array(
          array( 'value' => 'left',   'tooltip' => __( 'Left', csl18n() ),   'icon' => fa_entity( 'align-left' ) ),
          array( 'value' => 'center', 'tooltip' => __( 'Center', csl18n() ), 'icon' => fa_entity( 'align-center' ) ),
          array( 'value' => 'right',  'tooltip' => __( 'Right', csl18n() ),  'icon' => fa_entity( 'align-right' ) )
        )
      )
    );

  }

  public function xsg() { $this->sg_map(
		  array(
		    'id'        => 'x_callout',
		    'title'        => __( 'Callout', csl18n() ),
		    'section'    => __( 'Marketing', csl18n() ),
		    'description' => __( 'Include a marketing callout into your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/callout/',
		  'params'      => array(
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Alignment', csl18n() ),
		        'description' => __( 'Select the alignment for your callout.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'Left'   => 'left',
		          'Center' => 'center',
		          'Right'  => 'right'
		        )
		      ),
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Enter the title for your callout.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'message',
		        'heading'     => __( 'Message', csl18n() ),
		        'description' => __( 'Enter the message for your callout.', csl18n() ),
		        'type'        => 'textarea',

		      ),
		      array(
		        'param_name'  => 'button_text',
		        'heading'     => __( 'Button Text', csl18n() ),
		        'description' => __( 'Enter the text for your callout button.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'button_icon',
		        'heading'     => __( 'Button Icon', csl18n() ),
		        'description' => __( 'Optionally enter the button icon.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array_keys( fa_all_unicode() )
		      ),
		      array(
		        'param_name'  => 'circle',
		        'heading'     => __( 'Marketing Circle', csl18n() ),
		        'description' => __( 'Select to include a marketing circle around your button.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'href',
		        'heading'     => __( 'Href', csl18n() ),
		        'description' => __( 'Enter in the URL you want your callout button to link to.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'target',
		        'heading'     => __( 'Target', csl18n() ),
		        'description' => __( 'Select to open your callout link button in a new window.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'blank'
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

    $href_target = ( $href_target == 'true' ) ? 'blank' : '';

    $shortcode = "[x_callout title=\"$heading\" message=\"$message\" type=\"$type\" button_text=\"$button_text\" circle=\"$circle\" button_icon=\"$button_icon\" href=\"$href\" href_title=\"$href_title\" target=\"$href_target\"{$extra}]";

    return $shortcode;

  }

}