var normal_attributes = [];
var category_attributes = [];

function change_list_val(list_id)
{
    var data = {
        action:'sib_change_list',
        list_id:list_id
    }
    jQuery('#sib_select_list').attr('disabled', 'true');
    jQuery.post(ajax_object.ajax_url, data, function(respond){
        jQuery('#sib_total_contacts').html(respond);
        var base_url = jQuery('#sib_list_link').attr('data-url');
        jQuery('#sib_list_link').attr('href', base_url + list_id);
        jQuery('#sib_select_list').removeAttr('disabled');
    });
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
}

function change_field_attr()
{
    var attr_val = jQuery('#sib_sel_attribute').val();
    var attr_type, attr_name, attr_text;
    if (attr_val == 'email' || attr_val == 'submit') {
        // get all info of attr
        attr_type = jQuery('#sib_hidden_' + attr_val).attr('data-type');
        attr_name = jQuery('#sib_hidden_' + attr_val).attr('data-name');
        attr_text = jQuery('#sib_hidden_' + attr_val).attr('data-text');
    }
    else {
        jQuery.each(normal_attributes, function(index, value) {
            if (value['name'] == attr_val) {
                attr_type = value['type'];
                attr_name = value['name'];
                attr_text = attr_name;
            }
        });

        jQuery.each(category_attributes, function(index, value) {
            if (value['name'] == attr_val) {
                attr_type = value['type'];
                attr_name = value['name'];
                attr_text = attr_name;
            }
        });
    }

    // generate attribute html
    generate_attribute_html(attr_type, attr_name, attr_text);
}

function change_attribute_tag(attr_type, attr_name, attr_text)
{
    jQuery('#sib_field_add_area').show();
    jQuery('#sib_field_html_area').show();
    jQuery('#sib_field_label').attr('value', attr_text);
    jQuery('#sib_field_placeholder').attr('value', '');
    jQuery('#sib_field_initial').attr('value', '');
    jQuery('#sib_field_button_text').attr('value', attr_text);
    jQuery('#sib_field_wrap').attr('checked', 'true');
    jQuery('#sib_field_type_area input[name="sib_field_type"][value="select"]').attr('checked', 'checked');
    switch(attr_type)
    {
        case 'email':
            jQuery('#sib_field_label_area').show();
            jQuery('#sib_field_placeholder_area').show();
            jQuery('#sib_field_initial_area').show();
            jQuery('#sib_field_button_text_area').hide();
            jQuery('#sib_field_wrap_area').show();
            jQuery('#sib_field_required').attr('checked', 'true');
            jQuery('#sib_field_required_area').show();
            jQuery('#sib_field_type_area').hide();
            break;
        case 'text':
            jQuery('#sib_field_label_area').show();
            jQuery('#sib_field_placeholder_area').show();
            jQuery('#sib_field_initial_area').show();
            jQuery('#sib_field_button_text_area').hide();
            jQuery('#sib_field_wrap_area').show();
            jQuery('#sib_field_required').removeAttr('checked');
            jQuery('#sib_field_required_area').show();
            jQuery('#sib_field_type_area').hide();
            break;
        case 'float':
            jQuery('#sib_field_label_area').show();
            jQuery('#sib_field_placeholder_area').show();
            jQuery('#sib_field_initial_area').show();
            jQuery('#sib_field_button_text_area').hide();
            jQuery('#sib_field_wrap_area').show();
            jQuery('#sib_field_required').removeAttr('checked');
            jQuery('#sib_field_required_area').show();
            jQuery('#sib_field_type_area').hide();
            break;
        case 'category':
            jQuery('#sib_field_label_area').show();
            jQuery('#sib_field_placeholder_area').hide();
            jQuery('#sib_field_initial_area').hide();
            jQuery('#sib_field_button_text_area').hide();
            jQuery('#sib_field_wrap_area').show();
            jQuery('#sib_field_required').removeAttr('checked');
            jQuery('#sib_field_required_area').show();
            jQuery('#sib_field_type_area').show();
            break;
        case 'submit':
            jQuery('#sib_field_label_area').hide();
            jQuery('#sib_field_placeholder_area').hide();
            jQuery('#sib_field_initial_area').hide();
            jQuery('#sib_field_button_text_area').show();
            jQuery('#sib_field_wrap_area').show();
            jQuery('#sib_field_required').removeAttr('checked');
            jQuery('#sib_field_required_area').hide();
            break;
    }
}

// generate attribute html
function generate_attribute_html(attr_type, attr_name, attr_text)
{
    var field_label = jQuery('#sib_field_label').val();
    var field_placeholder = jQuery('#sib_field_placeholder').val();
    var field_initial = jQuery('#sib_field_initial').val();
    var field_buttontext = jQuery('#sib_field_button_text').val();
    var field_wrap = jQuery('#sib_field_wrap').is(':checked');
    var field_required = jQuery('#sib_field_required').is(':checked');
    var field_type = jQuery('#sib_field_type_area input[name="sib_field_type"]:checked').val();

    var field_html = '';

    if(field_wrap == true) {
        if(attr_type != 'submit') {
            field_html += '<p class="sib-' + attr_name + '-area"> \n';
        }
        else {
            field_html += '<p> \n';
        }
    }

    if ((field_label != '') && (attr_type == 'category')) {
        if (field_type == 'select') {
            field_html += '    <label class="sib-' + attr_name + '-area">' + field_label + '</label> \n';
        }
        else {
            field_html += '    <div style="display:block;"><label class="sib-' + attr_name + '-area">' + field_label + '</label></div> \n';
        }
    }
    else if((field_label != '') && (attr_type != 'submit')) {
        field_html += '    <label class="sib-' + attr_name + '-area">' + field_label + '</label> \n';
    }


    switch (attr_type)
    {
        case 'email':
            field_html += '    <input type="email" class="sib-' + attr_name + '-area" name="' + attr_name + '" ';
            field_html += 'placeholder="' + field_placeholder + '" ';
            field_html += 'value="' + field_initial + '" ';
            if(field_required == true) {
                field_html += 'required="required" ';
            }
            field_html += '> \n';
            break;
        case 'text':
            field_html += '    <input type="text" class="sib-' + attr_name + '-area" name="' + attr_name + '" ';
            if(field_placeholder != '') {
                field_html += 'placeholder="' + field_placeholder + '" ';
            }
            if(field_initial != '') {
                field_html += 'value="' + field_initial + '" ';
            }
            if(field_required == true) {
                field_html += 'required="required" ';
            }
            field_html += '> \n';
            break;
        case 'float':
            field_html += '    <input type="text" class="sib-' + attr_name + '-area" name="' + attr_name + '" ';
            if(field_placeholder != '') {
                field_html += 'placeholder="' + field_placeholder + '" ';
            }
            if(field_initial != '') {
                field_html += 'value="' + field_initial + '" ';
            }
            if(field_required == true) {
                field_html += 'required="required" ';
            }
            field_html += 'pattern="[0-9]+([\\.|,][0-9]+)?" > \n';
            break;
        case 'submit':
            field_html += '    <input type="submit" class="sib-default-btn" name="' + attr_name + '" ';
            field_html += 'value="' + field_buttontext + '" ';
            field_html += '> \n';
            break;
        case 'category':
            var enumeration = [];
            jQuery.each(category_attributes, function(index, value) {
                if (value['name'] == attr_name) {
                    enumeration = value['enumeration'];
                }
            });
            if (field_type == 'select') {
                field_html += '    <select class="sib-' + attr_name + '-area" name="' + attr_name + '" ';
                if (field_required == true) {
                    field_html += 'required="required" ';
                }
                field_html += '> \n';
            }
            jQuery.each(enumeration, function(index, value) {
                if (field_type == 'select') {
                    field_html += '      <option value="' + value['value'] + '">' + value['label'] + '</option> \n';
                }
                else {
                    field_html += '    <div style="display:block;"><input type="radio" class="sib-' + attr_name + '-area" name="' + attr_name + '" value="' + value['value'] + '" ';
                    if (field_required == true) {
                        field_html += 'required="required" ';
                    }
                    field_html += '>' + value['label'] + '</div> \n';
                }
            });
            if (field_type == 'select') {
                field_html += '    </select> \n';
            }
            break;
    }

    if(field_wrap == true) {
        field_html += '</p> \n';
    }

    jQuery('#sib_field_html').html(field_html);
}

function set_select_list() {
    var selected_list_id = jQuery('#sib_selected_list_id').val();

    var data = {
        action : 'sib_get_lists'
    };
    jQuery.post(ajax_object.ajax_url, data, function(respond) {
        var select_html = '<select id="sib_select_list" class="col-md-10" name="list_id">';
        jQuery.each(respond.lists, function(index, value) {
            if(value['name'] == 'Temp - DOUBLE OPTIN') return true;
            if (value['id'] == selected_list_id) {
                select_html += '<option value="' + value['id'] + '" selected>' + value['name'] + '</option>';
            }
            else {
                select_html += '<option value="' + value['id'] + '">' + value['name'] + '</option>';
            }
        });
        select_html += '</select>';
        jQuery('#sib_select_list_area').html(select_html);
        set_select_template();
    });
}

function set_select_template() {
    var selected_template_id = jQuery('#sib_selected_template_id').val();
    var selected_do_template_id = jQuery('#sib_selected_do_template_id').val();
    var default_template_name = jQuery('#sib_default_template_name').val();
    var data = {
        action : 'sib_get_templates'
    };
    jQuery.post(ajax_object.ajax_url, data, function(respond) {
        var select_html = '<select id="sib_template_id" class="col-md-11" name="template_id">';
        if (selected_template_id == '-1') {
            select_html += '<option value="-1" selected>' + default_template_name + '</option>';
        }
        else {
            select_html += '<option value="-1">' + default_template_name + '</option>';
        }
        jQuery.each(respond.templates, function(index, value) {
            if (value['id'] == selected_template_id) {
                select_html += '<option value="' + value['id'] + '" selected>' + value['campaign_name'] + '</option>';
            }
            else {
                select_html += '<option value="' + value['id'] + '">' + value['campaign_name'] + '</option>';
            }
        });
        select_html += '</select>';
        jQuery('#sib_template_id_area').html(select_html);

        // For double optin.
        select_html = '<select class="col-md-11" name="doubleoptin_template_id" id="sib_doubleoptin_template_id">';
        if (selected_do_template_id == '-1') {
            select_html += '<option value="-1" selected>' + default_template_name + '</option>';
        }
        else {
            select_html += '<option value="-1">' + default_template_name + '</option>';
        }
        jQuery.each(respond.templates, function(index, value) {
            var template_content = value['html_content'];
            var doubleoptin_exists = 1;
            if (template_content.indexOf('[DOUBLEOPTIN]') == -1) {
                doubleoptin_exists = 0;
            }
            if (value['id'] == selected_do_template_id) {
                select_html += '<option is_shortcode="' + doubleoptin_exists  + '" value="' + value['id'] + '" selected>' + value['campaign_name'] + '</option>';
            }
            else {
                select_html += '<option is_shortcode="' + doubleoptin_exists  + '" value="' + value['id'] + '">' + value['campaign_name'] + '</option>';
            }
        });
        select_html += '</select>';
        jQuery('#sib_doubleoptin_template_id_area').html(select_html);
        // double optin template id
        jQuery('#sib_doubleoptin_template_id').on('change', function() {
            var shortcode_exist = jQuery(this).find(':selected').attr('is_shortcode');
            if (shortcode_exist == 0 && jQuery(this).val() != -1) {
                jQuery('#sib_form_alert_message').show();
                jQuery('#sib_disclaim_smtp').hide();
                jQuery('#sib_disclaim_do_template').show();
                jQuery(this).val('-1');
            }
            else {
                jQuery('#sib_form_alert_message').hide();
            }
        });

        jQuery('#sib_setting_signup_spin').addClass('hide');
        jQuery('#sib_setting_signup_body').removeClass('hide');
        set_select_attributes();
    });
}

function set_select_attributes() {
    var data = {
        action : 'sib_get_attributes'
    };

    jQuery.post(ajax_object.ajax_url, data, function(respond) {
        normal_attributes = respond.attributes.normal_attributes;
        category_attributes = respond.attributes.category_attributes;
        var attr_email_name = jQuery('#sib_hidden_email').attr('data-text');
        var message_1 = jQuery('#sib_hidden_message_1').val();
        var message_2 = jQuery('#sib_hidden_message_2').val();
        var message_3 = jQuery('#sib_hidden_message_3').val();
        var message_4 = jQuery('#sib_hidden_message_4').val();
        var message_5 = jQuery('#sib_hidden_message_5').val();
        var select_html = '<select class="col-md-12" id="sib_sel_attribute">' +
            '<option value="-1" disabled selected>' + message_1 + '</option>' +
            '<optgroup label="' + message_2 + '">';
        select_html += '<option value="email">' + attr_email_name + '*</option>';
        jQuery.each(normal_attributes, function(index, value) {
            select_html += '<option value="' + value['name'] + '">' + value['name'] + '</option>';
        });
        select_html += '</optgroup>';
        select_html += '<optgroup label="' + message_3 + '">';
        jQuery.each(category_attributes, function(index, value) {
            select_html += '<option value="' + value['name'] + '">' + value['name'] + '</option>';
        });
        select_html += '</optgroup>';
        select_html += '<optgroup label="' + message_4 + '">';
        select_html += '<option value="submit">' + message_5 + '</option>';
        select_html += '</optgroup>';
        select_html += '</select>';

        jQuery('#sib_sel_attribute_area').html(select_html);
        jQuery('#sib_sel_attribute').on('change', function() {
            var attr_val = jQuery(this).val();
            var attr_type, attr_name, attr_text;
            if (attr_val == 'email' || attr_val == 'submit') {
                // get all info of attr
                attr_type = jQuery('#sib_hidden_' + attr_val).attr('data-type');
                attr_name = jQuery('#sib_hidden_' + attr_val).attr('data-name');
                attr_text = jQuery('#sib_hidden_' + attr_val).attr('data-text');
            }
            else {
                jQuery.each(normal_attributes, function(index, value) {
                    if (value['name'] == attr_val) {
                        attr_type = value['type'];
                        attr_name = value['name'];
                        attr_text = attr_name;
                    }
                });

                jQuery.each(category_attributes, function(index, value) {
                    if (value['name'] == attr_val) {
                        attr_type = value['type'];
                        attr_name = value['name'];
                        attr_text = attr_name;
                    }
                });
            }
            // change attribute tags
            change_attribute_tag(attr_type, attr_name, attr_text);

            // generate attribute html
            generate_attribute_html(attr_type, attr_name, attr_text);
        });
        jQuery('#sib_setting_form_spin').addClass('hide');
        jQuery('#sib_setting_form_body').removeClass('hide');
    });
}

jQuery(document).ready(function(){
    //jQuery("[data-toggle='tooltip']").tooltip();
    jQuery('.popover-help-form').popover({
    });
    jQuery('.sib-spin').hide();
    jQuery('body').click(function(e) {
        if(!jQuery(e.target).hasClass('popover-help-form')) {
            jQuery('.popover-help-form').popover('hide');
        }
    });

    jQuery('#sib_field_label_area').hide();
    jQuery('#sib_field_placeholder_area').hide();
    jQuery('#sib_field_initial_area').hide();
    jQuery('#sib_field_button_text_area').hide();
    jQuery('#sib_field_wrap_area').hide();
    jQuery('#sib_field_required_area').hide();
    jQuery('#sib_field_type_area').hide();
    jQuery('#sib_field_add_area').hide();
    jQuery('#sib_field_html_area').hide();

    // validate button click process in welcome page
    jQuery('#sib_validate_btn').click(function(){
        var access_key = jQuery('#sib_access_key').val();

        // check validation
        var error_flag = 0;
        if(access_key == '') {
            jQuery('#sib_access_key').addClass('error');
            error_flag =1;
        }

        if(error_flag != 0) {
            return false;
        }

        // ajax process for validate
        var data = {
            action:'sib_validate_process',
            access_key: access_key
        }

        jQuery('#failure-alert').hide();
        jQuery('.sib-spin').show();
        jQuery('#sib_access_key').removeClass('error');
        jQuery(this).attr('disabled', 'true');

        jQuery.post(ajax_object.ajax_url, data, function(respond) {
            jQuery('.sib-spin').hide();
            jQuery('#sib_validate_btn').removeAttr('disabled');
            if(respond == 'success') {
                jQuery('#success-alert').show();
                var cur_url = jQuery('#cur_refer_url').val();
                window.location.href = cur_url;
            }
            else if (respond == 'curl_no_installed') {
                jQuery('#sib_access_key').addClass('error');
                jQuery('#failure-alert').html(jQuery('#curl_no_exist_error').val());
                jQuery('#failure-alert').show();
            }
            else if (respond == 'curl_error') {
                jQuery('#sib_access_key').addClass('error');
                jQuery('#failure-alert').html(jQuery('#curl_error').val());
                jQuery('#failure-alert').show();
            }
            else {
                jQuery('#sib_access_key').addClass('error');
                jQuery('#failure-alert').html(jQuery('#general_error').val());
                jQuery('#failure-alert').show();
            }
        });
    });

    jQuery('#sib_access_key').keypress(function(){
        jQuery(this).removeClass('error');
    });

    /* Transactional emails */
    jQuery('#activate_email_radio_yes').click(function(){
        var data = {
            action: 'sib_activate_email_change',
            option_val: 'yes'
        }

        jQuery.post(ajax_object.ajax_url, data, function(respond) {
            jQuery('#email_send_field').show();
        });

        return true;
    });

    jQuery('#activate_email_radio_no').click(function(){
        var data = {
            action: 'sib_activate_email_change',
            option_val: 'no'
        }

        jQuery.post(ajax_object.ajax_url, data, function(respond) {
            jQuery('#email_send_field').hide();
        });

        return true;
    });
    // change sender detail
    jQuery('#sender_list').change(function(){
        var data = {
            action: 'sib_sender_change',
            sender: jQuery(this).val()
        }
        jQuery.post(ajax_object.ajax_url, data, function(respond) {
            jQuery(this).blur();
        });

        return true;
    });

    // send activate email button

    jQuery('#send_email_btn').click(function(){
        var email = jQuery('#activate_email').val();
        if(email == '' || isValidEmailAddress(email) != true) {
            jQuery('#activate_email').removeClass('has-success');
            jQuery('#activate_email').addClass('error');
            jQuery('#failure-alert').show();
            return false;
        }
        jQuery(this).attr('disabled', 'true');

        var data = {
            action:'sib_send_email',
            email:email
        }

        jQuery('#failure-alert').hide();
        jQuery('#success-alert').hide();
        jQuery('#activate_email').removeClass('error');
        jQuery('.sib-spin').show();
        jQuery.post(ajax_object.ajax_url, data,function(respond) {
            jQuery('.sib-spin').hide();
            jQuery('#send_email_btn').removeAttr('disabled');
            if(respond != 'success') {
                jQuery('#activate_email').removeClass('has-success');
                jQuery('#activate_email').addClass('error');
                jQuery('#failure-alert').show();
            } else {
                jQuery('#success-alert').show();
            }
        });
    });

    jQuery('#activate_email').keypress(function(){
        jQuery('#activate_email').removeClass('error');
        var email = jQuery('#activate_email').val();
        if(isValidEmailAddress(email) == true) {
            jQuery('#activate_email').addClass('has-success');
        }
    });



    jQuery('#sib_field_wrap').change(function() {
        change_field_attr();

    });
    jQuery('#sib_field_required').change(function() {
        change_field_attr();
    });
    jQuery('#sib_field_label').change(function() {
        change_field_attr();
    });
    jQuery('#sib_field_placeholder').change(function() {
        change_field_attr();
    });
    jQuery('#sib_field_initial').change(function() {
        change_field_attr();
    });
    jQuery('#sib_field_button_text').change(function() {
        change_field_attr();
    });

    jQuery('#sib_field_type_area input[type="radio"][name="sib_field_type"]').change(function() {
        change_field_attr();
    });

    jQuery('#sib_add_to_form_btn').click(function() {
        var field_html = jQuery('#sib_field_html').val();
        var formContent = jQuery("#sibformmarkup");
        formContent.val(formContent.val() + "\n" + field_html);
        return false;
    });

    /* read more click */
    jQuery('#home-read-more-link').click(function(e) {
        jQuery('.home-read-more-content').show();
        jQuery(this).hide();
        return false;
    });

    /* when change template id, auto select sender id  */
    jQuery('#sib_template_id').change(function() {
        var temp_id = jQuery(this).val();

        if(temp_id == '-1') {
            return;
        }

        var data = {
            action: 'sib_change_template',
            template_id: temp_id
        }

    });

    // check confirm email
    var is_send_confirm_email = jQuery("input[type='radio'][name='is_confirm_email']:checked").val();

    if(is_send_confirm_email == 'yes') {
        jQuery('#sib_confirm_template_area').show();
        jQuery('#sib_confirm_sender_area').show();
    } else {
        jQuery('#sib_confirm_template_area').hide();
        jQuery('#sib_confirm_sender_area').hide();
    }

    // check double optin
    var is_double_optin = jQuery("input[type='radio'][name='is_double_optin']:checked").val();

    if(is_double_optin == 'yes') {
        jQuery('#is_confirm_email_no').prop("checked", true);
        jQuery('#sib_confirm_template_area').hide();
        jQuery('#sib_confirm_sender_area').hide();
        jQuery('#sib_double_sender_area').show();
        jQuery('#sib_doubleoptin_template_area').show();

    } else {
        jQuery('#sib_double_sender_area').hide();
        jQuery('#sib_double_redirect_area').hide();
        jQuery('#sib_doubleoptin_template_area').hide();
    }

    // click confirm email
    jQuery("input[type='radio'][name='is_confirm_email']").click(function() {
        var confirm_email = jQuery("input[type='radio'][name='is_confirm_email']:checked").val();
        var is_activated_smtp = parseInt(jQuery("#is_smtp_activated").val());

        if(confirm_email == 'yes') {
            jQuery('#is_double_optin_no').prop("checked", true);
            jQuery('#sib_double_sender_area').hide();
            jQuery('#sib_double_redirect_area').hide();
            jQuery('#sib_confirm_template_area').show();
            jQuery('#sib_confirm_sender_area').show();
            jQuery('#sib_doubleoptin_template_area').hide();
            if (is_activated_smtp == 0) {
                jQuery('#sib_form_alert_message').show();
                jQuery('#sib_disclaim_smtp').show();
                jQuery('#sib_disclaim_do_template').hide();
            }
        } else {
            jQuery('#sib_confirm_template_area').hide();
            jQuery('#sib_confirm_sender_area').hide();
            jQuery('#sib_form_alert_message').hide();
        }
    });

    // click double optin
    jQuery("input[type='radio'][name='is_double_optin']").click(function() {
        var double_optin = jQuery("input[type='radio'][name='is_double_optin']:checked").val();
        var is_activated_smtp = parseInt(jQuery("#is_smtp_activated").val());
        if(double_optin == 'yes') {
            jQuery('#is_confirm_email_no').prop("checked", true);
            jQuery('#sib_confirm_template_area').hide();
            jQuery('#sib_confirm_sender_area').hide();
            jQuery('#sib_double_sender_area').show();
            jQuery('#sib_double_redirect_area').show();
            jQuery('#sib_doubleoptin_template_area').show();
            if (is_activated_smtp == 0) {
                jQuery('#sib_form_alert_message').show();
                jQuery('#sib_disclaim_smtp').show();
                jQuery('#sib_disclaim_do_template').hide();
            }
        } else {
            jQuery('#sib_double_sender_area').hide();
            jQuery('#sib_double_redirect_area').hide();
            jQuery('#sib_doubleoptin_template_area').hide();
            jQuery('#sib_form_alert_message').hide();
        }
    });

    // click redirect url
    jQuery('#is_redirect_url_click_yes').click(function() {
        jQuery('#sib_subscrition_redirect_area').show();
    });
    jQuery('#is_redirect_url_click_no').click(function() {
        jQuery('#sib_subscrition_redirect_area').hide();
    });

    if (jQuery('#sib_setting_signup_body').find('#sib_select_list_area').length > 0 ) {
        set_select_list();
    }
});
