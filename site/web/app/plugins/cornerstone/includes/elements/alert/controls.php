<?php

/**
 * Element Controls: Alert
 */

return array(

	'heading' => array(
		'type'    => 'text',
		'ui' => array(
			'title'   => __( 'Heading &amp; Content', $td ),
			'tooltip' => __( 'Text for your alert heading and content.', $td ),
		),
		'context' => 'content',
    'suggest' => __( 'Alert Title', $td ),
	),

	'content' => array(
		'type'    => 'textarea',
		'context' => 'content',
		'suggest' => __( 'Click to inspect, then edit as needed.', $td ),
	),

	'type' => array(
		'type' => 'choose',
		'ui' => array(
			'title' => __( 'Type', $td ),
      'tooltip' => __( 'There are multiple alert types for different situations. Select the one that best suits your needs.', $td ),
		),
		'options' => array(
      'columns' => '5',
      'choices' => array(
        array( 'value' => 'muted',   'tooltip' => __( 'Muted', $td ),   'icon' => fa_entity( 'ban' ) ),
        array( 'value' => 'success', 'tooltip' => __( 'Success', $td ), 'icon' => fa_entity( 'check' ) ),
        array( 'value' => 'info',    'tooltip' => __( 'Info', $td ),    'icon' => fa_entity( 'info' ) ),
        array( 'value' => 'warning', 'tooltip' => __( 'Warning', $td ), 'icon' => fa_entity( 'exclamation-triangle' ) ),
        array( 'value' => 'danger',  'tooltip' => __( 'Danger', $td ),  'icon' => fa_entity( 'exclamation-circle' ) )
      )
    )
  ),

	'close' => array(
		'type' => 'toggle',
		'ui' => array(
			'title' => __( 'Close Button', $td ),
      'tooltip' => __( 'Enabling the close button will make the alert dismissible, allowing your users to remove it if desired.', $td ),
		)
	)

);