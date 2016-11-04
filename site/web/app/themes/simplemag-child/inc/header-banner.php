<?php
/**
 * Defult Header
 * Left align logo, right aligned ad unit
 *
 * @package SimpleMag
 * @since 	SimpleMag 3.0
**/

global $ti_option;
?>

<div class="header header-banner">

    <div class="inner">
        
        <div class="inner-cell">

            <?php
            // Main Site Logo
            $main_site_logo = $ti_option['site_logo'];

            if ( !empty( $main_site_logo['url'] ) ) {
            ?>
                <a class="logo" style=" max-width: <?php echo esc_attr( $main_site_logo['width'] / 2 ); ?>px;" href="<?php echo esc_url( home_url() ); ?>">
                <img src="<?php echo esc_url( $main_site_logo['url'] ); ?>" alt="<?php esc_attr( bloginfo( 'name' ) ); ?> - <?php esc_attr( bloginfo( 'description' ) ); ?>" width="<?php echo esc_attr( $main_site_logo['width'] ); ?>" height="<?php echo esc_attr( $main_site_logo['height'] ); ?>" />
                </a><!-- Logo -->
            <?php } ?>

            <?php
            // Show or Hide site tagline under the logo based on Theme Options
            if( $ti_option['site_tagline'] == true ) {
            ?>
            <span class="tagline"><?php esc_html( bloginfo( 'description' ) ); ?></span>
            <?php } ?>

        </div>

        <div class="inner-cell">
            <div class="ad-block ad-block__laptop">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <!-- Banner -->
                <ins class="adsbygoogle"
                     style="display:inline-block;width:728px;height:90px"
                     data-ad-client="ca-pub-7970702492501203"
                     data-ad-slot="8498807370"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            <div class="ad-block ad-block__ipad">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <!-- Banner mediano -->
                <ins class="adsbygoogle"
                     style="display:inline-block;width:468px;height:60px"
                     data-ad-client="ca-pub-7970702492501203"
                     data-ad-slot="3451328972"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            <div class="ad-block ad-block__mobile">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <!-- Banner movil -->
                <ins class="adsbygoogle"
                     style="display:inline-block;width:320px;height:50px"
                     data-ad-client="ca-pub-7970702492501203"
                     data-ad-slot="9497862576"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
        <?php /*do_action( 'header_ad' ); */?>
     
	</div>
    
</div><!-- .header-banner -->