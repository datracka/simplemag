<?php
return array(

	'custom_css' => array(
		'type' => 'code-editor',
		'options' => array(
			'settings' => array( 'mode' => 'css' )
		)
	),

	'custom_js' => array(
		'type' => 'code-editor',
		'options' => array(
			'settings' => array( 'mode' => 'javascript', 'lint' => true )
		)
	),

	'post_title'     => array(
		'type' => 'text',
		'ui' => array(
			'title'   => __( 'Title', $td ),
			'tooltip' => __( 'Shortcut for changing the title from within Cornerstone.', $td ),
		),
		'options' => array(
			'notLive' => 'settings-wp-changed'
		)
	),

	'post_status' => array(
		'type' => 'select',
		'ui' => array(
			'title' => __( 'Status', csl18n() )
		),
		'options' => array(
			'notLive' => 'settings-wp-changed',
			'choices' => $definition->post_status_choices()
		)
	),

	'allow_comments' => array(
		'type' => 'toggle',
		'ui' => array(
			'title'   => __( 'Allow Comments', $td ),
			'tooltip' => __( 'Opens or closes comments. Note: The comment form may not be shown if your chosen page template doesn&apost support them.', $td ),
		),
		'options' => array(
			'notLive' => 'settings-wp-changed'
		)
	),

	'post_parent' => array(
		'type' => 'wpselect',
		'ui' => array(
			'title' => __( 'Parent Page', $td )
		),
		'options' => array(
			'notLive' => 'settings-wp-changed',
			'markup' => $definition->post_parent_markup()
		)
	),

	'page_template' => array(
		'type' => 'select',
		'ui' => array(
			'title' => __( 'Page Template', $td )
		),
		'options' => array(
			'notLive' => 'settings-wp-changed',
			'choices' => $definition->page_template_choices()
		)
	)

);