<?php
/**
 * View for the main Options Page - Sidebar.
 */
?>
<div id="postbox-container-1" class="postbox-container">
  <div class="meta-box-sortables">

    <!--
    SAVE
    -->

    <div class="postbox">
      <div class="handlediv" title="<?php _e( 'Click to toggle', csl18n() ); ?>"><br></div>
      <h3 class="hndle"><span><?php _e( 'Save', csl18n() ); ?></span></h3>
      <div class="inside">
        <p><?php _e( 'Once you are satisfied with your settings, click the button below to save them.', csl18n() ); ?></p>
        <p class="cf"><input id="submit" class="button button-primary" type="submit" name="cornerstone-submit" value="Update"></p>
      </div>
    </div>

    <!--
    PRODUCT VALIDATION
    -->

    <div id="meta-box-settings" class="postbox">
      <div class="handlediv" title="<?php _e( 'Click to toggle', csl18n() ); ?>"><br></div>
      <h3 class="hndle"><span><?php _e( 'Validation', csl18n() ); ?></span></h3>
      <div>
        <?php do_action('cornerstone_options_mb_validation'); ?>
      </div>
    </div>

    <!--
    INFO
    -->

    <div class="postbox">
      <div class="handlediv" title="<?php _e( 'Click to toggle', csl18n() ); ?>"><br></div>
      <h3 class="hndle"><span><?php _e( 'About', csl18n() ); ?></span></h3>
      <div class="inside">
        <dl class="accordion">

          <?php foreach ( $data['info_items'] as $info_item ) : ?>
          <dt class="toggle"><?php echo $info_item['title']; ?></dt>
          <dd class="panel">
            <div class="panel-inner">
              <?php echo $info_item['content']; ?>
            </div>
          </dd>
          <?php endforeach; ?>

        </dl>
      </div>
    </div>
  </div>
</div>