<?php

class CS_Feature_Box extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'feature-box',
      'title'       => __( 'Feature Box', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Feature Box description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' )
    );
  }

  public function controls() {

    //
    // General.
    //

    $this->addControl(
      'title',
      'text',
      __( 'Title &amp; Content', csl18n() ),
      __( 'Specify the title and content for your Feature Box.', csl18n() ),
      __( 'Feature Box Title', csl18n() )
    );

    $this->addControl(
      'content',
      'textarea',
      NULL,
      NULL,
      __( 'This is where the text for your Feature Box should go. It&apos;s best to keep it short and sweet.', csl18n() ),
      array(
        'expandable' => __( 'Content', csl18n() )
      )
    );

    $this->addControl(
      'title_color',
      'color',
      __( 'Title &amp; Content Colors', csl18n() ),
      __( 'Optionally specify colors for your title and content.', csl18n() ),
      ''
    );

    $this->addControl(
      'text_color',
      'color',
      NULL,
      NULL,
      ''
    );


    //
    // Graphic.
    //

    $this->addControl(
      'graphic',
      'select',
      __( 'Graphic', csl18n() ),
      __( 'Choose between an icon and a custom image for your graphic.', csl18n() ),
      'icon',
      array(
        'choices' => array(
          array( 'value' => 'icon',  'label' => __( 'Icon', csl18n() ) ),
          array( 'value' => 'image', 'label' => __( 'Image', csl18n() ) )
        )
      )
    );


    //
    // Graphic - icon and image.
    //

    $this->addControl(
      'graphic_icon',
      'icon-choose',
      NULL,
      NULL,
      'ship',
      array(
        'condition' => array(
          'graphic' => 'icon'
        )
      )
    );

    $this->addControl(
      'graphic_image',
      'image',
      NULL,
      NULL,
      '',
      array(
        'condition' => array(
          'graphic' => 'image'
        )
      )
    );


    //
    // Graphic - size.
    //

    $this->addControl(
      'graphic_size',
      'text',
      __( 'Graphic Size', csl18n() ),
      __( 'Specify the size of your graphic.', csl18n() ),
      '60px'
    );


    //
    // Graphic - colors.
    //

    $this->addControl(
      'graphic_color',
      'color',
      __( 'Graphic Color &amp; Background Color', csl18n() ),
      __( 'Specify the color and background color of your graphic.', csl18n() ),
      '#ffffff'
    );

    $this->addControl(
      'graphic_bg_color',
      'color',
      NULL,
      NULL,
      '#2ecc71'
    );


    //
    // Graphic - shape.
    //

    $this->addControl(
      'graphic_shape',
      'select',
      __( 'Graphic Shape', csl18n() ),
      __( 'Choose a shape for your Feature Box graphic.', csl18n() ),
      'square',
      array(
        'choices' => array(
          array( 'value' => 'square',  'label' => __( 'Square', csl18n() ) ),
          array( 'value' => 'rounded', 'label' => __( 'Rounded', csl18n() ) ),
          array( 'value' => 'circle',  'label' => __( 'Circle', csl18n() ) ),
          array( 'value' => 'hexagon', 'label' => __( 'Hexagon (Icon Only)', csl18n() ) ),
          array( 'value' => 'badge',   'label' => __( 'Badge (Icon Only)', csl18n() ) )
        )
      )
    );


    //
    // Graphic - border.
    //

    $this->addSupport( 'border',
      array(
        'name'         => 'graphic_border_style',
        'controlTitle' => __( 'Graphic Border', csl18n() ),
        'options'      => array(
          'condition' => array(
            'graphic_shape:not' => array( 'hexagon', 'badge' )
          )
        )
      ),
      array(
        'name'    => 'graphic_border_color',
        'options' => array(
          'condition' => array(
            'graphic_shape:not'        => array( 'hexagon', 'badge' ),
            'graphic_border_style:not' => 'none'
          )
        )
      ),
      array(
        'name'         => 'graphic_border_width',
        'defaultValue' => array( '2px', '2px', '2px', '2px', 'linked' ),
        'options'      => array(
          'condition' => array(
            'graphic_shape:not'        => array( 'hexagon', 'badge' ),
            'graphic_border_style:not' => 'none'
          )
        )
      )
    );


    //
    // Graphic - animation.
    //

    $this->addSupport( 'animation',
      array(
        'name'         => 'graphic_animation',
        'controlTitle' => __( 'Graphic Animation', csl18n() )
      ),
      array(
        'name'         => 'graphic_animation_offset',
        'controlTitle' => __( 'Graphic Animation Offset (%)', csl18n() ),
        'options'      => array(
          'condition' => array(
            'graphic_animation:not' => 'none'
          )
        )
      ),
      array(
        'name'         => 'graphic_animation_delay',
        'controlTitle' => __( 'Graphic Animation Delay (ms)', csl18n() ),
        'options'      => array(
          'condition' => array(
            'graphic_animation:not' => 'none'
          )
        )
      )
    );


    //
    // Link.
    //

    $this->addControl(
      'link_text',
      'text',
      __( 'Link Text', csl18n() ),
      __( 'Enter the text for your Feature Box link. Leave blank to remove.', csl18n() ),
      ''
    );

    $this->addSupport( 'link' );

    $this->addControl(
      'link_color',
      'color',
      __( 'Link Color', csl18n() ),
      __( 'Specify a custom color for your Feature Box link.', csl18n() ),
      ''
    );


    //
    // Alignment.
    //

    $this->addControl(
      'align_h',
      'select',
      __( 'Horizontal Alignment', csl18n() ),
      __( 'Select the horizontal alignment of the Feature Box.', csl18n() ),
      'center',
      array(
        'choices' => array(
          array( 'value' => 'left',   'label' => __( 'Left', csl18n() ) ),
          array( 'value' => 'center', 'label' => __( 'Center', csl18n() ) ),
          array( 'value' => 'right',  'label' => __( 'Right', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'align_v',
      'select',
      __( 'Vertical Alignment', csl18n() ),
      __( 'Select the vertical alignment of the Feature Box.', csl18n() ),
      'top',
      array(
        'choices' => array(
          array( 'value' => 'top',    'label' => __( 'Top', csl18n() ) ),
          array( 'value' => 'middle', 'label' => __( 'Middle', csl18n() ) )
        ),
        'condition' => array(
          'align_h:not' => 'center'
        )
      )
    );

    $this->addControl(
      'side_graphic_spacing',
      'text',
      __( 'Graphic Spacing', csl18n() ),
      __( 'Specify an amount of spacing you want between your side graphic and the content.', csl18n() ),
      '20px',
      array(
        'condition' => array(
          'align_h:not' => 'center'
        )
      )
    );

    $this->addControl(
      'max_width',
      'text',
      __( 'Max Width', csl18n() ),
      __( 'Enter in a max width for your Feature Box if desired. This will keep your Feature Box from stretching out too far on smaller breakpoints.', csl18n() ),
      'none'
    );

  }

  public function migrate( $element, $version ) {

  	if ( version_compare( $version, '1.0.10', '<' ) ) {
  		if ( !isset( $element['content'] ) || '' == $element['content'] && isset( $element['text'] ) ) {
				$element['content'] = $element['text'];
				unset($element['text']);
			}
  	}

		return $element;

  }

  public function xsg() { }

  public function render( $atts ) {

    extract( $atts );

    $params = array(
      'title'                 => $title,
      'title_color'           => $title_color,
      'text_color'            => $text_color,
      'graphic'               => $graphic,
      'graphic_size'          => $graphic_size,
      'graphic_shape'         => $graphic_shape,
      'graphic_color'         => $graphic_color,
      'graphic_bg_color'      => $graphic_bg_color,
      'align_h'               => $align_h,
      'align_v'               => $align_v,
      'side_graphic_spacing'  => $side_graphic_spacing,
      'max_width'             => $max_width
    );

    if ( $link_text != '' ) {
      $params['link_text']   = $link_text;
      $params['href']        = $href;
      $params['href_title']  = $href_title;
      $params['href_target'] = ( $href_target == 'true' ) ? 'blank' : '';
      $params['link_color']  = $link_color;
    }

    if ( $graphic_border_style != 'none' ) {
      $params['graphic_border'] = $this->borderStyle( $graphic_border_width, $graphic_border_style, $graphic_border_color );
    }

    if ( $graphic == 'icon' ) {
      $params['graphic_icon'] = $graphic_icon;
    } else if ( $graphic == 'image' ) {
      $params['graphic_image'] = $graphic_image;
    }

    if ( $graphic_animation != 'none' ) {
      $params['graphic_animation']        = $graphic_animation;
      $params['graphic_animation_offset'] = $graphic_animation_offset;
      $params['graphic_animation_delay']  = $graphic_animation_delay;
    }

    $shortcode = cs_build_shortcode( 'x_feature_box', $params, $extra, $content );

    return $shortcode;

  }

}