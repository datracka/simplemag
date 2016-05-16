<?php 
/**
 * Code Box
 * Page Composer Section
 *
 * @package SimpleMag
 * @since 	SimpleMag 2.0
**/
?>

<section class="wrapper home-section advertising">
    <?php
    $code_box = get_sub_field( 'ad_banner_code' );
    echo apply_filters( 'be_the_content', $code_box );
	?>
</section><!-- Code Box -->