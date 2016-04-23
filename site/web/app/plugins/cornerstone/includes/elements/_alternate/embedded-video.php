<?php

class CS_Embedded_Video extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'embedded-video',
      'title'       => __( 'Embedded Video', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Embedded Video description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'content' => '' ),
    );
  }

  public function controls() {

    $this->addControl(
      'content',
      'textarea',
      __( 'Embed Code', csl18n() ),
      __( 'Input your &lt;iframe&gt; or &lt;embed&gt; code from a third party service.', csl18n() ),
      ''
    );

    $this->addControl(
      'aspect_ratio',
      'select',
      __( 'Aspect Ratio', csl18n() ),
      __( 'Select your aspect ratio.', csl18n() ),
      '16:9',
      array(
        'choices' => array(
          array( 'value' => '16:9', 'label' => __( '16:9', csl18n() ), ),
          array( 'value' => '5:3',  'label' => __( '5:3', csl18n() ), ),
          array( 'value' => '5:4',  'label' => __( '5:4', csl18n() ), ),
          array( 'value' => '4:3',  'label' => __( '4:3', csl18n() ), ),
          array( 'value' => '3:2',  'label' => __( '3:2', csl18n() ), )
        )
      )
    );

    $this->addControl(
      'no_container',
      'toggle',
      __( 'No Container', csl18n() ),
      __( 'Select to remove the container around the video.', csl18n() ),
      false
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_video_embed',
		    'title'        => __( 'Video (Embedded)', csl18n() ),
		    'section'    => __( 'Media', csl18n() ),
		    'description' => __( 'Include responsive video into your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/responsive-video/',
		  'params'      => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Code (See Notes Below)', csl18n() ),
		        'description' => __( 'Switch to the "text" editor and do not place anything else here other than your &lsaquo;iframe&rsaquo; or &lsaquo;embed&rsaquo; code.', csl18n() ),
		        'type'        => 'textarea_html',
		        'value'       => ''
		      ),
		      array(
		        'param_name'  => 'type',
		        'heading'     => __( 'Aspect Ratio', csl18n() ),
		        'description' => __( 'Select your aspect ratio.', csl18n() ),
		        'type'        => 'dropdown',
		        'value'       => array(
		          '16:9' => '16:9',
		          '5:3'  => '5:3',
		          '5:4'  => '5:4',
		          '4:3'  => '4:3',
		          '3:2'  => '3:2'
		        )
		      ),
		      array(
		        'param_name'  => 'no_container',
		        'heading'     => __( 'No Container', csl18n() ),
		        'description' => __( 'Select to remove the container around the video.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      Cornerstone_Shortcode_Generator::map_default_id(),
		      Cornerstone_Shortcode_Generator::map_default_class(),
		      Cornerstone_Shortcode_Generator::map_default_style()
		    )
		  )
		);
  }

  public function is_active() {
    return current_user_can( 'unfiltered_html' );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_video_embed no_container=\"$no_container\" type=\"$aspect_ratio\"{$extra}]{$content}[/x_video_embed]";

    return $shortcode;

  }

}