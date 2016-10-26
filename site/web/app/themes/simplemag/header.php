<?php
/**
 * The Header for the theme
 *
 * @package SimpleMag
 * @since    SimpleMag 1.0
 **/
?>
<!DOCTYPE html>
<!--[if lt IE 9]>
<html <?php language_attributes(); ?> class="oldie"><![endif]-->
<!--[if (gte IE 9) | !(IE)]><!-->
<html <?php language_attributes(); ?> class="modern"><!--<![endif]-->
<head>
    <meta charset="<?php bloginfo('charset'); ?>"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <!--[if IE]>
    <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<section class="no-print top-strip">

    <?php global $ti_option; ?>

    <div class="wrapper clearfix">

        <?php
        // Hide Search and Social Icons if header variation with search is selected
        if ($ti_option['site_header'] != 'header_search') {

            // Search Form
            if ($ti_option['site_search_visibility']) {
                get_search_form();
            }

            // Social Profiles
            if ($ti_option['top_social_profiles'] == 1) {
                get_template_part('inc/social', 'profiles');
            }
        }
        ?>

        <?php
        // Top Strip Logo
        $top_logo = $ti_option['site_top_strip_logo'];

        if (!empty($top_logo['url'])) {
            ?>
            <div class="top-strip-logo alignleft">
                <a href="<?php echo esc_url(home_url()); ?>">
                    <img src="<?php echo esc_url($top_logo['url']); ?>"
                         alt="<?php esc_attr(bloginfo('name')); ?> - <?php esc_attr(bloginfo('description')); ?>"
                         width="<?php echo esc_attr($top_logo['width']); ?>"
                         height="<?php echo esc_attr($top_logo['height']); ?>"/>
                </a><!-- Top Strip Logo -->
            </div>
        <?php } ?>

        <?php
        // Pages Menu
        if (has_nav_menu('secondary_menu')) :
            wp_nav_menu(array(
                'theme_location' => 'secondary_menu',
                'container' => 'nav',
                'container_class' => 'secondary-menu'
            ));
        endif;
        ?>

        <a href="#" id="mobile-menu-toggle" class="lines-button">
            <span class="lines"></span>
        </a>

    </div><!-- .wrapper -->

</section><!-- .top-strip -->


<section id="site">

    <?php $mobile_menu = sanitize_html_class($ti_option['mobile_menu_color']); ?>
    <div id="pageslide" class="<?php echo $mobile_menu; ?>"><!-- Sidebar in Mobile View --></div>

    <div class="site-content">

        <header id="masthead" role="banner" class="clearfix">

            <?php
            // Main Logo Area
            if ($ti_option['site_main_area'] == true) {
                ?>
                <div id="branding" class="anmtd">
                    <div class="wrapper">
                        <?php
                        /**
                         * Header Variations
                         * are selected in Theme Options, Header tab.
                         **/

                        // Logo, Social Icons and Search
                        if ($ti_option['site_header'] == 'header_search') {
                            get_template_part('inc/header', 'search');

                            // Logo and Ad unit
                        } elseif ($ti_option['site_header'] == 'header_banner') {
                            get_template_part('inc/header', 'banner');

                            // Default - Centered Logo and Tagline
                        } else {
                            get_template_part('inc/header', 'default');
                        }
                        ?>
                    </div><!-- .wrapper -->
                </div><!-- #branding -->
            <?php } ?>

            <?php
            // Main Menu
            $main_menu = $ti_option['site_main_menu'];
            $fixed_menu = $ti_option['site_fixed_menu'];

            if ($main_menu == true):
                if (has_nav_menu('main_menu')) :
                    echo '<div class="no-print anmtd main-menu-container" role="navigation">';
                    if ($fixed_menu == '3' && $main_menu == true) {
                        echo '<div class="main-menu-fixed">';
                    }
                    wp_nav_menu(array(
                        'theme_location' => 'main_menu',
                        'container' => 'nav',
                        'container_class' => 'wrapper main-menu',
                        'walker' => new TI_Menu()
                    ));
                    if ($fixed_menu == '3' && $main_menu == true) {
                        echo '</div>';
                    }
                    echo '</div>';
                else:
                    echo '<div class="message warning"><i class="icomoon-warning-sign"></i>' . __('Define your site main menu', 'themetext') . '</div>';
                endif;
            endif;
            ?>

        </header><!-- #masthead -->