<div class="postarea wp-editor-expand" style="display:none;">
  <div class="wp-core-ui wp-editor-wrap cornerstone-active" style="padding-top: 21px;">
    <div class="wp-editor-tools">
      <div class="wp-editor-tabs">
        <button type="button" id="content-tmce" class="wp-switch-editor switch-tmce"><?php _e( 'Visual', csl18n() ); ?></button>
        <button type="button" id="content-html" class="wp-switch-editor switch-html"><?php _e( 'Text', csl18n() ); ?></button>
        <button type="button" id="content-cornerstone" class="wp-switch-editor switch-cornerstone"><?php _e( 'Cornerstone', csl18n() ); ?></button>
      </div>
    </div>
    <div class="wp-editor-container">
      <div class="cs-editor-container">
        <div class="cs-logo"><?php $this->view( 'svg/logo-flat-custom' ); ?></div>
        <button href="#" id="cs-edit-button" class="cs-edit-btn">
          <span><?php _e( 'Edit with Cornerstone', csl18n() ); ?></span>
        </button>
      </div>
    </div>
  </div>
</div>