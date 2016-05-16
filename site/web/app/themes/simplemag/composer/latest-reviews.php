<?php 
/**
 * Latest Reviews
 * Page Composer section.
 *
 * @package SimpleMag
 * @since 	SimpleMag 1.1
**/
?>

<section class="wrapper home-section latest-reviews">             
                
    <?php
    /**
     * Section Main & Sub titles
    **/
    $main_title = get_sub_field( 'reviews_main_title' );
    $sub_title = get_sub_field( 'reviews_sub_title' );

    if( $main_title || $sub_title ) : ?>
    <header class="section-header">
        <div class="section-title title-with-sep">
            <h2 class="title"><?php echo $main_title; ?></h2>
        </div>
        <?php if ( $sub_title ): ?>
        <span class="sub-title"><?php echo $sub_title; ?></span>
        <?php endif; ?>
    </header>
    <?php endif; ?>


    <?php
    /** 
     * Posts with reviews.
     * Display posts only if Rating is enabled
    **/
    $posts_to_show = get_sub_field( 'reviews_posts_per_page' );
    $ti_latest_reviews = new WP_Query(
        array(
            'meta_key' => 'enable_rating',
            'meta_value' => '1',
            'posts_per_page' => $posts_to_show,
            'post__not_in' => get_option( 'sticky_posts' ),
            'no_found_rows' => true,
        )
    );
    ?>

    <?php if ( $ti_latest_reviews->have_posts() ) : ?>

        <div class="clearfix latest-reviews-carousel">

            <?php 
            
            while ( $ti_latest_reviews->have_posts() ) : $ti_latest_reviews->the_post(); 
            
            
                include( locate_template( 'inc/rating-calculations.php' ) );
            
                // Post Item size
                $item_size = ( $final_result_no_decimal + 100 ) / 13;
                        
            ?>

                <article <?php post_class(); ?>>

                    <figure class="entry-image" style="width:<?php echo esc_attr( $item_size ); ?>em; height:<?php echo esc_attr( $item_size ); ?>em;">
                        <a href="<?php the_permalink(); ?>">
                            <?php 
                            if ( has_post_thumbnail() ) {
                                the_post_thumbnail( 'rectangle-size' );
                            } elseif( first_post_image() ) { // Set the first image from the editor
                                echo '<img src="' . first_post_image() . '" class="wp-post-image" />';
                            } ?>
                            
                            <span class="show-total"><?php echo $final_result; ?></span>
                        </a>
                    </figure>

                    <header class="entry-header">
                        <div class="entry-meta">
                           <?php the_category(', '); ?>
                        </div>
                        <h2 class="entry-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>

                    </header>

                </article>

            <?php endwhile; ?>

            <?php wp_reset_postdata(); ?>
            
         </div><!-- .latest-reviews-carousel -->
    
        <div class="carousel-nav"></div>

    <?php else: ?>

        <p class="message">
            <?php _e( 'There are no reviews yet', 'themetext' ); ?>
        </p>

    <?php endif; ?>

</section><!-- Featured Posts -->