<?php

class CS_Mailchimp extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'mailchimp',
      'title'       => __( 'Mailchimp', csl18n() ),
      'section'     => 'content',
      'description' => __( 'Mailchimp description.', csl18n() ),
      'empty'       => array( 'form_id' => 'none' )
    );
  }

  public function controls() {

    $forms = array();
    $choices = array();


    if ( $this->is_active() ) {
      $forms = get_posts( array( 'post_type' => 'x-email-forms', 'posts_per_page' => 999 ) );
    }

    foreach ($forms as $form) {
      $choices[] = array( 'value' => $form->ID,  'label' => $form->post_title );
    }

    if ( empty( $choices ) ) {
      $choices[] = array( 'value' => 'none', 'label' => __( 'No Forms available', csl18n() ), 'disabled' => true );
    }

    $this->addControl(
      'form_id',
      'select',
      __( 'Select Email Form', csl18n() ),
      __( 'Select a previously setup email form.', csl18n() ),
      $choices[0]['value'],
      array( 'choices' => $choices )
    );

  }

  public function is_active() {
    return ( defined( 'X_EMAIL_INTEGRATION_IS_LOADED' ) && X_EMAIL_INTEGRATION_IS_LOADED );
  }

  public function render( $atts ) {

    extract( $atts );

    $shortcode = "[x_subscribe form=\"{$form_id}\"]";

    return $shortcode;

  }

}