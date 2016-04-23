<?php

return array(

	//
	// ID
	//

	'id' => array(
		'type' => 'text',
		'ui' => array(
			'title' => __( 'ID', $td ),
			'tooltip' => __( 'Add an ID to this element so you can target it with your own customizations.', $td ),
		),
		'options' => array( 'monospace' => true, 'advanced' => true )
	),

	//
	// Class
	//

	'class' => array(
		'type' => 'text',
		'ui' => array(
			'title' => __( 'Class', $td ),
			'tooltip' => __( 'Add custom classes to this element. Multiple classes should be seperated by spaces. They will be added at the root level element.', $td ),
		),
		'options' => array( 'monospace' => true, 'advanced' => true )
	),

  //
  // Style
  //

	'style' => array(
		'type' => 'text',
		'ui' => array(
			'title' => __( 'Style', $td ),
			'tooltip' => __( 'Add an inline style to this element. This only contain valid CSS rules with no selectors or braces.', $td ),
		),
		'options' => array( 'monospace' => true, 'advanced' => true )
	),

  //
  // Padding
  //

	'margin' => array(
		'type' => 'dimensions',
		'ui' => array(
			'title' => __( 'Margin', $td ),
			'tooltip' =>__( 'Specify a custom margin for each side of this element. Can accept CSS units like px, ems, and % (default unit is px).', $td ),
		)
	),

  //
  // Padding
  //

	'padding' => array(
		'type' => 'dimensions',
		'ui' => array(
			'title' => __( 'Padding', $td ),
			'tooltip' =>__( 'Specify a custom padding for each side of this element. Can accept CSS units like px, ems, and % (default unit is px).', $td ),
		)
	),

	//
	// Text Align
	//

	'text_align' => array(
		'type' => 'choose',
		'ui' => array(
			'title' => __( 'Text Align', $td ),
			'tooltip' =>__( 'Set a text alignment, or deselect to inherit from parent elements.', $td ),
		),
		'options' => array(
			'columns' => '4',
			'offValue' => '',
			'choices' => array(
				array( 'value' => 'left-text',    'icon' => fa_entity( 'align-left' ),    'tooltip' => __( 'Left', $td ) ),
				array( 'value' => 'center-text',  'icon' => fa_entity( 'align-center' ),  'tooltip' => __( 'Center', $td ) ),
				array( 'value' => 'right-text',   'icon' => fa_entity( 'align-right' ),   'tooltip' => __( 'Right', $td ) ),
				array( 'value' => 'justify-text', 'icon' => fa_entity( 'align-justify' ), 'tooltip' => __( 'Justify', $td ) )
			)
		)
	),

	//
	// Visibility
	//

	'visibility' => array(
		'type' => 'multi-choose',
		'ui' => array(
			'title' => __( 'Hide based on screen width', $td ),
			'toolip' => __( 'Hide this element at different screen widths. Keep in mind that the &ldquo;Extra Large&rdquo; toggle is 1200px+, so you may not see your element disappear if your preview window is not large enough.', $td )
		),
		'options' => array(
			'columns' => '5',
			'choices' => array(
				array( 'value' => 'x-hide-xl', 'icon' => fa_entity( 'desktop' ), 'tooltip' => __( 'XL', $td ) ),
				array( 'value' => 'x-hide-lg', 'icon' => fa_entity( 'laptop' ),  'tooltip' => __( 'LG', $td ) ),
				array( 'value' => 'x-hide-md', 'icon' => fa_entity( 'tablet' ),  'tooltip' => __( 'MD', $td ) ),
				array( 'value' => 'x-hide-sm', 'icon' => fa_entity( 'tablet' ),  'tooltip' => __( 'SM', $td ) ),
				array( 'value' => 'x-hide-xs', 'icon' => fa_entity( 'mobile' ),  'tooltip' => __( 'XS', $td ) ),
			)
		)
	),

	//
	// Border Group
	//

	'border' => array(

		'group' => true,

		//
		// Border.Style
		//

		'style' => array(
			'type' => 'select',
			'ui' => array(
				'title' => __( 'Border', $td ),
				'tooltip' => __( 'Specify a custom border for this element by selecting a style, choosing a color, and inputting your dimensions.', $td ),
			),
			'options' => array(
				'choices' => array(
					array( 'value' => 'none',   'label' => __( 'None', $td ) ),
					array( 'value' => 'solid',  'label' => __( 'Solid', $td ) ),
					array( 'value' => 'dotted', 'label' => __( 'Dotted', $td ) ),
					array( 'value' => 'dashed', 'label' => __( 'Dashed', $td ) ),
					array( 'value' => 'double', 'label' => __( 'Double', $td ) ),
					array( 'value' => 'groove', 'label' => __( 'Groove', $td ) ),
					array( 'value' => 'ridge',  'label' => __( 'Ridge', $td ) ),
					array( 'value' => 'inset',  'label' => __( 'Inset', $td ) ),
					array( 'value' => 'outset', 'label' => __( 'Outset', $td ) )
				)
			)
		),

		//
		// Border.Color
		//

		'color' => array(
			'type' => 'color',
			'condition' => array(
				'group::style:not' => 'none', // ~ indicates relative to the control group. Should be expanded at runtime
			)
		),

		//
		// Border.Width
		//

		'width' => array(
			'type' => 'dimensions',
			'condition' => array(
				'group::style:not' => 'none', // ~ indicates relative to the control group. Should be expanded at runtime
			)
		)
	),

	//
	// Link Group
	//

	'link' => array(

		'group' => true,

			//
			// Link.URL
			//

		'link_url' => array(
			'type' => 'text',
			'ui' => array(
				'title' => __( 'URL', $td ),
				'tooltip' => __( 'Enter a destination URL for when this is clicked.', $td ),
			),
		),

		//
		// Link.Title
		//

		'link_title' => array(
			'type' => 'text',
			'ui' => array(
				'title' => __( 'Link Title Attribute', $td ),
				'tooltip' => __( 'Enter in the title attribute you want for your link. This often appears in a browser tooltip when hovering.', $td ),
			),
		),

		//
		// Link.NewTab
		//

		'link_new_tab' => array(
			'type' => 'toggle',
			'ui' => array(
				'title' => __( 'Open Link in New Tab', $td ),
				'tooltip' => __( 'Select to open your link in a new tab, or a new window in older browsers.', $td ),
			),
		)
	),

	//
	// Animation Group
	//
	'animation' => array(

		'group' => true,

		//
		// Animation.Flavor
		//

		'flavor' => array(
			'type' => 'select',
			'ui' => array(
				'title' => __( 'Animation', $td ),
				'tooltip' => __( 'Optionally add animation to your element as users scroll down the page.', $td ),
			),
			'options' => array(
				'choices' => CS()->config( 'controls/animation-choices' )
			)
		),

		//
		// Animation.Offset
		//

		'offset' => array(
			'type' => 'text',
			'ui' => array(
				'title' => __( 'Animation Offset (%)', $td ),
				'tooltip' => __( 'Specify a percentage value where the element should appear on screen for the animation to take place.', $td ),
			),
			'condition' => array(
				'group::flavor:not' => 'none'
			)
		),

		//
		// Animation.Delay
		//

		'delay' => array(
			'type' => 'text',
			'ui' => array(
				'title' => __( 'Animation Delay (ms)', $td ),
				'tooltip' => __( 'Specify an amount of time before the graphic animation starts in milliseconds.', $td ),
			),
			'condition' => array(
				'group::flavor:not' => 'none'
			)
		)
	),

	//
	// Background Color
	//

	'background_color' => array(
		'type' => 'color',
		'ui' => array(
			'title' => __( 'Background Color', $td ),
      'tooltip' => __( 'Select the background color for this element.', $td ),
		)
	),

);