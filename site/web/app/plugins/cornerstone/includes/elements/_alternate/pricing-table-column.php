<?php

class CS_Pricing_Table_Column extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'pricing-table-column',
      'title'       => __( 'Pricing Table Column', csl18n() ),
      'section'     => '_marketing',
      'description' => __( 'Pricing Table Column description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
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
      'content',
      'editor',
      __( 'Content', csl18n() ),
      __( 'Specify your pricing column content.', csl18n() ),
      __( "[x_icon_list]\n    [x_icon_list_item type=\"check\"]First Feature[/x_icon_list_item]\n    [x_icon_list_item type=\"times\"]Second Feature[/x_icon_list_item]\n    [x_icon_list_item type=\"times\"]Third Feature[/x_icon_list_item]\n[/x_icon_list]\n\n[x_button href=\"#\" size=\"large\"]Buy Now![/x_button]", csl18n() )
    );

    $this->addControl(
      'featured',
      'toggle',
      __( 'Featured Column', csl18n() ),
      __( 'Enable to specify this column as your featured item.', csl18n() ),
      false
    );

    $this->addControl(
      'featured_sub',
      'text',
      __( 'Featured Subheading', csl18n() ),
      __( 'Enter text for your featured column subheading here.', csl18n() ),
      '',
      array(
        'condition' => array(
          'featured' => true
        )
      )
    );

    $this->addControl(
      'currency',
      'text',
      __( 'Currency', csl18n() ),
      __( 'Enter your desired currency symbol here.', csl18n() ),
      '$'
    );

    $this->addControl(
      'price',
      'text',
      __( 'Price', csl18n() ),
      __( 'Enter the price for this column.', csl18n() ),
      '29'
    );

    $this->addControl(
      'interval',
      'text',
      __( 'Interval', csl18n() ),
      __( 'Enter the duration for this payment (e.g. "Weekly," "Per Year," et cetera).', csl18n() ),
      __( 'Per Month', csl18n() )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_pricing_table_column',
		    'title'            => __( 'Pricing Table Column', csl18n() ),
		    'weight'          => 670,
		    'icon'            => 'pricing-table-column',
		    'section'        => __( 'Marketing', csl18n() ),
		    'description'     => __( 'Include a pricing table column', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/responsive-pricing-table/',
		  'params'          => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',

		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Include a title for your pricing column.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'featured',
		        'heading'     => __( 'Featured', csl18n() ),
		        'description' => __( 'Select to make this your featured offer.', csl18n() ),
		        'type'        => 'checkbox',

		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'featured_sub',
		        'heading'     => __( 'Featured Sub Heading', csl18n() ),
		        'description' => __( 'Include a sub heading for your featured column.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'currency',
		        'heading'     => __( 'Currency Symbol', csl18n() ),
		        'description' => __( 'Enter in the currency symbol you want to use.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'price',
		        'heading'     => __( 'Price', csl18n() ),
		        'description' => __( 'Enter in the price for this pricing column.', csl18n() ),
		        'type'        => 'textfield',

		      ),
		      array(
		        'param_name'  => 'interval',
		        'heading'     => __( 'Interval', csl18n() ),
		        'description' => __( 'Enter in the time period that this pricing column is for.', csl18n() ),
		        'type'        => 'textfield',

		        'value'       => 'Per Month'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
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

  //   $shortcode = "[x_pricing_table_column featured=\"$featured\" featured_sub=\"$featured_sub\" title=\"$title\" currency=\"$currency\" price=\"$price\" interval=\"$interval\"{$extra}]{$content}[/x_pricing_table_column]";

  //   return $shortcode;

  // }

}