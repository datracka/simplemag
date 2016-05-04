<?php
add_action('admin_menu', 'xyz_fbap_menu');

function xyz_fbap_add_admin_scripts()
{
	wp_enqueue_script('jquery');

	wp_register_script( 'xyz_notice_script', plugins_url('facebook-auto-publish/js/notice.js') );
	wp_enqueue_script( 'xyz_notice_script' );
	
	wp_register_style('xyz_fbap_style', plugins_url('facebook-auto-publish/admin/style.css'));
	wp_enqueue_style('xyz_fbap_style');
}

add_action("admin_enqueue_scripts","xyz_fbap_add_admin_scripts");



function xyz_fbap_menu()
{
	add_menu_page('Facebook Auto Publish - Manage settings', 'Facebook Auto Publish', 'manage_options', 'facebook-auto-publish-settings', 'xyz_fbap_settings');
	$page=add_submenu_page('facebook-auto-publish-settings', 'Facebook Auto Publish - Manage settings', ' Settings', 'manage_options', 'facebook-auto-publish-settings' ,'xyz_fbap_settings'); // 8 for admin
	add_submenu_page('facebook-auto-publish-settings', 'Facebook Auto Publish - Logs', 'Logs', 'manage_options', 'facebook-auto-publish-log' ,'xyz_fbap_logs');
	add_submenu_page('facebook-auto-publish-settings', 'Facebook Auto Publish - About', 'About', 'manage_options', 'facebook-auto-publish-about' ,'xyz_fbap_about'); // 8 for admin
}


function xyz_fbap_settings()
{
	$_POST = stripslashes_deep($_POST);
	$_GET = stripslashes_deep($_GET);	
	$_POST = xyz_trim_deep($_POST);
	$_GET = xyz_trim_deep($_GET);
	
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/settings.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}



function xyz_fbap_about()
{
	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/about.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}


function xyz_fbap_logs()
{
	$_POST = stripslashes_deep($_POST);
	$_GET = stripslashes_deep($_GET);
	$_POST = xyz_trim_deep($_POST);
	$_GET = xyz_trim_deep($_GET);

	require( dirname( __FILE__ ) . '/header.php' );
	require( dirname( __FILE__ ) . '/logs.php' );
	require( dirname( __FILE__ ) . '/footer.php' );
}

?>