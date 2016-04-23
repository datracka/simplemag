<?php
/**
 * 1. Setup definition.php with `ui` function
 * 2. Create defaults.php with keys for the attributes to be used
 * 3. Create controls.php to map controls. If dynamic options are needed, use
 * 		`$this->control_options('key_name')` so they can be fetched later
 * 4. Setup a condition_filter method returning true/false for every key in defaults
 * 5. Setup get_data method returning any information already stored (don't return defaults)
 */

class CS_Settings_General {

	public $priority = 10;
	public $manager;

	public function ui() {
		return array( 'title' => __( 'General', csl18n() ) );
	}

	public function condition_filter( $key ) {

		global $post;

		if ( 'custom_js' == $key )
			return current_user_can( 'unfiltered_html' );

		if ( 'post_title' == $key )
			return post_type_supports( $post->post_type, 'title' );

		if ( 'post_status' == $key )
			return current_user_can( $this->manager->post_type_object->cap->publish_posts );

		if ( 'allow_comments' == $key )
			return post_type_supports( $post->post_type, 'comments' );

		$has_page_attributes = post_type_supports( $post->post_type, 'page-attributes' );

		if ( 'post_parent' == $key )
			return ( $has_page_attributes && $this->manager->post_type_object->hierarchical );

		if ( 'page_template' == $key )
			return ( $has_page_attributes && count( wp_get_theme()->get_page_templates( $post ) ) > 0 );

		// Give a pass to anything else (custom_css)
		return true;

	}

	public function get_data( $key ) {

		global $post;

		$settings = array();

		if ( isset( $this->manager->post_meta['_cornerstone_settings'] ) )
			$settings = maybe_unserialize( $this->manager->post_meta['_cornerstone_settings'][0] );

		if ( 'custom_css' == $key && isset( $settings['custom_css'] ) )
			return $settings['custom_css'];

		if ( 'custom_js' == $key && isset( $settings['custom_js'] ) )
			return $settings['custom_js'];

		if ( 'post_title' == $key && isset( $post->post_title ) )
			return $post->post_title;

		if ( 'post_status' == $key && isset( $post->post_status ) )
			return $post->post_status;

		if ( 'allow_comments' == $key && isset( $post->comment_status ) )
			return ($post->comment_status == 'open' );

		if ( 'post_parent' == $key && isset( $post->post_parent ) )
			return "{$post->post_parent}";

		if ( 'page_template' == $key && isset( $this->manager->post_meta['_wp_page_template'] ) )
			return $this->manager->post_meta['_wp_page_template'][0];

		return null;

	}

	public function post_status_choices() {

		if ( !$this->manager->can_use( 'post_status' ) )
			return null;

		global $post;
		$choices = array();

		$choices[] = array( 'value' => 'publish', 'label' => __('Publish', csl18n() ) );

		switch ($post->post_status) {
			case 'private':
				$choices[] = array( 'value' => 'private', 'label' => __('Privately Published', csl18n() ) );
				break;
			case 'future':
				$choices[] = array( 'value' => 'future', 'label' => __('Scheduled', csl18n() ) );
				break;
			case 'pending':
				$choices[] = array( 'value' => 'pending', 'label' => __('Pending Review', csl18n() ) );
				break;
			default:
				$choices[] = array( 'value' => 'draft', 'label' => __('Draft', csl18n() ) );
				break;
		}

		return $choices;

	}

	public function post_parent_markup() {

		if ( !$this->manager->can_use( 'post_status' ) )
			return null;

		global $post;

		$dropdown_args = array(
      'post_type'        => $post->post_type,
      'exclude_tree'     => $post->ID,
      'selected'         => $post->post_parent,
      'name'             => 'parent_id',
      'show_option_none' => __('(no parent)', csl18n() ),
      'sort_column'      => 'menu_order, post_title',
      'echo'             => 0,
    );

    return wp_dropdown_pages( apply_filters( 'page_attributes_dropdown_pages_args', $dropdown_args, $post ) );

	}

	public function page_template_choices() {

		if ( !$this->manager->can_use( 'post_status' ) )
			return null;

		global $post;

		$choices = array();
		$page_templates = wp_get_theme()->get_page_templates( $post );
		ksort( $page_templates );

		$choices[] = array( 'value' => 'default', 'label' => apply_filters( 'default_page_template_title',  __( 'Default Template' ), csl18n() ) );

		foreach ($page_templates as $value => $label) {
			$choices[] = array( 'value' => $value, 'label' => $label );
		}

		return $choices;

	}

	public function handler( $data ) {

		global $post;
    $settings = get_post_meta( $post->ID, '_cornerstone_settings', true );
		$update = array();

    $update['post_title'] = $data['post_title'];

  	$update['comment_status'] = ( $data['allow_comments'] == 'true' ) ? 'open' : 'closed';

    if ( current_user_can( $this->manager->post_type_object->cap->publish_posts ) )
    	$update['post_status'] = $data['post_status'];

    if ( post_type_supports( $post->post_type, 'page-attributes' ) ) {

    	$page_templates = wp_get_theme()->get_page_templates( $post );

    	$update['page_template'] = 'default';

      if ( isset( $page_templates[$data['page_template']] ) )
        $update['page_template'] = $data['page_template'];

      if ( isset( $data['post_parent'] ) )
        $update['post_parent'] = (int) $data['post_parent'];

    }

    if ( isset( $data['custom_css'] ) )
      $settings['custom_css'] = $data['custom_css'];

    // Update Custom JS
    if ( isset( $data['custom_js'] ) && current_user_can('unfiltered_html' ) )
      $settings['custom_js'] = $data['custom_js'];

    // Minify JS
    if ( isset( $settings['custom_js'] ) ) {
      require(CS()->path('includes/utility/jsqueeze.php'));
      $jz = new JSqueeze;
      $minified = $jz->squeeze( $settings['custom_js'] );
      if ($minified == ';') {
        $minified = '';
      }

      $settings['custom_js_mini'] = $minified;
    }



    if ( !empty( $update ) ) {
      $update['ID'] = $post->ID;
      $result = wp_update_post( $update, true );

      if ( is_wp_error( $result ) )
      	return $result;
    }


    update_post_meta( $post->ID, '_cornerstone_settings', $settings );

	}

}