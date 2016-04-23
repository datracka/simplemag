<?php
/**
 * View for the main Options Page - Main.
 */
?>
<div id="meta-box-settings" class="postbox">
  <div class="handlediv" title="<?php _e( 'Click to toggle', csl18n() ); ?>"><br></div>
  <h3 class="hndle"><span><?php _e( 'Settings', csl18n() ); ?></span></h3>
  <div class="inside">
    <table class="form-table">
      <?php do_action('cornerstone_options_mb_settings'); ?>
    </table>
  </div>
</div>