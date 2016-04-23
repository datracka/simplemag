<?php

function tp2wp_importer_content_admin_menu () {
		add_submenu_page(
				TP2WP_IMPORTER_MENU_ROOT,
				'TP2WP Import Content',
				'2. Content',
				'manage_options',
				'tp2wp-importer-content',
				'tp2wp_importer_content_page_callback'
		);
}
add_action( 'admin_menu', 'tp2wp_importer_content_admin_menu' );


function tp2wp_importer_content_page_callback () {
		$redirection_url = tp2wp_importer_url( 'content' );
		echo '<script>window.location = ' . json_encode( $redirection_url ) . ';</script>';
		exit;
}

if ( defined( 'WP_LOAD_IMPORTERS' ) ) {
		include dirname( __FILE__ ) . '/importer.php';
}

if ( is_admin() ) {
    include dirname( __FILE__ ) . '/functions.php';
}

