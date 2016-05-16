<?php 
/**
 * Author Box for single post
 *
 * @package SimpleMag
 * @since 	SimpleMag 1.0
**/
?>

<div class="single-box author-box single-author-box">

    <div class="author-avatar">
        <div class="inner">
            <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
                <?php
                // Author Image
                echo get_avatar( get_the_author_meta( 'email' ), '100', '', get_the_author_meta( 'display_name' ) );
                ?>
            </a>
        </div>
    </div><!-- .author-avatar -->

    <div class="author-info">

        <div class="written-by"><?php _e( 'Written By', 'themetext' ); ?></div>
        <span class="author vcard">
            <a class="url fn n" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" rel="author">
                <?php printf( __( '%s', 'themetext' ), get_the_author() ); ?>
            </a>
        </span>
        
        <?php
        /**
         * Social Icons
        **/
        global $ti_option;

        if ( $ti_option['single_author_icons'] == 1 ) : ?>
        <div class="icon-container">
            <?php
            $author_link = array ( 
                'user_url' => 'sphere',
                'sptwitter' => 'twitter',
                'spfacebook' => 'facebook',
                'spgoogle' => 'google-plus',
                'sppinterest' => 'pinterest',
                'splinkedin' => 'linkedin',
                'spinstagram' => 'instagram',
            );
            foreach ( $author_link as $link => $name ) :
            ?>
                <?php  
                if ( get_the_author_meta( $link ) ) : 
                    if ( $link == 'spgoogle' ) { $rel_author = '?rel=author'; }
                    else { $rel_author = ''; }
                ?>
                <a class="icon-item icon-item-<?php printf( $name, get_the_author() ); ?>" href="<?php echo wp_kses( get_the_author_meta( $link ), null ) . $rel_author; ?>">
                    <i class="icomoon-<?php printf( $name, get_the_author() ); ?>"></i>
                </a>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    
    </div><!-- .info -->

    <?php
    /**
     * Latest post by current single post author
    **/
    $by_author = new WP_Query( array (
        'posts_per_page' => 1,
        'author' => get_the_author_meta( 'ID' ),
        'orderby' => 'rand',
        'no_found_rows' => true,
    ));
    ?>

    <div class="author-posts">

        <span class="written-by">
            <?php _e( 'More from', 'themetext' ); ?> <?php printf( ( '%s' ), get_the_author() ); ?>
        </span>

        <?php
        if( $by_author->have_posts() ) : while ( $by_author->have_posts() ) : $by_author->the_post(); 
        ?>

            <div class="item">
                <div class="entry-details">
                    <header class="entry-header">
                        <h4 class="entry-title">
                            <a href="<?php the_permalink() ?>"><?php the_title(); ?></a>
                        </h4>
                    </header>
                    <div class="entry-summary">
                        <?php echo wp_trim_words( get_the_content(), 12, '...' ); ?>
                    </div>
                </div>
            </div>

            <?php endwhile; ?>

            <?php wp_reset_postdata(); ?>

        <?php endif; ?>

        <a class="read-more-link" href="<?php get_the_permalink(); ?>"><?php _e( 'Read More', 'themetext' ); ?></a>

    </div><!--.author-posts-->
        
</div><!-- .author-box -->