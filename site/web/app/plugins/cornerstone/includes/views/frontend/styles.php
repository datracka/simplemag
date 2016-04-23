/* Margins
// ========================================================================== */

.x-section .x-base-margin,
.x-section .x-accordion,
.x-section .x-alert,
.x-section .x-audio,
.x-section .x-author-box,
.x-section .x-block-grid,
.x-section .x-code,
.x-section .x-columnize,
.x-section .x-section,
.x-section .x-entry-share,
.x-section .x-gap,
.x-section .x-img,
.x-section .x-map,
.x-section .x-promo,
.x-section .x-prompt,
.x-section .x-recent-posts,
.x-section .x-flexslider-shortcode-container,
.x-section .x-video,
.x-section .x-skill-bar,
.x-section .x-tab-content {
  margin-bottom: <?php echo $cs_base_margin; ?>;
}

.x-section .x-blockquote:not(.x-pullquote),
.x-section .x-callout,
.x-section .x-hr,
.x-section .x-pricing-table {
  margin-top: <?php echo $cs_base_margin; ?>;
  margin-bottom: <?php echo $cs_base_margin; ?>;
}

@media (max-width: 767px) {
  .x-section .x-pullquote.left,
  .x-section .x-pullquote.right {
    margin-top: <?php echo $cs_base_margin; ?>;
    margin-bottom: <?php echo $cs_base_margin; ?>;
  }
}

@media (max-width: 480px) {
  .x-section .x-toc.left,
  .x-section .x-toc.right {
    margin-bottom: <?php echo $cs_base_margin; ?>;
  }
}



/* Containers
// ========================================================================== */

.x-section .x-container.width {
  width: <?php echo $cs_container_width; ?>;
}

.x-section .x-container.max {
  max-width: <?php echo $cs_container_max_width; ?>;
}



/* Link Colors
// ========================================================================== */

.x-section a.x-img-thumbnail:hover {
  border-color: <?php echo $cs_link_color; ?>;
}

.x-section .x-dropcap,
.x-section .x-highlight,
.x-section .x-pricing-column.featured h2,
.x-section .x-recent-posts .x-recent-posts-img:after {
  background-color: <?php echo $cs_link_color; ?>;
}



/* Buttons
// ========================================================================== */

.x-section .x-btn {

  color: <?php echo $cs_button_color; ?>;
  border-color: <?php echo $cs_button_border_color; ?>;
  background-color: <?php echo $cs_button_bg_color; ?>;

  <?php if ( $cs_button_style == 'real' ) : ?>
    margin-bottom: 0.25em;
    text-shadow: 0 0.075em 0.075em rgba(0, 0, 0, 0.5);
    box-shadow: 0 0.25em 0 0 <?php echo $cs_button_bottom_color; ?>, 0 4px 9px rgba(0, 0, 0, 0.75);
  <?php elseif ( $cs_button_style == 'flat' ) : ?>
    text-shadow: 0 0.075em 0.075em rgba(0, 0, 0, 0.5);
  <?php elseif ( $cs_button_style == 'transparent' ) : ?>
    border-width: 3px;
    text-transform: uppercase;
    background-color: transparent;
  <?php endif; ?>

  <?php if ( $cs_button_shape == 'rounded' ) : ?>
    border-radius: 0.25em;
  <?php elseif ( $cs_button_shape == 'pill' ) : ?>
    border-radius: 100em;
  <?php endif; ?>

  <?php if ( $cs_button_size == 'mini' ) : ?>
    padding: 0.385em 0.923em 0.538em;
    font-size: 13px;
  <?php elseif ( $cs_button_size == 'small' ) : ?>
    padding: 0.429em 1.143em 0.643em;
    font-size: 14px;
  <?php elseif ( $cs_button_size == 'large' ) : ?>
    padding: 0.579em 1.105em 0.842em;
    font-size: 19px;
  <?php elseif ( $cs_button_size == 'x-large' ) : ?>
    padding: 0.714em 1.286em 0.952em;
    font-size: 21px;
  <?php elseif ( $cs_button_size == 'jumbo' ) : ?>
    padding: 0.643em 1.429em 0.857em;
    font-size: 28px;
  <?php endif; ?>

}

.x-section .x-btn:hover {

  color: <?php echo $cs_button_hover_color; ?>;
  border-color: <?php echo $cs_button_hover_border_color; ?>;
  background-color: <?php echo $cs_button_hover_bg_color; ?>;

  <?php if ( $cs_button_style == 'real' ) : ?>
    margin-bottom: 0.25em;
    text-shadow: 0 0.075em 0.075em rgba(0, 0, 0, 0.5);
    box-shadow: 0 0.25em 0 0 <?php echo $cs_button_hover_bottom_color; ?>, 0 4px 9px rgba(0, 0, 0, 0.75);
  <?php elseif ( $cs_button_style == 'flat' ) : ?>
    text-shadow: 0 0.075em 0.075em rgba(0, 0, 0, 0.5);
  <?php elseif ( $cs_button_style == 'transparent' ) : ?>
    border-width: 3px;
    text-transform: uppercase;
    background-color: transparent;
  <?php endif; ?>

}


/*
// Button Style - Real
*/

.x-section .x-btn.x-btn-real,
.x-section .x-btn.x-btn-real:hover {
  margin-bottom: 0.25em;
  text-shadow: 0 0.075em 0.075em rgba(0, 0, 0, 0.65);
}

.x-section .x-btn.x-btn-real {
  box-shadow: 0 0.25em 0 0 <?php echo $cs_button_bottom_color; ?>, 0 4px 9px rgba(0, 0, 0, 0.75);
}

.x-section .x-btn.x-btn-real:hover {
  box-shadow: 0 0.25em 0 0 <?php echo $cs_button_hover_bottom_color; ?>, 0 4px 9px rgba(0, 0, 0, 0.75);
}


/*
// Button Style - Flat
*/

.x-section .x-btn.x-btn-flat,
.x-section .x-btn.x-btn-flat:hover {
  margin-bottom: 0;
  text-shadow: 0 0.075em 0.075em rgba(0, 0, 0, 0.65);
  box-shadow: none;
}


/*
// Button Style - Transparent
*/

.x-section .x-btn.x-btn-transparent,
.x-section .x-btn.x-btn-transparent:hover {
  margin-bottom: 0;
  border-width: 3px;
  text-shadow: none;
  text-transform: uppercase;
  background-color: transparent;
  box-shadow: none;
}