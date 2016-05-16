<?php
/**
 * Single Post Rating - Bars
 * Rating is defined by post author in post edit screen
 *
 * @package SimpleMag
 * @since 	SimpleMag 3.0
**/


include( locate_template( 'inc/rating-calculations.php' ) );
?>
	
<div class="clearfix single-box single-rating single-rating-bars">
    <div class="clearfix inner">
        <div class="entry-breakdown inview">
    
        <?php
        $score_output = get_field( 'rating_module' );
        if( $score_output ) :
            foreach( $score_output as $row ) :
        ?>
            <div class="item clearfix">
                <h4>
                    <span class="total"><?php echo $row['score_number']; ?></span>
                    <?php echo $row['score_label']; ?>
                </h4>
                <span class="score-outer">
                    <span class="score-line" style="width:<?php echo $row['score_number']; ?>0%;"></span>
                </span>
            </div>
            <?php endforeach; ?>
        <?php endif; ?>
            
        </div>

        <?php
        // Output rating note
        $rating_note = get_field( 'rating_note' );
        if ( $rating_note ){
            echo '<p class="description">' . $rating_note . '</p>';
        }
        ?>

        <div class="indicator-container">
            <div class="rating-total-indicator" data-circle="<?php echo esc_attr( $final_result_no_decimal ); ?>">
                <i class="show-total"><?php echo esc_html( $final_result ); ?></i>
                <div class="sides left-side"><span></span></div>
                <div class="sides right-side"><span></span></div>
            </div>
        </div>
        
    </div>
</div><!-- .single-rating -->