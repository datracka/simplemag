(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CS_generator = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.csg = window.csg || {};

(function( $, csg ){

  /**
   * Load templates
   */
  csg.Templates = require('../tmp/templates-generator.js'),

  /**
   * Accessor for precomplied templates
   */
  csg.template = function () {
    return this.Templates[ (arguments.length == 1) ? arguments[0] : arguments.join('/') ];
  },

  /**
   * Localization helper
   */
  csg.l18n = function( key ) {
    return csgData.strings[key] || '';
  }

  /**
   * Load Controls
   */
  csg.Controls = {
    'base': require('./views/controls/base'),
    'textfield': require('./views/controls/text'),
    'textarea': require('./views/controls/text-area'),
    'textarea_html': require('./views/controls/text-area'),
    'dropdown': require('./views/controls/dropdown'),
    'checkbox': require('./views/controls/checkbox'),
    'colorpicker': require('./views/controls/colorpicker'),
    'attach_image': require('./views/controls/image-upload'),
  }

  /**
   * Control Lookup helper
   */
  csg.controlLookup = function( type ) {
    return (csg.Controls[type]) ? csg.Controls[type] : csg.Controls['base'];
  }

  /**
   * Load Models & Views
   */
  var ShortcodeCollection = require('./models/shortcode-collection');
  var ModalView =  require('./views/modal');

  // Controller
  // =============================================================================

  var Controller = function( wrapper ) {



    $(window).load(function(){
    	this.shortcodes = new ShortcodeCollection();
    	this.shortcodes.fetch( {reset: true } );
    }.bind(this));


    $(document).on( 'click', '#cs-insert-shortcode-button', function( e ){
      e.preventDefault();
      this.openModal();
    }.bind(this));

  }

  Controller.prototype.openModal = function() {

  	if ( this.modalView === undefined ) {
  		this.modalView = new ModalView({ collection: this.shortcodes, controller: this });
  	}
  }

  Controller.prototype.deleteModal = function() {
  	this.modalView = undefined;
  }

  exports.Controller = Controller;
  exports.controller = new Controller();

})( jQuery, window.csg );
},{"../tmp/templates-generator.js":20,"./models/shortcode-collection":4,"./views/controls/base":7,"./views/controls/checkbox":8,"./views/controls/colorpicker":9,"./views/controls/dropdown":10,"./views/controls/image-upload":11,"./views/controls/text":13,"./views/controls/text-area":12,"./views/modal":14}],2:[function(require,module,exports){
module.exports = Backbone.Collection.extend( { model: require('./control') } );
},{"./control":3}],3:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  defaults: {
    param_name: 'generic-param',
    heading: 'Generic Control',
    description: '',
    type: 'Generic',
    default_value: "",
    value: null
  }
});
},{}],4:[function(require,module,exports){
var ShortcodeCollection = Backbone.Collection.extend({

  model: require('./shortcode'),
	url: window.csgData.shortcodeCollectionUrl,

  selected: null,

  section: function( section ) {

    bySection = this.filter( function( shortcode ) {
      return shortcode.get('section') === section;
    });

    return new ShortcodeCollection( bySection );
  },

  setSelected: function( shortcode ) {
    this.selected = shortcode;
    this.trigger('new_selection');
  }
});

module.exports = ShortcodeCollection;
},{"./shortcode":5}],5:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	defaults: {
		id: 'generic-shortcode',
		title: 'Generic Shortcode',
		icon: 'icon',
		section: 'Generic',
		description: 'A Shortcode Description',
		params: [],
		demo: ''
	},

  setSelected:function() {
    this.collection.setSelected(this);
  }
});
},{}],6:[function(require,module,exports){
var ControlView = require('./controls/base');

module.exports = Backbone.View.extend({

  className: "csg-modal-controls",

  render: function(){
      this.collection.each( function( control ) {
        this.$el.append( ControlView.makeControl( control.get('type'), { model: control } ).render().$el );
      }, this );
      return this;
  },

});
},{"./controls/base":7}],7:[function(require,module,exports){
module.exports = Backbone.View.extend({

  className: "csg-control",
  template: csg.template('controls/text'),

  renderSuper: function() {
    if (this.model.get('advanced') == true )
      this.$el.addClass('advanced');

    this.$el.html( this.template( this.model.toJSON() ) );

    return this;
  },

  render: function() {
    this.renderSuper();
    this.bindInput();
    return this;
  },

  bindInput: function() {

    var model = this.model;

    model.set( 'data', this.$( '#param-' + model.get('param_name') ).val() );

    this.$( '#param-' + model.get('param_name') ).on('change',function(){
      model.set( 'data', jQuery(this).val() );
    });
  }
},{

  makeControl: function( type, options ) {
    var View = csg.controlLookup( type );
    return new View( options );
  }

});
},{}],8:[function(require,module,exports){
var ControlView = require('./base');

module.exports = ControlView.extend({
  template: csg.template('controls/checkbox'),

  bindInput: function() {

    var model = this.model;

    if (this.$( '#param-' + model.get('param_name') ).prop('checked')) {
      model.set( 'data', this.$( '#param-' + model.get('param_name') ).val() );
    }

    this.$( '#param-' + model.get('param_name') ).on('change',function(){

      if (jQuery(this).prop('checked')) {
        model.set( 'data', jQuery(this).val() );
        return;
      }

      model.unset( 'data' );

    });

  }
});
},{"./base":7}],9:[function(require,module,exports){
var ControlView = require('./base');
module.exports = ControlView.extend({

  template: csg.template('controls/color-picker'),

  render: function() {
    this.renderSuper();

    this.$('.wp-color-picker').wpColorPicker({ change: this.colorChange.bind(this) });

    return this;
  },

  colorChange: function( e, ui) {
    this.model.set('data', ui.color.toString() );
  },

  bindInput: function(){}

});
},{"./base":7}],10:[function(require,module,exports){
var ControlView = require('./base');
module.exports = ControlView.extend({
  template: csg.template('controls/dropdown'),
  initialize: function() {
    this.model.set('selected', this.model.get('default_value') || _(this.model.get('value')).find(function(){ return true; }) );
  }
});
},{"./base":7}],11:[function(require,module,exports){
var ControlView = require('./base');

var ControlImageUploadView = ControlView.extend({

  initialize: function() {
    ControlImageUploadView.createMediaFrame();
  },

  events: {
    'click a.csg-img-control.set'    : 'setImage',
    'click a.csg-img-control.remove' : 'removeImage',
  },

  template: csg.template('controls/image-upload'),

  setImage: function(e) {

    if (e) e.preventDefault();

    var uploader = ControlImageUploadView.uploader;

    uploader.off( 'insert' );
    uploader.on( 'insert', function() {

      data = uploader.state().get( 'selection' ).first().toJSON();

      this.$('a.csg-img-control.set').addClass('hidden');
      this.$('a.csg-img-control.remove').removeClass('hidden');

      this.$('.csg-image-uploader').css({ 'background-image': 'url('+ data.url +')' });
      this.$('input').val(data.url).change();

    }.bind( this ) );

    uploader.open();

  },

  removeImage: function(e) {

    if (e) e.preventDefault();

    this.$('a.csg-img-control.set').removeClass('hidden');
    this.$('a.csg-img-control.remove').addClass('hidden');

    this.$('.csg-image-uploader').css({ 'background-image': 'none' });
    this.$('input').val('');
  }
},{
  // Static methods

  uploader: null,

  createMediaFrame: function() {

    if ( this.uploader ==  null) {
      this.uploader = wp.media({ frame:    'post', state:    'insert', multiple: false });
    }

  }

});

module.exports = ControlImageUploadView;
},{"./base":7}],12:[function(require,module,exports){
var ControlView = require('./base');
module.exports = ControlView.extend({ template: csg.template('controls/text-area') });
},{"./base":7}],13:[function(require,module,exports){
var ControlView = require('./base');
module.exports = ControlView.extend();
},{"./base":7}],14:[function(require,module,exports){
var NavView = require('./nav/main');
var WindowView = require('./window');
var ControlCollection = require('../models/control-collection');

module.exports = Backbone.View.extend({

  id: "csgModal",
  className: "csg",

  template: csg.template('modal'),

  events: {
    "click .csg-modal-close"           : "close" ,
    "click .csg-modal-toggle-advanced" : "toggleAdvanced" ,
    "click #btn-ok"                    : "insertShortcode" ,
  },

  controls: null,

  initialize: function( options ) {
    this.controller = options.controller;

    this.listenTo(this.collection, 'change:completed', this.render);
    this.listenTo(this.collection, 'reset', this.render);
    this.listenTo( this.collection, 'new_selection', this.setupControls );
    this.on('controls_ready', this.renderWindow);
    this.collection.fetch({reset: true});

    this.render();

  },

  render: function() {
    this.$el.html( this.template() );

    this.$('.csg-modal-sidebar').append( new NavView({ collection: this.collection }).render().$el );

    this.renderWindow();

    if (this.getAdvancedState()) {
      this.setAdvancedState( true );
    }
    jQuery( "body" ).append( this.$el ).css( { "overflow" : "hidden" } );
    this.$el.focus();

    jQuery( document ).on( "focusin" , function( e ){
      if ( this.$el[0] !== e.target && !this.$el.has( e.target ).length ) {
        this.$el.focus();
      }
    }.bind(this) );


  },

  setupControls: function() {

    this.controls = new ControlCollection( this.collection.selected.get( 'params' ) );
    this.trigger( 'controls_ready' );
  },

  renderWindow: function() {

    if(this.collection.selected !== null) {
      this.$('#btn-ok').prop( 'disabled',false );
    }

    this.$('.csg-modal-main').html( new WindowView({ collection: this.controls, shortcode: this.collection.selected }).render().$el );
  },

  close: function( e ) {

    if (e) e.preventDefault();

    this.collection.selected = null;
    this.undelegateEvents();

    jQuery( document ).off( "focusin", this.preserveFocus );
    jQuery( "body" ).css( { "overflow" : "auto" } );

    this.remove();

    this.controller.deleteModal();
  },

  toggleAdvanced: function( e ){

    if (e) e.preventDefault();
    this.setAdvancedState( !this.getAdvancedState());
  },

  getAdvancedState: function() {

    if(typeof(Storage) !== "undefined") {
      if (window.localStorage['csg-advanced-mode'] === undefined) {
        window.localStorage['csg-advanced-mode'] = false;
      }
      return (window.localStorage['csg-advanced-mode'] == "true" );

    }

    return (this.$el.hasClass('csg-advanced-enabled'));

  },

  setAdvancedState: function( state ) {

    this.$('.csg-modal-toggle-advanced').removeClass('active');
    this.$el.removeClass('csg-advanced-enabled');

    if (state) {
      this.$('.csg-modal-toggle-advanced').addClass('active');
      this.$el.addClass('csg-advanced-enabled');
    }

    window.localStorage['csg-advanced-mode'] = (state);

  },

  insertShortcode: function(){

    //
    // Summarize set controls
    //

    var atts = {};
    var content = '';
    this.controls.each(function(control){

      var data = control.get('data'),
          name = control.get('param_name');

      if ( data !== undefined && data != '' ) {

        if ( name == 'content' ) {
          content = data;
          return;
        }

        atts[name] = data;

      }
    });

    //
    // Parse into shortcode syntax
    //

    var tag = this.collection.selected.get( 'id' );

    output = '[' + tag;
    closingTag = '';

    _(atts).each(function(value, name){
      output += ' '+name + '="' + value +'"';
    });

    output += ']';

    if (content) output += content;

    if (content || this.collection.selected.get( 'content_element' ) ) {

      closingTag = '[/' + tag + ']';
      output += closingTag;
    }

    console.log( "Inserting Shortcode: " + output );
    window.wp.media.editor.insert( output );
    this.close();
  }

});
},{"../models/control-collection":2,"./nav/main":16,"./window":19}],15:[function(require,module,exports){
module.exports = Backbone.View.extend({

  tagName: "li",
  events: {
    "click" : "click"
  },

  className: "csg-nav-item",

  render: function() {
    this.$el.html( jQuery('<a href="#">' + this.model.get('title') + '</a>') );
    return this;
  },

  click: function() { this.model.setSelected(); } //this.$el.addClass( 'active' ); }

});
},{}],16:[function(require,module,exports){
var NavSectionView = require('./section');

module.exports = Backbone.View.extend({

  className: "csg-navigation",

  events: {
    "click li.csg-nav-item a" : "click"
  },

  render: function(){
    _(window.csgData.sectionNames).each(function(sectionName){

      this.$el.append('<h3>' + sectionName + '</h3>');
      this.$el.append( new NavSectionView( { collection: this.collection.section( sectionName ) } ).render().$el );

    }.bind(this));

    this.$el.accordion({ heightStyle: "content" });
    //this.$('.ui-accordion-header').hoverIntent( function() { $(this).click(); });

    return this;

  },

  click: function( e ) {
    this.$('li.csg-nav-item a').removeClass( 'active' );
    this.$(e.target).addClass('active');
  }

});
},{"./section":17}],17:[function(require,module,exports){
var NavItemView = require('./item');
module.exports = Backbone.View.extend({

  className: "csg-nav-section",

  render: function(){
      this.$el.append(jQuery('<ul></ul>'));
      this.collection.each( function( shortcode ) {
        this.$('ul').append( new NavItemView({model: shortcode}).render().$el );
      }, this );
      return this;
  },

});
},{"./item":15}],18:[function(require,module,exports){
module.exports = Backbone.View.extend({

  className: "csg-preview",
  template: csg.template('preview'),

  render: function(){
    this.$el.html( this.template( _.extend( this.model.toJSON(), this.data ) ) );
    return this;
  }
});
},{}],19:[function(require,module,exports){
var ControlGroupView = require('./control-group');
var PreviewView = require('./preview');

module.exports = Backbone.View.extend({

  className: "csg-modal-window",
  template: csg.template('blank-state'),

  initialize: function( options ) {
    this.shortcode = options.shortcode;
  },

  render: function() {

    if (this.shortcode == null) {
      this.$el.html( this.template() );
      return this;
    }

    this.$el.append( new ControlGroupView({collection: this.collection }).render().$el );
    this.$el.append( new PreviewView( { model: this.shortcode } ).render().$el );

    return this;

  }
});
},{"./control-group":6,"./preview":18}],20:[function(require,module,exports){
var templates={};templates['blank-state']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/blank-state ;
__p += '\n<div class="csg-intro">\n  <p>';
 print(csg.l18n('blank-window')); ;
__p += '</p>\n</div>';

}
return __p
};templates['modal']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/modal ;
__p += '\n<div class="csg-modal">\n  <header>\n    <h1>';
 print(csg.l18n('modal-title')); ;
__p += '</h1>\n    <a class="csg-modal-btn csg-modal-toggle-advanced" href="#">\n      <span class="dashicons dashicons-media-code"></span>\n      <span class="tip">';
 print(csg.l18n('modal-toggle-advanced')); ;
__p += '</span>\n    </a>\n    <a class="csg-modal-btn csg-modal-close" href="#">\n      <span class="dashicons dashicons-no"></span>\n    </a>\n  </header>\n  <div class="csg-modal-content">\n    <section class="csg-modal-sidebar"></section>\n    <section class="csg-modal-main" role="main"></section>\n  </div>\n  <footer>\n    <button id="btn-ok" disabled class="button button-primary button-large">';
 print(csg.l18n('modal-insert-shortcode')); ;
__p += '</button>\n  </footer>\n</div>\n<div class="csg-modal-backdrop">&nbsp;</div>';

}
return __p
};templates['preview']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/preview ;
__p += '\n<h2 class="csg-preview-title">';
 print(csg.l18n('preview-title')); ;
__p += '</h2>\n<div class="csg-preview-content">\n  <p>';
 print(csgData.previewContentBefore) ;
__p += '</p>\n  <p><a class="button" href="' +
((__t = ( demo )) == null ? '' : __t) +
'" target="_blank">';
 print(csg.l18n('preview-button')); ;
__p += '</a></p>\n  <p>';
 print(csgData.previewContentAfter) ;
__p += '</p>\n</div>';

}
return __p
};templates['controls/checkbox']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/controls/checkbox ;
__p += '\n<label for="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'"><strong>' +
((__t = ( heading )) == null ? '' : __t) +
'</strong><span>' +
((__t = ( description )) == null ? '' : __t) +
'</span></label>\n<input type="checkbox" id="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" name="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" value="' +
((__t = ( value )) == null ? '' : __t) +
'" />';

}
return __p
};templates['controls/color-picker']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/controls/color-picker ;
__p += '\n<label for="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'"><strong>' +
((__t = ( heading )) == null ? '' : __t) +
'</strong><span>' +
((__t = ( description )) == null ? '' : __t) +
'</span></label>\n<input type="text" name="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" id="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" class="wp-color-picker" value="" size="30" />';

}
return __p
};templates['controls/dropdown']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/controls/dropdown ;
__p += '\n<label for="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'"><strong>' +
((__t = ( heading )) == null ? '' : __t) +
'</strong><span>' +
((__t = ( description )) == null ? '' : __t) +
'</span></label>\n<select name="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" id="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'">\n  ';
 _.each(value, function(option, name) { ;
__p += '\n    <option value="';
 print( option.value || option ) ;
__p += '">';
 print( (option.value) ? name : option) ;
__p += ' </option>\n  ';
 }); ;
__p += '\n</select>';

}
return __p
};templates['controls/image-upload']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/controls/image-upload ;
__p += '\n<label for="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'"><strong>' +
((__t = ( heading )) == null ? '' : __t) +
'</strong><span>' +
((__t = ( description )) == null ? '' : __t) +
'</span></label>\n<div class="csg-image-uploader">\n  <a href="#" class="csg-img-control set"><span class="dashicons dashicons-plus"></span></a>\n  <a href="#" class="csg-img-control remove hidden"><span class="dashicons dashicons-no"></span></a>\n</div>\n<input type="hidden" name="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" id="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" />';

}
return __p
};templates['controls/text-area']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/controls/text-area ;
__p += '\n<label for="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'"><strong>' +
((__t = ( heading )) == null ? '' : __t) +
'</strong><span>' +
((__t = ( description )) == null ? '' : __t) +
'</span></label>\n<textarea name="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" id="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" rows="8" cols="5"></textarea>';

}
return __p
};templates['controls/text']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // generator/controls/text ;
__p += '\n<label for="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'"><strong>' +
((__t = ( heading )) == null ? '' : __t) +
'</strong><span>' +
((__t = ( description )) == null ? '' : __t) +
'</span></label>\n<input type="text" name="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" id="param-' +
((__t = ( param_name )) == null ? '' : __t) +
'" value="' +
((__t = ( value )) == null ? '' : __t) +
'" size="30" />';

}
return __p
};module.exports=templates;
},{}]},{},[1])(1)
});
//# sourceMappingURL=generator.map

/* Modules bundled with Browserify */
