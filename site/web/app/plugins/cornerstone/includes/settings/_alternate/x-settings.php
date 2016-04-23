<?php

class CS_Settings_X_Settings extends Cornerstone_Legacy_Setting_Section {

  public function data() {
    return array(
      'name'        => 'x-settings',
      'title'       => __( 'X Settings', csl18n() ),
      'priority' => '20'
    );
  }

  public function condition() {
    return ( apply_filters( 'x_settings_pane', false ) );
  }

  public function controls() {

    global $post;

    if ( $post->post_type == 'post') {
      $this->postControls();
    } elseif ( $post->post_type == 'page') {
      $this->pageControls();
    } elseif ( $post->post_type == 'x-portfolio') {
      $this->portfolioControls();
    }

  }

  public function postControls() {

    global $post;

    $this->addControl(
      'body_css_class',
      'text',
      __( 'Body CSS Class(es)', csl18n() ),
      __( 'Add a custom CSS class to the &lt;body&gt; element. Separate multiple class names with a space.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_body_css_class', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'fullwidth_post_layout',
      'toggle',
      __( 'Fullwidth Post Layout', csl18n() ),
      __( 'If your global content layout includes a sidebar, selecting this option will remove the sidebar for this post.', csl18n() ),
      ( get_post_meta( $post->ID, '_x_post_layout', true ) == 'on' ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'alternate_index_title',
      'text',
      __( 'Alternate Index Title', csl18n() ),
      __( 'Filling out this text input will replace the standard title on all index pages (i.e. blog, category archives, search, et cetera) with this one.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_alternate_index_title', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'bg_image_full',
      'text',
      __( 'Background Image(s)', csl18n() ),
      __( 'Enter a single URL, or multiple comma separated URLs. Loading multiple background images will create a slideshow effect. To clear, delete the image URLs from the text field and save your page.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_bg_image_full', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_entry_bg_image_full_fade', true );
    $default = ( $meta == '' ) ? '750' : $meta;

    $this->addControl(
      'bg_image_full_fade',
      'text',
      __( 'Background Image(s) Fade', csl18n() ),
      __( 'Set a time in milliseconds for your image(s) to fade in. To disable this feature, set the value to "0."', csl18n() ),
      $default,
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_entry_image_full_duration', true );
    $default = ( $meta == '' ) ? '7500' : $meta;

    $this->addControl(
      'image_full_duration',
      'text',
      __( 'Background Images Duration', csl18n() ),
      __( 'Only applicable if multiple images are selected, creating a background image slider. Set a time in milliseconds for your images to remain on screen.', csl18n() ),
      $default,
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

  }

  public function pageControls() {

    global $post;

    $this->addControl(
      'body_css_class',
      'text',
      __( 'Body CSS Class(es)', csl18n() ),
      __( 'Add a custom CSS class to the &lt;body&gt; element. Separate multiple class names with a space.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_body_css_class', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'alternate_index_title',
      'text',
      __( 'Alternate Index Title', csl18n() ),
      __( 'Filling out this text input will replace the standard title on all index pages (i.e. blog, category archives, search, et cetera) with this one.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_alternate_index_title', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'disable_page_title',
      'toggle',
      __( 'Disable Page Title', csl18n() ),
      __( 'Select to disable the page title. Disabling the page title provides greater stylistic flexibility on individual pages.', csl18n() ),
      ( get_post_meta( $post->ID, '_x_entry_disable_page_title', true ) == 'on' ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_page_one_page_navigation', true );
    $default = ( $meta == '' ) ? 'Deactivated' : $meta;

    $menus = get_terms( 'nav_menu', array( 'hide_empty' => true ) );
    $choices = array();
    $choices[] = array( 'value' => 'Deactivated', 'label' => 'Deactivated' );
    foreach ( $menus as $menu ) {
      $choices[] = array( 'value' => $menu->name, 'label' => $menu->name );
    }

    $this->addControl(
      'one_page_navigation',
      'select',
      __( 'One Page Navigation', csl18n() ),
      __( 'To activate your one page navigation, select a menu from the dropdown. To deactivate one page navigation, set the dropdown back to "Deactivated."', csl18n() ),
      $default,
      array(
        'choices' => $choices,
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'bg_image_full',
      'text',
      __( 'Background Image(s)', csl18n() ),
      __( 'Enter a single URL, or multiple comma separated URLs. Loading multiple background images will create a slideshow effect. To clear, delete the image URLs from the text field and save your page.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_bg_image_full', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_entry_bg_image_full_fade', true );
    $default = ( $meta == '' ) ? '750' : $meta;

    $this->addControl(
      'bg_image_full_fade',
      'text',
      __( 'Background Image(s) Fade', csl18n() ),
      __( 'Set a time in milliseconds for your image(s) to fade in. To disable this feature, set the value to "0."', csl18n() ),
      $default,
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_entry_image_full_duration', true );
    $default = ( $meta == '' ) ? '7500' : $meta;

    $this->addControl(
      'image_full_duration',
      'text',
      __( 'Background Images Duration', csl18n() ),
      __( 'Only applicable if multiple images are selected, creating a background image slider. Set a time in milliseconds for your images to remain on screen.', csl18n() ),
      $default,
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

  }

  public function portfolioControls() {

    global $post;

    $this->addControl(
      'body_css_class',
      'text',
      __( 'Body CSS Class(es)', csl18n() ),
      __( 'Add a custom CSS class to the &lt;body&gt; element. Separate multiple class names with a space.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_body_css_class', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'alternate_index_title',
      'text',
      __( 'Alternate Index Title', csl18n() ),
      __( 'Filling out this text input will replace the standard title on all index pages (i.e. blog, category archives, search, et cetera) with this one.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_alternate_index_title', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $pages = get_pages( array(
      'meta_key'    => '_wp_page_template',
      'meta_value'  => 'template-layout-portfolio.php',
      'sort_order'  => 'ASC',
      'sort_column' => 'ID'
    ) );

    if ( ! empty($pages) ) {

      $current = get_post_meta( $post->ID, '_x_portfolio_parent', true );

      ob_start();
      echo '<select name="portfolio_parent" >';
      echo '<option value="Default">Default</option>';
      foreach ( $pages as $page ) {
        echo '<option value="' . $page->ID . '"';
        if ( $current == $page->ID ) {
          echo ' selected="selected"';
        }
        echo'>' . $page->post_title . '</option>';
      }
      echo '</select>';

      $markup = ob_get_clean();
      $this->addControl(
        'portfolio_parent',
        'wpselect',
        __('Portfolio Parent', csl18n() ),
        __('Assign the parent portfolio page for this portfolio item. This will be used in various places throughout the theme such as your breadcrumbs. If "Default" is selected then the first page with the "Layout - Portfolio" template assigned to it will be used.', csl18n() ),
        "{$current}",
        array(
          'markup' => $markup,
          'notLive' => 'settings-theme-changed'
        )
      );
    }

    $this->addControl(
      'media_type',
      'select',
      __( 'Media Type', csl18n() ),
      __( 'Select which kind of media you want to display for your portfolio. If selecting a "Gallery," simply upload your images to this post and organize them in the order you want them to display.', csl18n() ),
      get_post_meta( $post->ID, '_x_portfolio_media', true ),
      array(
        'choices' => array(
          array( 'value' => 'Image',   'label' => __( 'Image', csl18n() ) ),
          array( 'value' => 'Gallery', 'label' => __( 'Gallery', csl18n() ) ),
          array( 'value' => 'Video',   'label' => __( 'Video', csl18n() ) ),
        ),
        'notLive' => 'settings-theme-changed'
      )
    );

    $current_video_aspect_ratio = get_post_meta( $post->ID, '_x_portfolio_aspect_ratio', true );
    $this->addControl(
      'video_aspect_ratio',
      'select',
      __( 'Video Aspect Ratio', csl18n() ),
      __( 'If selecting "Video," choose the aspect ratio you would like for your video.', csl18n() ),
      ($current_video_aspect_ratio == '' ) ? '16:9' : $current_video_aspect_ratio,
      array(
        'choices' => array(
          array( 'value' => '16:9',   'label' => '16:9' ),
          array( 'value' => '5:3', 'label' => '5:3' ),
          array( 'value' => '5:4',   'label' => '5:4' ),
          array( 'value' => '4:3',   'label' => '4:3' ),
          array( 'value' => '3:2',   'label' => '3:2' ),
        ),
        'condition' => array(
          'media_type' => 'Video',
        ),
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'm4v_file_url',
      'text',
      __( 'M4V File URL', csl18n() ),
      __( 'If selecting "Video," place the URL to your .m4v video file here.', csl18n() ),
      get_post_meta( $post->ID, '_x_portfolio_m4v', true ),
      array(
        'condition' => array(
          'media_type' => 'Video',
        ),
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'ogv_file_url',
      'text',
      __( 'OGV File URL', csl18n() ),
      __( 'If selecting "Video," place the URL to your .ogv video file here.', csl18n() ),
      get_post_meta( $post->ID, '_x_portfolio_ogv', true ),
      array(
        'condition' => array(
          'media_type' => 'Video',
        ),
        'notLive' => 'settings-theme-changed'
      )
    );

    if (current_user_can( 'unfiltered_html' ) ) {

      $this->addControl(
        'embedded_video_code',
        'textarea',
        __( 'Embedded Video Code', csl18n() ),
        __( 'If you are using something other than self hosted video such as YouTube, Vimeo, or Wistia, paste the embed code here. This field will override the above.', csl18n() ),
        get_post_meta( $post->ID, '_x_portfolio_embed', true ),
        array(
          'condition' => array(
            'media_type' => 'Video',
          ),
          'notLive' => 'settings-theme-changed'
        )
      );
    }

    $this->addControl(
      'featured_content',
      'select',
      __( 'Featured Content', csl18n() ),
      __( 'Select "Media" if you would like to show your video or gallery on the index page in place of the featured image.', csl18n() ),
      get_post_meta( $post->ID, '_x_portfolio_index_media', true ),
      array(
        'choices' => array(
          array( 'value' => 'Thumbnail', 'label' => __( 'Thumbnail', csl18n() ) ),
          array( 'value' => 'Media',     'label' => __( 'Media', csl18n() ) ),
        ),
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'project_link',
      'text',
      __( 'Project Link', csl18n() ),
      __( 'Provide an external link to the project you worked on if one is available.', csl18n() ),
      get_post_meta( $post->ID, '_x_portfolio_project_link', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $this->addControl(
      'bg_image_full',
      'text',
      __( 'Background Image(s)', csl18n() ),
      __( 'Enter a single URL, or multiple comma separated URLs. Loading multiple background images will create a slideshow effect. To clear, delete the image URLs from the text field and save your page.', csl18n() ),
      get_post_meta( $post->ID, '_x_entry_bg_image_full', true ),
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_entry_bg_image_full_fade', true );
    $default = ( $meta == '' ) ? '750' : $meta;

    $this->addControl(
      'bg_image_full_fade',
      'text',
      __( 'Background Image(s) Fade', csl18n() ),
      __( 'Set a time in milliseconds for your image(s) to fade in. To disable this feature, set the value to "0."', csl18n() ),
      $default,
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

    $meta = get_post_meta( $post->ID, '_x_entry_image_full_duration', true );
    $default = ( $meta == '' ) ? '7500' : $meta;

    $this->addControl(
      'image_full_duration',
      'text',
      __( 'Background Images Duration', csl18n() ),
      __( 'Only applicable if multiple images are selected, creating a background image slider. Set a time in milliseconds for your images to remain on screen.', csl18n() ),
      $default,
      array(
        'notLive' => 'settings-theme-changed'
      )
    );

  }

  public function handler( $atts ) {

    global $post;
  	extract( $atts );

  	$classes = explode(' ', $body_css_class );
  	array_map('sanitize_html_class', $classes);
  	$body_css_class = implode(' ', $classes );

  	update_post_meta( $post->ID, '_x_entry_body_css_class', $body_css_class );
  	update_post_meta( $post->ID, '_x_entry_alternate_index_title', sanitize_text_field( $alternate_index_title ) );
  	update_post_meta( $post->ID, '_x_entry_bg_image_full', $bg_image_full );
    update_post_meta( $post->ID, '_x_entry_bg_image_full_fade', $bg_image_full_fade );
    update_post_meta( $post->ID, '_x_entry_image_full_duration', $image_full_duration );

    if ( $post->post_type == 'post') {

	    update_post_meta( $post->ID, '_x_post_layout', ( $fullwidth_post_layout == 'true' ) ? 'on' : '' );

    } elseif ( $post->post_type == 'page') {

	    update_post_meta( $post->ID, '_x_entry_disable_page_title', ( $disable_page_title == 'true' ) ? 'on' : '' );
	    update_post_meta( $post->ID, '_x_page_one_page_navigation', $one_page_navigation );

    } elseif ( $post->post_type == 'x-portfolio') {

	    update_post_meta( $post->ID, '_x_portfolio_parent', $portfolio_parent );
	    update_post_meta( $post->ID, '_x_portfolio_media', $media_type );
	    update_post_meta( $post->ID, '_x_portfolio_aspect_ratio', $video_aspect_ratio );
	    update_post_meta( $post->ID, '_x_portfolio_m4v', $m4v_file_url );
	    update_post_meta( $post->ID, '_x_portfolio_ogv', $ogv_file_url );
	    update_post_meta( $post->ID, '_x_portfolio_embed', $embedded_video_code );
	    update_post_meta( $post->ID, '_x_portfolio_index_media', $featured_content );
	    update_post_meta( $post->ID, '_x_portfolio_project_link', $project_link );

    }

  }

}