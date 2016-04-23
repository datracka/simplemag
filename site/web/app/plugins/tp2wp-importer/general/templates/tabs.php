<style type="text/css">
  #tp2wp-navigation-tabs li {
    width: 23%;
    padding-left: 2%;
    padding-right: 7%;
    padding-top: 1em;
    padding-bottom: 1em;
    border: 1px solid #1D3764;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: inline-block;
    background-color: white;
    color: #333;
  }
  #tp2wp-navigation-tabs li.active {
    background-color: #C8E6F6;
  }
</style>
<ul id="tp2wp-navigation-tabs">
  <?php if ($step === 'status'): ?>
    <li class="active">1. Status Check</li>
  <?php else: ?>
    <li>
      <a href="<?php echo tp2wp_importer_url( 'status' ); ?>">1. Status Check</a>
    </li>
  <?php endif; ?>

  <?php if ($step === 'content'): ?>
    <li class="active">2. Import Content</li>
  <?php else: ?>
    <li>
      <a href="<?php echo tp2wp_importer_url( 'content' ); ?>">2. Import Content</a>
    </li>
  <?php endif; ?>

  <?php if ($step === 'attachments'): ?>
    <li class="active">3. Import Attachments</li>
  <?php else: ?>
    <li>
      <a href="<?php echo tp2wp_importer_url( 'attachments' ); ?>">3. Import Attachments</a>
    </li>
  <?php endif; ?>
</ul>
