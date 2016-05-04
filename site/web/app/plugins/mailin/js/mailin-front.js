jQuery(document).ready(function(){

    jQuery('.sib-default-btn').click(function(){
        var form = jQuery(this).closest('form');
        var form_id = form.find("input[name=reference_id]").val();
        form.find('.sib_loader').show();
        jQuery('.sib_msg_disp').hide();
        var postData = form.serializeArray();
        var formURL = form.attr("action");
        jQuery.ajax(
            {
                url : formURL,
                type: "POST",
                dataType: "json",
                data : postData,
                success:function(data, textStatus, jqXHR)
                {
                    jQuery('.sib_loader').hide();
                    var form_ref = '#sib_form_'+data.refer_id+'-form';
                    if(data.redirect) {
                        window.location.href = data.redirect;
                    } else if(data.status === 'success' || data.status === 'update') {
                        var cdata = '<p class="sib-alert-message sib-alert-message-success">' + sib_alert_success_message + '</p>';
                        jQuery(form_ref).find('.sib_msg_disp').html(cdata).show();
                    } else if(data.status === 'failure') {
                        var cdata = '<p class="sib-alert-message sib-alert-message-error sib-alert-error-general">' + sib_alert_error_message + '</p>';
                        jQuery(form_ref).find('.sib_msg_disp').html(cdata).show();
                    } else if(data.status === 'already_exist') {
                        var cdata = '<p class="sib-alert-message sib-alert-message-warning sib-alert-error-subscriber">' + sib_alert_exist_subscriber + '</p>';
                        jQuery(form_ref).find('.sib_msg_disp').html(cdata).show();
                    } else if(data.status === 'invalid') {
                        var cdata = '<p class="sib-alert-message sib-alert-message-error sib-alert-error-general">' + sib_alert_invalid_email + '</p>';
                        jQuery(form_ref).find('.sib_msg_disp').html(cdata).show();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    form.find('.sib_msg_disp').html(jqXHR).show();
                }
            });
    });
});
