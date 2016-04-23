<?php

class CS_Creative_CTA extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'creative-cta',
      'title'       => __( 'Creative CTA', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Creative CTA description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'autofocus' => array(
    		'text' => '.x-creative-cta',
    	)
    );
  }

  public function controls() {

    $this->addControl(
      'alt_padding',
      'dimensions',
      __( 'Padding', csl18n() ),
      __( 'Specify the padding you would like to use for your Creative CTA.', csl18n() ),
      array( '25px', '25px', '25px', '25px', 'linked' )
    );

    $this->addControl(
      'text',
      'text',
      __( 'Text', csl18n() ),
      __( 'Specify the text for your Creative CTA.', csl18n() ),
      __( 'Click Here<br>To Learn More!', csl18n() )
    );

    $this->addControl(
      'font_size',
      'text',
      __( 'Text Size', csl18n() ),
      __( 'Specify the size of your text.', csl18n() ),
      '36px'
    );

    $this->addControl(
      'graphic',
      'select',
      __( 'Graphic', csl18n() ),
      __( 'Choose between an icon and a custom image for your graphic.', csl18n() ),
      'icon',
      array(
        'columns' => '2',
        'choices' => array(
          array( 'value' => 'icon',  'label' => __( 'Icon', csl18n() ) ),
          array( 'value' => 'image', 'label' => __( 'Image', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'icon_type',
      'icon-choose',
      __( 'Icon', csl18n() ),
      __( 'Specify the icon you would like to use for your Creative CTA.', csl18n() ),
      'lightbulb-o',
      array(
        'condition' => array(
          'graphic' => 'icon'
        )
      )
    );

    $this->addControl(
      'icon_size',
      'text',
      __( 'Icon Size', csl18n() ),
      __( 'Specify the size of your icon.', csl18n() ),
      '48px',
      array(
        'condition' => array(
          'graphic' => 'icon'
        )
      )
    );

    $this->addControl(
      'image',
      'image',
      __( 'Image', csl18n() ),
      __( 'Specify the image you would like to use for your Creative CTA.', csl18n() ),
      '',
      array(
        'condition' => array(
          'graphic' => 'image'
        )
      )
    );

    $this->addControl(
      'image_width',
      'text',
      __( 'Image Width', csl18n() ),
      __( 'Specify the width of your image.', csl18n() ),
      '100px',
      array(
        'condition' => array(
          'graphic' => 'image'
        )
      )
    );

    $this->addControl(
      'animation',
      'choose',
      __( 'Animation', csl18n() ),
      __( 'Specify the animation you would like to use for you Creative CTA.', csl18n() ),
      'slide-top',
      array(
        'columns' => '4',
        'choices' => array(
          array( 'value' => 'slide-top',    'icon' => fa_entity( 'arrow-up' ) ),
          array( 'value' => 'slide-right',  'icon' => fa_entity( 'arrow-right' ) ),
          array( 'value' => 'slide-bottom', 'icon' => fa_entity( 'arrow-down' ) ),
          array( 'value' => 'slide-left',   'icon' => fa_entity( 'arrow-left' ) )
        )
      )
    );

    $this->addControl(
      'link',
      'text',
      __( 'Link', csl18n() ),
      __( 'Specify the URL for your Creative CTA.', csl18n() ),
      '#'
    );

    $this->addControl(
      'color',
      'color',
      __( 'Text Color', csl18n() ),
      __( 'Select the text color for your Creative CTA.', csl18n() ),
      ''
    );

    $this->addControl(
      'bg_color',
      'color',
      __( 'Background Color', csl18n() ),
      __( 'Select the background color for your Creative CTA.', csl18n() ),
      ''
    );

    $this->addControl(
      'bg_color_hover',
      'color',
      __( 'Background Color Hover', csl18n() ),
      __( 'Select the background color hover for your Creative CTA.', csl18n() ),
      ''
    );

  }

  public function xsg() { }

  public function render( $atts ) {

    extract( $atts );

    $alt_padding = implode( ' ', $alt_padding );

    if ( $graphic == 'icon' ) {
      $graphic = "icon=\"$icon_type\" icon_size=\"$icon_size\"";
    } else if ( $graphic == 'image' ) {
      $graphic = "image=\"$image\" image_width=\"$image_width\"";
    }
    $text = cs_clean_shortcode_att( $text );
    $shortcode = "[x_creative_cta padding=\"$alt_padding\" text=\"$text\" font_size=\"$font_size\" $graphic animation=\"$animation\" link=\"$link\" color=\"$color\" bg_color=\"$bg_color\" bg_color_hover=\"$bg_color_hover\"{$extra}]";

    return $shortcode;

  }

}