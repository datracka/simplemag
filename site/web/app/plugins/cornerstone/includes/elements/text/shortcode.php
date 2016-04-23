<?php

/**
 * Element Shortcode: Text
 */

$class = ( ( '' == $text_align ) ? 'x-text' : 'x-text ' . $text_align ) . ' ' . esc_attr( $class );

?><div <?php cs_atts( array( 'id' => $id, 'class' => trim($class), 'style' => $style ) ); ?>><?php
	echo do_shortcode( wpautop( $content ) );
?></div>