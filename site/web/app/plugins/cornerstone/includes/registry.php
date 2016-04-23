<?php

/**
 * Pseudo autoloading system.
 *
 * files:
 *     Groups of files to require at different points in WordPress execution
 *     Generally, these files should only contain class and function
 *     definitions without initiating any application logic.
 *
 * components:
 *     Groups of componenets to load into our main plugin at different points
 *     in WordPress execution. Component names must match their class name,
 *     prefixed by the plugin name for example:
 *     Class: Cornerstone_MyComponent
 *     Component: MyComponent
 */

return array(

  'files' => array(
    'preinit' => array(
			'utility/helpers',
			'utility/api',
			'utility/wp-shortcode-preserver',
    ),
    'loggedin' => array(
			'utility/wp-clean-slate',
    )
  ),

  'components' => array(
    'preinit' => array(
    	'Common',
    	'Integration_Manager'
    ),
    'init' => array(
    	'Legacy_Elements',
    	'Shortcode_Generator',
    	'Element_Orchestrator',
    	'Core_Scripts',
    	'Front_End',
    	'Customizer_Manager',
    	'Style_Loader'
    ),
    'loggedin' => array(
    	'Admin',
    	'Revision_Manager',
    	'Builder',
    	'Layout_Manager'
    )
  )
);