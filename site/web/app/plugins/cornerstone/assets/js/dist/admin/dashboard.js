(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CS_dashboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function( type, message, callback, context, args ) {

  $overlay = jQuery('<div class="cs-admin-confirm-outer">' +
                      '<div class="cs-admin-confirm-inner">' +
                        '<div class="cs-admin-confirm-content">' +
                          '<p class="cs-admin-confirm-message">' + message + '</p>' +
                          '<div class="cs-admin-confirm-actions">' +
                            '<button class="nope">' + csAdmin.l18n('confirm-nope') + '</button>' +
                            '<button class="yep ' + type + '">' + csAdmin.l18n('confirm-yep') +'</span></button>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>');

  $overlay.find('.cs-admin-confirm-actions button').on( 'click', function(e) {

    $overlay.remove();

    if ( _.isFunction( callback ) && jQuery(this).hasClass('yep') ) {
      var context = context || this;
      var args = args || [];
      callback.apply( context, args );
    }

  });

  jQuery('body').append($overlay);
};

},{}],2:[function(require,module,exports){
window.csAdmin.l18n =  function( key ) {
	return csAdmin.strings[key] || '';
}

if ( csAdmin.isSettingsPage == "true" )
  jQuery(document).ready(require('./settings-page'));

if ( csAdmin.isPostEditor == "true" )
  jQuery(window).ready(require('./post-editor'));



},{"./post-editor":3,"./settings-page":4}],3:[function(require,module,exports){
module.exports = function($){


	var Confirm = require('./confirm');

	//
	// Cornerstone Editor Tab
	//

	var $csEditor, $wpEditor, $csTab, $editButton;

	$csEditor = $( csAdmin.editorTabMarkup );
	$wpEditor = $('#postdivrich');
	$wpEditor.after($csEditor);

	$csTab = $('<button type="button" id="content-cornerstone" class="wp-switch-editor switch-cornerstone">' + csAdmin.l18n('cornerstone-tab') + '</button>');
	$wpEditor.find('.wp-editor-tabs').append($csTab);

	var switchToCornerstone = function() {
		$wpEditor.hide();
		$csEditor.show();
		var hideVC = function(){ $('.composer-switch').css( { visibility:'hidden' } ); }
		_.defer( hideVC );
		jQuery(window).on('load', hideVC );
	}

	var switchBack = function( context ) {
		$wpEditor.show();
		$(window).trigger( 'scroll.editor-expand', 'scroll' ); // Fix WP editor's width
		$csEditor.hide();
		$('.composer-switch').css( { visibility: 'visible' } );
		switchEditors.switchto( context );
	}

	$csEditor.find('#content-tmce, #content-html').click(function() {

		var mode = this;

		if ( csAdmin.usesCornerstone == 'true' ) {
			Confirm( 'error', csAdmin.l18n( 'manual-edit-warning' ), function() {
				if ( csAdmin.post_id != 'new' ) {
					wp.ajax.post('cs_override', { post_id: csAdmin.post_id });
				}
				csAdmin.usesCornerstone = 'false';
				switchBack( mode );
			});
			return;
		}

		switchBack( mode );

	});

	$csTab.click(function() {

		if ( csAdmin.usesCornerstone == 'false' && csAdmin.post_id != 'new' && wp.autosave.getPostData().content != "" ) {
			Confirm( 'error', csAdmin.l18n( 'overwrite-warning' ), function() {
				csAdmin.usesCornerstone = 'none';
				switchToCornerstone();
			});
			return;
		}

		switchToCornerstone();

	});

	if ( csAdmin.usesCornerstone == 'true' ) {
		switchToCornerstone();
	}

	//
	// "Edit with Cornerstone" button logic.
	//

	$csEditor.find('#cs-edit-button').on('click', function( e ){

		e.preventDefault();
		e.stopPropagation();

		if (csAdmin.editURL != null) {
			window.location = csAdmin.editURL;
			return;
		}

		$('#title-prompt-text').hide();

		var $title = $('#title');
		var val = $title.val();
		if ( !val || val == '' || val == 'title' ) {
			$title.val( csAdmin.l18n('default-title') );
		}

		wp.autosave.server.triggerSave();

		$(document).on('heartbeat-tick.autosave', function( event, data ) {

			var data = wp.autosave.getPostData();
			var context = '?page_id=';

			if (data.post_type == 'post') {
				context = '?p=';
			}

			if (data.post_type != 'post' && data.post_type != 'page' ) {
				context = '?post_type=' + data.post_type + '&p=';
			}

			$(window).off( 'beforeunload.edit-post');
			window.location = csAdmin.homeURL + context + data.post_id + '&preview=true&cornerstone=1';

		});

	});

}
},{"./confirm":1}],4:[function(require,module,exports){
module.exports = function($) {

  $(document).ready (function(){

    //
    // Accordion.
    //

    $('.accordion > .toggle').click(function() {

      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active').next().slideUp();
        return;
      }

      $('.accordion > .panel').slideUp();
      $(this).siblings().removeClass('active');
      $(this).addClass('active').next().slideDown();

    });


    //
    // Save button.
    //

    $('#submit').click(function() {
      $(this).addClass('saving').val( csAdmin.l18n('updating') );
    });


    //
    // Meta box toggle.
    //

    postboxes.add_postbox_toggles(pagenow);


    //
    // Color picker
    //

    $('.wp-color-picker').wpColorPicker();
      $('a.wp-color-result').each( function(){
        $( this ).attr('title', $( '.wp-color-picker.cs-picker', $( this ).parent() ).data('title') );
    } );

  });

}
},{}]},{},[2])(2)
});
//# sourceMappingURL=dashboard.map

/* Modules bundled with Browserify */
