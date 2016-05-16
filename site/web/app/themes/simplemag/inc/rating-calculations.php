<?php
/**
 * Final rating calculations.
 * The function (apply_filters) comes from functions.php
 *
 * Applies to:
 * 1. Latest Reviews & Latest Posts sections
 * 2. Latest Reviews widget
 * 3. Single Post when rasting is enabled
**/

// Call total score calculation function
$get_result = apply_filters( 'ti_score_total', '' );

// Get the final score
$total_score = number_format( $get_result, 1, '.', '' );

// If final score is decimal like 5.0 or is equal to 10.0
// remove .0 to display it as integer
if ( strlen ( $total_score ) || $total_score == '10.0' ) {
    $final_result = str_replace( ".0", "", $total_score );
} else {
    $final_result = $total_score;
}

// Multiply by 10 to remove the decimal value
// Displayed in data-cirlce attr.
$final_result_no_decimal = $total_score * 10;