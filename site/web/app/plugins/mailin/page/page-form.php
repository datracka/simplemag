<?php

/**
 * Admin page : dashboard
 * @package SIB_Page_Form
 */

/**
 * Page class that handles backend page <i>dashboard ( for admin )</i> with form generation and processing
 * @package SIB_Page_Form
 */

if(!class_exists('SIB_Page_Form'))
{
    class SIB_Page_Form
    {
        /**
         * Page slug
         */
        const page_id = 'sib_page_form';

        /**
         * Page hook
         * @var string
         */
        protected $page_hook;

        /**
         * page tabs
         * @var mixed
         */
        protected $tabs;

        /**
         * Constructs new page object and adds entry to Wordpress admin menu
         */
        function __construct()
        {
            $this->page_hook = add_submenu_page(SIB_Page_Home::page_id, __('Settings', 'sib_lang'), __('Settings', 'sib_lang'), 'manage_options', self::page_id, array(&$this, 'generate'));
            add_action('load-'.$this->page_hook, array(&$this, 'init'));
            add_action( 'admin_print_scripts-' . $this->page_hook, array($this, 'enqueue_scripts'));
            add_action( 'admin_print_styles-' . $this->page_hook, array($this, 'enqueue_styles'));
        }

        /**
         * Init Process
         */
        function Init()
        {

        }

        /**
         * enqueue scripts of plugin
         */
        function enqueue_scripts()
        {
            wp_enqueue_script('sib-admin-js');
            wp_enqueue_script('sib-bootstrap-js');
            wp_localize_script('sib-admin-js', 'ajax_object',
                array( 'ajax_url' => admin_url( 'admin-ajax.php' )) );
        }

        /**
         * enqueue style sheets of plugin
         */
        function enqueue_styles()
        {
            wp_enqueue_style('sib-admin-css');
            wp_enqueue_style('sib-bootstrap-css');
            wp_enqueue_style('sib-fontawesome-css');
            wp_enqueue_style('thickbox');
        }

        /** generate page script */
        function generate()
        {
            ?>
            <div id="wrap" class="box-border-box container-fluid">
                <h2><img id="logo-img" src="<?php echo SIB_Manager::$plugin_url . '/img/logo.png'; ?>"></h2>
                <div id="wrap-left" class="box-border-box col-md-9 ">
                    <?php
                    if(SIB_Manager::is_done_validation()) {
                        $this->generate_main_page();
                    } else {
                        $this->generate_welcome_page();
                    }
                    ?>
                </div>
                <div id="wrap-right-side" class="box-border-box col-md-3">
                    <?php

                    SIB_Page_Home::generate_side_bar();
                    ?>
                </div>
            </div>
        <?php
        }

        /** generate main page */
        function generate_main_page()
        {
            // get template list
            $templates = null;
            $lists = null;
            //$templates = self::get_template_lists();
            //$lists = SIB_Page_Home::get_lists();
            $home_settings = get_option(SIB_Manager::home_option_name, array());
            if(!isset($home_settings['activate_email']) || $home_settings['activate_email'] != 'yes' || SIB_Manager::$smtp_details['relay'] == false) {
              $is_activated_smtp = 0;
            }
            else {
              $is_activated_smtp = 1;
            }
            ?>
            <div id="main-content">
                <!-- Sign up Process -->
                <input type="hidden" id="is_smtp_activated" value="<?php echo $is_activated_smtp; ?>">
                <form action="admin-post.php" class="panel panel-default row small-content" method="post" role="form">
                    <input type="hidden" name="action" value="sib_setting_signup" >
                    <!-- Adding security through hidden referrer field -->
                    <?php wp_nonce_field( 'sib_setting_signup' ); ?>
                    <div class="page-header"><strong><?php _e('Sign up process', 'sib_lang'); ?></strong>&nbsp;<i id="sib_setting_signup_spin" class="fa fa-spinner fa-spin fa-fw fa-lg fa-2x"></i></div>
                    <div id="sib_setting_signup_body" class="panel-body hide">
                        <div id="sib_form_alert_message" class="alert alert-danger alert-dismissable fade in" role="alert" style="display: none;">
                            <span id="sib_disclaim_smtp" style="display: none;"><?php _e('Confirmation emails will be sent through your own email server, but you have no guarantees on their deliverability. <br/> <a href="https://mysmtp.sendinblue.com" target="_blank">Click here</a> to send your emails through SendinBlue in order to improve your deliverability and get statistics', 'sib_lang'); ?></span>
                            <span id="sib_disclaim_do_template" style="display: none;"><?php _e('The template you selected does not include a link [DOUBLEOPTIN] to allow subscribers to confirm their subscription. <br/> Please edit the template to include a link with [DOUBLEOPTIN] as URL.', 'sib_lang');?></span>
                        </div>
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Select the list where you want to add your new subscribers', 'sib_lang'); ?></span>
                            <input type="hidden" id="sib_selected_list_id" value="<?php echo SIB_Manager::$list_id; ?>">
                            <div class="col-md-4" id="sib_select_list_area">
                            </div>
                        </div>
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Send a confirmation email', 'sib_lang'); ?><?php echo SIB_Page_Home::get_narration_script(__('Confirmation message', 'sib_lang'),__('You can choose to send a confirmation email. You will be able to set up the template that will be sent to your new suscribers', 'sib_lang')); ?></span>
                            <div class="col-md-4">
                                <label class="col-md-6" style="font-weight: normal;"><input type="radio" id="is_confirm_email_yes" name="is_confirm_email" value="yes" <?php checked(SIB_Manager::$is_confirm_email, 'yes'); ?>>&nbsp;<?php _e('Yes', 'sib_lang'); ?></label>
                                <label class="col-md-6" style="font-weight: normal;"><input type="radio" id="is_confirm_email_no" name="is_confirm_email" value="no" <?php checked(SIB_Manager::$is_confirm_email, 'no'); ?>>&nbsp;<?php _e('No', 'sib_lang'); ?></label>
                            </div>
                            <div class="col-md-5">
                                <small style="font-style: italic;"><?php _e('Select "Yes" if you want your subscribers to receive a confirmation email','sib_lang'); ?></small>
                            </div>
                        </div>
                        <div class="row" id="sib_confirm_template_area">
                            <input type="hidden" id="sib_selected_template_id" value="<?php echo SIB_Manager::$template_id; ?>">
                            <input type="hidden" id="sib_default_template_name" value="<?php _e('Default', 'sib_lang'); ?>">
                            <div class="col-md-3" id="sib_template_id_area">
                            </div>
                            <div class="col-md-4">
                                <a href="https://my.sendinblue.com/camp/listing#temp_active_m" class="col-md-12" target="_blank"><i class="fa fa-angle-right"></i> <?php _e('Set up my templates', 'sib_lang'); ?> </a>
                            </div>
                        </div>
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Double Opt-In', 'sib_lang'); ?> <?php echo SIB_Page_Home::get_narration_script(__('Double Opt-In', 'sib_lang'),__('Your subscribers will receive an email inviting them to confirm their subscription. Be careful, your subscribers are not saved in your list before confirming their subscription.', 'sib_lang')); ?></span>
                            <div class="col-md-4">
                                <label class="col-md-6" style="font-weight: normal;"><input type="radio" id="is_double_optin_yes" name="is_double_optin" value="yes" <?php checked(SIB_Manager::$is_double_optin, 'yes'); ?>>&nbsp;<?php _e('Yes', 'sib_lang'); ?></label>
                                <label class="col-md-6" style="font-weight: normal;"><input type="radio" id="is_double_optin_no" name="is_double_optin" value="no" <?php checked(SIB_Manager::$is_double_optin, 'no'); ?>>&nbsp;<?php _e('No', 'sib_lang'); ?></label>
                            </div>
                            <div class="col-md-5">
                                <small style="font-style: italic;"><?php _e('Select "Yes" if you want your subscribers to confirm their email address','sib_lang'); ?></small>
                            </div>
                        </div>
                        <div class="row" id="sib_doubleoptin_template_area">
                            <input type="hidden" id="sib_selected_do_template_id" value="<?php echo SIB_Manager::$doubleoptin_template_id; ?>">
                            <div class="col-md-3" id="sib_doubleoptin_template_id_area">
                            </div>
                            <div class="col-md-4">
                                <a href="https://my.sendinblue.com/camp/listing?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link#temp_active_m" class="col-md-12" target="_blank"><i class="fa fa-angle-right"></i> <?php _e('Set up my templates', 'sib_lang'); ?> </a>
                            </div>
                        </div>
                        <div class="row small-content" id="sib_double_redirect_area">
                            <span class="col-md-3"><?php _e('Redirect to this URL after clicking in the email', 'sib_lang'); ?></span>
                            <div class="col-md-8">
                                <input type="url" class="col-md-11" name="redirect_url" value="<?php echo SIB_Manager::$redirect_url; ?>">
                            </div>
                        </div>

                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Redirect to this URL after subscription', 'sib_lang'); ?></span>
                            <div class="col-md-4">
                                <label class="col-md-6" style="font-weight: normal;"><input type="radio" id="is_redirect_url_click_yes" name="is_redirect_url_click" value="yes" <?php checked(SIB_Manager::$is_redirect_url_click, 'yes'); ?>>&nbsp;<?php _e('Yes', 'sib_lang'); ?></label>
                                <label class="col-md-6" style="font-weight: normal;"><input type="radio" id="is_redirect_url_click_no" name="is_redirect_url_click" value="no" <?php
                                    if(SIB_Manager::$is_redirect_url_click == '' || SIB_Manager::$is_redirect_url_click == 'no') {
                                        echo 'checked';
                                    }
                                    ?>>&nbsp;<?php _e('No', 'sib_lang'); ?></label>
                            </div>
                            <div class="col-md-5">
                                <small style="font-style: italic;"><?php _e('Select "Yes" if you want to redirect your subscribers to a specific page after they fullfill the form','sib_lang'); ?></small>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 10px;<?php
                        if(SIB_Manager::$is_redirect_url_click != 'yes') {
                            echo 'display:none;';
                        }
                        ?>" id="sib_subscrition_redirect_area" >
                            <span class="col-md-3"></span>
                            <div class="col-md-8">
                                <input type="url" class="col-md-11" name="redirect_url_click" value="<?php echo SIB_Manager::$redirect_url_click; ?>">
                            </div>
                        </div>

                        <div class="row small-content" style="margin-top: 30px;">
                            <div class="col-md-3">
                                <button class="btn btn-primary"><?php _e('Save', 'sib_lang'); ?></button>
                            </div>
                        </div>

                    </div>
                </form><!-- End Sign up process form-->

                <!-- Subscription form -->
                <form action="admin-post.php" class="panel panel-default row small-content" method="post" role="form">
                    <input type="hidden" name="action" value="sib_setting_subscription" >
                    <!-- Adding security through hidden referrer field -->
                    <?php wp_nonce_field( 'sib_setting_subscription' ); ?>
                    <div class="page-header">
                        <strong><?php _e('Subscription form', 'sib_lang'); ?></strong>&nbsp;<i id="sib_setting_form_spin" class="fa fa-spinner fa-spin fa-fw fa-lg fa-2x"></i>
                    </div>
                    <div id="sib_setting_form_body" class="panel-body hide">
                        <div class="row small-content">
                            <div class="col-md-6">
                                <?php
                                if( function_exists( 'wp_editor' ) ) {
                                    wp_editor( SIB_Manager::$sib_form_html, 'sibformmarkup', array( 'tinymce' => false, 'media_buttons' => true, 'textarea_name' => 'sib_form_html','textarea_rows' => 15));
                                } else {
                                    ?><textarea class="widefat" cols="160" rows="20" id="sibformmarkup" name="sib_form_html"><?php echo esc_textarea( SIB_Manager::$sib_form_html ); ?></textarea><?php
                                } ?>
                                <br>
                                <p>
                                    <?php
                                    _e('Use the shortcode','sib_lang');
                                    ?>
                                    <i style="background-color: #eee;padding: 3px;">[sibwp_form]</i>
                                    <?php
                                    _e('inside a post, page or text widget to display your sign-up form.' ,'sib_lang' ); ?>
                                    <b><?php _e('Do not copy and paste the above form mark up, that will not work', 'sib_lang'); ?></b>
                                </p>
                            </div>
                            <div class="col-md-6" >
                                <!-- hidden fields for attributes -->
                                <input type="hidden" id="sib_hidden_email" data-type="email" data-name="email" data-text="<?php _e('Email Address', 'sib_lang'); ?>">
                                <input type="hidden" id="sib_hidden_submit" data-type="submit" data-name="submit" data-text="<?php _e('Sign up', 'sib_lang'); ?>">
                                <input type="hidden" id="sib_hidden_message_1" value="<?php _e('Select SendinBlue Attribute', 'sib_lang'); ?>">
                                <input type="hidden" id="sib_hidden_message_2" value="<?php _e('SendinBlue merge fields : Normal', 'sib_lang'); ?>">
                                <input type="hidden" id="sib_hidden_message_3" value="<?php _e('SendinBlue merge fields : Category', 'sib_lang'); ?>">
                                <input type="hidden" id="sib_hidden_message_4" value="<?php _e('Other', 'sib_lang'); ?>">
                                <input type="hidden" id="sib_hidden_message_5" value="<?php _e('Submit Button', 'sib_lang'); ?>">
                                <div id="sib-field-form" class="panel panel-default row" style="padding-bottom: 20px;">
                                    <div class="row small-content2" style="margin-top: 20px;margin-bottom: 20px;">
                                        <b><?php _e('Add a new Field', 'sib_lang'); ?></b>&nbsp;
                                        <?php SIB_Page_Home::get_narration_script(__('Add a New Field', 'sib_lang'), __('Choose an attribute and add it to the subscription form of your Website', 'sib_lang')); ?>
                                    </div>
                                    <div id="sib_sel_attribute_area" class="row small-content2" style="margin-top: 20px;">
                                    </div>
                                    <div style="margin-top: 30px;">
                                        <div class="row small-content2" style="margin-top: 10px;" id="sib_field_label_area">
                                            <?php _e('Label', 'sib_lang'); ?> <small>(<?php _e('Optional', 'sib_lang');?>)</small>
                                            <input type="text" class="col-md-12" id="sib_field_label">
                                        </div>
                                        <div class="row small-content2" style="margin-top: 10px;"  id="sib_field_placeholder_area">
                                            <span><?php _e('Place holder', 'sib_lang'); ?> <small>(<?php _e('Optional', 'sib_lang');?>)</small> </span>
                                            <input type="text" class="col-md-12" id="sib_field_placeholder">
                                        </div>
                                        <div class="row small-content2"  style="margin-top: 10px;"  id="sib_field_initial_area">
                                            <span><?php _e('Initial value', 'sib_lang'); ?> <small>(<?php _e('Optional', 'sib_lang');?>)</small> </span>
                                            <input type="text" class="col-md-12" id="sib_field_initial">
                                        </div>
                                        <div class="row small-content2"  style="margin-top: 10px;"  id="sib_field_button_text_area">
                                            <span><?php _e('Button Text', 'sib_lang'); ?></span>
                                            <input type="text" class="col-md-12" id="sib_field_button_text">
                                        </div>
                                    </div>
                                    <div style="margin-top: 20px;">
                                        <div class="row small-content2"  style="margin-top: 5px;" id="sib_field_wrap_area">
                                            <label style="font-weight: normal;"><input type="checkbox" id="sib_field_wrap">&nbsp;&nbsp;<?php _e('Wrap in Paragraph (&lt;p&gt;) tags ?', 'sib_lang'); ?></label>
                                        </div>
                                        <div class="row small-content2"  style="margin-top: 5px;" id="sib_field_required_area">
                                            <label style="font-weight: normal;"><input type="checkbox" id="sib_field_required">&nbsp;&nbsp;<?php _e('Required field ?', 'sib_lang'); ?></label>
                                        </div>
                                        <div class="row small-content2"  style="margin-top: 5px;" id="sib_field_type_area">
                                          <label style="font-weight: normal;"><input type="radio" name="sib_field_type" value="select" checked>&nbsp;<?php _e('Drop-down List', 'sib_lang'); ?></label>&nbsp;&nbsp;
                                          <label style="font-weight: normal;"><input type="radio" name="sib_field_type" value="radio">&nbsp;<?php _e('Radio List', 'sib_lang'); ?></label>
                                        </div>
                                    </div>
                                    <div class="row small-content2"  style="margin-top: 20px;" id="sib_field_add_area">
                                        <button type="button" id="sib_add_to_form_btn" class="btn btn-default"><span class="sib-large-icon"><</span> <?php _e('Add to form', 'sib_lang'); ?></button>
                                    </div>
                                    <div class="row small-content2"  style="margin-top: 20px;" id="sib_field_html_area">
                                        <span><?php _e('Generated HTML', 'sib_lang'); ?></span>
                                        <textarea class="col-md-12" style="height: 140px;" id="sib_field_html"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row small-content" style="margin-top: 30px;">
                            <div class="col-md-3">
                                <button class="btn btn-primary"><?php _e('Save', 'sib_lang'); ?></button>
                            </div>
                        </div>
                    </div>
                </form> <!-- End Subscription form-->

                <!-- Confirmation message form -->
                <form action="admin-post.php" class="panel panel-default row small-content" method="post" role="form">
                    <input type="hidden" name="action" value="sib_setting_confirmation" >
                    <!-- Adding security through hidden referrer field -->
                    <?php wp_nonce_field( 'sib_setting_confirmation' ); ?>
                    <div class="page-header">
                        <strong><?php _e('Confirmation message', 'sib_lang'); ?></strong>
                    </div>
                    <div class="panel-body">
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Success message', 'sib_lang'); ?></span>
                            <div class="col-md-8">
                                <input type="text" class="col-md-11" name="alert_success_message" value="<?php echo SIB_Manager::$alert_success_message; ?>" required>&nbsp;
                                <?php echo SIB_Page_Home::get_narration_script(__('Success message', 'sib_lang'),__('Set up the success message that will appear when one of your visitors surccessfully signs up', 'sib_lang')); ?>
                            </div>
                        </div>
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('General error message', 'sib_lang'); ?></span>
                            <div class="col-md-8">
                                <input type="text" class="col-md-11" name="alert_error_message" value="<?php echo SIB_Manager::$alert_error_message; ?>" required>&nbsp;
                                <?php echo SIB_Page_Home::get_narration_script(__('General message error', 'sib_lang'),__('Set up the message that will appear when an error occurs during the subscritpion process', 'sib_lang')); ?>
                            </div>
                        </div>
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Existing subscribers', 'sib_lang'); ?></span>
                            <div class="col-md-8">
                                <input type="text" class="col-md-11" name="alert_exist_subscriber" value="<?php echo SIB_Manager::$alert_exist_subscriber; ?>" required>&nbsp;
                                <?php echo SIB_Page_Home::get_narration_script(__('Existing Suscribers', 'sib_lang'),__('Set up the message that will appear when a suscriber is already in your database', 'sib_lang')); ?>
                            </div>
                        </div>
                        <div class="row small-content">
                            <span class="col-md-3"><?php _e('Invalid email address', 'sib_lang'); ?></span>
                            <div class="col-md-8">
                                <input type="text" class="col-md-11" name="alert_invalid_email" value="<?php echo SIB_Manager::$alert_invalid_email; ?>" required>&nbsp;
                                <?php echo SIB_Page_Home::get_narration_script(__('Invalid email adress', 'sib_lang'), __('Set up the message that will appear when the email address used to sign up is not valid', 'sib_lang')); ?>
                            </div>
                        </div>
                        <div class="row small-content" style="margin-top: 30px;">
                            <div class="col-md-3">
                                <button class="btn btn-primary"><?php _e('Save', 'sib_lang'); ?></button>
                            </div>
                        </div>
                    </div>
                </form> <!-- End Confirmation message form-->
            </div>
            <script>
                jQuery(document).ready(function(){
                    jQuery('#sib_add_to_form_btn').click(function() {
                        //var field_html = jQuery('#sib_field_html').html();

                       // tinyMCE.activeEditor.selection.setContent(field_html);

                        return false;
                    });
                });
            </script>
        <?php
        }

        /** generate welcome page */
        function generate_welcome_page()
        {
        ?>
            <div id="main-content" class="row">
                <img class="small-content" src="<?php echo SIB_Manager::$plugin_url . '/img/background/setting.png'?>" style="width: 100%;">
            </div>
        <?php
            SIB_Page_Home::print_disable_popup();
        }

        /** save sign up setting */
        public static function save_setting_signup()
        {
            // check user role
            if( !current_user_can( 'manage_options' ) )
                wp_die('Not allowed');

            // check secret through hidden referrer field
            check_admin_referer( 'sib_setting_signup' );

            $is_confirm_email = $_POST['is_confirm_email'];
            $is_double_optin = $_POST['is_double_optin'];
            $redirect_url = $_POST['redirect_url'];
            $redirect_url_click = $_POST['redirect_url_click'];
            $template_id = $_POST['template_id'];
            $doubleoptin_template_id = $_POST['doubleoptin_template_id'];
            $is_redirect_url_click = $_POST['is_redirect_url_click'];
            $settings = array(
                'is_confirm_email' => $is_confirm_email,
                'is_double_optin' => $is_double_optin,
                'redirect_url' => $redirect_url,
                'redirect_url_click' => $redirect_url_click,
                'template_id' => $template_id,
                'doubleoptin_template_id' => $doubleoptin_template_id,
                'is_redirect_url_click' => $is_redirect_url_click
            );
            update_option(SIB_Manager::form_signup_option_name, $settings);

            $list_id = $_POST['list_id'];
            $home_settings = array(
                'list_id' => $list_id,
                'activate_email' => SIB_Manager::$activate_email
            );
            update_option(SIB_Manager::home_option_name, $home_settings);

            wp_redirect(add_query_arg('page', self::page_id, admin_url('admin.php')));
            exit;
        }

        /** save confirmation message setting */
        public static function save_setting_confirm()
        {
            // check user role
            if( !current_user_can( 'manage_options' ) )
                wp_die('Not allowed');

            // check secret through hidden referrer field
            check_admin_referer( 'sib_setting_confirmation' );

            $alert_success_message = esc_attr($_POST['alert_success_message']);
            $alert_error_message = esc_attr($_POST['alert_error_message']);
            $alert_exist_subscriber = esc_attr($_POST['alert_exist_subscriber']);
            $alert_invalid_email = esc_attr($_POST['alert_invalid_email']);

            $settings = array(
                'alert_success_message' => $alert_success_message,
                'alert_error_message' => $alert_error_message,
                'alert_exist_subscriber' => $alert_exist_subscriber,
                'alert_invalid_email' => $alert_invalid_email
            );
            update_option(SIB_Manager::form_confirmation_option_name, $settings);

            wp_redirect(add_query_arg('page', self::page_id, admin_url('admin.php')));
            exit;
        }

        /** save subscription setting */
        public static function save_setting_subscription()
        {
            // check user role
            if( !current_user_can( 'manage_options' ) )
                wp_die('Not allowed');

            // check secret through hidden referrer field
            check_admin_referer( 'sib_setting_subscription' );

            // form html of subscription
            $sib_form_html = stripslashes($_POST['sib_form_html']);

            // get available attributes list
            $attributes = get_option(SIB_Manager::attribute_list_option_name);
            $available_attrs = array();
            if (isset($attributes) && is_array($attributes)) {
                foreach($attributes as $attribute)
                {
                    $pos = strpos($sib_form_html, 'sib-' . $attribute['name'] . '-area');

                    if($pos !== false) {
                        $available_attrs[] = $attribute['name'];
                    }
                }
            }

            $settings = array(
                'sib_form_html' => $sib_form_html,
                'available_attributes' => $available_attrs
            );
            update_option(SIB_Manager::form_subscription_option_name, $settings);
            // confirm that use new version
            update_option('sib_use_new_version', '1');
            wp_redirect(add_query_arg('page', self::page_id, admin_url('admin.php')));
            exit;
        }

        /**
         * get sender lists of sendinblue
         */
        public static function get_sender_lists()
        {
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
            $data = array( "option" => "" );
            $response = $mailin->get_senders($data);
            // reorder by id
            $senders = array();
            foreach($response['data'] as $sender){
                $senders[$sender['id']] = array('id'=>$sender['id'], 'from_name' => $sender['from_name'], 'from_email' => $sender['from_email']);
            }
            update_option(SIB_Manager::sender_option_name, $senders);

            return $response['data'];
        }

        /**
         * get template lists of sendinblue
         */
        public static function get_template_lists()
        {
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
            $data = array(
                'type' => 'template',
                'status' => 'temp_active'
            );
            $response = $mailin->get_campaigns_v2($data);
            if (!isset($response['code']) || ($response['code'] != 'success')) {
                return null;
            }
            return $response['data']['campaign_records'];
        }

        /**
         * get attributes lists of sendinblue
         */
        public static function get_crm_attributes()
        {
          $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
          $response = $mailin->get_attributes();
          return $response['data'];
        }

      /** ajax process when change template id */
        public static function ajax_change_template()
        {
            $template_id = $_POST['template_id'];
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
            $data = array(
                'id' => $template_id
            );
            $response = $mailin->get_campaign_v2($data);

            $ret_email = '-1';
            if($response['code'] == 'success') {
                $from_email = $response['data'][0]['from_email'];
                if($from_email == '[DEFAULT_FROM_EMAIL]') {
                    $ret_email = '-1';
                } else {
                    $ret_email = $from_email;
                }
            }

            echo $ret_email;
            die();
        }

      /**
       * Ajax module to get all lists.
       */
        public static function ajax_get_lists() {
            $lists = SIB_Page_Home::get_lists();
            if (!is_array($lists)) {
              $lists = array();
            }
            // set default list_id at first up...
            if(SIB_Manager::$list_id == '') {
                $home_settings = get_option(SIB_Manager::home_option_name);
                $home_settings['list_id'] = $lists[0]['id'];
                update_option(SIB_Manager::home_option_name, $home_settings);
            }
            $result = array('lists' => $lists);
            wp_send_json($result);
        }

      /**
       * Ajax module to get all templates.
       */
        public static function ajax_get_templates() {
            $templates = self::get_template_lists();
            if (!is_array($templates)) {
              $templates = array();
            }
            $result = array('templates' => $templates);
            wp_send_json($result);
        }

      /**
       * Ajax module to get all attributes.
       */
        public static function ajax_get_attributes() {
            $attributes = self::get_crm_attributes();
            if (!is_array($attributes)) {
              $attributes = array(
                'normal_attributes' => array(),
                'category_attributes' => array(),
              );
            }
            $result = array('attributes' => $attributes);
            $attrs = array_merge($attributes['normal_attributes'], $attributes['category_attributes']);;
            update_option(SIB_Manager::attribute_list_option_name, $attrs);
            wp_send_json($result);
        }
    }
}