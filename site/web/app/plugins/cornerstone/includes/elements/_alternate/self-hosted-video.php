<?php

class CS_Self_Hosted_Video extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'self-hosted-video',
      'title'       => __( 'Video Player', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Video Player description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'src' => '' )
    );
  }

  public function controls() {

    $this->addControl(
      'src',
      'text',
      __( 'Src &amp; Poster', csl18n() ),
      __( 'Include your video URL(s) here. If using multiple sources, separate them using the pipe character (|) and place fallbacks towards the end (i.e. .webm then .mp4 then .ogv).', csl18n() ),
      '',
      array(
        'expandable' => false,
        'placeholder' => home_url( __( 'video.mp4', csl18n() ) )
      )
    );

    // $this->addControl(
    //   'm4v',
    //   'text',
    //   __( 'MP4', csl18n() ),
    //   __( 'Include a .mp4 version of your video.', csl18n() ),
    //   ''
    // );

    // $this->addControl(
    //   'ogv',
    //   'text',
    //   __( 'OGV', csl18n() ),
    //   __( 'Include a .ogv version of your video for additional native browser support.', csl18n() ),
    //   ''
    // );

    $this->addControl(
      'poster',
      'image',
      NULL,
      NULL,
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
      'hide_controls',
      'toggle',
      __( 'Hide Controls', csl18n() ),
      __( 'Select to hide the controls on your self-hosted video.', csl18n() ),
      false
    );

    $this->addControl(
      'autoplay',
      'toggle',
      __( 'Autoplay', csl18n() ),
      __( 'Select to automatically play your self-hosted video.', csl18n() ),
      false
    );

    $this->addControl(
      'no_container',
      'toggle',
      __( 'No Container', csl18n() ),
      __( 'Select to remove the container around the video.', csl18n() ),
      false
    );

    $this->addControl(
      'preload',
      'select',
      __( 'Preload', csl18n() ),
      __( 'Specifies if and how the video should be loaded when the page loads. "None" means the video is not loaded when the page loads, "Auto" loads the video entirely, and "Metadata" loads only metadata.', csl18n() ),
      'none',
      array(
        'choices' => array(
          array( 'value' => 'none',     'label' => __( 'None', csl18n() ) ),
          array( 'value' => 'auto',     'label' => __( 'Auto', csl18n() ) ),
          array( 'value' => 'metadata', 'label' => __( 'Metadata', csl18n() ) )
        )
      )
    );

    $this->addControl(
      'advanced_controls',
      'toggle',
      __( 'Advanced Controls', csl18n() ),
      __( 'Enable video player\'s advanced controls.', csl18n() ),
      false
    );

    $this->addControl(
      'muted',
      'toggle',
      __( 'Mute', csl18n() ),
      __( 'Mute video player\'s audio.', csl18n() ),
      false
    );

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_video_player',
		    'title'        => __( 'Video (Self Hosted)', csl18n() ),
		    'section'    => __( 'Media', csl18n() ),
		    'description' => __( 'Include responsive video into your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/responsive-video/',
		  'params'      => array(
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
		        'param_name'  => 'm4v',
		        'heading'     => __( 'M4V', csl18n() ),
		        'description' => __( 'Include and .m4v version of your video.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'ogv',
		        'heading'     => __( 'OGV', csl18n() ),
		        'description' => __( 'Include and .ogv version of your video for additional native browser support.', csl18n() ),
		        'type'        => 'textfield',
		      ),
		      array(
		        'param_name'  => 'poster',
		        'heading'     => __( 'Poster Image', csl18n() ),
		        'description' => __( 'Include a poster image for your self-hosted video.', csl18n() ),
		        'type'        => 'attach_image',
		      ),
		      array(
		        'param_name'  => 'hide_controls',
		        'heading'     => __( 'Hide Controls', csl18n() ),
		        'description' => __( 'Select to hide the controls on your self-hosted video.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
		      ),
		      array(
		        'param_name'  => 'autoplay',
		        'heading'     => __( 'Autoplay', csl18n() ),
		        'description' => __( 'Select to automatically play your self-hosted video.', csl18n() ),
		        'type'        => 'checkbox',
		        'value'       => 'true'
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

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_video_player type=\"$aspect_ratio\" src=\"$src\" hide_controls=\"$hide_controls\" autoplay=\"$autoplay\" no_container=\"$no_container\" preload=\"$preload\" advanced_controls=\"$advanced_controls\" muted=\"$muted\"{$extra} poster=\"{$poster}\"]";

    return $shortcode;

  }

}