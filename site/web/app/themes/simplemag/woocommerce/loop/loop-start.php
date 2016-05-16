<?php
/**
 * Product Loop Start
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.0.0
 */

global $ti_option;
    
$smwc_layout_field = $ti_option['smwc_page_layout'];
$smwc_number_columns = $ti_option['smwc_product_item_columns'];
$smwc_product_overlay = $ti_option['smwc_description_on_image'] == true;

if ( $smwc_layout_field == 'masonry-layout' && $smwc_product_overlay ) {
    $product_layout_class = 'grids masonry-layout details-hover';
    
} elseif ( $smwc_layout_field == 'masonry-layout' ) {
    $product_layout_class = 'grids masonry-layout';
    
} elseif ( $smwc_layout_field == 'grid-layout' && $smwc_product_overlay ) {
    $product_layout_class = 'grids grid-layout details-hover';
    
} elseif ( $smwc_layout_field == 'grid-layout' ) {
    $product_layout_class = 'grids grid-layout';
    
} elseif ( $smwc_layout_field == 'list-layout' ) {
    $product_layout_class = 'list-layout';
    
} elseif ( $smwc_layout_field == 'classic-layout' ) {
    $product_layout_class = 'classic-layout';
    
} elseif ( $smwc_layout_field == 'asym-layout' ) {
    $product_layout_class = 'asym-layout';
}

// Number of columns.
if ( $smwc_number_columns == 'columns_2' ) {
    $number_columns_class = ' columns-size-2';   
} elseif ( $smwc_number_columns == 'columns_3' ) {
    $number_columns_class = ' columns-size-3';  
} elseif ( $smwc_number_columns == 'columns_4' ) {
    $number_columns_class = ' columns-size-4';   
}

if ( is_shop() || is_product_category() ) { ?>

<div class="entries <?php echo esc_attr( $product_layout_class . '' . $number_columns_class ); ?>">
    
<?php } else { ?>
    
<div class="grids grid-layout entries">  
    
<?php } ?>