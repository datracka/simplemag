<?php

/**
 * Element Controls: Section
 */

return array(

	'common' => array( 'margin', 'padding', 'border', 'text_align', 'visibility' ),

	'bg_type' => array(
		'type' => 'choose',
		'ui' => array(
			'title' => __( 'Background Type', $td ),
      'tooltip' => __( 'Configure the background appearance for this Section.', $td ),
		),
		'options' => array(
      'columns' => '4',
      'choices' => array(
        array( 'value' => 'none',  'icon' => fa_entity( 'ban' ),        'tooltip' => __( 'None', $td ) ),
        array( 'value' => 'color', 'icon' => fa_entity( 'eyedropper' ), 'tooltip' => __( 'Color', $td ) ),
        array( 'value' => 'image', 'icon' => fa_entity( 'image' ),      'tooltip' => __( 'Image', $td ) ),
        array( 'value' => 'video', 'icon' => fa_entity( 'film' ),       'tooltip' => __( 'Video', $td ) ),
      )
    )
  ),

	'bg_color' => array(
		'mixin' => 'background_color',
		'condition' => array( 'bg_type' => 'color' )
	),

	'bg_image' => array(
		'type' => 'image',
		'ui' => array(
			'title' => __( 'Background Pattern', $td ),
      'tooltip' => __( 'Background patterns will tile and repeat across your Section.', $td ),
		),
		'condition' => array(
			'bg_type'           => 'image',
      'bg_pattern_toggle' => true
		)
	),

	'bg_pattern' => array(
		'type' => 'image',
		'key'  => 'bg_image', // Alias the same value for background image
		'ui' => array(
			'title' => __( 'Background Image', $td ),
      'tooltip' => __( 'Background images are resized to fill the entire Section, regardless of screen size. Keep this in mind when using images that are already cropped.', $td ),
		),
		'condition' => array(
			'bg_type'           => 'image',
      'bg_pattern_toggle' => false
		)
	),

	'bg_pattern_toggle' => array(
		'type' => 'toggle',
		'ui' => array(
			'title' => __( 'Pattern', $td ),
      'tooltip' => __( 'Switch how the image is applied to the background.', $td ),
		),
		'condition' => array( 'bg_type' => 'image' )
	),

	'parallax' => array(
		'type' => 'toggle',
		'ui' => array(
			'title' => __( 'Parallax', $td ),
      'tooltip' => __( 'Activates the parallax effect with background patterns and images.', $td ),
		),
		'condition' => array( 'bg_type' => 'image' )
	),

	'bg_video' => array(
		'type' => 'text',
		'ui' => array(
			'title' => __( 'Background Video URL &amp; Poster', $td ),
      'tooltip' => __( 'Include your video URL(s) here. If using multiple sources, separate them using the pipe character (|) and place fallbacks towards the end (i.e. .webm then .mp4 then .ogv). For performance reasons, videos are not loaded into the editor but are shown live.', $td ),
		),
		'options' => array(
			'expandable' => false,
      'placeholder' => home_url( __( 'video.mp4', $td ) )
		),
		'condition' => array( 'bg_type' => 'video' )
	),

	'bg_video_poster' => array(
		'type' => 'image',
		'condition' => array( 'bg_type' => 'video' )
	),

	// INTERNAL - Layout Controls

	'_help_text' => array(
		'type' => 'info-box',
		'key' => 'disabled',
		'ui' => array(
			'title' => __( 'Want to add content?', $td ),
			'message' => __( 'Choose a layout, click the <strong class="glue">%%icon-nav-elements-solid%% Elements</strong> icon above, then drag elements into a column.', $td )
		),
		'context' => '_layout'
	),

	'title' => array(
		'type' => 'title',
		'options' => array(
			'showInspectButton' => true,
			'divider' => true
		),
		'context' => '_layout'
	),

	'rows' => array(
		'type' => 'sortable-rows',
		'key'  => 'elements',
		'options' => array(
			'element' => 'row',
			'floor'   => 1,
			'divider' => true
		),
		'context' => '_layout'
	),

);