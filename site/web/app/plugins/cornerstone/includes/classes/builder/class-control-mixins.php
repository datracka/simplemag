<?php
/**
 * This class defines several control defaults. This way when
 * mapping elements we can do this: 'supports' => array( 'id', 'class', 'style' )
 */
class Cornerstone_Control_Mixins extends Cornerstone_Plugin_Component {

  private $cache;

  /**
   * Declare what mixins we're creating, and attach their callbacks.
   */
  public function setup() {

    $this->mixins = apply_filters( 'cornerstone_control_mixins', array(
      'id'         => array( $this, 'id' ),
      'class'      => array( $this, 'customClass' ),
      'style'      => array( $this, 'style' ),
      'padding'    => array( $this, 'padding' ),
      'border'     => array( $this, 'border' ),
      'link'       => array( $this, 'link' ),
      'visibility' => array( $this, 'visibility' ),
      'text_align' => array( $this, 'textAlign' ),
      'animation'  => array( $this, 'animation' ),
    ) );

    //
    // These hooks are used internally. They should never be used elsewhere.
    // Use the cornerstone_control_mixins hook above if needed.
    //

    foreach ($this->mixins as $name => $cb ) {
      add_filter( "_cornerstone_control_mixin_{$name}", array( $this, 'reset') );
      add_action( "_cornerstone_control_mixin_{$name}_action", array( $cb[0], $cb[1] ) );
    }

  }

  /**
   * Reset the internal cache between retrieving each mixin.
   * This allows the API to remain consistent with element mappings.
   */
  public function reset() {
    $this->cache = array();
    do_action( current_filter() . '_action', $this );
    return $this->cache;
  }

  public function id() {

    $this->addControl(
      'id',
      'text',
      __( 'ID', csl18n() ),
      __( 'Add an ID to this element so you can target it with your own customizations.', csl18n() ),
      '',
      array( 'monospace' => true, 'advanced' => true )
    );

  }

  public function customClass() {

    $this->addControl(
      'class',
      'text',
      __( 'Class', csl18n() ),
      __( 'Add custom classes to this element. Multiple classes should be seperated by spaces. They will be added at the root level element.', csl18n() ),
      '',
      array( 'monospace' => true, 'advanced' => true )
    );

  }

  public function style() {

    $this->addControl(
      'style',
      'text',
      __( 'Style', csl18n() ),
      __( 'Add an inline style to this element. This only contain valid CSS rules with no selectors or braces.', csl18n() ),
      '',
      array( 'monospace' => true, 'advanced' => true )
    );

  }

  public function padding() {

    $this->addControl(
      'padding',
      'dimensions',
      __( 'Padding', csl18n() ),
      __( 'Specify a custom padding for each side of this element. Can accept CSS units like px, ems, and % (default unit is px).', csl18n() ),
      array( '0px', '0px', '0px', '0px', 'unlinked' )
    );

  }

  public function border() {

    $this->addControl(
      'border_style',
      'select',
      __( 'Border', csl18n() ),
      __( 'Specify a custom border for this element by selecting a style, choosing a color, and inputting your dimensions.', csl18n() ),
      'none',
      array(
        'choices' => array(
          array( 'value' => 'none',   'label' => __( 'None', csl18n() ) ),
          array( 'value' => 'solid',  'label' => __( 'Solid', csl18n() ) ),
          array( 'value' => 'dotted', 'label' => __( 'Dotted', csl18n() ) ),
          array( 'value' => 'dashed', 'label' => __( 'Dashed', csl18n() ) ),
          array( 'value' => 'double', 'label' => __( 'Double', csl18n() ) ),
          array( 'value' => 'groove', 'label' => __( 'Groove', csl18n() ) ),
          array( 'value' => 'ridge',  'label' => __( 'Ridge', csl18n() ) ),
          array( 'value' => 'inset',  'label' => __( 'Inset', csl18n() ) ),
          array( 'value' => 'outset', 'label' => __( 'Outset', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'border_color',
      'color',
      null,
      null,
      '',
      array(
        'condition' => array(
          'border_style:not' => 'none',
        )
      )
    );

    $this->addControl(
      'border',
      'dimensions',
      null,
      null,
      array( '1px', '1px', '1px', '1px', 'linked' ),
      array(
        'condition' => array(
          'border_style:not' => 'none',
        )
      )
    );

  }

  public function link() {

    $this->addControl(
      'href',
      'text',
      __( 'Href', csl18n() ),
      __( 'Enter in the URL you want to link to.', csl18n() ),
      '#'
    );

    $this->addControl(
      'href_title',
      'text',
      __( 'Link Title Attribute', csl18n() ),
      __( 'Enter in the title attribute you want for your link.', csl18n() ),
      ''
    );

    $this->addControl(
      'href_target',
      'toggle',
      __( 'Open Link in New Window', csl18n() ),
      __( 'Select to open your link in a new window.', csl18n() ),
      false
    );

  }

  public function visibility() {

    $this->addControl(
      'visibility',
      'multi-choose',
      __( 'Hide based on screen width', csl18n() ),
      __( 'Hide this element at different screen widths. Keep in mind that the &ldquo;Extra Large&rdquo; toggle is 1200px+, so you may not see your element disappear if your preview window is not large enough.', csl18n() ),
      array(),
      array(
        'columns' => '5',
        'choices' => array(
          array( 'value' => 'x-hide-xl', 'icon' => fa_entity( 'desktop' ), 'tooltip' => __( 'XL', csl18n() ) ),
          array( 'value' => 'x-hide-lg', 'icon' => fa_entity( 'laptop' ),  'tooltip' => __( 'LG', csl18n() ) ),
          array( 'value' => 'x-hide-md', 'icon' => fa_entity( 'tablet' ),  'tooltip' => __( 'MD', csl18n() ) ),
          array( 'value' => 'x-hide-sm', 'icon' => fa_entity( 'tablet' ),  'tooltip' => __( 'SM', csl18n() ) ),
          array( 'value' => 'x-hide-xs', 'icon' => fa_entity( 'mobile' ),  'tooltip' => __( 'XS', csl18n() ) ),
        )
      )
    );

  }

  public function textAlign() {

    $this->addControl(
      'text_align',
      'choose',
      __( 'Text Align', csl18n() ),
      __( 'Set a text alignment, or deselect to inherit from parent elements.', csl18n() ),
      'none',
      array(
        'columns' => '4',
        'offValue' => '',
        'choices' => array(
          array( 'value' => 'left-text',    'icon' => fa_entity( 'align-left' ),    'tooltip' => __( 'Left', csl18n() ) ),
          array( 'value' => 'center-text',  'icon' => fa_entity( 'align-center' ),  'tooltip' => __( 'Center', csl18n() ) ),
          array( 'value' => 'right-text',   'icon' => fa_entity( 'align-right' ),   'tooltip' => __( 'Right', csl18n() ) ),
          array( 'value' => 'justify-text', 'icon' => fa_entity( 'align-justify' ), 'tooltip' => __( 'Justify', csl18n() ) )
        )
      )
    );

  }

  public function animation() {

    $this->addControl(
      'animation',
      'select',
      __( 'Animation', csl18n() ),
      __( 'Optionally add animation to your element as users scroll down the page.', csl18n() ),
      'none',
      array(
        'choices' => self::animationChoices()
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
          'animation:not' => 'none'
        )
      )
    );

    $this->addControl(
      'animation_delay',
      'text',
      __( 'Animation Delay (ms)', csl18n() ),
      __( 'Specify an amount of time before the graphic animation starts in milliseconds.', csl18n() ),
      '0',
      array(
        'condition' => array(
          'animation:not' => 'none'
        )
      )
    );

  }


  public static function legacy_injections( $atts ) {

		// Split generated and user values for access in render method
    $classes = array();
		$styles = array();


		if ( isset( $atts['margin'] ) && $atts['margin'] != '' ) {
			if ( is_array( $atts['margin'] ) ) {
				$atts['margin'] = Cornerstone_Control_Dimensions::simplify( $atts['margin'] );
			}
      $styles[] = 'margin: ' . $atts['margin'] . ';';
    }

    if ( isset( $atts['padding'] ) && $atts['padding'] != '' ) {
    	if ( is_array( $atts['padding'] ) ) {
				$atts['padding'] = Cornerstone_Control_Dimensions::simplify( $atts['padding'] );
			}
    	$styles[] = 'padding: ' . $atts['padding'] . ';';
    }

    if ( isset( $atts['border_style'] ) && $atts['border_style'] != 'none' ) {

      $styles[] = 'border-style: ' . $atts['border_style'] . ';';

      if ( isset( $atts['border_width'] ) && $atts['border_width'] != '' ) {
      	if ( is_array( $atts['border_width'] ) ) {
					$atts['border_width'] = Cornerstone_Control_Dimensions::simplify( $atts['border_width'] );
				}
        $styles[] = 'border-width: ' . $atts['border_width'] . ';';
      }

      if ( isset( $atts['border'] ) && $atts['border'] != '' ) {
      	if ( is_array( $atts['border'] ) ) {
					$atts['border'] = Cornerstone_Control_Dimensions::simplify( $atts['border'] );
				}
        $styles[] = 'border-width: ' . $atts['border'] . ';';
      }

      if ( isset( $atts['border_color'] ) && $atts['border_color'] != '' ) {
        $styles[] = 'border-color: ' . $atts['border_color'] . ';';
      }

    }

    if ( isset( $atts['visibility'] ) && is_array( $atts['visibility'] ) && count( $atts['visibility'] ) > 0 ) {
      $classes = array_merge( $classes, $atts['visibility'] );
    }

    if ( isset( $atts['text_align'] ) && $atts['text_align'] != 'none' ) {
      $classes[] = $atts['text_align'];
    }

    if ( isset( $atts['class'] ) )
			$classes[] = $atts['class'];

		if ( isset( $atts['style'] ) )
			$styles[] = $atts['style'];

		$classes = array_values( $classes );
		// Combine user and injected values for shortcode injection
		if ( count( $classes ) > 0 ) {
			$atts['class'] = implode( $classes, ' ' );
		}

		$styles = array_values( $styles );
		if ( count( $styles ) > 0 ) {
			$atts['style'] = implode( $styles, ' ' );
		}

		unset( $atts['margin'] );
		unset( $atts['padding'] );
		unset( $atts['border_width'] );
		unset( $atts['border'] );
		unset( $atts['border_style'] );
		unset( $atts['border_color'] );
		unset( $atts['text_align'] );

		return $atts;
  }
  /**
   * Call from inside a mixin. Map controls in order you'd like them in the inspector pane.
   * @param string $name     Required. Control name - will become an attribute name for the element
   * @param string $type     Type of view used to create the UI for this control
   * @param string $title    Localized title. Set null to compact this control
   * @param string $tooltip  Localized tooltip. Only visible if title is set
   * @param array  $default  Values used to populate the control if the element doesn't have values of it's own
   * @param array  $options  Information specific to this control. For example, the names and data of items in a dropdown
   */
  public function addControl( $name, $type, $title = null, $tooltip = null, $default = array(), $options = array() ) {
    $this->cache[] = array( 'name' => $name, 'controlType' => $type, 'controlTitle' => $title, 'controlTooltip' => $tooltip, 'defaultValue' => $default, 'options' => $options );
  }

  /**
   * Return animation choices.
   */
  public static function animationChoices() {
    return CS()->config( 'controls/animation-choices' );
  }

}