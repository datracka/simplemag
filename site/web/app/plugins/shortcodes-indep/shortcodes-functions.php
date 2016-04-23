<?php
/**
 * All Shortcodes Functions
 *
 * @package ShortcodesIndep
 * @since 1.0
 * @author ThemesIndep : http://www.themesindep.com
 * @copyright Copyright (c) 2014, ThemesIndep
 * @link http://www.themesindep.com
 * @License: GNU General Public License version 2.0
 * @License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */


/**
 * Clean shortcodes
**/
if( !function_exists( 'sc_clean_shortcodes' )) {
	function sc_clean_shortcodes($content){   
		$array = array (
			'<p>[' => '[',
			']</p>' => ']',
			'<br />[' => '[',
			']<br />' => ']'
		);
		$content = strtr($content, $array);
		return $content;
	}
	add_filter( 'the_content', 'sc_clean_shortcodes' );
}



/**
 * Accordion
 * @since v1.0
**/

// Wrapper
if( !function_exists( 'shortcode_accordion_wrapper' )) {
	function sc_accordion_wrapper( $atts, $content = null  ) {
		
		// Enque scripts
		wp_enqueue_script('sc-frontend-toggle');
		
		// Display the accordion
		return '<div class="sc-accordion">' . do_shortcode( $content ) . '</div>';
	}
	add_shortcode( 'accordion', 'sc_accordion_wrapper' );
}

// Accordion single item
if( !function_exists( 'shortcode_accordion_item' )) {
	function sc_accordion_item( $atts, $content = null  ) {
		extract( shortcode_atts( array(
		  'title' => '',
		), $atts ));
		
		return '<a class="trigger" href="#">'. $title .'</a><div class="content">' . do_shortcode( $content ) . '</div>';
	}
	add_shortcode( 'item', 'sc_accordion_item' );
}



/**
 * Authors
 * @since v3.0
**/
if( !function_exists( 'shortcode_authors' )) {
	function shortcode_authors( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'admins' => '',
			'authors' => '',
			'contributors' => '',
			'editors' => '',
			'layout' => '',
			'imagestyle' => ''
		), $atts ));

		$output = '';

		// Admins
		if ( $admins == 'yes' ) :
			$admin_query = new WP_User_Query(
				array( 'role' => 'administrator', 'orderby' => 'post_count', 'order' => 'DESC' )
			);
			$admin = $admin_query->get_results();
		endif;

		// Authors
		if ( $authors == 'yes' ) :
			$author_query = new WP_User_Query(
				array( 'role' => 'author', 'orderby' => 'post_count', 'order' => 'DESC' )
			);
			$author = $author_query->get_results();
		endif;

		// Contributors
		if ( $contributors == 'yes' ) :
			$contributor_query = new WP_User_Query(
				array( 'role' => 'contributor', 'orderby' => 'post_count', 'order' => 'DESC' )
			);
			$contributor = $contributor_query->get_results();
		endif;

		// Editors
		if ( $editors == 'yes' ) :
			$editor_query = new WP_User_Query(
				array( 'role' => 'editor', 'orderby' => 'post_count', 'order' => 'DESC' )
			);
			$editor = $editor_query->get_results();
		endif;

		// Store all as site authors
		$site_authors = array_merge (
			isset( $admin ) ? $admin : array(),
			isset( $author ) ? $author : array(),
			isset( $contributor ) ? $contributor : array(),
			isset( $editor ) ? $editor : array()
		);
       
        $output .= '<ul class="sc-authors ' . $layout . ' clearfix">';
                    
	        foreach ( $site_authors as $author ):
	            
		        // Get the author ID
		        $author_id = $author->ID;
		        
		        // Retrieve the gravatar image by author email address
		        $author_avatar = get_avatar( get_the_author_meta( 'user_email', $author_id ), '330', '', get_the_author_meta( 'display_name', $author_id ) );
	            
		        $output .= '<li>';
		        	$output .= '<div class="author-avatar ' . $imagestyle. '"><a href="'.get_author_posts_url( $author_id ) . '">' . $author_avatar . '</a></div>';
		            $output .= '<h2><a href="'.get_author_posts_url( $author_id ).'">' . get_the_author_meta( 'display_name', $author_id ) . '</a></h2>';
		         $output .= '</li>';
	                    
	        endforeach;

        $output .= '</ul>';

		return $output;                    
	}
	add_shortcode( 'site_authors', 'shortcode_authors' );
}



/**
 * Button
 * @since v1.0
**/
if( !function_exists( 'shortcode_button' )) {
	function shortcode_button( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'color' => '',
			'text'  => '',
			'url'   => '',
			'openin' => '',
			'content' => ''
		), $atts ));
		return '<a href="' . $url . '" class="sc-button bg-' . $color . ' color-' . $text . '" target="' . $openin . '"><span>' . $content . '</span></a>';
	}
	add_shortcode( 'button', 'shortcode_button' );
}



/**
 * Drop Cap
 * @since v3.0
**/

// Wrapper
if( !function_exists( 'shortcode_dropcap' )) {
	function shortcode_dropcap( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'letter' => ''
		), $atts ));
		return '<span class="sc-dropcap">' . $letter . '</span>';
	}
	add_shortcode( 'dropcap', 'shortcode_dropcap' );
}



/**
 * Image Box
 * @since v3.0
**/
if( !function_exists( 'shortcode_imagebox' ) ) {
	function shortcode_imagebox( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'image' => '',
			'color' => '',
			'maintitle' => '',
			'subtitle' => '',
			'link' => 'no link',
			'space' => '60'
		), $atts));
		$output = '';
		
		$output .= '<div class="sc-box sc-image content-' . $color . '" style="background-image:url(' . $image . ');">';
			$output .= '<div class="inner" style="padding-top:'. $space . 'px;padding-bottom:' . $space . 'px;">';
				$output .= '<h2>' . $maintitle . '</h2>';
					if ( $subtitle != '' ){
						$output .= '<div class="sep"></div>';
						$output .= '<span>' . $subtitle . '</span>';
					}
					if ( $link != 'no link' ){
						$output .= '<a class="sc-link" href="' . $link . '"></a>';
					}
			$output .= '</div>';
		$output .= '</div>';
		return $output;
	}
	add_shortcode( 'imagebox', 'shortcode_imagebox' );
}



/**
 * Info Box
 * @since v1.0
**/
if( !function_exists( 'shortcode_infobox' ) ) {
	function shortcode_infobox( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'bg' => '',
			'opacity' => '',
			'color' => '',
			'maintitle' => '',
			'subtitle' => '',
			'space' => '30',
			'link' => '',
		), $atts));
		$output = '';
		
		$output .= '<div class="sc-box bg-' . $bg . ' content-' . $color . ' opacity-' . $opacity . '">';
			$output .= '<div class="inner" style="padding-top:'. $space . 'px;padding-bottom:' . $space . 'px;">';
				$output .= '<h2>' . $maintitle . '</h2>';
					if ( $subtitle != '' ){
						$output .= '<div class="sep"></div>';
						$output .= '<span>' . $subtitle . '</span>';
					}
					if ( $link != 'no link' ){
						$output .= '<a class="sc-link" href="' . $link . '"></a>';
					}
			$output .= '</div>';
		$output .= '</div>';
		return $output;
	}
	add_shortcode( 'infobox', 'shortcode_infobox' );
}



/** 
 * Columns
 * @since v1.0
**/

// Wrapper
if( !function_exists( 'shortcode_columns_row' )) {
	function shortcode_columns_row( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'width' => ''
		), $atts ));
		return '<div class="sc-columns '.$width.' clearfix">' . do_shortcode( $content ) . '</div>';
	}
	add_shortcode( 'columns_row', 'shortcode_columns_row' );
}

// Column
if( !function_exists( 'shortcode_column' )) {
	function shortcode_column( $atts, $content = null ) {
		extract( shortcode_atts(array(), $atts ));
		return '<div class="col">' . do_shortcode( $content ) . '</div>';
	}
	add_shortcode( 'column', 'shortcode_column' );
}



/** 
 * Tabs
 * @since v1.0
**/

// Wrapper
if (!function_exists( 'shortcode_tabgroup' )) {
	function shortcode_tabgroup( $atts, $content = null ) {
		
		//Enque scripts
		wp_enqueue_script('sc-frontend-tabs');
		
		// Display Tabs
		$defaults = array( 'layout' => 'tabs-horizontal' );
		extract( shortcode_atts( $defaults, $atts ) );
		preg_match_all( '/tab title="([^\"]+)"/i', $content, $matches, PREG_OFFSET_CAPTURE );
		$tab_titles = array();
		if( isset($matches[1]) ){ $tab_titles = $matches[1]; }
		$output = '';
				
		if( count($tab_titles) ){
			if ( $layout == 'horizontal' ){
		    	$output .= '<div id="sc-tab-' . rand(1, 100) . '" class="sc-tabs clearfix">';
			} else{
				$output .= '<div id="sc-tab-' . rand(1, 100) . '" class="sc-tabs tabs-' . $layout . ' clearfix">';
			}
				$output .= '<ul class="tabs-nav clearfix">';
				foreach( $tab_titles as $tab ){
					$output .= '<li><a href="#' . sanitize_title( $tab[0] ) . '">' . $tab[0] . '</a></li>';
				}
				$output .= '</ul>';
				$output .= '<div class="panes">';
					$output .= do_shortcode( $content );
				$output .= '</div>';
		    $output .= '</div>';
		} else {
			$output .= do_shortcode( $content );
		}
		return $output;
	}
	add_shortcode( 'tabgroup', 'shortcode_tabgroup' );
}

// Tab Single Item
if (!function_exists( 'shortcode_tab' )) {
	function shortcode_tab( $atts, $content = null ) {
		$defaults = array( 'title' => '' );
		extract( shortcode_atts( $defaults, $atts ) );
		return '<div id="' . sanitize_title( $title ) . '" class="tab-content">' . apply_filters( 'the_content', $content ) . '</div>';
	}
	add_shortcode( 'tab', 'shortcode_tab' );
}


/**
 * Title
 * @since v1.0
**/
if( !function_exists( 'shortcode_title' ) ) {
	function shortcode_title( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'maintitle'  => '',
			'subtitle'  => '',
		), $atts));
		$output = '';
		
		$output .= '<div class="sc-title">';
			$output .= '<h2 class="title"><span>' . $maintitle . '</span></h2>';
			if ( $subtitle != '' ){
				$output .=	'<span class="sub-title">' . $subtitle . '</span>';
			}
		$output .=	'</div>';
		return $output;
	}
	add_shortcode( 'title', 'shortcode_title' );
}


/**
 * Separator
 * @since v1.0
**/
if( !function_exists( 'shortcode_separator' )) {
	function shortcode_separator( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'type' => ''
		), $atts));
		return '<div class="sc-separator type-' . $type . '"></div>';
	}
	add_shortcode( 'separator', 'shortcode_separator' );
}