<?php

/**
 * Public API
 * These functions expose Cornerstone APIs, allowing it to be extended.
 * The processes represented here are otherwise handled internally.
 */

/**
 * Register a new element
 * @param  $class_name Name of the class you've created in definition.php
 * @param  $name       slug name of the element. "alert" for example.
 * @param  $path       Path to the folder containing a definition.php file.
 */
function cornerstone_register_element( $class_name, $name, $path ) {
	CS()->component('Element_Orchestrator')->add( $class_name, $name, $path );
}

/**
 * Deprecated
 */
function cornerstone_add_element( $class_name ) {
	CS()->component( 'Legacy_Elements' )->add( $class_name ); // TODO
}

/**
 * Remove a previously added element from the Builder interface.
 * @param  string $name Name used when the element's class was added
 * @return none
 */
function cornerstone_remove_element( $name ) {
	CS()->component( 'Element_Orchestrator' )->remove( $name );
	CS()->component( 'Legacy_Elements' )->remove( $name );
}

/**
 * Registers a class as a candidate for Cornerstone Integration
 * Call from within this hook: cornerstone_integrations (happens before init)
 * @param  string $name       unique handle
 * @param  string $class_name Class to test conditions for, and eventually load
 * @return  none
 */
function cornerstone_register_integration( $name, $class_name ) {
	CS()->component( 'Integration_Manager' )->register( $name, $class_name );
}

/**
 * Unregister an integration that's been added so far
 * Call from within this hook: cornerstone_integrations (happens before init)
 * You may need to call on a later priority to ensure it was already registered
 * @param  string $name       unique handle
 * @return  none
 */
function cornerstone_unregister_integration( $name ) {
	CS()->component( 'Integration_Manager' )->unregister( $name );
}
