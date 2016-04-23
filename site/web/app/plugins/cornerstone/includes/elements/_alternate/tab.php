<?php

class CS_Tab extends Cornerstone_Element_Base {

  public function data() {
    return array(
      'name'        => 'tab',
      'title'       => __( 'Tab', csl18n() ),
      'section'     => '_content',
      'description' => __( 'Tab description.', csl18n() ),
      'supports'    => array( 'class' ),
      'render'      => false,
      'delegate'    => true
    );
  }

  public function controls() {

    $this->addControl(
      'title',
      'title',
      NULL,
      NULL,
      ''
    );

    $this->addControl(
      'content',
      'editor',
      __( 'Content', csl18n() ),
      __( 'Include your desired content for your Tab here.', csl18n() ),
      ''
    );

    $this->addControl(
      'active',
      'toggle',
      __( 'Initial Active Tab', csl18n() ),
      __( 'Only one tab must be specified as the initial active Tab. If no active Tab or multiple active Tabs are specified, there will be layout errors.', csl18n() ),
      false
    );

  }

  public function xsg() { }

}