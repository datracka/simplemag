<?php

class CS_Embedded_Audio extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'embedded-audio',
      'title'       => __( 'Embedded Audio', csl18n() ),
      'section'     => 'media',
      'description' => __( 'Embedded Audio description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' ),
      'empty'       => array( 'content' => '' )
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

  }

  public function xsg() {
  	$this->sg_map(
		  array(
		    'id'        => 'x_audio_embed',
		    'title'        => __( 'Audio (Embedded)', csl18n() ),
		    'section'    => __( 'Media', csl18n() ),
		    'description' => __( 'Place audio files into your content', csl18n() ),
		    'demo' =>   'http://theme.co/x/demo/integrity/1/shortcodes/audio/',
		  'params'      => array(
		      array(
		        'param_name'  => 'content',
		        'heading'     => __( 'Code (See Notes Below)', csl18n() ),
		        'description' => __( 'Switch to the "text" editor and do not place anything else here other than your &lsaquo;iframe&rsaquo; or &lsaquo;embed&rsaquo; code.', csl18n() ),
		        'type'        => 'textarea_html',

		        'value'       => ''
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

    $shortcode = "[x_audio_embed{$extra}]{$content}[/x_audio_embed]";

    return $shortcode;

  }

}