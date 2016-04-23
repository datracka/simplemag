<?php

// Special thanks to the Online Mastery team for their initiative with this element.

class CS_Gravity_Forms extends Cornerstone_Element_Base {

	public function data() {
		return array(
			'name'        => 'gravity-forms',
			'title'       => __( 'Gravity Forms', 'my-text-domain' ),
			'section'     => 'information',
			'description' => __( 'Alert description.', 'my-text-domain' ),
			'helpText'   => array(
        'title' => __( 'Display issues?', csl18n() ),
        'message' => __( '<strong>Gravity Forms</strong> uses it&apos;s own dynamic process to render forms, which could result in visual differences in the preview area. Be sure to test by viewing the true front end of this page.', csl18n() ),
      ),
			'supports'    => array( 'id', 'class', 'style' ),
			'empty'       => array( 'form_id' => 'none' )
		);
	}

	public function controls() {

		$forms = array();
		$choices = array();

		if ( class_exists( 'RGFormsModel' ) ) {
			$forms = RGFormsModel::get_forms( null, 'title' );
		}

		foreach( $forms as $form ) {
			$choices[] = array( 'value' => $form->id, 'label' => $form->title );
		}

		if ( empty( $choices ) ) {
      $choices[] = array( 'value' => 'none', 'label' => __( 'No Forms available', csl18n() ), 'disabled' => true );
    }

		$this->addControl(
			'form_id',
			'select',
			__( 'Form' ),
			__( 'Select which form you would like to display.' ),
			$choices[0]['value'],
			array(
				'choices' => $choices
			)
		);

		$this->addControl(
			'show_title',
			'toggle',
			__( 'Show Title' ),
			'',
			false
		);

		$this->addControl(
			'show_description',
			'toggle',
			__( 'Show Description' ),
			'',
			false
		);

		$this->addControl(
			'enable_ajax',
			'toggle',
			__( 'Enable AJAX' ),
			'',
			true
		);

	}

	public function is_active() {
    return class_exists( 'RGFormsModel' );
  }

	public function render( $atts ) {

		extract( $atts );

		$shortcode = "[gravityform id=\"{$form_id}\" title=\"{$show_title}\" description=\"{$show_description}\" ajax=\"{$enable_ajax}\"]";

		return $shortcode;

	}

}