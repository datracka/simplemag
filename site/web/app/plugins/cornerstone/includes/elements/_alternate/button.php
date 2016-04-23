<?php

class CS_Button extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'button',
      'title'       => __( 'Button', csl18n() ),
      'section'     => 'marketing',
      'description' => __( 'Button description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'content' => '.x-btn'
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'text',
      __( 'Text', csl18n() ),
      __( 'Enter your text.', csl18n() ),
      __( 'Click Me!', csl18n() )
    );

    $this->addSupport( 'link' );

    $this->addControl(
      'type',
      'select',
      __( 'Type', csl18n() ),
      __( 'Select the button type.', csl18n() ),
      'global',
      array(
        'choices' => array(
          array( 'value' => 'global',      'label' => __( '&ndash; Global Setting &ndash;', csl18n() ) ),
          array( 'value' => 'real',        'label' => __( 'Real', csl18n() ) ),
          array( 'value' => 'flat',        'label' => __( 'Flat', csl18n() ) ),
          array( 'value' => 'transparent', 'label' => __( 'Transparent', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'shape',
      'select',
      __( 'Shape', csl18n() ),
      __( 'Select the button shape.', csl18n() ),
      'global',
      array(
        'choices' => array(
          array( 'value' => 'global',  'label' => __( '&ndash; Global Setting &ndash;', csl18n() ) ),
          array( 'value' => 'square',  'label' => __( 'Square', csl18n() ) ),
          array( 'value' => 'rounded', 'label' => __( 'Rounded', csl18n() ) ),
          array( 'value' => 'pill',    'label' => __( 'Pill', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'button_size',
      'select',
      __( 'Size', csl18n() ),
      __( 'Select the button size.', csl18n() ),
      'large',
      array(
        'choices' => array(
          array( 'value' => 'mini',    'label' => __( 'Mini', csl18n() ) ),
          array( 'value' => 'small',   'label' => __( 'Small', csl18n() ) ),
          array( 'value' => 'regular', 'label' => __( 'Regular', csl18n() ) ),
          array( 'value' => 'large',   'label' => __( 'Large', csl18n() ) ),
          array( 'value' => 'x-large', 'label' => __( 'X-Large', csl18n() ) ),
          array( 'value' => 'jumbo',   'label' => __( 'Jumbo', csl18n() ) )
        ),
        'offState' => 'notreallyno'
      )
    );

    $this->addControl(
      'block',
      'toggle',
      __( 'Block', csl18n() ),
      __( 'Select to make your button go fullwidth.', csl18n() ),
      false
    );

    $this->addControl(
      'circle',
      'toggle',
      __( 'Marketing Circle', csl18n() ),
      __( 'Select to include a marketing circle around your button.', csl18n() ),
      false
    );

    $this->addControl(
      'icon_toggle',
      'toggle',
      __( 'Enable Icon', csl18n() ),
      __( 'Select if you would like to add an icon to your button', csl18n() ),
      false
    );

    $this->addControl(
      'icon_placement',
      'choose',
      __( 'Icon Placement', csl18n() ),
      __( 'Place the icon before or after the button text, or even override the button text.', csl18n() ),
      'before',
      array(
        'condition' => array( 'icon_toggle' => true ),
        'columns' => '3',
        'choices' => array(
          array( 'value' => 'notext', 'label' => __( 'Icon Only', csl18n() ),  'icon' => fa_entity( 'ban' ) ),
          array( 'value' => 'before', 'label' => __( 'Before', csl18n() ),  'icon' => fa_entity( 'arrow-left' ) ),
          array( 'value' => 'after',  'label' => __( 'After', csl18n() ), 'icon' => fa_entity( 'arrow-right' ) )
        )
      )
    );

    $this->addControl(
      'icon_type',
      'icon-choose',
      __( 'Icon', csl18n() ),
      __( 'Icon to be displayed inside your button.', csl18n() ),
      'lightbulb-o',
      array(
        'condition' => array( 'icon_toggle' => true )
      )
    );

    $this->addControl(
      'info',
      'select',
      __( 'Info', csl18n() ),
      __( 'Select whether or not you want to add a popover or tooltip to your button.', csl18n() ),
      'none',
      array(
        'choices' => array(
          array( 'value' => 'none',    'label' => __( 'None', csl18n() ) ),
          array( 'value' => 'popover', 'label' => __( 'Popover', csl18n() ) ),
          array( 'value' => 'tooltip', 'label' => __( 'Tooltip', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'info_place',
      'choose',
      __( 'Info Placement', csl18n() ),
      __( 'Select where you want your popover or tooltip to appear.', csl18n() ),
      'top',
      array(
        'columns' => '4',
        'choices' => array(
          array( 'value' => 'top',    'icon' => fa_entity( 'arrow-up' ),    'tooltip' => __( 'Top', csl18n() ) ),
          array( 'value' => 'right',  'icon' => fa_entity( 'arrow-right' ), 'tooltip' => __( 'Right', csl18n() ) ),
          array( 'value' => 'bottom', 'icon' => fa_entity( 'arrow-down' ),  'tooltip' => __( 'Bottom', csl18n() ) ),
          array( 'value' => 'left',   'icon' => fa_entity( 'arrow-left' ),  'tooltip' => __( 'Left', csl18n() ) )
        ),
        'condition' => array(
          'info' => array( 'popover', 'tooltip' )
        )
      )
    );

    $this->addControl(
      'info_trigger',
      'select',
      __( 'Info Trigger', csl18n() ),
      __( 'Select what actions you want to trigger the popover or tooltip.', csl18n() ),
      'hover',
      array(
        'choices' => array(
          array( 'value' => 'hover', 'label' => __( 'Hover', csl18n() ) ),
          array( 'value' => 'click', 'label' => __( 'Click', csl18n() ) ),
          array( 'value' => 'focus', 'label' => __( 'Focus', csl18n() ) )
        ),
        'condition' => array(
          'info' => array( 'popover', 'tooltip' )
        )
      )
    );

    $this->addControl(
      'info_content',
      'text',
      __( 'Info Content', csl18n() ),
      __( 'Extra content for the popover.', csl18n() ),
      '',
      array(
        'condition' => array(
          'info' => array( 'popover', 'tooltip' )
        )
      )
    );

    // $this->addControl(
    //   'lightbox_thumb',
    //   'image',
    //   __( 'Lightbox Thumbnail', csl18n() ),
    //   __( 'Use this option to select a thumbnail for your lightbox thumbnail navigation or to set an image if you are linking out to a video.', csl18n() ),
    //   ''
    // );

    // $this->addControl(
    //   'lightbox_video',
    //   'toggle',
    //   __( 'Lightbox Video', csl18n() ),
    //   __( 'Select if you are linking to a video from this button in the lightbox.', csl18n() ),
    //   false
    // );

    // $this->addControl(
    //   'lightbox_caption',
    //   'text',
    //   __( 'Lightbox Caption', csl18n() ),
    //   __( 'Lightbox caption text.', csl18n() ),
    //   ''
    // );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_button',
		    'title'        => __( 'Button', csl18n() ),
		    'section'    => __( 'Marketing', csl18n() ),
		    'description' => __( 'Add a clickable button to your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/buttons',
		  'params'      => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => '',
		      ),
		      array(
		        'param_name'  => 'shape',
		        'heading'     => __( 'Shape', csl18n() ),
		        'description' => __( 'Select the button shape.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'Square'  => 'square',
		          'Rounded' => 'rounded',
		          'Pill'    => 'pill'
		        )
		      ),
		      array(
		        'param_name'  => 'size',
		        'heading'     => __( 'Size', csl18n() ),
		        'description' => __( 'Select the button size.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'Mini'        => 'mini',
		          'Small'       => 'small',
		          'Standard'    => 'regular',
		          'Large'       => 'large',
		          'Extra Large' => 'x-large',
		          'Jumbo'       => 'jumbo'
		        )
		      ),
		      array(
		        'param_name'  => 'float',
		        'heading'     => __( 'Float', csl18n() ),
		        'description' => __( 'Optionally float the button.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'None'  => 'none',
		          'Left'  => 'left',
		          'Right' => 'right'
		        )
		      ),
		      array(
		        'param_name'  => 'block',
		        'heading'     => __( 'Block', csl18n() ),
		        'description' => __( 'Select to make your button go fullwidth.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'circle',
		        'heading'     => __( 'Marketing Circle', csl18n() ),
		        'description' => __( 'Select to include a marketing circle around your button.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'icon_only',
		        'heading'     => __( 'Icon Only', csl18n() ),
		        'description' => __( 'Select if you are only using an icon in your button.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'href',
		        'heading'     => __( 'Href', csl18n() ),
		        'description' => __( 'Enter in the URL you want your button to link to.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Enter in the title attribute you want for your button (will also double as title for popover or tooltip if you have chosen to display one).', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'target',
		        'heading'     => __( 'Target', csl18n() ),
		        'description' => __( 'Select to open your button link in a new window.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'blank'
		      ),
		      array(
		        'param_name'  => 'info',
		        'heading'     => __( 'Info', csl18n() ),
		        'description' => __( 'Select whether or not you want to add a popover or tooltip to your button.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'None'    => 'none',
		          'Popover' => 'popover',
		          'Tooltip' => 'tooltip'
		        )
		      ),
		      array(
		        'param_name'  => 'info_place',
		        'heading'     => __( 'Info Placement', csl18n() ),
		        'description' => __( 'Select where you want your popover or tooltip to appear.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'Top'    => 'top',
		          'Left'   => 'left',
		          'Right'  => 'right',
		          'Bottom' => 'bottom'
		        )
		      ),
		      array(
		        'param_name'  => 'info_trigger',
		        'heading'     => __( 'Info Trigger', csl18n() ),
		        'description' => __( 'Select what actions you want to trigger the popover or tooltip.', csl18n() ),
		        'type'        => 'dropdown',

		        'value'       => array(
		          'Hover' => 'hover',
		          'Click' => 'click',
		          'Focus' => 'focus'
		        )
		      ),
		      array(
		        'param_name'  => 'info_content',
		        'heading'     => __( 'Info Content', csl18n() ),
		        'description' => __( 'Extra content for the popover.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'lightbox_thumb',
		        'heading'     => __( 'Lightbox Thumbnail', csl18n() ),
		        'description' => __( 'Use this option to select a thumbnail for your lightbox thumbnail navigation or to set an image if you are linking out to a video.', csl18n() ),
		        'type'        => 'attach_image',

		      ),
		      array(
		        'param_name'  => 'lightbox_video',
		        'heading'     => __( 'Lightbox Video', csl18n() ),
		        'description' => __( 'Select if you are linking to a video from this button in the lightbox.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'lightbox_caption',
		        'heading'     => __( 'Lightbox Caption', csl18n() ),
		        'description' => __( 'Lightbox caption text.', csl18n() ),
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

    $href_target = ( $href_target == 'true' ) ? 'blank' : '';
    $icon_only = 'false';

    if ( $icon_toggle == 'true' ) {

      $icon_markup = "[x_icon type=\"{$icon_type}\"]";

      if ( $icon_placement == 'notext' ) {
        $icon_only = 'true';
        $content = $icon_markup;
      } elseif ( $icon_placement == 'before' ) {
        $content = $icon_markup . $content;
      } elseif ( $icon_placement == 'after' ) {
        $content .= $icon_markup;
      }
    }

    $shape = ($shape != 'global' ) ? "shape=\"$shape\"" : '';
    $type = ($type != 'global' ) ? "type=\"$type\"" : '';

    $shortcode = "[x_button {$type} {$shape} size=\"$button_size\" block=\"$block\" circle=\"$circle\" icon_only=\"$icon_only\" href=\"$href\" title=\"$href_title\" target=\"$href_target\" info=\"$info\" info_place=\"$info_place\" info_trigger=\"$info_trigger\" info_content=\"$info_content\"{$extra}]{$content}[/x_button]";

    return $shortcode;

  }

}