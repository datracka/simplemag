<?php

/**
 * Admin page : dashboard
 * @package SIB_Page_Home
 */

/**
 * Page class that handles backend page <i>dashboard ( for admin )</i> with form generation and processing
 * @package SIB_Page_Home
 */

if(!class_exists('SIB_Page_Home'))
{
    class SIB_Page_Home
    {
        /**
         * Page slug
         */
        const page_id = 'sib_page_home';

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
            add_menu_page(__('SendinBlue', 'sib_lang'), __('SendinBlue', 'sib_lang'), 'manage_options', self::page_id, array(&$this, 'generate'), SIB_Manager::$plugin_url . '/img/favicon.ico');
            $this->page_hook = add_submenu_page(self::page_id, __('Home', 'sib_lang'), __('Home', 'sib_lang'), 'manage_options', self::page_id, array(&$this, 'generate'));
            add_action('load-'.$this->page_hook, array(&$this, 'init'));
            add_action( 'admin_print_scripts-' . $this->page_hook, array($this, 'enqueue_scripts'));
            add_action( 'admin_print_styles-' . $this->page_hook, array($this, 'enqueue_styles'));
        }

        /**
         * Init Process
         */
        function Init()
        {
            if((isset($_GET['sib_action'])) && ($_GET['sib_action'] == 'logout')) {
                $this->logout();
            }
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
                <div id="wrap-left" class="box-border-box col-md-9">
                <?php
                if(SIB_Manager::is_done_validation() == true) {
                    $this->generate_main_content();
                } else {
                    $this->generate_welcome_content();
                }
                ?>
                </div>
                <div id="wrap-right-side" class="box-border-box  col-md-3">
                    <?php
                    self::generate_side_bar();
                    ?>
                </div>
            </div>
            <?php
        }

        /** generate welcome page before validation */
        function generate_welcome_content()
        {
        ?>

            <div id="main-content">
                <input type="hidden" id="cur_refer_url" value="<?php echo add_query_arg(array('page' => 'sib_page_home'), admin_url('admin.php')); ?>">
                <div class="panel panel-default row small-content">
                    <div class="page-header">
                        <span style="color: #777777;"><?php _e('Step', 'sib_lang'); ?>1&nbsp;|&nbsp;</span><strong><?php _e('Create a SendinBlue Account', 'sib_lang'); ?></strong>
                    </div>
                    <div class="panel-body">
                        <div class="col-md-9 row">
                            <p><?php _e('By Creating a free SendinBlue account, you will have access to send a confirmation message.', 'sib_lang'); ?></p>
                            <ul class="sib-home-feature">
                                <li><span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Collect your contacts and upload your lists', 'sib_lang'); ?></li>
                                <li><span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Use SendinBlue SMTP to send your transactional emails', 'sib_lang'); ?></li>
                                <li class="home-read-more-content"><span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Email marketing builders', 'sib_lang'); ?></li>
                                <li class="home-read-more-content"><span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Create and schedule your email marketing campaigns', 'sib_lang'); ?></li>
                                <li class="home-read-more-content"><span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('See all of', 'sib_lang'); ?>&nbsp;<a href="https://www.sendinblue.com/features/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><?php _e('SendinBlue\'s features', 'sib_lang'); ?></a></li>
                            </ul>
                            <a href="https://www.sendinblue.com/users/signup?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" class="btn btn-primary" target="_blank" style="margin-top: 10px;"><?php _e('Create an account', 'sib_lang'); ?></a>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default row small-content">
                    <div class="page-header">
                        <span style="color: #777777;"><?php _e('Step', 'sib_lang'); ?>2&nbsp;|&nbsp;</span><strong><?php _e('Activate your account with your API key', 'sib_lang'); ?></strong>
                    </div>
                    <div class="panel-body">
                        <div class="col-md-9 row">
                            <div id="success-alert" class="alert alert-success" role="alert" style="display: none;"><?php _e('You successfully activate your account.', 'sib_lang');?></div>
                            <input type="hidden" id="general_error" value="<?php _e('Please input correct information.', 'sib_lang');?>">
                            <input type="hidden" id="curl_no_exist_error" value="<?php _e('Please install curl on site to use sendinblue plugin.', 'sib_lang');?>">
                            <input type="hidden" id="curl_error" value="<?php _e('Curl error.', 'sib_lang');?>">
                            <div id="failure-alert" class="alert alert-danger" role="alert" style="display: none;"><?php _e('Please input correct information.', 'sib_lang');?></div>
                            <p>
                                <?php _e('Once your have created your SendinBlue account, activate this plugin to send all your transactional emails by using SendinBlue SMTP to make sure all of your emails get to your contacts inbox.', 'sib_lang'); ?><br>
                                <?php _e('To activate your plugin, enter your API Access key.', 'sib_lang'); ?><br>
                            </p>
                            <p>
                                <a href="https://my.sendinblue.com/advanced/apikey/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Get your API key from your account', 'sib_lang'); ?></a>
                            </p>
                            <p>
                                <div class="col-md-7 row">
                                    <p class="col-md-12 row"><input id="sib_access_key" type="text" class="col-md-10" style="margin-top: 10px;" placeholder="<?php _e('Access Key', 'sib_lang'); ?>"></p>
                                    <p class="col-md-12 row"><button type="button" id="sib_validate_btn" class="col-md-4 btn btn-primary"><span class="sib-spin"><i class="fa fa-circle-o-notch fa-spin fa-lg"></i>&nbsp;&nbsp;</span><?php _e('Login', 'sib_lang'); ?></button></p>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        <?php
        }

        /** generate main home page after validation */
        function generate_main_content()
        {
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
            $data = array();
            $list_response = $mailin->get_lists($data);
            if($list_response['code'] != 'success') {
                $total_subscribers = 0;
            } else {
                $list_datas = $list_response['data'];
                $list_ids = array();
                if (isset($list_datas) && is_array($list_datas)) {
                    foreach($list_datas as $list_data) {
                        $list_ids[] = $list_data['id'];
                    }
                }
                $data = array(
                    "listids" => $list_ids,
                    "page" => 1,
                    "page_limit" => 500
                );
                $users_response = $mailin->display_list_users($data);
                $total_subscribers = intval($users_response['data']['total_list_records']);
            }

            // get campaigns
            $campaign_stat = self::get_campaign_stats();

            // display account info
            self::update_account_info();

            // check smtp available
            if(SIB_Manager::is_done_validation()) {
                if (SIB_Manager::$smtp_details == null) {
                    SIB_Manager::update_smtp_details();
                }
                else if((is_array(SIB_Manager::$smtp_details)) && (SIB_Manager::$smtp_details['relay'] == false)) {
                    SIB_Manager::update_smtp_details();
                }
            }

            $home_settings = get_option(SIB_Manager::home_option_name);

        ?>

            <div id="main-content">
                <input type="hidden" id="cur_refer_url" value="<?php echo add_query_arg(array('page' => 'sib_page_home'), admin_url('admin.php')); ?>">
                <div class="panel panel-default row small-content">
                    <div class="page-header">
                        <strong><?php _e('My Account', 'sib_lang'); ?></strong>
                    </div>
                    <div class="panel-body">
                        <span class="col-md-12"><b><?php _e('You are currently logged in as : ', 'sib_lang'); ?></b></span>
                        <div class="col-md-8 row" style="margin-bottom: 10px;">
                            <p class="col-md-12" style="margin-top: 5px;">
                                <?php echo SIB_Manager::$account_user_name; ?>&nbsp;-&nbsp;<?php echo SIB_Manager::$account_email; ?><br>
                                <?php
                                $count = count(SIB_Manager::$account_data);
                                for($i = 0; $i < $count - 1; $i ++)
                                {
                                    echo SIB_Manager::$account_data[$i]['plan_type'] . ' - ' . SIB_Manager::$account_data[$i]['credits'] . ' ' .  __('credits', 'sib_lang') . '<br>';
                                }
                                ?>
                                <a href="<?php echo esc_url(add_query_arg('sib_action', 'logout')); ?>"><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Log out', 'sib_lang'); ?></a>
                            </p>
                        </div>

                        <span class="col-md-12"><b><?php _e('Contacts', 'sib_lang'); ?></b></span>
                        <div class="col-md-8 row" style="margin-bottom: 10px;">
                            <p class="col-md-7" style="margin-top: 5px;">
                                <?php echo __('You have', 'sib_lang') .' <span id="sib_total_contacts">'.$total_subscribers.'</span> '. __('contacts.', 'sib_lang'); ?><br>
                                <a id="sib_list_link" href="https://my.sendinblue.com/users/list/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Access to the list of all my contacts', 'sib_lang'); ?></a>
                            </p>
                        </div>
                        <span class="col-md-12"><b><?php _e('Campaigns', 'sib_lang'); ?></b></span>
                        <div class="col-md-12 row" style="padding-top: 10px;">
                            <div class="col-md-4">
                                <span style="line-height: 200%;">
                                    <span class="glyphicon glyphicon-envelope"></span>
                                    <?php _e('Email Campaigns', 'sib_lang'); ?>
                                </span>
                                <div class="list-group" id="list-group-email-campaign">
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#sent_c" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['classic']['Sent']; ?></span>
                                        <span class="glyphicon glyphicon-send"></span>
                                        <?php _e('Sent', 'sib_lang'); ?>
                                    </a>
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#draft_c" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['classic']['Draft']; ?></span>
                                        <span class="glyphicon glyphicon-edit"></span>
                                        <?php _e('Draft', 'sib_lang'); ?>
                                    </a>
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#submitted_c" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['classic']['Queued']; ?></span>
                                        <span class="glyphicon glyphicon-dashboard"></span>
                                        <?php _e('Scheduled', 'sib_lang'); ?>
                                    </a>
                                    <div class="list-group-item">
                                        <a href="https://my.sendinblue.com/camp/step1/type/classic/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Create new email campaign', 'sib_lang'); ?></a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <span style="line-height: 200%;">
                                    <span class="glyphicon glyphicon-phone"></span>
                                    <?php _e('SMS Campaigns', 'sib_lang'); ?>
                                </span>
                                <div class="list-group" id="list-group-email-campaign">
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#sent_s" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['sms']['Sent']; ?></span>
                                        <span class="glyphicon glyphicon-send"></span>
                                        <?php _e('Sent', 'sib_lang'); ?>
                                    </a>
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#draft_s" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['sms']['Draft']; ?></span>
                                        <span class="glyphicon glyphicon-edit"></span>
                                        <?php _e('Draft', 'sib_lang'); ?>
                                    </a>
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#submitted_s" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['sms']['Queued']; ?></span>
                                        <span class="glyphicon glyphicon-dashboard"></span>
                                        <?php _e('Scheduled', 'sib_lang'); ?>
                                    </a>
                                    <div class="list-group-item">
                                        <a href="https://my.sendinblue.com/camp/step1/type/sms/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Create new sms campaign', 'sib_lang'); ?></a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <span style="line-height: 200%;">
                                    <span class="glyphicon glyphicon-play-circle"></span>
                                    <?php _e('Trigger Marketing', 'sib_lang'); ?>
                                </span>
                                <div class="list-group" id="list-group-email-campaign">
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#sent_t" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['trigger']['Sent']; ?></span>
                                        <span class="glyphicon glyphicon-send"></span>
                                        <?php _e('Sent', 'sib_lang'); ?>
                                    </a>
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#draft_t" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['trigger']['Draft']; ?></span>
                                        <span class="glyphicon glyphicon-edit"></span>
                                        <?php _e('Draft', 'sib_lang'); ?>
                                    </a>
                                    <a class="list-group-item" href="https://my.sendinblue.com/camp/listing#submitted_t" target="_blank">
                                        <span class="badge"><?php echo $campaign_stat['trigger']['Queued']; ?></span>
                                        <span class="glyphicon glyphicon-dashboard"></span>
                                        <?php _e('Scheduled', 'sib_lang'); ?>
                                    </a>
                                    <div class="list-group-item">
                                        <a href="https://my.sendinblue.com/camp/step1/type/trigger/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Create new trigger campaign', 'sib_lang'); ?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default row small-content">
                    <div class="page-header">
                        <strong><?php _e('Transactional emails', 'sib_lang'); ?></strong>
                    </div>
                    <div class="panel-body">
                        <?php
                        if(SIB_Manager::$smtp_details['relay'] == false) :
                        ?>
                            <div id="failure-alert" class="col-md-12 alert alert-danger" role="alert"><?php _e('Unfortunately, your "Transactional emails" are not activated because your SendinBlue SMTP account is not active. Please send an email to contact@sendinblue.com in order to ask for SMTP account activation', 'sib_lang');?></div>
                        <?php
                        endif;
                        ?>
                        <div id="success-alert" class="col-md-12 alert alert-success" role="alert" style="display: none;"><?php _e('Mail Sent.', 'sib_lang');?></div>
                        <div id="failure-alert" class="col-md-12 alert alert-danger" role="alert" style="display: none;"><?php _e('Please input valid email.', 'sib_lang');?></div>
                        <div class="row">
                            <p class="col-md-4 text-left"><?php _e('Activate email through SendinBlue', 'sib_lang'); ?></p>
                            <div class="col-md-3">
                                <label class="col-md-6"><input type="radio" name="activate_email" id="activate_email_radio_yes" value="yes" <?php checked($home_settings['activate_email'], 'yes');
                                    if(SIB_Manager::$smtp_details['relay'] == false) {
                                        echo ' disabled';
                                    }
                                    ?> >&nbsp;Yes</label>
                                <label class="col-md-6"><input type="radio" name="activate_email" id="activate_email_radio_no" value="no" <?php checked($home_settings['activate_email'], 'no'); ?>>&nbsp;No</label>
                            </div>
                            <div class="col-md-5">
                                <small style="font-style: italic;"><?php _e('Choose "Yes" if you want to use SendinBlue SMTP to send transactional emails', 'sib_lang'); ?></small>
                            </div>
                        </div>
                        <div class="row" id="email_send_field" <?php

                        if($home_settings['activate_email'] != 'yes') {
                            echo 'style="display:none;"';
                        }
                        ?>>
                        <div class="row" style="margin-left: 0px;margin-bottom: 10px;">
                        <p class="col-md-4 text-left"><?php _e('Choose your sender', 'sib_lang'); ?></p>
                            <div class="col-md-3">
                                <select id="sender_list" class="col-md-12">
                                <?php
                                $senders = SIB_Manager::$sender_info;
                                foreach($senders as $sender){
                                    echo "<option value='".$sender['id']."' ". selected( $home_settings['sender'], $sender['id'] ) .">".$sender['from_name']."&nbsp;&lt;".$sender['from_email']."&gt;</option>";
                                } ?>
                                </select>
                            </div>
                            <div class="col-md-5">
                                <a href="https://my.sendinblue.com/users/settings/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" style="font-style: italic;" target="_blank" ><i class="fa fa-angle-right"></i>&nbsp;<?php _e('Create a new sender', 'sib_lang'); ?></a>
                            </div>
                        </div>
                        <div class="row" style="margin-left: 0px;">
                            <p class="col-md-4 text-left"><?php _e('Enter email to send a test', 'sib_lang'); ?></p>
                            <div class="col-md-3">
                                <input id="activate_email" type="email" class="col-md-12">
                                <button type="button" id="send_email_btn" class="col-md-12 btn btn-primary"><span class="sib-spin"><i class="fa fa-circle-o-notch fa-spin fa-lg"></i>&nbsp;&nbsp;</span><?php _e('Send email', 'sib_lang'); ?></button>
                            </div>
                            <div class="col-md-5">
                                <small style="font-style: italic;"><?php _e('Select here the email address you want to send a test email to.', 'sib_lang'); ?></small>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php
        }

        public static function generate_side_bar()
        {
        ?>

            <div class="panel panel-default text-left box-border-box  small-content">
                <div class="panel-heading"><strong><?php _e('About SendinBlue', 'sib_lang'); ?></strong></div>
                <div class="panel-body">
                    <p><?php _e('SendinBlue is an online software that allows you to send emails and SMS. Easily manage your Marketing campaigns, transactional emails and SMS.', 'sib_lang'); ?></p>
                    <ul class="sib-widget-menu">
                        <li>
                            <a href="https://www.sendinblue.com/about/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i> &nbsp;<?php _e('Who we are', 'sib_lang'); ?></a>
                        </li>
                        <li>
                            <a href="https://www.sendinblue.com/pricing/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i> &nbsp;<?php _e('Pricing', 'sib_lang'); ?></a>
                        </li>
                        <li>
                            <a href="https://www.sendinblue.com/features/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i> &nbsp;<?php _e('Features', 'sib_lang'); ?></a>
                        </li>
                    </ul>
                </div>

            </div>
            <div class="panel panel-default text-left box-border-box  small-content">
                <div class="panel-heading"><strong><?php _e('Need Help ?', 'sib_lang'); ?></strong></div>
                <div class="panel-body">
                    <p><?php _e('You have a question or need more information ?', 'sib_lang'); ?></p>
                    <ul class="sib-widget-menu">
                        <li><a href="https://resources.sendinblue.com/category/tutorials/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i> &nbsp;<?php _e('Tutorials', 'sib_lang'); ?></a></li>
                        <li><a href="https://resources.sendinblue.com/category/faq/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=module_link" target="_blank"><i class="fa fa-angle-right"></i> &nbsp;<?php _e('FAQ', 'sib_lang'); ?></a></li>
                    </ul>
                </div>
            </div>
            <div class="panel panel-default text-left box-border-box  small-content">
                <div class="panel-heading"><strong><?php _e('Recommended this plugin', 'sib_lang'); ?></strong></div>
                <div class="panel-body">
                    <p><?php _e('You like this plugin? Let everybody knows and review it' ,'sib_lang'); ?></p>
                    <ul class="sib-widget-menu">
                        <li><a href="http://wordpress.org/support/view/plugin-reviews/mailin" target="_blank"><i class="fa fa-angle-right"></i> &nbsp;<?php _e('Review this plugin', 'sib_lang'); ?></a></li>
                    </ul>
                </div>
            </div>
        <?php
        }

        /** get narration script */
        static function get_narration_script($title, $text)
        {
            ?>
            <i title="<?php echo $title; ?>" data-container="body" data-toggle="popover" data-placement="right" data-content="<?php echo $text; ?>" data-html="true" class="fa fa-question-circle popover-help-form"></i>
            <?php
        }

        /** print disable mode popup */
        static function print_disable_popup() {
        ?>
            <div class="modal fade sib-disable-modal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" style="font-size: 22px;">&times;</span><span class="sr-only">Close</span></button>
                            <h4 class="modal-title"><?php _e('SendinBlue','sib_lang'); ?></h4>
                        </div>
                        <div class="modal-body" style="padding: 30px;">
                            <p>
                                <?php _e('You are currently not logged in. Create an account or log in to benefit from all of SendinBlue\'s features an your Wordpress site.', 'sib_lang'); ?>
                            </p>
                            <ul>
                                <li> <span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Collect and manage your contacts', 'sib_lang'); ?></li>
                                <li> <span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Send transactional emails via SMTP or API', 'sib_lang'); ?></li>
                                <li> <span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Real time statistics and email tracking', 'sib_lang'); ?></li>
                                <li> <span class="glyphicon glyphicon-ok" style="font-size: 12px;"></span>&nbsp;&nbsp;<?php _e('Edit and send email marketing', 'sib_lang'); ?></li>
                            </ul>
                            <div class="row" style="margin-top: 40px;">
                                <div class="col-md-6">
                                    <a href="https://www.sendinblue.com/users/login/" target="_blank"><i><?php _e('Have an account?', 'sib_lang'); ?></i></a>
                                </div>
                                <div class="col-md-6">
                                    <a href="https://www.sendinblue.com/users/signup/" target="_blank" class="btn btn-default"><i class="fa fa-angle-double-right"></i>&nbsp;<?php _e('Free Subscribe Now', 'sib_lang'); ?>&nbsp;<i class="fa fa-angle-double-left"></i></a>
                                </div>
                            </div>
                        </div>

                    </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->
            <button id="sib-disable-popup" class="btn btn-primary" data-toggle="modal" data-target=".sib-disable-modal" style="display: none;">sss</button>
            <script>
                jQuery(document).ready(function() {
                    jQuery('.sib-disable-modal').modal();

                    jQuery('.sib-disable-modal').on('hidden.bs.modal', function() {
                        window.location.href = '<?php echo add_query_arg('page', 'sib_page_home', admin_url('admin.php')); ?>';
                    });
                });

            </script>

        <?php
        }
        /** ajax module for validation (Home - welcome) */
        public static function ajax_validation_process()
        {
            $access_key = trim($_POST['access_key']);

			try {
                $mailin = new Mailin(SIB_Manager::sendinblue_api_url, $access_key);
            }catch( Exception $e ){
                if( $e->getMessage() == 'Mailin requires CURL module' ) {
                    echo 'curl_no_installed';
                }else{
                    echo 'curl_error';
                }
                die();
            }

            $response = $mailin->get_access_tokens();
            if(is_array($response)) {
                if($response['code'] == 'success') {

                    // store api info
                    $settings = array(
                        'access_key' => $access_key,
                    );
                    update_option(SIB_Manager::main_option_name, $settings);

                    $access_token = $response['data']['access_token'];
                    $token_settings = array(
                        'access_token' => $access_token
                    );
                    update_option(SIB_Manager::access_token_option_name, $token_settings);

                    $mailin->partnerWordpress();

                    echo 'success';
                }
                else
                    echo $response['code'];
            } else {
                echo 'fail';
            }
            die();
        }

        /** Ajax module for change list */
        public static function ajax_change_list()
        {
            $list_id = $_POST['list_id'];

            $home_settings = get_option(SIB_Manager::home_option_name);
            $home_settings['list_id'] = $list_id;
            update_option(SIB_Manager::home_option_name, $home_settings);

            // get total contacts
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
            $data = array(
                'id' => $list_id
            );
            $list_info = $mailin->get_list($data);

            if(!is_array($list_info)) {
                $total_subscribers = 0;
            } else {
                $total_subscribers = intval($list_info['data']['total_subscribers']);
            }

            echo $total_subscribers;
            die();
        }

        /** ajax module to change activate email option */
        public static function ajax_activate_email_change()
        {
            $option_val = $_POST['option_val'];
            $home_settings = get_option(SIB_Manager::home_option_name);
            $home_settings['activate_email'] = $option_val;
            update_option(SIB_Manager::home_option_name, $home_settings);
            echo 'success';
            die();
        }

        /** ajax module to change sender detail */
        public static function ajax_sender_change(){
            $sender_id = $_POST['sender']; // sender id
            $home_settings = get_option(SIB_Manager::home_option_name);
            $home_settings['sender'] = $sender_id;
            $home_settings['from_name'] = SIB_Manager::$sender_info[$sender_id]['from_name'];
            $home_settings['from_email'] = SIB_Manager::$sender_info[$sender_id]['from_email'];
            update_option(SIB_Manager::home_option_name, $home_settings);
            echo 'success';
            die();
        }

        /** ajax module for send a test email */
        public static function ajax_send_email()
        {
            $to = array($_POST['email'] => '');

            $subject  = __('[SendinBlue SMTP] test email', 'sib_lang');
            // get sender info
            $home_settings = get_option(SIB_Manager::home_option_name);
            if(isset($home_settings['sender'])) {
                $fromname = $home_settings['from_name'];
                $from_email = $home_settings['from_email'];
            }else{
                $from_email = __('no-reply@sendinblue.com', 'sib_lang');
                $fromname = __('SendinBlue', 'sib_lang');
            }

            $from = array($from_email, $fromname);
            $null_array = array();

            $email_templates = SIB_Manager::get_email_template('test');

            $text = $email_templates['text_content'];
            $html = $email_templates['html_content'];

            $html = str_replace('{title}', $subject, $html);
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);

            $headers = array("Content-Type"=> "text/html;charset=iso-8859-1", "X-Mailin-tag"=>'Wordpress Mailin Test' );
            $data = array(
                "to" => $to,
                "subject"  => $subject,
                "from" => $from,
                "text" => $email_templates['text_content'],
                "html" => $html,
                "headers" => $headers
            );
            $result = $mailin->send_email($data);

            echo 'success';
            die();
        }

        /** logout process */
        function logout()
        {
            $setting = array();
            update_option(SIB_Manager::main_option_name, $setting);

            $home_settings = array(
                'activate_email' => 'no'
            );
            update_option(SIB_Manager::home_option_name, $home_settings);

            // delete access_token
            $token_settings = array();
            update_option(SIB_Manager::access_token_option_name, $token_settings);
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, SIB_Manager::$access_key);
            $mailin->delete_token(SIB_Manager::$access_token);

            // remove account info
            self::remove_account_info();

            wp_redirect(add_query_arg('page', self::page_id, admin_url('admin.php')));
            exit;
        }

        /** get lists in SendinBlue */
        static function get_lists()
        {
            $access_key = SIB_Manager::$access_key;
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, $access_key);
            $data = array();
            $list_response = $mailin->get_lists($data);

            $lists = array();

            // check response
            if(!is_array($list_response))
                return $lists;

            if($list_response['code'] != 'success')
                return $lists;

            $response_data = $list_response['data'];
            if(!is_array($response_data))
                return $lists;

            // get lists from response
            if (isset($response_data) && is_array($response_data)) {
                foreach($response_data as $list)
                {
                    $lists[] = array(
                        'id' => $list['id'],
                        'name' => $list['name']
                    );
                }
            }

            return $lists;
        }

        /**
         * Get campaign stats
         */
        static function get_campaign_stats()
        {
            $access_key = SIB_Manager::$access_key;
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, $access_key);
            $data = array();
            $response = $mailin->get_campaigns_v2($data);

            $ret = array(
                'classic' => array(
                    'Sent' => 0,
                    'Draft' => 0,
                    'Queued' => 0,
                    'Suspended' => 0,
                    'In_process' => 0,
                    'Archive' => 0,
                    'Sent and Archived' =>0,
                    'Temp_active' => 0,
                    'Temp_inactive' =>0,
                    'Scheduled' => 0
                ),
                'sms' => array(
                    'Sent' => 0,
                    'Draft' => 0,
                    'Queued' => 0,
                    'Suspended' => 0,
                    'In_process' => 0,
                    'Archive' => 0,
                    'Sent and Archived' =>0,
                    'Temp_active' => 0,
                    'Temp_inactive' =>0,
                    'Scheduled' => 0
                ),
                'trigger' => array(
                    'Sent' => 0,
                    'Draft' => 0,
                    'Queued' => 0,
                    'Suspended' => 0,
                    'In_process' => 0,
                    'Archive' => 0,
                    'Sent and Archived' =>0,
                    'Temp_active' => 0,
                    'Temp_inactive' =>0,
                    'Scheduled' => 0
                ),
            );

            $campaign_records = $response['data']['campaign_records'];
            if(isset($campaign_records) && is_array($campaign_records)) {
                foreach($campaign_records as $campaign_record) {
                    if($campaign_record['type'] == 'template' || $campaign_record['type'] == '')
                        continue;

                    $ret[$campaign_record['type']][$campaign_record['status']] ++;
                }
            }

            return $ret;
        }

        /**
         * Get account info
         */
        static function update_account_info()
        {
            $access_key = SIB_Manager::$access_key;
            $mailin = new Mailin(SIB_Manager::sendinblue_api_url, $access_key);
            $response = $mailin->get_account();

            if((is_array($response)) && ($response['code'] == 'success')) {
                $account_data = $response['data'];
                $count = count($account_data);
                SIB_Manager::$account_email = $account_data[$count-1]['email'];
                SIB_Manager::$account_data = $account_data;
                SIB_Manager::$account_user_name = $account_data[$count-1]['first_name'] . ' ' . $account_data[$count-1]['last_name'];

                $account_settings = array(
                    'account_email' => SIB_Manager::$account_email,
                    'account_user_name' => SIB_Manager::$account_user_name,
                    'account_data' => SIB_Manager::$account_data
                );

                update_option(SIB_Manager::account_option_name, $account_settings);
            }
        }

        /**
         * Remove account info
         */
        static function remove_account_info()
        {
            $account_settings = array();
            update_option(SIB_Manager::account_option_name, $account_settings);
            $smtp_details = null;
            update_option(SIB_Manager::attribute_smtp_name, $smtp_details);
        }
    }


}