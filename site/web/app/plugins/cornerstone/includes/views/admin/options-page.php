<?php
/**
 * View for the main Options Page.
 */
?>

<div class="wrap cs-admin">
  <h2><?php echo $this->plugin->common()->properTitle(); ?></h2>
  <div id="poststuff">
    <div id="post-body" class="metabox-holder columns-2">
      <form name="cornerstone_options" method="post" action="">
        <input name="cornerstone_options_submitted" type="hidden" value="submitted">
        <div id="post-body-content">
          <div class="meta-box-sortables ui-sortable">

					<?php $this->view( 'admin/options-main', true, $data ); ?>

          </div>
        </div>

        <?php $this->view( 'admin/options-sidebar', true, $data ); ?>

      </form>
    </div>
    <br class="clear">
  </div>
</div>