<?php

// Feature Box
// =============================================================================

function x_shortcode_feature_box( $atts, $content = '' ) {
  extract( shortcode_atts( array(
    'id'                       => '',
    'class'                    => '',
    'style'                    => '',
    'graphic'                  => '',
    'graphic_size'             => '',
    'graphic_shape'            => '',
    'graphic_border'           => '',
    'graphic_color'            => '',
    'graphic_bg_color'         => '',
    'graphic_icon'             => '',
    'graphic_image'            => '',
    'graphic_animation'        => '',
    'graphic_animation_offset' => '',
    'graphic_animation_delay'  => '',
    'title'                    => '',
    'title_color'              => '',
    'text'                     => '',
    'text_color'               => '',
    'link_text'                => '',
    'link_color'               => '',
    'href'                     => '',
    'href_title'               => '',
    'href_target'              => '',
    'align_h'                  => '',
    'align_v'                  => '',
    'side_graphic_spacing'     => '',
    'max_width'                => '',
    'child'                    => '',
    'connector_width'          => '',
    'connector_style'          => '',
    'connector_color'          => '',
    'connector_animation'      => ''
  ), $atts, 'x_feature_box' ) );

	//
	// Allow text attribute to be used instead of content.
	//

	if ( '' == $content && '' != $text ) {
		$content = wp_specialchars_decode( $text );
	}

	$title = wp_specialchars_decode( $title );

  $id                       = ( $id                       != ''      ) ? 'id="' . esc_attr( $id ) . '"' : '';
  $class                    = ( $class                    != ''      ) ? 'x-feature-box ' . esc_attr( $class ) : 'x-feature-box';
  $style                    = ( $style                    != ''      ) ? $style : '';
  $graphic                  = ( $graphic                  != ''      ) ? $graphic : 'icon';
  $graphic_size             = ( $graphic_size             != ''      ) ? $graphic_size : '60px';
  $graphic_shape            = ( $graphic_shape            != ''      ) ? $graphic_shape : 'square';
  $graphic_border           = ( $graphic_border           != ''      ) ? $graphic_border : '';
  $graphic_color            = ( $graphic_color            != ''      ) ? $graphic_color : '#ffffff';
  $graphic_bg_color         = ( $graphic_bg_color         != ''      ) ? $graphic_bg_color : 'transparent';
  $graphic_icon             = ( $graphic_icon             != ''      ) ? $graphic_icon : '';
  $graphic_image            = ( $graphic_image            != ''      ) ? $graphic_image : '';
  $graphic_animation        = ( $graphic_animation        != ''      ) ? $graphic_animation : 'none';
  $graphic_animation_offset = ( $graphic_animation_offset != ''      ) ? $graphic_animation_offset : '50';
  $graphic_animation_delay  = ( $graphic_animation_delay  != ''      ) ? $graphic_animation_delay : '0';
  $title_color              = ( $title_color              != ''      ) ? $title_color : '';
  $text_color               = ( $text_color               != ''      ) ? $text_color : '';
  $link_text                = ( $link_text                != ''      ) ? $link_text : '';
  $link_color               = ( $link_color               != ''      ) ? ' style="color: ' . $link_color . ';"' : '';
  $href                     = ( $href                     != ''      ) ? $href : '#';
  $href_title               = ( $href_title               != ''      ) ? $href_title : $link_text;
  $href_target              = ( $href_target              == 'blank' ) ? ' target="_blank"' : '';
  $align_h                  = ( $align_h                  != ''      ) ? $align_h : 'center';
  $align_v                  = ( $align_v                  != ''      ) ? $align_v : 'top';
  $side_graphic_spacing     = ( $side_graphic_spacing     != ''      ) ? $side_graphic_spacing : '20px';
  $max_width                = ( $max_width                != ''      ) ? ' max-width: ' . $max_width . ';' : ' max-width: none;';
  $child                    = ( $child                    == 'true'  ) ? $child : '';
  $connector_width          = ( $connector_width          != ''      ) ? $connector_width : '1px';
  $connector_style          = ( $connector_style          != ''      ) ? $connector_style : 'dashed';
  $connector_color          = ( $connector_color          != ''      ) ? $connector_color : '#2ecc71';
  $connector_animation      = ( $connector_animation      != ''      ) ? $connector_animation : 'none';


  //
  // Graphic - design.
  //

  $graphic_font_size = 'font-size: ' . $graphic_size . ';';

  if ( $graphic_border != '' && $graphic_shape != 'hexagon' && $graphic_shape != 'badge' ) {
    $graphic_border = ' ' . $graphic_border;
  } else {
    $graphic_border = '';
  }

  if ( $graphic != 'image' ) {
    $graphic_colors = ' color: ' . $graphic_color . '; background-color: ' . $graphic_bg_color . ';';
  } else {
    $graphic_colors = '';
  }

  if ( $graphic_shape == 'hexagon' || $graphic_shape == 'badge' ) {
    $graphic_pseudo_element_color = ' border-color: ' . $graphic_bg_color . ';';
  } else {
    $graphic_pseudo_element_color = '';
  }


  //
  // Graphic - side alignment.
  //

  if ( $align_h != 'center' ) {
    $side_align_style     = ' style="display: table-cell; vertical-align: ' . $align_v . ';"';
    $side_graphic_spacing = ( $align_h == 'left' ) ? ' margin-right: ' . $side_graphic_spacing . ';' : ' margin-left: ' . $side_graphic_spacing . ';';
  } else {
    $side_align_style     = '';
    $side_graphic_spacing = '';
  }


  //
  // Graphic - attributes.
  //

  $graphic_container_class_style = ' class="x-feature-box-graphic ' . $graphic_shape . '"' . $side_align_style;
  $graphic_outer_class_style     = ' class="x-feature-box-graphic-outer ' . $graphic_shape . cs_animation_base_class( $graphic_animation ) . '" style="' . $side_graphic_spacing . '"';
  $graphic_inner_class_style     = ' class="x-feature-box-graphic-inner ' . $graphic_shape . '" style="' . $graphic_font_size . $graphic_pseudo_element_color . '"';
  $graphic_style                 = ' style="margin: 0 auto;' . $graphic_border . $graphic_colors . '"';


  //
  // Graphic.
  //

  if ( $graphic == 'image' ) {

    $graphic = '<div' . $graphic_container_class_style . '>'
               . '<div' . $graphic_outer_class_style . '>'
                 . '<div' . $graphic_inner_class_style . '>'
                   . '<img class="' . $graphic_shape . '" src="' . $graphic_image . '"' . $graphic_style . '>'
                 . '</div>'
               . '</div>'
             . '</div>';

  } else if ( $graphic == 'numbers' && $child == 'true' ) {

    $graphic = '<div' . $graphic_container_class_style . '>'
               . '<div' . $graphic_outer_class_style . '>'
                 . '<div' . $graphic_inner_class_style . '>'
                   . '<i class="number w-h ' . $graphic_shape . '"' . $graphic_style . '></i>'
                 . '</div>'
               . '</div>'
             . '</div>';

  } else {

    $graphic = '<div' . $graphic_container_class_style . '>'
               . '<div' . $graphic_outer_class_style . '>'
                 . '<div' . $graphic_inner_class_style . '>'
                   . '<i class="x-icon-' . $graphic_icon . ' ' . $graphic_shape . '" data-x-icon="&#x' . fa_unicode( $graphic_icon ) . ';"' . $graphic_style . '></i>'
                 . '</div>'
               . '</div>'
             . '</div>';

  }


  //
  // Connector.
  //

  if ( $child == 'true' ) {

    $left            = ( $align_h == 'left'   ) ? ' left: 0;' : ' left: calc(100% - ' . $graphic_size . ');';
    $right           = ( $align_h == 'right'  ) ? ' right: 0;' : ' right: calc(100% - ' . $graphic_size . ');';
    $connector_class = cs_animation_base_class( $connector_animation );
    $connector_style = 'style="' . $graphic_font_size . $left . $right . ' border-left: ' . $connector_width . ' ' . $connector_style . ' ' . $connector_color . ';"';
    $connector_text  = '<span class="visually-hidden">Connector.</span>';

    if ( $align_v == 'top' ) {
      $connector = '<span class="x-feature-box-connector full' . $connector_class . '" ' . $connector_style . '>' . $connector_text . '</span>';
    } else {
      $connector = '<span class="x-feature-box-connector upper' . $connector_class . '" ' . $connector_style . '>' . $connector_text . '</span>'
                 . '<span class="x-feature-box-connector lower' . $connector_class . '" ' . $connector_style . '>' . $connector_text . '</span>';
    }

  } else {
    $connector = '';
  }


  //
  // Content.
  //

  $title_color = ( $title_color != '' ) ? ' style="color: ' . $title_color . ';"' : '';
  $text_color  = ( $text_color  != '' ) ? ' style="color: ' . $text_color . ';"' : '';
  $link        = ( $link_text   != '' ) ? ' <a href="' . $href . '" title="' . $href_title . '"' . $href_target . $link_color . '>' . $link_text . '</a>' : '';

  $output = '<div class="x-feature-box-content"' . $side_align_style . '>'
             . '<h4 class="x-feature-box-title"' . $title_color . '>' . $title . '</h4>'
             . '<p class="x-feature-box-text"' . $text_color . '>' . do_shortcode( $content ) . $link . '</p>'
           . '</div>';


  //
  // Output.
  //

  $js_params = array(
    'child'            => ( $child == 'true' ),
    'graphicAnimation' => $graphic_animation
  );

  if ( $child == 'true' ) {
    $js_params['connectorAnimation'] = $connector_animation;
    $js_params['alignH']             = $align_h;
    $js_params['alignV']             = $align_v;
  } else {
    $js_params['graphicAnimationOffset'] = $graphic_animation_offset;
    $js_params['graphicAnimationDelay']  = $graphic_animation_delay;
  }

  $data            = cs_generate_data_attributes( 'feature_box', $js_params );
  $element         = ( $child   == 'true'  ) ? 'li' : 'div';
  $ordered_content = ( $align_h == 'right' ) ? $output . $graphic : $graphic . $output;
  $align_h         = ' ' . $align_h . '-text';
  $align_v         = ' ' . $align_v . '-text';

  $output = "<{$element} {$id} class=\"{$class}{$align_h}{$align_v} cf\" style=\"{$style}{$max_width}\" {$data}>"
            . $connector
            . $ordered_content
          . "</{$element}>";

  return $output;
}

add_shortcode( 'x_feature_box', 'x_shortcode_feature_box' );