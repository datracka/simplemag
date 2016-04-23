(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CS_core = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App = {

	components: {},
	loadedComponentGroups: [],
	RegisteredComponents: {},

	/**
   * Shim Backbone.Radio instead of Wreqr
   */
  _initChannel: function() {
    this.channelName = 'cs';
    this.channel = Backbone.Radio.channel( this.channelName );
  },

  initialize: function() {

  	this.events = Backbone.Radio.channel( 'cs:event' )

    /**
     * Debug Mode
     */
    if (this.Config.debug == 'true') {
      Backbone.Radio.DEBUG = true;
    }

    this.bootTime = new Date().getTime();
    this.registerComponents( require( './components') );
  },

  onBeforeStart: function( options ) {
  	this.loadComponents( 'common' );
  },

  onStart: function() {
  	jQuery( _.bind( function(){
  		this.loadComponents( 'start' );
  	}, this ) );
  },

  /**
   * Load a group of components
   */
  loadComponents: function( group ) {
  	if (!this.Registry[group]) return;

  	_.each( this.Registry[group], function( item ) {
  		this.loadComponent( item )
  	}, this );

  },

  /**
   * Load an individual component
   */
  loadComponent: function( name ) {

  	if ( this.components[name] )
  		return this.components[name];

  	this.components[name] = new (this.RegisteredComponents[name])( { cs: this } );

  },

  /**
   * Component accessor method. Used components to access each other.
   */
  component: function( name ) {
  	if ( this.components[name] )
  		return this.components[name];
  	return {};
  },

  registerComponents: function ( components ) {
  	this.RegisteredComponents = _.extend( components, this.RegisteredComponents );
  },

  updateConfig: function ( updates ) {
  	this.Config = _.deepExtend( updates, this.Config );
  },

  updateRegistry: function ( updates ) {

  	_.each( updates, function( group, key ) {

  		var previous = this.Registry[key] || [];
  		this.Registry[key] = _.unique( _.union( previous, group ) );

  	}, this );

  },

  config: function ( key ) {
  	return (this.Config[key]) ? this.Config[key] : null;
  },

  debug: function() {
  	return ( this.config('debug') == 'true' );
  }

}

_.extend( App, require('./modules/cs') );
App = Cornerstone.Mn.Application.extend( App );

module.exports = function( config, registry ){
  ( window.cs = new App( { Config: config, Registry: registry } ) ).start({});
}
},{"./components":11,"./modules/cs":24}],2:[function(require,module,exports){
module.exports = Backbone.Collection.extend({
	model: require('../models/control')
});
},{"../models/control":14}],3:[function(require,module,exports){
module.exports = Backbone.Collection.extend({
	model: require('../models/element-definition')
});
},{"../models/element-definition":15}],4:[function(require,module,exports){
var ProxyableCollection = require('./proxyable');
module.exports = ProxyableCollection.extend({
	model: require('../models/element'),

	comparator: function( m ) {
    return m.get('rank');
  },

  constructor: function( models, options ) {

    this.on( 'update:position', this.updatePosition );
    Backbone.Collection.apply( this, arguments );

    this.on( 'add', this.pageDirty )
    this.on( 'remove', this.pageDirty )
    this.on( 'sort', this.pageDirty )

  },

	create: function( atts, options, pos ) {

		if (!atts._type) {
			cs.warn( 'Elements can not be created without a type', atts );
		}

		// var definition = cs.elementLibrary.lookup( atts._type );
		// atts = _.defaults( atts, definition.getDefaults() );

    var model = new this.model( atts, options );
    this.updatePosition( model, ( _.isFinite( pos ) ) ? pos : this.length );

    return model;
  },

  pageDirty: function() {
    cs.channel.trigger( 'page:unsaved' );
  },

  updatePosition: function( model, newIndex ) {

		this.remove(model);

    // Items BEFORE keep their index,
    // Items AFTER have their index incremented
    this.each(function (model, index) {
      var rank = index;
      if (index >= newIndex)
        rank += 1;
      model.set('rank', rank);
    });

    model.set('rank', newIndex);
    this.add(model, {at: newIndex});
    this.sort();

    this.each(function(item){
      item.trigger('position:updated');
    })
  },

});
},{"../models/element":16,"./proxyable":6}],5:[function(require,module,exports){
module.exports = {
	Proxyable : require('./proxyable'),
	Element : require('./element'),
	ElementDefinition : require('./element-definition'),
	Control : require('./control'),
	Template : require('./template'),
	Setting : require('./setting'),
}
},{"./control":2,"./element":4,"./element-definition":3,"./proxyable":6,"./setting":7,"./template":8}],6:[function(require,module,exports){
var ProxyableCollection = Backbone.Collection.extend({

	model: require('../models/proxyable'),

	toProxy: function() {
		var collection = new Backbone.Collection;
		this.each( function( item ) {
			var defaults = item.getDefaults();
			collection.add( new (item.proxyClass)( _.extend( defaults, item.proxyData() ), { source: item, defaults: defaults } ) );
		})
		return collection;
	},

});

ProxyableCollection.prototype.sync = function() { return null; };
ProxyableCollection.prototype.fetch = function() { return null; };
ProxyableCollection.prototype.save = function() { return null; };
module.exports = ProxyableCollection;
},{"../models/proxyable":18}],7:[function(require,module,exports){
var ProxyableCollection = require('./proxyable');
module.exports = ProxyableCollection.extend({
	model: require('../models/setting'),
});
},{"../models/setting":19,"./proxyable":6}],8:[function(require,module,exports){
var TemplateCollection = Backbone.Collection.extend({
  model: require('../models/template'),
  section: function( section ) {

    bySection = this.filter( function( shortcode ) {
      return shortcode.get('section') === section;
    });

    return new TemplateCollection( bySection );
  },
});
module.exports = TemplateCollection;
},{"../models/template":20}],9:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		cs.elements = Backbone.Radio.channel( 'cs:elements' );

    this.listenTo( cs.elements, 'delete', this.deleteEl );
    this.listenTo( cs.elements, 'erase', this.erase );
    this.listenTo( cs.elements, 'reset', this.resetEl );
    this.listenTo( cs.elements, 'add:item', this.add );
    this.listenTo( cs.elements, 'duplicate', this.duplicate );

	},

	deleteEl: function( options ) {

		if ( !options.model ) return;

    options.model.destroy({
      success: function() {
        if (options.success)
          _.defer( options.success );
      }
    });

	},

	resetEl: function( options ) {
		if ( !options.model ) return;

		var type = options.model.get('_type');

		options.model.collection.create( { type: '_type' }, {}, options.model.collection.indexOf( options.model ) + 1 );
		options.model.destroy();

	},

	erase: function ( options ) {

		if ( !options.model ) return;

		if ( !_.isEmpty( options.model.elements ) ) {
			options.model.elements.reset();
		}

		if ( options.success )
      _.defer( options.success );

	},

	add: function( type, root, title, title_field ) {

		if ( !type || !root.elements ) return;

		var newEl = { _type: type };
		if ( title ) {
			var title_field = title_field || 'title';
			newEl[title_field] = title.replace('%s', ( root.elements.length + 1 ) )
		}

		root.elements.create( newEl );

	},

	duplicate: function( model, title_field ) {

		model.updateChildData();
    var clone = model.toJSON();
    var title_field = title_field || 'title';

    if ( clone[title_field] )
      clone[title_field] = cs.l18n('sortable-duplicate').replace('%s', clone[title_field] );

    var newModel = model.collection.create( clone, _.clone( model.options ), model.collection.indexOf( model ) + 1 );
    newModel.shadow = model.cid

	}

});
},{}],10:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		this.library = new Cornerstone.Collections.ElementDefinition();
		var models = this.cs.config( 'elementDefinitions' );

		if ( _.isArray( models ) )
			this.library.add( models );

		this.cs.elementLibrary = this;

	},

	lookup: function( type ) {

		var definition = this.library.findWhere( { name: type } );

		if ( definition )
			return definition;

		return this.library.findWhere( { name: 'undefined' } );

	},

	all: function() {
		return new Cornerstone.Collections.ElementDefinition( this.library.models );
	}

});
},{}],11:[function(require,module,exports){
module.exports = {
	'element-library': require( './element-library' ),
	'element-handler': require( './element-handler' )
}
},{"./element-handler":9,"./element-library":10}],12:[function(require,module,exports){
require('./modules/bootstrap');

require('./app-mk2')( csCoreData, {
	common: [ 'element-library', 'element-handler' ]
});
},{"./app-mk2":1,"./modules/bootstrap":22}],13:[function(require,module,exports){
var ControlProxy = Backbone.Model.extend({

	initialize: function( attributes, options ) {

		this.source = options.source || null;

		var defaults = options.defaults || null;


		if ( this.source ) {
			this.elements = options.source.elements || null;
			this.definition = options.source.definition || null;
		}

		this.listenTo( this.source, 'children:updated', function() {
			this.trigger( 'children:updated' );
		});

		this.listenTo( this.source, 'position:updated', function() {
			this.trigger( 'position:updated' );
		});

		this.listenTo( this.source, 'remove destroy', function() {
			this.destroy();
		});

	},

	getIndex: function() {
		return this.source.getIndex()
	},

	getSource: function() {
		return this.source;
	},

	getSourceParent: function() {
		return this.source.collection.parent;
	},

	getSourceGrandParent: function() {
		return this.source.collection.parent.collection.parent;
	},

	refresh: function() {
		this.set( _.clone(this.source.attributes), { silent: true });
	}

});

ControlProxy.prototype.sync = function() { return null; };
ControlProxy.prototype.fetch = function() { return null; };
ControlProxy.prototype.save = function() { return null; };
module.exports = ControlProxy;
},{}],14:[function(require,module,exports){
module.exports =  Backbone.Model.extend({

	defaults: {
		name: null,
		key: null,
		type: null,
		ui: {},
		options: {},
		context: 'all',
		condition: {}
	},

	initialize: function() {
		this.proxy = null;
		if ( _.isNull( this.get('key') ) )
			this.set('key', this.get('name') );
	},

	setProxy: function( proxy ) {
		this.proxy = proxy;
		this.trigger( 'set:proxy' );
	}

});
},{}],15:[function(require,module,exports){
module.exports =  Backbone.Model.extend({
	defaults: {
		name: null,
		ui: null,
		flags: null,
		active: true,
		base_defaults: {},
		defaults: {},
		controls: []
	},

	getDefaults: function( context ) {
		return this.get( ( context ) ? context + '_defaults' : 'defaults' );
	},

	getControls: function( context ) {

		var context = context || 'all';

		return _.filter( this.get( 'controls' ) , function( control ) {
			if ( context == 'all' && control.context.indexOf("_") !== 0 ) return true; // Exclude private context groups from "all"
			return ( control.context == context );
		}, this );

	},


});
},{}],16:[function(require,module,exports){
var Proxyable = require('./proxyable');

module.exports = Proxyable.extend({

	idAttribute: '_elID',

	proxyClass: require('./control-proxy'),
	proxyExclusions: [ 'elements' ],

	defaults: {
		_type: 'undefined', // Reference to Element Library definition
	},

	initialize: function ( options ) {

		var localElements, defaults, elements, layoutDefaults;

		this.definition = this.getDefinition();

		// Backfill layout defaults
		if ( ( layoutDefaults = this.definition.get( '_layout_defaults' ) ) ) {
			_.each( layoutDefaults, function( value, key ) {
				if ( !this.has( key ) )	this.set( key, value );
			}, this );
		}

		// Initialize children
		this.elements = new Cornerstone.Collections.Element();
		this.elements.parent = this;

		localElements = this.get( 'elements' );
		defaults = this.definition.get('defaults');

		// Checking if undefined allows defaults to come through only if the
		// elements are not intentionall empty
		if ( _.isUndefined( localElements ) ) {
			elements = ( defaults.elements ) ? defaults.elements : [];
		} else {
			elements = localElements;
		}

		if ( elements && !_.isEmpty( elements ) )
			this.elements.add( elements );

		this.listenTo( this.elements, 'update', function() {
			this.trigger( 'children:updated' );
		});

		// Notify our collection when an attribute changes
		this.on('change', function( model, options ){
			if ( this.collection ) this.collection.trigger( 'model:change', model, options );
		});

		this.on( 'update:child:data', this.updateChildData );

		this.on( 'destroy', function() {
			this.elements.invoke( 'destroy' );
		} );

	},

	getDefaults: function() {
		return _.clone( this.definition.getDefaults() );
	},

	updateChildData: function() {

		if ( this.elements.isEmpty() ) {
			this.set('elements', [] );
			return;
		}

		this.elements.invoke('updateChildData');
		this.set('elements', this.elements.toJSON() );

	},

	getDefinition: function() {
		return cs.elementLibrary.lookup( this.get('_type') );
	},

	eraseChildren: function() {
		if ( this.elements.isEmpty() ) return;
		this.elements.invoke( 'destroy' );
		this.updateChildData();
	},

	getIndex: function() {
		return this.collection.indexOf( this );
	},

	toJSON: function() {
    return _.omit( Backbone.Model.prototype.toJSON.apply( this, arguments ), [ 'rank' ] );
	}

});
},{"./control-proxy":13,"./proxyable":18}],17:[function(require,module,exports){
var Models = {
	Element : require('./element'),
	ElementDefinition : require('./element-definition'),
	Control : require('./control'),
	Setting : require('./setting'),
	Proxyable : require('./proxyable'),
	Template: require('./template'),
	ControlProxy : require('./control-proxy'),
}
module.exports = Models;
},{"./control":14,"./control-proxy":13,"./element":16,"./element-definition":15,"./proxyable":18,"./setting":19,"./template":20}],18:[function(require,module,exports){
var Proxyable = Backbone.Model.extend({

	proxyClass: Backbone.Model,
	proxyExclusions: [],

	/**
	 * Get a JSON object including this elements data values with defaults applied
	 */
	proxyData: function() {
		return _.omit( this.attributes, this.proxyExclusions );
	},

	toProxy: function() {
		var defaults = this.getDefaults();
		return new (this.proxyClass)( _.extend( defaults, this.proxyData() ), { source: this, defaults: defaults } );
	},

	/**
	 * Process an update recieved by a proxy model.
	 * If a change is identical to one of our defaults, unset it so it isn't on the model
	 */
	proxyUpdate: function( update ) {
		var defaults = this.getDefaults();
		_.each( update, function( value, key ) {
			if ( key == 'disabled' ) return;
			if ( _.isEqual( defaults[key], value ) ) {
				this.unset(key);
			} else {
				this.set( key, value );
			}
		}, this );
	},

	getDefaults: function () {
		return {};
	},

});

Proxyable.prototype.sync = function() { return null; };
Proxyable.prototype.fetch = function() { return null; };
Proxyable.prototype.save = function() { return null; };
module.exports = Proxyable;
},{}],19:[function(require,module,exports){
var Proxyable = require('./proxyable');

module.exports = Proxyable.extend({

	idAttribute: '_sID',

	proxyClass: require('./control-proxy'),
	proxyExclusions: [ 'elements' ],

	defaults: {
		_section: 'undefined', // Reference to Element Library definition
	},

	initialize: function ( options ) {

		var localElements, defaults, elements;

		this.section = this.getSection();

		// Initialize children
		this.elements = new Cornerstone.Collections.Element();
		this.elements.parent = this;

		localElements = this.get( 'elements' );
		defaults = this.section.get('defaults');

		if ( _.isEmpty( localElements ) ) {
			elements = ( defaults.elements ) ? defaults.elements : [];
		} else {
			elements = localElements;
		}

		if ( elements && !_.isEmpty( elements ) )
			this.elements.add( elements );

		this.listenTo( this.elements, 'update', function() {
			this.trigger( 'children:updated' );
		});

		// Notify our collection when an attribute changes
		this.on('change', function( model, options ){
			if ( this.collection ) this.collection.trigger( 'model:change', model, options );
		});

		this.on( 'update:child:data', this.updateChildData );
	},

	getDefaults: function() {
		return _.clone( this.section.get('defaults') );
	},

	updateChildData: function() {

		if ( this.elements.isEmpty() ) {
			this.set('elements', [] );
			return;
		}

		this.elements.invoke('updateChildData');
		this.set('elements', this.elements.toJSON() );

	},

	getSection: function() {
		return cs.settingSections.findWhere( { name: this.get('_section') });
	},

	eraseChildren: function() {
		if ( this.elements.isEmpty() ) return;
		this.elements.invoke( 'destroy' );
		this.updateChildData();
	},

	getIndex: function() {
		return this.collection.indexOf( this );
	},

	toJSON: function() {
    return _.omit( Backbone.Model.prototype.toJSON.apply( this, arguments ), [ 'rank' ] );
	}

});
},{"./control-proxy":13,"./proxyable":18}],20:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  defaults: {
    title: 'Generic Block',
    section: 'user-blocks',
    type: 'block',
    elements: []
  }
});
},{}],21:[function(require,module,exports){
/**
 * Post JSON function
 */
module.exports = function( action, data, opts ) {

	var urlBase = ( cs.fallbackAjax ) ? 'fallbackAjaxUrl' : 'ajaxUrl';
	var json = JSON.stringify( data || {} );
	var postData;
	if (cs.config('useLegacyAjax')) {
		postData = { data: Cornerstone.Vendor.Base64.encode( json ) }
	} else {
		postData = json;
	}

	var options = _.defaults( opts || {}, {
		type:    'POST',
		url:     cs.config(urlBase) + '?action=' + action,
		context: this,
		data: postData,
		dataType: 'json'
	});

	return Backbone.$.Deferred( function( deferred ) {
		// Transfer callbacks.
		if ( options.always )
			deferred.always( options.always );
		if ( options.success )
			deferred.done( options.success );
		if ( options.error )
			deferred.fail( options.error );

		delete options.always;
		delete options.success;
		delete options.error;

		var errorRecovery = function() {

			if ( 'fallbackAjaxUrl' == urlBase ) {

				if ( cs.fallbackAjax ) {
					// Switch to legacy AJAX and start over...
					Backbone.$.ajax( {
						type:    'POST',
						url:     cs.config('fallbackAjaxUrl') + '?action=cs_legacy_ajax',
						data: { enable: true },
						complete: function() {
							cs.fallbackAjax = false;
							window.location = window.location;
						}
					} );
				} else {
					console.log( 'Unhandled AJAX error.' );
				}

			} else {
				cs.global.trigger( 'ajax:fallback', true );
				cs.fallbackAjax = true;
			}
		}

		// Use with PHP's wp_send_json_success() and wp_send_json_error()
		Backbone.$.ajax( options ).done( function( response ) {
			if ( ( 'true' != arguments[2].getResponseHeader('Cornerstone') && 'ajaxUrl' == urlBase ) || !response || !response.success ) {
				errorRecovery();
			}
			if ( _.isObject( response ) && ! _.isUndefined( response.success ) )
				deferred[ response.success ? 'resolveWith' : 'rejectWith' ]( this, [response.data, options]	);
			else
				deferred.rejectWith( this, [response ] );
		}).fail( function( response ) {
			errorRecovery();
			deferred.rejectWith( this, arguments );
		});
	}).promise();
}
},{}],22:[function(require,module,exports){
window.Cornerstone = window.CS = {};

var _ = require('./../../vendor/underscore-shim.js');

require('../../vendor/string_score'); // affect global scope
require('backbone.radio');
require('backbone.stickit');

_.mixin( { deepExtend: require('underscore-deep-extend')(_) } );

// Load vendor dependencies
Cornerstone.Vendor = {
	Marionette: require('backbone.marionette'),
	FileSaver: require('../../vendor/FileSaver'),
	Color: require('../../vendor/color'),
	Base64: require('../../vendor/base64')
}

Cornerstone.Mn = Cornerstone.Vendor.Marionette;

Cornerstone.Component = require('./component-base')
Cornerstone.Models = require('../models');
Cornerstone.Collections = require('../collections');

Cornerstone.InspectionSupervisor = require( './inspection-supervisor' );
Cornerstone.Post = require('./post');
Cornerstone.serial = require('./serial');

module.exports = Cornerstone;
},{"../../vendor/FileSaver":28,"../../vendor/base64":30,"../../vendor/color":31,"../../vendor/string_score":33,"../collections":5,"../models":17,"./../../vendor/underscore-shim.js":34,"./component-base":23,"./inspection-supervisor":25,"./post":26,"./serial":27,"backbone.marionette":36,"backbone.radio":37,"backbone.stickit":38,"underscore-deep-extend":40}],23:[function(require,module,exports){
module.exports = Cornerstone.Mn.Object.extend({
	constructor: function(options) {
		this.options = options || {};
    this.cs = this.getOption('cs');
    Cornerstone.Mn.Object.call(this, options);
	}
});
},{}],24:[function(require,module,exports){
module.exports = {

	ajax: require('./ajax'),

	/**
   * Template Accessor
   * Usage:  cs.template('path/to/template');
   *         cs.template('path','to','template');
   */
  template: function () {
    return this.Templates[ (arguments.length == 1) ? arguments[0] : arguments.join('/') ];
  },

  /**
   * Icon Accessor
   * Usage:  cs.icon('path/to/icon');
   *         cs.icon('path','to','icon');
   */
  icon: function () {
    var key = (arguments.length == 1) ? arguments[0] : arguments.join('/');
    return (this.Icons[ key ]) ? this.Icons[ key ]() : ( key.indexOf("element-") == 0 ) ? this.Icons[ 'element-custom' ]() : '<i class="cs-icon fallback" data-cs-icon="' + this.fontIcon() + '"><!-- icon '+ key +' not found--></i>';
  },

  /**
   * Get an icon from a font awesome icon name
   */
  fontIcon: function() {
    return String.fromCharCode("0x" + this.fontIconLookup(arguments[0] || undefined) ); //return  '&#x' + this.fontIconLookup( arguments[0] || undefined ) + ';';
  },

  /**
   * Get a unicode value from a Font Awesome icon name
   * @return {[type]} [description]
   */
  fontIconLookup: function() {
    var def = 'spinner';
    var key = arguments[0] || def;
    return (this.Config.fontAwesome[ key ]) ? this.Config.fontAwesome[ key ] : this.Config.fontAwesome[ def ];
  },

	/**
   * Localization helper
   */
  l18n: function( key ) {
    return this.Config.strings[key] || '';
  },

	log: function() {
    if (this.Config.debug == 'true')
      console.log.apply( console, arguments );
  },

  warn: function() {
    if (this.Config.debug == 'true') {
      console.warn.apply( console, arguments );
      console.trace();
    }
  },

  controlLookup: function ( id ) {
    return Cornerstone.ControlViews[id] || Cornerstone.ControlViews.Base;
  },

}
},{"./ajax":21}],25:[function(require,module,exports){
module.exports = Cornerstone.Mn.Object.extend({

	initialize: function( items ) {

		this.controls = new Cornerstone.Collections.Control();
		this.reset();

		if ( !items ) return;

		if (items.length) {
			_.each( items, function( item ) {
				this.source( item );
			}, this )
		} else {
			this.source( items ); //singular
		}

		this.rebuildControls();


	},

	source: function( item ) {

		// Ensure item is ready to go
		if (!item || !item.name || !item.source || !item.controls ) return;

		if ( !this.groups[item.name] )
			this.groups[item.name] = { controls: new Cornerstone.Collections.Control() };
		var group = this.groups[item.name];


		// Define our group with it's own proxy model and controls
		group.source = item.source
		group.proxy  = item.source.toProxy(),
		group.controls.reset();
		this.groups[item.name] = group;

		// Propogate changes to source model
		this.listenTo( group.proxy, 'change', function( model, options ) {
			group.source.proxyUpdate( model.changed );
		} );

		this.listenTo( group.proxy, 'reset:key', function( key ) {
			group.source.unset( key );
		} );

		this.listenTo( group.controls, 'add', function( model, collection) {
			model.setProxy( group.proxy );
		} );

		this.listenTo( group.controls, 'reset', function( collection ) {
			collection.invoke( 'setProxy', group.proxy );
		} );

		// Create controls from their provided definitions.
		group.controls.add( item.controls );

	},

	reset: function() {

		this.groups = {};
		this.controls.reset();

	},

	rebuildControls: function() {

		this.controls.reset();
		// Add these controls to our master control list
		_.each( this.groups, function( group ) {
				this.controls.add( group.controls.models );
		}, this );

	}

});
},{}],26:[function(require,module,exports){
module.exports = Cornerstone.Mn.Object.extend({

	initialize: function( options ) {

		this.data = new Cornerstone.Models.Element();

		if ( options && options.post_id ) {
			this.data.set( 'post_id', options.post_id );
			if (options.elements)
				this.data.elements.add( options.elements );
		}

	},

	elements: function() {
		return this.data.elements;
	},

	set: function( key, value ) {
		if ( this[key] )
			return this[key] = value;
		return this.data.set( key, value );
	},

	get: function( key ) {
		if ( this[key] )
			return this[key];
		return this.data.get(key);
	},

	toJSON: function() {

		this.data.elements.invoke('updateChildData');
		var data = this.data.toJSON();
		data.elements = this.data.elements.toJSON()
		return data;
	}

});
},{}],27:[function(require,module,exports){

module.exports = function(tasks) {

	var $ = require('./../../vendor/jquery-shim.js');

  var promise;

  _.each(tasks, function (task) {

     var resolver = function () {

       var deffered = $.Deferred();
       task(function() {
         deffered.resolve.apply( this, arguments );
       });
      return deffered.promise();
    };

    if (!promise) {
      promise = resolver();
    } else {
      promise = promise.then(resolver);
    }

  });

  return promise;
}
},{"./../../vendor/jquery-shim.js":32}],28:[function(require,module,exports){
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20150716
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
  "use strict";
  // IE <10 is explicitly unsupported
  if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  var
      doc = view.document
      // only get URL when necessary in case Blob.js hasn't overridden it yet
    , get_URL = function() {
      return view.URL || view.webkitURL || view;
    }
    , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
    , can_use_save_link = "download" in save_link
    , click = function(node) {
      var event = new MouseEvent("click");
      node.dispatchEvent(event);
    }
    , webkit_req_fs = view.webkitRequestFileSystem
    , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
    , throw_outside = function(ex) {
      (view.setImmediate || view.setTimeout)(function() {
        throw ex;
      }, 0);
    }
    , force_saveable_type = "application/octet-stream"
    , fs_min_size = 0
    // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
    // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
    // for the reasoning behind the timeout and revocation flow
    , arbitrary_revoke_timeout = 500 // in ms
    , revoke = function(file) {
      var revoker = function() {
        if (typeof file === "string") { // file is an object URL
          get_URL().revokeObjectURL(file);
        } else { // file is a File
          file.remove();
        }
      };
      if (view.chrome) {
        revoker();
      } else {
        setTimeout(revoker, arbitrary_revoke_timeout);
      }
    }
    , dispatch = function(filesaver, event_types, event) {
      event_types = [].concat(event_types);
      var i = event_types.length;
      while (i--) {
        var listener = filesaver["on" + event_types[i]];
        if (typeof listener === "function") {
          try {
            listener.call(filesaver, event || filesaver);
          } catch (ex) {
            throw_outside(ex);
          }
        }
      }
    }
    , auto_bom = function(blob) {
      // prepend BOM for UTF-8 XML and text/* types (including HTML)
      if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob(["\ufeff", blob], {type: blob.type});
      }
      return blob;
    }
    , FileSaver = function(blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      // First try a.download, then web filesystem, then object URLs
      var
          filesaver = this
        , type = blob.type
        , blob_changed = false
        , object_url
        , target_view
        , dispatch_all = function() {
          dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        , fs_error = function() {
          // don't create more object URLs than needed
          if (blob_changed || !object_url) {
            object_url = get_URL().createObjectURL(blob);
          }
          if (target_view) {
            target_view.location.href = object_url;
          } else {
            var new_tab = view.open(object_url, "_blank");
            if (new_tab == undefined && typeof safari !== "undefined") {
              //Apple do not allow window.open, see http://bit.ly/1kZffRI
              view.location.href = object_url
            }
          }
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
          revoke(object_url);
        }
        , abortable = function(func) {
          return function() {
            if (filesaver.readyState !== filesaver.DONE) {
              return func.apply(this, arguments);
            }
          };
        }
        , create_if_not_found = {create: true, exclusive: false}
        , slice
      ;
      filesaver.readyState = filesaver.INIT;
      if (!name) {
        name = "download";
      }
      if (can_use_save_link) {
        object_url = get_URL().createObjectURL(blob);
        save_link.href = object_url;
        save_link.download = name;
        setTimeout(function() {
          click(save_link);
          dispatch_all();
          revoke(object_url);
          filesaver.readyState = filesaver.DONE;
        });
        return;
      }
      // Object and web filesystem URLs have a problem saving in Google Chrome when
      // viewed in a tab, so I force save with application/octet-stream
      // http://code.google.com/p/chromium/issues/detail?id=91158
      // Update: Google errantly closed 91158, I submitted it again:
      // https://code.google.com/p/chromium/issues/detail?id=389642
      if (view.chrome && type && type !== force_saveable_type) {
        slice = blob.slice || blob.webkitSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
        blob_changed = true;
      }
      // Since I can't be sure that the guessed media type will trigger a download
      // in WebKit, I append .download to the filename.
      // https://bugs.webkit.org/show_bug.cgi?id=65440
      if (webkit_req_fs && name !== "download") {
        name += ".download";
      }
      if (type === force_saveable_type || webkit_req_fs) {
        target_view = view;
      }
      if (!req_fs) {
        fs_error();
        return;
      }
      fs_min_size += blob.size;
      req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
        fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
          var save = function() {
            dir.getFile(name, create_if_not_found, abortable(function(file) {
              file.createWriter(abortable(function(writer) {
                writer.onwriteend = function(event) {
                  target_view.location.href = file.toURL();
                  filesaver.readyState = filesaver.DONE;
                  dispatch(filesaver, "writeend", event);
                  revoke(file);
                };
                writer.onerror = function() {
                  var error = writer.error;
                  if (error.code !== error.ABORT_ERR) {
                    fs_error();
                  }
                };
                "writestart progress write abort".split(" ").forEach(function(event) {
                  writer["on" + event] = filesaver["on" + event];
                });
                writer.write(blob);
                filesaver.abort = function() {
                  writer.abort();
                  filesaver.readyState = filesaver.DONE;
                };
                filesaver.readyState = filesaver.WRITING;
              }), fs_error);
            }), fs_error);
          };
          dir.getFile(name, {create: false}, abortable(function(file) {
            // delete file if it already exists
            file.remove();
            save();
          }), abortable(function(ex) {
            if (ex.code === ex.NOT_FOUND_ERR) {
              save();
            } else {
              fs_error();
            }
          }));
        }), fs_error);
      }), fs_error);
    }
    , FS_proto = FileSaver.prototype
    , saveAs = function(blob, name, no_auto_bom) {
      return new FileSaver(blob, name, no_auto_bom);
    }
  ;
  // IE 10+ (native saveAs)
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function(blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      return navigator.msSaveOrOpenBlob(blob, name || "download");
    };
  }

  FS_proto.abort = function() {
    var filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, "abort");
  };
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;

  FS_proto.error =
  FS_proto.onwritestart =
  FS_proto.onprogress =
  FS_proto.onwrite =
  FS_proto.onabort =
  FS_proto.onerror =
  FS_proto.onwriteend =
    null;

  return saveAs;
}(
     typeof self !== "undefined" && self
  || typeof window !== "undefined" && window
  || this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
}
},{}],29:[function(require,module,exports){
window.CornerstoneShims = window.CornerstoneShims || {};

if (!window.CornerstoneShims.Backbone){
	window.CornerstoneShims.Backbone = window.Backbone;
}

module.exports = window.CornerstoneShims.Backbone;

},{}],30:[function(require,module,exports){
/*
Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
function StringBuffer()
{
    this.buffer = [];
}

StringBuffer.prototype.append = function append(string)
{
    this.buffer.push(string);
    return this;
};

StringBuffer.prototype.toString = function toString()
{
    return this.buffer.join("");
};

var Base64 =
{
    codex : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode : function (input)
    {
        var output = new StringBuffer();

        var enumerator = new Utf8EncodeEnumerator(input);
        while (enumerator.moveNext())
        {
            var chr1 = enumerator.current;

            enumerator.moveNext();
            var chr2 = enumerator.current;

            enumerator.moveNext();
            var chr3 = enumerator.current;

            var enc1 = chr1 >> 2;
            var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            var enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4));
        }

        return output.toString();
    },

    decode : function (input)
    {
        var output = new StringBuffer();

        var enumerator = new Base64DecodeEnumerator(input);
        while (enumerator.moveNext())
        {
            var charCode = enumerator.current;

            if (charCode < 128)
                output.append(String.fromCharCode(charCode));
            else if ((charCode > 191) && (charCode < 224))
            {
                enumerator.moveNext();
                var charCode2 = enumerator.current;

                output.append(String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63)));
            }
            else
            {
                enumerator.moveNext();
                var charCode2 = enumerator.current;

                enumerator.moveNext();
                var charCode3 = enumerator.current;

                output.append(String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63)));
            }
        }

        return output.toString();
    }
}


function Utf8EncodeEnumerator(input)
{
    this._input = input;
    this._index = -1;
    this._buffer = [];
}

Utf8EncodeEnumerator.prototype =
{
    current: Number.NaN,

    moveNext: function()
    {
        if (this._buffer.length > 0)
        {
            this.current = this._buffer.shift();
            return true;
        }
        else if (this._index >= (this._input.length - 1))
        {
            this.current = Number.NaN;
            return false;
        }
        else
        {
            var charCode = this._input.charCodeAt(++this._index);

            // "\r\n" -> "\n"
            //
            if ((charCode == 13) && (this._input.charCodeAt(this._index + 1) == 10))
            {
                charCode = 10;
                this._index += 2;
            }

            if (charCode < 128)
            {
                this.current = charCode;
            }
            else if ((charCode > 127) && (charCode < 2048))
            {
                this.current = (charCode >> 6) | 192;
                this._buffer.push((charCode & 63) | 128);
            }
            else
            {
                this.current = (charCode >> 12) | 224;
                this._buffer.push(((charCode >> 6) & 63) | 128);
                this._buffer.push((charCode & 63) | 128);
            }

            return true;
        }
    }
}

function Base64DecodeEnumerator(input)
{
    this._input = input;
    this._index = -1;
    this._buffer = [];
}

Base64DecodeEnumerator.prototype =
{
    current: 64,

    moveNext: function()
    {
        if (this._buffer.length > 0)
        {
            this.current = this._buffer.shift();
            return true;
        }
        else if (this._index >= (this._input.length - 1))
        {
            this.current = 64;
            return false;
        }
        else
        {
            var enc1 = Base64.codex.indexOf(this._input.charAt(++this._index));
            var enc2 = Base64.codex.indexOf(this._input.charAt(++this._index));
            var enc3 = Base64.codex.indexOf(this._input.charAt(++this._index));
            var enc4 = Base64.codex.indexOf(this._input.charAt(++this._index));

            var chr1 = (enc1 << 2) | (enc2 >> 4);
            var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            var chr3 = ((enc3 & 3) << 6) | enc4;

            this.current = chr1;

            if (enc3 != 64)
                this._buffer.push(chr2);

            if (enc4 != 64)
                this._buffer.push(chr3);

            return true;
        }
    }
};

module.exports = Base64;
},{}],31:[function(require,module,exports){
/*! Color.js - v0.9.11 - 2013-08-09
* https://github.com/Automattic/Color.js
* Copyright (c) 2013 Matt Wiebe; Licensed GPLv2 */
(function(global, undef) {

	var Color = function( color, type ) {
		if ( ! ( this instanceof Color ) )
			return new Color( color, type );

		return this._init( color, type );
	};

	Color.fn = Color.prototype = {
		_color: 0,
		_alpha: 1,
		error: false,
		// for preserving hue/sat in fromHsl().toHsl() flows
		_hsl: { h: 0, s: 0, l: 0 },
		// for preserving hue/sat in fromHsv().toHsv() flows
		_hsv: { h: 0, s: 0, v: 0 },
		// for setting hsl or hsv space - needed for .h() & .s() functions to function properly
		_hSpace: 'hsl',
		_init: function( color ) {
			var func = 'noop';
			switch ( typeof color ) {
					case 'object':
						// alpha?
						if ( color.a !== undef )
							this.a( color.a );
						func = ( color.r !== undef ) ? 'fromRgb' :
							( color.l !== undef ) ? 'fromHsl' :
							( color.v !== undef ) ? 'fromHsv' : func;
						return this[func]( color );
					case 'string':
						return this.fromCSS( color );
					case 'number':
						return this.fromInt( parseInt( color, 10 ) );
			}
			return this;
		},

		_error: function() {
			this.error = true;
			return this;
		},

		clone: function() {
			var newColor = new Color( this.toInt() ),
				copy = ['_alpha', '_hSpace', '_hsl', '_hsv', 'error'];
			for ( var i = copy.length - 1; i >= 0; i-- ) {
				newColor[ copy[i] ] = this[ copy[i] ];
			}
			return newColor;
		},

		setHSpace: function( space ) {
			this._hSpace = ( space === 'hsv' ) ? space : 'hsl';
			return this;
		},

		noop: function() {
			return this;
		},

		fromCSS: function( color ) {
			var list,
				leadingRE = /^(rgb|hs(l|v))a?\(/;
			this.error = false;

			// whitespace and semicolon trim
			color = color.replace(/^\s+/, '').replace(/\s+$/, '').replace(/;$/, '');

			if ( color.match(leadingRE) && color.match(/\)$/) ) {
				list = color.replace(/(\s|%)/g, '').replace(leadingRE, '').replace(/,?\);?$/, '').split(',');

				if ( list.length < 3 )
					return this._error();

				if ( list.length === 4 ) {
					this.a( parseFloat( list.pop() ) );
					// error state has been set to true in .a() if we passed NaN
					if ( this.error )
						return this;
				}

				for (var i = list.length - 1; i >= 0; i--) {
					list[i] = parseInt(list[i], 10);
					if ( isNaN( list[i] ) )
						return this._error();
				}

				if ( color.match(/^rgb/) ) {
					return this.fromRgb( {
						r: list[0],
						g: list[1],
						b: list[2]
					} );
				} else if ( color.match(/^hsv/) ) {
					return this.fromHsv( {
						h: list[0],
						s: list[1],
						v: list[2]
					} );
				} else {
					return this.fromHsl( {
						h: list[0],
						s: list[1],
						l: list[2]
					} );
				}
			} else {
				// must be hex amirite?
				return this.fromHex( color );
			}
		},

		fromRgb: function( rgb, preserve ) {
			if ( typeof rgb !== 'object' || rgb.r === undef || rgb.g === undef || rgb.b === undef )
				return this._error();

			this.error = false;
			return this.fromInt( parseInt( ( rgb.r << 16 ) + ( rgb.g << 8 ) + rgb.b, 10 ), preserve );
		},

		fromHex: function( color ) {
			color = color.replace(/^#/, '').replace(/^0x/, '');
			if ( color.length === 3 ) {
				color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
			}

			// rough error checking - this is where things go squirrely the most
			this.error = ! /^[0-9A-F]{6}$/i.test( color );
			return this.fromInt( parseInt( color, 16 ) );
		},

		fromHsl: function( hsl ) {
			var r, g, b, q, p, h, s, l;

			if ( typeof hsl !== 'object' || hsl.h === undef || hsl.s === undef || hsl.l === undef )
				return this._error();

			this._hsl = hsl; // store it
			this._hSpace = 'hsl'; // implicit
			h = hsl.h / 360; s = hsl.s / 100; l = hsl.l / 100;
			if ( s === 0 ) {
				r = g = b = l; // achromatic
			}
			else {
				q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
				p = 2 * l - q;
				r = this.hue2rgb( p, q, h + 1/3 );
				g = this.hue2rgb( p, q, h );
				b = this.hue2rgb( p, q, h - 1/3 );
			}
			return this.fromRgb( {
				r: r * 255,
				g: g * 255,
				b: b * 255
			}, true ); // true preserves hue/sat
		},

		fromHsv: function( hsv ) {
			var h, s, v, r, g, b, i, f, p, q, t;
			if ( typeof hsv !== 'object' || hsv.h === undef || hsv.s === undef || hsv.v === undef )
				return this._error();

			this._hsv = hsv; // store it
			this._hSpace = 'hsv'; // implicit

			h = hsv.h / 360; s = hsv.s / 100; v = hsv.v / 100;
			i = Math.floor( h * 6 );
			f = h * 6 - i;
			p = v * ( 1 - s );
			q = v * ( 1 - f * s );
			t = v * ( 1 - ( 1 - f ) * s );

			switch( i % 6 ) {
				case 0:
					r = v; g = t; b = p;
					break;
				case 1:
					r = q; g = v; b = p;
					break;
				case 2:
					r = p; g = v; b = t;
					break;
				case 3:
					r = p; g = q; b = v;
					break;
				case 4:
					r = t; g = p; b = v;
					break;
				case 5:
					r = v; g = p; b = q;
					break;
			}

			return this.fromRgb( {
				r: r * 255,
				g: g * 255,
				b: b * 255
			}, true ); // true preserves hue/sat

		},
		// everything comes down to fromInt
		fromInt: function( color, preserve ) {
			this._color = parseInt( color, 10 );

			if ( isNaN( this._color ) )
				this._color = 0;

			// let's coerce things
			if ( this._color > 16777215 )
				this._color = 16777215;
			else if ( this._color < 0 )
				this._color = 0;

			// let's not do weird things
			if ( preserve === undef ) {
				this._hsv.h = this._hsv.s = this._hsl.h = this._hsl.s = 0;
			}
			// EVENT GOES HERE
			return this;
		},

		hue2rgb: function( p, q, t ) {
			if ( t < 0 ) {
				t += 1;
			}
			if ( t > 1 ) {
				t -= 1;
			}
			if ( t < 1/6 ) {
				return p + ( q - p ) * 6 * t;
			}
			if ( t < 1/2 ) {
				return q;
			}
			if ( t < 2/3 ) {
				return p + ( q - p ) * ( 2/3 - t ) * 6;
			}
			return p;
		},

		toString: function() {
			var hex = parseInt( this._color, 10 ).toString( 16 );
			if ( this.error )
				return '';
			// maybe left pad it
			if ( hex.length < 6 ) {
				for (var i = 6 - hex.length - 1; i >= 0; i--) {
					hex = '0' + hex;
				}
			}
			return '#' + hex;
		},

		toCSS: function( type, alpha ) {
			type = type || 'hex';
			alpha = parseFloat( alpha || this._alpha );
			switch ( type ) {
				case 'rgb':
				case 'rgba':
					var rgb = this.toRgb();
					if ( alpha < 1 ) {
						return "rgba( " + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + " )";
					}
					else {
						return "rgb( " + rgb.r + ", " + rgb.g + ", " + rgb.b + " )";
					}
					break;
				case 'hsl':
				case 'hsla':
					var hsl = this.toHsl();
					if ( alpha < 1 ) {
						return "hsla( " + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%, " + alpha + " )";
					}
					else {
						return "hsl( " + hsl.h + ", " + hsl.s + "%, " + hsl.l + "% )";
					}
					break;
				default:
					return this.toString();
			}
		},

		toRgb: function() {
			return {
				r: 255 & ( this._color >> 16 ),
				g: 255 & ( this._color >> 8 ),
				b: 255 & ( this._color )
			};
		},

		toHsl: function() {
			var rgb = this.toRgb();
			var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
			var max = Math.max( r, g, b ), min = Math.min( r, g, b );
			var h, s, l = ( max + min ) / 2;

			if ( max === min ) {
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
				switch ( max ) {
					case r: h = ( g - b ) / d + ( g < b ? 6 : 0 );
						break;
					case g: h = ( b - r ) / d + 2;
						break;
					case b: h = ( r - g ) / d + 4;
						break;
				}
				h /= 6;
			}

			// maintain hue & sat if we've been manipulating things in the HSL space.
			h = Math.round( h * 360 );
			if ( h === 0 && this._hsl.h !== h ) {
				h = this._hsl.h;
			}
			s = Math.round( s * 100 );
			if ( s === 0 && this._hsl.s ) {
				s = this._hsl.s;
			}

			return {
				h: h,
				s: s,
				l: Math.round( l * 100 )
			};

		},

		toHsv: function() {
			var rgb = this.toRgb();
			var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
			var max = Math.max( r, g, b ), min = Math.min( r, g, b );
			var h, s, v = max;
			var d = max - min;
			s = max === 0 ? 0 : d / max;

			if ( max === min ) {
				h = s = 0; // achromatic
			} else {
				switch( max ){
					case r:
						h = ( g - b ) / d + ( g < b ? 6 : 0 );
						break;
					case g:
						h = ( b - r ) / d + 2;
						break;
					case b:
						h = ( r - g ) / d + 4;
						break;
				}
				h /= 6;
			}

			// maintain hue & sat if we've been manipulating things in the HSV space.
			h = Math.round( h * 360 );
			if ( h === 0 && this._hsv.h !== h ) {
				h = this._hsv.h;
			}
			s = Math.round( s * 100 );
			if ( s === 0 && this._hsv.s ) {
				s = this._hsv.s;
			}

			return {
				h: h,
				s: s,
				v: Math.round( v * 100 )
			};
		},

		toInt: function() {
			return this._color;
		},

		toIEOctoHex: function() {
			// AARRBBGG
			var hex = this.toString();
			var AA = parseInt( 255 * this._alpha, 10 ).toString(16);
			if ( AA.length === 1 ) {
				AA = '0' + AA;
			}
			return '#' + AA + hex.replace(/^#/, '' );
		},

		toLuminosity: function() {
			var rgb = this.toRgb();
			return 0.2126 * Math.pow( rgb.r / 255, 2.2 ) + 0.7152 * Math.pow( rgb.g / 255, 2.2 ) + 0.0722 * Math.pow( rgb.b / 255, 2.2);
		},

		getDistanceLuminosityFrom: function( color ) {
			if ( ! ( color instanceof Color ) ) {
				throw 'getDistanceLuminosityFrom requires a Color object';
			}
			var lum1 = this.toLuminosity();
			var lum2 = color.toLuminosity();
			if ( lum1 > lum2 ) {
				return ( lum1 + 0.05 ) / ( lum2 + 0.05 );
			}
			else {
				return ( lum2 + 0.05 ) / ( lum1 + 0.05 );
			}
		},

		getMaxContrastColor: function() {
			var lum = this.toLuminosity();
			var hex = ( lum >= 0.5 ) ? '000000' : 'ffffff';
			return new Color( hex );
		},

		getReadableContrastingColor: function( bgColor, minContrast ) {
			if ( ! bgColor instanceof Color ) {
				return this;
			}

			// you shouldn't use less than 5, but you might want to.
			var targetContrast = ( minContrast === undef ) ? 5 : minContrast;
			// working things
			var contrast = bgColor.getDistanceLuminosityFrom( this );
			var maxContrastColor = bgColor.getMaxContrastColor();
			var maxContrast = maxContrastColor.getDistanceLuminosityFrom( bgColor );

			// if current max contrast is less than the target contrast, we had wishful thinking.
			// still, go max
			if ( maxContrast <= targetContrast ) {
				return maxContrastColor;
			}
			// or, we might already have sufficient contrast
			else if ( contrast >= targetContrast ) {
				return this;
			}

			var incr = ( 0 === maxContrastColor.toInt() ) ? -1 : 1;
			while ( contrast < targetContrast ) {
				this.l( incr, true ); // 2nd arg turns this into an incrementer
				contrast = this.getDistanceLuminosityFrom( bgColor );
				// infininite loop prevention: you never know.
				if ( this._color === 0 || this._color === 16777215 ) {
					break;
				}
			}

			return this;

		},

		a: function( val ) {
			if ( val === undef )
				return this._alpha;

			var a = parseFloat( val );

			if ( isNaN( a ) )
				return this._error();

			this._alpha = a;
			return this;
		},

		// TRANSFORMS

		darken: function( amount ) {
			amount = amount || 5;
			return this.l( - amount, true );
		},

		lighten: function( amount ) {
			amount = amount || 5;
			return this.l( amount, true );
		},

		saturate: function( amount ) {
			amount = amount || 15;
			return this.s( amount, true );
		},

		desaturate: function( amount ) {
			amount = amount || 15;
			return this.s( - amount, true );
		},

		toGrayscale: function() {
			return this.setHSpace('hsl').s( 0 );
		},

		getComplement: function() {
			return this.h( 180, true );
		},

		getSplitComplement: function( step ) {
			step = step || 1;
			var incr = 180 + ( step * 30 );
			return this.h( incr, true );
		},

		getAnalog: function( step ) {
			step = step || 1;
			var incr = step * 30;
			return this.h( incr, true );
		},

		getTetrad: function( step ) {
			step = step || 1;
			var incr = step * 60;
			return this.h( incr, true );
		},

		getTriad: function( step ) {
			step = step || 1;
			var incr = step * 120;
			return this.h( incr, true );
		},

		_partial: function( key ) {
			var prop = shortProps[key];
			return function( val, incr ) {
				var color = this._spaceFunc('to', prop.space);

				// GETTER
				if ( val === undef )
					return color[key];

				// INCREMENT
				if ( incr === true )
					val = color[key] + val;

				// MOD & RANGE
				if ( prop.mod )
					val = val % prop.mod;
				if ( prop.range )
					val = ( val < prop.range[0] ) ? prop.range[0] : ( val > prop.range[1] ) ? prop.range[1] : val;

				// NEW VALUE
				color[key] = val;

				return this._spaceFunc('from', prop.space, color);
			};
		},

		_spaceFunc: function( dir, s, val ) {
			var space = s || this._hSpace,
				funcName = dir + space.charAt(0).toUpperCase() + space.substr(1);
			return this[funcName](val);
		}
	};

	var shortProps = {
		h: {
			mod: 360
		},
		s: {
			range: [0,100]
		},
		l: {
			space: 'hsl',
			range: [0,100]
		},
		v: {
			space: 'hsv',
			range: [0,100]
		},
		r: {
			space: 'rgb',
			range: [0,255]
		},
		g: {
			space: 'rgb',
			range: [0,255]
		},
		b: {
			space: 'rgb',
			range: [0,255]
		}
	};

	for ( var key in shortProps ) {
		if ( shortProps.hasOwnProperty( key ) )
			Color.fn[key] = Color.fn._partial(key);
	}

	// play nicely with Node + browser
	if ( typeof exports === 'object' )
		module.exports = Color;
	else
		global.Color = Color;

}(this));
},{}],32:[function(require,module,exports){
window.CornerstoneShims = window.CornerstoneShims || {};

if (!window.CornerstoneShims.$){
	window.CornerstoneShims.$ = window.jQuery;
}

module.exports = window.CornerstoneShims.$;

},{}],33:[function(require,module,exports){
/*!
 * string_score.js: String Scoring Algorithm 0.1.22
 *
 * http://joshaven.com/string_score
 * https://github.com/joshaven/string_score
 *
 * Copyright (C) 2009-2014 Joshaven Potter <yourtech@gmail.com>
 * Special thanks to all of the contributors listed here https://github.com/joshaven/string_score
 * MIT License: http://opensource.org/licenses/MIT
 *
 * Date: Tue Mar 1 2011
 * Updated: Tue Mar 10 2015
*/

/*jslint nomen:true, white:true, browser:true,devel:true */

/**
 * Scores a string against another string.
 *    'Hello World'.score('he');         //=> 0.5931818181818181
 *    'Hello World'.score('Hello');    //=> 0.7318181818181818
 */
String.prototype.score = function (word, fuzziness) {
  'use strict';

  // If the string is equal to the word, perfect match.
  if (this === word) { return 1; }

  //if it's not a perfect match and is empty return 0
  if (word === "") { return 0; }

  var runningScore = 0,
      charScore,
      finalScore,
      string = this,
      lString = string.toLowerCase(),
      strLength = string.length,
      lWord = word.toLowerCase(),
      wordLength = word.length,
      idxOf,
      startAt = 0,
      fuzzies = 1,
      fuzzyFactor,
      i;

  // Cache fuzzyFactor for speed increase
  if (fuzziness) { fuzzyFactor = 1 - fuzziness; }

  // Walk through word and add up scores.
  // Code duplication occurs to prevent checking fuzziness inside for loop
  if (fuzziness) {
    for (i = 0; i < wordLength; i+=1) {

      // Find next first case-insensitive match of a character.
      idxOf = lString.indexOf(lWord[i], startAt);

      if (idxOf === -1) {
        fuzzies += fuzzyFactor;
      } else {
        if (startAt === idxOf) {
          // Consecutive letter & start-of-string Bonus
          charScore = 0.7;
        } else {
          charScore = 0.1;

          // Acronym Bonus
          // Weighing Logic: Typing the first character of an acronym is as if you
          // preceded it with two perfect character matches.
          if (string[idxOf - 1] === ' ') { charScore += 0.8; }
        }

        // Same case bonus.
        if (string[idxOf] === word[i]) { charScore += 0.1; }

        // Update scores and startAt position for next round of indexOf
        runningScore += charScore;
        startAt = idxOf + 1;
      }
    }
  } else {
    for (i = 0; i < wordLength; i+=1) {
      idxOf = lString.indexOf(lWord[i], startAt);
      if (-1 === idxOf) { return 0; }

      if (startAt === idxOf) {
        charScore = 0.7;
      } else {
        charScore = 0.1;
        if (string[idxOf - 1] === ' ') { charScore += 0.8; }
      }
      if (string[idxOf] === word[i]) { charScore += 0.1; }
      runningScore += charScore;
      startAt = idxOf + 1;
    }
  }

  // Reduce penalty for longer strings.
  finalScore = 0.5 * (runningScore / strLength    + runningScore / wordLength) / fuzzies;

  if ((lWord[0] === lString[0]) && (finalScore < 0.85)) {
    finalScore += 0.15;
  }

  return finalScore;
};
},{}],34:[function(require,module,exports){
window.CornerstoneShims = window.CornerstoneShims || {};

if (!window.CornerstoneShims._){
	window.CornerstoneShims._ = window._;
}

module.exports = window.CornerstoneShims._;

},{}],35:[function(require,module,exports){
// Backbone.BabySitter
// -------------------
// v0.1.10
//
// Copyright (c)2015 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.babysitter

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('./../../../assets/js/src/admin/vendor/backbone-shim.js');
    var _ = require('./../../../assets/js/src/admin/vendor/underscore-shim.js');
    module.exports = factory(Backbone, _);
  } else {
    factory(root.Backbone, root._);
  }

}(this, function(Backbone, _) {
  'use strict';

  var previousChildViewContainer = Backbone.ChildViewContainer;

  // BabySitter.ChildViewContainer
  // -----------------------------
  //
  // Provide a container to store, retrieve and
  // shut down child views.
  
  Backbone.ChildViewContainer = (function (Backbone, _) {
  
    // Container Constructor
    // ---------------------
  
    var Container = function(views){
      this._views = {};
      this._indexByModel = {};
      this._indexByCustom = {};
      this._updateLength();
  
      _.each(views, this.add, this);
    };
  
    // Container Methods
    // -----------------
  
    _.extend(Container.prototype, {
  
      // Add a view to this container. Stores the view
      // by `cid` and makes it searchable by the model
      // cid (and model itself). Optionally specify
      // a custom key to store an retrieve the view.
      add: function(view, customIndex){
        var viewCid = view.cid;
  
        // store the view
        this._views[viewCid] = view;
  
        // index it by model
        if (view.model){
          this._indexByModel[view.model.cid] = viewCid;
        }
  
        // index by custom
        if (customIndex){
          this._indexByCustom[customIndex] = viewCid;
        }
  
        this._updateLength();
        return this;
      },
  
      // Find a view by the model that was attached to
      // it. Uses the model's `cid` to find it.
      findByModel: function(model){
        return this.findByModelCid(model.cid);
      },
  
      // Find a view by the `cid` of the model that was attached to
      // it. Uses the model's `cid` to find the view `cid` and
      // retrieve the view using it.
      findByModelCid: function(modelCid){
        var viewCid = this._indexByModel[modelCid];
        return this.findByCid(viewCid);
      },
  
      // Find a view by a custom indexer.
      findByCustom: function(index){
        var viewCid = this._indexByCustom[index];
        return this.findByCid(viewCid);
      },
  
      // Find by index. This is not guaranteed to be a
      // stable index.
      findByIndex: function(index){
        return _.values(this._views)[index];
      },
  
      // retrieve a view by its `cid` directly
      findByCid: function(cid){
        return this._views[cid];
      },
  
      // Remove a view
      remove: function(view){
        var viewCid = view.cid;
  
        // delete model index
        if (view.model){
          delete this._indexByModel[view.model.cid];
        }
  
        // delete custom index
        _.any(this._indexByCustom, function(cid, key) {
          if (cid === viewCid) {
            delete this._indexByCustom[key];
            return true;
          }
        }, this);
  
        // remove the view from the container
        delete this._views[viewCid];
  
        // update the length
        this._updateLength();
        return this;
      },
  
      // Call a method on every view in the container,
      // passing parameters to the call method one at a
      // time, like `function.call`.
      call: function(method){
        this.apply(method, _.tail(arguments));
      },
  
      // Apply a method on every view in the container,
      // passing parameters to the call method one at a
      // time, like `function.apply`.
      apply: function(method, args){
        _.each(this._views, function(view){
          if (_.isFunction(view[method])){
            view[method].apply(view, args || []);
          }
        });
      },
  
      // Update the `.length` attribute on this container
      _updateLength: function(){
        this.length = _.size(this._views);
      }
    });
  
    // Borrowing this code from Backbone.Collection:
    // http://backbonejs.org/docs/backbone.html#section-106
    //
    // Mix in methods from Underscore, for iteration, and other
    // collection related features.
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
      'last', 'without', 'isEmpty', 'pluck', 'reduce'];
  
    _.each(methods, function(method) {
      Container.prototype[method] = function() {
        var views = _.values(this._views);
        var args = [views].concat(_.toArray(arguments));
        return _[method].apply(_, args);
      };
    });
  
    // return the public API
    return Container;
  })(Backbone, _);
  

  Backbone.ChildViewContainer.VERSION = '0.1.10';

  Backbone.ChildViewContainer.noConflict = function () {
    Backbone.ChildViewContainer = previousChildViewContainer;
    return this;
  };

  return Backbone.ChildViewContainer;

}));

},{"./../../../assets/js/src/admin/vendor/backbone-shim.js":29,"./../../../assets/js/src/admin/vendor/underscore-shim.js":34}],36:[function(require,module,exports){
// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.4.3
//
// Copyright (c)2015 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore', 'backbone.wreqr', 'backbone.babysitter'], function(Backbone, _) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('./../../../../assets/js/src/admin/vendor/backbone-shim.js');
    var _ = require('./../../../../assets/js/src/admin/vendor/underscore-shim.js');
    var Wreqr = require('backbone.wreqr');
    var BabySitter = require('backbone.babysitter');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = root.Mn = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  var previousMarionette = root.Marionette;
  var previousMn = root.Mn;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '2.4.3';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    root.Mn = previousMn;
    return this;
  };

  // Get the Deferred creator for later use
  Marionette.Deferred = Backbone.$.Deferred;

  Marionette.FEATURES = {
  };
  
  Marionette.isEnabled = function(name) {
    return !!Marionette.FEATURES[name];
  };
  
  /* jshint unused: false *//* global console */
  
  // Helpers
  // -------
  
  // Marionette.extend
  // -----------------
  
  // Borrow the Backbone `extend` method so we can use it as needed
  Marionette.extend = Backbone.Model.extend;
  
  // Marionette.isNodeAttached
  // -------------------------
  
  // Determine if `el` is a child of the document
  Marionette.isNodeAttached = function(el) {
    return Backbone.$.contains(document.documentElement, el);
  };
  
  // Merge `keys` from `options` onto `this`
  Marionette.mergeOptions = function(options, keys) {
    if (!options) { return; }
    _.extend(this, _.pick(options, keys));
  };
  
  // Marionette.getOption
  // --------------------
  
  // Retrieve an object, function or other value from a target
  // object or its `options`, with `options` taking precedence.
  Marionette.getOption = function(target, optionName) {
    if (!target || !optionName) { return; }
    if (target.options && (target.options[optionName] !== undefined)) {
      return target.options[optionName];
    } else {
      return target[optionName];
    }
  };
  
  // Proxy `Marionette.getOption`
  Marionette.proxyGetOption = function(optionName) {
    return Marionette.getOption(this, optionName);
  };
  
  // Similar to `_.result`, this is a simple helper
  // If a function is provided we call it with context
  // otherwise just return the value. If the value is
  // undefined return a default value
  Marionette._getValue = function(value, context, params) {
    if (_.isFunction(value)) {
      value = params ? value.apply(context, params) : value.call(context);
    }
    return value;
  };
  
  // Marionette.normalizeMethods
  // ----------------------
  
  // Pass in a mapping of events => functions or function names
  // and return a mapping of events => functions
  Marionette.normalizeMethods = function(hash) {
    return _.reduce(hash, function(normalizedHash, method, name) {
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (method) {
        normalizedHash[name] = method;
      }
      return normalizedHash;
    }, {}, this);
  };
  
  // utility method for parsing @ui. syntax strings
  // into associated selector
  Marionette.normalizeUIString = function(uiString, ui) {
    return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
      return ui[r.slice(4)];
    });
  };
  
  // allows for the use of the @ui. syntax within
  // a given key for triggers and events
  // swaps the @ui with the associated selector.
  // Returns a new, non-mutated, parsed events hash.
  Marionette.normalizeUIKeys = function(hash, ui) {
    return _.reduce(hash, function(memo, val, key) {
      var normalizedKey = Marionette.normalizeUIString(key, ui);
      memo[normalizedKey] = val;
      return memo;
    }, {});
  };
  
  // allows for the use of the @ui. syntax within
  // a given value for regions
  // swaps the @ui with the associated selector
  Marionette.normalizeUIValues = function(hash, ui, properties) {
    _.each(hash, function(val, key) {
      if (_.isString(val)) {
        hash[key] = Marionette.normalizeUIString(val, ui);
      } else if (_.isObject(val) && _.isArray(properties)) {
        _.extend(val, Marionette.normalizeUIValues(_.pick(val, properties), ui));
        /* Value is an object, and we got an array of embedded property names to normalize. */
        _.each(properties, function(property) {
          var propertyVal = val[property];
          if (_.isString(propertyVal)) {
            val[property] = Marionette.normalizeUIString(propertyVal, ui);
          }
        });
      }
    });
    return hash;
  };
  
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-121
  Marionette.actAsCollection = function(object, listProperty) {
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
      'last', 'without', 'isEmpty', 'pluck'];
  
    _.each(methods, function(method) {
      object[method] = function() {
        var list = _.values(_.result(this, listProperty));
        var args = [list].concat(_.toArray(arguments));
        return _[method].apply(_, args);
      };
    });
  };
  
  var deprecate = Marionette.deprecate = function(message, test) {
    if (_.isObject(message)) {
      message = (
        message.prev + ' is going to be removed in the future. ' +
        'Please use ' + message.next + ' instead.' +
        (message.url ? ' See: ' + message.url : '')
      );
    }
  
    if ((test === undefined || !test) && !deprecate._cache[message]) {
      deprecate._warn('Deprecation warning: ' + message);
      deprecate._cache[message] = true;
    }
  };
  
  deprecate._warn = typeof console !== 'undefined' && (console.warn || console.log) || function() {};
  deprecate._cache = {};
  
  /* jshint maxstatements: 14, maxcomplexity: 7 */
  
  // Trigger Method
  // --------------
  
  Marionette._triggerMethod = (function() {
    // split the event name on the ":"
    var splitter = /(^|:)(\w)/gi;
  
    // take the event section ("section1:section2:section3")
    // and turn it in to uppercase name
    function getEventName(match, prefix, eventName) {
      return eventName.toUpperCase();
    }
  
    return function(context, event, args) {
      var noEventArg = arguments.length < 3;
      if (noEventArg) {
        args = event;
        event = args[0];
      }
  
      // get the method name from the event name
      var methodName = 'on' + event.replace(splitter, getEventName);
      var method = context[methodName];
      var result;
  
      // call the onMethodName if it exists
      if (_.isFunction(method)) {
        // pass all args, except the event name
        result = method.apply(context, noEventArg ? _.rest(args) : args);
      }
  
      // trigger the event, if a trigger method exists
      if (_.isFunction(context.trigger)) {
        if (noEventArg + args.length > 1) {
          context.trigger.apply(context, noEventArg ? args : [event].concat(_.drop(args, 0)));
        } else {
          context.trigger(event);
        }
      }
  
      return result;
    };
  })();
  
  // Trigger an event and/or a corresponding method name. Examples:
  //
  // `this.triggerMethod("foo")` will trigger the "foo" event and
  // call the "onFoo" method.
  //
  // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
  // call the "onFooBar" method.
  Marionette.triggerMethod = function(event) {
    return Marionette._triggerMethod(this, arguments);
  };
  
  // triggerMethodOn invokes triggerMethod on a specific context
  //
  // e.g. `Marionette.triggerMethodOn(view, 'show')`
  // will trigger a "show" event or invoke onShow the view.
  Marionette.triggerMethodOn = function(context) {
    var fnc = _.isFunction(context.triggerMethod) ?
                  context.triggerMethod :
                  Marionette.triggerMethod;
  
    return fnc.apply(context, _.rest(arguments));
  };
  
  // DOM Refresh
  // -----------
  
  // Monitor a view's state, and after it has been rendered and shown
  // in the DOM, trigger a "dom:refresh" event every time it is
  // re-rendered.
  
  Marionette.MonitorDOMRefresh = function(view) {
    if (view._isDomRefreshMonitored) { return; }
    view._isDomRefreshMonitored = true;
  
    // track when the view has been shown in the DOM,
    // using a Marionette.Region (or by other means of triggering "show")
    function handleShow() {
      view._isShown = true;
      triggerDOMRefresh();
    }
  
    // track when the view has been rendered
    function handleRender() {
      view._isRendered = true;
      triggerDOMRefresh();
    }
  
    // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
    function triggerDOMRefresh() {
      if (view._isShown && view._isRendered && Marionette.isNodeAttached(view.el)) {
        Marionette.triggerMethodOn(view, 'dom:refresh', view);
      }
    }
  
    view.on({
      show: handleShow,
      render: handleRender
    });
  };
  
  /* jshint maxparams: 5 */
  
  // Bind Entity Events & Unbind Entity Events
  // -----------------------------------------
  //
  // These methods are used to bind/unbind a backbone "entity" (e.g. collection/model)
  // to methods on a target object.
  //
  // The first parameter, `target`, must have the Backbone.Events module mixed in.
  //
  // The second parameter is the `entity` (Backbone.Model, Backbone.Collection or
  // any object that has Backbone.Events mixed in) to bind the events from.
  //
  // The third parameter is a hash of { "event:name": "eventHandler" }
  // configuration. Multiple handlers can be separated by a space. A
  // function can be supplied instead of a string handler name.
  
  (function(Marionette) {
    'use strict';
  
    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function bindFromStrings(target, entity, evt, methods) {
      var methodNames = methods.split(/\s+/);
  
      _.each(methodNames, function(methodName) {
  
        var method = target[methodName];
        if (!method) {
          throw new Marionette.Error('Method "' + methodName +
            '" was configured as an event handler, but does not exist.');
        }
  
        target.listenTo(entity, evt, method);
      });
    }
  
    // Bind the event to a supplied callback function
    function bindToFunction(target, entity, evt, method) {
      target.listenTo(entity, evt, method);
    }
  
    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function unbindFromStrings(target, entity, evt, methods) {
      var methodNames = methods.split(/\s+/);
  
      _.each(methodNames, function(methodName) {
        var method = target[methodName];
        target.stopListening(entity, evt, method);
      });
    }
  
    // Bind the event to a supplied callback function
    function unbindToFunction(target, entity, evt, method) {
      target.stopListening(entity, evt, method);
    }
  
    // generic looping function
    function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
      if (!entity || !bindings) { return; }
  
      // type-check bindings
      if (!_.isObject(bindings)) {
        throw new Marionette.Error({
          message: 'Bindings must be an object or function.',
          url: 'marionette.functions.html#marionettebindentityevents'
        });
      }
  
      // allow the bindings to be a function
      bindings = Marionette._getValue(bindings, target);
  
      // iterate the bindings and bind them
      _.each(bindings, function(methods, evt) {
  
        // allow for a function as the handler,
        // or a list of event names as a string
        if (_.isFunction(methods)) {
          functionCallback(target, entity, evt, methods);
        } else {
          stringCallback(target, entity, evt, methods);
        }
  
      });
    }
  
    // Export Public API
    Marionette.bindEntityEvents = function(target, entity, bindings) {
      iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
    };
  
    Marionette.unbindEntityEvents = function(target, entity, bindings) {
      iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
    };
  
    // Proxy `bindEntityEvents`
    Marionette.proxyBindEntityEvents = function(entity, bindings) {
      return Marionette.bindEntityEvents(this, entity, bindings);
    };
  
    // Proxy `unbindEntityEvents`
    Marionette.proxyUnbindEntityEvents = function(entity, bindings) {
      return Marionette.unbindEntityEvents(this, entity, bindings);
    };
  })(Marionette);
  

  // Error
  // -----
  
  var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];
  
  Marionette.Error = Marionette.extend.call(Error, {
    urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/',
  
    constructor: function(message, options) {
      if (_.isObject(message)) {
        options = message;
        message = options.message;
      } else if (!options) {
        options = {};
      }
  
      var error = Error.call(this, message);
      _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));
  
      this.captureStackTrace();
  
      if (options.url) {
        this.url = this.urlRoot + options.url;
      }
    },
  
    captureStackTrace: function() {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, Marionette.Error);
      }
    },
  
    toString: function() {
      return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
    }
  });
  
  Marionette.Error.extend = Marionette.extend;
  
  // Callbacks
  // ---------
  
  // A simple way of managing a collection of callbacks
  // and executing them at a later point in time, using jQuery's
  // `Deferred` object.
  Marionette.Callbacks = function() {
    this._deferred = Marionette.Deferred();
    this._callbacks = [];
  };
  
  _.extend(Marionette.Callbacks.prototype, {
  
    // Add a callback to be executed. Callbacks added here are
    // guaranteed to execute, even if they are added after the
    // `run` method is called.
    add: function(callback, contextOverride) {
      var promise = _.result(this._deferred, 'promise');
  
      this._callbacks.push({cb: callback, ctx: contextOverride});
  
      promise.then(function(args) {
        if (contextOverride) { args.context = contextOverride; }
        callback.call(args.context, args.options);
      });
    },
  
    // Run all registered callbacks with the context specified.
    // Additional callbacks can be added after this has been run
    // and they will still be executed.
    run: function(options, context) {
      this._deferred.resolve({
        options: options,
        context: context
      });
    },
  
    // Resets the list of callbacks to be run, allowing the same list
    // to be run multiple times - whenever the `run` method is called.
    reset: function() {
      var callbacks = this._callbacks;
      this._deferred = Marionette.Deferred();
      this._callbacks = [];
  
      _.each(callbacks, function(cb) {
        this.add(cb.cb, cb.ctx);
      }, this);
    }
  });
  
  // Controller
  // ----------
  
  // A multi-purpose object to use as a controller for
  // modules and routers, and as a mediator for workflow
  // and coordination of other objects, views, and more.
  Marionette.Controller = function(options) {
    this.options = options || {};
  
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  };
  
  Marionette.Controller.extend = Marionette.extend;
  
  // Controller Methods
  // --------------
  
  // Ensure it can trigger events with Backbone.Events
  _.extend(Marionette.Controller.prototype, Backbone.Events, {
    destroy: function() {
      Marionette._triggerMethod(this, 'before:destroy', arguments);
      Marionette._triggerMethod(this, 'destroy', arguments);
  
      this.stopListening();
      this.off();
      return this;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // A handy way to merge options onto the instance
    mergeOptions: Marionette.mergeOptions,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption
  
  });
  
  // Object
  // ------
  
  // A Base Class that other Classes should descend from.
  // Object borrows many conventions and utilities from Backbone.
  Marionette.Object = function(options) {
    this.options = _.extend({}, _.result(this, 'options'), options);
  
    this.initialize.apply(this, arguments);
  };
  
  Marionette.Object.extend = Marionette.extend;
  
  // Object Methods
  // --------------
  
  // Ensure it can trigger events with Backbone.Events
  _.extend(Marionette.Object.prototype, Backbone.Events, {
  
    //this is a noop method intended to be overridden by classes that extend from this base
    initialize: function() {},
  
    destroy: function() {
      this.triggerMethod('before:destroy');
      this.triggerMethod('destroy');
      this.stopListening();
  
      return this;
    },
  
    // Import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // A handy way to merge options onto the instance
    mergeOptions: Marionette.mergeOptions,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // Proxy `bindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  /* jshint maxcomplexity: 16, maxstatements: 45, maxlen: 120 */
  
  // Region
  // ------
  
  // Manage the visual regions of your composite application. See
  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
  
  Marionette.Region = Marionette.Object.extend({
    constructor: function(options) {
  
      // set options temporarily so that we can get `el`.
      // options will be overriden by Object.constructor
      this.options = options || {};
      this.el = this.getOption('el');
  
      // Handle when this.el is passed in as a $ wrapped element.
      this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;
  
      if (!this.el) {
        throw new Marionette.Error({
          name: 'NoElError',
          message: 'An "el" must be specified for a region.'
        });
      }
  
      this.$el = this.getEl(this.el);
      Marionette.Object.call(this, options);
    },
  
    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `onDestroy` method on your view, just after showing
    // or just before destroying the view, respectively.
    // The `preventDestroy` option can be used to prevent a view from
    // the old view being destroyed on show.
    // The `forceShow` option can be used to force a view to be
    // re-rendered if it's already shown in the region.
    show: function(view, options) {
      if (!this._ensureElement()) {
        return;
      }
  
      this._ensureViewIsIntact(view);
      Marionette.MonitorDOMRefresh(view);
  
      var showOptions     = options || {};
      var isDifferentView = view !== this.currentView;
      var preventDestroy  = !!showOptions.preventDestroy;
      var forceShow       = !!showOptions.forceShow;
  
      // We are only changing the view if there is a current view to change to begin with
      var isChangingView = !!this.currentView;
  
      // Only destroy the current view if we don't want to `preventDestroy` and if
      // the view given in the first argument is different than `currentView`
      var _shouldDestroyView = isDifferentView && !preventDestroy;
  
      // Only show the view given in the first argument if it is different than
      // the current view or if we want to re-show the view. Note that if
      // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
      var _shouldShowView = isDifferentView || forceShow;
  
      if (isChangingView) {
        this.triggerMethod('before:swapOut', this.currentView, this, options);
      }
  
      if (this.currentView) {
        delete this.currentView._parent;
      }
  
      if (_shouldDestroyView) {
        this.empty();
  
      // A `destroy` event is attached to the clean up manually removed views.
      // We need to detach this event when a new view is going to be shown as it
      // is no longer relevant.
      } else if (isChangingView && _shouldShowView) {
        this.currentView.off('destroy', this.empty, this);
      }
  
      if (_shouldShowView) {
  
        // We need to listen for if a view is destroyed
        // in a way other than through the region.
        // If this happens we need to remove the reference
        // to the currentView since once a view has been destroyed
        // we can not reuse it.
        view.once('destroy', this.empty, this);
  
        this._renderView(view);
  
        view._parent = this;
  
        if (isChangingView) {
          this.triggerMethod('before:swap', view, this, options);
        }
  
        this.triggerMethod('before:show', view, this, options);
        Marionette.triggerMethodOn(view, 'before:show', view, this, options);
  
        if (isChangingView) {
          this.triggerMethod('swapOut', this.currentView, this, options);
        }
  
        // An array of views that we're about to display
        var attachedRegion = Marionette.isNodeAttached(this.el);
  
        // The views that we're about to attach to the document
        // It's important that we prevent _getNestedViews from being executed unnecessarily
        // as it's a potentially-slow method
        var displayedViews = [];
  
        var attachOptions = _.extend({
          triggerBeforeAttach: this.triggerBeforeAttach,
          triggerAttach: this.triggerAttach
        }, showOptions);
  
        if (attachedRegion && attachOptions.triggerBeforeAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews, 'before:');
        }
  
        this.attachHtml(view);
        this.currentView = view;
  
        if (attachedRegion && attachOptions.triggerAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews);
        }
  
        if (isChangingView) {
          this.triggerMethod('swap', view, this, options);
        }
  
        this.triggerMethod('show', view, this, options);
        Marionette.triggerMethodOn(view, 'show', view, this, options);
  
        return this;
      }
  
      return this;
    },
  
    triggerBeforeAttach: true,
    triggerAttach: true,
  
    _triggerAttach: function(views, prefix) {
      var eventName = (prefix || '') + 'attach';
      _.each(views, function(view) {
        Marionette.triggerMethodOn(view, eventName, view, this);
      }, this);
    },
  
    _displayedViews: function(view) {
      return _.union([view], _.result(view, '_getNestedViews') || []);
    },
  
    _renderView: function(view) {
      if (!view.supportsRenderLifecycle) {
        Marionette.triggerMethodOn(view, 'before:render', view);
      }
      view.render();
      if (!view.supportsRenderLifecycle) {
        Marionette.triggerMethodOn(view, 'render', view);
      }
    },
  
    _ensureElement: function() {
      if (!_.isObject(this.el)) {
        this.$el = this.getEl(this.el);
        this.el = this.$el[0];
      }
  
      if (!this.$el || this.$el.length === 0) {
        if (this.getOption('allowMissingEl')) {
          return false;
        } else {
          throw new Marionette.Error('An "el" ' + this.$el.selector + ' must exist in DOM');
        }
      }
      return true;
    },
  
    _ensureViewIsIntact: function(view) {
      if (!view) {
        throw new Marionette.Error({
          name: 'ViewNotValid',
          message: 'The view passed is undefined and therefore invalid. You must pass a view instance to show.'
        });
      }
  
      if (view.isDestroyed) {
        throw new Marionette.Error({
          name: 'ViewDestroyedError',
          message: 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.'
        });
      }
    },
  
    // Override this method to change how the region finds the DOM
    // element that it manages. Return a jQuery selector object scoped
    // to a provided parent el or the document if none exists.
    getEl: function(el) {
      return Backbone.$(el, Marionette._getValue(this.options.parentEl, this));
    },
  
    // Override this method to change how the new view is
    // appended to the `$el` that the region is managing
    attachHtml: function(view) {
      this.$el.contents().detach();
  
      this.el.appendChild(view.el);
    },
  
    // Destroy the current view, if there is one. If there is no
    // current view, it does nothing and returns immediately.
    empty: function(options) {
      var view = this.currentView;
  
      var emptyOptions = options || {};
      var preventDestroy  = !!emptyOptions.preventDestroy;
      // If there is no view in the region
      // we should not remove anything
      if (!view) { return; }
  
      view.off('destroy', this.empty, this);
      this.triggerMethod('before:empty', view);
      if (!preventDestroy) {
        this._destroyView();
      }
      this.triggerMethod('empty', view);
  
      // Remove region pointer to the currentView
      delete this.currentView;
  
      if (preventDestroy) {
        this.$el.contents().detach();
      }
  
      return this;
    },
  
    // call 'destroy' or 'remove', depending on which is found
    // on the view (if showing a raw Backbone view or a Marionette View)
    _destroyView: function() {
      var view = this.currentView;
      if (view.isDestroyed) { return; }
  
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'before:destroy', view);
      }
      if (view.destroy) {
        view.destroy();
      } else {
        view.remove();
  
        // appending isDestroyed to raw Backbone View allows regions
        // to throw a ViewDestroyedError for this view
        view.isDestroyed = true;
      }
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'destroy', view);
      }
    },
  
    // Attach an existing view to the region. This
    // will not call `render` or `onShow` for the new view,
    // and will not replace the current HTML for the `el`
    // of the region.
    attachView: function(view) {
      if (this.currentView) {
        delete this.currentView._parent;
      }
      view._parent = this;
      this.currentView = view;
      return this;
    },
  
    // Checks whether a view is currently present within
    // the region. Returns `true` if there is and `false` if
    // no view is present.
    hasView: function() {
      return !!this.currentView;
    },
  
    // Reset the region by destroying any existing view and
    // clearing out the cached `$el`. The next time a view
    // is shown via this region, the region will re-query the
    // DOM for the region's `el`.
    reset: function() {
      this.empty();
  
      if (this.$el) {
        this.el = this.$el.selector;
      }
  
      delete this.$el;
      return this;
    }
  
  },
  
  // Static Methods
  {
  
    // Build an instance of a region by passing in a configuration object
    // and a default region class to use if none is specified in the config.
    //
    // The config object should either be a string as a jQuery DOM selector,
    // a Region class directly, or an object literal that specifies a selector,
    // a custom regionClass, and any options to be supplied to the region:
    //
    // ```js
    // {
    //   selector: "#foo",
    //   regionClass: MyCustomRegion,
    //   allowMissingEl: false
    // }
    // ```
    //
    buildRegion: function(regionConfig, DefaultRegionClass) {
      if (_.isString(regionConfig)) {
        return this._buildRegionFromSelector(regionConfig, DefaultRegionClass);
      }
  
      if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) {
        return this._buildRegionFromObject(regionConfig, DefaultRegionClass);
      }
  
      if (_.isFunction(regionConfig)) {
        return this._buildRegionFromRegionClass(regionConfig);
      }
  
      throw new Marionette.Error({
        message: 'Improper region configuration type.',
        url: 'marionette.region.html#region-configuration-types'
      });
    },
  
    // Build the region from a string selector like '#foo-region'
    _buildRegionFromSelector: function(selector, DefaultRegionClass) {
      return new DefaultRegionClass({el: selector});
    },
  
    // Build the region from a configuration object
    // ```js
    // { selector: '#foo', regionClass: FooRegion, allowMissingEl: false }
    // ```
    _buildRegionFromObject: function(regionConfig, DefaultRegionClass) {
      var RegionClass = regionConfig.regionClass || DefaultRegionClass;
      var options = _.omit(regionConfig, 'selector', 'regionClass');
  
      if (regionConfig.selector && !options.el) {
        options.el = regionConfig.selector;
      }
  
      return new RegionClass(options);
    },
  
    // Build the region directly from a given `RegionClass`
    _buildRegionFromRegionClass: function(RegionClass) {
      return new RegionClass();
    }
  });
  
  // Region Manager
  // --------------
  
  // Manage one or more related `Marionette.Region` objects.
  Marionette.RegionManager = Marionette.Controller.extend({
    constructor: function(options) {
      this._regions = {};
      this.length = 0;
  
      Marionette.Controller.call(this, options);
  
      this.addRegions(this.getOption('regions'));
    },
  
    // Add multiple regions using an object literal or a
    // function that returns an object literal, where
    // each key becomes the region name, and each value is
    // the region definition.
    addRegions: function(regionDefinitions, defaults) {
      regionDefinitions = Marionette._getValue(regionDefinitions, this, arguments);
  
      return _.reduce(regionDefinitions, function(regions, definition, name) {
        if (_.isString(definition)) {
          definition = {selector: definition};
        }
        if (definition.selector) {
          definition = _.defaults({}, definition, defaults);
        }
  
        regions[name] = this.addRegion(name, definition);
        return regions;
      }, {}, this);
    },
  
    // Add an individual region to the region manager,
    // and return the region instance
    addRegion: function(name, definition) {
      var region;
  
      if (definition instanceof Marionette.Region) {
        region = definition;
      } else {
        region = Marionette.Region.buildRegion(definition, Marionette.Region);
      }
  
      this.triggerMethod('before:add:region', name, region);
  
      region._parent = this;
      this._store(name, region);
  
      this.triggerMethod('add:region', name, region);
      return region;
    },
  
    // Get a region by name
    get: function(name) {
      return this._regions[name];
    },
  
    // Gets all the regions contained within
    // the `regionManager` instance.
    getRegions: function() {
      return _.clone(this._regions);
    },
  
    // Remove a region by name
    removeRegion: function(name) {
      var region = this._regions[name];
      this._remove(name, region);
  
      return region;
    },
  
    // Empty all regions in the region manager, and
    // remove them
    removeRegions: function() {
      var regions = this.getRegions();
      _.each(this._regions, function(region, name) {
        this._remove(name, region);
      }, this);
  
      return regions;
    },
  
    // Empty all regions in the region manager, but
    // leave them attached
    emptyRegions: function() {
      var regions = this.getRegions();
      _.invoke(regions, 'empty');
      return regions;
    },
  
    // Destroy all regions and shut down the region
    // manager entirely
    destroy: function() {
      this.removeRegions();
      return Marionette.Controller.prototype.destroy.apply(this, arguments);
    },
  
    // internal method to store regions
    _store: function(name, region) {
      if (!this._regions[name]) {
        this.length++;
      }
  
      this._regions[name] = region;
    },
  
    // internal method to remove a region
    _remove: function(name, region) {
      this.triggerMethod('before:remove:region', name, region);
      region.empty();
      region.stopListening();
  
      delete region._parent;
      delete this._regions[name];
      this.length--;
      this.triggerMethod('remove:region', name, region);
    }
  });
  
  Marionette.actAsCollection(Marionette.RegionManager.prototype, '_regions');
  

  // Template Cache
  // --------------
  
  // Manage templates stored in `<script>` blocks,
  // caching them for faster access.
  Marionette.TemplateCache = function(templateId) {
    this.templateId = templateId;
  };
  
  // TemplateCache object-level methods. Manage the template
  // caches from these method calls instead of creating
  // your own TemplateCache instances
  _.extend(Marionette.TemplateCache, {
    templateCaches: {},
  
    // Get the specified template by id. Either
    // retrieves the cached version, or loads it
    // from the DOM.
    get: function(templateId, options) {
      var cachedTemplate = this.templateCaches[templateId];
  
      if (!cachedTemplate) {
        cachedTemplate = new Marionette.TemplateCache(templateId);
        this.templateCaches[templateId] = cachedTemplate;
      }
  
      return cachedTemplate.load(options);
    },
  
    // Clear templates from the cache. If no arguments
    // are specified, clears all templates:
    // `clear()`
    //
    // If arguments are specified, clears each of the
    // specified templates from the cache:
    // `clear("#t1", "#t2", "...")`
    clear: function() {
      var i;
      var args = _.toArray(arguments);
      var length = args.length;
  
      if (length > 0) {
        for (i = 0; i < length; i++) {
          delete this.templateCaches[args[i]];
        }
      } else {
        this.templateCaches = {};
      }
    }
  });
  
  // TemplateCache instance methods, allowing each
  // template cache object to manage its own state
  // and know whether or not it has been loaded
  _.extend(Marionette.TemplateCache.prototype, {
  
    // Internal method to load the template
    load: function(options) {
      // Guard clause to prevent loading this template more than once
      if (this.compiledTemplate) {
        return this.compiledTemplate;
      }
  
      // Load the template and compile it
      var template = this.loadTemplate(this.templateId, options);
      this.compiledTemplate = this.compileTemplate(template, options);
  
      return this.compiledTemplate;
    },
  
    // Load a template from the DOM, by default. Override
    // this method to provide your own template retrieval
    // For asynchronous loading with AMD/RequireJS, consider
    // using a template-loader plugin as described here:
    // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
    loadTemplate: function(templateId, options) {
      var $template = Backbone.$(templateId);
  
      if (!$template.length) {
        throw new Marionette.Error({
          name: 'NoTemplateError',
          message: 'Could not find template: "' + templateId + '"'
        });
      }
      return $template.html();
    },
  
    // Pre-compile the template before caching it. Override
    // this method if you do not need to pre-compile a template
    // (JST / RequireJS for example) or if you want to change
    // the template engine used (Handebars, etc).
    compileTemplate: function(rawTemplate, options) {
      return _.template(rawTemplate, options);
    }
  });
  
  // Renderer
  // --------
  
  // Render a template with data by passing in the template
  // selector and the data to render.
  Marionette.Renderer = {
  
    // Render a template with data. The `template` parameter is
    // passed to the `TemplateCache` object to retrieve the
    // template function. Override this method to provide your own
    // custom rendering and template handling for all of Marionette.
    render: function(template, data) {
      if (!template) {
        throw new Marionette.Error({
          name: 'TemplateNotFoundError',
          message: 'Cannot render the template since its false, null or undefined.'
        });
      }
  
      var templateFunc = _.isFunction(template) ? template : Marionette.TemplateCache.get(template);
  
      return templateFunc(data);
    }
  };
  

  /* jshint maxlen: 114, nonew: false */
  // View
  // ----
  
  // The core view class that other Marionette views extend from.
  Marionette.View = Backbone.View.extend({
    isDestroyed: false,
    supportsRenderLifecycle: true,
    supportsDestroyLifecycle: true,
  
    constructor: function(options) {
      this.render = _.bind(this.render, this);
  
      options = Marionette._getValue(options, this);
  
      // this exposes view options to the view initializer
      // this is a backfill since backbone removed the assignment
      // of this.options
      // at some point however this may be removed
      this.options = _.extend({}, _.result(this, 'options'), options);
  
      this._behaviors = Marionette.Behaviors(this);
  
      Backbone.View.call(this, this.options);
  
      Marionette.MonitorDOMRefresh(this);
    },
  
    // Get the template for this view
    // instance. You can set a `template` attribute in the view
    // definition or pass a `template: "whatever"` parameter in
    // to the constructor options.
    getTemplate: function() {
      return this.getOption('template');
    },
  
    // Serialize a model by returning its attributes. Clones
    // the attributes to allow modification.
    serializeModel: function(model) {
      return model.toJSON.apply(model, _.rest(arguments));
    },
  
    // Mix in template helper methods. Looks for a
    // `templateHelpers` attribute, which can either be an
    // object literal, or a function that returns an object
    // literal. All methods and attributes from this object
    // are copies to the object passed in.
    mixinTemplateHelpers: function(target) {
      target = target || {};
      var templateHelpers = this.getOption('templateHelpers');
      templateHelpers = Marionette._getValue(templateHelpers, this);
      return _.extend(target, templateHelpers);
    },
  
    // normalize the keys of passed hash with the views `ui` selectors.
    // `{"@ui.foo": "bar"}`
    normalizeUIKeys: function(hash) {
      var uiBindings = _.result(this, '_uiBindings');
      return Marionette.normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
    },
  
    // normalize the values of passed hash with the views `ui` selectors.
    // `{foo: "@ui.bar"}`
    normalizeUIValues: function(hash, properties) {
      var ui = _.result(this, 'ui');
      var uiBindings = _.result(this, '_uiBindings');
      return Marionette.normalizeUIValues(hash, uiBindings || ui, properties);
    },
  
    // Configure `triggers` to forward DOM events to view
    // events. `triggers: {"click .foo": "do:foo"}`
    configureTriggers: function() {
      if (!this.triggers) { return; }
  
      // Allow `triggers` to be configured as a function
      var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));
  
      // Configure the triggers, prevent default
      // action and stop propagation of DOM events
      return _.reduce(triggers, function(events, value, key) {
        events[key] = this._buildViewTrigger(value);
        return events;
      }, {}, this);
    },
  
    // Overriding Backbone.View's delegateEvents to handle
    // the `triggers`, `modelEvents`, and `collectionEvents` configuration
    delegateEvents: function(events) {
      this._delegateDOMEvents(events);
      this.bindEntityEvents(this.model, this.getOption('modelEvents'));
      this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));
  
      _.each(this._behaviors, function(behavior) {
        behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
        behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
      }, this);
  
      return this;
    },
  
    // internal method to delegate DOM events and triggers
    _delegateDOMEvents: function(eventsArg) {
      var events = Marionette._getValue(eventsArg || this.events, this);
  
      // normalize ui keys
      events = this.normalizeUIKeys(events);
      if (_.isUndefined(eventsArg)) {this.events = events;}
  
      var combinedEvents = {};
  
      // look up if this view has behavior events
      var behaviorEvents = _.result(this, 'behaviorEvents') || {};
      var triggers = this.configureTriggers();
      var behaviorTriggers = _.result(this, 'behaviorTriggers') || {};
  
      // behavior events will be overriden by view events and or triggers
      _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers);
  
      Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
    },
  
    // Overriding Backbone.View's undelegateEvents to handle unbinding
    // the `triggers`, `modelEvents`, and `collectionEvents` config
    undelegateEvents: function() {
      Backbone.View.prototype.undelegateEvents.apply(this, arguments);
  
      this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
      this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));
  
      _.each(this._behaviors, function(behavior) {
        behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
        behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
      }, this);
  
      return this;
    },
  
    // Internal helper method to verify whether the view hasn't been destroyed
    _ensureViewIsIntact: function() {
      if (this.isDestroyed) {
        throw new Marionette.Error({
          name: 'ViewDestroyedError',
          message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
        });
      }
    },
  
    // Default `destroy` implementation, for removing a view from the
    // DOM and unbinding it. Regions will call this method
    // for you. You can specify an `onDestroy` method in your view to
    // add custom code that is called after the view is destroyed.
    destroy: function() {
      if (this.isDestroyed) { return this; }
  
      var args = _.toArray(arguments);
  
      this.triggerMethod.apply(this, ['before:destroy'].concat(args));
  
      // mark as destroyed before doing the actual destroy, to
      // prevent infinite loops within "destroy" event handlers
      // that are trying to destroy other views
      this.isDestroyed = true;
      this.triggerMethod.apply(this, ['destroy'].concat(args));
  
      // unbind UI elements
      this.unbindUIElements();
  
      this.isRendered = false;
  
      // remove the view from the DOM
      this.remove();
  
      // Call destroy on each behavior after
      // destroying the view.
      // This unbinds event listeners
      // that behaviors have registered for.
      _.invoke(this._behaviors, 'destroy', args);
  
      return this;
    },
  
    bindUIElements: function() {
      this._bindUIElements();
      _.invoke(this._behaviors, this._bindUIElements);
    },
  
    // This method binds the elements specified in the "ui" hash inside the view's code with
    // the associated jQuery selectors.
    _bindUIElements: function() {
      if (!this.ui) { return; }
  
      // store the ui hash in _uiBindings so they can be reset later
      // and so re-rendering the view will be able to find the bindings
      if (!this._uiBindings) {
        this._uiBindings = this.ui;
      }
  
      // get the bindings result, as a function or otherwise
      var bindings = _.result(this, '_uiBindings');
  
      // empty the ui so we don't have anything to start with
      this.ui = {};
  
      // bind each of the selectors
      _.each(bindings, function(selector, key) {
        this.ui[key] = this.$(selector);
      }, this);
    },
  
    // This method unbinds the elements specified in the "ui" hash
    unbindUIElements: function() {
      this._unbindUIElements();
      _.invoke(this._behaviors, this._unbindUIElements);
    },
  
    _unbindUIElements: function() {
      if (!this.ui || !this._uiBindings) { return; }
  
      // delete all of the existing ui bindings
      _.each(this.ui, function($el, name) {
        delete this.ui[name];
      }, this);
  
      // reset the ui element to the original bindings configuration
      this.ui = this._uiBindings;
      delete this._uiBindings;
    },
  
    // Internal method to create an event handler for a given `triggerDef` like
    // 'click:foo'
    _buildViewTrigger: function(triggerDef) {
  
      var options = _.defaults({}, triggerDef, {
        preventDefault: true,
        stopPropagation: true
      });
  
      var eventName = _.isObject(triggerDef) ? options.event : triggerDef;
  
      return function(e) {
        if (e) {
          if (e.preventDefault && options.preventDefault) {
            e.preventDefault();
          }
  
          if (e.stopPropagation && options.stopPropagation) {
            e.stopPropagation();
          }
        }
  
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };
  
        this.triggerMethod(eventName, args);
      };
    },
  
    setElement: function() {
      var ret = Backbone.View.prototype.setElement.apply(this, arguments);
  
      // proxy behavior $el to the view's $el.
      // This is needed because a view's $el proxy
      // is not set until after setElement is called.
      _.invoke(this._behaviors, 'proxyViewProperties', this);
  
      return ret;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: function() {
      var ret = Marionette._triggerMethod(this, arguments);
  
      this._triggerEventOnBehaviors(arguments);
      this._triggerEventOnParentLayout(arguments[0], _.rest(arguments));
  
      return ret;
    },
  
    _triggerEventOnBehaviors: function(args) {
      var triggerMethod = Marionette._triggerMethod;
      var behaviors = this._behaviors;
      // Use good ol' for as this is a very hot function
      for (var i = 0, length = behaviors && behaviors.length; i < length; i++) {
        triggerMethod(behaviors[i], args);
      }
    },
  
    _triggerEventOnParentLayout: function(eventName, args) {
      var layoutView = this._parentLayoutView();
      if (!layoutView) {
        return;
      }
  
      // invoke triggerMethod on parent view
      var eventPrefix = Marionette.getOption(layoutView, 'childViewEventPrefix');
      var prefixedEventName = eventPrefix + ':' + eventName;
      var callArgs = [this].concat(args);
  
      Marionette._triggerMethod(layoutView, prefixedEventName, callArgs);
  
      // call the parent view's childEvents handler
      var childEvents = Marionette.getOption(layoutView, 'childEvents');
      var normalizedChildEvents = layoutView.normalizeMethods(childEvents);
  
      if (normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName])) {
        normalizedChildEvents[eventName].apply(layoutView, callArgs);
      }
    },
  
    // This method returns any views that are immediate
    // children of this view
    _getImmediateChildren: function() {
      return [];
    },
  
    // Returns an array of every nested view within this view
    _getNestedViews: function() {
      var children = this._getImmediateChildren();
  
      if (!children.length) { return children; }
  
      return _.reduce(children, function(memo, view) {
        if (!view._getNestedViews) { return memo; }
        return memo.concat(view._getNestedViews());
      }, children);
    },
  
    // Internal utility for building an ancestor
    // view tree list.
    _getAncestors: function() {
      var ancestors = [];
      var parent  = this._parent;
  
      while (parent) {
        ancestors.push(parent);
        parent = parent._parent;
      }
  
      return ancestors;
    },
  
    // Returns the containing parent view.
    _parentLayoutView: function() {
      var ancestors = this._getAncestors();
      return _.find(ancestors, function(parent) {
        return parent instanceof Marionette.LayoutView;
      });
    },
  
    // Imports the "normalizeMethods" to transform hashes of
    // events=>function references/names to a hash of events=>function references
    normalizeMethods: Marionette.normalizeMethods,
  
    // A handy way to merge passed-in options onto the instance
    mergeOptions: Marionette.mergeOptions,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // Proxy `bindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  // Item View
  // ---------
  
  // A single item view implementation that contains code for rendering
  // with underscore.js templates, serializing the view's model or collection,
  // and calling several methods on extended views, such as `onRender`.
  Marionette.ItemView = Marionette.View.extend({
  
    // Setting up the inheritance chain which allows changes to
    // Marionette.View.prototype.constructor which allows overriding
    constructor: function() {
      Marionette.View.apply(this, arguments);
    },
  
    // Serialize the model or collection for the view. If a model is
    // found, the view's `serializeModel` is called. If a collection is found,
    // each model in the collection is serialized by calling
    // the view's `serializeCollection` and put into an `items` array in
    // the resulting data. If both are found, defaults to the model.
    // You can override the `serializeData` method in your own view definition,
    // to provide custom serialization for your view's data.
    serializeData: function() {
      if (!this.model && !this.collection) {
        return {};
      }
  
      var args = [this.model || this.collection];
      if (arguments.length) {
        args.push.apply(args, arguments);
      }
  
      if (this.model) {
        return this.serializeModel.apply(this, args);
      } else {
        return {
          items: this.serializeCollection.apply(this, args)
        };
      }
    },
  
    // Serialize a collection by serializing each of its models.
    serializeCollection: function(collection) {
      return collection.toJSON.apply(collection, _.rest(arguments));
    },
  
    // Render the view, defaulting to underscore.js templates.
    // You can override this in your view definition to provide
    // a very specific rendering for your view. In general, though,
    // you should override the `Marionette.Renderer` object to
    // change how Marionette renders views.
    render: function() {
      this._ensureViewIsIntact();
  
      this.triggerMethod('before:render', this);
  
      this._renderTemplate();
      this.isRendered = true;
      this.bindUIElements();
  
      this.triggerMethod('render', this);
  
      return this;
    },
  
    // Internal method to render the template with the serialized data
    // and template helpers via the `Marionette.Renderer` object.
    // Throws an `UndefinedTemplateError` error if the template is
    // any falsely value but literal `false`.
    _renderTemplate: function() {
      var template = this.getTemplate();
  
      // Allow template-less item views
      if (template === false) {
        return;
      }
  
      if (!template) {
        throw new Marionette.Error({
          name: 'UndefinedTemplateError',
          message: 'Cannot render the template since it is null or undefined.'
        });
      }
  
      // Add in entity data and template helpers
      var data = this.mixinTemplateHelpers(this.serializeData());
  
      // Render and add to el
      var html = Marionette.Renderer.render(template, data, this);
      this.attachElContent(html);
  
      return this;
    },
  
    // Attaches the content of a given view.
    // This method can be overridden to optimize rendering,
    // or to render in a non standard way.
    //
    // For example, using `innerHTML` instead of `$el.html`
    //
    // ```js
    // attachElContent: function(html) {
    //   this.el.innerHTML = html;
    //   return this;
    // }
    // ```
    attachElContent: function(html) {
      this.$el.html(html);
  
      return this;
    }
  });
  
  /* jshint maxstatements: 20, maxcomplexity: 7 */
  
  // Collection View
  // ---------------
  
  // A view that iterates over a Backbone.Collection
  // and renders an individual child view for each model.
  Marionette.CollectionView = Marionette.View.extend({
  
    // used as the prefix for child view events
    // that are forwarded through the collectionview
    childViewEventPrefix: 'childview',
  
    // flag for maintaining the sorted order of the collection
    sort: true,
  
    // constructor
    // option to pass `{sort: false}` to prevent the `CollectionView` from
    // maintaining the sorted order of the collection.
    // This will fallback onto appending childView's to the end.
    //
    // option to pass `{comparator: compFunction()}` to allow the `CollectionView`
    // to use a custom sort order for the collection.
    constructor: function(options) {
      this.once('render', this._initialEvents);
      this._initChildViewStorage();
  
      Marionette.View.apply(this, arguments);
  
      this.on({
        'before:show':   this._onBeforeShowCalled,
        'show':          this._onShowCalled,
        'before:attach': this._onBeforeAttachCalled,
        'attach':        this._onAttachCalled
      });
      this.initRenderBuffer();
    },
  
    // Instead of inserting elements one by one into the page,
    // it's much more performant to insert elements into a document
    // fragment and then insert that document fragment into the page
    initRenderBuffer: function() {
      this._bufferedChildren = [];
    },
  
    startBuffering: function() {
      this.initRenderBuffer();
      this.isBuffering = true;
    },
  
    endBuffering: function() {
      // Only trigger attach if already shown and attached, otherwise Region#show() handles this.
      var canTriggerAttach = this._isShown && Marionette.isNodeAttached(this.el);
      var nestedViews;
  
      this.isBuffering = false;
  
      if (this._isShown) {
        this._triggerMethodMany(this._bufferedChildren, this, 'before:show');
      }
      if (canTriggerAttach && this._triggerBeforeAttach) {
        nestedViews = this._getNestedViews();
        this._triggerMethodMany(nestedViews, this, 'before:attach');
      }
  
      this.attachBuffer(this, this._createBuffer());
  
      if (canTriggerAttach && this._triggerAttach) {
        nestedViews = this._getNestedViews();
        this._triggerMethodMany(nestedViews, this, 'attach');
      }
      if (this._isShown) {
        this._triggerMethodMany(this._bufferedChildren, this, 'show');
      }
      this.initRenderBuffer();
    },
  
    _triggerMethodMany: function(targets, source, eventName) {
      var args = _.drop(arguments, 3);
  
      _.each(targets, function(target) {
        Marionette.triggerMethodOn.apply(target, [target, eventName, target, source].concat(args));
      });
    },
  
    // Configured the initial events that the collection view
    // binds to.
    _initialEvents: function() {
      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onCollectionAdd);
        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
        this.listenTo(this.collection, 'reset', this.render);
  
        if (this.getOption('sort')) {
          this.listenTo(this.collection, 'sort', this._sortViews);
        }
      }
    },
  
    // Handle a child added to the collection
    _onCollectionAdd: function(child, collection, opts) {
      // `index` is present when adding with `at` since BB 1.2; indexOf fallback for < 1.2
      var index = opts.at !== undefined && (opts.index || collection.indexOf(child));
  
      // When filtered or when there is no initial index, calculate index.
      if (this.getOption('filter') || index === false) {
        index = _.indexOf(this._filteredSortedModels(index), child);
      }
  
      if (this._shouldAddChild(child, index)) {
        this.destroyEmptyView();
        var ChildView = this.getChildView(child);
        this.addChild(child, ChildView, index);
      }
    },
  
    // get the child view by model it holds, and remove it
    _onCollectionRemove: function(model) {
      var view = this.children.findByModel(model);
      this.removeChildView(view);
      this.checkEmpty();
    },
  
    _onBeforeShowCalled: function() {
      // Reset attach event flags at the top of the Region#show() event lifecycle; if the Region's
      // show() options permit onBeforeAttach/onAttach events, these flags will be set true again.
      this._triggerBeforeAttach = this._triggerAttach = false;
      this.children.each(function(childView) {
        Marionette.triggerMethodOn(childView, 'before:show', childView);
      });
    },
  
    _onShowCalled: function() {
      this.children.each(function(childView) {
        Marionette.triggerMethodOn(childView, 'show', childView);
      });
    },
  
    // If during Region#show() onBeforeAttach was fired, continue firing it for child views
    _onBeforeAttachCalled: function() {
      this._triggerBeforeAttach = true;
    },
  
    // If during Region#show() onAttach was fired, continue firing it for child views
    _onAttachCalled: function() {
      this._triggerAttach = true;
    },
  
    // Render children views. Override this method to
    // provide your own implementation of a render function for
    // the collection view.
    render: function() {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderChildren();
      this.isRendered = true;
      this.triggerMethod('render', this);
      return this;
    },
  
    // Reorder DOM after sorting. When your element's rendering
    // do not use their index, you can pass reorderOnSort: true
    // to only reorder the DOM after a sort instead of rendering
    // all the collectionView
    reorder: function() {
      var children = this.children;
      var models = this._filteredSortedModels();
      var modelsChanged = _.find(models, function(model) {
        return !children.findByModel(model);
      });
  
      // If the models we're displaying have changed due to filtering
      // We need to add and/or remove child views
      // So render as normal
      if (modelsChanged) {
        this.render();
      } else {
        // get the DOM nodes in the same order as the models
        var els = _.map(models, function(model, index) {
          var view = children.findByModel(model);
          view._index = index;
          return view.el;
        });
  
        // since append moves elements that are already in the DOM,
        // appending the elements will effectively reorder them
        this.triggerMethod('before:reorder');
        this._appendReorderedChildren(els);
        this.triggerMethod('reorder');
      }
    },
  
    // Render view after sorting. Override this method to
    // change how the view renders after a `sort` on the collection.
    // An example of this would be to only `renderChildren` in a `CompositeView`
    // rather than the full view.
    resortView: function() {
      if (Marionette.getOption(this, 'reorderOnSort')) {
        this.reorder();
      } else {
        this.render();
      }
    },
  
    // Internal method. This checks for any changes in the order of the collection.
    // If the index of any view doesn't match, it will render.
    _sortViews: function() {
      var models = this._filteredSortedModels();
  
      // check for any changes in sort order of views
      var orderChanged = _.find(models, function(item, index) {
        var view = this.children.findByModel(item);
        return !view || view._index !== index;
      }, this);
  
      if (orderChanged) {
        this.resortView();
      }
    },
  
    // Internal reference to what index a `emptyView` is.
    _emptyViewIndex: -1,
  
    // Internal method. Separated so that CompositeView can append to the childViewContainer
    // if necessary
    _appendReorderedChildren: function(children) {
      this.$el.append(children);
    },
  
    // Internal method. Separated so that CompositeView can have
    // more control over events being triggered, around the rendering
    // process
    _renderChildren: function() {
      this.destroyEmptyView();
      this.destroyChildren({checkEmpty: false});
  
      if (this.isEmpty(this.collection)) {
        this.showEmptyView();
      } else {
        this.triggerMethod('before:render:collection', this);
        this.startBuffering();
        this.showCollection();
        this.endBuffering();
        this.triggerMethod('render:collection', this);
  
        // If we have shown children and none have passed the filter, show the empty view
        if (this.children.isEmpty() && this.getOption('filter')) {
          this.showEmptyView();
        }
      }
    },
  
    // Internal method to loop through collection and show each child view.
    showCollection: function() {
      var ChildView;
  
      var models = this._filteredSortedModels();
  
      _.each(models, function(child, index) {
        ChildView = this.getChildView(child);
        this.addChild(child, ChildView, index);
      }, this);
    },
  
    // Allow the collection to be sorted by a custom view comparator
    _filteredSortedModels: function(addedAt) {
      var viewComparator = this.getViewComparator();
      var models = this.collection.models;
      addedAt = Math.min(Math.max(addedAt, 0), models.length - 1);
  
      if (viewComparator) {
        var addedModel;
        // Preserve `at` location, even for a sorted view
        if (addedAt) {
          addedModel = models[addedAt];
          models = models.slice(0, addedAt).concat(models.slice(addedAt + 1));
        }
        models = this._sortModelsBy(models, viewComparator);
        if (addedModel) {
          models.splice(addedAt, 0, addedModel);
        }
      }
  
      // Filter after sorting in case the filter uses the index
      if (this.getOption('filter')) {
        models = _.filter(models, function(model, index) {
          return this._shouldAddChild(model, index);
        }, this);
      }
  
      return models;
    },
  
    _sortModelsBy: function(models, comparator) {
      if (typeof comparator === 'string') {
        return _.sortBy(models, function(model) {
          return model.get(comparator);
        }, this);
      } else if (comparator.length === 1) {
        return _.sortBy(models, comparator, this);
      } else {
        return models.sort(_.bind(comparator, this));
      }
    },
  
    // Internal method to show an empty view in place of
    // a collection of child views, when the collection is empty
    showEmptyView: function() {
      var EmptyView = this.getEmptyView();
  
      if (EmptyView && !this._showingEmptyView) {
        this.triggerMethod('before:render:empty');
  
        this._showingEmptyView = true;
        var model = new Backbone.Model();
        this.addEmptyView(model, EmptyView);
  
        this.triggerMethod('render:empty');
      }
    },
  
    // Internal method to destroy an existing emptyView instance
    // if one exists. Called when a collection view has been
    // rendered empty, and then a child is added to the collection.
    destroyEmptyView: function() {
      if (this._showingEmptyView) {
        this.triggerMethod('before:remove:empty');
  
        this.destroyChildren();
        delete this._showingEmptyView;
  
        this.triggerMethod('remove:empty');
      }
    },
  
    // Retrieve the empty view class
    getEmptyView: function() {
      return this.getOption('emptyView');
    },
  
    // Render and show the emptyView. Similar to addChild method
    // but "add:child" events are not fired, and the event from
    // emptyView are not forwarded
    addEmptyView: function(child, EmptyView) {
      // Only trigger attach if already shown, attached, and not buffering, otherwise endBuffer() or
      // Region#show() handles this.
      var canTriggerAttach = this._isShown && !this.isBuffering && Marionette.isNodeAttached(this.el);
      var nestedViews;
  
      // get the emptyViewOptions, falling back to childViewOptions
      var emptyViewOptions = this.getOption('emptyViewOptions') ||
                            this.getOption('childViewOptions');
  
      if (_.isFunction(emptyViewOptions)) {
        emptyViewOptions = emptyViewOptions.call(this, child, this._emptyViewIndex);
      }
  
      // build the empty view
      var view = this.buildChildView(child, EmptyView, emptyViewOptions);
  
      view._parent = this;
  
      // Proxy emptyView events
      this.proxyChildEvents(view);
  
      view.once('render', function() {
        // trigger the 'before:show' event on `view` if the collection view has already been shown
        if (this._isShown) {
          Marionette.triggerMethodOn(view, 'before:show', view);
        }
  
        // Trigger `before:attach` following `render` to avoid adding logic and event triggers
        // to public method `renderChildView()`.
        if (canTriggerAttach && this._triggerBeforeAttach) {
          nestedViews = this._getViewAndNested(view);
          this._triggerMethodMany(nestedViews, this, 'before:attach');
        }
      }, this);
  
      // Store the `emptyView` like a `childView` so we can properly remove and/or close it later
      this.children.add(view);
      this.renderChildView(view, this._emptyViewIndex);
  
      // Trigger `attach`
      if (canTriggerAttach && this._triggerAttach) {
        nestedViews = this._getViewAndNested(view);
        this._triggerMethodMany(nestedViews, this, 'attach');
      }
      // call the 'show' method if the collection view has already been shown
      if (this._isShown) {
        Marionette.triggerMethodOn(view, 'show', view);
      }
    },
  
    // Retrieve the `childView` class, either from `this.options.childView`
    // or from the `childView` in the object definition. The "options"
    // takes precedence.
    // This method receives the model that will be passed to the instance
    // created from this `childView`. Overriding methods may use the child
    // to determine what `childView` class to return.
    getChildView: function(child) {
      var childView = this.getOption('childView');
  
      if (!childView) {
        throw new Marionette.Error({
          name: 'NoChildViewError',
          message: 'A "childView" must be specified'
        });
      }
  
      return childView;
    },
  
    // Render the child's view and add it to the
    // HTML for the collection view at a given index.
    // This will also update the indices of later views in the collection
    // in order to keep the children in sync with the collection.
    addChild: function(child, ChildView, index) {
      var childViewOptions = this.getOption('childViewOptions');
      childViewOptions = Marionette._getValue(childViewOptions, this, [child, index]);
  
      var view = this.buildChildView(child, ChildView, childViewOptions);
  
      // increment indices of views after this one
      this._updateIndices(view, true, index);
  
      this.triggerMethod('before:add:child', view);
      this._addChildView(view, index);
      this.triggerMethod('add:child', view);
  
      view._parent = this;
  
      return view;
    },
  
    // Internal method. This decrements or increments the indices of views after the
    // added/removed view to keep in sync with the collection.
    _updateIndices: function(view, increment, index) {
      if (!this.getOption('sort')) {
        return;
      }
  
      if (increment) {
        // assign the index to the view
        view._index = index;
      }
  
      // update the indexes of views after this one
      this.children.each(function(laterView) {
        if (laterView._index >= view._index) {
          laterView._index += increment ? 1 : -1;
        }
      });
    },
  
    // Internal Method. Add the view to children and render it at
    // the given index.
    _addChildView: function(view, index) {
      // Only trigger attach if already shown, attached, and not buffering, otherwise endBuffer() or
      // Region#show() handles this.
      var canTriggerAttach = this._isShown && !this.isBuffering && Marionette.isNodeAttached(this.el);
      var nestedViews;
  
      // set up the child view event forwarding
      this.proxyChildEvents(view);
  
      view.once('render', function() {
        // trigger the 'before:show' event on `view` if the collection view has already been shown
        if (this._isShown && !this.isBuffering) {
          Marionette.triggerMethodOn(view, 'before:show', view);
        }
  
        // Trigger `before:attach` following `render` to avoid adding logic and event triggers
        // to public method `renderChildView()`.
        if (canTriggerAttach && this._triggerBeforeAttach) {
          nestedViews = this._getViewAndNested(view);
          this._triggerMethodMany(nestedViews, this, 'before:attach');
        }
      }, this);
  
      // Store the child view itself so we can properly remove and/or destroy it later
      this.children.add(view);
      this.renderChildView(view, index);
  
      // Trigger `attach`
      if (canTriggerAttach && this._triggerAttach) {
        nestedViews = this._getViewAndNested(view);
        this._triggerMethodMany(nestedViews, this, 'attach');
      }
      // Trigger `show`
      if (this._isShown && !this.isBuffering) {
        Marionette.triggerMethodOn(view, 'show', view);
      }
    },
  
    // render the child view
    renderChildView: function(view, index) {
      if (!view.supportsRenderLifecycle) {
        Marionette.triggerMethodOn(view, 'before:render', view);
      }
      view.render();
      if (!view.supportsRenderLifecycle) {
        Marionette.triggerMethodOn(view, 'render', view);
      }
      this.attachHtml(this, view, index);
      return view;
    },
  
    // Build a `childView` for a model in the collection.
    buildChildView: function(child, ChildViewClass, childViewOptions) {
      var options = _.extend({model: child}, childViewOptions);
      var childView = new ChildViewClass(options);
      Marionette.MonitorDOMRefresh(childView);
      return childView;
    },
  
    // Remove the child view and destroy it.
    // This function also updates the indices of
    // later views in the collection in order to keep
    // the children in sync with the collection.
    removeChildView: function(view) {
      if (!view) { return view; }
  
      this.triggerMethod('before:remove:child', view);
  
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'before:destroy', view);
      }
      // call 'destroy' or 'remove', depending on which is found
      if (view.destroy) {
        view.destroy();
      } else {
        view.remove();
      }
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'destroy', view);
      }
  
      delete view._parent;
      this.stopListening(view);
      this.children.remove(view);
      this.triggerMethod('remove:child', view);
  
      // decrement the index of views after this one
      this._updateIndices(view, false);
  
      return view;
    },
  
    // check if the collection is empty
    isEmpty: function() {
      return !this.collection || this.collection.length === 0;
    },
  
    // If empty, show the empty view
    checkEmpty: function() {
      if (this.isEmpty(this.collection)) {
        this.showEmptyView();
      }
    },
  
    // You might need to override this if you've overridden attachHtml
    attachBuffer: function(collectionView, buffer) {
      collectionView.$el.append(buffer);
    },
  
    // Create a fragment buffer from the currently buffered children
    _createBuffer: function() {
      var elBuffer = document.createDocumentFragment();
      _.each(this._bufferedChildren, function(b) {
        elBuffer.appendChild(b.el);
      });
      return elBuffer;
    },
  
    // Append the HTML to the collection's `el`.
    // Override this method to do something other
    // than `.append`.
    attachHtml: function(collectionView, childView, index) {
      if (collectionView.isBuffering) {
        // buffering happens on reset events and initial renders
        // in order to reduce the number of inserts into the
        // document, which are expensive.
        collectionView._bufferedChildren.splice(index, 0, childView);
      } else {
        // If we've already rendered the main collection, append
        // the new child into the correct order if we need to. Otherwise
        // append to the end.
        if (!collectionView._insertBefore(childView, index)) {
          collectionView._insertAfter(childView);
        }
      }
    },
  
    // Internal method. Check whether we need to insert the view into
    // the correct position.
    _insertBefore: function(childView, index) {
      var currentView;
      var findPosition = this.getOption('sort') && (index < this.children.length - 1);
      if (findPosition) {
        // Find the view after this one
        currentView = this.children.find(function(view) {
          return view._index === index + 1;
        });
      }
  
      if (currentView) {
        currentView.$el.before(childView.el);
        return true;
      }
  
      return false;
    },
  
    // Internal method. Append a view to the end of the $el
    _insertAfter: function(childView) {
      this.$el.append(childView.el);
    },
  
    // Internal method to set up the `children` object for
    // storing all of the child views
    _initChildViewStorage: function() {
      this.children = new Backbone.ChildViewContainer();
    },
  
    // Handle cleanup and other destroying needs for the collection of views
    destroy: function() {
      if (this.isDestroyed) { return this; }
  
      this.triggerMethod('before:destroy:collection');
      this.destroyChildren({checkEmpty: false});
      this.triggerMethod('destroy:collection');
  
      return Marionette.View.prototype.destroy.apply(this, arguments);
    },
  
    // Destroy the child views that this collection view
    // is holding on to, if any
    destroyChildren: function(options) {
      var destroyOptions = options || {};
      var shouldCheckEmpty = true;
      var childViews = this.children.map(_.identity);
  
      if (!_.isUndefined(destroyOptions.checkEmpty)) {
        shouldCheckEmpty = destroyOptions.checkEmpty;
      }
  
      this.children.each(this.removeChildView, this);
  
      if (shouldCheckEmpty) {
        this.checkEmpty();
      }
      return childViews;
    },
  
    // Return true if the given child should be shown
    // Return false otherwise
    // The filter will be passed (child, index, collection)
    // Where
    //  'child' is the given model
    //  'index' is the index of that model in the collection
    //  'collection' is the collection referenced by this CollectionView
    _shouldAddChild: function(child, index) {
      var filter = this.getOption('filter');
      return !_.isFunction(filter) || filter.call(this, child, index, this.collection);
    },
  
    // Set up the child view event forwarding. Uses a "childview:"
    // prefix in front of all forwarded events.
    proxyChildEvents: function(view) {
      var prefix = this.getOption('childViewEventPrefix');
  
      // Forward all child view events through the parent,
      // prepending "childview:" to the event name
      this.listenTo(view, 'all', function() {
        var args = _.toArray(arguments);
        var rootEvent = args[0];
        var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));
  
        args[0] = prefix + ':' + rootEvent;
        args.splice(1, 0, view);
  
        // call collectionView childEvent if defined
        if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
          childEvents[rootEvent].apply(this, args.slice(1));
        }
  
        this.triggerMethod.apply(this, args);
      });
    },
  
    _getImmediateChildren: function() {
      return _.values(this.children._views);
    },
  
    _getViewAndNested: function(view) {
      // This will not fail on Backbone.View which does not have #_getNestedViews.
      return [view].concat(_.result(view, '_getNestedViews') || []);
    },
  
    getViewComparator: function() {
      return this.getOption('viewComparator');
    }
  });
  
  /* jshint maxstatements: 17, maxlen: 117 */
  
  // Composite View
  // --------------
  
  // Used for rendering a branch-leaf, hierarchical structure.
  // Extends directly from CollectionView and also renders an
  // a child view as `modelView`, for the top leaf
  Marionette.CompositeView = Marionette.CollectionView.extend({
  
    // Setting up the inheritance chain which allows changes to
    // Marionette.CollectionView.prototype.constructor which allows overriding
    // option to pass '{sort: false}' to prevent the CompositeView from
    // maintaining the sorted order of the collection.
    // This will fallback onto appending childView's to the end.
    constructor: function() {
      Marionette.CollectionView.apply(this, arguments);
    },
  
    // Configured the initial events that the composite view
    // binds to. Override this method to prevent the initial
    // events, or to add your own initial events.
    _initialEvents: function() {
  
      // Bind only after composite view is rendered to avoid adding child views
      // to nonexistent childViewContainer
  
      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onCollectionAdd);
        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
        this.listenTo(this.collection, 'reset', this._renderChildren);
  
        if (this.getOption('sort')) {
          this.listenTo(this.collection, 'sort', this._sortViews);
        }
      }
    },
  
    // Retrieve the `childView` to be used when rendering each of
    // the items in the collection. The default is to return
    // `this.childView` or Marionette.CompositeView if no `childView`
    // has been defined
    getChildView: function(child) {
      var childView = this.getOption('childView') || this.constructor;
  
      return childView;
    },
  
    // Serialize the model for the view.
    // You can override the `serializeData` method in your own view
    // definition, to provide custom serialization for your view's data.
    serializeData: function() {
      var data = {};
  
      if (this.model) {
        data = _.partial(this.serializeModel, this.model).apply(this, arguments);
      }
  
      return data;
    },
  
    // Renders the model and the collection.
    render: function() {
      this._ensureViewIsIntact();
      this._isRendering = true;
      this.resetChildViewContainer();
  
      this.triggerMethod('before:render', this);
  
      this._renderTemplate();
      this._renderChildren();
  
      this._isRendering = false;
      this.isRendered = true;
      this.triggerMethod('render', this);
      return this;
    },
  
    _renderChildren: function() {
      if (this.isRendered || this._isRendering) {
        Marionette.CollectionView.prototype._renderChildren.call(this);
      }
    },
  
    // Render the root template that the children
    // views are appended to
    _renderTemplate: function() {
      var data = {};
      data = this.serializeData();
      data = this.mixinTemplateHelpers(data);
  
      this.triggerMethod('before:render:template');
  
      var template = this.getTemplate();
      var html = Marionette.Renderer.render(template, data, this);
      this.attachElContent(html);
  
      // the ui bindings is done here and not at the end of render since they
      // will not be available until after the model is rendered, but should be
      // available before the collection is rendered.
      this.bindUIElements();
      this.triggerMethod('render:template');
    },
  
    // Attaches the content of the root.
    // This method can be overridden to optimize rendering,
    // or to render in a non standard way.
    //
    // For example, using `innerHTML` instead of `$el.html`
    //
    // ```js
    // attachElContent: function(html) {
    //   this.el.innerHTML = html;
    //   return this;
    // }
    // ```
    attachElContent: function(html) {
      this.$el.html(html);
  
      return this;
    },
  
    // You might need to override this if you've overridden attachHtml
    attachBuffer: function(compositeView, buffer) {
      var $container = this.getChildViewContainer(compositeView);
      $container.append(buffer);
    },
  
    // Internal method. Append a view to the end of the $el.
    // Overidden from CollectionView to ensure view is appended to
    // childViewContainer
    _insertAfter: function(childView) {
      var $container = this.getChildViewContainer(this, childView);
      $container.append(childView.el);
    },
  
    // Internal method. Append reordered childView'.
    // Overidden from CollectionView to ensure reordered views
    // are appended to childViewContainer
    _appendReorderedChildren: function(children) {
      var $container = this.getChildViewContainer(this);
      $container.append(children);
    },
  
    // Internal method to ensure an `$childViewContainer` exists, for the
    // `attachHtml` method to use.
    getChildViewContainer: function(containerView, childView) {
      if (!!containerView.$childViewContainer) {
        return containerView.$childViewContainer;
      }
  
      var container;
      var childViewContainer = Marionette.getOption(containerView, 'childViewContainer');
      if (childViewContainer) {
  
        var selector = Marionette._getValue(childViewContainer, containerView);
  
        if (selector.charAt(0) === '@' && containerView.ui) {
          container = containerView.ui[selector.substr(4)];
        } else {
          container = containerView.$(selector);
        }
  
        if (container.length <= 0) {
          throw new Marionette.Error({
            name: 'ChildViewContainerMissingError',
            message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
          });
        }
  
      } else {
        container = containerView.$el;
      }
  
      containerView.$childViewContainer = container;
      return container;
    },
  
    // Internal method to reset the `$childViewContainer` on render
    resetChildViewContainer: function() {
      if (this.$childViewContainer) {
        this.$childViewContainer = undefined;
      }
    }
  });
  
  // Layout View
  // -----------
  
  // Used for managing application layoutViews, nested layoutViews and
  // multiple regions within an application or sub-application.
  //
  // A specialized view class that renders an area of HTML and then
  // attaches `Region` instances to the specified `regions`.
  // Used for composite view management and sub-application areas.
  Marionette.LayoutView = Marionette.ItemView.extend({
    regionClass: Marionette.Region,
  
    options: {
      destroyImmediate: false
    },
  
    // used as the prefix for child view events
    // that are forwarded through the layoutview
    childViewEventPrefix: 'childview',
  
    // Ensure the regions are available when the `initialize` method
    // is called.
    constructor: function(options) {
      options = options || {};
  
      this._firstRender = true;
      this._initializeRegions(options);
  
      Marionette.ItemView.call(this, options);
    },
  
    // LayoutView's render will use the existing region objects the
    // first time it is called. Subsequent calls will destroy the
    // views that the regions are showing and then reset the `el`
    // for the regions to the newly rendered DOM elements.
    render: function() {
      this._ensureViewIsIntact();
  
      if (this._firstRender) {
        // if this is the first render, don't do anything to
        // reset the regions
        this._firstRender = false;
      } else {
        // If this is not the first render call, then we need to
        // re-initialize the `el` for each region
        this._reInitializeRegions();
      }
  
      return Marionette.ItemView.prototype.render.apply(this, arguments);
    },
  
    // Handle destroying regions, and then destroy the view itself.
    destroy: function() {
      if (this.isDestroyed) { return this; }
      // #2134: remove parent element before destroying the child views, so
      // removing the child views doesn't retrigger repaints
      if (this.getOption('destroyImmediate') === true) {
        this.$el.remove();
      }
      this.regionManager.destroy();
      return Marionette.ItemView.prototype.destroy.apply(this, arguments);
    },
  
    showChildView: function(regionName, view) {
      return this.getRegion(regionName).show(view);
    },
  
    getChildView: function(regionName) {
      return this.getRegion(regionName).currentView;
    },
  
    // Add a single region, by name, to the layoutView
    addRegion: function(name, definition) {
      var regions = {};
      regions[name] = definition;
      return this._buildRegions(regions)[name];
    },
  
    // Add multiple regions as a {name: definition, name2: def2} object literal
    addRegions: function(regions) {
      this.regions = _.extend({}, this.regions, regions);
      return this._buildRegions(regions);
    },
  
    // Remove a single region from the LayoutView, by name
    removeRegion: function(name) {
      delete this.regions[name];
      return this.regionManager.removeRegion(name);
    },
  
    // Provides alternative access to regions
    // Accepts the region name
    // getRegion('main')
    getRegion: function(region) {
      return this.regionManager.get(region);
    },
  
    // Get all regions
    getRegions: function() {
      return this.regionManager.getRegions();
    },
  
    // internal method to build regions
    _buildRegions: function(regions) {
      var defaults = {
        regionClass: this.getOption('regionClass'),
        parentEl: _.partial(_.result, this, 'el')
      };
  
      return this.regionManager.addRegions(regions, defaults);
    },
  
    // Internal method to initialize the regions that have been defined in a
    // `regions` attribute on this layoutView.
    _initializeRegions: function(options) {
      var regions;
      this._initRegionManager();
  
      regions = Marionette._getValue(this.regions, this, [options]) || {};
  
      // Enable users to define `regions` as instance options.
      var regionOptions = this.getOption.call(options, 'regions');
  
      // enable region options to be a function
      regionOptions = Marionette._getValue(regionOptions, this, [options]);
  
      _.extend(regions, regionOptions);
  
      // Normalize region selectors hash to allow
      // a user to use the @ui. syntax.
      regions = this.normalizeUIValues(regions, ['selector', 'el']);
  
      this.addRegions(regions);
    },
  
    // Internal method to re-initialize all of the regions by updating the `el` that
    // they point to
    _reInitializeRegions: function() {
      this.regionManager.invoke('reset');
    },
  
    // Enable easy overriding of the default `RegionManager`
    // for customized region interactions and business specific
    // view logic for better control over single regions.
    getRegionManager: function() {
      return new Marionette.RegionManager();
    },
  
    // Internal method to initialize the region manager
    // and all regions in it
    _initRegionManager: function() {
      this.regionManager = this.getRegionManager();
      this.regionManager._parent = this;
  
      this.listenTo(this.regionManager, 'before:add:region', function(name) {
        this.triggerMethod('before:add:region', name);
      });
  
      this.listenTo(this.regionManager, 'add:region', function(name, region) {
        this[name] = region;
        this.triggerMethod('add:region', name, region);
      });
  
      this.listenTo(this.regionManager, 'before:remove:region', function(name) {
        this.triggerMethod('before:remove:region', name);
      });
  
      this.listenTo(this.regionManager, 'remove:region', function(name, region) {
        delete this[name];
        this.triggerMethod('remove:region', name, region);
      });
    },
  
    _getImmediateChildren: function() {
      return _.chain(this.regionManager.getRegions())
        .pluck('currentView')
        .compact()
        .value();
    }
  });
  

  // Behavior
  // --------
  
  // A Behavior is an isolated set of DOM /
  // user interactions that can be mixed into any View.
  // Behaviors allow you to blackbox View specific interactions
  // into portable logical chunks, keeping your views simple and your code DRY.
  
  Marionette.Behavior = Marionette.Object.extend({
    constructor: function(options, view) {
      // Setup reference to the view.
      // this comes in handle when a behavior
      // wants to directly talk up the chain
      // to the view.
      this.view = view;
      this.defaults = _.result(this, 'defaults') || {};
      this.options  = _.extend({}, this.defaults, options);
      // Construct an internal UI hash using
      // the views UI hash and then the behaviors UI hash.
      // This allows the user to use UI hash elements
      // defined in the parent view as well as those
      // defined in the given behavior.
      this.ui = _.extend({}, _.result(view, 'ui'), _.result(this, 'ui'));
  
      Marionette.Object.apply(this, arguments);
    },
  
    // proxy behavior $ method to the view
    // this is useful for doing jquery DOM lookups
    // scoped to behaviors view.
    $: function() {
      return this.view.$.apply(this.view, arguments);
    },
  
    // Stops the behavior from listening to events.
    // Overrides Object#destroy to prevent additional events from being triggered.
    destroy: function() {
      this.stopListening();
  
      return this;
    },
  
    proxyViewProperties: function(view) {
      this.$el = view.$el;
      this.el = view.el;
    }
  });
  
  /* jshint maxlen: 143 */
  // Behaviors
  // ---------
  
  // Behaviors is a utility class that takes care of
  // gluing your behavior instances to their given View.
  // The most important part of this class is that you
  // **MUST** override the class level behaviorsLookup
  // method for things to work properly.
  
  Marionette.Behaviors = (function(Marionette, _) {
    // Borrow event splitter from Backbone
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
  
    function Behaviors(view, behaviors) {
  
      if (!_.isObject(view.behaviors)) {
        return {};
      }
  
      // Behaviors defined on a view can be a flat object literal
      // or it can be a function that returns an object.
      behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));
  
      // Wraps several of the view's methods
      // calling the methods first on each behavior
      // and then eventually calling the method on the view.
      Behaviors.wrap(view, behaviors, _.keys(methods));
      return behaviors;
    }
  
    var methods = {
      behaviorTriggers: function(behaviorTriggers, behaviors) {
        var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
        return triggerBuilder.buildBehaviorTriggers();
      },
  
      behaviorEvents: function(behaviorEvents, behaviors) {
        var _behaviorsEvents = {};
  
        _.each(behaviors, function(b, i) {
          var _events = {};
          var behaviorEvents = _.clone(_.result(b, 'events')) || {};
  
          // Normalize behavior events hash to allow
          // a user to use the @ui. syntax.
          behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, getBehaviorsUI(b));
  
          var j = 0;
          _.each(behaviorEvents, function(behaviour, key) {
            var match     = key.match(delegateEventSplitter);
  
            // Set event name to be namespaced using the view cid,
            // the behavior index, and the behavior event index
            // to generate a non colliding event namespace
            // http://api.jquery.com/event.namespace/
            var eventName = match[1] + '.' + [this.cid, i, j++, ' '].join('');
            var selector  = match[2];
  
            var eventKey  = eventName + selector;
            var handler   = _.isFunction(behaviour) ? behaviour : b[behaviour];
  
            _events[eventKey] = _.bind(handler, b);
          }, this);
  
          _behaviorsEvents = _.extend(_behaviorsEvents, _events);
        }, this);
  
        return _behaviorsEvents;
      }
    };
  
    _.extend(Behaviors, {
  
      // Placeholder method to be extended by the user.
      // The method should define the object that stores the behaviors.
      // i.e.
      //
      // ```js
      // Marionette.Behaviors.behaviorsLookup: function() {
      //   return App.Behaviors
      // }
      // ```
      behaviorsLookup: function() {
        throw new Marionette.Error({
          message: 'You must define where your behaviors are stored.',
          url: 'marionette.behaviors.html#behaviorslookup'
        });
      },
  
      // Takes care of getting the behavior class
      // given options and a key.
      // If a user passes in options.behaviorClass
      // default to using that. Otherwise delegate
      // the lookup to the users `behaviorsLookup` implementation.
      getBehaviorClass: function(options, key) {
        if (options.behaviorClass) {
          return options.behaviorClass;
        }
  
        // Get behavior class can be either a flat object or a method
        return Marionette._getValue(Behaviors.behaviorsLookup, this, [options, key])[key];
      },
  
      // Iterate over the behaviors object, for each behavior
      // instantiate it and get its grouped behaviors.
      parseBehaviors: function(view, behaviors) {
        return _.chain(behaviors).map(function(options, key) {
          var BehaviorClass = Behaviors.getBehaviorClass(options, key);
  
          var behavior = new BehaviorClass(options, view);
          var nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, 'behaviors'));
  
          return [behavior].concat(nestedBehaviors);
        }).flatten().value();
      },
  
      // Wrap view internal methods so that they delegate to behaviors. For example,
      // `onDestroy` should trigger destroy on all of the behaviors and then destroy itself.
      // i.e.
      //
      // `view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);`
      wrap: function(view, behaviors, methodNames) {
        _.each(methodNames, function(methodName) {
          view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
        });
      }
    });
  
    // Class to build handlers for `triggers` on behaviors
    // for views
    function BehaviorTriggersBuilder(view, behaviors) {
      this._view      = view;
      this._behaviors = behaviors;
      this._triggers  = {};
    }
  
    _.extend(BehaviorTriggersBuilder.prototype, {
      // Main method to build the triggers hash with event keys and handlers
      buildBehaviorTriggers: function() {
        _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this);
        return this._triggers;
      },
  
      // Internal method to build all trigger handlers for a given behavior
      _buildTriggerHandlersForBehavior: function(behavior, i) {
        var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};
  
        triggersHash = Marionette.normalizeUIKeys(triggersHash, getBehaviorsUI(behavior));
  
        _.each(triggersHash, _.bind(this._setHandlerForBehavior, this, behavior, i));
      },
  
      // Internal method to create and assign the trigger handler for a given
      // behavior
      _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
        // Unique identifier for the `this._triggers` hash
        var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
          return triggerName + '.' + 'behaviortriggers' + i;
        });
  
        this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
      }
    });
  
    function getBehaviorsUI(behavior) {
      return behavior._uiBindings || behavior.ui;
    }
  
    return Behaviors;
  
  })(Marionette, _);
  

  // App Router
  // ----------
  
  // Reduce the boilerplate code of handling route events
  // and then calling a single method on another object.
  // Have your routers configured to call the method on
  // your object, directly.
  //
  // Configure an AppRouter with `appRoutes`.
  //
  // App routers can only take one `controller` object.
  // It is recommended that you divide your controller
  // objects in to smaller pieces of related functionality
  // and have multiple routers / controllers, instead of
  // just one giant router and controller.
  //
  // You can also add standard routes to an AppRouter.
  
  Marionette.AppRouter = Backbone.Router.extend({
  
    constructor: function(options) {
      this.options = options || {};
  
      Backbone.Router.apply(this, arguments);
  
      var appRoutes = this.getOption('appRoutes');
      var controller = this._getController();
      this.processAppRoutes(controller, appRoutes);
      this.on('route', this._processOnRoute, this);
    },
  
    // Similar to route method on a Backbone Router but
    // method is called on the controller
    appRoute: function(route, methodName) {
      var controller = this._getController();
      this._addAppRoute(controller, route, methodName);
    },
  
    // process the route event and trigger the onRoute
    // method call, if it exists
    _processOnRoute: function(routeName, routeArgs) {
      // make sure an onRoute before trying to call it
      if (_.isFunction(this.onRoute)) {
        // find the path that matches the current route
        var routePath = _.invert(this.getOption('appRoutes'))[routeName];
        this.onRoute(routeName, routePath, routeArgs);
      }
    },
  
    // Internal method to process the `appRoutes` for the
    // router, and turn them in to routes that trigger the
    // specified method on the specified `controller`.
    processAppRoutes: function(controller, appRoutes) {
      if (!appRoutes) { return; }
  
      var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes
  
      _.each(routeNames, function(route) {
        this._addAppRoute(controller, route, appRoutes[route]);
      }, this);
    },
  
    _getController: function() {
      return this.getOption('controller');
    },
  
    _addAppRoute: function(controller, route, methodName) {
      var method = controller[methodName];
  
      if (!method) {
        throw new Marionette.Error('Method "' + methodName + '" was not found on the controller');
      }
  
      this.route(route, methodName, _.bind(method, controller));
    },
  
    mergeOptions: Marionette.mergeOptions,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    triggerMethod: Marionette.triggerMethod,
  
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  // Application
  // -----------
  
  // Contain and manage the composite application as a whole.
  // Stores and starts up `Region` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = Marionette.Object.extend({
    constructor: function(options) {
      this._initializeRegions(options);
      this._initCallbacks = new Marionette.Callbacks();
      this.submodules = {};
      _.extend(this, options);
      this._initChannel();
      Marionette.Object.apply(this, arguments);
    },
  
    // Command execution, facilitated by Backbone.Wreqr.Commands
    execute: function() {
      this.commands.execute.apply(this.commands, arguments);
    },
  
    // Request/response, facilitated by Backbone.Wreqr.RequestResponse
    request: function() {
      return this.reqres.request.apply(this.reqres, arguments);
    },
  
    // Add an initializer that is either run at when the `start`
    // method is called, or run immediately if added after `start`
    // has already been called.
    addInitializer: function(initializer) {
      this._initCallbacks.add(initializer);
    },
  
    // kick off all of the application's processes.
    // initializes all of the regions that have been added
    // to the app, and runs all of the initializer functions
    start: function(options) {
      this.triggerMethod('before:start', options);
      this._initCallbacks.run(options, this);
      this.triggerMethod('start', options);
    },
  
    // Add regions to your app.
    // Accepts a hash of named strings or Region objects
    // addRegions({something: "#someRegion"})
    // addRegions({something: Region.extend({el: "#someRegion"}) });
    addRegions: function(regions) {
      return this._regionManager.addRegions(regions);
    },
  
    // Empty all regions in the app, without removing them
    emptyRegions: function() {
      return this._regionManager.emptyRegions();
    },
  
    // Removes a region from your app, by name
    // Accepts the regions name
    // removeRegion('myRegion')
    removeRegion: function(region) {
      return this._regionManager.removeRegion(region);
    },
  
    // Provides alternative access to regions
    // Accepts the region name
    // getRegion('main')
    getRegion: function(region) {
      return this._regionManager.get(region);
    },
  
    // Get all the regions from the region manager
    getRegions: function() {
      return this._regionManager.getRegions();
    },
  
    // Create a module, attached to the application
    module: function(moduleNames, moduleDefinition) {
  
      // Overwrite the module class if the user specifies one
      var ModuleClass = Marionette.Module.getClass(moduleDefinition);
  
      var args = _.toArray(arguments);
      args.unshift(this);
  
      // see the Marionette.Module object for more information
      return ModuleClass.create.apply(ModuleClass, args);
    },
  
    // Enable easy overriding of the default `RegionManager`
    // for customized region interactions and business-specific
    // view logic for better control over single regions.
    getRegionManager: function() {
      return new Marionette.RegionManager();
    },
  
    // Internal method to initialize the regions that have been defined in a
    // `regions` attribute on the application instance
    _initializeRegions: function(options) {
      var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};
  
      this._initRegionManager();
  
      // Enable users to define `regions` in instance options.
      var optionRegions = Marionette.getOption(options, 'regions');
  
      // Enable region options to be a function
      if (_.isFunction(optionRegions)) {
        optionRegions = optionRegions.call(this, options);
      }
  
      // Overwrite current regions with those passed in options
      _.extend(regions, optionRegions);
  
      this.addRegions(regions);
  
      return this;
    },
  
    // Internal method to set up the region manager
    _initRegionManager: function() {
      this._regionManager = this.getRegionManager();
      this._regionManager._parent = this;
  
      this.listenTo(this._regionManager, 'before:add:region', function() {
        Marionette._triggerMethod(this, 'before:add:region', arguments);
      });
  
      this.listenTo(this._regionManager, 'add:region', function(name, region) {
        this[name] = region;
        Marionette._triggerMethod(this, 'add:region', arguments);
      });
  
      this.listenTo(this._regionManager, 'before:remove:region', function() {
        Marionette._triggerMethod(this, 'before:remove:region', arguments);
      });
  
      this.listenTo(this._regionManager, 'remove:region', function(name) {
        delete this[name];
        Marionette._triggerMethod(this, 'remove:region', arguments);
      });
    },
  
    // Internal method to setup the Wreqr.radio channel
    _initChannel: function() {
      this.channelName = _.result(this, 'channelName') || 'global';
      this.channel = _.result(this, 'channel') || Backbone.Wreqr.radio.channel(this.channelName);
      this.vent = _.result(this, 'vent') || this.channel.vent;
      this.commands = _.result(this, 'commands') || this.channel.commands;
      this.reqres = _.result(this, 'reqres') || this.channel.reqres;
    }
  });
  
  /* jshint maxparams: 9 */
  
  // Module
  // ------
  
  // A simple module system, used to create privacy and encapsulation in
  // Marionette applications
  Marionette.Module = function(moduleName, app, options) {
    this.moduleName = moduleName;
    this.options = _.extend({}, this.options, options);
    // Allow for a user to overide the initialize
    // for a given module instance.
    this.initialize = options.initialize || this.initialize;
  
    // Set up an internal store for sub-modules.
    this.submodules = {};
  
    this._setupInitializersAndFinalizers();
  
    // Set an internal reference to the app
    // within a module.
    this.app = app;
  
    if (_.isFunction(this.initialize)) {
      this.initialize(moduleName, app, this.options);
    }
  };
  
  Marionette.Module.extend = Marionette.extend;
  
  // Extend the Module prototype with events / listenTo, so that the module
  // can be used as an event aggregator or pub/sub.
  _.extend(Marionette.Module.prototype, Backbone.Events, {
  
    // By default modules start with their parents.
    startWithParent: true,
  
    // Initialize is an empty function by default. Override it with your own
    // initialization logic when extending Marionette.Module.
    initialize: function() {},
  
    // Initializer for a specific module. Initializers are run when the
    // module's `start` method is called.
    addInitializer: function(callback) {
      this._initializerCallbacks.add(callback);
    },
  
    // Finalizers are run when a module is stopped. They are used to teardown
    // and finalize any variables, references, events and other code that the
    // module had set up.
    addFinalizer: function(callback) {
      this._finalizerCallbacks.add(callback);
    },
  
    // Start the module, and run all of its initializers
    start: function(options) {
      // Prevent re-starting a module that is already started
      if (this._isInitialized) { return; }
  
      // start the sub-modules (depth-first hierarchy)
      _.each(this.submodules, function(mod) {
        // check to see if we should start the sub-module with this parent
        if (mod.startWithParent) {
          mod.start(options);
        }
      });
  
      // run the callbacks to "start" the current module
      this.triggerMethod('before:start', options);
  
      this._initializerCallbacks.run(options, this);
      this._isInitialized = true;
  
      this.triggerMethod('start', options);
    },
  
    // Stop this module by running its finalizers and then stop all of
    // the sub-modules for this module
    stop: function() {
      // if we are not initialized, don't bother finalizing
      if (!this._isInitialized) { return; }
      this._isInitialized = false;
  
      this.triggerMethod('before:stop');
  
      // stop the sub-modules; depth-first, to make sure the
      // sub-modules are stopped / finalized before parents
      _.invoke(this.submodules, 'stop');
  
      // run the finalizers
      this._finalizerCallbacks.run(undefined, this);
  
      // reset the initializers and finalizers
      this._initializerCallbacks.reset();
      this._finalizerCallbacks.reset();
  
      this.triggerMethod('stop');
    },
  
    // Configure the module with a definition function and any custom args
    // that are to be passed in to the definition function
    addDefinition: function(moduleDefinition, customArgs) {
      this._runModuleDefinition(moduleDefinition, customArgs);
    },
  
    // Internal method: run the module definition function with the correct
    // arguments
    _runModuleDefinition: function(definition, customArgs) {
      // If there is no definition short circut the method.
      if (!definition) { return; }
  
      // build the correct list of arguments for the module definition
      var args = _.flatten([
        this,
        this.app,
        Backbone,
        Marionette,
        Backbone.$, _,
        customArgs
      ]);
  
      definition.apply(this, args);
    },
  
    // Internal method: set up new copies of initializers and finalizers.
    // Calling this method will wipe out all existing initializers and
    // finalizers.
    _setupInitializersAndFinalizers: function() {
      this._initializerCallbacks = new Marionette.Callbacks();
      this._finalizerCallbacks = new Marionette.Callbacks();
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod
  });
  
  // Class methods to create modules
  _.extend(Marionette.Module, {
  
    // Create a module, hanging off the app parameter as the parent object.
    create: function(app, moduleNames, moduleDefinition) {
      var module = app;
  
      // get the custom args passed in after the module definition and
      // get rid of the module name and definition function
      var customArgs = _.drop(arguments, 3);
  
      // Split the module names and get the number of submodules.
      // i.e. an example module name of `Doge.Wow.Amaze` would
      // then have the potential for 3 module definitions.
      moduleNames = moduleNames.split('.');
      var length = moduleNames.length;
  
      // store the module definition for the last module in the chain
      var moduleDefinitions = [];
      moduleDefinitions[length - 1] = moduleDefinition;
  
      // Loop through all the parts of the module definition
      _.each(moduleNames, function(moduleName, i) {
        var parentModule = module;
        module = this._getModule(parentModule, moduleName, app, moduleDefinition);
        this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
      }, this);
  
      // Return the last module in the definition chain
      return module;
    },
  
    _getModule: function(parentModule, moduleName, app, def, args) {
      var options = _.extend({}, def);
      var ModuleClass = this.getClass(def);
  
      // Get an existing module of this name if we have one
      var module = parentModule[moduleName];
  
      if (!module) {
        // Create a new module if we don't have one
        module = new ModuleClass(moduleName, app, options);
        parentModule[moduleName] = module;
        // store the module on the parent
        parentModule.submodules[moduleName] = module;
      }
  
      return module;
    },
  
    // ## Module Classes
    //
    // Module classes can be used as an alternative to the define pattern.
    // The extend function of a Module is identical to the extend functions
    // on other Backbone and Marionette classes.
    // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
    getClass: function(moduleDefinition) {
      var ModuleClass = Marionette.Module;
  
      if (!moduleDefinition) {
        return ModuleClass;
      }
  
      // If all of the module's functionality is defined inside its class,
      // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
      if (moduleDefinition.prototype instanceof ModuleClass) {
        return moduleDefinition;
      }
  
      return moduleDefinition.moduleClass || ModuleClass;
    },
  
    // Add the module definition and add a startWithParent initializer function.
    // This is complicated because module definitions are heavily overloaded
    // and support an anonymous function, module class, or options object
    _addModuleDefinition: function(parentModule, module, def, args) {
      var fn = this._getDefine(def);
      var startWithParent = this._getStartWithParent(def, module);
  
      if (fn) {
        module.addDefinition(fn, args);
      }
  
      this._addStartWithParent(parentModule, module, startWithParent);
    },
  
    _getStartWithParent: function(def, module) {
      var swp;
  
      if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
        swp = module.constructor.prototype.startWithParent;
        return _.isUndefined(swp) ? true : swp;
      }
  
      if (_.isObject(def)) {
        swp = def.startWithParent;
        return _.isUndefined(swp) ? true : swp;
      }
  
      return true;
    },
  
    _getDefine: function(def) {
      if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
        return def;
      }
  
      if (_.isObject(def)) {
        return def.define;
      }
  
      return null;
    },
  
    _addStartWithParent: function(parentModule, module, startWithParent) {
      module.startWithParent = module.startWithParent && startWithParent;
  
      if (!module.startWithParent || !!module.startWithParentIsConfigured) {
        return;
      }
  
      module.startWithParentIsConfigured = true;
  
      parentModule.addInitializer(function(options) {
        if (module.startWithParent) {
          module.start(options);
        }
      });
    }
  });
  

  return Marionette;
}));

},{"./../../../../assets/js/src/admin/vendor/backbone-shim.js":29,"./../../../../assets/js/src/admin/vendor/underscore-shim.js":34,"backbone.babysitter":35,"backbone.wreqr":39}],37:[function(require,module,exports){
// Backbone.Radio v1.0.2
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require('./../../../assets/js/src/admin/vendor/underscore-shim.js'), require('./../../../assets/js/src/admin/vendor/backbone-shim.js')) : typeof define === "function" && define.amd ? define(["underscore", "backbone"], factory) : global.Backbone.Radio = factory(global._, global.Backbone);
})(this, function (_, Backbone) {
  "use strict";

  var previousRadio = Backbone.Radio;

  var Radio = Backbone.Radio = {};

  Radio.VERSION = "1.0.2";

  // This allows you to run multiple instances of Radio on the same
  // webapp. After loading the new version, call `noConflict()` to
  // get a reference to it. At the same time the old version will be
  // returned to Backbone.Radio.
  Radio.noConflict = function () {
    Backbone.Radio = previousRadio;
    return this;
  };

  // Whether or not we're in DEBUG mode or not. DEBUG mode helps you
  // get around the issues of lack of warnings when events are mis-typed.
  Radio.DEBUG = false;

  // Format debug text.
  Radio._debugText = function (warning, eventName, channelName) {
    return warning + (channelName ? " on the " + channelName + " channel" : "") + ": \"" + eventName + "\"";
  };

  // This is the method that's called when an unregistered event was called.
  // By default, it logs warning to the console. By overriding this you could
  // make it throw an Error, for instance. This would make firing a nonexistent event
  // have the same consequence as firing a nonexistent method on an Object.
  Radio.debugLog = function (warning, eventName, channelName) {
    if (Radio.DEBUG && console && console.warn) {
      console.warn(Radio._debugText(warning, eventName, channelName));
    }
  };

  var eventSplitter = /\s+/;

  // An internal method used to handle Radio's method overloading for Requests.
  // It's borrowed from Backbone.Events. It differs from Backbone's overload
  // API (which is used in Backbone.Events) in that it doesn't support space-separated
  // event names.
  Radio._eventsApi = function (obj, action, name, rest) {
    if (!name) {
      return false;
    }

    var results = {};

    // Handle event maps.
    if (typeof name === "object") {
      for (var key in name) {
        var result = obj[action].apply(obj, [key, name[key]].concat(rest));
        eventSplitter.test(key) ? _.extend(results, result) : results[key] = result;
      }
      return results;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        results[names[i]] = obj[action].apply(obj, [names[i]].concat(rest));
      }
      return results;
    }

    return false;
  };

  // An optimized way to execute callbacks.
  Radio._callHandler = function (callback, context, args) {
    var a1 = args[0],
        a2 = args[1],
        a3 = args[2];
    switch (args.length) {
      case 0:
        return callback.call(context);
      case 1:
        return callback.call(context, a1);
      case 2:
        return callback.call(context, a1, a2);
      case 3:
        return callback.call(context, a1, a2, a3);
      default:
        return callback.apply(context, args);
    }
  };

  // A helper used by `off` methods to the handler from the store
  function removeHandler(store, name, callback, context) {
    var event = store[name];
    if ((!callback || (callback === event.callback || callback === event.callback._callback)) && (!context || context === event.context)) {
      delete store[name];
      return true;
    }
  }

  function removeHandlers(store, name, callback, context) {
    store || (store = {});
    var names = name ? [name] : _.keys(store);
    var matched = false;

    for (var i = 0, length = names.length; i < length; i++) {
      name = names[i];

      // If there's no event by this name, log it and continue
      // with the loop
      if (!store[name]) {
        continue;
      }

      if (removeHandler(store, name, callback, context)) {
        matched = true;
      }
    }

    return matched;
  }

  /*
   * tune-in
   * -------
   * Get console logs of a channel's activity
   *
   */

  var _logs = {};

  // This is to produce an identical function in both tuneIn and tuneOut,
  // so that Backbone.Events unregisters it.
  function _partial(channelName) {
    return _logs[channelName] || (_logs[channelName] = _.partial(Radio.log, channelName));
  }

  _.extend(Radio, {

    // Log information about the channel and event
    log: function log(channelName, eventName) {
      var args = _.rest(arguments, 2);
      console.log("[" + channelName + "] \"" + eventName + "\"", args);
    },

    // Logs all events on this channel to the console. It sets an
    // internal value on the channel telling it we're listening,
    // then sets a listener on the Backbone.Events
    tuneIn: function tuneIn(channelName) {
      var channel = Radio.channel(channelName);
      channel._tunedIn = true;
      channel.on("all", _partial(channelName));
      return this;
    },

    // Stop logging all of the activities on this channel to the console
    tuneOut: function tuneOut(channelName) {
      var channel = Radio.channel(channelName);
      channel._tunedIn = false;
      channel.off("all", _partial(channelName));
      delete _logs[channelName];
      return this;
    }
  });

  /*
   * Backbone.Radio.Requests
   * -----------------------
   * A messaging system for requesting data.
   *
   */

  function makeCallback(callback) {
    return _.isFunction(callback) ? callback : function () {
      return callback;
    };
  }

  Radio.Requests = {

    // Make a request
    request: function request(name) {
      var args = _.rest(arguments);
      var results = Radio._eventsApi(this, "request", name, args);
      if (results) {
        return results;
      }
      var channelName = this.channelName;
      var requests = this._requests;

      // Check if we should log the request, and if so, do it
      if (channelName && this._tunedIn) {
        Radio.log.apply(this, [channelName, name].concat(args));
      }

      // If the request isn't handled, log it in DEBUG mode and exit
      if (requests && (requests[name] || requests["default"])) {
        var handler = requests[name] || requests["default"];
        args = requests[name] ? args : arguments;
        return Radio._callHandler(handler.callback, handler.context, args);
      } else {
        Radio.debugLog("An unhandled request was fired", name, channelName);
      }
    },

    // Set up a handler for a request
    reply: function reply(name, callback, context) {
      if (Radio._eventsApi(this, "reply", name, [callback, context])) {
        return this;
      }

      this._requests || (this._requests = {});

      if (this._requests[name]) {
        Radio.debugLog("A request was overwritten", name, this.channelName);
      }

      this._requests[name] = {
        callback: makeCallback(callback),
        context: context || this
      };

      return this;
    },

    // Set up a handler that can only be requested once
    replyOnce: function replyOnce(name, callback, context) {
      if (Radio._eventsApi(this, "replyOnce", name, [callback, context])) {
        return this;
      }

      var self = this;

      var once = _.once(function () {
        self.stopReplying(name);
        return makeCallback(callback).apply(this, arguments);
      });

      return this.reply(name, once, context);
    },

    // Remove handler(s)
    stopReplying: function stopReplying(name, callback, context) {
      if (Radio._eventsApi(this, "stopReplying", name)) {
        return this;
      }

      // Remove everything if there are no arguments passed
      if (!name && !callback && !context) {
        delete this._requests;
      } else if (!removeHandlers(this._requests, name, callback, context)) {
        Radio.debugLog("Attempted to remove the unregistered request", name, this.channelName);
      }

      return this;
    }
  };

  /*
   * Backbone.Radio.channel
   * ----------------------
   * Get a reference to a channel by name.
   *
   */

  Radio._channels = {};

  Radio.channel = function (channelName) {
    if (!channelName) {
      throw new Error("You must provide a name for the channel.");
    }

    if (Radio._channels[channelName]) {
      return Radio._channels[channelName];
    } else {
      return Radio._channels[channelName] = new Radio.Channel(channelName);
    }
  };

  /*
   * Backbone.Radio.Channel
   * ----------------------
   * A Channel is an object that extends from Backbone.Events,
   * and Radio.Requests.
   *
   */

  Radio.Channel = function (channelName) {
    this.channelName = channelName;
  };

  _.extend(Radio.Channel.prototype, Backbone.Events, Radio.Requests, {

    // Remove all handlers from the messaging systems of this channel
    reset: function reset() {
      this.off();
      this.stopListening();
      this.stopReplying();
      return this;
    }
  });

  /*
   * Top-level API
   * -------------
   * Supplies the 'top-level API' for working with Channels directly
   * from Backbone.Radio.
   *
   */

  var channel,
      args,
      systems = [Backbone.Events, Radio.Commands, Radio.Requests];

  _.each(systems, function (system) {
    _.each(system, function (method, methodName) {
      Radio[methodName] = function (channelName) {
        args = _.rest(arguments);
        channel = this.channel(channelName);
        return channel[methodName].apply(channel, args);
      };
    });
  });

  Radio.reset = function (channelName) {
    var channels = !channelName ? this._channels : [this._channels[channelName]];
    _.invoke(channels, "reset");
  };

  var backbone_radio = Radio;

  return backbone_radio;
});

},{"./../../../assets/js/src/admin/vendor/backbone-shim.js":29,"./../../../assets/js/src/admin/vendor/underscore-shim.js":34}],38:[function(require,module,exports){
// Backbone.Stickit v0.9.2, MIT Licensed
// Copyright (c) 2012-2015 The New York Times, CMS Group, Matthew DeLambo <delambo@gmail.com>

(function (factory) {

  // Set up Stickit appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd)
    define(['underscore', 'backbone', 'exports'], factory);

  // Next for Node.js or CommonJS.
  else if (typeof exports === 'object')
    factory(require('./../../assets/js/src/admin/vendor/underscore-shim.js'), require('./../../assets/js/src/admin/vendor/backbone-shim.js'), exports);

  // Finally, as a browser global.
  else
    factory(_, Backbone, {});

}(function (_, Backbone, Stickit) {

  // Stickit Namespace
  // --------------------------

  // Export onto Backbone object
  Backbone.Stickit = Stickit;

  Stickit._handlers = [];

  Stickit.addHandler = function(handlers) {
    // Fill-in default values.
    handlers = _.map(_.flatten([handlers]), function(handler) {
      return _.defaults({}, handler, {
        updateModel: true,
        updateView: true,
        updateMethod: 'text'
      });
    });
    this._handlers = this._handlers.concat(handlers);
  };

  // Backbone.View Mixins
  // --------------------

  Stickit.ViewMixin = {

    // Collection of model event bindings.
    //   [{model,event,fn,config}, ...]
    _modelBindings: null,

    // Unbind the model and event bindings from `this._modelBindings` and
    // `this.$el`. If the optional `model` parameter is defined, then only
    // delete bindings for the given `model` and its corresponding view events.
    unstickit: function(model, bindingSelector) {

      // Support passing a bindings hash in place of bindingSelector.
      if (_.isObject(bindingSelector)) {
        _.each(bindingSelector, function(v, selector) {
          this.unstickit(model, selector);
        }, this);
        return;
      }

      var models = [], destroyFns = [];
      this._modelBindings = _.reject(this._modelBindings, function(binding) {
        if (model && binding.model !== model) return;
        if (bindingSelector && binding.config.selector != bindingSelector) return;

        binding.model.off(binding.event, binding.fn);
        destroyFns.push(binding.config._destroy);
        models.push(binding.model);
        return true;
      });

      // Trigger an event for each model that was unbound.
      _.invoke(_.uniq(models), 'trigger', 'stickit:unstuck', this.cid);

      // Call `_destroy` on a unique list of the binding callbacks.
      _.each(_.uniq(destroyFns), function(fn) { fn.call(this); }, this);

      this.$el.off('.stickit' + (model ? '.' + model.cid : ''), bindingSelector);
    },

    // Initilize Stickit bindings for the view. Subsequent binding additions
    // can either call `stickit` with the new bindings, or add them directly
    // with `addBinding`. Both arguments to `stickit` are optional.
    stickit: function(optionalModel, optionalBindingsConfig) {
      var model = optionalModel || this.model,
          bindings = optionalBindingsConfig || _.result(this, "bindings") || {};

      this._modelBindings || (this._modelBindings = []);

      // Add bindings in bulk using `addBinding`.
      this.addBinding(model, bindings);

      // Wrap `view.remove` to unbind stickit model and dom events.
      var remove = this.remove;
      if (!remove.stickitWrapped) {
        this.remove = function() {
          var ret = this;
          this.unstickit();
          if (remove) ret = remove.apply(this, arguments);
          return ret;
        };
      }
      this.remove.stickitWrapped = true;
      return this;
    },

    // Add a single Stickit binding or a hash of bindings to the model. If
    // `optionalModel` is ommitted, will default to the view's `model` property.
    addBinding: function(optionalModel, selector, binding) {
      var model = optionalModel || this.model,
          namespace = '.stickit.' + model.cid;

      binding = binding || {};

      // Support jQuery-style {key: val} event maps.
      if (_.isObject(selector)) {
        var bindings = selector;
        _.each(bindings, function(val, key) {
          this.addBinding(model, key, val);
        }, this);
        return;
      }

      // Special case the ':el' selector to use the view's this.$el.
      var $el = selector === ':el' ? this.$el : this.$(selector);

      // Clear any previous matching bindings.
      this.unstickit(model, selector);

      // Fail fast if the selector didn't match an element.
      if (!$el.length) return;

      // Allow shorthand setting of model attributes - `'selector':'observe'`.
      if (_.isString(binding)) binding = {observe: binding};

      // Handle case where `observe` is in the form of a function.
      if (_.isFunction(binding.observe)) binding.observe = binding.observe.call(this);

      // Find all matching Stickit handlers that could apply to this element
      // and store in a config object.
      var config = getConfiguration($el, binding);

      // The attribute we're observing in our config.
      var modelAttr = config.observe;

      // Store needed properties for later.
      config.selector = selector;
      config.view = this;

      // Create the model set options with a unique `bindId` so that we
      // can avoid double-binding in the `change:attribute` event handler.
      var bindId = config.bindId = _.uniqueId();

      // Add a reference to the view for handlers of stickitChange events
      var options = _.extend({stickitChange: config}, config.setOptions);

      // Add a `_destroy` callback to the configuration, in case `destroy`
      // is a named function and we need a unique function when unsticking.
      config._destroy = function() {
        applyViewFn.call(this, config.destroy, $el, model, config);
      };

      initializeAttributes($el, config, model, modelAttr);
      initializeVisible($el, config, model, modelAttr);
      initializeClasses($el, config, model, modelAttr);

      if (modelAttr) {
        // Setup one-way (input element -> model) bindings.
        _.each(config.events, function(type) {
          var eventName = type + namespace;
          var listener = function(event) {
            var val = applyViewFn.call(this, config.getVal, $el, event, config, slice.call(arguments, 1));

            // Don't update the model if false is returned from the `updateModel` configuration.
            var currentVal = evaluateBoolean(config.updateModel, val, event, config);
            if (currentVal) setAttr(model, modelAttr, val, options, config);
          };
          var sel = selector === ':el'? '' : selector;
          this.$el.on(eventName, sel, _.bind(listener, this));
        }, this);

        // Setup a `change:modelAttr` observer to keep the view element in sync.
        // `modelAttr` may be an array of attributes or a single string value.
        _.each(_.flatten([modelAttr]), function(attr) {
          observeModelEvent(model, 'change:' + attr, config, function(m, val, options) {
            var changeId = options && options.stickitChange && options.stickitChange.bindId;
            if (changeId !== bindId) {
              var currentVal = getAttr(model, modelAttr, config);
              updateViewBindEl($el, config, currentVal, model);
            }
          });
        });

        var currentVal = getAttr(model, modelAttr, config);
        updateViewBindEl($el, config, currentVal, model, true);
      }

      // After each binding is setup, call the `initialize` callback.
      applyViewFn.call(this, config.initialize, $el, model, config);
    }
  };

  _.extend(Backbone.View.prototype, Stickit.ViewMixin);

  // Helpers
  // -------

  var slice = [].slice;

  // Evaluates the given `path` (in object/dot-notation) relative to the given
  // `obj`. If the path is null/undefined, then the given `obj` is returned.
  var evaluatePath = function(obj, path) {
    var parts = (path || '').split('.');
    var result = _.reduce(parts, function(memo, i) { return memo[i]; }, obj);
    return result == null ? obj : result;
  };

  // If the given `fn` is a string, then view[fn] is called, otherwise it is
  // a function that should be executed.
  var applyViewFn = function(fn) {
    fn = _.isString(fn) ? evaluatePath(this, fn) : fn;
    if (fn) return (fn).apply(this, slice.call(arguments, 1));
  };

  // Given a function, string (view function reference), or a boolean
  // value, returns the truthy result. Any other types evaluate as false.
  // The first argument must be `reference` and the last must be `config`, but
  // middle arguments can be variadic.
  var evaluateBoolean = function(reference, val, config) {
    if (_.isBoolean(reference)) {
      return reference;
    } else if (_.isFunction(reference) || _.isString(reference)) {
      var view = _.last(arguments).view;
      return applyViewFn.apply(view, arguments);
    }
    return false;
  };

  // Setup a model event binding with the given function, and track the event
  // in the view's _modelBindings.
  var observeModelEvent = function(model, event, config, fn) {
    var view = config.view;
    model.on(event, fn, view);
    view._modelBindings.push({model:model, event:event, fn:fn, config:config});
  };

  // Prepares the given `val`ue and sets it into the `model`.
  var setAttr = function(model, attr, val, options, config) {
    var value = {}, view = config.view;
    if (config.onSet) {
      val = applyViewFn.call(view, config.onSet, val, config);
    }

    if (config.set) {
      applyViewFn.call(view, config.set, attr, val, options, config);
    } else {
      value[attr] = val;
      // If `observe` is defined as an array and `onSet` returned
      // an array, then map attributes to their values.
      if (_.isArray(attr) && _.isArray(val)) {
        value = _.reduce(attr, function(memo, attribute, index) {
          memo[attribute] = _.has(val, index) ? val[index] : null;
          return memo;
        }, {});
      }
      model.set(value, options);
    }
  };

  // Returns the given `attr`'s value from the `model`, escaping and
  // formatting if necessary. If `attr` is an array, then an array of
  // respective values will be returned.
  var getAttr = function(model, attr, config) {
    var view = config.view;
    var retrieveVal = function(field) {
      return model[config.escape ? 'escape' : 'get'](field);
    };
    var sanitizeVal = function(val) {
      return val == null ? '' : val;
    };
    var val = _.isArray(attr) ? _.map(attr, retrieveVal) : retrieveVal(attr);
    if (config.onGet) val = applyViewFn.call(view, config.onGet, val, config);
    return _.isArray(val) ? _.map(val, sanitizeVal) : sanitizeVal(val);
  };

  // Find handlers in `Backbone.Stickit._handlers` with selectors that match
  // `$el` and generate a configuration by mixing them in the order that they
  // were found with the given `binding`.
  var getConfiguration = Stickit.getConfiguration = function($el, binding) {
    var handlers = [{
      updateModel: false,
      updateMethod: 'text',
      update: function($el, val, m, opts) { if ($el[opts.updateMethod]) $el[opts.updateMethod](val); },
      getVal: function($el, e, opts) { return $el[opts.updateMethod](); }
    }];
    handlers = handlers.concat(_.filter(Stickit._handlers, function(handler) {
      return $el.is(handler.selector);
    }));
    handlers.push(binding);

    // Merge handlers into a single config object. Last props in wins.
    var config = _.extend.apply(_, handlers);

    // `updateView` is defaulted to false for configutrations with
    // `visible`; otherwise, `updateView` is defaulted to true.
    if (!_.has(config, 'updateView')) config.updateView = !config.visible;
    return config;
  };

  // Setup the attributes configuration - a list that maps an attribute or
  // property `name`, to an `observe`d model attribute, using an optional
  // `onGet` formatter.
  //
  //     attributes: [{
  //       name: 'attributeOrPropertyName',
  //       observe: 'modelAttrName'
  //       onGet: function(modelAttrVal, modelAttrName) { ... }
  //     }, ...]
  //
  var initializeAttributes = function($el, config, model, modelAttr) {
    var props = ['autofocus', 'autoplay', 'async', 'checked', 'controls',
      'defer', 'disabled', 'hidden', 'indeterminate', 'loop', 'multiple',
      'open', 'readonly', 'required', 'scoped', 'selected'];

    var view = config.view;

    _.each(config.attributes || [], function(attrConfig) {
      attrConfig = _.clone(attrConfig);
      attrConfig.view = view;

      var lastClass = '';
      var observed = attrConfig.observe || (attrConfig.observe = modelAttr);
      var updateAttr = function() {
        var updateType = _.contains(props, attrConfig.name) ? 'prop' : 'attr',
            val = getAttr(model, observed, attrConfig);

        // If it is a class then we need to remove the last value and add the new.
        if (attrConfig.name === 'class') {
          $el.removeClass(lastClass).addClass(val);
          lastClass = val;
        } else {
          $el[updateType](attrConfig.name, val);
        }
      };

      _.each(_.flatten([observed]), function(attr) {
        observeModelEvent(model, 'change:' + attr, config, updateAttr);
      });

      // Initialize the matched element's state.
      updateAttr();
    });
  };

  var initializeClasses = function($el, config, model, modelAttr) {
    _.each(config.classes || [], function(classConfig, name) {
      if (_.isString(classConfig)) classConfig = {observe: classConfig};
      classConfig.view = config.view;

      var observed = classConfig.observe;
      var updateClass = function() {
        var val = getAttr(model, observed, classConfig);
        $el.toggleClass(name, !!val);
      };

      _.each(_.flatten([observed]), function(attr) {
        observeModelEvent(model, 'change:' + attr, config, updateClass);
      });
      updateClass();
    });
  };

  // If `visible` is configured, then the view element will be shown/hidden
  // based on the truthiness of the modelattr's value or the result of the
  // given callback. If a `visibleFn` is also supplied, then that callback
  // will be executed to manually handle showing/hiding the view element.
  //
  //     observe: 'isRight',
  //     visible: true, // or function(val, options) {}
  //     visibleFn: function($el, isVisible, options) {} // optional handler
  //
  var initializeVisible = function($el, config, model, modelAttr) {
    if (config.visible == null) return;
    var view = config.view;

    var visibleCb = function() {
      var visible = config.visible,
          visibleFn = config.visibleFn,
          val = getAttr(model, modelAttr, config),
          isVisible = !!val;

      // If `visible` is a function then it should return a boolean result to show/hide.
      if (_.isFunction(visible) || _.isString(visible)) {
        isVisible = !!applyViewFn.call(view, visible, val, config);
      }

      // Either use the custom `visibleFn`, if provided, or execute the standard show/hide.
      if (visibleFn) {
        applyViewFn.call(view, visibleFn, $el, isVisible, config);
      } else {
        $el.toggle(isVisible);
      }
    };

    _.each(_.flatten([modelAttr]), function(attr) {
      observeModelEvent(model, 'change:' + attr, config, visibleCb);
    });

    visibleCb();
  };

  // Update the value of `$el` using the given configuration and trigger the
  // `afterUpdate` callback. This action may be blocked by `config.updateView`.
  //
  //     update: function($el, val, model, options) {},  // handler for updating
  //     updateView: true, // defaults to true
  //     afterUpdate: function($el, val, options) {} // optional callback
  //
  var updateViewBindEl = function($el, config, val, model, isInitializing) {
    var view = config.view;
    if (!evaluateBoolean(config.updateView, val, config)) return;
    applyViewFn.call(view, config.update, $el, val, model, config);
    if (!isInitializing) applyViewFn.call(view, config.afterUpdate, $el, val, config);
  };

  // Default Handlers
  // ----------------

  Stickit.addHandler([{
    selector: '[contenteditable]',
    updateMethod: 'html',
    events: ['input', 'change']
  }, {
    selector: 'input',
    events: ['propertychange', 'input', 'change'],
    update: function($el, val) { $el.val(val); },
    getVal: function($el) {
      return $el.val();
    }
  }, {
    selector: 'textarea',
    events: ['propertychange', 'input', 'change'],
    update: function($el, val) { $el.val(val); },
    getVal: function($el) { return $el.val(); }
  }, {
    selector: 'input[type="radio"]',
    events: ['change'],
    update: function($el, val) {
      $el.filter('[value="'+val+'"]').prop('checked', true);
    },
    getVal: function($el) {
      return $el.filter(':checked').val();
    }
  }, {
    selector: 'input[type="checkbox"]',
    events: ['change'],
    update: function($el, val, model, options) {
      if ($el.length > 1) {
        // There are multiple checkboxes so we need to go through them and check
        // any that have value attributes that match what's in the array of `val`s.
        val || (val = []);
        $el.each(function(i, el) {
          var checkbox = Backbone.$(el);
          var checked = _.contains(val, checkbox.val());
          checkbox.prop('checked', checked);
        });
      } else {
        var checked = _.isBoolean(val) ? val : val === $el.val();
        $el.prop('checked', checked);
      }
    },
    getVal: function($el) {
      var val;
      if ($el.length > 1) {
        val = _.reduce($el, function(memo, el) {
          var checkbox = Backbone.$(el);
          if (checkbox.prop('checked')) memo.push(checkbox.val());
          return memo;
        }, []);
      } else {
        val = $el.prop('checked');
        // If the checkbox has a value attribute defined, then
        // use that value. Most browsers use "on" as a default.
        var boxval = $el.val();
        if (boxval !== 'on' && boxval != null) {
          val = val ? $el.val() : null;
        }
      }
      return val;
    }
  }, {
    selector: 'select',
    events: ['change'],
    update: function($el, val, model, options) {
      var optList,
        selectConfig = options.selectOptions,
        list = selectConfig && selectConfig.collection || undefined,
        isMultiple = $el.prop('multiple');

      // If there are no `selectOptions` then we assume that the `<select>`
      // is pre-rendered and that we need to generate the collection.
      if (!selectConfig) {
        selectConfig = {};
        var getList = function($el) {
          return $el.map(function(index, option) {
            // Retrieve the text and value of the option, preferring "stickit-bind-val"
            // data attribute over value property.
            var dataVal = Backbone.$(option).data('stickit-bind-val');
            return {
              value: dataVal !== undefined ? dataVal : option.value,
              label: option.text
            };
          }).get();
        };
        if ($el.find('optgroup').length) {
          list = {opt_labels:[]};
          // Search for options without optgroup
          if ($el.find('> option').length) {
            list.opt_labels.push(undefined);
            _.each($el.find('> option'), function(el) {
              list[undefined] = getList(Backbone.$(el));
            });
          }
          _.each($el.find('optgroup'), function(el) {
            var label = Backbone.$(el).attr('label');
            list.opt_labels.push(label);
            list[label] = getList(Backbone.$(el).find('option'));
          });
        } else {
          list = getList($el.find('option'));
        }
      }

      // Fill in default label and path values.
      selectConfig.valuePath = selectConfig.valuePath || 'value';
      selectConfig.labelPath = selectConfig.labelPath || 'label';
      selectConfig.disabledPath = selectConfig.disabledPath || 'disabled';

      var addSelectOptions = function(optList, $el, fieldVal) {
        _.each(optList, function(obj) {
          var option = Backbone.$('<option/>'), optionVal = obj;

          var fillOption = function(text, val, disabled) {
            option.text(text);
            optionVal = val;
            // Save the option value as data so that we can reference it later.
            option.data('stickit-bind-val', optionVal);
            if (!_.isArray(optionVal) && !_.isObject(optionVal)) option.val(optionVal);

            if (disabled === true) option.prop('disabled', 'disabled');
          };

          var text, val, disabled;
          if (obj === '__default__') {
            text = fieldVal.label,
            val = fieldVal.value,
            disabled = fieldVal.disabled;
          } else {
            text = evaluatePath(obj, selectConfig.labelPath),
            val = evaluatePath(obj, selectConfig.valuePath),
            disabled = evaluatePath(obj, selectConfig.disabledPath);
          }
          fillOption(text, val, disabled);

          // Determine if this option is selected.
          var isSelected = function() {
            if (!isMultiple && optionVal != null && fieldVal != null && optionVal === fieldVal) {
              return true;
            } else if (_.isObject(fieldVal) && _.isEqual(optionVal, fieldVal)) {
              return true;
            }
            return false;
          };

          if (isSelected()) {
            option.prop('selected', true);
          } else if (isMultiple && _.isArray(fieldVal)) {
            _.each(fieldVal, function(val) {
              if (_.isObject(val)) val = evaluatePath(val, selectConfig.valuePath);
              if (val === optionVal || (_.isObject(val) && _.isEqual(optionVal, val)))
                option.prop('selected', true);
            });
          }

          $el.append(option);
        });
      };

      $el.find('*').remove();

      // The `list` configuration is a function that returns the options list or a string
      // which represents the path to the list relative to `window` or the view/`this`.
      if (_.isString(list)) {
        var context = window;
        if (list.indexOf('this.') === 0) context = this;
        list = list.replace(/^[a-z]*\.(.+)$/, '$1');
        optList = evaluatePath(context, list);
      } else if (_.isFunction(list)) {
        optList = applyViewFn.call(this, list, $el, options);
      } else {
        optList = list;
      }

      // Support Backbone.Collection and deserialize.
      if (optList instanceof Backbone.Collection) {
        var collection = optList;
        var refreshSelectOptions = function() {
          var currentVal = getAttr(model, options.observe, options);
          applyViewFn.call(this, options.update, $el, currentVal, model, options);
        };
        // We need to call this function after unstickit and after an update so we don't end up
        // with multiple listeners doing the same thing
        var removeCollectionListeners = function() {
          collection.off('add remove reset sort', refreshSelectOptions);
        };
        var removeAllListeners = function() {
          removeCollectionListeners();
          collection.off('stickit:selectRefresh');
          model.off('stickit:selectRefresh');
        };
        // Remove previously set event listeners by triggering a custom event
        collection.trigger('stickit:selectRefresh');
        collection.once('stickit:selectRefresh', removeCollectionListeners, this);

        // Listen to the collection and trigger an update of the select options
        collection.on('add remove reset sort', refreshSelectOptions, this);

        // Remove the previous model event listener
        model.trigger('stickit:selectRefresh');
        model.once('stickit:selectRefresh', function() {
          model.off('stickit:unstuck', removeAllListeners);
        });
        // Remove collection event listeners once this binding is unstuck
        model.once('stickit:unstuck', removeAllListeners, this);
        optList = optList.toJSON();
      }

      if (selectConfig.defaultOption) {
        var option = _.isFunction(selectConfig.defaultOption) ?
          selectConfig.defaultOption.call(this, $el, options) :
          selectConfig.defaultOption;
        addSelectOptions(["__default__"], $el, option);
      }

      if (_.isArray(optList)) {
        addSelectOptions(optList, $el, val);
      } else if (optList.opt_labels) {
        // To define a select with optgroups, format selectOptions.collection as an object
        // with an 'opt_labels' property, as in the following:
        //
        //     {
        //       'opt_labels': ['Looney Tunes', 'Three Stooges'],
        //       'Looney Tunes': [{id: 1, name: 'Bugs Bunny'}, {id: 2, name: 'Donald Duck'}],
        //       'Three Stooges': [{id: 3, name : 'moe'}, {id: 4, name : 'larry'}, {id: 5, name : 'curly'}]
        //     }
        //
        _.each(optList.opt_labels, function(label) {
          var $group = Backbone.$('<optgroup/>').attr('label', label);
          addSelectOptions(optList[label], $group, val);
          $el.append($group);
        });
        // With no 'opt_labels' parameter, the object is assumed to be a simple value-label map.
        // Pass a selectOptions.comparator to override the default order of alphabetical by label.
      } else {
        var opts = [], opt;
        for (var i in optList) {
          opt = {};
          opt[selectConfig.valuePath] = i;
          opt[selectConfig.labelPath] = optList[i];
          opts.push(opt);
        }
        opts = _.sortBy(opts, selectConfig.comparator || selectConfig.labelPath);
        addSelectOptions(opts, $el, val);
      }
    },
    getVal: function($el) {
      var selected = $el.find('option:selected');

      if ($el.prop('multiple')) {
        return _.map(selected, function(el) {
          return Backbone.$(el).data('stickit-bind-val');
        });
      } else {
        return selected.data('stickit-bind-val');
      }
    }
  }]);

  return Stickit;

}));

},{"./../../assets/js/src/admin/vendor/backbone-shim.js":29,"./../../assets/js/src/admin/vendor/underscore-shim.js":34}],39:[function(require,module,exports){

},{}],40:[function(require,module,exports){
/* implementation: Copyright (C) 2012-2013 Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
*  NPM packaging: Copyright (C) 2012-2014 Pierre-Yves Gérardy | https://github.com/pygy/underscoreDeepExtend
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

( // Module boilerplate to support browser globals, node.js and AMD.
  (typeof module !== "undefined" && function (m) { module.exports = m(); }) ||
  (typeof define === "function" && function (m) { define('underscoreDeepExtend', m); }) ||
  (function (m) { window['underscoreDeepExtend'] = m(); })
)(function () { return function(_) {

return function underscoreDeepExtend(obj) {
  var parentRE = /#{\s*?_\s*?}/,
  slice = Array.prototype.slice,
  hasOwnProperty = Object.prototype.hasOwnProperty;

  _.each(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
          obj[prop] = source[prop];
        }
        else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
          if (_.isString(obj[prop])) {
            obj[prop] = source[prop].replace(parentRE, obj[prop]);
          }
        }
        else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
          if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
            throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
          } else {
            obj[prop] = _.reject(_.deepExtend(obj[prop], source[prop]), function (item) { return _.isNull(item);});
          }
        }
        else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
          if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
            throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
          } else {
            obj[prop] = _.deepExtend(obj[prop], source[prop]);
          }
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};

};});

},{}]},{},[12])(12)
});
//# sourceMappingURL=core.map

/* Modules bundled with Browserify */
