<?php

class CS_Image extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'image',
      'title'       => __( 'Image', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Image description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'src' => '' )
    );
  }

  public function controls() {

    $this->addControl(
      'image_style',
      'select',
      __( 'Style', csl18n() ),
      __( 'Select the image style.', csl18n() ),
      'none',
      array(
        'choices' => array(
          array( 'value' => 'none',      'label' => __( 'None', csl18n() ) ),
          array( 'value' => 'thumbnail', 'label' => __( 'Thumbnail', csl18n() ) ),
          array( 'value' => 'rounded',   'label' => __( 'Rounded', csl18n() ) ),
          array( 'value' => 'circle',    'label' => __( 'Circle', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'src',
      'image',
      __( 'Src', csl18n() ),
      __( 'Enter your image.', csl18n() ),
      ''
    );

    $this->addControl(
      'alt',
      'text',
      __( 'Alt', csl18n() ),
      __( 'Enter in the alt text for your image', csl18n() ),
      ''
    );

    $this->addControl(
      'link',
      'toggle',
      __( 'Link', csl18n() ),
      __( 'Select to wrap your image in an anchor tag.', csl18n() ),
      false
    );

    $this->addSupport( 'link' );

    $this->addControl(
      'info',
      'select',
      __( 'Info', csl18n() ),
      __( 'Select whether or not you want to add a popover or tooltip to your image.', csl18n() ),
      'none',
      array(
        'choices' => array(
          array( 'value' => 'none',    'label' => __( 'None', csl18n() ), ),
          array( 'value' => 'popover', 'label' => __( 'Popover', csl18n() ), ),
          array( 'value' => 'tooltip', 'label' => __( 'Tooltip', csl18n() ), )
        )
      ),
      array(
        'condition' => array(
          'link' => true
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
          array( 'value' => 'top',    'icon' => fa_entity('arrow-up'),    'tooltip' => __( 'Top', csl18n() ) ),
          array( 'value' => 'right',  'icon' => fa_entity('arrow-right'), 'tooltip' => __( 'Right', csl18n() ) ),
          array( 'value' => 'bottom', 'icon' => fa_entity('arrow-down'),  'tooltip' => __( 'Bottom', csl18n() ) ),
          array( 'value' => 'left',   'icon' => fa_entity('arrow-left'),  'tooltip' => __( 'Left', csl18n() ) )
        )
      ),
      array(
        'condition' => array(
          'link' => true,
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
          'link' => true,
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
          'link' => true,
          'info' => array( 'popover', 'tooltip' )
        )
      )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_image',
		    'title'        => __( 'Image', csl18n() ),
		    'section'    => __( 'Media', csl18n() ),
		    'description' => __( 'Include an image in your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/images/',
		  'params'      => array(
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Style', csl18n() ),
		        'description' => __( 'Select the image style.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'None'      => 'none',
		          'Thumbnail' => 'thumbnail',
		          'Rounded'   => 'rounded',
		          'Circle'    => 'circle'
		        )
		      ),
		      array(
		        'param_name'  => 'float',
		        'heading'     => __( 'Float', csl18n() ),
		        'description' => __( 'Optionally float the image.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'None'  => 'none',
		          'Left'  => 'left',
		          'Right' => 'right'
		        )
		      ),
		      array(
		        'param_name'  => 'src',
		        'heading'     => __( 'Src', csl18n() ),
		        'description' => __( 'Enter your image.', csl18n() ),
		        'type'        => 'attach_image',
		      ),
		      array(
		        'param_name'  => 'alt',
		        'heading'     => __( 'Alt', csl18n() ),
		        'description' => __( 'Enter in the alt text for your image.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'link',
		        'heading'     => __( 'Link', csl18n() ),
		        'description' => __( 'Select to wrap your image in an anchor tag.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'href',
		        'heading'     => __( 'Href', csl18n() ),
		        'description' => __( 'Enter in the URL you want your image to link to. If using this image for a lightbox, enter the URL of your media here (e.g. YouTube embed URL, et cetera). Leave this field blank if you want to link to the image uploaded to the "Src" for your lightbox.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Enter in the title attribute you want for your image (will also double as title for popover or tooltip if you have chosen to display one).', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'target',
		        'heading'     => __( 'Target', csl18n() ),
		        'description' => __( 'Select to open your image link in a new window.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'blank'
		      ),
		      array(
		        'param_name'  => 'info',
		        'heading'     => __( 'Info', csl18n() ),
		        'description' => __( 'Select whether or not you want to add a popover or tooltip to your image.', csl18n() ),
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
		        'description' => __( 'Use this option to select a different thumbnail for your lightbox thumbnail navigation or to set an image if you are linking out to a video. Will default to the "Src" image if nothing is set.', csl18n() ),
		        'type'        => 'attach_image',
		      ),
		      array(
		        'param_name'  => 'lightbox_video',
		        'heading'     => __( 'Lightbox Video', csl18n() ),
		        'description' => __( 'Select if you are linking to a video from this image in the lightbox.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'lightbox_caption',
		        'heading'     => __( 'Lightbox Caption', csl18n() ),
		        'description' => __( 'Lightbox caption text.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'id',
		        'heading'     => __( 'ID', csl18n() ),
		        'description' => __( '(Optional) Enter a unique ID.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function render( $atts ) {

    extract( $atts );

    $href_target = ( $href_target == 'true' ) ? 'blank' : '';

    $shortcode = "[x_image type=\"$image_style\" src=\"$src\" alt=\"$alt\" link=\"$link\" href=\"$href\" title=\"$href_title\" target=\"$href_target\" info=\"$info\" info_place=\"$info_place\" info_trigger=\"$info_trigger\" info_content=\"$info_content\"{$extra}]";

    return $shortcode;

  }

}