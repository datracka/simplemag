<?php
/**
 * Different image size based on layout 
 * selection for Homepage, Categories and Posts Page.
*/

function layout_based_post_image() {

	if ( has_post_thumbnail() ) :
        
    
        /**
         * Page Composer and Categories
        **/
        
        // Page Composer
        $section_layout = get_sub_field( 'latest_posts_layout' );
        $section_cols = get_sub_field( 'latest_cols_number' );
        $section_sidebar = get_sub_field( 'latest_posts_sidebar' );
        
        
        // Categories
        $cat_layout = get_field( 'category_posts_layout', 'category_' . get_query_var('cat') );
        $cat_cols = get_field( 'category_cols_num', 'category_' . get_query_var('cat') );
        $cat_sidebar = get_field( 'category_sidebar', 'category_' . get_query_var('cat') );
        
        
        /*-- Lists and Grid */
        
            // 1. Lists and Grid layouts with sidebar
            // 2. Grid three or four columns
            if (   $section_layout == 'list-layout'
                || $section_layout == 'grid-layout' && $section_cols != 'columns-size-2'
                || $section_layout == 'grid-layout' && $section_sidebar != ''
                
                || $cat_layout == 'list-layout'
                || $cat_layout == 'grid-layout' && $cat_cols != 'columns-size-2'
                || $cat_layout == 'grid-layout' && $cat_sidebar == 'cat_sidebar_on'
                
                || is_author() ) :
    
                    the_post_thumbnail( 'rectangle-size' );

            // Grid two columns, no sidebar
            elseif (   $section_layout == 'grid-layout'
                      || $cat_layout == 'grid-layout' ) :

                    the_post_thumbnail( 'rectangle-size-big' );
        
            endif;
        
        
        /*-- Small List Layout */
        
            if ( $section_layout == 'small-list-layout' ) :
                
                    the_post_thumbnail( 'rectangle-size-small' );
            
            endif;


        /*-- Masonry */
        
            // 1. Masonry with sidebar
            // 2. Masonry three or four columns
            if (   $section_layout == 'masonry-layout' && $section_cols != 'columns-size-2'
                || $section_layout == 'masonry-layout' && $section_sidebar != ''
                
                || $cat_layout == 'masonry-layout' && $cat_cols != 'columns-size-2'
                || $cat_layout == 'masonry-layout' && $cat_sidebar == 'cat_sidebar_on'
               
                || is_tag() ) :

                    the_post_thumbnail( 'masonry-size' );

            // Masonry two columns, no sidebar
            elseif (   $section_layout == 'masonry-layout'
                      || $cat_layout == 'masonry-layout' ) :

                    the_post_thumbnail( 'masonry-size-big' );
        
            endif;

        
        /*-- Classic List */
        
            // Classic List with or without sidebar
            if (   $section_layout == 'classic-layout'
                || $cat_layout == 'classic-layout' ) :

                    the_post_thumbnail( 'big-size' );
        
            endif;
        
    
    
       
        /**
         * Posts Page
        **/  
        if ( is_home() ) :

            global $ti_option;
            $posts_page_layout = $ti_option['posts_page_layout'];
            $posts_page_cols = $ti_option['posts_page_columns'];
            $posts_page_sidebar = get_field( 'page_sidebar', get_option( 'page_for_posts' ) );
            
            
        /*-- Lists and Grid */
            
            // 1. Lists and Grid layouts with sidebar
            // 2. Grid three or four columns
            if (   $posts_page_layout == 'list-layout'
                || $posts_page_layout == 'grid-layout' && $posts_page_cols != 'columns-size-2'
                || $posts_page_layout == 'grid-layout' && $posts_page_sidebar == 'page_sidebar_on' ) :

                    the_post_thumbnail( 'rectangle-size' );

            // Grid two columns, no sidebar
            elseif ( $posts_page_layout == 'grid-layout' ) :

                    the_post_thumbnail( 'rectangle-size-big' );
            
            endif;
            
            
        /*-- Masonry */
        
            // 1. Masonry with sidebar
            // 2. Masonry three or four columns
            if (   $posts_page_layout == 'masonry-layout' && $posts_page_cols != 'columns-size-2'
                || $posts_page_layout == 'masonry-layout' && $posts_page_sidebar == 'page_sidebar_on' ) :

                    the_post_thumbnail( 'masonry-size' );

            // Masonry two columns, no sidebar
            elseif ( $posts_page_layout == 'masonry-layout' ) :

                    the_post_thumbnail( 'masonry-size-big' );
            
            endif;

        
        /*-- Classic List */
        
            // Classic List with or without sidebar
            if ( $posts_page_layout == 'classic-layout' ) :

                    the_post_thumbnail( 'big-size' );
            
            endif;


        endif; //is_home()
        
    
    /**
     * If there is no Featured Image set the first 
     * image from the editor no matter what layout was selected
    **/
    elseif( first_post_image() ) :
        
        echo '<img src="' . esc_url( first_post_image() ) . '" class="wp-post-image" alt="' . get_the_title() . '" />';
        
    endif;

}
    
add_action( 'post_item_image', 'layout_based_post_image' );