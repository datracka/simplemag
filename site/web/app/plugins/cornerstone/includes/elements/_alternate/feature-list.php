<?php

class CS_Feature_List extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'feature-list',
      'title'       => __( 'Feature List', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Feature List description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'renderChild' => true
    );
  }

  public function controls() {

    $this->addControl(
      'elements',
      'sortable',
      __( 'Feature List Items', csl18n() ),
      __( 'Add your Feature List Items here.', csl18n() ),
      array(
        array(
          'title'                 => __( 'Feature List Item', csl18n() ),
          'text'                  => __( 'This is an Feature List Item that is part of an Feature List. Notice the connector between the three graphics to show that they are related.', csl18n() ),
          'graphic_shape'         => 'circle',
          'graphic_icon'          => 'diamond',
          'graphic_icon_color'    => '#3498db',
          'graphic_icon_bg_color' => '#272727'
        ),
        array(
          'title'                 => __( 'Feature List Item', csl18n() ),
          'text'                  => __( 'This is an Feature List Item that is part of an Feature List. Notice the connector between the three graphics to show that they are related.', csl18n() ),
          'graphic_shape'         => 'circle',
          'graphic_icon'          => 'bicycle',
          'graphic_icon_color'    => '#9b59b6',
          'graphic_icon_bg_color' => '#272727'
        ),
        array(
          'title'                 => __( 'Feature List Item', csl18n() ),
          'text'                  => __( 'This is an Feature List Item that is part of an Feature List. Notice the connector between the three graphics to show that they are related.', csl18n() ),
          'graphic_shape'         => 'circle',
          'graphic_icon'          => 'envelope-o',
          'graphic_icon_color'    => '#2ecc71',
          'graphic_icon_bg_color' => '#272727'
        )
      ),
      array(
      	'element'   => 'feature-list-item',
        'newTitle' => __( 'Feature List Item %s', csl18n() )
      )
    );


    //
    // Graphic.
    //

    $this->addControl(
      'graphic',
      'select',
      __( 'Graphic', csl18n() ),
      __( 'Choose between an icon, a custom image, or incremental numbers for your graphic.', csl18n() ),
      'icon',
      array(
        'choices' => array(
          array( 'value' => 'icon',    'label' => __( 'Icon', csl18n() ) ),
          array( 'value' => 'image',   'label' => __( 'Image', csl18n() ) ),
          array( 'value' => 'numbers', 'label' => __( 'Numbers', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'graphic_size',
      'text',
      __( 'Graphic Size', csl18n() ),
      __( 'Specify the size of your graphic.', csl18n() ),
      '60px'
    );


    //
    // Alignment.
    //

    $this->addControl(
      'align_h',
      'select',
      __( 'Horizontal Alignment', csl18n() ),
      __( 'Select the horizontal alignment of the Feature List Item.', csl18n() ),
      'left',
      array(
        'choices' => array(
          array( 'value' => 'left',  'label' => __( 'Left', csl18n() ) ),
          array( 'value' => 'right', 'label' => __( 'Right', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'align_v',
      'select',
      __( 'Vertical Alignment', csl18n() ),
      __( 'Select the vertical alignment of the Feature List Item.', csl18n() ),
      'top',
      array(
        'choices' => array(
          array( 'value' => 'top',    'label' => __( 'Top', csl18n() ) ),
          array( 'value' => 'middle', 'label' => __( 'Middle', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'side_graphic_spacing',
      'text',
      __( 'Graphic Spacing', csl18n() ),
      __( 'Specify an amount of spacing you want between your side graphic and the content.', csl18n() ),
      '20px'
    );

    $this->addControl(
      'max_width',
      'text',
      __( 'Max Width', csl18n() ),
      __( 'Enter in a max width for your Feature List Item if desired. This will keep your Feature List Item from stretching out too far on smaller breakpoints.', csl18n() ),
      'none'
    );


    //
    // Connector.
    //

    $this->addControl(
      'connector_style',
      'select',
      __( 'Connector Style, Color, &amp; Width', csl18n() ),
      __( 'Specify the style of the connector between graphics.', csl18n() ),
      'dashed',
      array(
        'choices' => array(
          array( 'value' => 'solid',  'label' => __( 'Solid', csl18n() ) ),
          array( 'value' => 'dashed', 'label' => __( 'Dashed', csl18n() ) ),
          array( 'value' => 'dotted', 'label' => __( 'Dotted', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'connector_color',
      'color',
      NULL,
      NULL,
      '#272727'
    );

    $this->addControl(
      'connector_width',
      'text',
      NULL,
      NULL,
      '1px'
    );


    //
    // Animations.
    //

    $this->addControl(
      'graphic_animation',
      'select',
      __( 'Graphic Animation', csl18n() ),
      __( 'Optionally add animation to your element as users scroll down the page.', csl18n() ),
      'none',
      array(
        'choices' => Cornerstone_Control_Mixins::animationChoices()
      )
    );

    $this->addControl(
      'connector_animation',
      'select',
      __( 'Connector Animation', csl18n() ),
      __( 'Optionally add animation to your element as users scroll down the page.', csl18n() ),
      'none',
      array(
        'choices' => Cornerstone_Control_Mixins::animationChoices()
      )
    );

    $this->addControl(
      'animation_offset',
      'text',
      __( 'Animation Offset (%)', csl18n() ),
      __( 'Specify a percentage value where the element should appear on screen for the animation to take place.', csl18n() ),
      '50',
      array(
        'condition' => array(
          'graphic_animation:not'   => 'none',
          'connector_animation:not' => 'none'
        )
      )
    );

    $this->addControl(
      'animation_delay_initial',
      'text',
      __( 'Animation Initial Delay (ms)', csl18n() ),
      __( 'Specify an amount of time before the graphic animation starts in milliseconds.', csl18n() ),
      '0',
      array(
        'condition' => array(
          'graphic_animation:not'   => 'none',
          'connector_animation:not' => 'none'
        )
      )
    );

    $this->addControl(
      'animation_delay_between',
      'text',
      __( 'Animation Delay Between (ms)', csl18n() ),
      __( 'Specify an amount of time between graphic animations in milliseconds.', csl18n() ),
      '300',
      array(
        'condition' => array(
          'graphic_animation:not'   => 'none',
          'connector_animation:not' => 'none'
        )
      )
    );

  }

  public function xsg() { }

  public function render( $atts ) {

    extract( $atts );

    $contents = '';

    foreach ( $elements as $e ) {

      $e_params = array(
        'title'                => $e['title'],
        'title_color'          => $e['title_color'],
        'text_color'           => $e['text_color'],
        'graphic'              => $graphic,
        'graphic_size'         => $graphic_size,
        'graphic_shape'        => $e['graphic_shape'],
        'graphic_color'        => $e['graphic_color'],
        'graphic_bg_color'     => $e['graphic_bg_color'],
        'align_h'              => $align_h,
        'align_v'              => $align_v,
        'side_graphic_spacing' => $side_graphic_spacing,
        'max_width'            => $max_width,
        'child'                => 'true',
        'connector_width'      => $connector_width,
        'connector_style'      => $connector_style,
        'connector_color'      => $connector_color
      );

      if ( $e['link_text'] != '' ) {
        $e_params['link_text']   = $e['link_text'];
        $e_params['href']        = $e['href'];
        $e_params['href_title']  = $e['href_title'];
        $e_params['href_target'] = ( $e['href_target'] == 'true' ) ? 'blank' : '';
        $e_params['link_color']  = $e['link_color'];
      }

      if ( $e['graphic_border_style'] != 'none' ) {
        $e_params['graphic_border'] = $this->borderStyle( $e['graphic_border_width'], $e['graphic_border_style'], $e['graphic_border_color'] );
      }

      if ( $graphic == 'icon' ) {
        $e_params['graphic_icon'] = $e['graphic_icon'];
      } else if ( $graphic == 'image' ) {
        $e_params['graphic_image'] = $e['graphic_image'];
      }

      if ( $graphic_animation != 'none' ) {
        $e_params['graphic_animation'] = $graphic_animation;
      }

      if ( $connector_animation != 'none' ) {
        $e_params['connector_animation'] = $connector_animation;
      }

      $contents .= cs_build_shortcode( 'x_feature_box', $e_params, $this->extra( $e ), $e['content'] );

    }

    $params = array();

    if ( $graphic_animation != 'none' || $connector_animation != 'none' ) {
      $params['animation_offset']        = $animation_offset;
      $params['animation_delay_initial'] = $animation_delay_initial;
      $params['animation_delay_between'] = $animation_delay_between;
    }

    $shortcode = cs_build_shortcode( 'x_feature_list', $params, $extra, $contents );

    return $shortcode;

  }

}