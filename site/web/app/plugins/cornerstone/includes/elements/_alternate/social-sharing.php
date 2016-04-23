<?php

class CS_Social_Sharing extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'social-sharing',
      'title'       => __('Social Sharing', csl18n() ),
      'section'     => 'social',
      'description' => __( 'Social Sharing description.', csl18n() ),
      'supports'    => array( 'id', 'class', 'style' )
    );
  }

  public function controls() {

    $this->addControl(
      'heading',
      'text',
      __( 'Title', csl18n() ),
      __( 'Enter in a title for your social links.', csl18n() ),
      __( 'Share this Post', csl18n() )
    );

    $this->addControl(
      'share_title',
      'text',
      __( 'Share Title', csl18n() ),
      __( 'Enter in the title that displays when you share the page. The default is the Page title.', csl18n() ),
      ''
    );

    $this->addControl(
      'facebook',
      'toggle',
      __( 'Facebook', csl18n() ),
      __( 'Select to activate the Facebook sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'twitter',
      'toggle',
      __( 'Twitter', csl18n() ),
      __( 'Select to activate the Twitter sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'google_plus',
      'toggle',
      __( 'Google Plus', csl18n() ),
      __( 'Select to activate the Google Plus sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'linkedin',
      'toggle',
      __( 'LinkedIn', csl18n() ),
      __( 'Select to activate the LinkedIn sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'pinterest',
      'toggle',
      __( 'Pinterest', csl18n() ),
      __( 'Select to activate the Pinterest sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'reddit',
      'toggle',
      __( 'Reddit', csl18n() ),
      __( 'Select to activate the Reddit sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'email',
      'toggle',
      __( 'Email', csl18n() ),
      __( 'Select to activate the email sharing link.', csl18n() ),
      false
    );

    $this->addControl(
      'email_subject',
      'text',
      __( 'Email Subject', csl18n() ),
      __( 'Enter the email subject when sharing the link.', csl18n() ),
      __( 'Hey, thought you might enjoy this! Check it out when you have a chance:', csl18n() ),
      array(
        'condition' => array(
          'email' => true
        )
      )
    );

  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_share title=\"$heading\" share_title=\"$share_title\" facebook=\"$facebook\" twitter=\"$twitter\" google_plus=\"$google_plus\" linkedin=\"$linkedin\" pinterest=\"$pinterest\" reddit=\"$reddit\" email=\"$email\" email_subject=\"$email_subject\"{$extra}]";

    return $shortcode;

  }

}