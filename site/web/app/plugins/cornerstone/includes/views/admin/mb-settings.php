
<tr>
  <th>
    <label for="cornerstone-fields-allowed_post_types-1">
      <strong><?php _e( 'Allowed Post Types', csl18n() ); ?></strong>
      <span><?php _e( 'Select which post types to enable for Cornerstone.', csl18n() ); ?></span>
    </label>
  </th>
  <td>
    <fieldset>
     <?php echo $this->settings->renderField( 'allowed_post_types', array( 'type' => 'checkboxes', 'value' => $this->settings->getPostTypes() ) ); ?>
    </fieldset>
  </td>
</tr>

<tr>
  <th>
    <label for="cornerstone-fields-permitted_roles-1">
      <strong><?php _e( 'Permissions', csl18n() ); ?></strong>
      <span><?php _e( 'Enable the ability to edit with Cornerstone for specific roles.', csl18n() ); ?></span>
    </label>
  </th>
  <td>
    <fieldset>
      <div class="cs_setting_checkbox"><label><input type="checkbox" disabled="disabled" class="checkbox"  value="administrator" checked="checked"> Administrator</label></div>
      <?php echo $this->settings->renderField( 'permitted_roles', array( 'type' => 'checkboxes', 'value' => $this->settings->getRoles() ) ); ?>
    </fieldset>
  </td>
</tr>

<tr>
  <th>
    <label for="cornerstone-fields-show_wp_toolbar">
      <strong><?php _e( 'Show WordPress Toolbar', csl18n() ); ?></strong>
      <span><?php _e( 'While editing in Cornerstone, you may opt to display the WordPress toolbar.', csl18n() ); ?></span>
    </label>
  </th>
  <td>
    <fieldset>
      <?php echo $this->settings->renderField( 'show_wp_toolbar', array( 'type' => 'checkbox', 'value' => '1', 'label' => 'Enable' ) ); ?>
    </fieldset>
  </td>
</tr>

<tr>
  <th>
    <label for="cornerstone-fields-visual_enhancements">
      <strong><?php _e( 'Visual Enhancements', csl18n() ); ?></strong>
      <span><?php _e( 'Make Cornerstone fun with creative save messages.', csl18n() ); ?></span>
    </label>
  </th>
  <td>
    <fieldset>
      <?php echo $this->settings->renderField( 'visual_enhancements', array( 'type' => 'checkbox', 'value' => '1', 'label' => 'Enable' ) ); ?>
    </fieldset>
  </td>
</tr>