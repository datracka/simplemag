<?php 
/**
 * Single Post - Gallery (Carousel) format
 *
 * @package SimpleMag
 * @since 	SimpleMag 1.3
**/ 

/**
 * Check if gallery was uploaded
**/
if( get_field( 'post_upload_gallery' ) ) : ?>

        <?php
        // Get the uploaded images
        $images = get_field( 'post_upload_gallery' );
        ?>

        <div class="gallery-carousel-container">

            <div class="gallery-carousel global-sliders">
            
            <?php
            if ( $images ):
                foreach( $images as $image ):

                    if ( !empty ( $image['caption'] ) ) {
                        $alt = $image['caption'];
                    } elseif ( !empty ( $image['alt'] ) ) {
                        $alt = $image['alt'];
                    } else {
                        $alt = $image['title'];
                    }

                    $img_src = $image['sizes']['gallery-carousel'];
                    $img_width = $image['sizes']['gallery-carousel-width'];
                    $img_height = $image['sizes']['gallery-carousel-height'];

                    echo '<div class="gallery-item">
                            <figure>
                                <img src="' . esc_url( $img_src ) . '" alt="' . esc_attr( strip_tags( $alt ) ) . '" width="' . esc_attr( $img_width ) . '" height="' . esc_attr( $img_height ) . '" />';
                                if ( $image['caption'] ) {
                                  echo '<span class="icon"></span><figcaption class="image-caption">' . $image['caption'] . '</figcaption>';
                                }
                   echo'    </figure>
                        </div>';

                endforeach;
            endif;
            ?>

            </div><!-- Gallery Images -->
            

            <div class="gallery-caption">
                <?php
                // Display Image caption and/or description if exists
                if ( $images ):
                    foreach( $images as $image ):

                    echo '<div>';
                         if ( $image['caption'] ) {
                                echo '<figcaption class="image-caption-bottom">' . $image['caption'] . '</figcaption>';
                            }
                            if ( $image['description'] ) {
                                echo '<div class="image-desc-bottom">' . $image['description'] . '</div>';
                            }
                    echo '</div>';

                    endforeach;
                endif;
                ?>
            </div><!-- Gallery Captions -->
            
        </div><!-- Gallery End -->

<?php endif; // Check if gallery was uploaded ?>