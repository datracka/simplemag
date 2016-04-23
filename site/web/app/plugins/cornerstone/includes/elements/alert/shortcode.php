<?php

/**
 * Element Shortcode: Alert
 */

$close_class = ( $close ) ? 'fade in' : 'x-alert-block';
$class = trim( "x-alert x-alert-$type " . $close_class . ' ' . $class );

?>

<div <?php cs_atts( array( 'id' => $id, 'class' => $class, 'style' => $style ) ); ?>>
<?php if ( $close === true ) : ?>
	<button type="button" class="close" data-dismiss="alert">&times;</button>
<?php endif; ?>
<?php if ( $heading ) : ?>
	<h6 class="h-alert"> <?php echo $heading; ?></h6>
<?php endif; ?>
<?php echo do_shortcode($content); ?>
</div>