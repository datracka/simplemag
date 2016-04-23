<?php

class CS_Feature_List_Item extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'feature-list-item',
      'title'       => __( 'Feature List Item', csl18n() ),
      'section'     => '_content',
      'description' => __( 'Feature List Item description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'render'      => false,
      'delegate'    => true
    );
  }

  public function controls() {

    //
    // General.
    //

    $this->addControl(
      'title',
      'title',
      NULL,
      NULL,
      ''
    );

    $this->addControl(
      'content',
      'textarea',
      __( 'Content', csl18n() ),
      __( 'Specify the content for your Feature List Item.', csl18n() ),
      __( 'This is where the text for your Feature List Item should go. It&apos;s best to keep it short and sweet.', csl18n() ),
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
    // Graphic - icon and image.
    //

    $this->addControl(
      'graphic_icon',
      'icon-choose',
      __( 'Icon', csl18n() ),
      __( 'Specify the icon you would like to use for your Feature List Item.', csl18n() ),
      'ship',
      array(
        'condition' => array(
          'parent:graphic' => 'icon'
        )
      )
    );

    $this->addControl(
      'graphic_image',
      'image',
      __( 'Image', csl18n() ),
      __( 'Specify the image you would like to use for your Feature List Item.', csl18n() ),
      '',
      array(
        'condition' => array(
          'parent:graphic' => 'image'
        )
      )
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
      __( 'Choose a shape for your Feature List Item graphic.', csl18n() ),
      'square',
      array(
        'choices' => array(
          array( 'value' => 'square',  'label' => __( 'Square', csl18n() ) ),
          array( 'value' => 'rounded', 'label' => __( 'Rounded', csl18n() ) ),
          array( 'value' => 'circle',  'label' => __( 'Circle', csl18n() ) ),
          array( 'value' => 'hexagon', 'label' => __( 'Hexagon (Icon and Numbers Only)', csl18n() ) ),
          array( 'value' => 'badge',   'label' => __( 'Badge (Icon and Numbers Only)', csl18n() ) )
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
    // Link.
    //

    $this->addControl(
      'link_text',
      'text',
      __( 'Link Text', csl18n() ),
      __( 'Enter the text for your Feature List Item link. Leave blank to remove.', csl18n() ),
      ''
    );

    $this->addSupport( 'link' );

    $this->addControl(
      'link_color',
      'color',
      __( 'Link Color', csl18n() ),
      __( 'Specify a custom color for your Feature List Item link.', csl18n() ),
      ''
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

}