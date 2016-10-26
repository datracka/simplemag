<?php
/**
 * Template Name: Page Composer
 *
 * @package SimpleMag
 * @since    SimpleMag 1.1
 **/
get_header(); ?>

<section id="content" role="main" class="clearfix anmtd">
    <section class="wrapper home-section vf-hello-bar">

        <div class="vf-parent">
            <div class="vf-child vf-child--one">
                <h3 class="vf-child__header">¿Quieres mejorar la forma como escribes y poder plasmar de mejor forma
                    todas esas ideas que corren
                    por tu cabeza?</h3>
                <p class="vf-child__text">La Enredadera te ofrece un PDF gratuito con teoría para mejorar tu
                    escritura.</p>
            </div>
            <div class="vf-child vf-child--two">
                <a href="#vf-light-box" class="vf-button--leads vf-js-open-modal" style="display: inline-block">
                    <span style="display: inline-block;">Descarga GRATIS el ebook</span>
                </a>
            </div>
        </div>
    </section>

    <?php
    /**
     *  Page Composer
     **/
    if (have_rows('page_composer')) :

        while (have_rows('page_composer')) : the_row();


            /* Title or Text */
            if (get_row_layout() == 'title_or_text'):

                get_template_part('composer/title', 'text');


            /* WP Editor */
            elseif (get_row_layout() == 'wp_section_editor') :

                get_template_part('composer/wp', 'editor');


            /* Posts Slider */
            elseif (get_row_layout() == 'hp_posts_slider') :

                // Regular
                if (get_sub_field('posts_slider_type') == 'slider_content') :

                    echo '<section class="wrapper home-section posts-slider-section">';
                    get_template_part('composer/posts', 'slider');
                    echo '</section>';

                // With two latest posts, with two featured posts or with two custom
                elseif (get_sub_field('posts_slider_type') == 'slider_and_latest'
                    || get_sub_field('posts_slider_type') == 'slider_and_featured'
                ) :

                    get_template_part('composer/slider', 'latest');


                // Full Width
                elseif (get_sub_field('posts_slider_type') == 'slider_full_width') :

                    echo '<section class="home-section full-width-section posts-slider-section">';
                    get_template_part('composer/posts', 'slider');
                    echo '</section>';

                endif;


            /* Posts Carousel */
            elseif (get_row_layout() == 'hp_posts_carousel') :

                get_template_part('composer/posts', 'carousel');


            /* Custom Slider */
            elseif (get_row_layout() == 'custom_slider') :

                // Regular and/or With two posts
                if (get_sub_field('custom_slider_type') == 'custom_slider_content'
                    || get_sub_field('custom_slider_type') == 'custom_slider_with_two'
                ) :

                    echo '<section class="wrapper home-section custom-slider-section">';
                    get_template_part('composer/custom', 'slider');
                    echo '</section>';


                // Full Width
                elseif (get_sub_field('custom_slider_type') == 'custom_slider_full') :

                    echo '<section class="home-section full-width-section custom-slider-section">';
                    get_template_part('composer/custom', 'slider');
                    echo '</section>';

                endif;


            /**
             * Universal Posts Section
             * Main output is Latest Posts
             * &: Featured Posts, Latest Reviews, Latest By Catgeory, Latest By Format
             **/
            elseif (get_row_layout() == 'universal_posts_section') :

                get_template_part('composer/posts', 'section');


            /* Latest Posts (Newest Posts) */
            elseif (get_row_layout() == 'newest_posts') :

                get_template_part('composer/latest', 'posts');


            /* Featured Posts */
            elseif (get_row_layout() == 'hp_featured_posts') :

                get_template_part('composer/featured', 'posts');


            /* Latest By Category */
            elseif (get_row_layout() == 'latest_by_category') :

                get_template_part('composer/category', 'posts');


            /* Latest Reviews */
            elseif (get_row_layout() == 'latest_reviews') :

                get_template_part('composer/latest', 'reviews');


            /* Latest By Format */
            elseif (get_row_layout() == 'latest_by_format') :

                get_template_part('composer/media', 'posts');


            /* Full Width Image */
            elseif (get_row_layout() == 'full_width_image') :

                get_template_part('composer/full', 'image');


            /* Static Image */
            elseif (get_row_layout() == 'image_advertising') :

                get_template_part('composer/static', 'image');


            /* Code Box */
            elseif (get_row_layout() == 'code_advertising') :

                get_template_part('composer/code', 'box');


            endif;

        endwhile;

    endif;
    ?>

    <?php
    /**
     * Enable/Disable the Posts Page link
     * The Posts Page is defined in admin Settings -> Reading
     **/
    if (get_field('comp_posts_page_link') == 'comp_posts_page_on') :
        ?>
        <div class="wrapper all-news-link">
            <?php $posts_page_id = get_option('page_for_posts'); ?>
            <a class="read-more" href="<?php echo esc_url(get_permalink($posts_page_id)); ?>">
                <?php echo esc_html(get_the_title($posts_page_id)); ?>
            </a>
        </div>
    <?php endif; ?>

</section>
<div href="#_" class="vf-light-box vf-light-box--fade-in" id="vf-light-box">
    <div class="vf-light-box-wrapper">
        <div class="vf-light-form">
            <a class="vf-close-dock-light-box vf-close-dock--rtl" href="#" title="Close">
                <i class="icomoon-close vf-close-dock-light-box__icon"></i></a>
            <form
                action="//laenredadera.us1.list-manage.com/subscribe/post?u=15390288374330f417f377e7f&amp;id=2008c2c92c"
                method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate"
                target="_blank" novalidate>
                <div id="mc_embed_signup_scroll">
                    <div class="mc-field-group">
                        <h2><b>Déjanos tus datos y recibirás un e-mail con un link para descargarte el eBook </b></h2>
                    </div>
                    <div class="mc-field-group vf-light-form__group-form--align-left">
                        <label for="mce-EMAIL">Dirección de correo <span class="asterisk">*</span>
                        </label>
                        <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
                    </div>
                    <div class="mc-field-group vf-light-form__group-form--align-left">
                        <label for="mce-FNAME">Nombre </label>
                        <input type="text" value="" name="FNAME" class="" id="mce-FNAME">
                    </div>
                    <div id="mce-responses" class="clear">
                        <div class="response" id="mce-error-response" style="display:none"></div>
                        <div class="response" id="mce-success-response" style="display:none"></div>
                    </div>
                    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text"
                                                                                              name="b_15390288374330f417f377e7f_2008c2c92c"
                                                                                              tabindex="-1" value="">
                    </div>
                    <div class="clear">
                        <input type="submit" value="Enviar" name="Subscribe" id="mc-embedded-subscribe"
                               class="button vf-subscribe-button-rtl">
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<!--<div class="js-slide-dock-trigger"></div>-->
<?php get_footer(); ?>
<?php
// Show/Hide random posts slide dock
if ($ti_option['single_slide_dock'] == 1) :
    //get_template_part( 'inc/slide', 'dock' ); //disabled default slide dock
    get_template_part('inc/slide', 'news');
endif;
?>

