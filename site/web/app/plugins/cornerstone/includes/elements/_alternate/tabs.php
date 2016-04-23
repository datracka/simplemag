<?php

class CS_Tabs extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'tabs',
      'title'       => __( 'Tabs', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Tabs description.', csl18n() ),
      'supports'    => array( 'class' ),
      'renderChild' => true
    );
  }

  public function controls() {

    $this->addControl(
      'elements',
      'sortable',
      __( 'Tabs', csl18n() ),
      __( 'Add a new tab.', csl18n() ),
      array(
        array( 'title' => __( 'Tab 1', csl18n() ), 'content' => __( 'The content for your Tab goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium, nisi ut volutpat mollis, leo risus interdum arcu, eget facilisis quam felis id mauris. Ut convallis, lacus nec ornare volutpat, velit turpis scelerisque purus, quis mollis velit purus ac massa. Fusce quis urna metus. Donec et lacus et sem lacinia cursus.', csl18n() ), 'active' => true ),
        array( 'title' => __( 'Tab 2', csl18n() ), 'content' => __( 'The content for your Tab goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium, nisi ut volutpat mollis, leo risus interdum arcu, eget facilisis quam felis id mauris. Ut convallis, lacus nec ornare volutpat, velit turpis scelerisque purus, quis mollis velit purus ac massa. Fusce quis urna metus. Donec et lacus et sem lacinia cursus.', csl18n() ) )
      ),
      array(
      	'element'  => 'tab',
        'newTitle' => __( 'Tab %s', csl18n() ),
        'floor'    => 2,
        'capacity' => 5
      )
    );

    $this->addControl(
      'nav_position',
      'choose',
      __( 'Navigation Position', csl18n() ),
      __( 'Choose the positioning of your navigation for your tabs.', csl18n() ),
      'top',
      array(
        'columns' => '3',
        'choices' => array(
          array( 'value' => 'top',   'tooltip' => __( 'Top', csl18n() ),   'icon' => fa_entity( 'arrow-up' ) ),
          array( 'value' => 'left',  'tooltip' => __( 'Left', csl18n() ),  'icon' => fa_entity( 'arrow-left' ) ),
          array( 'value' => 'right', 'tooltip' => __( 'Right', csl18n() ), 'icon' => fa_entity( 'arrow-right' ) )
        )
      )
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'            => 'x_tab_nav',
		    'title'            => __( 'Tab Nav', csl18n() ),
		    'weight'          => 920,
		    'icon'            => 'tab-nav',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include a tab nav into your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/tabbed-content/',
		  'params'          => array(
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Tab Nav Items Per Row', csl18n() ),
		        'description' => __( 'If your tab nav is on top, select how many tab nav items you want per row.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'Two'   => 'two-up',
		          'Three' => 'three-up',
		          'Four'  => 'four-up',
		          'Five'  => 'five-up'
		        )
		      ),
		      array(
		        'param_name'  => 'float',
		        'heading'     => __( 'Tab Nav Position', csl18n() ),
		        'description' => __( 'Select the position of your tab nav.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          'None'  => 'none',
		          'Left'  => 'left',
		          'Right' => 'right'
		        )
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);

		$this->sg_map(
		  array(
		    'id'            => 'x_tab_nav_item',
		    'title'            => __( 'Tab Nav Item', csl18n() ),
		    'weight'          => 910,
		    'icon'            => 'tab-nav-item',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include a tab nav item into your tab nav', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/tabbed-content/',
		  'params'          => array(
		      array(
		        'param_name'  => 'title',
		        'heading'     => __( 'Title', csl18n() ),
		        'description' => __( 'Include a title for your tab nav item.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'active',
		        'heading'     => __( 'Active', csl18n() ),
		        'description' => __( 'Select to make this tab nav item active.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);

		$this->sg_map(
		  array(
		    'id'            => 'x_tabs',
		    'title'            => __( 'Tabs', csl18n() ),
		    'weight'          => 900,
		    'icon'            => 'tabs',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include a tabs container after your tab nav', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/tabbed-content/',
		  'params'          => array(
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

		$this->sg_map(
		  array(
		    'id'            => 'x_tab',
		    'title'            => __( 'Tab', csl18n() ),
		    'weight'          => 890,
		    'icon'            => 'tab',
		    'section'        => __( 'Content', csl18n() ),
		    'description'     => __( 'Include a tab into your tabs container', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/tabbed-content/',
		  'params'          => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Text', csl18n() ),
		        'description' => __( 'Enter your text.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'active',
		        'heading'     => __( 'Active', csl18n() ),
		        'description' => __( 'Select to make this tab active.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);

  }

  public function render( $atts ) {

    extract( $atts );

    switch ( count( $elements ) ) {
      case 2 :
        $type = 'two-up';
        break;
      case 3 :
        $type = 'three-up';
        break;
      case 4 :
        $type = 'four-up';
        break;
      case 5 :
        $type = 'five-up';
        break;
    }


    //
    // Tabs nav items.
    //

    $tabs_nav_content = '';

    foreach ( $elements as $e ) {

      $tabs_nav_extra = $this->extra( array(
        'class' => $e['class']
      ) );

      $tabs_nav_content .= '[x_tab_nav_item title="' . $e['title'] . '" active="' . $e['active'] . '"' . $tabs_nav_extra . ']';

    }


    //
    // Tabs.
    //

    $tabs_content = '';

    foreach ( $elements as $e ) {

      $tabs_extra = $this->extra( array(
        'class' => $e['class']
      ) );

      $tabs_content .= '[x_tab active="' . $e['active'] . '"' . $tabs_extra . ']' . $e['content'] . '[/x_tab]';

    }


    //
    // Pieces.
    //

    $tabs_nav  = '[x_tab_nav type="' . $type . '" float="' .  $nav_position . '"' . $extra . ']' . $tabs_nav_content . '[/x_tab_nav]';
    $tabs      = '[x_tabs' . $extra . ']' . $tabs_content . '[/x_tabs]';
    $shortcode = $tabs_nav . $tabs;

    return $shortcode;

  }

}