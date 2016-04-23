<?php
/**
 * This class add revision support for cornerstone.
 */

class Cornerstone_Revision_Manager extends Cornerstone_Plugin_Component {

	// Target post_meta
	public $post_meta = array(
		'_cornerstone_data',
		'_cornerstone_override',
		'_cornerstone_settings'
	);

	public function setup() {

		// Disable revision through filter
		if ( apply_filters( 'cornerstone_disable_revisions', false ) || !CS()->common()->uses_cornerstone() ) return;

		// Save cornerstone revision
		add_action( 'save_post', array( $this, 'saveRevision' ) , 10, 2 );

		// Restore cornerstone revision
		add_action( 'wp_restore_post_revision', array( $this, 'restoreRevision' ), 10, 2 );

	}

	// Save cornerstone revision
	public function saveRevision( $post_id, $post ) {

		$parent_id = wp_is_post_revision( $post_id );

		if ( $parent_id ) {

			$parent  = get_post( $parent_id );

			foreach ( $this->post_meta as $name ) {
				$meta = get_post_meta( $parent->ID, $name , true );
				if ( false !== $meta ) {
					add_metadata( 'post', $post_id, $name, $meta );
				}
			}

		}

	}

	// Restore cornerstone revision
	public function restoreRevision( $post_id, $revision_id ) {
		$post     = get_post( $post_id );
		$revision = get_post( $revision_id );

		foreach ( $this->post_meta as $name ) {

				$meta  = get_metadata( 'post', $revision->ID, $name, true );

				if ( false !== $meta ) {
					update_post_meta( $post_id, $name, $meta );
				} else {
					delete_post_meta( $post_id, $name );
				}
		}

	}

}
