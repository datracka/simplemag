<?php 
/**
 * Random Posts slide dock. Appears in single.php
 *
 * @package SimpleMag
 * @since 	SimpleMag 1.1
**/
?>

<div class="slide-dock">

    <a class="close-dock" href="#" title="Close"><i class="icomoon-close"></i></a>
    <h3><?php _e( 'More Stories', 'themetext' ); ?></h3>
    
    <div class="entries">
    
    <?php
	
        $ti_random_post = new WP_Query(
            array(
                'post_type' => 'post',
                'post__not_in' => array( $post->ID ),
                'orderby' => 'rand',
                'posts_per_page' => 1,
                'ignore_sticky_posts' => 1,
                'no_found_rows' => true
            )
        );
		
        while ( $ti_random_post->have_posts() ) : $ti_random_post->the_post(); ?>
        
        <article>
        	<figure class="entry-image">
                <a href="<?php the_permalink(); ?>">
                    <?php
					if ( has_post_thumbnail() ) {
                        the_post_thumbnail( 'rectangle-size' );
                    } elseif( first_post_image() ) { // Set the first image from the editor
						echo '<img src="' . esc_url( first_post_image() ) . '" class="wp-post-image" alt="' . esc_attr( get_the_title() ) . '" />';
					} ?>
                </a>
            </figure>
            
            <div class="entry-details">
                <header class="entry-header">
                    <div class="entry-meta">
                        <span class="entry-category"><?php the_category(', '); ?></span>
                    </div>
                    <h4>
                        <a href="<?php the_permalink(); ?>">
                            <?php the_title(); ?>
                        </a>
                    </h4>
                </header>
            </div>
        </article>
        
    <?php endwhile; ?>
    
	<?php wp_reset_postdata(); ?>
    
    </div>
    
</div><!-- .slide-dock -->