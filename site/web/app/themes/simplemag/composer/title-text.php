<?php 
/**
 * Free Title or Text
 * Page Composer Section
 *
 * @package SimpleMag
 * @since 	SimpleMag 2.0
**/
?>

<section class="wrapper home-section title-text">
	<?php 
    /* Title */
	$title = get_sub_field( 'title_text_content' ); 
	$tag = get_sub_field( 'title_styling' );
	
	$title_type = array (
		'theme_title' => '<div class="section-title title-with-sep"><h2 class="title">' . $title . '</h2></div>',
		'heading_1' => '<h1>' . $title . '</h1>',
		'heading_2' => '<h2>' . $title . '</h2>'
	);
	
	// Loop through select options an output the result
	foreach ( $title_type as $type => $value ) :
		if ( $tag == $type ) : 
            echo '<header class="section-header">' 
                    . wp_kses( $value, 
                        array( 
                            'div' => array(),
                            'h1' => array(),
                            'h2' => array()
                        ) 
                    ) . 
                 '</header>';
        endif;
	endforeach;


    /* Text */
    $text = get_sub_field( 'text_content' );
    if ( ! empty( $text ) ) :
        echo '<div class="cat-description">' . esc_textarea( $text ) . '</div>';
    endif;
	?>
</section><!-- Text Box -->