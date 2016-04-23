<div id="cornerstone" class="cs-builder">
	<div id="editor" class="cs-editor"></div>
	<div id="preloader" class="cs-preloader">
		<?php echo apply_filters( 'cornerstone_preloader_content', $this->view( 'builder/preloader', false ) ); ?>
	</div>
	<div id="preview" class="cs-preview">
		<iframe id= "preview-frame" src="<?php echo $preview_url; ?>"></iframe>
	</div>
</div>