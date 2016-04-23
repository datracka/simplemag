(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CS_builder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Cornerstone.Mn.Behavior.extend({

  defaults: {
    message: cs.l18n('confirm-message'),
    subtext: false,
    yep: cs.l18n('confirm-yep'),
    nope: cs.l18n('confirm-nope'),
    classes: [],
  },

  initialize: function() {
    this.listenTo(this.view, 'confirm:warn:open', this.open );
    this.listenTo(cs.confirm, 'accept', this.accept );
    this.listenTo(cs.confirm, 'decline', this.decline );
  },

  events: function() {
    var events = {};
    var ui = this.options.ui || 'confirmWarn';
    events[ "click @ui." + ui ] = 'open';
    return events;
  },

  open: function() {
    cs.confirm.trigger( 'open', _.extend( this.options, { view: this.view } ) );
  },

  accept: function( viewID ) {
    if (viewID != this.view.cid ) return;
    this.view.triggerMethod('confirm:warn:accept');
  },

  decline: function( viewID ) {
    if (viewID != this.view.cid ) return;
    this.view.triggerMethod('confirm:warn:decline');
  }

});
},{}],2:[function(require,module,exports){
module.exports = Cornerstone.Mn.Behavior.extend({

  defaults: {
    message: cs.l18n('confirm-message'),
    subtext: false,
    yep: cs.l18n('confirm-yep'),
    nope: cs.l18n('confirm-nope'),
    classes: [],
  },

  initialize: function() {
    this.listenTo(this.view, 'confirm:open', this.open );
    this.listenTo(cs.confirm, 'accept', this.accept );
    this.listenTo(cs.confirm, 'decline', this.decline );
  },

  events: function() {
    var events = {};
    var ui = this.options.ui || 'confirm';
    events[ "click @ui." + ui ] = 'open';
    return events;
  },

  open: function() {
    cs.confirm.trigger( 'open', _.extend( this.options, { view: this.view } ) );
  },

  accept: function( viewID ) {
    if (viewID != this.view.cid ) return;
    this.view.triggerMethod('confirm:accept');
  },

  decline: function( viewID ) {
    if (viewID != this.view.cid ) return;
    this.view.triggerMethod('confirm:decline');
  }

});
},{}],3:[function(require,module,exports){
module.exports.Confirm = require('./confirm');
module.exports.ConfirmWarn = require('./confirm-warn');
},{"./confirm":2,"./confirm-warn":1}],4:[function(require,module,exports){
var Mousetrap = require('mousetrap')
require('mousetrap/plugins/global-bind/mousetrap-global-bind');
Cornerstone.Vendor.Mousetrap = Mousetrap;
Cornerstone.Vendor.NProgress = require('nprogress');
Cornerstone.Vendor.moment = require('moment');
require('perfect-scrollbar/jquery')(Backbone.$);
require('../vendor/html.sortable');
require('../vendor/pointer-events-polyfill');
require('../vendor/rgbaster');
require('../vendor/jquery.growl');
require('../vendor/jquery.visible');
Cornerstone.Vendor.HTMLHint = require('../vendor/htmlhint').HTMLHint;
require('./utility/jquery.shadow-height');
require('./utility/string-replace-all');


/**
 * Fire it up
 */
cs.registerComponents( require('./components') );
cs.updateConfig( csBuilderData );
cs.updateRegistry( {
	start: [
		'mn-extensions',
		'template-loader',
		'view-loader',
		'model-loader',
		'render-queue',
		'keybindings',
		'builder'
	],
	editor: [
		'editor',
		'post-handler',
		'options',
		'navigator',
		'template-manager',
		'layout',
		'layout-section',
		'layout-templates',
		'inspector',
		'settings',
		'skeleton'
	],
	preview: [ 'preview' ]
} );

// //cs.loadComponents( (cs.config( 'isPreview' )) ? 'preview' : 'editor' );
},{"../vendor/html.sortable":120,"../vendor/htmlhint":121,"../vendor/jquery.growl":122,"../vendor/jquery.visible":123,"../vendor/pointer-events-polyfill":124,"../vendor/rgbaster":125,"./components":23,"./utility/jquery.shadow-height":26,"./utility/string-replace-all":29,"moment":127,"mousetrap":128,"mousetrap/plugins/global-bind/mousetrap-global-bind":129,"nprogress":130,"perfect-scrollbar/jquery":131}],5:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		cs.extra    = Backbone.Radio.channel( 'cs:extra' );
		cs.observer = Backbone.Radio.channel( 'cs:observer' );
	  cs.tooltips = Backbone.Radio.channel( 'cs:tooltips' );
	  cs.search   = Backbone.Radio.channel( 'cs:search' );
	  cs.confirm  = Backbone.Radio.channel( 'cs:confirm' );
	  cs.message  = Backbone.Radio.channel( 'cs:message' );

		this.cs.loadComponents( ( this.cs.config( 'isPreview' ) == 'true' ) ? 'preview' : 'editor'  );
	}

});
},{}],6:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	bindings: {
    'ark': 'up up down down left right left right b a enter'
  },

	initialize: function( options ) {

		cs.keybind = Backbone.Radio.channel( 'cs:keybind' );

		// Wait until cs.global is ready
		this.listenTo( cs.events, 'editor:init', this.setup );
		this.listenTo( cs.events, 'preview:iframe:reloaded', this.setup );

	},

	setup: function() {

		// Resend under specific channel
		this.listenTo( cs.global, 'keybind', function( action ) {
    	cs.keybind.trigger( action );
  	});

    this.bindings = _.extend( cs.config('keybindings'), this.bindings );

    _.each(this.bindings,function( sequence, action ){

      var type = undefined;
      var types = ['keypress', 'keyup', 'keydown' ];

      _.each( types, function(prefix) {
        if ( sequence.indexOf( prefix + ':') == 0 ) {
          type = prefix;
          sequence = sequence.replace( prefix + ':', '' );
        }
      });

      Cornerstone.Vendor.Mousetrap.bindGlobal( sequence, function() {
        cs.global.trigger( 'keybind', action ); // send everywhere
      }, type );

    });

  }

});
},{}],7:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		/**
     * Load Behaviors and set Mn lookup location
     */
    this.Behaviors = require('../../behaviors')
    Cornerstone.Mn.Behaviors.behaviorsLookup = _.bind( function() { return this.Behaviors; }, this );

    /**
     * Use Custom Template Renderer with Marionette
     */
    Cornerstone.Mn.Renderer = require('../../utility/renderer');

	},

});
},{"../../behaviors":3,"../../utility/renderer":27}],8:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		// this.Models = { Base: require('../../data/models/element-base') };
  //   _.extend( this.Models, require('../../data/models') );

  //   this.Collections = { Base: require('../../data/models/sortable-collection') };
  //   _.extend( this.Collections, require('../../data/models/collection-index') );

	},

	modelLookup: function ( id ) {
    return this.Models[id] || this.Models.Base;
  },

  collectionLookup: function ( id ) {
    return this.Collections[id] || this.Collections.Base;
  }

});
},{}],9:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		cs.data = Backbone.Radio.channel( 'cs:data' );

		cs.render = this;
		this.cache = {};
		this.jobs = {};
		this.timing = {};

		var delay = parseInt( cs.config( 'remoteRenderDelay' ), 10 );
		this.run = _.debounce( _.bind( this.run, this ), delay );

		// If nothing is queued in a reasonable amount of time,
		// consider the page primed
		var noRender = setTimeout( _.bind( function() {
			this.trigger( 'primed' );
		}, this ), delay * 2 );

		this.once( 'add', function() {
			clearTimeout( noRender );
		});

	},

	onQueue: function( model ) {

		this.trigger( 'add', model );

		if ( model.shadow ) {
			if ( this.cache[model.shadow] ) this.cache[model.cid] = _.clone( this.cache[model.shadow] );
			delete model.shadow;
			return;
		}

		this.queue( model.cid, model.definition.get('flags')._v, model.toJSON(), function( response ){
			this.cache[model.cid] = response;
			model.trigger('remote:render');
		});

	},


	getCache: function( model ) {
		var cache = this.cache[model.cid];
		if ( !cache ) {
			this.triggerMethod( 'queue', model )
			cache = cs.template( 'loading' );
		}
		return cache;
	},

	queue: function( id, provider, data, callback ) {
		var timestamp = Date.now();
		this.timing[id] = timestamp;
		this.jobs[ id ] = { data: data, provider: provider, ts: timestamp, callback: callback };
		this.run();
	},

	run: function( data ){

		if (!data) {

			var batch = _.map( this.jobs, function( value, key ) {
				return { jobID: key, ts: value.ts, provider: value.provider, data: value.data || {} };
			});

			data = {
				post_id: cs.post.get('post_id'),
				batch: batch
			};

			if ( cs.raw_markup || ( top && top.cs && top.cs.raw_markup ) )
				data['raw_markup'] = true;

			this.registeredJobs = _.clone( this.jobs );
			this.jobs = {};

		}

		var request = cs.ajax( 'cs_render_element', data, {

			success: _.bind( function( response, options ) {

				Cornerstone.serial( _.map( response.scripts, function(script, key){
					return function( next ) {
						cs.preview.trigger( 'late:enqueue', key, script.tag, script.src, next );
					}
				}, this ).concat( _.map( response.jobs, function( job, jobID) {
					return _.bind( function( next ) {

						if ( job.ts < this.timing[jobID] ) {
							next(); return;
						}

						if ( job.markup.indexOf('%%TMPL%%') == 0 ) {
							job.markup = job.markup.replace('%%TMPL%%','');
							job.markup = _.template(job.markup);
						}
						if ( '' == job.markup ) {
							job.markup = cs.template( 'empty-element' );
						}

						if ( this.registeredJobs[ jobID ] && !this.jobs[ jobID ] ) {
							this.registeredJobs[ jobID ].callback.call( this, job.markup );
							delete this.registeredJobs[ jobID ];
						}

						next();
					}, this );
				}, this ) ) ).done( _.bind( function(message){

					this.trigger( 'primed' );

					if (message)
						console.log( message );

				}, this ) );

			}, this ),
			error: _.bind( function( response ) {
				if (!this.retry) {
					this.retry = true;
					this.run( data );
					console.warn( 'Could not reach render endpoint. Attempting fallback...' );
				}
				if (response.message == '0') {
					cs.warn( 'Invalid render response. Check for PHP errors, or that the user is logged in.' );
					return;
				}
				cs.warn( response.message );
			}, this )
		} );

	},

	isRunning: function() {
		return _.keys( this.registeredJobs).length > 0;
	}

});
},{}],10:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		/**
     * Load Templates & Icons
     */

    this.cs.Templates = (this.cs.Config.isPreview == "true") ? require('../../../tmp/templates-elements.js') : require('../../../tmp/templates-builder.js');
    this.cs.Icons = require('../../../tmp/templates-svg.js');

    this.listenTo( cs.events, 'editor:init', this.populateIcons );

	},

	populateIcons: function() {
		cs.config( 'fontAwesome' );
    var iconList = {}

    _.each( _.pairs(cs.Config.fontAwesome), function( item) {
      iconList[item[1]] = iconList[item[1]] || new Array;
      iconList[item[1]].push(item[0])
    } );

    this.icons = iconList;
		cs.data.reply( 'get:icons', this.icons );
	}

});
},{"../../../tmp/templates-builder.js":117,"../../../tmp/templates-elements.js":118,"../../../tmp/templates-svg.js":119}],11:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {
		this.listenTo( cs.events, 'editor:init', this.registerControlViews );
		this.listenTo( cs.events, 'editor:init', this.registerSkeletonViews );
		this.listenTo( cs.events, 'preview:init', this.registerElementViews );
	},

	registerElementViews: function() {

    var base = require('../../views/elements/base');

    window.Cornerstone.ElementViews = {
      Base: require('../../views/preview/base')
    };

    _.extend( window.Cornerstone.ElementViews, require('../../views/preview') );
    cs.events.trigger( 'register:element:views' );

	},

	registerSkeletonViews: function() {


    window.Cornerstone.SkeletonViews = { Base: require('../../views/skeleton/base') };
    _.extend( window.Cornerstone.SkeletonViews, require('../../views/skeleton') );
    cs.events.trigger( 'register:skeleton:views' );

	},

	registerControlViews: function() {

		window.Cornerstone.ControlViews = { Base: require('../../views/controls/base') };
    _.extend( window.Cornerstone.ControlViews, require('../../views/controls') );
    cs.events.trigger( 'register:control:views' );

	},

	elementLookup: function ( id ) {
    return Cornerstone.ElementViews[id] || Cornerstone.ElementViews.Base;
  },

  skeletonLookup: function ( id ) {
    return Cornerstone.SkeletonViews[id] || Cornerstone.SkeletonViews.Base;
  },

});
},{"../../views/controls":44,"../../views/controls/base":31,"../../views/elements/base":71,"../../views/preview":102,"../../views/preview/base":96,"../../views/skeleton":114,"../../views/skeleton/base":112}],12:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function( options ) {

		cs.global = Backbone.Radio.channel( 'cs:remote' );
		this.listenToOnce( cs.global, 'preview:primed', this.primed );

		this.listenTo( cs.global, 'ajax:fallback', function( state ) {
			cs.fallbackAjax = state;
		} );


    // Defer views until window and iFrame are loaded.
    Backbone.$(window).load(_.bind(this.loadView, this));
    Backbone.$('#preview-frame').load(_.bind(this.loadIFrame, this))

		cs.events.trigger( 'editor:init' );

	},

	primed: function( late ) {

		this.clearPreloader();

		require('../../utility/custom-media-manager');

		cs.global.reply( 'editor:ready', true );
		cs.global.trigger( 'editor:ready' );

		if ( late )
			cs.message.trigger( 'notice', cs.l18n( 'preview-late') );

	},

	loadView: function() {
		var EditorView = require('../../views/main/editor');
    this.view = new EditorView({ el: '#editor' });
    this.view.render();
  },

  loadIFrame: function() {

  	var frameWindow = document.getElementById("preview-frame").contentWindow;

  	if ( frameWindow.cs && frameWindow.cs.preview ) {
  		frameWindow.cs.preview.trigger( 'iframe:ready', this, cs );
  		return;
  	}

  	_.defer(function(){
  		cs.global.trigger( 'preview:primed' );
  		cs.message.trigger( 'error', cs.l18n( 'preview-failure') );
  	});

	},

	clearPreloader: function() {

  	$preloader = Backbone.$('#preloader').addClass('cs-preloader-fade').one( 'transitionend', function() {
    	$preloader.remove();
    });

  	// Fallback when 'transitionend' isn't available
    _.delay( function(){
    	if ( $preloader )
      	$preloader.remove();
    }, 2000 );

  }

});
},{"../../utility/custom-media-manager":25,"../../views/main/editor":88}],13:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		this.inspect = {
			primary: new Cornerstone.InspectionSupervisor(),
			secondary: new Cornerstone.InspectionSupervisor(),
			expansion: new Cornerstone.InspectionSupervisor(),
		};

		this.resetInspector( 'primary');

		this.listenTo( cs.events, 'inspect:element', this.inspectElement );
		this.listenTo( cs.events, 'inspect:child:element', this.inspectChildElement );

		this.listenTo( cs.events, 'expand:control', this.expansionSource );
		this.listenTo( cs.events, 'expand:close', this.expansionClose );

		cs.navigate.reply( 'inspector:heading', cs.l18n('inspector-heading') )

	},

	inspectElement: function( model ) {
		this.updateInspector( 'primary', model );
		cs.global.trigger( 'autoscroll', model.cid );
	},

	inspectChildElement: function( model ) {
		this.updateInspector( 'secondary', model );
	},

	resetInspector:function( mode ) {

		if ( mode == 'primary' ) {
			this.resetInspector( 'secondary' )
			this.setHeading( false );
		}

		this.updateInspector( mode, new Cornerstone.Models.Proxyable(), [], [] );

	},

	expansionSource: function( source, name ) {

		this.updateInspector( 'expansion', source, _.filter( source.definition.getControls(), function( control ){
			return ( name == control.name );
		} ) );

	},

	expansionClose: function() {
		this.inspect.expansion.reset();
	},

	updateInspector: function( level, source, controls, metaControls ) {

		if (!this.inspect[level]) return;

		this.listenToOnce( source, 'destroy', _.bind( function( newSource ) {
			this.resetInspector( level );
		}, this ) );

		this.listenToOnce( source, 'column:change', _.bind( function( newSource ) {
			this.updateInspector( level, newSource );
		}, this ) );

		if ( !controls )
			controls = source.definition.getControls();

		if ( !metaControls )
			metaControls = this.getMetaControls( level, source );


		this.inspect[level].source( {
			name: 'meta',
			source: source,
			controls: metaControls
		} );


		this.inspect[level].source( {
			name: 'element',
			source: source,
			controls: controls
		} );

		this.inspect[level].rebuildControls();

		if ( level == 'primary' && source.definition ) {
			this.setHeading( source.definition.get('ui').title );
		}

	},

	getMetaControls: function( level, source) {

		var controls = [];

		var ui = source.definition.get('ui');
		var name = source.definition.get('name');
		var internal = ( source.definition.get('flags').context == '_internal' );

		if ( level == 'primary' ) {

			controls.push({ type: 'breadcrumbs' })

			if ( ui.helpText ) {
				controls.push( {
					type: 'info-box',
					ui: {
						title: ui.helpText.title || '',
						message: ui.helpText.message || ''
					}
				} );
			}

			if ( !internal ) {
				var actionType = ( _.contains( [ 'section', 'row', 'column' ], name ) ) ? name : 'element';
				controls.push( { type: actionType + '-actions' } );
			}

		}

		if ( level == 'secondary' ) {

		}

		return controls;
	},

	setHeading: function( heading ) {

		if ( !heading )
			heading = cs.l18n('inspector-heading')

		cs.navigate.reply( 'inspector:heading', heading )
		cs.navigate.trigger( 'refresh:inspector:heading' );

	},

	getPrimaryControls: function() {
		return this.inspect.primary.controls;
	},

	getSecondaryControls: function() {
		return this.inspect.secondary.controls;
	},

	getExpansionControls: function() {
		return this.inspect.expansion.controls;
	}

});
},{}],14:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

	},

});
},{}],15:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	nativeSections: [ 'themeco-pages', 'themeco-blocks' ],
	userSections: [ 'user-pages', 'user-blocks' ],

	initialize: function() {

		this.data = new Backbone.Model({
			title: cs.l18n( 'templates-title' )
		});

		this.controls = new Cornerstone.Collections.Control();
    this.listenTo( cs.templates, 'ready', this.setup );
    this.listenTo( cs.templates, 'add', this.setup );
    this.listenTo( cs.templates, 'remove', this.setup );

	},

	setup: function() {

		var controls = new Cornerstone.Collections.Control();

    controls.add({
      name: 'info',
      type: 'info-box',
      ui: {
      	title: cs.l18n('templates-info-title'),
      	message: cs.l18n('templates-info-description')
      }
    });


    controls.add({
      name: 'action',
      type: 'template-actions',
      ui: {
      	divider: true
      }
    });

    controls.add({
      name: 'title',
      type: 'template-save-dialog',
      condition: { 'action': 'save' }
    });

    controls.add({
      name: 'uploader',
      type: 'template-upload-dialog',
      condition: { 'action': 'upload' }
    });

    var name, choices, type, userTemplates, templateManager;

    templateManager = cs.component('template-manager');
    userTemplates = [];

		_.each( _.union( this.nativeSections, this.userSections ), function( section_name ) {

			var section = templateManager.templates.section( section_name );

			choices = section.map( _.bind( function(item){
				if ( _.contains( this.userSections, section_name ) )
					userTemplates.push(item);
        return { value: item.get('slug'), label: item.get('title') };
      }, this ) );

			type = ( section_name.indexOf('page') > -1 ) ? 'page' : 'block';

			controls.add({
        name: section_name,
        type: 'template-select',
        ui: {
        	title: cs.l18n( 'templates-' + section_name ),
        	buttonText: cs.l18n('templates-insert'),
        	divider: ( type == 'block' ),
        	compact: ( type == 'block' ),
        },
        options: {
          choices: choices,
          templateType: type,
        },

      });


		}, this );


    choices = userTemplates.map(function(item){
      var format = ( item.get('type') == 'block' ) ? cs.l18n('templates-remove-block') : cs.l18n('templates-remove-page');
      return { value: item.get('slug'), label: format.replace('%s', item.get('title') ) };
    });

    controls.add({
      name: 'user-removals',
      type: 'template-remove',
      ui: {
      	title: cs.l18n('templates-remove-label'),
      	buttonText: cs.l18n('templates-remove'),
      },
      options: {
        choices: choices,
        templateType: 'remove'
      }
    });

    controls.invoke( 'setProxy', this.data );

    var oldControls = this.controls

    this.controls = controls;
    cs.templates.trigger( 'control:reset' );

    oldControls.reset();
  }

});
},{}],16:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		this.inspect = {};

		this.inspect.primary = new Cornerstone.InspectionSupervisor( [ {
			name: 'primary',
			source: new Cornerstone.Models.Proxyable(),
			controls: [ {
				name: 'help_text',
				key: 'disabled',
				type: 'info-box',
				ui: {
					title: cs.l18n('layout-info-title'),
					message: cs.l18n('layout-info-description')
				}
			}, {
				name: 'layout_actions',
				key: 'disabled',
				type: 'layout-actions',
				options: {
					divider: true
				}
			} ]
		}, {
			name: 'section',
			source: cs.post.data,
			controls: [ {
				name: 'sections',
				key: 'elements',
				type: 'sortable-sections'
			}]
		} ] );


  	this.inspect.secondary = new Cornerstone.InspectionSupervisor( [ {
			name: 'section',
			source: new Cornerstone.Models.Proxyable(),
			controls: []
		}, {
			name: 'row',
			source: new Cornerstone.Models.Proxyable(),
			controls: []
		} ] );

		cs.navigate.reply( 'layout:active:row', false );
		this.listenTo( cs.events, 'inspect:layout:section', this.inspectSection );
		this.listenTo( cs.events, 'inspect:layout:row', this.inspectRow );

		this.listenTo( cs.events, 'add:section', function() {
			cs.elements.trigger( 'add:item', 'section', cs.post.data, cs.l18n('section-numeric') );
		});

	},


	inspectSection: function( section, activeRow ) {

		if ( !section ) return;
		if ( !activeRow ) activeRow = section.elements.first();

		cs.global.trigger( 'autoscroll', activeRow.cid );

		cs.navigate.reply( 'layout:active:row', activeRow );

		this.inspect.secondary.source( {
			name: 'section',
			source: section,
			controls: section.definition.getControls( '_layout' )
		} );

		this.inspect.secondary.source( {
			name: 'row',
			source: activeRow,
			controls: activeRow.definition.getControls( '_layout' )
		} );

		this.inspect.secondary.rebuildControls();

	},

	inspectRow: function( row ) {
		if ( !row ) return;
		this.inspectSection( row.collection.parent, row );
	}

});
},{}],17:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	panes: {
		layout: [ 'rows', 'templates'],
		elements: [],
		inspector: [ 'item' ],
		settings: [ 'item']
	},

	initialize: function() {

		cs.navigate = Backbone.Radio.channel( 'cs:navigate' );

		cs.navigate.reply( 'auto:focus', false );

		this.listenTo( cs.navigate, 'pane', this.killObserver );
		this.listenTo( cs.navigate, 'subpane:opened', this.killObserver );

		this.listenTo(cs.navigate, 'pane:switch', function() {
			cs.extra.trigger( 'flyout', 'none' );
		});

		this.listenTo(  cs.global, 'auto:focus', _.debounce( function( key ){
			cs.navigate.reply( 'auto:focus', key );
			cs.navigate.trigger( 'auto:focus', key );
		},10, true ) );

    this.listenTo(  cs.global, 'inspect', function( model ){
			cs.events.trigger( 'inspect:element', model );
			cs.navigate.trigger( 'inspector:home' );
			cs.confirm.trigger( 'abort' );
    });

		cs.extra.reply( 'get:collapse', false );


    // Propogate navigation shortcuts
		_.each( this.panes, function( subs, pane ) {

			this.listenTo( cs.navigate, pane + ':home', function( selected ) {
				if ( cs.extra.request( 'get:collapse' ) ) return;
				cs.navigate.trigger( 'pane', pane );
			});

			_.each( subs, function( sub ){
				this.listenTo( cs.navigate, pane + ':' + sub, function( selected ) {
					if ( cs.extra.request( 'get:collapse' ) ) return;
					cs.navigate.trigger( 'pane', pane, sub );
				});
			}, this );

		}, this );

		this.listenTo( cs.global, 'nav:kylelements', function(){
			cs.navigate.trigger( 'elements:home' );
		});

	},

	killObserver: function() {
		 cs.global.trigger( 'kill:observer' );
	}

});
},{}],18:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		cs.options = Backbone.Radio.channel( 'cs:options' );

		var editor_position = localStorage['cs_options_editor_position'];
		var default_position = ( cs.config('isRTL') == 'true' ) ? 'right' : 'left';

		this.data = new Cornerstone.Models.Proxyable( {
			show_help_text: (localStorage['cs_options_show_help_text'] == 'true' ),
			editor_position: (editor_position) ? editor_position : default_position
		} );

		_.each( _.keys( this.data.attributes ), _.bind( function( key ) {

			this.on('change:' + key, function( model, value ) {
				if ( _.isBoolean( value) )
					value = (value) ? 'true' : 'false';
				localStorage['cs_options_' + key ] = value;
			});

		}, this.data ) );

		this.listenTo( this.data, 'change:show_help_text', this.updateHelpText );
		this.listenTo( this.data, 'change:editor_position', this.updateEditorPosition );

		cs.data.reply( 'get:options', this.data );
		cs.options.reply( 'help:text', this.data.get('show_help_text') );
		cs.options.reply( 'editor:position', this.data.get('editor_position') );

		// Always show from now on
		cs.options.reply( 'adv:controls', true );

		this.inspect = new Cornerstone.InspectionSupervisor( {
			name: 'options',
			source: this.data,
			controls: [ {
				name: 'show_help_text',
				type: 'toggle',
				ui: {
					title: cs.l18n('options-help-text'),
					message: cs.l18n('options-help-text-sub')
				},
				options: { helpText: false }
			},
			// {
			// 	name: 'editor_position',
			// 	type: 'choose',
			// 	ui: {
			// 		title: cs.l18n('options-editor-position'),
			// 		message: cs.l18n('options-editor-position-sub')
			// 	},
			// 	options: {
			// 		choices: [
			// 			{ value: 'left', 'tooltip': cs.l18n('options-editor-position-left'), icon: cs.fontIcon( 'arrow-left' ) },
			// 			{ value: 'right', 'tooltip': cs.l18n('options-editor-position-right'), icon: cs.fontIcon( 'arrow-right' ) },
			// 		],
			// 		helpText: false
			// 	},
			// }
			]
		});

		this.inspect.controls.each(function(model){
			model.optionExempt = true;
		});

	},

	updateEditorPosition: function( model, value) {
		cs.options.reply( 'editor:position', value );
		cs.options.trigger( 'editor:position', value );
		cs.options.trigger( 'changed', 'editor_position' );
	},

	updateHelpText: function( model, value ) {
		cs.options.reply( 'help:text', value );
		cs.options.trigger( 'help:text', value );
		cs.options.trigger( 'changed', 'show_help_text' );
	},

	getModel: function() {
		return this.data;
	}

});
},{}],19:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		this.cs.post = new Cornerstone.Post( cs.config( 'post' ) );
		this.listenTo( cs.events, 'action:save', this.save );
		this.listenTo( cs.data, 'save:success', this.saveSuccess );
		this.listenTo( cs.data, 'save:error', this.saveError );

		if ( cs.global.request( 'editor:ready' ) ) {
			this.trackChanges();
		} else {
			this.listenTo( cs.global, 'editor:ready', this.trackChanges );
		}


    cs.data.reply( 'saved:last', null );

		// Warn before closing browser window
		window.onbeforeunload = function(e) {
      if ( cs.changed == true ) {
        return cs.l18n('home-onbeforeunload');
      }
    };

	},

	saveSuccess: function() {

		cs.data.reply('saved:last', Cornerstone.Vendor.moment() );
		cs.channel.trigger('update:saved:last');
		cs.changed = false;

		if ( cs.navigate.request( 'active:pane' ) == 'settings' ) {
      localStorage['CornerstonePane'] = 'settings';
      location.reload();
      //cs.events.trigger('refresh:preview');
    }

	},

	save: function() {

		cs.data.trigger( 'save' );

		Cornerstone.Vendor.NProgress.configure({ showSpinner: false, speed: 850, minimum: 0.925 });
    Cornerstone.Vendor.NProgress.start();

		cs.ajax( 'cs_endpoint_save', _.omit( this.cs.post.toJSON(), [ '_type' ] ), {
      success: function( response ) {
        cs.data.trigger( 'save:success', response );
      },
      error: function( response ) {
      	cs.data.trigger( 'save:error', response );
      },
      always: function( response ) {
      	cs.log( 'save', response);
      	cs.data.trigger( 'save:response', response );
      	Cornerstone.Vendor.NProgress.done();
      }
    } );

	},

	trackChanges: function() {
		// Ignore changes for a few seconds while we boot up.
    this.stopListening( cs.channel, 'page:unsaved' );
    _.delay( _.bind( function(){
      this.listenTo( cs.channel, 'page:unsaved', function() {
        cs.changed = true;
      });
    }, this ), 5000 );
	}

});
},{}],20:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {
		cs.data.reply( 'settings:ready', false );

		this.listenTo( cs.data, 'save', this.save );

		this.listenTo( cs.global, 'editor:ready', this.fetchSections );
		this.listenTo( cs.global, 'settings:pingback', this.setupListeners );

	},

	save: function() {
		if ( true == cs.data.request( 'settings:ready' ) )
			this.cs.post.set( 'settings', this.getSettingData() );
	},

	fetchSections: function() {

    cs.ajax( 'cs_setting_sections', {
    	post_id: this.cs.post.get('post_id')
    }, {
      success: _.bind( this.loadSettings, this ),
      error: function( response ) { cs.warn( response.message ); }
    } );

  },

  loadSettings: function( response ) {

  	this.inspect = new Cornerstone.InspectionSupervisor( {
			name: 'primary',
			source: new Cornerstone.Models.Proxyable(),
			controls: [ {
				name: 'settings-actions',
				key: 'disabled',
				type: 'settings-actions',
			} ]
	  } );

  	this.cs.settingSections = new Backbone.Collection( response.models );
  	this.settings = new Cornerstone.Collections.Setting( response.data );

  	this.settings.each( function( setting ) {

  		setting.inspect = new Cornerstone.InspectionSupervisor( {
				name: 'primary',
				source: setting,
				controls: setting.section.get('controls')
	  	} );

  	} );

		cs.data.reply( 'settings:ready', true );
  	cs.global.trigger( 'settings:ready' );

  },

  getSettings: function() {
  	return this.settings;
  },

  getSettingData: function() {
  	this.settings.invoke( 'updateChildData' );
  	return this.settings.toJSON();
  },

  getPrimaryControls: function() {
  	return this.inspect.controls;
  },

  setupListeners: function() {

  	var model = this.settings.findWhere({ _section: 'general'});

    if ( model ) {
    	this.listenTo( model, 'change:custom_css', function( model, value ) {
      	cs.global.trigger( 'update:custom_css', value );
    	});
    	cs.global.trigger( 'update:custom_css', model.get('custom_css') );
    } else {
    	console.warn( 'Unable to load Custom CSS because Cornerstone settings are corrupted. ' );
    }

    model = this.settings.findWhere({ _section: 'responsive-text'});

    if ( model ) {

    	var update = _.debounce( function() {

      	cs.global.trigger( 'update:responsive_text', _.map( model.elements.toProxy().toJSON(), function( item ) {
        	return _.pick(item, 'selector', 'compression', 'min_size', 'max_size' );
      	}) );

    	}, 5 );

    	this.listenTo( model.elements, 'model:change', update );
    	this.listenTo( model.elements, 'add', update );
    	this.listenTo( model.elements, 'remove', update );
    	update();

    } else {
    	console.warn( 'Unable to load Responsive Text because Cornerstone settings are corrupted. ' );
    }

  },


});
},{}],21:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		this.toggle( false, true );

		cs.data.reply( 'skeleton-mode', false );
		this.listenTo( cs.keybind, 'skeleton-mode', function(){
			this.toggle();
		} )

	},

	toggle: function( state, silent ) {

		if ( _.isUndefined( state ) )
			state = !this.enabled;

		this.enabled = state;

		cs.data.reply( 'skeleton-mode', this.enabled );

		if (!silent)
			cs.events.trigger( 'toggle:skeleton:mode', this.enabled );

		Backbone.$('body').toggleClass('cs-skeleton-active', this.enabled ).toggleClass('cs-skeleton-inactive', !this.enabled );

	}

});
},{}],22:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function() {

		cs.templates = Backbone.Radio.channel( 'cs:templates' );

		this.templates = new Cornerstone.Collections.Template();
		this.selections = new Backbone.Collection();

		this.listenToOnce(  cs.global, 'preview:primed', this.requestTemplates );
		this.on( 'templates:recieved', this.loadTemplates );

    this.listenTo( cs.templates, 'import', this.importTemplate );
    this.listenTo( cs.templates, 'save', this.save );
    this.listenTo( cs.templates, 'delete', this.deletion );
    this.listenTo( cs.templates, 'download', this.blockDownload );

	},

	requestTemplates: function() {
    cs.ajax( 'cs_templates', {}, {
      success: _.bind( function( response, options ) {
        this.templates.add( response );
  			cs.templates.trigger( 'ready', this );
      }, this ),
      error: function( response ) { cs.warn( response.message ); }
    } );
  },

	importTemplate: function( sections, format ) {

		// Convert slug to elements
    if ( typeof sections == 'string' ) {
	    var template = this.templates.findWhere( { slug: sections } );
	    sections = (template) ? template.get('elements') : [];
    }

    var elements = cs.post.elements();

    if ( format == 'page' )
      elements.reset();

    if (!sections || !sections.length || sections.length == 0) {
      cs.message.trigger( 'error', cs.l18n( 'templates-error-import') );
      return;
    }


    // Example conversion if the format were to ever change
    if ( sections[0].elType == "row" ) {
      sections = this.convertLegacy( _.clone( sections ) );
    }


    cs.ajax( 'cs_template_migration', { elements: sections } , {
      success: _.bind( function( response ) {

        _.each( response.elements, function( section ) {
		      elements.create( section );
		    }, this );

        cs.message.trigger( 'success', (format == 'page') ? cs.l18n( 'templates-page-updated') : cs.l18n( 'templates-block-inserted') );

      }, this ),
      error: function( response ) {
        cs.message.trigger( 'error', cs.l18n( 'templates-error-import') );
      },
      always: function( response ) {
      	cs.log( 'template_migration', response);
      }
    } );

  },


  convertLegacy: function( sections ) {

    var moved = [ 'bg_type','bg_color','bg_image','bg_pattern_toggle','parallax','bg_video','bg_video_poster','margin','padding','border_style','border_color','visibility','class','style' ];

    return _.map( sections, function( section ) {

      var newSection = _.pick( section, moved );
      newSection.elType = "section";
      newSection.elements = [];
      newSection.elements.push( _.omit( section, moved ) );

      return newSection;

    } );


  },

	save: function( type, title ) {

		var data = _.extend( _.pick( cs.post.toJSON(), [ 'elements' ] ), {
      type: type || 'block',
      title: title || 'Untitled'
    } );

    cs.ajax( 'cs_save_template', data , {
      success: _.bind( function( response ) {
        this.templates.add( response.template );
        cs.templates.trigger( 'add', this );
        cs.message.trigger( 'success', cs.l18n( 'templates-saved' ), 4000 );
      }, this ),
      error: function( response ) {
        cs.message.trigger( 'error', cs.l18n( 'templates-error-save' ), 10000 );
      },
      always: function( response ) {
      	cs.log( 'save_template', response );
      }
    } );
  },

  deletion: function( slug ) {

  	var model = this.templates.findWhere( { slug: slug } )
  	if ( !model ) return;

  	model.destroy();
    this.deleteRemote( slug );
    cs.templates.trigger( 'remove', this );

  },

  deleteRemote: function( slug ) {
  	cs.ajax( 'cs_delete_template', {
      slug: slug
    }, {
      success: function( response ) {
        cs.message.trigger( 'success', cs.l18n( 'templates-delete-success' ), 4000 );
      },
      error: function( response ) {
        cs.message.trigger( 'error', cs.l18n( 'templates-error-delete' ), 10000 );
      },
      always: function( response ) {
      	cs.log( 'delete_template', response );
      }
    } );
  },

	blockDownload: function( name ) {

    try {
      !!new Blob;
    } catch (e) {
      cs.message.trigger( 'error', cs.l18n( 'browser-no-can') );
      return;
    }

    var name = name || 'template';

    var data = {
      title: name,
      elements: cs.post.toJSON().elements,
    };

    var filename = name.replace(/\s+/g, '_');

    var jsonData = JSON.stringify( data, null, 2);
    Cornerstone.Vendor.FileSaver.saveAs( new Blob([jsonData], {type: "text/plain;charset=utf-8"}), filename + ".csl" );

  }

});
},{}],23:[function(require,module,exports){
module.exports = {

	// Common
	'builder'         : require('./common/builder'),
	'mn-extensions'   : require('./common/mn-extensions'),
	'template-loader' : require('./common/template-loader'),
	'view-loader'     : require('./common/view-loader'),
	'model-loader'    : require('./common/model-loader'),
	'render-queue'    : require('./common/render-queue'),
	'keybindings'     : require('./common/keybindings'),

	// Editor
	'editor'           : require('./editor/editor'),
	'navigator'        : require('./editor/navigator'),
	'options'          : require('./editor/options'),
	'layout'           : require('./editor/layout'),
	'layout-section'   : require('./editor/layout-section'),
	'layout-templates' : require('./editor/layout-templates'),
	'inspector'        : require('./editor/inspector'),
	'post-handler'     : require('./editor/post-handler'),
	'settings'         : require('./editor/settings'),
	'template-manager' : require('./editor/template-manager'),
	'skeleton'         : require('./editor/skeleton'),

	// Preview
	'preview' : require('./preview/preview'),
}
},{"./common/builder":5,"./common/keybindings":6,"./common/mn-extensions":7,"./common/model-loader":8,"./common/render-queue":9,"./common/template-loader":10,"./common/view-loader":11,"./editor/editor":12,"./editor/inspector":13,"./editor/layout":16,"./editor/layout-section":14,"./editor/layout-templates":15,"./editor/navigator":17,"./editor/options":18,"./editor/post-handler":19,"./editor/settings":20,"./editor/skeleton":21,"./editor/template-manager":22,"./preview/preview":24}],24:[function(require,module,exports){
module.exports = Cornerstone.Component.extend({

	initialize: function( options ) {

		Backbone.$( document ).ready(function() {
			Backbone.$('#cornerstone-preview-entry').empty();
		});

		cs.preview  = Backbone.Radio.channel( 'cs:preview' );
		cs.observer = Backbone.Radio.channel( 'cs:observer' );

		xData.isPreview = true;

		// Hook before preview initializes
    this.listenTo(cs.preview, 'iframe:ready', this.reload );

    cs.observer.reply( 'get:collapse', false );
    this.listenTo( cs.preview, 'set:collapse', function( state ) {
			cs.observer.reply( 'get:collapse', state );
		} );

    //window.onbeforeunload = _.bind( this.cleanUp, this );

    // Hook after initialization. This does not gaurantee preview window is
    // accessible. You should probably use 'preview:reloaded' instead.
		cs.events.trigger( 'preview:init' );

		cs.preview.reply( 'responsive:text', null );

		this.listenTo( cs.preview, 'responsive:text', this.responsiveTextUpdate );
		this.listenTo( cs.preview, 'late:enqueue', this.lateEnqueue );

	},


	reload: function( editor ) {

    cs.global = editor. cs.global;
    this.cs.post = editor.cs.post;

    if ( Backbone.$('#cornerstone-preview-entry').length == 0 ) {
			console.log( 'Unable to initialize preview.' );
    }

    var PreviewView = require('../../views/main/preview.js');
    this.view = new PreviewView( { el: '#cornerstone-preview-entry', model: this.cs.post.data } )
		this.view.render();

		this.listenToOnce( cs.render, 'primed', this.primed );
		_.delay( _.bind( function(){
			this.primed( true );
		}, this ), 9000 );
    this.listenTo( cs.global, 'settings:ready', this.settingsPingback );
    this.listenTo( cs.global, 'update:custom_css', this.customCSS );
    this.listenTo( cs.global, 'update:responsive_text', this.responsiveText );
    this.listenTo( cs.global, 'ajax:fallback', function( state ) {
			cs.fallbackAjax = state;
		} );
    cs.events.trigger( 'preview:iframe:reloaded' );

  },

  primed: function( late ) {
		if ( this.isPrimed || cs.global.request( 'editor:ready' ) )
			return;
		this.isPrimed = true;
		cs.global.trigger( 'preview:primed', late || false );
	},

  settingsPingback: function(){
  	cs.global.trigger( 'settings:pingback' );
  },

  customCSS: function( value ) {
  	Backbone.$('#cornerstone-custom-page-css').html( value );
  },

  responsiveText: function( elements ) {
    cs.preview.reply( 'responsive:text', elements );
    Backbone.$(window).trigger('fittextReset');
    cs.preview.trigger( 'responsive:text' );
  },

  responsiveTextUpdate: function( scope ) {
	  var scope = scope || Backbone;

	  var items = cs.preview.request( 'responsive:text' );
	  if (!items) return;

    _.each( items , function( item ) {
      scope.$(item.selector).fitText( item.compression, {
        minFontSize: item.min_size,
        maxFontSize: item.max_size,
      });
    }, this );

  },

  lateEnqueue: function( handle, html, src, done ) {
		if ( Backbone.$('script[data-handle="' + handle + '"]').length == 0 ) {

			var timeout = setTimeout(function(){
				done('Unable to load: ' + handle );
			}, 10000 );

			var script = document.createElement('script');
				Backbone.$('body').append(script);
				script.onload = function() {
				clearTimeout(timeout);
				_.defer( done, 'Script loaded: ' + handle );
				};

				script.src = src;

				Backbone.$(script).attr('data-handle', handle );

		} else {
			done();
		}
  }

});
},{"../../views/main/preview.js":92}],25:[function(require,module,exports){
var media = wp.media;
var l10n = media.view.l10n;
wp.media.view.MediaFrame.Cornerstone = wp.media.view.MediaFrame.Post.extend({
  createStates: function() {
    var options = this.options;

    this.states.add([
      // Main states.
      new media.controller.Library({
        id:         'insert',
        title:      l10n.insertMediaTitle,
        priority:   20,
        toolbar:    'main-insert',
        filterable: 'all',
        library:    media.query( options.library ),
        multiple:   options.multiple ? 'reset' : false,
        editable:   true,

        // If the user isn't allowed to edit fields,
        // can they still edit it locally?
        allowLocalEdits: true,

        // Show the attachment display settings.
        displaySettings: false,
        // Update user settings when users adjust the
        // attachment display settings.
        displayUserSettings: true
      }),

      // new media.controller.Library({
      //   id:         'gallery',
      //   title:      l10n.createGalleryTitle,
      //   priority:   40,
      //   toolbar:    'main-gallery',
      //   filterable: 'uploaded',
      //   multiple:   'add',
      //   editable:   false,

      //   library:  media.query( _.defaults({
      //     type: 'image'
      //   }, options.library ) )
      // }),

      // Embed states.
      new media.controller.Embed( { metadata: options.metadata } ),

      new media.controller.EditImage( { model: options.editImage } ),

      // Gallery states.
      // new media.controller.GalleryEdit({
      //   library: options.selection,
      //   editing: options.editing,
      //   menu:    'gallery'
      // }),

      // new media.controller.GalleryAdd(),

      // new media.controller.Library({
      //   id:         'playlist',
      //   title:      l10n.createPlaylistTitle,
      //   priority:   60,
      //   toolbar:    'main-playlist',
      //   filterable: 'uploaded',
      //   multiple:   'add',
      //   editable:   false,

      //   library:  media.query( _.defaults({
      //     type: 'audio'
      //   }, options.library ) )
      // }),

      // // Playlist states.
      // new media.controller.CollectionEdit({
      //   type: 'audio',
      //   collectionType: 'playlist',
      //   title:          l10n.editPlaylistTitle,
      //   SettingsView:   media.view.Settings.Playlist,
      //   library:        options.selection,
      //   editing:        options.editing,
      //   menu:           'playlist',
      //   dragInfoText:   l10n.playlistDragInfo,
      //   dragInfo:       false
      // }),

      // new media.controller.CollectionAdd({
      //   type: 'audio',
      //   collectionType: 'playlist',
      //   title: l10n.addToPlaylistTitle
      // }),

      // new media.controller.Library({
      //   id:         'video-playlist',
      //   title:      l10n.createVideoPlaylistTitle,
      //   priority:   60,
      //   toolbar:    'main-video-playlist',
      //   filterable: 'uploaded',
      //   multiple:   'add',
      //   editable:   false,

      //   library:  media.query( _.defaults({
      //     type: 'video'
      //   }, options.library ) )
      // }),

      // new media.controller.CollectionEdit({
      //   type: 'video',
      //   collectionType: 'playlist',
      //   title:          l10n.editVideoPlaylistTitle,
      //   SettingsView:   media.view.Settings.Playlist,
      //   library:        options.selection,
      //   editing:        options.editing,
      //   menu:           'video-playlist',
      //   dragInfoText:   l10n.videoPlaylistDragInfo,
      //   dragInfo:       false
      // }),

      // new media.controller.CollectionAdd({
      //   type: 'video',
      //   collectionType: 'playlist',
      //   title: l10n.addToVideoPlaylistTitle
      // })
    ]);

    if ( media.view.settings.post.featuredImageId ) {
      this.states.add( new media.controller.FeaturedImage() );
    }
  }
});

//   initialize: function() {
//     wp.media.view.MediaFrame.prototype.initialize.apply( this, arguments );

//     _.defaults( this.options, {
//       multiple:  true,
//       editing:   false,
//       state:  'insert'
//     });

//     this.createSelection();
//     this.createStates();
//     this.bindHandlers();
//     this.createIframeStates();
//   },

//   createStates: function() {
//   var options = this.options;

//   // Add the default states.
//   this.states.add([
//     // Main states.
//     new wp.media.controller.Library({
//     id:   'insert',
//     title:  'Insert Media',
//     priority:   20,
//     toolbar:  'main-insert',
//     filterable: 'image',
//     library:  wp.media.query( options.library ),
//     multiple:   options.multiple ? 'reset' : false,
//     editable:   true,

//     // If the user isn't allowed to edit fields,
//     // can they still edit it locally?
//     allowLocalEdits: true,

//     // Show the attachment display settings.
//     displaySettings: true,
//     // Update user settings when users adjust the
//     // attachment display settings.
//     displayUserSettings: true
//     }),

//     // Embed states.
//     new wp.media.controller.Embed(),
//   ]);


//   if ( wp.media.view.settings.post.featuredImageId ) {
//     this.states.add( new wp.media.controller.FeaturedImage() );
//   }
//   },

//   bindHandlers: function() {
//   // from Select
//   this.on( 'router:create:browse', this.createRouter, this );
//   this.on( 'router:render:browse', this.browseRouter, this );
//   this.on( 'content:create:browse', this.browseContent, this );
//   this.on( 'content:render:upload', this.uploadContent, this );
//   this.on( 'toolbar:create:select', this.createSelectToolbar, this );
//   //

//   this.on( 'menu:create:gallery', this.createMenu, this );
//   this.on( 'toolbar:create:main-insert', this.createToolbar, this );
//   this.on( 'toolbar:create:main-gallery', this.createToolbar, this );
//   this.on( 'toolbar:create:featured-image', this.featuredImageToolbar, this );
//   this.on( 'toolbar:create:main-embed', this.mainEmbedToolbar, this );

//   var handlers = {
//     menu: {
//       'default': 'mainMenu'
//     },

//     content: {
//       'embed':    'embedContent',
//       'edit-selection': 'editSelectionContent'
//     },

//     toolbar: {
//       'main-insert':  'mainInsertToolbar'
//     }
//     };

//   _.each( handlers, function( regionHandlers, region ) {
//     _.each( regionHandlers, function( callback, handler ) {
//     this.on( region + ':render:' + handler, this[ callback ], this );
//     }, this );
//   }, this );
//   },

//   // Menus
//   mainMenu: function( view ) {
//   view.set({
//     'library-separator': new wp.media.View({
//     className: 'separator',
//     priority: 100
//     })
//   });
//   },

//   // Content
//   embedContent: function() {
//   var view = new wp.media.view.Embed({
//     controller: this,
//     model:  this.state()
//   }).render();

//   this.content.set( view );
//   view.url.focus();
//   },

//   editSelectionContent: function() {
//   var state = this.state(),
//     selection = state.get('selection'),
//     view;

//   view = new wp.media.view.AttachmentsBrowser({
//     controller: this,
//     collection: selection,
//     selection:  selection,
//     model:  state,
//     sortable:   true,
//     search:   false,
//     dragInfo:   true,

//     AttachmentView: wp.media.view.Attachment.EditSelection
//   }).render();

//   view.toolbar.set( 'backToLibrary', {
//     text:   'Return to Library',
//     priority: -100,

//     click: function() {
//     this.controller.content.mode('browse');
//     }
//   });

//   // Browse our library of attachments.
//   this.content.set( view );
//   },

//   // Toolbars
//   selectionStatusToolbar: function( view ) {
//   var editable = this.state().get('editable');

//   view.set( 'selection', new wp.media.view.Selection({
//     controller: this,
//     collection: this.state().get('selection'),
//     priority:   -40,

//     // If the selection is editable, pass the callback to
//     // switch the content mode.
//     editable: editable && function() {
//     this.controller.content.mode('edit-selection');
//     }
//   }).render() );
//   },

//   mainInsertToolbar: function( view ) {
//   var controller = this;

//   this.selectionStatusToolbar( view );

//   view.set( 'insert', {
//     style:  'primary',
//     priority: 80,
//     text:   'Select Image',
//     requires: { selection: true },

//     click: function() {
//     var state = controller.state(),
//       selection = state.get('selection');

//     controller.close();
//     state.trigger( 'insert', selection ).reset();
//     }
//   });
//   },

//   featuredImageToolbar: function( toolbar ) {
//   this.createSelectToolbar( toolbar, {
//     text:  'Set Featured Image',
//     state: this.options.state || 'upload'
//   });
//   },

//   mainEmbedToolbar: function( toolbar ) {
//   toolbar.view = new wp.media.view.Toolbar.Embed({
//     controller: this,
//     text: 'Insert Image'
//   });
//   }

// });
},{}],26:[function(require,module,exports){
(function($){

    var $shadow = $('<div class="shadow-height" style="position:absolute;top:-100%;visibility:hidden;"></div>');

    $.fn.shadowHeight = function(){

    		if (this.length < 1) return;

        var $el = this.length > 1 ? this.eq(0) : this
        var $copy = $el.clone();

    		$shadow.empty().appendTo('body');
    		$shadow.append($copy);

    		var height = $copy.outerHeight();

    		$shadow.detach();
    		$copy.remove();

				return height;
    };

})(jQuery);
},{}],27:[function(require,module,exports){
/**
 * Custom Renderer using Cornerstone precompiled templates as a source
 * Includes global template helpers
 */
module.exports = {

	templateHelpers: require('./template-helpers'),

	render: function( template, data, view ) {

		var data = data || {};

    if ( view && _.isFunction( view.triggerMethod ) )
    	view.triggerMethod( 'template:data:ready', data );

    if ( template === false ) return;

    if (!template) {
      throw new Cornerstone.Mn.Error({
        name: 'TemplateNotFoundError',
        message: 'Cannot render the template since its false, null or undefined.'
      });
    }

    var templateFunc = _.isFunction(template) ? template : cs.template( template );

    if (!templateFunc) {
      throw new Cornerstone.Mn.Error({
        name: 'TemplateLookupError',
        message: 'Template not found in precompiled templates: ' + template
      });
    }

    return templateFunc( _.extend( data, this.templateHelpers ) );
  }
}
},{"./template-helpers":30}],28:[function(require,module,exports){
module.exports.layoutIsValid = function( layout ) {
	return _([ '1/1','1/2 + 1/2','2/3 + 1/3','1/3 + 2/3','1/3 + 1/3 + 1/3','3/4 + 1/4','1/4 + 3/4','1/2 + 1/2','1/2 + 1/4 + 1/4','1/4 + 1/2 + 1/4','1/4 + 1/4 + 1/2','1/4 + 1/4 + 1/4 + 1/4','4/5 + 1/5','1/5 + 4/5','3/5 + 2/5','2/5 + 3/5','3/5 + 1/5 + 1/5','1/5 + 3/5 + 1/5','1/5 + 1/5 + 3/5','2/5 + 2/5 + 1/5','2/5 + 1/5 + 2/5','1/5 + 2/5 + 2/5','2/5 + 1/5 + 1/5 + 1/5','1/5 + 2/5 + 1/5 + 1/5','1/5 + 1/5 + 2/5 + 1/5','1/5 + 1/5 + 1/5 + 2/5','1/5 + 1/5 + 1/5 + 1/5 + 1/5','5/6 + 1/6','1/6 + 5/6','2/3 + 1/3','1/3 + 2/3','2/3 + 1/6 + 1/6','1/6 + 2/3 + 1/6','1/6 + 1/6 + 2/3','1/2 + 1/2','1/2 + 1/3 + 1/6','1/2 + 1/6 + 1/3','1/3 + 1/2 + 1/6','1/3 + 1/6 + 1/2','1/6 + 1/2 + 1/3','1/6 + 1/3 + 1/2','1/2 + 1/6 + 1/6 + 1/6','1/6 + 1/2 + 1/6 + 1/6','1/6 + 1/6 + 1/2 + 1/6','1/6 + 1/6 + 1/6 + 1/2','1/3 + 1/3 + 1/3','1/3 + 1/3 + 1/6 + 1/6','1/3 + 1/6 + 1/3 + 1/6','1/3 + 1/6 + 1/6 + 1/3','1/6 + 1/3 + 1/3 + 1/6','1/6 + 1/3 + 1/6 + 1/3','1/6 + 1/6 + 1/3 + 1/3','1/3 + 1/6 + 1/6 + 1/6 + 1/6','1/6 + 1/3 + 1/6 + 1/6 + 1/6','1/6 + 1/6 + 1/3 + 1/6 + 1/6','1/6 + 1/6 + 1/6 + 1/3 + 1/6','1/6 + 1/6 + 1/6 + 1/6 + 1/3','1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6' ])
				  .contains( layout );
}

module.exports.reduceFractions = function( replace ) {
  reductions = [{f:'2\/4', r: '1/2'},{f:'2\/6', r: '1/3'},{f:'3\/6', r: '1/2'},{f:'4\/6', r: '2/3'}];
  var string = replace;
  _(reductions).each(function(reducer){
    var re = new RegExp(reducer.f,"g");
    string = string.replace(re,reducer.r)
  });
  return string;
}
},{}],29:[function(require,module,exports){
String.prototype.replaceAll = function (find, replace) {
  return this.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
}
},{}],30:[function(require,module,exports){
var TemplateHelpers = {
	/**
	 * Wrapper for global l18n
	 */
	l18n: function() {
		return cs.l18n.apply( cs, arguments );
	},

	/**
	 * Wrapper for Icon Lookup
	 */
	getIcon: function() {
		return cs.icon.apply( cs, arguments )
	},

	/**
	 * Wrapper for HTML entity Font icon
	 */
	fontIcon: function() {
		return cs.fontIcon.apply( cs, arguments )
	},

	/**
	 * Access to renderer inside templates
	 */
	render: function() {
		return CS.Mn.Renderer.render.apply( this, arguments  );
	},

	/**
	 * Returns message if debug mode is active
	 */
	debug: function ( message ) { return ''; }
}

if ( cs.debug() ) {
	TemplateHelpers.debug = function ( message ) { return message; }
}

module.exports = TemplateHelpers;

},{}],31:[function(require,module,exports){
module.exports = CS.Mn.CompositeView.extend({
	tagName: 'li',
	template: 'controls/base',
	controlName: 'default',
	bindings: {},
	canCompact: true,
	baseEvents: {
    'click button.cs-expand-control': 'expandControl'
  },
	controlEvents: {},
	events: function(){
		return _.extend( this.baseEvents, this.controlEvents );
	},
	constructor: function() {

		/**
		 * Set class name base on control name
		 */
		this.className = 'cs-control cs-control-' + this.controlName;

		/**
		 * Call Super (Parent constructors, and eventually initialize)
		 */
    CS.Mn.CompositeView.apply( this, arguments );

    this.configureProxy();
    this.listenTo( this.model, 'set:proxy', this.configureProxy );

    this.listenTo( cs.options, 'changed', function( option ){
    	if ( this.model.get('name') == option ) return;
    	this.triggerMethod( 'options:changed' );
    } );

    this.on('render', this.baseRender );

    /**
     * Ensure a controlTemplate is defined
     * Native controls can derive a template from their controlName
     * External controls will need to explicitly define a template
     */
    if ( !_.isFunction( this.controlTemplate ) && !_.isFunction( cs.template( this.controlTemplate ) ) ) {
    	this.controlTemplate = 'controls/' + this.controlName;
    }

	},

	configureProxy: function() {

		if ( this.proxy )
			this.stopListening( this.proxy );

    this.proxy = this.model.proxy || null;
    if ( _.isNull( this.proxy ) ) return;

    var conditions = this.model.get('condition');
    if ( conditions ) {
    	_.each( _.keys( conditions ) , function( item ) {

				if ( item.indexOf(':not') == item.length - 4 ) item = item.replace( ':not', '' );
        if ( item.indexOf('parent:') == 0 ) item = item.replace( 'parent:', '' );
    		this.listenTo(this.proxy, 'change:' + item, this.toggleVisibility );

    	}, this );
    }

  	this.triggerMethod( 'proxy:ready' );

	},

	onOptionsChanged: function() {
		this.render();
	},

	toggleVisibility: function() {

		var visible = true;
		var conditions = this.model.get('condition');

		if ( !_.isNull(this.proxy) && conditions ) {

			// We want this to be empty, so returning false for all items
			// means all conditions have been met
			var remainingConditions = _.filter( _.keys( conditions ) , _.bind( function( conditionName ) {

				var negate = ( conditionName.indexOf(':not') == conditionName.length - 4 );
				var conditionValue = conditions[conditionName];

				if (negate) conditionName = conditionName.replace(':not','');

        if ( conditionName.indexOf('parent:') == 0 ) {
          source = this.proxy.getSourceParent().toProxy();
          conditionName = conditionName.replace('parent:','');
        } else {
          source = this.proxy;
        }

        var controlValue = source.get(conditionName);

	  		var check = ( _.isArray(conditionValue) ) ? _.contains( conditionValue, controlValue) : ( controlValue == conditionValue );

	  		return (negate) ? check : !check;

	    }, this ));

			visible = _.isEmpty( remainingConditions );

  	}

  	var hidden = this.$el.hasClass( 'hide' );
  	var changed = ( (hidden && visible) || ( !hidden && !visible ) );

		this.$el.toggleClass( 'hide', !visible );

		if (changed) {
			cs.navigate.trigger( 'scrollbar:update' );
		}

		this.triggerMethod( 'custom:visibility', visible, changed );

	},

	baseRender: function() {

		this.triggerMethod('before:base:render');

		var ui = this.model.get('ui')
		var options = this.model.get('options')

		if ( ( !ui.title && this.canCompact ) || options.compact ) this.$el.addClass('cs-control-compact');
		if ( ui.divider || this.divider ) this.$el.addClass('cs-control-divider');

		this.$el.attr('data-name', this.model.get('name') );
		this.toggleVisibility();
		this.stickitBindings();
		this.triggerMethod('after:base:render');
	},

	stickitBindings: function() {

		var selector = this.bindingSelector || 'input[type=hidden]';
		var config = { observe: this.model.get('key') };

		if (this.binding)
			_.extend( config, this.binding )

  	this.addBinding( this.proxy, selector, config);
  	this.stickit( this.proxy );

	},


	/**
	 * Provide additional data to the template
	 */
	serializeData: function() {

		var options = this.model.get('options');
		var ui = _.clone( this.model.get('ui') );

		if ( ui.message && ui.message.indexOf('[HelpText]') == 0) {
			ui.message = ui.message.replace('[HelpText]','');
		}

		if ( !cs.options.request( 'help:text' ) && options.helpText !== false ) {
			ui.message = false;
		}

		var data = _.extend( CS.Mn.CompositeView.prototype.serializeData.apply(this,arguments), {
			controlTemplate: this.controlTemplate,
			controlType: this.model.get('type'),
			ui: ui
		});

		if ( data.ui.title )
			data.ui.title = this.replacePlaceholders( data.ui.title );

		if ( data.ui.tooltip )
			data.ui.tooltip = this.replacePlaceholders( data.ui.tooltip );

		if ( data.ui.message )
			data.ui.message = this.replacePlaceholders( data.ui.message );

		if ( this.proxy )
			_.extend( data, this.proxy.toJSON() );

		if ( _.isFunction( this.controlData ) )
			_.extend( data, this.controlData() );

		return data;

	},

	baseTextReplacements: {
		'%%element-name%%': function() {
			return this.proxy.definition.get('name');
		},
		'%%icon%%': function() {
			return cs.icon( this.model.get('name') );
		},
		'%%icon-nav-elements-solid%%': function() {
			return cs.icon( 'nav-elements-solid' );
		},
		'%%icon-nav-settings-solid%%': function() {
			return cs.icon( 'nav-settings-solid' );
		}
	},

	replacePlaceholders: function ( text ) {

		_.each( _.extend( this.textReplacements || {}, this.baseTextReplacements ), _.bind( function( callback, tag ) {
			if ( text.indexOf( tag ) == -1 ) return;
			text = text.replace( new RegExp( tag, 'g'), callback.apply(this) );
		}, this) );

		return text;
	},

	notLiveTrigger: function() {
		var options = this.model.get('options');
		if (options.notLive) {
			cs.data.trigger('control:not:live', this.model.proxy.get('name') + '_' + this.model.get('name'), options.notLive);
		}
	},

  expandControl: function() {
    this.triggerMethod( 'before:expand' );
    this.$el.addClass( 'cs-control-expanded' );
    cs.events.trigger( 'expand:control', this.proxy.getSource(), this.model.get('name'), this );

    this.listenToOnce( cs.events, 'expand:close', this.expandClose );
  },

  expandClose: function() {

  	this.proxy.refresh();
  	this.$el.removeClass( 'cs-control-expanded' );
  	this.render();
  	this.triggerMethod( 'after:expand' );
    // this.$el.removeClass( 'cs-control-expanded' ).one( 'transitionend', _.bind( function() {
    // 	this.render();
    //
    // }, this ) );

  },

});
},{}],32:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-breadcrumbs cs-control-divider',
  template: 'inspector/breadcrumbs',
  controlName: 'breadcrumbs',
  events: {
    'click button': 'inspect',
    'mouseover button': 'mouseOver',
    'mouseout button': 'mouseOut',
  },

  initialize: function() {
    this.levels = this.findLevels( [], this.model.proxy.getSource() );
  },

  mouseOver: function( e ) {
    var level = this.buttonLevel( e );
    if ( level  ) level.model.trigger( 'observe:start' );
  },

  mouseOut: function( e ) {
    var level = this.buttonLevel( e );
    if ( level  ) level.model.trigger( 'observe:end' );
  },

  inspect: function( e ) {
    var level = this.buttonLevel( e );
    if ( !level ) return;
    cs.events.trigger( 'inspect:element', level.model );
    //cs.navigate.trigger( 'inspector:home' );
  },

  buttonLevel: function( e ) {
    return this.levels[ parseInt( this.$(e.currentTarget).data('level') ) ];
  },

  findLevels: function( levels, model ) {

    if ( model.get('_type') != 'section' && model.collection && model.collection.parent ) {
      levels = this.findLevels( levels, model.collection.parent );
    }

    var item = {
    	label: model.definition.get('ui').title,
    	model: model
    };

    switch ( model.get('_type') ) {
      case 'section':
        item.title = model.get('title');
        item.label = cs.l18n('section');
        break;
      case 'row':
        item.label = cs.l18n('row');
        break;
      case 'column':
        item.label = cs.l18n('column');
        break;
    }

    levels.push( item );

    return levels;
  },

  serializeData: function() {
    return {
      items: _.first( this.levels, 4 ),
      count: this.levels.length,
      rtl: ( cs.config( 'isRTL' ) == 'true' )
    }
  },

  onRender: function( ) {
  	if ( this.levels.length <= 1 && !this.levels[0].title ) this.$el.toggleClass( 'hide', true );
  }

});
},{}],33:[function(require,module,exports){
	module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'choose',
	binding: {
    initialize: function($el, model, options) {

      var localOpts = this.model.get('options')

    	/**
    	 * Update Model when a new option is clicked
    	 */
      this.$('li').on('click', _.bind( function (e) {

        var choice = this.$(e.currentTarget).data('choice');

        if ( !_.isUndefined( localOpts.offValue ) && choice == model.get( options.observe ) ) {
          choice = localOpts.offValue;
        }

      	model.set( options.observe, choice );
      }, this ) );

      /**
       * Handler to set the active state based on the model value
       */
    	var setActive = _.bind( function( model, value ) {
        var selection = (options.observe) ? value : null;
        if ( !selection && selection != "" ) {
          selection = (localOpts.choices && localOpts.choices.length > 0) ? localOpts.choices[0].value : 'none'
        }

    		this.$('li').removeClass('active').siblings('[data-choice=' + ( (selection == '') ? 'none' : selection ) + ']').addClass('active');
    	}, this );

    	/**
    	 * Set the initial active state, then listen to model changes to change the state later
    	 */
    	setActive( model, model.get( options.observe ) );
    	this.listenTo(model, 'change:' + options.observe, setActive );

    }
	},
  onBeforeRender: function() {

    /**
     * Make sure we have a valid number of columns.
     */
    var options = this.model.get('options');
    if ( !_.contains(['2', '3', '4', '5'], options.columns ) ) {
      options.columns = '2';
      this.model.set('options',options);
    }
  }
});
},{}],34:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'div',
	className: 'cs-control-external cs-control-code-editor',
	template: _.template('<textarea></textarea>'),

	initialize: function(){

		this.listenTo( cs.navigate, 'open:code:editor', function( name ){
			if (name == this.model.get('key')){
				this.$('textarea').csCodeEditorShow();
			}
		});

	},

	onRender: function() {
		var localOpts, options;

		this.$('textarea').val(this.model.proxy.get(this.model.get('key')));

		localOpts = this.model.get('options');

		options = localOpts.settings || {};

	 	options = _.extend( options, {
			change: _.bind(function( cm ){
				this.model.proxy.set(this.model.get('key'),cm.doc.getValue());
			}, this )
		});

		_.defer(_.bind(function(){
			this.$el.detach();
			Backbone.$('body').append( this.$el );
			this.$('textarea').csCodeEditor( options );
		}, this ) );

	}

});
},{}],35:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
controlName: 'color',
	binding: {
		initialize: function($el, model, options) {

			this.$('.cs-color-input').val(model.get( options.observe )).wpColorPicker({
				width: 258,
				change: function( event, ui ) {
					this.click = true;
					model.set( options.observe,  ui.color.toString() );
				},
				clear: function() {
					model.set( options.observe, '' );
				}
			});

			/**
			* Handler to set the active state based on the model value
			*/
			var setActive = _.bind( function( model, value ) {

				if ( this.click ) {
					this.click = false; return;
				}

				this.$('.cs-color-input').wpColorPicker( 'color', model.get(options.observe) );

			}, this );

			/**
			* Set the initial active state, then listen to model changes to change the state later
			*/

			this.listenTo(model, 'change:' + options.observe, setActive );

		}
	},

	onBeforeDestroy: function() {
		// Close the color picker manually.
		// https://core.trac.wordpress.org/ticket/32856
		this.$('.cs-color-input').wpColorPicker('close');
	}
});
},{}],36:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-actions cs-control-divider',
  template: 'inspector/column-actions',
  controlName: 'actions',
	ui: {
    'confirm': '.action.erase',
    'layout' : '.action.manage-layout',
  },

  events: {
    'click @ui.layout': 'layout'
  },

  behaviors: {
    Confirm: {
      message: cs.l18n('columns-erase-confirm'),
    }
  },

  initialize: function( options ) {
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
  },

  layout: function() {
  	cs.events.trigger( 'inspect:layout:row', this.proxy.getSourceParent() );
  	cs.navigate.trigger( 'layout:rows' );
  },

  onConfirmAccept: function() {
    cs.elements.trigger( 'erase', { model: this.proxy.getSource() } );
  },

});
},{}],37:[function(require,module,exports){
module.exports = CS.Mn.CollectionView.extend({
	tagName: 'ul',

	className: 'cs-controls',

	initialize: function() {
		this.repaint = _.debounce( _.bind( function(){

			try {
				this.render()
			} catch (e) {
				if ( e.name == 'ViewDestroyedError' ) return;
				console.log('Cornerstone Render Exception', e );
			}

		}, this ), 4 );
		this.listenTo( this.collection, 'add', this.repaint );
		this.listenTo( this.collection, 'remove', this.repaint );
		this.listenTo( this.collection, 'reset', this.repaint );
		this.listenTo( cs.navigate, 'auto:focus', this.autoFocus );
	},

	getChildView: function( item ) { return cs.controlLookup( item.get('type') ); },

	onRender: function() {
		_.defer( _.bind( function(){
			this.$el.toggleClass( 'empty', this.collection.isEmpty() );
			this.autoFocus();
		}, this ) );
	},

	autoFocus: function( ) {

  	var name = cs.navigate.request( 'auto:focus' );

  	if ( false === name )
  		return;

  	var $control = this.$('[data-name="' + name + '"]');

  	if ( $control.length > 0 && !$control.hasClass( 'cs-control-expanded' ) ) {
  		cs.navigate.reply(false);
  		$control.find('input[type="text"],textarea').focus();
  	}

  }

})
},{}],38:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	template: 'controls/custom-markup',
	controlName: 'custom-markup',
	controlData: function() {
		var opts = this.model.get('options');
		var message = opts.html || '';
		return { message: message };
	},
});
},{}],39:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'dimensions',
	binding: {
	  initialize: function($el, model, options) {

      var localOpts = this.model.get('options');

      var $field;
      if (localOpts.lock) {
        _.each( localOpts.lock, function( value, key ) {
          this.$('[data-edge=' + key + ']').prop( 'disabled', true ).val( value );
        }, this );
      }

      this.$('button.save')
      /**
       * Update value for link toggle
       */
      this.$('button.cs-link-dimensions').click(function(){
        var val = _.clone( model.get(options.observe) );
        state = ( val[4] == 'linked') ? 'unlinked' : 'linked';

        // When linking, make everything the first value for visual feedback
        if ( state == 'linked') {
          val = _.map(val, function(){ return val[0]; });
        }

        val[4] = state;

        if (localOpts.lock) {
          _.each( localOpts.lock, function( value, key ) {
            if (key == 'top' )    val[0] = value;
            if (key == 'right' )  val[1] = value;
            if (key == 'bottom' ) val[2] = value;
            if (key == 'left' )   val[3] = value;
          }, this );
        }

        model.set( options.observe, val );
      });

    	/**
    	 * Update Model when a new option is clicked
    	 */
    	this.$('[data-edge]').on('change keyup', _.bind( function (e) {

        $changed = this.$(e.currentTarget);
    		var val = _.clone( model.get(options.observe) );

        var update = $changed.val().trim();
        if ( update == '' ) update = '0px';

        if ( val[4] == 'linked' ) {
          val = _.map(val, function(){ return update; });
          val[4] = 'linked';
        } else {
          val[ $changed.parent().index() ] = update;
          val[4] = 'unlinked';
        }

        if (localOpts.lock) {
          _.each( localOpts.lock, function( value, key ) {
            if (key == 'top' )    val[0] = value;
            if (key == 'right' )  val[1] = value;
            if (key == 'bottom' ) val[2] = value;
            if (key == 'left' )   val[3] = value;
          }, this );
        }


    		model.set( options.observe, val );


    	}, this ) );

      /**
       * Handler to set the active state based on the model value
       */
    	var setValues = _.bind( function( model, val ) {

    		$top = this.$('[data-edge=top]');
        $right = this.$('[data-edge=right]');
        $bottom = this.$('[data-edge=bottom]');
        $left = this.$('[data-edge=left]')

        if ( $top.val() != val[0] ) $top.val( val[0] );
        if ( $right.val() != val[1] ) $right.val( val[1] );
        if ( $bottom.val() != val[2] ) $bottom.val( val[2] );
        if ( $left.val() != val[3] ) $left.val( val[3] );

        if ( $top.val() != val[0] ) $top.val( val[0] );
        if ( $right.val() != val[1] ) $right.val( val[1] );
        if ( $bottom.val() != val[2] ) $bottom.val( val[2] );
        if ( $left.val() != val[3] ) $left.val( val[3] );

        this.$('button.cs-link-dimensions').toggleClass( 'active', ( val[4] == 'linked' ) );

    	}, this );

    	/**
    	 * Set the initial active state, then listen to model changes to change the state later
    	 */
    	setValues( model, model.get( options.observe ) );
    	this.listenTo(model, 'change:' + options.observe, setValues );

    }
	}
});
},{}],40:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
  controlName: 'editor',
  controlTemplate: 'controls/textarea',
  bindingSelector: 'textarea.cs-wp-editor',
  binding: {
    events: [ 'keyup', 'change', 'cut', 'paste', 'focus' ],
    onSet: function(value) { return this.textReplace( value ); },
    onGet: function(value) { return this.textReplace( value ); }
  },
  onProxyReady: function() {

    this.editorID = 'cswpeditor' + this.cid;

    tinyMCEPreInit.mceInit[ this.editorID ] = _.clone(tinyMCEPreInit.mceInit['cswpeditor']);
    tinyMCEPreInit.mceInit[ this.editorID ].id = this.editorID;
    tinyMCEPreInit.mceInit[ this.editorID ].selector = '#' + this.editorID;

    tinyMCEPreInit.qtInit[ this.editorID ] = {
      buttons: "strong,em,del,link,img,close",
      id: this.editorID,
    }

    tinyMCEPreInit.mceInit[ this.editorID ].setup = _.bind(function(editor) {

    	var update = _.debounce( _.bind( function() {
        editor.save(); // Commit editor contents to original textarea
        this.$('.cs-wp-editor').trigger('change'); // Trigger stickit
      }, this ), 150 )

      editor.on( 'keyup change NodeChange', update );

    }, this );

    this.markup = cs.config('editorMarkup')
      .replace( new RegExp('cswpeditor', 'g'), this.editorID )
      .replace( new RegExp('%%PLACEHOLDER%%', 'g'), this.proxy.get('content') );

  },

  updateContent: function() {

  },

  attachElContent: function(html) {
    this.$el.html( this.markup );
    this.$el.append( cs.template( 'controls/expand-control-button' )() );
    return this;
  },

  onRender: function() {

    // Convert Add Media button to icon only.
    this.$('.button.insert-media.add_media').html( '<span class="wp-media-buttons-icon"></span>' );

    // Strip 3rd party buttons
    this.$('.wp-media-buttons').children().not('#insert-media-button,#cs-insert-shortcode-button').detach();

    // Wait a cycle before initializing the editors.
    _.defer( _.bind( function() {

      // Initialize QuickTags with cloned settings, and set as the default mode.
      quicktags( tinyMCEPreInit.qtInit[this.editorID] );
      switchEditors.go( this.editorID, 'html' );
      wpActiveEditor = this.editorID;

      // Remove default instance after initializes. This allows reinitializion an unlimited amount of times.
      _.defer(function(){
        delete QTags.instances[0];
      });

    }, this ) );

  },

  onDestroy: function() {

    // Remove TinyMCE and QuickTags instances
    tinymce.EditorManager.execCommand('mceRemoveEditor',true, this.editorID );
    delete QTags.instances[this.editorID];

    // Cleanup PreInit data
    delete tinyMCEPreInit.mceInit[ this.editorID ];
    delete tinyMCEPreInit.qtInit[ this.editorID ];

  },

  replacements: {
    // '<!--nextpage-->': '<!--!nextpage-->',
    // '<!--more-->': '<!--!more-->'
  },

  textReplace: function( content ) {

    // _.each(this.replacements, function(replace, find){
    //   content = content.replaceAll( find, replace );
    // });

    return content;

  },

  onBeforeExpand: function() {
    switchEditors.go( this.editorID, 'html' );
  }

});
},{}],41:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-actions cs-control-divider',
  template: 'inspector/element-actions',
  controlName: 'actions',
	ui: {
    'confirm': '.action.delete',
    'duplicate' : '.action.duplicate',
  },

  events: {
    'click @ui.duplicate': 'duplicate'
  },

  behaviors: {
    Confirm: {
      message: cs.l18n('inspector-delete-confirm'),
    }
  },

  initialize: function( options ) {
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
  },

  duplicate: function() {
  	cs.elements.trigger( 'duplicate', this.proxy.getSource() );
  },

  onConfirmAccept: function() {
    cs.elements.trigger( 'delete', { model: this.proxy.getSource(), success: function() {
      cs.confirm.trigger( 'complete' );
    	cs.channel.trigger( 'inspect:nothing' );
    } } );
  },

});
},{}],42:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'icon-choose',
  childViewContainer: 'ul.cs-choose',
  childView: CS.Mn.ItemView.extend({
    tagName: 'li',
    template: 'controls/icon-choose-item'
  }),

  events: {
    'keyup .cs-search-input': 'search',
    'search .cs-search-input': 'search'
  },

  initialize: function() {
    this.iconData = cs.data.request('get:icons');
    this.filteredIcons = this.iconData;
    this.iconNames = cs.config( 'fontAwesome' );

    this.lazyUpdateSearch = _.debounce( this.updateSearch, 250 );
  },

  search: function() {
    this.lazyUpdateSearch( this.$('.cs-search-input').val().toLowerCase().trim() )
  },

  updateSearch: function( query ) {

    _.defer( _.bind( this.deferRender, this ) );

    if (query == '') {
      this.filteredIcons = this.iconData
      return;
    }

     var filtered = {};
     _.each( this.iconData, function( names, key ) {

      var score = _.reduce( names, function( memo, name ) {
        return memo + name.score( query );
      }, 0 );

      if ( score  > .5 )
        filtered[key] = names;
    } );

    this.filteredIcons = filtered;

  },


	binding: {
    initialize: function($el, model, options) {

      /**
       * Update Model when a new option is clicked
       */
      this.$('ul').on('click', 'li', _.bind( function (e) {

        var choice = this.$(e.currentTarget).data('choice');
        if ( choice == model.get( options.observe ) ) {
          model.set( options.observe, '' );
          return;
        }

        if (this.$prevIcon)
          this.$prevIcon.removeClass('active')

        this.$prevIcon = this.$(e.currentTarget)
        this.click = true;

        model.set( options.observe, choice );
        this.$(e.currentTarget).addClass('active');

      }, this ) );

      /**
       * Handler to set the active state based on the model value
       */
      var setActive = _.bind( function( model, selection ) {

        if ( this.$prevIcon )
          this.$prevIcon.removeClass('active');

        if ( !selection || selection == '' ) return;

        this.$prevIcon = this.$('.cs-icons-inner li[data-choice=' + selection + ']')
        this.$prevIcon.addClass('active');

        var pos = this.$prevIcon.position();

        if( !this.click && pos )
          this.$('.cs-icons-inner').scrollTop(pos.top).perfectScrollbar('update');

        this.click = false;

      }, this );

      /**
       * Set the initial active state, then listen to model changes to change the state later
       */

      //setActive( model, model.get( options.observe ), false );

      this.on('deferred:render', function(){
        setActive( model, model.get( options.observe ) );
      });

      this.listenTo(model, 'change:' + options.observe, setActive );


    }
  },

  onRender: function() {

  	this.$('ul.cs-choose').empty();

    var count = 0;
    _.each( this.filteredIcons, function( words, code ) {
      if ( count++ > 20) return;
      this.$('ul.cs-choose').append( cs.template('controls/icon-choose-item')({ code: code, choice: words[0], choices: words.join(' ') }) );
    }, this );

    this.$('.cs-icons-inner').perfectScrollbar({
      scrollYMarginOffset: 10,
      wheelPropagation: true
    });

    // Outputting the icons takes a moment, so let's do that pseudo-asynch
    _.defer( _.bind( this.deferRender, this ) );

  },

  deferRender: function() {

    this.$('ul.cs-choose').empty();

    _.each( this.filteredIcons, function( words, code ) {
      this.$('ul.cs-choose').append( cs.template('controls/icon-choose-item')({ code: code, choice: words[0], choices: words.join(' ') }) );
    }, this );

    this.$('.cs-icons-inner').perfectScrollbar('update');
    this.trigger('deferred:render');
  }

});
},{}],43:[function(require,module,exports){

var ImageControl =  Cornerstone.ControlViews.Base.extend({
  controlName: 'image',
  binding: {
    initialize: function($el, model, options) {

      /**
       * Update Model when a new option is clicked
       */
      this.$('.cs-image').on('click', _.bind( function (e) {

        if ( !this.$(e.currentTarget).hasClass( 'empty' ) ) {
          model.set( options.observe, '' );
          return;
        }

        var uploader = ImageControl.uploader;

        uploader.off( 'insert' );
        uploader.off( 'select' );

        uploader.on( 'insert', _.bind( function() {
          var data = uploader.state().get( 'selection' ).first().toJSON();

          model.set( options.observe, data.url );
        }, this ) );

        uploader.on( 'select', function(){

          var state = uploader.state();

          if (state && state.get('id') == 'embed') {
            model.set( options.observe, state.props.get('url') );
          }

        });

        uploader.open();

      }, this ) );

      /**
       * Handler to set the active state based on the model value
       */
      var setActive = _.bind( function( model, image ) {

        var isEmpty = ( '' == image );

        this.$('.cs-image').toggleClass( 'empty', isEmpty )
          .css( { backgroundImage: isEmpty ? 'none' : 'url(' + image + ')' } );

      }, this );

      /**
       * Set the initial active state, then listen to model changes to change the state later
       */
      setActive( model, model.get( options.observe ) );
      this.listenTo(model, 'change:' + options.observe, setActive );
    }
  },
  initialize: function() {
     ImageControl.createMediaFrame();
  },
  onRender: function() {
    var options = this.model.get('options');
    this.$('.cs-image').toggleClass( 'pattern', (options['pattern'] === true) )
  }
},{

  // Static methods

  uploader: null,

  createMediaFrame: function() {

    if ( this.uploader ==  null) {
       this.uploader = new wp.media.view.MediaFrame.Cornerstone({
        className: 'media-frame cs-media-frame',
        multiple: false,
        title: 'THAT TITLE THOUG',
        library: { type: 'image' },
        button: { text:  'Insert Image' }
      });

    }

  }

});

module.exports = ImageControl;
},{}],44:[function(require,module,exports){
module.exports = {

	// General Purpose
	'title'                   : require('./title'),
	'toggle'                  : require('./toggle'),
	'text'                    : require('./text'),
	'textarea'                : require('./textarea'),
	'editor'                  : require('./editor'),
	'code-editor'             : require('./code-editor'),
	'image'                   : require('./image'),
	'select'                  : require('./select'),
	'wpselect'                : require('./wpselect'),
	'sortable'                : require('./sortable'),
	'number'                  : require('./number'),
	'color'                   : require('./color'),
	'choose'                  : require('./choose'),
	'multi-choose'            : require('./multi-choose'),
	'icon-choose'             : require('./icon-choose'),
	'dimensions'              : require('./dimensions'),

	// Special
	'info-box'                : require('./info-box'),
	'custom-markup'           : require('./custom-markup'),
	'breadcrumbs'             : require('./breadcrumbs'),

	// Action Buttons
	'element-actions'         : require('./element-actions'),
	'column-actions'          : require('./column-actions'),
	'row-actions'             : require('./row-actions'),
	'section-actions'         : require('./section-actions'),
	'settings-actions'        : require('./settings-actions'),
	'layout-actions'          : require('./layout/layout-actions'),
	'template-actions'        : require('./layout/template-actions'),
	'template-select'         : require('./layout/template-select'),
	'template-remove'         : require('./layout/template-remove'),


	// Layout
	'sortable-sections'       : require('./layout/sortable-sections'),
	'sortable-rows'           : require('./layout/sortable-rows'),
	'column-layout'           : require('./layout/column-layout'),
	'column-order'            : require('./layout/column-order'),

	// Layout - Templates
	'template-save-dialog'    : require('./layout/template-save-dialog'),
	'template-upload-dialog'  : require('./layout/template-upload-dialog')
}
},{"./breadcrumbs":32,"./choose":33,"./code-editor":34,"./color":35,"./column-actions":36,"./custom-markup":38,"./dimensions":39,"./editor":40,"./element-actions":41,"./icon-choose":42,"./image":43,"./info-box":45,"./layout/column-layout":46,"./layout/column-order":48,"./layout/layout-actions":49,"./layout/sortable-rows":50,"./layout/sortable-sections":51,"./layout/template-actions":52,"./layout/template-remove":53,"./layout/template-save-dialog":54,"./layout/template-select":55,"./layout/template-upload-dialog":56,"./multi-choose":57,"./number":58,"./row-actions":59,"./section-actions":60,"./select":61,"./settings-actions":62,"./sortable":65,"./text":66,"./textarea":67,"./title":68,"./toggle":69,"./wpselect":70}],45:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	template: 'controls/info-box',
	controlName: 'info-box',
	onCustomVisibility: function() {
		// TODO: Info boxes should have a control option to force visibility instead
		// of hiding with help text.
		this.$el.toggleClass( 'hide', !cs.options.request( 'help:text' ) );
	}
});
},{}],46:[function(require,module,exports){
var RowValidator = require('../../../utility/row-validator');
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'column-layout',
	bindings: {
    '#column-layout': {
      observe: '_column_layout',
      events: ['blur'],
      onSet: 'formatColumnLayout',
      updateModel: 'confirmFormat',
      initialize: function($el, model, options) {

        this.$( '#column-layout' ).keyup(function (e) {
          if (e.keyCode === 13) {
            Backbone.$(this).blur();
          }
        });

        /**
         * Handler to set the active state based on the model value
         */
        setActive = _.bind( function( model, value ) {

          // Update active columns
          if ( value != 'custom' ) {
            var widths = value.split(" + ");

            model.elements.each(function(column){


              if ( _.isEmpty( widths ) ) {
                column.set( '_active', false );

                return;
              }

              column.set( '_active', true );
              var width = widths.shift()
              column.set( 'size', width );

            });

            model.elements.sort();
          }

          // Update control state
          this.$( '#column-layout' ).hide();
          this.$( 'li' ).removeClass( 'active' );
          $active = this.$( 'li[data-layout="' + value + '"]' );

          if ( $active.length ) {
            $active.addClass( 'active' );
            return;
          }

          this.$( 'li.custom' ).addClass( 'active' );
          this.$( '#column-layout' ).show();

        }, this );

        this.$('ul li').click( _.bind(function( e ) {

          $target = this.$(e.currentTarget);
          if ( $target.hasClass( 'custom' ) ) {
            setActive( model, 'custom' );
            return;
          }

          var data = $target.attr('data-layout');

          if ( RowValidator.layoutIsValid( data ) ) {
            model.set( options.observe, data );
            this.$('#column-layout').val( data );
          }
        }, this ) );

        /**
         * Set the initial active state, then listen to model changes to change the state later
         */
        setActive( model, model.get( options.observe ) );
        this.listenTo( model, 'change:' + options.observe, setActive );

        this.listenTo( model, 'position:updated', this.render );


        this.listenTo( model.elements, 'sort', function() {

          var columnWidths = [];

          model.elements.each( function( column ) {
            if ( column.get( '_active' ) ) columnWidths.push( column.get( 'size' ) );
          } );

          model.set( '_column_layout', columnWidths.join(' + ').trim() );

        } );

      }
    }
  },

  formatColumnLayout: function(value, options) {
    return RowValidator.reduceFractions( (_.map(value.split("+"),function(part){ return part.trim(); })).join(' + ') );
  },

  confirmFormat: function(value, event, options) {
    return RowValidator.layoutIsValid( this.formatColumnLayout( value ) );
  },

  textReplacements: {
		'%%title%%': function() {
    	return cs.l18n('row-numeric').replace('%s', this.proxy.getIndex() + 1 );
  	}
	}

});
},{"../../../utility/row-validator":28}],47:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
	template: 'controls/column-order-item',

	ui: {
  	'handle': 'span.handle'
  },

  events: {
    'dragstart.h5s': 'updateDragging',
    'dragend.h5s': 'updatePosition',
    'mouseover': 'mouseOver',
    'mouseout': 'mouseOut'
  },

  triggers: {
    'click @ui.handle': 'click:action',
  },

  modelEvents: {
    "change:title": "render"
  },

  className: function() {
    return 'cs-' + this.model.get('size').replace('/','-');
  },

  updateDragging: function( e ) {
    if ( e.originalEvent )
      this.triggerMethod( 'update:dragging' );
  },

  updatePosition: function( e ) {
    if ( e.originalEvent ) {
      this.triggerMethod( 'update:position' );
      this.triggerMethod( 'drag:end' );
    }
  },

  mouseOver: function( e ) {
    this.model.trigger('observe:start');
  },

  mouseOut: function( e ) {
    this.model.trigger('observe:end');
  }

})
},{}],48:[function(require,module,exports){
var Sortable = require('../sortable');
module.exports = Sortable.extend({

  controlName: 'column-order',
  emptyView: CS.Mn.ItemView.extend({
    tagName: 'li',
    className: 'column empty',
    template: false,
  }),

  sortableConfig: {
    items: ':not(.empty)',
  },

  getChildView: function() {
    return require( './column-order-item' );
  },

	filterBy: '_active',
  canAdd: false,

	textReplacements: {
		'%%title%%': function() {
    	return cs.l18n('row-numeric').replace('%s', this.proxy.getIndex() + 1 );
  	}
	},

  onChildviewUpdateDragging: function( child ) {

    this.$('ul').removeClass( this.placeholderModClass );
    this.placeholderModClass = 'cs-' + child.model.get( 'size' ).replace( '/', '-' );
    this.$('ul').addClass( this.placeholderModClass );

  },

  onChildviewDragEnd: function( child ) {
    this.$('ul').removeClass( this.placeholderModClass );
  },

  onChildviewClickAction: function( child ) {
  	cs.events.trigger( 'inspect:element', child.model );
		cs.navigate.trigger( 'inspector:home' );
  },


});
},{"../sortable":65,"./column-order-item":47}],49:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-actions cs-control-divider',
  template: 'layout/actions',
  controlName: 'actions',

  ui: {
    'new': '.action.new',
    'templates' : '.action.templates',
  },

  events: {
    'click @ui.new': 'addItem',
    'click @ui.templates': 'openTemplates'
  },

  initialize: function( options ) {
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
  },

  addItem: function() {
  	cs.events.trigger( 'add:section' );
  },

  openTemplates: function() {
    cs.navigate.trigger( 'layout:templates' );
  }

});
},{}],50:[function(require,module,exports){
var Sortable = require('../sortable');
module.exports = Sortable.extend({

	emptyView: false,
	wideControls: true,

  confirmMessage: cs.l18n('layout-row-delete-confirm'),
  actions: [
    { icon: 'copy', tooltip: cs.l18n('tooltip-copy') },
    { icon: 'trash-o', tooltip: cs.l18n('tooltip-delete') },
    { icon: 'search', tooltip: cs.l18n('tooltip-inspect') },
  ],

  customChildTitle: function( child ) {
    return cs.l18n('row-numeric').replace( '%s', this.children.length );
  },

  onChildviewClickActionAlt: function( child ) {
  	cs.events.trigger( 'inspect:element', child.model );
    cs.navigate.trigger( 'inspector:home' );
  },

  onChildviewClickHandle: function( item ) {
  	cs.events.trigger( 'inspect:layout:row', item.model );
  },

  onChildviewRender: function( child ) {

    var model = cs.navigate.request( 'layout:active:row' );

    if ( model && child.model && model.cid == child.model.cid ) {
      child.$el.addClass('active');
    }

  },

  onRemoveItem: function( model ) {
  	var active = cs.navigate.request( 'layout:active:row' );

    if ( active && model && active.cid == model.cid ) {
    	_.defer( _.bind( function(){
    		this.inspectFirst();
    	}, this ) );
    }

  },

  inspectFirst: function() {
  	cs.events.trigger( 'inspect:layout:row', this.collection.first() );
  },

  onResetLastItem: function() {
  	this.inspectFirst();
  }

});
},{"../sortable":65}],51:[function(require,module,exports){
var Sortable = require('../sortable');
module.exports = Sortable.extend({

	emptyView: false,

  canAdd: false,
  confirmMessage: cs.l18n('layout-row-delete-confirm'),

  onChildviewClickHandle: function( item ) {
  	cs.events.trigger( 'inspect:layout:section', item.model );
  	cs.navigate.trigger( 'layout:rows' );
  	cs.navigate.trigger( 'auto:focus', 'title' );
  },

  onAfterBaseRender: function() {
    this.$el.toggleClass('hide', ( this.collection.length == 0 ));
  }

});
},{"../sortable":65}],52:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-template-actions cs-control-divider',
  template: 'layout/sub-templates/template-actions',
  controlName: 'actions',

  ui: {
    'save':    '.action.save',
    'upload' : '.action.upload',
  },

  events: {
    'click @ui.save':   'save',
    'click @ui.upload': 'upload'
  },

  initialize: function( options ) {
    cs.channel.trigger( 'block:gen' );
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
  },

  save:function() {
    this.proxy.set('action', 'save');
  },

  upload: function() {
    this.proxy.set('action', 'upload');
  }

});
},{}],53:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
  //template: 'layout/sub-templates/template-select',
  controlName: 'template-select',
  bindingSelector: 'select',

  ui: {
    'remove' : 'button.remove',
  },

  triggers: {
    'click @ui.block': 'insert:block',
  },

  behaviors: {
    Confirm: {
      ui: 'remove',
      message: cs.l18n('templates-remove-message'),
    }
  },

  onCustomVisibility: function(){
    var opts = this.model.get('options');
    this.$el.toggleClass( 'hide', ( opts.choices && opts.choices.length < 1 ) );
  },

  onConfirmAccept: function() {
    cs.templates.trigger( 'delete', this.$('select').val() )
  },

});
},{}],54:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({

  template: 'layout/sub-templates/save-dialog',
  controlName: 'template-save-dialog',

  bindingSelector: 'input[type=text]',

  ui: {
    'download' : '.action.download',
    'save'     : '.action.save',
    'close'    : 'button.close'
  },

  events: {
    'click @ui.download' : 'download',
    'click @ui.save'     : 'save',
    'click @ui.close'    : 'close'
  },

  behaviors: {
    Confirm: {
      ui: 'save',
      message: cs.l18n( 'templates-save-message' ),
      yep:     cs.l18n( 'templates-save-yep' ),
      nope:    cs.l18n( 'templates-save-nope' )
    }
  },

  onConfirmAccept: function() {
    cs.templates.trigger( 'save', 'page', this.proxy.get( 'title' ) );
    this.close();
  },

  onConfirmDecline: function() {
    cs.templates.trigger( 'save', 'block', this.proxy.get( 'title' ) );
    this.close();
  },

  download: function() {
    cs.templates.trigger( 'download', this.proxy.get( 'title' ) );
    this.proxy.set( 'action', 'none' );
  },

  close: function() {
    this.proxy.set( 'action', 'none' );
  },

  onCustomVisibility: function( visible ) {
    if ( visible )
      this.$('input[type="text"]').focus();
  }

});
},{}],55:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	//template: 'layout/sub-templates/template-select',
  controlName: 'template-select',
	bindingSelector: 'select',

	ui: {
    'page' : 'button.page',
    'block': 'button.block',
  },

  triggers: {
    'click @ui.block': 'insert:block',
  },

  behaviors: {
    Confirm: {
    	ui: 'page',
      message: cs.l18n('templates-overwrite-message'),
      yep:     cs.l18n('templates-overwrite-yep'),
      nope:    cs.l18n('templates-overwrite-nope')
    }
  },

	onCustomVisibility: function(){
		var opts = this.model.get('options');
		this.$el.toggleClass( 'hide', ( opts.choices && opts.choices.length < 1 ) );
	},

	onConfirmAccept: function() {
		//cs.message.trigger( 'notice', 'Loading selected page template.' );

		_.defer( _.bind( function() {
			cs.templates.trigger( 'import', this.$('select').val(), 'page' )
		}, this ) );
	},

	onInsertBlock: function() {
		//cs.message.trigger( 'notice', 'Loading selected block.' );
		_.defer( _.bind( function() {
			cs.templates.trigger( 'import', this.$('select').val(), 'block' )
		}, this ) );
	},



});
},{}],56:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({

  template: 'layout/sub-templates/upload-dialog',
  controlName: 'template-upload-dialog',

  ui: {
    'upload' : 'button.process',
    'close': 'button.close',
  },

  events: {
    'click @ui.close':  'close'
  },

  behaviors: {
    Confirm: {
      ui: 'upload',
      message: cs.l18n('templates-upload-message'),
      yep:     cs.l18n('templates-upload-yep'),
      nope:    cs.l18n('templates-upload-nope')
    }
  },

  initialize: function() {
    this.listenTo(cs.data, 'template:upload:complete', this.uploadComplete );
  },

  onConfirmAccept: function() {
    _.defer( _.bind( this.upload, this), 'page' );
  },

  onConfirmDecline: function() {
    _.defer( _.bind( this.upload, this), 'block' );
  },

  upload: function( format ) {

    cs.message.trigger( 'notice', 'Cornerstone is uploading your template...' );

    var file = this.$('#template-upload')[0].files[0];

    if (!file || file.name.match(/.+\.csl/)) {

      var reader = new FileReader();

      reader.onload = function(e) {
        cs.data.trigger('template:upload:complete', JSON.parse( reader.result ), format );
      }

      try {
        reader.readAsText(file);
      } catch (e) {
        cs.message.trigger( 'error', cs.l18n('templates-error-read') );
      }

    } else {
      cs.message.trigger( 'error', cs.l18n('templates-error-upload') );
      console.warn('Invalid template file');
    }

  },

  uploadComplete: function( template, format ) {
    cs.templates.trigger( 'import', template.elements, format );
    this.resetForm();
    this.close();
  },

  resetForm: function() {
    var $input = this.$('#template-upload');
    $input.replaceWith($input.clone());
  },

  close: function() {
    this.proxy.set( 'action', 'none' );
  }

});
},{}],57:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'multi-choose',
  controlTemplate: 'controls/choose',
	binding: {
	  initialize: function($el, model, options) {

    	/**
    	 * Update Model when a new option is clicked
    	 */
      this.$('li').on('click', _.bind( function (e) {
      	var selected = _.clone( model.get( options.observe ) );
        var choice = this.$(e.currentTarget).data('choice')

        // Make sure we're working with an array
        if ( !_.isArray(selected) )
          selected = [];

        // Add or remove
        if ( _.contains(selected, choice ) ) {
          selected = _.without(selected, choice)
        } else {
          selected.push(choice);
        }

        model.set( options.observe, selected );
        model.trigger('change:' + options.observe, model, selected, {} );
      }, this ) );

      /**
       * Handler to set the active state based on the model value
       */
    	var setActive = _.bind( function( model, value ) {
        this.$('li').removeClass('active').siblings( _.reduce( value || [], function( memo, item) {
          return memo + ',[data-choice=' + item + ']';
        },'.always-on') ).addClass('active');
    	}, this );

    	/**
    	 * Set the initial active state, then listen to model changes to change the state later
    	 */
    	setActive( model, model.get( options.observe ) );
    	this.listenTo(model, 'change:' + options.observe, setActive );


    }
	},
  onBeforeRender: function() {

    /**
     * Make sure we have a valid number of columns.
     */
    var options = this.model.get('options');
    if ( !_.contains(['2', '3', '4', '5'], options.columns ) ) {
      options.columns = '2';
      this.model.set('options',options);
    }
  }
});
},{}],58:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'number',
	bindingSelector: 'input[type=number]'
});
},{}],59:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-actions cs-control-divider',
  template: 'inspector/row-actions',
  controlName: 'actions',
	ui: {
    'confirm': '.action.delete',
    'layout' : '.action.manage-layout',
  },

  events: {
    'click @ui.layout': 'layout'
  },

  behaviors: {
    Confirm: {
      message: cs.l18n('layout-row-delete-confirm'),
    }
  },

  initialize: function( options ) {
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
  },

  layout: function() {
  	cs.events.trigger( 'inspect:layout:row', this.proxy.getSource() );
  	cs.navigate.trigger( 'layout:rows' );
  },

  onConfirmAccept: function() {
    cs.elements.trigger( 'delete', { model: this.proxy.getSource(), success: function() {
      cs.confirm.trigger( 'complete' );
    } } );
  },

});
},{}],60:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-actions cs-control-divider',
  template: 'inspector/row-actions',
  controlName: 'actions',
	ui: {
    'confirm': '.action.delete',
    'layout' : '.action.manage-layout',
  },

  events: {
    'click @ui.layout': 'layout'
  },

  behaviors: {
    Confirm: {
      message: cs.l18n('layout-section-delete-confirm'),
    }
  },

  initialize: function( options ) {
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
  },

  layout: function() {
  	cs.events.trigger( 'inspect:layout:section', this.proxy.getSource() );
  	cs.navigate.trigger( 'layout:rows' );
  },

  onConfirmAccept: function() {
    cs.elements.trigger( 'delete', { model: this.proxy.getSource(), success: function() {
      cs.confirm.trigger( 'complete' );
    } } );
  },

});
},{}],61:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'select',
	bindingSelector: 'select',
	controlEvents: {
		'change select': 'notLiveTrigger'
	},
	onAfterBaseRender: function() {
		var localOpts = this.model.get('options');
		_.each( localOpts.choices, function( item ) {

			if (item.disabled)
				this.$('option[value="' + item.value + '"]').prop( 'disabled', true );

		}, this );
	}
});
},{}],62:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	tagName: 'li',
  className: 'cs-control cs-control-actions cs-control-divider',
  template: 'settings/actions',
  controlName: 'actions',
	ui: {
    'triggerCSS': '.action.css',
    'triggerJS' : '.action.js',
  },

  events: {
    'click @ui.triggerJS': 'triggerJS',
    'click @ui.triggerCSS': 'triggerCSS'
  },

  initialize: function( options ) {
    this.proxy = this.model.proxy || null;
  	this.selected = options.selected || undefined;
    this.jsMessage = _.once( function(){
      //cs.message.trigger( 'notice', cs.l18n( 'settings-js-message' ) );
    } )
  },

  // duplicate: function() {
  //   this.proxy.collection.duplicate( this.proxy );
  // },

  triggerCSS: function() {
    cs.navigate.trigger( 'open:code:editor', 'custom_css' );
  },

  triggerJS: function() {
    if ( cs.config('unfilteredHTML') == 'false' ) {
      cs.message.trigger( 'notice', cs.l18n( 'settings-js-denied' ), 8000 );
      return;
    }
    cs.navigate.trigger( 'open:code:editor', 'custom_js' );
    this.jsMessage();
  },

  onConfirmAccept: function() {
    cs.elements.trigger( 'delete', { model: this.proxy, success: function() {
      cs.confirm.trigger( 'complete' );
    	cs.channel.trigger( 'inspect:nothing' );
    } } );
  },

});
},{}],63:[function(require,module,exports){
var SortableItem = require('./sortable-item');

module.exports = SortableItem.extend({

  className: 'sortable-item wide-controls',
  template: 'controls/sortable-item-wide',

  ui: {
    'action' : 'button.action1',
    'confirm': 'button.action2',
    'actionAlt' : 'button.action3',
    'handle': 'span.handle'
  },

  triggers: {
    'click @ui.action': 'clickAction',
    'click @ui.actionAlt': 'clickActionAlt',
    'click @ui.handle': 'click:handle',
  },

});
},{"./sortable-item":64}],64:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({

  tagName: 'li',
  className: 'sortable-item',
  template: 'controls/sortable-item',

  ui: {
    'action' : 'button.action1',
    'confirm': 'button.action2',
    'handle': 'span.handle'
  },

  events: {
    'dragend.h5s': 'updatePosition',
    'mouseover': 'mouseOver',
    'mouseout': 'mouseOut',
  },

  triggers: {
    'click @ui.action': 'clickAction',
    'click @ui.handle': 'click:handle',
  },

  modelEvents: {
    "change:title": "render"
  },

  behaviors: {
    Confirm: {
      message: function(){ return ( this.atFloor() ) ? cs.l18n('sortable-at-floor') : this.confirmMessage; },
      yep:     function(){ return cs.l18n('confirm-yep'); },
      nope:    function(){ return ( this.atFloor() ) ? cs.l18n('confirm-back') : cs.l18n('confirm-nope'); }
    },
    ConfirmWarn: {
      message: function(){ return cs.l18n('sortable-at-cap'); },
      yep:     function(){ return ''; },
      nope:    function(){ return cs.l18n('confirm-back'); }
    }
  },

  updatePosition: function( e ) {
    if (e.originalEvent)
      this.triggerMethod( 'update:position' );
  },

  serializeData: function( ) {
    var data = _.extend( CS.Mn.ItemView.prototype.serializeData.apply(this,arguments), {
      actions: this.actions
    });

    if ( _.isFunction( this.customTitle ) ) {
      data.title = this.customTitle( this );
    }

    return data;
  },

  mouseOver: function( e ) {
    this.model.trigger('observe:start');
  },

  mouseOut: function( e ) {
    this.model.trigger('observe:end');
  },

});
},{}],65:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'sortable',
	childViewContainer: 'ul',

  actions: [
    { icon: 'copy', tooltip: cs.l18n('tooltip-copy') },
    { icon: 'trash-o', tooltip: cs.l18n('tooltip-delete') },
  ],

  wideControls: false,

  getChildView: function(){
    return ( this.wideControls ) ? require('./sortable-item-wide') : require('./sortable-item');
  },

  confirmMessage: cs.l18n('sortable-remove'),
  sortableConfig: { items: ':not(.empty)' },

  buildChildView: function(child, ChildViewClass, childViewOptions) {

    var view = new ChildViewClass(_.extend({model: child}, childViewOptions));

    view.atFloor = _.bind(function(){
      return ( this.floor >= this.collection.length );
    }, this);

    view.atCap = _.bind( function(){
      return ( !_.isNull( this.capacity ) && this.capacity <= this.collection.length );
    }, this);

    if ( _.isFunction( this.customChildTitle) ) {
      view.customTitle = _.bind( this.customChildTitle, this );
    }

    view.actions = this.actions;
    view.confirmMessage = this.confirmMessage;
    return view;
  },

	emptyView: CS.Mn.ItemView.extend({
  	tagName: 'li',
  	className: 'sortable-item empty',
  	template: 'controls/sortable-empty',
    events: {
      'click span.handle': 'click'
    },
    click: function( e ) {
      this.triggerMethod( 'empty:click:add', e );
    }
	}),
	sort: false,

  filterBy: false,
  canAdd: true,
  canCompact: false,

	ui: {
    'add': 'button.cs-add-sortable-item',
  },

  events: {
    'click @ui.add': 'addItem',
  },

  controlData: function() {

    var data =  { canAdd: this.canAdd };

    if ( !_.isNull( this.capacity ) && this.collection.length >= this.capacity )
      data.canAdd = false;

    data.empty = ( this.collection.length == 0 )

    return data;
  },

  onChildviewEmptyClickAdd: function( e ) {
    this.addItem();
  },

  onChildviewUpdatePosition: function( child ) {
    this.triggerMethod( 'item:before:position:updated', child );
    this.collection.trigger( 'update:position', child.model, child.$el.index() );
    this.triggerMethod( 'item:position:updated', child );
  },

  filter: function (child, index, collection) {
    if (!this.filterBy) return true;

    return ( child.get( this.filterBy ) );
  },


  onProxyReady: function() {

    this.collection = this.proxy.elements;

    this.listenTo( this.collection, 'reset', this.render );
    this.listenTo( this.collection, 'sort', this.render );
    this.listenTo( this.collection, 'remove', this.render );
    this.listenTo( this.collection, 'add', this.render );

    var options = this.model.get('options')

    if (options.type) {
      this.collection.childType = options.type;
    }

    this.floor = ( options.floor || 0 );
    this.capacity = (options.capacity) ? options.capacity : null;

  },

  // Default first action is copy
  onChildviewClickAction: function( item ) {
    if ( item.atCap() ) {
      item.trigger('confirm:warn:open');
    } else {
    	cs.elements.trigger( 'duplicate', item.model );
    }
  },

  // Default handle is to sub-inspect
  onChildviewClickHandle: function( item ) {
  	cs.events.trigger( 'inspect:child:element', item.model );
    var pane = ( cs.navigate.request('active:pane') == 'settings' ) ? 'settings' : 'inspector';
    cs.navigate.trigger( pane + ':item' );
  },

  // Default confirmation is to delete
  onChildviewConfirmAccept: function( item ) {
  	var atFloor = item.atFloor()

  	this.triggerMethod( 'remove:item', item.model );
  	cs.elements.trigger( 'delete', { model: item.model } );

  	if ( atFloor ) {
  		this.addItem();
  		this.triggerMethod( 'reset:last:item' );
  	}
  },

	onRender: function() {
    this.$('ul').sortable( this.sortableConfig );
    this.triggerMethod('after:render');
  },

  addItem:function() {
  	var options = this.model.get('options');
    var title = options.newTitle || cs.l18n('sortable-default');
    cs.elements.trigger( 'add:item', options.element, this.proxy, title, options.title_field );
  },

});
},{"./sortable-item":64,"./sortable-item-wide":63}],66:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'text',
	bindingSelector: 'input[type=text]',
	controlEvents: {
		'blur input': 'notLiveTrigger'
	},
	onRender: function() {
		var options = this.model.get('options');
		if ( options.placeholder )
			this.$('input[type=text]').attr('placeholder', options.placeholder );
	}
});
},{}],67:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'textarea',
	bindingSelector: 'textarea',
	htmlhint: { 'tagname-lowercase': false, 'attr-lowercase': false, 'attr-value-double-quotes': false, 'doctype-first': false, 'tag-pair': true, 'spec-char-escape': true, 'id-unique': false, 'src-not-empty': false, 'attr-no-duplication': false, 'title-require': false },
  onProxyReady: function() {
    var opts = this.model.get('options');
    if (!opts.expandable && opts.expandable !== false) {
      opts.expandable = opts.controlTitle || true;
      this.model.set('options', opts);
    }

  },
  onRender: function() {
    var options = this.model.get('options');
    if ( options.placeholder )
      this.$('textarea').attr('placeholder', options.placeholder );

    if ( options.htmlhint ) {
    	var $textarea = this.$('textarea');
    	$textarea.on( 'blur', _.bind( function(){

    		var errors = _.map( Cornerstone.Vendor.HTMLHint.verify( $textarea.val(), this.htmlhint ), function( item ) {
    			return item.rule.id;
    		});
    		if ( !_.isEmpty( errors ) ) {
    			cs.message.trigger( 'error', CS.Mn.Renderer.render( 'utility/htmlhint', { errors: errors } ), 7000 );
    		}
    	}, this ) );
    }
  }
});
},{}],68:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'title',
	divider: true,
	canCompact: false,
	bindingSelector: 'input[type=text]',

	ui: {
    'inspect': 'button.cs-title-button',
  },

  triggers: {
    'click @ui.inspect': 'inspect',
  },

	onInspect: function() {
		cs.events.trigger( 'inspect:element', this.proxy.getSource() );
		cs.navigate.trigger( 'inspector:home' );
  }

});
},{}],69:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'toggle',
  binding: {
    initialize: function($el, model, options) {
      /**
       * Update Model when a new option is clicked
       */
      this.$('ul.cs-toggle').on('click', _.bind( function (e) {
        model.set( options.observe, this.$(e.currentTarget).hasClass('off') );
        this.notLiveTrigger();
      }, this ) );

      /**
       * Handler to set the active state based on the model value
       */
      var setActive = _.bind( function( model, state ) {
        var state = state || this.model.get( 'default' ) || false;
        this.$('.cs-toggle').toggleClass( 'on', state ).toggleClass( 'off', !state )
      }, this );

      /**
       * Set the initial active state, then listen to model changes to change the state later
       */
      setActive( model, model.get( options.observe ) );
      this.listenTo(model, 'change:' + options.observe, setActive );

    }
  }
})
},{}],70:[function(require,module,exports){
module.exports =  Cornerstone.ControlViews.Base.extend({
	controlName: 'wpselect',
	bindingSelector: 'select',
	controlEvents: {
		'change select': 'notLiveTrigger'
	},
	onBeforeBaseRender: function() {
		var options = this.model.get('options');
		this.$select = Backbone.$( options.markup || '<select class="empty"></select>' );
		this.wpDefault = this.$select.val();
		this.$( '.cs-wp-select' ).append( this.$select );
	}
});
},{}],71:[function(require,module,exports){
var BaseShared = {
	template: 'loading',
	className: 'cs-preview-element-wrapper',
	attributes: {
		'draggable': 'true'
	},
	remoteRender: true,
	baseEvents: {
		'dragstart.h5s': 'dragStart',
		'dragend.h5s': 'dragEnd',
		'mouseover': 'mouseOver',
		'mouseout': 'mouseOut',
  	'click a': 'preventLinkout'
	},
	elementEvents: {},

	events: function() {

		this.baseEvents['click'] = 'click';

		if ( _.isUndefined(this.autoFocus) || _.isEmpty(this.autoFocus) ) {
			return this.baseEvents;
		}

		var view = this;

		_.each( this.autoFocus, function( field, selector ) {
			view.baseEvents[ 'click ' + selector ] = function( e ) {
				e.stopPropagation();
				view.model.trigger( 'inspect', { autoFocus: field} );
			};
		});

		return _.extend( this.baseEvents, this.elementEvents );
	},

  construct: function( options ) {

    if ( this.remoteRender ) {
      this.listenTo( this.model, 'remote:render', this.render )
      this.model.trigger( 'view:init' );
    }

    this.listenTo( this.model, 'observe:in', this.observeIn );
    this.listenTo( this.model, 'observe:out', this.observeOut );

    this.on( 'render', _.debounce( _.bind( this.baseRender, this ), 10 ) );

  },

  attachElContent: function(html) {

    if ( this.remoteRender && this.model.markupCache) {
      this.$el.html( this.model.markupCache );
    } else {
      this.$el.html(html);
    }

    return this;

  },

	baseRender: function() {

  	this.triggerMethod('before:shortcode:init');

    window.xData.base.processElements( null, this.$el );

    cs.preview.trigger( 'responsive:text', this );

    this.triggerMethod('after:element:render');

    if ( this.remoteRender && this.model.markupCache ) {
      _.defer( _.bind( this.emptyDetection, this ) );
    }

  },

  click: function( e ) {
		this.triggerMethod('click:before:inspect', e );
		e.stopPropagation();
		this.model.trigger('inspect');
	},

  preventLinkout: function( e ) {
  	e.preventDefault();
  },

  dragStart: function ( e ) {

  	this.setData(e);
  	_.defer( _.bind( this.triggerMethod, this), 'drag:start', e )
  },

  dragEnd: function( e ) {

  	cs.preview.trigger( 'dragging', false );
    if ( e.originalEvent )
      this.triggerMethod( 'drag:end', e );
  },

  dragDrop: function( e ) {
  	cs.preview.trigger( 'dragging', false );
    if ( e.originalEvent )
    	this.triggerMethod( 'drag:drop', e );
  },

  mouseOver: function( e ) {
  	e.stopPropagation();
    this.model.trigger('observe:in');
  },

  mouseOut: function( e ) {
  	this.model.trigger('observe:out');
  },

  observeIn: function() {
    cs.observer.trigger( 'in', this );
  },

  observeOut: function() {
    cs.observer.trigger( 'out', this );
  },

	setData: function ( e ) {

		var dataTransfer = e.originalEvent.dataTransfer;
    dataTransfer.effectAllowed = 'copy';
    var data = JSON.stringify({
			action: 'move',
    	id: this.model.cid,
    });

    cs.preview.replyOnce( 'cache:'+ this.model.cid, this.model );
    dataTransfer.setData( 'cornerstone/element', data );
	},

  emptyDetection: function() {

    if ( this.$el.outerHeight() < 1 ) {
      this.$el.html( cs.template('empty-element')({ name: this.model.elType.get('name') }) );
    }

  }

}


module.exports.BaseCore = CS.Mn.CollectionView.extend( _.extend( BaseShared, {

	constructor: function( options ) {
		CS.Mn.CollectionView.apply(this, arguments);
		this.construct();
	},

} ) );


module.exports.Base = CS.Mn.CompositeView.extend( _.extend( BaseShared, {

	constructor: function( options ) {
		CS.Mn.CompositeView.apply(this, arguments);
		this.construct();
	},

} ) );
},{}],72:[function(require,module,exports){
// Confirm
module.exports = CS.Mn.ItemView.extend({
  className: 'cs-confirm',
  template: 'extra/confirm',

  events: {
    'click .yep'  : 'acceptDebounce',
    'click .nope' : 'declineDebounce',
  },

  initialize: function( options ) {

    var options = options || {};
    this.data = options.data || {};

    // Prevent multiple clicks
    this.acceptDebounce = _.debounce( _.bind( this.accept, this ), 500, true );
    this.declineDebounce = _.debounce( _.bind( this.decline, this ), 500, true );

    this.listenTo( cs.confirm, 'abort', this.declineDebounce );
  },

  onOpen: function( data ) {
    this.data = data;
    this.render();
    this.$el.addClass('active');
  },

  serializeData: function(){

    this.data = _.extend({
      message:'',
      subtext:'',
      classes: [],
      yep:'',
      nope:'',
      view: null
    }, this.data);

    var view = this.data.view;

    var data = _.omit( this.data, ['view'] );

    if ( _.isFunction( data.message ) ) data.message = data.message.call(view);
    if ( _.isFunction( data.subtext ) ) data.subtext = data.subtext.call(view);
    if ( _.isFunction( data.classes ) ) data.classes = data.classes.call(view);
    if ( _.isFunction( data.yep ) )         data.yep = data.yep.call(view);
    if ( _.isFunction( data.nope ) )       data.nope = data.nope.call(view);

    data.classes.unshift( 'cs-confirm-content' );
    data.contentClass = data.classes.join(' ');
    return data;
  },

  accept: function() {
    cs.confirm.trigger( 'accept', this.data.view.cid );
    this.$el.removeClass('active');
  },

  decline: function() {
  	var cid = null;
  	if ( this.data.view && this.data.view.cid )
  		cid = this.data.view.cid
    cs.confirm.trigger( 'decline', cid );
    this.$el.removeClass('active');
  },

});
},{}],73:[function(require,module,exports){
// Expand
module.exports = CS.Mn.ItemView.extend({
  tagName: 'button',
  className: 'expand cs-icon',
  template: false,
  attributes: { 'data-cs-icon': cs.fontIcon('play-circle') },
  events: { 'click': 'collapse' },

  initialize: function() {

    Backbone.$('body').toggleClass('cs-editor-active', true ).toggleClass('cs-editor-inactive', false );

    this.listenTo(cs.extra, 'flyout:collapse', function() {
      Backbone.$('body').toggleClass('cs-editor-active', false ).toggleClass('cs-editor-inactive', true );

      cs.extra.trigger( 'set:collapse', true );
    } );

    // Event propogation
    this.listenTo( cs.extra, 'set:collapse', function( state ){
      cs.extra.reply( 'get:collapse', state );
       cs.global.trigger( 'set:collapse', state );
    });

  },

  collapse: function( state ) {

  	cs.extra.trigger( 'set:collapse', false );
    Backbone.$('body').toggleClass('cs-editor-active', true ).toggleClass('cs-editor-inactive', false );
    cs.extra.trigger( 'flyout', 'collapse' );

  }
});
},{}],74:[function(require,module,exports){
// Expansion
var ControlListView = require('../controls/control-collection')

module.exports = CS.Mn.ItemView.extend({
  className: 'cs-expanded-content-outer',
  template: 'extra/expanded-control',

  events: {
    'click .cs-expanded-close': 'shutdown',
    'keyup': 'escape'
  },

  initialize: function( options ) {
    this.listenTo( cs.extra, 'set:collapse', this.collape );
    this.linkedView = null;
    this.listenTo( cs.events, 'expand:control', this.open );
  },

  onRender: function() {
  	this.controlView = new ControlListView( { collection: cs.component('inspector').getExpansionControls() } );
    this.controlView.render();
    this.$('.cs-expanded-content-inner').append(this.controlView.$el);
  },

  open: function() {

    this.$el.addClass('active');

    // Enlarge any textarea.
    _.defer( _.bind( function(){
    	this.$('textarea').height( this.$el.height() * .60 ).focus();
    }, this ) )

  },

  escape: function( e ) {
    if (e.keyCode === 27) {
      this.shutdown();
    }
  },

  collape: function( state ) {
    if (state) {
      this.shutdown();
    }
  },

  shutdown: function() {

  	cs.events.trigger( 'expand:close' );

    // Animate out
    this.$el.removeClass('active');

  }

});
},{"../controls/control-collection":37}],75:[function(require,module,exports){
// Home
module.exports = CS.Mn.ItemView.extend({
  className: 'cs-home',
  template: 'extra/home',

  initialize: function() {
    this.listenTo( cs.channel, 'save:complete', this.render );
    this.listenTo( cs.channel, 'update:saved:last', this.render );
  },

  serializeData: function() {
    var savedLast = cs.data.request( 'saved:last' );
    var minAgo = 2;
    var data = {
      savedLastMessage: ( _.isNull( savedLast ) ) ? cs.l18n('home-unsaved') : cs.l18n('home-saved-last').replace('%s', savedLast.fromNow() ),
      savedLastClass: ( _.isNull( savedLast ) || savedLast.isBefore(new Date((new Date()).getTime() - minAgo*60000)) ) ? 'warn' : 'happy',
      dashboardEditUrl: cs.config('dashboardEditUrl'),
      frontEndUrl: cs.config('frontEndUrl')
    }
    return data;
  }
});
},{}],76:[function(require,module,exports){
// Options

module.exports = CS.Mn.CompositeView.extend({
  className: 'cs-options',
  getChildView: function( item ) { return cs.controlLookup( item.get('type') ); },
  template: _.template('<div id="options-controls"><ul class="cs-controls"></ul></div>'),//'extra/options',
  childViewContainer: 'ul.cs-controls',

  initialize: function() {
  	this.collection = cs.component('options').inspect.controls;
  }

});
},{}],77:[function(require,module,exports){
// Respond
module.exports = CS.Mn.ItemView.extend({
  className: 'cs-respond',
  template: 'extra/respond',

  events: {
    'click button': 'handleClick'
  },

  initialize: function() {
    cs.extra.reply( 'width', '100%');
    this.listenTo(cs.extra, 'respond:width', this.setRespond );
  },

  handleClick: function( e ) {

    this.$('button').removeClass('active');
    this.$('.cs-respond-labels div').removeClass('active');

    this.$(e.currentTarget).addClass('active');

    var data = this.$(e.currentTarget).data('respond');
    cs.extra.reply('width', data );
    this.$('.cs-respond-labels div[data-respond="' + data + '"]').addClass('active');
    cs.extra.trigger( 'respond:width', data );

  },

  onRender: function() {

    var width = cs.extra.request( 'width' ) || '100%';

    if (width == 'none')
      width = '100%';

    this.$('button[data-respond="' + width + '"]').addClass('active');
    this.$('.cs-respond-labels [data-respond="' + width + '"]').addClass('active');

  },

  setRespond: function( width ) {
    Backbone.$('.cs-preview').css({ 'max-width' : width });
  }

});
},{}],78:[function(require,module,exports){
// SaveComplete
module.exports = CS.Mn.ItemView.extend({
  className: 'cs-saved',
  template: 'extra/save-complete',
  messages: cs.l18n('save-complete-messages'),

  serializeData: function() {
    return {
      message: this.messages[Math.floor(Math.random() * this.messages.length)]
    }
  },

  onRender: function() {
    this.$el.css({display : 'none', opacity : 1}).removeClass('saved-out');
  },

  onSaveComplete: function() {

    if ( cs.config('visualEnhancements') == 'false' ) {
      cs.message.trigger( 'success', cs.l18n( 'save-complete-simple' ), 1250 );
      return;
    }

    this.$el.css({display : 'table'}).addClass('saved-in');

    setTimeout( _.bind( function() {
      this.$el.animate({opacity : 0}, 650, 'linear', _.bind( function() {
        this.$el.css({display : 'none', opacity : 1}).removeClass('saved-out');
      }, this ) ).removeClass('saved-in').addClass('saved-out');
      setTimeout( _.bind( function() {
        this.render();
      }, this ), 1000);
    }, this ), 1000);

  },

});

},{}],79:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
  tagName: 'li',
  className: 'cs-control-empty',
  template: 'inspector/blank-state',
});
},{}],80:[function(require,module,exports){
// InspectorPane
var ControlListView = require('../controls/control-collection');
var ViewBasePane = require('../main/base-pane');
module.exports = ViewBasePane.extend({

	name: 'inspector',

  initialize: function() {
    this.listenTo(cs.navigate, 'refresh:inspector:heading', this.updateHeading );
  },

  onShowContent: function(){

  	this.Content.show( new ControlListView( {
  		collection: cs.component('inspector').getPrimaryControls(),
  		emptyView: require('./empty-controls')
  	}));

  },

  updateHeading: function() {
    this.$('h2').text( cs.navigate.request('inspector:heading') );
  },

  onOpenSubItem: function() {

  	this.Sub.show( new ControlListView( {
  		collection: cs.component('inspector').getSecondaryControls(),
  		emptyView: require('./empty-controls')
  	}));

  },

  updateSerializeData: function( data ) {
    var heading = cs.navigate.request('inspector:heading');
    if ( heading )
    	data.heading = heading;
    return data;
  }

});
},{"../controls/control-collection":37,"../main/base-pane":87,"./empty-controls":79}],81:[function(require,module,exports){
var ControlListView = require('../controls/control-collection')
var ViewBasePane = require('../main/base-pane');
module.exports = ViewBasePane.extend({

  name: 'layout',

  onShowContent: function(){
    this.Content.show( new ControlListView( { collection: cs.component('layout').inspect.primary.controls } ) );
  },

  onOpenSubRows: function() {
  	var ManageRowsView = require('./sub-row/layout-sub-rows');
    this.Sub.show( new ControlListView( { collection: cs.component('layout').inspect.secondary.controls } ));
  },

  onOpenSubTemplates: function() {
  	var TemplatesView = require('./sub-templates/layout-sub-templates');
    this.Sub.show( new TemplatesView() );
  },

});
},{"../controls/control-collection":37,"../main/base-pane":87,"./sub-row/layout-sub-rows":82,"./sub-templates/layout-sub-templates":83}],82:[function(require,module,exports){
// RowSubPane
var ViewControlCollection = require('../../controls/control-collection')

module.exports = CS.Mn.LayoutView.extend({

  template: 'layout/sub-row/layout-sub-row',
  className: 'cs-pane-content-inner row',
  regions: {
    Controls: '#layout-row-controls',
    //ColumnControls: '#layout-column-controls'
  },

  initialize: function() {


    // this.columnControls = new ControlCollection();
    // this.rowControls = new ControlCollection([], { proxy: this.model } );

    // this.rowControls.add({
    //   name: 'info',
    //   controlType: 'info-box',
    //   controlTitle: cs.l18n('columns-info-title'),
    //   controlTooltip: cs.l18n('columns-info-description')
    // });

    // this.rowControls.add({
    //   name: 'title',
    //   controlType: 'title',
    //   showInspectButton: true,
    //   divider: true
    // });

    // this.rowControls.add({
    //   name: 'elements',
    //   controlType: 'sortable-rows',
    //   options: {
    //     newTitle: 'Row %s',
    //     floor: 1
    //   },
    //   divider: true
    // });

    // this.listenTo( cs.navigate, 'layout:column', this.setActiveRow );

  },

  setActiveRow: function( view ) {

    // if ( view === false ) {

    //   view = {
    //     model: cs.navigate.request( 'layout:active:row' )
    //   };
    // }


    // if ( !view || !view.model ) {
    //   view = {
    //     model: this.model.get('elements').first()
    //   }
    // }

    // if (!view.model.collection || view.model.collection.length == 0) {
    //   this.ColumnControls.empty();
    //   return;
    // }

    // this.columnControls.setProxy( view.model );
    // _.invoke( _.clone( this.columnControls.models ), 'destroy' );


    // var title = cs.l18n('row-numeric').replace('%s', view.model.collection.indexOf( view.model ) + 1 );
    // this.columnControls.add({
    //   name: 'columnLayout',
    //   controlType: 'column-layout',
    //   controlTitle: cs.l18n('columns-layout-label').replace('%s', title ),
    //   controlTooltip: cs.l18n('columns-layout-tooltip'),
    //   defaultValue: '',
    // });

    // this.columnControls.add({
    //   name: 'columnOrder',
    //   controlType: 'column-order',
    //   controlTitle: cs.l18n('columns-order-label').replace('%s', title ),
    //   controlTooltip: cs.l18n('columns-order-tooltip'),
    //   defaultValue: '',
    //   divider: true
    // });

    // if ( view.$el ) {
    //   this.$('ul li.sortable-item').removeClass('active');
    //   view.$el.addClass('active');
    // }

    // cs.navigate.reply( 'layout:active:row', view.model );
    // this.ColumnControls.show( new ViewControlCollection( { collection: this.columnControls } ) );

  },

  onBeforeShow: function() {
    //this.setActiveRow( cs.navigate.request( 'layout:active:row' ) );
    //this.Controls.show( new ViewControlCollection( { collection: this.rowControls, autoFocus: 'title' } ) );
  },

});
},{"../../controls/control-collection":37}],83:[function(require,module,exports){
// TemplatesSubPane
var ViewControlCollection = require('../../controls/control-collection')

module.exports = CS.Mn.LayoutView.extend({
	template: 'layout/sub-templates/layout-sub-template',
	className: 'cs-pane-content-inner templates',

  regions: {
    Controls: '#layout-template-controls',
  },

  initialize: function() {
  	this.listenTo( cs.templates, 'control:reset', function(){
  		this.onBeforeShow();
  	});
  },

  onBeforeShow: function() {
    this.Controls.show( new ViewControlCollection( { collection: cs.component('layout-templates').controls } ) );
  },

});
},{"../../controls/control-collection":37}],84:[function(require,module,exports){
var ViewBasePane = require('../main/base-pane')
module.exports = ViewBasePane.extend({
  name: 'elements',
  paneTemplate: 'library/search',
  paneEvents: {
    'keyup #elements-search': 'search',
    'search #elements-search': 'search'
  },

  onShowContent: function() {
  	var ViewElementLibrary = require('./library-list');
    this.Content.show( new ViewElementLibrary( {collection: cs.elementLibrary.all() } ) );
  },

  search: function() {
    this.$('.cs-pane-content-inner').perfectScrollbar('update');
    cs.search.trigger( 'elements', this.$('#elements-search').val().toLowerCase().trim() );
  },

  onShow: function() {
    this.$('#elements-search').focus();
  }
});
},{"../main/base-pane":87,"./library-list":86}],85:[function(require,module,exports){
// ElementLibraryItem

module.exports = CS.Mn.ItemView.extend({
  tagName: "li",
  template: 'library/element-stub',
  attributes: { 'draggable': 'true' },
  serializeData: function() {
		return _.extend( CS.Mn.ItemView.prototype.serializeData.apply(this,arguments), {
			icon: cs.icon( 'element-' + this.model.get( 'name' ) )
		});
	},

	events: {
		'dragstart.h5s': 'setData',
		'dragend.h5s': 'endDrag'
	},

	endDrag: function(e) {
		 cs.global.trigger( 'dragging', false );
	},

	setData: function (e) {

		 cs.global.trigger( 'dragging', true );
		 cs.global.trigger( 'incoming:element' );

		var dataTransfer = e.originalEvent.dataTransfer;
    dataTransfer.effectAllowed = 'copy';
    var data = JSON.stringify({
			action: 'create',
    	_type: this.model.get( 'name' )
    });

    var $icon = this.$('svg');

    if ($icon.length) {
    	dataTransfer.setDragImage( $icon[0], 25, 25 );
    }

    dataTransfer.setData( 'cornerstone/element', data );

	}

});
},{}],86:[function(require,module,exports){
module.exports = CS.Mn.CollectionView.extend({
	tagName: 'ul',
	className: 'cs-elements',
	childView: require('./element-stub'),
	childViewContainer: '.cs-pane-section ul',

	initialize: function( ) {
		this.query = '';
		this.listenTo( cs.search, 'elements', this.updateSearch );
	},

	filter: function ( child, index, collection ) {

		// Hide inactive, out-of-context, or child elements.
		var flags = child.get('flags');
		if ( child.get('active') == false || !_.contains( ['builder','all'], flags.context ) || flags.child )
			return false;

		// Show all when not searching
		if ( this.query.length < 1 )
			return true;

		// Show items that match a search query
		var title = child.get('ui').title;
    return ( title.score( this.query ) > .5 );
  },

	updateSearch: function( query ) {
		this.query = query;
		this.render();
	},

	onRender: function( ) {
		this.query = '';
	}
});
},{"./element-stub":85}],87:[function(require,module,exports){
// BasePane
var BasePane = CS.Mn.LayoutView.extend({

	name: 'undefined',

	className: function() { return 'cs-pane ' + this.name; },

	template: 'main/pane',
	paneTemplate: false,

	regions: {
    Content: '#content',
    Sub: '#sub'
  },

	events: function() {
		return _.extend( { 'click button.cs-builder-sub-back': 'back' }, this.paneEvents );
	},


  paneEvents: {},

  onBaseOpenSub: function( sub ) {

		clearTimeout(this.subTimeout);
		cs.navigate.trigger( 'subpane:opened', this.name + ':' + sub );
  	this.triggerMethod( 'open:sub' );
  	this.triggerMethod( 'open:sub:' + sub );

  	this.$('.cs-builder-sub').addClass('active').find('.cs-pane-content-inner').perfectScrollbar({
      suppressScrollX     : true,
      scrollYMarginOffset : 25
    });

  },

  onBaseCloseSub: function() {
  	this.$('.cs-builder-sub').removeClass('active');
  	this.subTimeout = setTimeout( _.bind( this.closeSub, this ), 3000 );
  	this.triggerMethod( 'close:sub' );
  },

  back: function() {
  	cs.navigate.trigger( this.name + ':home' );
  },

  closeSub: function() {
  	if (this.Sub)
    	this.Sub.empty();
  },

  onBeforeShow: function(){

    this.Sub.empty();
    this.Content.empty();
    this.triggerMethod( 'show:content' );

  },

  serializeData: function() {

  	var data = _.extend( CS.Mn.LayoutView.prototype.serializeData.apply( this, arguments ), {
      heading: cs.l18n( this.name + '-heading' ),
      returnButtonText: cs.l18n( this.name + '-return' ),
      paneTemplate: this.paneTemplate,
      name: this.name
    });

  	if ( _.isFunction( this.updateSerializeData ) )
  		return this.updateSerializeData( data );

  	return data;

  }

});

module.exports = BasePane;

},{}],88:[function(require,module,exports){
// Editor

var ViewHeader    = require('./header')
  , ViewFooter    = require('./footer')
  , ViewExpansion = require('../extra/expansion')
  , ViewSkeleton  = require('./skeleton');

module.exports = CS.Mn.LayoutView.extend({

  template: 'main/editor',

  regions: {
    Header: '#header',
    Pane:   '#pane',
    Footer: '#footer',
    Expansion: '#expand',
    Skeleton: '#skeleton',
  },

  panes: {
    'layout': require('../layout/layout'),
    'elements': require('../library/element-library'),
    'inspector': require('../inspector/inspector'),
    'settings': require('../settings/settings'),
  },

  initialize: function() {

    this.listenTo( cs.navigate, 'pane', this.changePane );
    this.listenTo( cs.confirm, 'open', this.confirmOpen );
    this.listenTo( cs.navigate, 'scrollbar:update', this.scrollbarUpdate );
    this.listenTo( cs.options, 'editor:position', this.setEditorPosition );

    this.listenTo( cs.message, 'notice', this.growlNotice );
    this.listenTo( cs.message, 'success', this.growlSuccess );
    this.listenTo( cs.message, 'error', this.growlError );

    this.listenTo( cs.data, 'control:not:live', this.controlNotLive );
    this.sentControlMessages = [];

    Backbone.$('#cornerstone').on('mouseenter mouseleave', '.cs-sortable li.sortable-item', _.bind( this.sortableHover, this ) );

    if ( localStorage['CornerstonePane'] == 'settings' ) {
      cs.data.reply('saved:last', Cornerstone.Vendor.moment() );
      cs.channel.trigger('update:saved:last');
    }

  },

  onRender: function() {

    var prevPane = localStorage['CornerstonePane'];
    localStorage['CornerstonePane'] = false;

    cs.data.reply('scrollbar:width', this.getScrollbarWidth() );

    this.changePane( _.has( this.panes, prevPane ) ? prevPane : 'layout' );
    this.Header.show( new ViewHeader() );
    this.Footer.show( new ViewFooter() );
    this.Expansion.show( new ViewExpansion() );
    this.Skeleton.show( new ViewSkeleton( { model: cs.post.data } ) );

    this.Expansion.$el.detach();
    this.$el.after(this.Expansion.$el);
    this.Skeleton.$el.detach();
    //this.$el.after(this.Skeleton.$el);

    this.setEditorPosition();
  },

  changePane: function( pane, sub ) {

    cs.tooltips.trigger( 'kill' );

    if (this.activePane != pane ) {
      cs.navigate.trigger('pane:switch');
      this.Pane.show( new this.panes[pane]() );
    }
    this.activePane = pane;

    cs.navigate.reply( 'active:pane', this.activePane );

    if ( sub ) {
    	this.Pane.currentView.triggerMethod( 'base:open:sub', sub );
    } else {
    	this.Pane.currentView.triggerMethod( 'base:close:sub' );
    }

    this.$('.cs-pane-content-inner').perfectScrollbar({
      suppressScrollX     : true,
      scrollYMarginOffset : 25
    });

  },

  sortableHover: function( e ) {
    Backbone.$(e.currentTarget).toggleClass( 'hover', (e.type === 'mouseenter') );
  },

  controlNotLive: function( control, message ) {

    if ( !_.contains( this.sentControlMessages, control ) ) {
      this.sentControlMessages.push(control)
      cs.message.trigger('notice', cs.l18n( message ) )
    }

  },

  growlNotice: function( message, title ) {
    this.growlMessage({
      title: cs.l18n('message-notice'),
      style: "notice",
    }, arguments );
  },

  growlSuccess: function() {
    this.growlMessage({
      title: cs.l18n('message-success'),
      style: "success",
    }, arguments );
  },

  growlError: function() {
    this.growlMessage({
      title: cs.l18n('message-error'),
      style: "error",
    }, arguments );
  },

  growlMessage: function( defaults, args ) {

    var opts = {
      message: '',
      duration: 4000,
    };

    if (args && args[0]) opts.message = args[0];
    if (args && args[1]) opts.duration = args[1];
    if (args && args[2]) opts.title = args[2];

    var settings = _.extend( defaults, opts );
    if (settings.duration < 5000 )
      settings.close = ''

    Backbone.$.growl( settings );

    var scrollbarWidth = cs.data.request('scrollbar:width');
    if ( scrollbarWidth > 0 ) {
      Backbone.$('#growls').css( {right: scrollbarWidth} );
    }

  },

  getScrollbarWidth: function() {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  },

  scrollbarUpdate: function() {
    this.$('.cs-pane-content-inner').perfectScrollbar('update');
  },

  setEditorPosition: function() {
  	Backbone.$('#cornerstone').toggleClass( 'cs-right', cs.options.request( 'editor:position' ) == 'right' );
  }

});
},{"../extra/expansion":74,"../inspector/inspector":80,"../layout/layout":81,"../library/element-library":84,"../settings/settings":111,"./footer":89,"./header":90,"./skeleton":93}],89:[function(require,module,exports){
var ViewExpand  = require('../extra/expand')
  , ViewConfirm = require('../extra/confirm')
  , ViewHome    = require('../extra/home')
  , ViewRespond = require('../extra/respond')
  , ViewOptions = require('../extra/options')
  , ViewSaveComplete = require('../extra/save-complete');


// EditorFooter
module.exports = CS.Mn.ItemView.extend({

  template: 'main/footer',
  ui: {
    'home': 'button.home',
    'collapse': 'button.collapse',
    'options': 'button.options',
    'respond': 'button.respond',
    'save': 'button.save',
  },

  events: {
    'click @ui.home': 'toggleHome',
    'click @ui.collapse': 'toggleCollapse',
    'click @ui.options': 'toggleOptions',
    'click @ui.respond': 'toggleRespond',
    'click @ui.save': 'save',
  },

  // colorTempTimer: 30 * 1000, // Check every 30 seconds (change 30 to 1 for testing)
  // colorTempThreshold: 30 * 60 * 1000, // Max out at 30 minutes. (change 60 to 1 for testing)
  // colorTempSteps: [ '#d0d0d0', '#ffd700', '#ffa500', '#ff4500', '#ff0000' ],

  initialize: function() {

    this.listenTo(cs.extra, 'flyout:updated', this.toggleMode );
    this.listenTo(cs.data, 'save:success', this.saveComplete );
    this.listenTo(cs.data, 'save:error', this.saveComplete );
    this.listenTo(cs.confirm, 'open', this.confirmOpen );
    this.listenTo(cs.tooltips, 'kill', this.killTooltip )

    Backbone.$('#cornerstone').on('mouseenter mouseleave', '[data-tooltip-message]', _.bind( this.toggleTooltip, this ) );

    this.modules = {
      home: new ViewHome(),
      expand: new ViewExpand(),
      options: new ViewOptions(),
      respond: new ViewRespond(),
      save: new ViewSaveComplete(),
      confirm: new ViewConfirm(),
    };

    this.panels = _.pick(this.modules, 'home', 'expand', 'options', 'respond', 'save', 'confirm' );

    cs.extra.on( 'collapse', function( state ) {
       cs.global.trigger( 'collapse', ( state == 'on' ) );
    });

    this.panelMode = 'none';
    this.listenTo( cs.extra, 'flyout', function( mode, stay ){
      var updated =  ( mode != this.panelMode );
      cs.extra.trigger( 'flyout:updated', mode, updated, this.panelMode );
      if ( mode != this.panelMode ) {
        cs.extra.trigger( 'flyout:' + mode );
      }
      this.panelMode = (updated) ? mode : 'none';

      var active = ( 'none' != this.panelMode );
      var mode = this.panelMode;
      if (active) {
        _.delay(function(){
          Backbone.$('.cs-editor').addClass( 'flyout' ).attr( 'data-flyout', mode );
          cs.navigate.trigger( 'scrollbar:update' );
        }, 650 );
      } else {
        Backbone.$('.cs-editor').removeClass( 'flyout' ).attr( 'data-flyout', 'none' );
        cs.navigate.trigger( 'scrollbar:update' );
      }
    });

    // Start save button color temp after rendering
    // this.once('render', function() {
    //   this.colorTempInterval = setInterval( _.bind( this.saveColorTemp, this ), this.colorTempTimer );
    // });
  },

  onRender: function() {
    var $extra = this.$('.cs-editor-extra');
    _.each(this.modules,function(item){
      $extra.append(item.render().$el);
    });
  },

  toggleTooltip: function(e) {

    var message = Backbone.$(e.currentTarget).data('tooltip-message');

    var show = (e.type === 'mouseenter' && message && cs.options.request( 'help:text' ) );

    if ( show )
      this.$('.cs-tooltip-inner').text( message );

    if (this.tooltipTimer) {
      window.clearTimeout(this.tooltipTimer);
      this.tooltipTimer = undefined;
      return;
    }

    this.tooltipTimer = window.setTimeout( _.bind( function() {
      this.tooltipTimer = undefined;
      this.$('.cs-tooltip-outer').toggleClass('active', show );
    }, this ), (show) ? 333 : 250 );

  },

  killTooltip: function() {
    this.tooltipTimer = undefined;
    this.$('.cs-tooltip-outer').toggleClass('active', false );
  },

  toggleHome: function() {
    cs.extra.trigger( 'flyout', 'home' );
  },

  toggleCollapse: function() {
    cs.extra.trigger( 'flyout', 'collapse' );
  },

  toggleOptions: function( e ) {
    cs.extra.trigger( 'flyout', 'options' );
  },

  toggleRespond: function( e ) {
    cs.extra.trigger( 'flyout', 'respond' );
  },

  save: function() {
    this.$('button.save').prop( 'disabled', true );
    cs.events.trigger( 'action:save' );
  },

  saveComplete: function() {
    //this.saveColorTemp();
    this.$('button.save').removeProp( 'disabled' );
    this.panels.save.triggerMethod('save:complete');
  },

  saveError: function() {
    //this.saveColorTemp();
    this.$('button.save').removeProp( 'disabled' );
    cs.message.trigger( 'error', cs.l18n( 'save-error' ), 30000 );
  },

  // saveColorTemp: function() {
  //   var savedLast, diff, progress, colorIndex;

  //   savedLast = cs.data.request( 'saved:last' );

  //   diff = Date.now() - ( (savedLast) ? savedLast.toDate().getTime() : cs.bootTime );
  //   progress = diff / this.colorTempThreshold; // % of threshold
  //   colorIndex = Math.min( Math.floor( this.colorTempSteps.length * progress ), this.colorTempSteps.length - 1 );

  //   this.$('button.save').css('color', this.colorTempSteps[colorIndex] );

  // },

  toggleMode: function( mode, updated, prev ) {

    this.$('nav button').removeClass('active');
    _.each(this.panels,function(item){
      item.$el.removeClass('active');
    });

    if ( updated ) {
      this.$('button.' + mode ).addClass('active');
      this.$('.cs-editor-extra .cs-' + mode ).addClass('active');
    }

  },

  confirmOpen: function( data ) {
    this.panels.confirm.triggerMethod( 'open', data );
  }

});
},{"../extra/confirm":72,"../extra/expand":73,"../extra/home":75,"../extra/options":76,"../extra/respond":77,"../extra/save-complete":78}],90:[function(require,module,exports){
// EditorHeader
module.exports = CS.Mn.ItemView.extend({
  tagName: 'nav',
  template: 'main/header',

  events: {
    'click button.layout':    'layout',
    'click button.inspector': 'inspector',
    'click button.elements':  'elements',
    'click button.settings':  'settings'
  },

  initialize: function() {
    this.listenTo(cs.navigate, 'pane', this.changePane )
  },

  onRender: function() {
    this.changePane( cs.navigate.request( 'active:pane' ) );
  },

  layout: function () {
    cs.navigate.trigger('pane', 'layout' );
  },

  inspector: function () {
    cs.navigate.trigger('pane', 'inspector' );
  },

  elements: function () {
    cs.navigate.trigger('pane', 'elements' );
  },

  settings: function () {
    cs.navigate.trigger('pane', 'settings' );
  },

  changePane: function( pane ) {
    this.$( '.' + pane ).addClass('active').siblings().removeClass('active');
  }
});
},{}],91:[function(require,module,exports){
module.exports = CS.Mn.ItemView.extend({
	template: 'observer',
	className: 'cs-observer',
	initialize:function(){

		this.lazyRender = _.debounce( this.renderNow, 100 );
		this.throttleTimer = 50;

		this.observing = null;
		this.tooltipText = 'Element';
		this.canPreview = true;

		this.listenTo( cs.observer, 'start', this.observeStart );
		this.listenTo( cs.observer, 'end', this.observeEnd );
		this.listenTo( cs.preview,  'kill:observer', this.kill );
		this.listenTo( cs.observer, 'kill', this.kill );
		this.listenTo( cs.observer, 'drag:indicator', this.dragIndicator );

		this.$wrapper = Backbone.$('#cornerstone-preview-entry');
		this.$dragIndicator = Backbone.$('<div class="cs-indicator"></div>');

		// this.mouseTracking = { distance: 0, x: -1, y: -1, time: null, speed: 0 };
		// Backbone.$('body').on('mousemove', _.bind( this.trackMouseDistance, this ) );
		// setInterval( _.bind( this.trackMouseAcceleration, this ), 50 );
	},

	setObserver: function( view, immediate ) {

		clearInterval( this.renderInterval );

		this.coordinates = { top: 0, left: 0, height: 0, width: 0 };
		this.observing = view;


		if ( this.observing ) {
			var type = view.model.get('_type');
			var el = cs.elementLibrary.lookup( type );
			var flags = el.get( 'flags' );

			this.setTooltip( view.model, type, flags );
			this.canPreview = flags.can_preview;

		}

		(immediate) ? this.renderNow() : this.lazyRender();
	},

	setTooltip: function( model, type, flags ) {

		var text;

		switch ( type ) {
      case 'section':
        text = cs.l18n('section-format').replace('%s', model.get('title') );
        break;
      case 'row':
        text = cs.l18n('row-numeric').replace('%s', model.getIndex() + 1 );
        break;
      case 'column':
        text = cs.l18n('column-format').replace('%s', model.get('size') );
        break;
      default:
      	text = model.definition.get('ui').title;
      	break;
    }

    if ( !flags.can_preview ) {
    	text = cs.l18n('no-preview').replace('%s', text );
    }

    this.tooltipText = text;

	},

	observeStart: function( view, immediate ) {
  	if ( !_.isNull( this.observing ) && this.observing.cid == view.cid) return;
  	this.setObserver( view, immediate || false );
  },

  observeEnd: function( view, immediate ) {
  	if ( _.isNull( this.observing ) || this.observing.cid != view.cid ) return;
		this.setObserver( null, immediate || false );
	},

	kill: function() {
		this.setObserver( null, true );
	},

	dragIndicator: function( column ) {


		if ( column.dropIndex == column.localIndex ) {
			this.$dragIndicator.hide();
			return;
		}

		var offset = column.$el.offset();
		var top = this.$wrapper.offset().top + this.$dragIndicator.height() / 2;

		var styles = {
			left: offset.left - this.$wrapper.offset().left,
			width: column.$el.outerWidth(),
		};

		if (column.collection.length <= 0 ) {
			styles.top = offset.top - this.$wrapper.offset().top;
			styles.height = '250px';
		} else if (column.dropIndex == 0 ) {

			// Top Line
			styles.top = offset.top - top;
			//console.log('TOP', column.dropIndex);

		} else if (column.dropIndex == ( ( _.isNull( column.localIndex ) ) ? column.collection.length : column.collection.length - 1 ) ) {

			// Bottom Line
			styles.top = ( offset.top + column.$el.outerHeight() ) - top;
			//console.log('BOTTOM', column.dropIndex);

		} else {


			// Middle Line
			var dropIndex = ( !_.isNull( column.localIndex ) && ( column.localIndex === 0 || column.dropIndex > column.localIndex ) ) ? column.dropIndex + 1 : column.dropIndex;
			var x = column.$el.children().eq(dropIndex).offset().top;
			var $y = column.$el.children().eq(dropIndex-1);
			var y = $y.offset().top + $y.outerHeight();
			styles.top = ( x - ( x - y ) / 2 ) - top;

			//console.log( 'MIDDLE', column.dropIndex );

		}

		this.$dragIndicator.removeAttr( 'style' ).css( styles );
		this.$dragIndicator.show();

	},

	renderDragIndicator: function() {
		this.$dragIndicator.detach();
		this.$el.after( this.$dragIndicator );
		this.$dragIndicator.hide();
	},

	renderNow: function() {

		clearInterval( this.renderInterval );

		if ( _.isNull( this.observing ) || cs.observer.request( 'get:collapse' ) ) {
			this.$el.hide();
			return;
		}

		this.renderLoop();
		this.renderInterval = setInterval( _.bind( this.renderLoop, this ), this.throttleTimer );

	},

	renderLoop: function() {

		var offset = this.observing.$el.offset();
		var newHeight = this.observing.$el.outerHeight();
		var newWidth = this.observing.$el.outerWidth();

		if (this.coordinates.width == newWidth && this.coordinates.height == newHeight  )
			return;

		this.coordinates = {
			top: offset.top - this.$wrapper.offset().top,
			left: offset.left - this.$wrapper.offset().left,
			width: newWidth,
			height: newHeight,
		};


		this.render();
		this.$el.css( this.coordinates );

		if ( this.coordinates.top < 25 ) {
			this.$('.cs-observer-tooltip').removeClass('top');
		}

	},


	onRender: function() {

		//this.renderDragIndicator();

		if ( _.isNull( this.observing ) || cs.observer.request( 'get:collapse' ) ) {
			this.$el.hide();
			return;
		}

		this.$el.toggleClass('cs-observer-no-preview', !this.canPreview );
		this.$el.show();



	},

	serializeData: function() {
		return _.extend( CS.Mn.ItemView.prototype.serializeData.apply( this, arguments ), {
			tooltip: this.tooltipText
		} );
	},

	// trackMouseDistance: function( e ) {
	// 	var x = e.screenX;
	// 	var y = e.screenY;
	// 	if (this.mouseTracking.x > -1) {
 //      this.mouseTracking.distance += Math.max( Math.abs(x-this.mouseTracking.x), Math.abs(y-this.mouseTracking.y) );
 //    }
	// 	this.mouseTracking.x = x;
 //    this.mouseTracking.y = y;
	// },

	// trackMouseAcceleration: function() {
	// 	var time = new Date().getTime();
	// 	this.mouseTracking.speed = Math.round( this.mouseTracking.distance / (time - this.mouseTracking.time ) * 1000);
	// 	this.mouseTracking.time = time;
	// 	this.mouseTracking.distance = 0;

	// }
});
},{}],92:[function(require,module,exports){
module.exports = Cornerstone.Mn.CompositeView.extend({

	template: false,

	emptyView: CS.Mn.ItemView.extend({
		className: 'cs-empty-rows',
		template: 'empty-rows',
	}),

	getChildView: function( item ) {
		return cs.component('view-loader').elementLookup( item.get('_type') );
	},

	initialize:function(){

		this.collection = this.model.elements;

		this.listenToOnce( cs.global, 'preview:primed', function() {
			this.$el.removeClass('cs-preview-loading');
		} );

		this.listenTo( this.collection, 'sort', this.render );

		cs.$indicator = Backbone.$('<div class="cs-indicator"></div>');

    cs.preview.on('incoming:element', function() {
      cs.$indicator.removeAttr('style');
    });

    this.observerView = new (require('./observer.js'))();

		this.listenTo(  cs.global, 'set:collapse', this.toggleCollapse );
		this.listenTo(  cs.global, 'dragging', this.toggleDragging );
		this.listenTo(  cs.preview, 'dragging', this.toggleDragging );

		 this.listenTo( cs.preview, 'autoscroll', _.debounce( _.bind( this.autoScroll, this ), 250, true ) );

	},

	onBeforeRender: function() {

		this.scrollTopCache = Backbone.$('body').scrollTop();

		Backbone.$('a').click( function( e ) {
			cs.preview.trigger('click:theme:a', e );
		}).attr('target','_blank');

	},

	onRender: function() {

		Backbone.$('html,body').scrollTop( this.scrollTopCache );

		this.$el.toggleClass('cs-editor-active', true );
		this.$el.toggleClass('cs-editor-inactive', false );

		this.$el.append( this.observerView.render().$el );

		_.defer( function(){
			cs.preview.trigger( 'responsive:text' );
		} );
	},

	toggleCollapse: function( state ) {
		this.$el.toggleClass('cs-editor-active', !state )
		this.$el.toggleClass('cs-editor-inactive', state )
	},

	toggleDragging: function( state ) {
		this.$el.toggleClass('cs-dragging', state )
	},

	autoScroll: function( view ) {

		if ( view.$el.visible( true ) )
			return;

		var $from = Backbone.$( cs.config('scrollTopSelector') );
		var top = ($from.length > 0 ) ? $from.outerHeight() : 0;
		var offset = view.$el.offset().top - top - 27; // Magic number for observer height
		Backbone.$('html,body').animate( { scrollTop: offset }, 700, 'swing' );

	},

});
},{"./observer.js":91}],93:[function(require,module,exports){
module.exports = CS.Mn.CompositeView.extend({

  template: 'main/skeleton',
  childViewContainer: '.cs-skeleton-content-inner',

  getChildView: function( item ) {
		return cs.component('view-loader').skeletonLookup( item.get('_type') );
	},

	initialize: function() {
		this.collection = this.model.elements;
		this.listenTo( this.collection, 'sort', this.render );
	},

	onRender: function() {

		this.$('.cs-skeleton-content-inner').perfectScrollbar({
      scrollYMarginOffset: 10,
      wheelPropagation: true
    });
    _.defer( _.bind( this.deferRender, this ) );
	},

	deferRender: function() {
		this.$('.cs-skeleton-content-inner').perfectScrollbar('update');
	}

});
},{}],94:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	toggle: function( e ) {

		var href
		var $this   = this.$(e.target)
		var $target = this.$( $this.attr('data-target') || e.preventDefault() || $this.attr('href') )
		var data    = $target.data('bs.collapse')
		var option  = data ? 'toggle' : $this.data()
		var parent  = $this.attr('data-parent')
		var $parent = parent && this.$(parent)

		if (!data || !data.transitioning) {
		if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
			$this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
		}

		jQuery.fn.collapse.call($target, option)

	},

	onClickBeforeInspect: function( e ) {
		if ( e.target.className.indexOf('x-accordion-toggle') >= 0 ) {
			this.toggle(e);
		}
	},

});
},{}],95:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	elementEvents: {
		'click button.close' : 'closeButton'
	},

	closeButton: function( e ) {
		e.preventDefault();
	}
});
},{}],96:[function(require,module,exports){
module.exports = CS.Mn.CompositeView.extend( {

	remoteRender: true,
	template: false, // <div class="cs-inception"></div>
	childViewContainer: '@ui.root',
	className: 'cs-preview-element-wrapper',
	draggable: true,
	htmlhint: { 'tagname-lowercase': false, 'attr-lowercase': false, 'attr-value-double-quotes': false, 'doctype-first': false, 'tag-pair': true, 'spec-char-escape': false, 'id-unique': false, 'src-not-empty': false, 'attr-no-duplication': false, 'title-require': false },

	attributes: function() {
		return { 'draggable': _.result( this, 'draggable' ) };
	},

	events: function() {

		var events = {
			'click a': '_preventLinkout'
		};

		var inspectable = _.result( this, 'inspectable' )
		if ( inspectable || _.isUndefined( inspectable ) ) {

			events = _.extend( events, {
				'click': '_click',
				'mouseover': '_observeStart',
				'mouseout': '_observeEnd'
			}, this._setupAutoFocus() );

		}

		var draggable = _.result( this, 'draggable' )
		if ( draggable || _.isUndefined( draggable ) ) {

			events = _.extend( events, {
				'dragstart.h5s': '_dragStart',
				'dragend.h5s': '_dragEnd',
			} );

		}

		return _.extend( events, _.result( this, 'elementEvents' ) || {} );
	},

	getChildView: function( item ) {
		return cs.component('view-loader').elementLookup( item.get('_type') );
	},

	constructor: function( options ) {

		CS.Mn.CompositeView.apply(this, arguments);

		this._setupChildren();

		this._repaint = _.debounce( _.bind( function() {
			try {
				this.render()
			} catch (e) {
				if ( e.name == 'ViewDestroyedError' ) return;
				console.log('Cornerstone Render Exception', e );
			}
		}, this ), 5 );

		this._updateMarkup = _.debounce( _.bind( this.__updateMarkup, this ), 5 );

		if ( this.model.collection )
			this.modelIndex = this.model.collection.indexOf( this.model );


		this._updateMarkup();
		this.listenTo( this.model, 'change', this._updateMarkupOnChange );
		this.listenTo( this.model, 'remote:render', this._repaint );
		this.on( 'render', this._baseRender );

		this.listenTo( this.model, 'observe:start', function() {
			cs.observer.trigger( 'start', this );
		} );

    this.listenTo( this.model, 'observe:end', function() {
			cs.observer.trigger( 'end', this );
    } );

    // Privately attach event handlers so we can use the triggerMethod hooks in inheriting views
    this.on( 'render:template', this._onRenderTemplate );
    this.on( 'template:data:ready', function( data ){
    	this.once( 'render', function() {
				this.triggerMethod( 'construct:element', data );
    	});
    } );

		this.triggerMethod( 'element:init' );

		this.listenTo( cs.global, 'autoscroll', function( cid ){
			if ( this.model && this.model.cid == cid )
				cs.preview.trigger( 'autoscroll', this );
		} );

	},

	_setupChildren: function() {

		if ( this.model.definition.get('flags').manageChild ) {
			this.listenTo( this.model.elements, 'sort', this._updateManagedChild );
			this.listenTo( this.model.elements, 'model:change', this._updateManagedChild );
			return;
		}

		this.collection = this.model.elements;
		this.listenTo( this.collection, 'sort', this._updateMarkup );

	},

	_updateManagedChild: function() {
		this.model.trigger( 'update:child:data' );
		this._updateMarkup();
	},

	_updateMarkupOnChange: function( model ) {
		if ( _.isEmpty( _.omit( model.changed, ['rank'] ) ) )
			return;
		this._updateMarkup();
	},

	__updateMarkup: function() {
		if ( this.remoteRender ) {
			cs.render.triggerMethod( 'queue', this.model );
		} else {
			this._repaint();
		}
	},

	serializeData: function() {
		var base = CS.Mn.CompositeView.prototype.serializeData.apply(this,arguments);
		var elementData = _.result( this, 'elementData' ) || {};
		return _.defaults( _.extend( base, elementData ), this.model.getDefaults() );
	},

	attachElContent: function( html ) {

    if ( this.remoteRender ) {

    	html = cs.render.getCache( this.model );

    	if ( _.isFunction( html) )
    		html = CS.Mn.Renderer.render( html, this.serializeData() );

    }

    if ( html ) {

    	if ( this.model.definition.get('flags').htmlhint ) {
  			if ( !_.isEmpty( Cornerstone.Vendor.HTMLHint.verify( html, this.htmlhint ) ) )
    			html = Backbone.$('<div>').text(html).html(); // encode html with unclosed tags.
  		}

			// errors = _.filter( errors, function( error ) {
			// 	if ( error.message.indexOf('[ <p> ]') !== -1 ) return false;
			// 	if ( error.message.indexOf('[ </p> ]') !== -1 ) return false;
			// 	if ( error.raw =="</p>" ) return false;
			// 		return true;
			// });

    	this.$el.html(html);

    }

    return this;
  },

  // Bind the @root ui dynamically. Use inception parent if it exists, otherwise this.$el
  // This is used for our composite view's childViewContainer
  bindUIElements: function() {
  	if (!this.ui) this.ui = {};
  	CS.Mn.CompositeView.prototype.bindUIElements.apply(this,arguments);
  	var $inception = this.$('.cs-inception');
    this.ui['root'] = ($inception.length) ? $inception.parent() : this.$el;
  },

  // After UI is bound, remove inception placeholder if it exists
  _onRenderTemplate: function() {
  	var $inception = this.$('.cs-inception');
  	if ($inception.length) $inception.detach();
  },

  _baseRender: function() {

  	this.triggerMethod('before:shortcode:init');

    window.xData.base.processElements( null, this.$el );

    cs.preview.trigger( 'responsive:text', this );

    this.triggerMethod('after:element:render');

    if ( this.remoteRender ) {
      _.defer( _.bind( function(){
      	if ( this._emptyDetection() ) {
      		this.triggerMethod( 'render:empty' );
      	}
      }, this ), 0 );
    }

  },

  onRenderEmpty: function() {
  	this._renderEmpty();
  },

  _renderEmpty: function() {
  	var $html = Backbone.$( CS.Mn.Renderer.render( 'empty-element', this.serializeData() ) );
  	this.$el.append( $html );
  },

  _emptyDetection: function() {

  	if ( _.isFunction( this.emptyDetection ) )
  		return this.emptyDetection();

  	if ( this.model.definition.get('flags').empty ) {
  		return false; // detection handled server side, but aborted here.
  	}

    return ( this.$el.shadowHeight() < 1 );

  },

  _setupAutoFocus: function() {

  	var events = {}, ui = this.model.definition.get('ui');

  	if (!ui.autofocus) return events;

  	_.each( ui.autofocus, function( value, key ){
  		var selector = 'click ' + value;
  		events[selector] = function() {
  			 cs.global.trigger( 'auto:focus', key );
  		}
  	});

  	return events;

  },

  _preventLinkout: function( e ) {
  	e.preventDefault();
  },

  _click: function( e ) {
		this.triggerMethod('click:before:inspect', e );
		e.stopPropagation();
		cs.global.trigger( 'inspect', this.model )
  },

	_dragStart: function( e ) {
		this._setData(e);
		_.defer( _.bind( this.triggerMethod, this), 'drag:start', e )
	},

	_dragEnd: function( e ) {
		cs.preview.trigger( 'dragging', false );
		if ( e.originalEvent ) this.triggerMethod( 'drag:end', e );
	},

	_observeStart: function( e ) {
		e.stopPropagation();
		this.model.trigger( 'observe:start' );
  },

  _observeEnd: function( e ) {
  	this.model.trigger('observe:end');
  },


  _setData: function ( e ) {

		var dataTransfer = e.originalEvent.dataTransfer;
    dataTransfer.effectAllowed = 'copy';
    var data = JSON.stringify({
			action: 'move',
    	id: this.model.cid,
    });

    cs.preview.replyOnce( 'cache:'+ this.model.cid, this.model );
    dataTransfer.setData( 'cornerstone/element', data );

	}

} );
},{}],97:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	onAfterElementRender: function() {

    _.defer( _.bind( function(){
    	this.$('.x-card-outer').trigger('cs:setcardheight')
    }, this ) );

	}
});
},{}],98:[function(require,module,exports){
module.exports = Cornerstone.ElementViews.Base.extend({

	remoteRender: false,
	draggable: false,

	emptyView: CS.Mn.ItemView.extend({
    className: 'cs-empty-column',
    template: 'empty-column',
  }),

	elementEvents: {
		'click svg.cs-custom-icon': 'clickIcon',
		'drop.h5s': 'receiveElement',
		'dragenter.h5s': 'dragEnter',
		'dragover.h5s': 'dragOver',
	},

	initialize: function() {

		this.checkDragOverStart = _.once( this.dragOverStart );
		this.checkDragLeave = _.debounce( this.dragLeave, 50 );
		this.throttleSetDragIndicator = _.throttle( _.bind( this.setDragIndicator, this ), 125, { leading: false, trailing: false } );
		this.localIndex = null;
		this.dropIndex = 0;

		this.emptyElementView = new this.emptyView();
		this.emptyElementView.render();

	},

	clickIcon: function( e ) {
		e.stopPropagation();
		cs.global.trigger('nav:kylelements');
	},

	onRemoveChild: function() {
  	this.localIndex = null;
  	this.emptyClassCheck();
  },

  onAddChild: function( child ) {
		child.triggerMethod('added:to:column');
	},

  onRender: function() {
  	cs.$indicator.detach();
  },

	emptyClassCheck: function( on ) {
		this.emptyElementView.$el.detach();
		if ( on && this.collection.length <= 1) this.$el.append(this.emptyElementView.$el);
		this.$el.toggleClass( 'cs-empty', ( this.collection.isEmpty() || ( !!on ) ) );
	},

	dragOverStart: function( ) {
		this.$el.toggleClass( 'cs-receiving', true );
		cs.observer.trigger( 'in', this, true );
	},

	dragEnter: function() {
		this.checkDragOverStart();
		this.checkDragLeave();
	},

	dragOver: function(e) {

		this.checkDragOverStart();
		this.checkDragLeave();

    if (e.originalEvent.preventDefault)
      e.originalEvent.preventDefault();

    e.originalEvent.dataTransfer.dropEffect = 'copy';

    if (this.collection.length > 0 ) {
    	this.throttleSetDragIndicator( e.originalEvent.pageY );
    }

	},

	dragLeave: function () {
		this.$el.toggleClass( 'cs-receiving', false );
		this.checkDragOverStart = _.once( this.dragOverStart );
		cs.observer.trigger( 'out', this );
		cs.$indicator.detach();
	},

	receiveElement: function ( e ) {

		this.emptyClassCheck();
		cs.observer.trigger('kill:indicator');
		this.$el.toggleClass( 'cs-receiving', false );
		this.localIndex = null;

    cs.observer.trigger( 'kill');
    cs.preview.trigger( 'dragging', false );

		var data = JSON.parse( e.originalEvent.dataTransfer.getData('cornerstone/element') );
		if ( !data ) return;

    if ( data.action == 'create' && data._type ) {
    	return this.model.elements.create( { _type: data._type }, {}, this.dropIndex  );
    }


    if ( data.action =='move' && data.id ) {

    	var incoming = cs.preview.request( 'cache:'+ data.id );

    	if ( this.collection.get({ cid: data.id }) ) {
    		return this.collection.trigger( 'update:position', incoming, this.dropIndex );
    	}

    	var newModel = this.model.elements.create( incoming.toJSON(), _.clone( incoming.options ), this.dropIndex  );
    	newModel.shadow = incoming.cid;
    	incoming.trigger( 'column:change', newModel );
    	incoming.destroy();

    	this.render();

    }

    this.dropIndex = 0;

	},

	onChildviewDragStart: function( child ) {

  	cs.preview.trigger( 'dragging', true );
    cs.observer.trigger( 'kill' );

  	this.localIndex = this.collection.indexOf(child.model);

  	if ( _.isNull( this.localIndex ) && this.collection.length != 1 ) {
  		child.$el.before(cs.$indicator);
  	}

  	cs.$indicator.css({
  		height: child.$el.outerHeight()
  	});

  	child.$el.toggleClass( 'cs-dragging', true );
  	this.emptyClassCheck( true );

  },

  onChildviewDragEnd: function( child ) {

  	child.$el.toggleClass( 'cs-dragging', false );
  	cs.observer.trigger('kill:indicator');

  	if (this.localIndex == this.children.length - 1 ) {
  		this.$el.append(child.$el);
  	} else {
  		this.$el.children().eq(this.localIndex).before(child.$el);
  	}

  	this.emptyClassCheck();

  },

	setDragIndicator: function( y ) {
		cs.observer.trigger('kill:indicator');
		this.findDropIndex( y );
  	this.renderIndicator();
	},

	findDropIndex: function( y ) {

		var model = this.findClosest( y );
		var index;
		if ( _.isNull(model) ) {
			index = this.collection.length;
		} else {
			index = this.collection.indexOf( model );
		}

		if ( this.localIndex && index > this.localIndex || this.localIndex == 0 )
  		index--;

  	this.dropIndex = index;

	},

	renderIndicator: function() {

		if ( !_.isNull( this.localIndex ) && this.collection.length == 1 )
			return;

		if (this.dropIndex == 0 ) {
			this.$el.prepend(cs.$indicator);
			return;
		}

		if (this.dropIndex == ( ( _.isNull( this.localIndex ) ) ? this.collection.length : this.collection.length - 1 ) ) {
			this.$el.append(cs.$indicator);
  	} else {
  		if ( _.isNull( this.localIndex ) || this.localIndex > this.dropIndex ) {
				this.children.findByModel( this.collection.at( this.dropIndex ) ).$el.before(cs.$indicator);
			} else {
				this.children.findByModel( this.collection.at( this.dropIndex + 1 ) ).$el.before(cs.$indicator);
			}

  	}
	},

	findClosest: function( y ) {

		var columnBottom = this.$el.offset().top + this.$el.outerHeight();
		var top = this.$el.offset().top, bottom = 0, closest = null, prev = null, view = null;

		if ( this.collection.length == 1 ) {
			bottom = columnBottom;
			if ( y >= top && y <= bottom ) {
        if (y > ( top + ( bottom - top ) / 2 ) ) {
        	return null;
        } else {
        	return this.collection.first();
        }
      }
		}

    this.collection.each( _.bind( function( model, index ) {

    	view = this.children.findByModel( model );
    	if (view.$el.hasClass('cs-dragging')) {
    		return;
    	}

  		bottom = view.$el.offset().top + ( view.$el.outerHeight(true) / 2 ) + 45;

      if ( y >= top && y <= bottom ) {
        closest = model;
      }

      top = bottom;


      // We have to check both directions on the last iteration
      if ( index == this.collection.length - 1 ) {
      	bottom = columnBottom;

      	if ( y >= top && y <= bottom ) {
	        closest = null; // out of bounds
	      }
      }

    }, this ) );

    return closest;

	},









	onElementInit: function() {

	},

	onConstructElement: function( data ) {

		classes = [ 'x-column', 'x-sm' ];
		styles = {};

		classes.push( 'x-' + data.size.replace('/','-') );

		if ( 'none' != data.text_align ) {
			classes.push(data.text_align);
		}

		if ( _.isArray( padding = _.clone( data.padding ) ) ) {
			padding.pop();
			styles['padding'] = padding.join(' ');
		}

		if ( _.isArray( borderWidth = _.clone( data.border_width ) ) ) {
			borderWidth.pop();
			if ( _.unique(borderWidth) != '0px' ) {
				styles['border-width'] = borderWidth.join(' ');
				styles['border-color'] = data.border_color
				styles['border-style'] = data.border_style
			}
		}


		styles['background-color'] = ( '' != data.bg_color ) ? data.bg_color : 'transparent';

		if ( '' != data.id ) {
			this.$el.attr( 'id', data.id );
		}

		classes.push( data['class'] );
		this.$el.attr('class', classes.join(' '));
		delete classes;

		this.$el.removeAttr('style');
		this.$el.css(styles);

		if ( '' != data.style ) {
			this.$el.attr('style', this.$el.attr('style') + data.style );
		}

		this.emptyClassCheck();
	},

	onRenderEmpty: function() {
		return false;
	}

})
},{}],99:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	template: _.template('<div></div>'),

	remoteRender: false,

	minHeight: 10,

	initialize: function() {
		this.listenTo( this.model, 'change', this.render );
		this.boundWindowResize = _.bind( this.onAddedToColumn, this );
		Backbone.$(window).on( 'resize', this.boundWindowResize );
	},

	onDestroy: function( data ) {
		Backbone.$(window).off( 'resize', this.boundWindowResize );
	},

	onConstructElement: function( data ) {

		var classes, styles, visibility, customID, customStyle, size;
		$gap = this.$('div');

		classes = [ 'cs-empty-element', 'cs-gap' ];
		styles = {};

		classes = _.union( classes, data.visibility );

		if ( '' != data.id ) $gap.attr( 'id', data.id );

		classes.push(this.model.get('class'))
		$gap.attr('class', classes.join(' '));

		$gap.removeAttr('style');
		$gap.css(styles);

		if ( '' != data.style )
			$gap.attr('style', $gap.attr('style') + data.style );

		$gap.css({
			'padding' : data.gap_size + ' 0 0',
			'margin'  : 0,
			'height'  : 0
		});

		if ($gap.outerHeight() < this.minHeight) {
			$gap.css({'padding' : this.minHeight + 'px 0 0'});
		}

	},

	onAddedToColumn: function() {

		// Wait until other child views are rendered
		_.defer( _.bind( function(){

			$gap = this.$('div');

			var size = this.model.get('gap_size');

			$gap.css({
				'padding' : size + ' 0 0',
				'margin'  : 0,
				'height'  : 0
			});

			if ($gap.outerHeight() < this.minHeight) {
				$gap.css({'padding' : this.minHeight + 'px 0 0'});
			}
		}, this ) );

	}

});
},{}],100:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	// Stop "no container" from being detected as empty too early
	emptyDetection: function() {
		return false;
	},

	onAfterElementRender: function(){

		// Handle height preservation between renders to avoid flicker
		if( this.model.prevHeight ) {
			this.$('.cs-empty-element').height(this.model.prevHeight);
			this.model.prevHeight = false;
		}

		_.defer(_.bind( function() {

			$map = this.$('.x-map');
			if ($map.length > 0) {
				this.model.prevHeight = $map.outerHeight();
			}

		}, this ) );

	}
});
},{}],101:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	onAfterElementRender: function() {

	}

});
},{}],102:[function(require,module,exports){
module.exports = {

	'section' : require('./section'),
	'row'     : require('./row'),
	'column'  : require('./column'),

	'accordion'         : require('./accordion'),
	'alert'             : require('./alert'),
	'card'              : require('./card'),
	'row'               : require('./row'),
	'gap'               : require('./gap'),
	'google-map'        : require('./google-map'),
	'line'              : require('./line'),
	'slider'            : require('./slider'),
	'tabs'              : require('./tabs'),

	// 3rd party
	'gravity-forms'     : require('./gravity-forms'),
}
},{"./accordion":94,"./alert":95,"./card":97,"./column":98,"./gap":99,"./google-map":100,"./gravity-forms":101,"./line":103,"./row":104,"./section":105,"./slider":106,"./tabs":107}],103:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

  template: _.template('<hr class="x-hr">'),
  remoteRender: false,

  onRender: function() {

    var $line, classes, visibility, customID, customStyle;
    $line = this.$('hr');

    classes = [ 'x-hr' ];

    if (visibility = this.model.get('visibility')) {
      classes = _.union( classes, visibility );
    }

    classes.push(this.model.get('class'))
    $line.attr('class', classes.join(' '));

    customID = this.model.get('custom_id');
    if (customID) $line.attr( 'id', customID );

    $line.removeAttr('style');
    customStyle = this.model.get('style');
    if (customStyle) $line.attr('style', customStyle );

    // Replace margin with padding after this first render
    // This helps make the line clickable in the preview window
    _.defer(function(){

      $line.css({
        'paddingBottom' : $line.css('marginBottom'),
        'marginBottom' : '0'
      });

    })


  },

});
},{}],104:[function(require,module,exports){
module.exports = Cornerstone.ElementViews.Base.extend({

	remoteRender: false,
	draggable: false,

	filter: function (child, index, collection) {
    return ( child.get('_active') );
  },

  onConstructElement: function( data ) {

  	var classes, styles, visibility, textAlign, padding, margin, borderWidth, bgColor, customStyle, customID;

  	classes = [ 'x-container' ];
		styles = {};

		if ( data.inner_container ) {
			classes.push('max width')
		}

		classes = _.union( classes, data.visibility );

		if ( 'none' != data.text_align ) {
			classes.push(data.text_align);
		}

		if ( data.marginless_columns ) classes.push('marginless-columns');

		if ( _.isArray( padding = _.clone( data.padding ) ) ) {
			padding.pop();
			styles['padding'] = padding.join(' ');
		}

		if ( _.isArray( margin = _.clone( data.margin ) ) ) {
			margin.pop();
			styles['margin'] = margin.join(' ');
		}

		if ( _.isArray( borderWidth = _.clone( data.border_width ) ) ) {
			borderWidth.pop();
			if ( _.unique(borderWidth) != '0px' ) {
				styles['border-width'] = borderWidth.join(' ');
				styles['border-color'] = data.border_color
				styles['border-style'] = data.border_style
			}
		}

		bgColor = this.model.get('bg_color')
		styles['background-color'] = (bgColor) ? bgColor : 'transparent';


		if ( '' != data.id ) {
			this.$el.attr( 'id', data.id );
		}

		classes.push( data['class'] );
		this.$el.attr('class', classes.join(' '));
		delete classes;

		this.$el.removeAttr('style');
		this.$el.css(styles);

		if ( '' != data.style ) {
			this.$el.attr('style', this.$el.attr('style') + data.style );
		}

  }

});
},{}],105:[function(require,module,exports){
module.exports = Cornerstone.ElementViews.Base.extend({

	remoteRender: false,
	draggable: false,

	onElementInit: function() {

		this.lazyDetectColorContrast = _.debounce( _.bind( this.detectColorContrast, this ), 25 );
		this.lazyDetectImageContrast = _.debounce( _.bind( this.detectImageContrast, this ), 250 );

		this.contrast = {
			color: null,
			image: null,
			activeClass: null
		}

		this.listenTo( this.model, 'change:bg_color', function() {
			this.contrast.color = null;
		} );

		this.listenTo( this.model, 'change:bg_image', function() {
			this.contrast.image = null;
		} );
	},

	onConstructElement: function( data ) {

		var classes, styles, bgClass, padding, margin, borderWidth;
		this.$el.attr('id', 'x-section-' + (this.modelIndex + 1) );

		classes = [ 'x-section' ];
		styles = {};
		bgClass = '';

		if (this.contrastClass) {
			classes.push(this.contrastClass);
		}

		classes = _.union( classes, data.visibility );

		if ( 'none' != data.text_align ) {
			classes.push(data.text_align);
		}

		switch ( data.bg_type ) {
			case 'video':
				bgClass = 'bg-video';
				break;
			case 'image':

				// Set Background class
				bgClass = ( data.bg_pattern_toggle ) ? 'bg-pattern' : 'bg-image';
				if ( data.parallax ) classes.push( 'parallax' );
				if ( '' != data.bg_image ) styles['backgroundImage'] = 'url("' + data.bg_image +'")';
				if ( _.isNull( this.contrast.image ) ) this.lazyDetectImageContrast( data.bg_image, data.bg_color );
				if ( !_.isNull( this.contrast.activeClass) ) classes.push(this.contrast.activeClass);
				styles['background-color'] = ( '' != data.bg_color ) ? data.bg_color : 'transparent';

				break;
			case 'color':

				bgClass = 'bg-color';
				if ( _.isNull( this.contrast.image ) ) this.lazyDetectColorContrast( data.bg_color );
				if ( !_.isNull( this.contrast.activeClass) ) classes.push(this.contrast.activeClass);
				styles['background-color'] = ( '' != data.bg_color ) ? data.bg_color : 'transparent';

				break;

		}

		if ( bgClass ) classes.push(bgClass);

		if ( _.isArray( padding = _.clone( data.padding ) ) ) {
			padding.pop();
			styles['padding'] = padding.join(' ');
		}

		if ( _.isArray( margin = _.clone( data.margin ) ) ) {
			margin.pop();
			styles['margin'] = margin.join(' ');
		}

		if ( _.isArray( borderWidth = _.clone( data.border_width ) ) ) {
			borderWidth.pop();
			if ( _.unique(borderWidth) != '0px' ) {
				styles['border-width'] = borderWidth.join(' ');
				styles['border-color'] = data.border_color
				styles['border-style'] = data.border_style
			}
		}


		if ( '' != data.id ) {
			this.$el.attr( 'id', data.id );
		}

		classes.push( data['class'] );
		this.$el.attr('class', classes.join(' '));
		delete classes;

		this.$el.removeAttr('style');
		this.$el.css(styles);

		if ( '' != data.style ) {
			this.$el.attr('style', this.$el.attr('style') + data.style );
		}


		// Defer things that may depend on height.
		_.defer( _.bind( function(){
			if ( this.$el.hasClass('parallax') ) {
		    if ( Modernizr && Modernizr.touchevents ) {
		      this.$el.css('background-attachment', 'scroll');
		    } else {
		      if ( this.$el.hasClass('bg-image')   ) speed = 0.1;
		      if ( this.$el.hasClass('bg-pattern') ) speed = 0.3;
		      if ( speed ) this.$el.parallaxContentBand('50%', speed);
		    }
		  }

		  if ( this.$el.hasClass('bg-video') ) {
		  	this.$el.css({
		  		'background-image': 'url("' + data.bg_video_poster +'")',
		  		'background-color': 'white',
		  		'background-size':  'cover'
		  	});
		  }
	  }, this ) );
	},

	detectImageContrast: function( image, color ) {
		_.defer( _.bind( function(){

			if ( !image || image == '' ) {
				this.detectColorContrast( color );
				return;
			}

      window.RGBaster.colors( image, {
			  success: _.bind( function(payload) {
			    this.setContrastClass( payload.dominant );
			  }, this )
			});

    }, this ) );
	},

	detectColorContrast: function( color ) {
		if (!color || color == '')
			color = '#ffffff';
		this.setContrastClass( color );
	},

	setContrastClass:function( color ) {
		var source = new Cornerstone.Vendor.Color( color );
		var isDark = ( source.getDistanceLuminosityFrom( new Cornerstone.Vendor.Color( '#fff' ) ) > 10.5 );
		this.contrast.activeClass = ( isDark ) ? 'cs-bg-dark' : null;
		this.$el.toggleClass( 'cs-bg-dark', isDark );
	}

})
},{}],106:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({
	// emptyDetection: function() {
 //    // Prevent empty detection
 //  }
});
},{}],107:[function(require,module,exports){
module.exports =  Cornerstone.ElementViews.Base.extend({

	onClickBeforeInspect: function( e ) {
		$target = jQuery(e.target);
		if ( $target.attr('data-toggle') == 'tab' ) {
			jQuery.fn.tab.call( $target, 'show');
		}
	},

});
},{}],108:[function(require,module,exports){
module.exports = CS.Mn.CollectionView.extend({
	childView: require('./settings-section'),
	events: {
		'click .cs-pane-section-toggle': 'toggle'
	},
	toggle: function( e ) {

		var $target = this.$( e.currentTarget );
		var $section = $target.next('.cs-pane-section')

		if ( $target.hasClass('active') ) {
      $target.removeClass('active');
      $section.slideUp('fast');
      cs.navigate.trigger( 'scrollbar:update' );
      return;
    }


  	this.$('.cs-pane-section-toggle').removeClass('active');
    $target.addClass('active');
    cs.navigate.trigger( 'scrollbar:update' );
    $section.slideDown('fast');
    this.$('.cs-pane-section').not('.constant').not($section).slideUp('fast');

  }
});
},{"./settings-section":110}],109:[function(require,module,exports){
var ControlListView = require('../controls/control-collection');
var SettingsCollectionView = require('./settings-collection');
module.exports = CS.Mn.LayoutView.extend({

	template: 'settings/content',

	regions: {
    Controls: '#controls',
    Sections: '#sections'
  },

  initialize: function() {

  },

  onBeforeShow: function() {

  	this.Controls.show( new ControlListView( {
  		collection: cs.component('settings').getPrimaryControls(),
  	}));

  	this.Sections.show( new SettingsCollectionView( {
  		collection: cs.component('settings').getSettings()
  	}));

  }

});
},{"../controls/control-collection":37,"./settings-collection":108}],110:[function(require,module,exports){
module.exports = CS.Mn.CompositeView.extend({
	template: 'settings/section',
	className: 'cs-settings-section',
	childViewContainer: 'ul.cs-controls',
	getChildView: function( item ) { return cs.controlLookup(item.get('type')); },

	initialize: function() {
		this.collection = this.model.inspect.controls;
	},

	onRender: function() {
		if ( this.collection.isEmpty() )
			this.$el.addClass('empty');
	},

	serializeData: function() {

		return _.extend( CS.Mn.CompositeView.prototype.serializeData.apply(this,arguments), {
			_section_title: this.model.section.get('ui').title
		});

	}
});
},{}],111:[function(require,module,exports){
var ViewBasePane = require('../main/base-pane');
var SettingsContentView = require('./settings-content');
var ControlListView = require('../controls/control-collection');
module.exports = ViewBasePane.extend({

	name: 'settings',

  initialize: function() {
  	this.listenTo( cs.global, 'settings:ready', this.onShowContent );
  },

  onShowContent: function() {
  	this.Content.show( ( cs.data.request( 'settings:ready' ) ) ? new SettingsContentView() : this.getLoadingView() );
  },

  getLoadingView: function() {
    return new CS.Mn.ItemView( {
      tagName: 'ul',
      className: 'cs-controls empty',
      template: _.template("<li class=\"cs-control-empty\"><span class=\"title\"><%= l18n('settings-loading') %></span></li>")
    } );
  },

  onOpenSubItem: function() {

  	this.Sub.show( new ControlListView( {
  		collection: cs.component('inspector').getSecondaryControls(),
  	}));

  }

});
},{"../controls/control-collection":37,"../main/base-pane":87,"./settings-content":109}],112:[function(require,module,exports){
module.exports = CS.Mn.CompositeView.extend( {

	remoteRender: true,
	template: 'main/skeleton-item',
	childViewContainer: '.cs-skeleton-container',
	className: 'cs-skeleton-item',
	draggable: true,

	attributes: function() {
		return { 'draggable': _.result( this, 'draggable' ) };
	},

	events: function() {

		var events = {
		};

		var inspectable = _.result( this, 'inspectable' )
		if ( inspectable || _.isUndefined( inspectable ) ) {

			events = _.extend( events, {
				'click': '_click',
				'mouseover': '_observeStart',
				'mouseout': '_observeEnd'
			}, {} );

		}

		var draggable = _.result( this, 'draggable' )
		if ( draggable || _.isUndefined( draggable ) ) {

			events = _.extend( events, {
				'dragstart.h5s': '_dragStart',
				'dragend.h5s': '_dragEnd',
			} );

		}

		return _.extend( events, _.result( this, 'elementEvents' ) || {} );
	},

	getChildView: function( item ) {
		return cs.component('view-loader').skeletonLookup( item.get('_type') );
	},

	constructor: function( options ) {

		CS.Mn.CompositeView.apply(this, arguments);

		this.collection = this.model.elements;
		this.listenTo( this.collection, 'sort', this.render );

		if ( this.model.collection )
			this.modelIndex = this.model.collection.indexOf( this.model );

	},

	serializeData: function() {

		var text;

		switch ( this.model.get('_type')  ) {
      case 'section':
        text = cs.l18n('section-format').replace('%s', this.model.get('title') );
        break;
      case 'row':
        text = cs.l18n('row-numeric').replace('%s', this.model.getIndex() + 1 );
        break;
      case 'column':
        text = cs.l18n('column-format').replace('%s', this.model.get('size') );
        break;
      default:
      	text = this.model.definition.get('ui').title;
      	break;
    }

    this.tooltipText = text;

		return _.extend( CS.Mn.CompositeView.prototype.serializeData.apply( this, arguments ), {
			handleText: text
		} );
	},

	// serializeData: function() {
	// 	var base = CS.Mn.CompositeView.prototype.serializeData.apply(this,arguments);
	// 	var elementData = _.result( this, 'elementData' ) || {};
	// 	return _.defaults( _.extend( base, elementData ), this.model.getDefaults() );
	// },

  _click: function( e ) {
		this.triggerMethod('click:before:inspect', e );
		e.stopPropagation();
		cs.global.trigger( 'inspect', this.model )
  },

	_dragStart: function( e ) {
		this._setData(e);
		_.defer( _.bind( this.triggerMethod, this), 'drag:start', e )
	},

	_dragEnd: function( e ) {
		cs.preview.trigger( 'dragging', false );
		if ( e.originalEvent ) this.triggerMethod( 'drag:end', e );
	},

	_observeStart: function( e ) {
		e.stopPropagation();
		this.model.trigger( 'observe:start' );
  },

  _observeEnd: function( e ) {
  	this.model.trigger('observe:end');
  },

  _emptyDetection: function() {

  	if ( this.model.definition.get('flags').empty ) {
  		return false; // detection handled server side, but aborted here.
  	}

    return ( this.$el.shadowHeight() < 1 );

  },

  _setData: function ( e ) {

		var dataTransfer = e.originalEvent.dataTransfer;
    dataTransfer.effectAllowed = 'copy';
    var data = JSON.stringify({
			action: 'move',
    	id: this.model.cid,
    });

    cs.preview.replyOnce( 'cache:'+ this.model.cid, this.model );
    dataTransfer.setData( 'cornerstone/element', data );

	}

} );
},{}],113:[function(require,module,exports){
module.exports = Cornerstone.SkeletonViews.Base.extend({
	draggable: false
});
},{}],114:[function(require,module,exports){
module.exports = {
	'section' : require('./section'),
	'row'     : require('./row'),
	'column'  : require('./column'),
}
},{"./column":113,"./row":115,"./section":116}],115:[function(require,module,exports){
module.exports = Cornerstone.SkeletonViews.Base.extend({
	draggable: false,

	filter: function (child, index, collection) {
    return ( child.get('_active') );
  }

});
},{}],116:[function(require,module,exports){
arguments[4][113][0].apply(exports,arguments)
},{"dup":113}],117:[function(require,module,exports){
var templates={};templates['controls/base']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/base ;
__p += '\n';
 if ( ui.title ) { ;
__p += '\n<div class="cs-control-header">\n  <label ';
 if ( ui.tooltip ) { ;
__p += ' data-tooltip-message="' +
((__t = ( ui.tooltip )) == null ? '' : __t) +
'" ';
 } ;
__p += '>' +
((__t = ( ui.title )) == null ? '' : __t) +
'</label>\n</div>\n';
 } ;
__p += '\n<input type="hidden" value="">\n' +
((__t = ( render( controlTemplate, arguments[0] ) )) == null ? '' : __t) +
'\n';
 if ( ui.message ) { ;
__p += '\n<div class="cs-control-footer">\n  <span>' +
((__t = ( ui.message )) == null ? '' : __t) +
'</span>\n</div>\n';
 } ;


}
return __p
};templates['controls/choose']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/choose ;
__p += '\n<ul class="cs-choose cols-' +
((__t = ( options.columns )) == null ? '' : __t) +
'">\n	';
 _.each( options.choices, function(item) { ;
__p += '\n  <li data-choice="' +
((__t = ( item.value )) == null ? '' : __t) +
'">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( item.icon )) == null ? '' : __t) +
'" ';
 if (item.tooltip) { ;
__p += 'title="' +
((__t = ( item.tooltip )) == null ? '' : __t) +
'"';
 } ;
__p += '></i>\n    ';
 if (item.label) { ;
__p += '<span>' +
((__t = ( item.label )) == null ? '' : __t) +
'</span>';
 } ;
__p += '\n  </li>\n  ';
 }); ;
__p += '\n</ul>';

}
return __p
};templates['controls/color']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/color ;
__p += '\n<input type="text" class=\'cs-color-input\'/>';

}
return __p
};templates['controls/column-layout']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/column-layout ;
__p += '\n<ul class="cs-column-layout">\n  <li class="prefab" data-layout="1/1"><span class="cs-1-1">1/1</span></li>\n  <li class="prefab" data-layout="1/2 + 1/2"><span class="cs-1-2">1/2</span><span class="cs-1-2">1/2</span></li>\n  <li class="prefab" data-layout="1/3 + 2/3" ><span class="cs-1-3">1/3</span><span class="cs-2-3">2/3</span></li>\n  <li class="prefab" data-layout="2/3 + 1/3"><span class="cs-2-3">2/3</span><span class="cs-1-3">1/3</span></li>\n  <li class="prefab" data-layout="1/3 + 1/3 + 1/3"><span class="cs-1-3">1/3</span><span class="cs-1-3">1/3</span><span class="cs-1-3">1/3</span></li>\n  <li class="prefab" data-layout="1/4 + 1/4 + 1/4 + 1/4"><span class="cs-1-4">1/4</span><span class="cs-1-4">1/4</span><span class="cs-1-4">1/4</span><span class="cs-1-4">1/4</span></li>\n  <li class="prefab" data-layout="1/5 + 1/5 + 1/5 + 1/5 + 1/5"><span class="cs-1-5">1/5</span><span class="cs-1-5">1/5</span><span class="cs-1-5">1/5</span><span class="cs-1-5">1/5</span><span class="cs-1-5">1/5</span></li>\n  <li class="custom"><span class="cs-1-1 custom"><span>' +
((__t = ( cs.l18n('columns-layout-custom') )) == null ? '' : __t) +
'</span></span></li>\n</ul>\n<input type="text" id="column-layout" value="' +
((__t = ( _column_layout )) == null ? '' : __t) +
'">';

}
return __p
};templates['controls/column-order-item']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/column-layout ;
__p += '\n<span class="handle"><span>' +
((__t = ( size )) == null ? '' : __t) +
'</span></span>';

}
return __p
};templates['controls/column-order']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/column-order ;
__p += '\n<ul class="cs-column-order"></ul>';

}
return __p
};templates['controls/custom-markup']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p +=
((__t = ( message )) == null ? '' : __t);

}
return __p
};templates['controls/default']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/default ;
__p += '\n<span>' +
((__t = ( debug('Control <strong>' + controlType + '</strong> could not be found.') )) == null ? '' : __t) +
'</span>';

}
return __p
};templates['controls/dimensions']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/dimensions ;
__p += '\n<ul class="cs-dimensions">\n  <li><input data-edge="top"    type="text"><span>Top</span></li>\n  <li><input data-edge="right"  type="text"><span>Right</span></li>\n  <li><input data-edge="bottom" type="text"><span>Bottom</span></li>\n  <li><input data-edge="left"   type="text"><span>Left</span></li>\n  <li>\n    <button class="cs-link-dimensions">\n      <i class="cs-icon link" data-cs-icon="&#xf0c1;" title="' +
((__t = ( l18n('dimensions-unlink') )) == null ? '' : __t) +
'"></i>\n      <i class="cs-icon unlink" data-cs-icon="&#xf127;" title="' +
((__t = ( l18n('dimensions-link') )) == null ? '' : __t) +
'"></i>\n    </button>\n  </li>\n</ul>';

}
return __p
};templates['controls/expand-control-button']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/expand-control-button ;
__p += '\n<button class="cs-expand-control">\n  <span class="dashicons dashicons-editor-expand"></span>' +
((__t = ( cs.l18n('expand-control') )) == null ? '' : __t) +
'\n</button>';

}
return __p
};templates['controls/icon-choose-item']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<li title="' +
((__t = ( choice )) == null ? '' : __t) +
'" data-choice="' +
((__t = ( choice )) == null ? '' : __t) +
'" data-choices="' +
((__t = ( choices )) == null ? '' : __t) +
'"><i class="cs-icon" data-cs-icon="&#x' +
((__t = ( code )) == null ? '' : __t) +
'"></i></li>';

}
return __p
};templates['controls/icon-choose']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/icon-choose ;
__p += '\n<div class="cs-icons-outer">\n	<div class="cs-search-section">\n		<div class="cs-search">\n			<input class="cs-search-input" type="search" placeholder="Search Icons">\n			<i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('search'))) == null ? '' : __t) +
'"></i>\n		</div>\n	</div>\n	<div class="cs-icons-inner">\n	<ul class="cs-choose cols-5 single"></ul>\n	</div>\n</div>';

}
return __p
};templates['controls/image']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/image ;
__p += '\n<div class="cs-image">\n	<i class="cs-icon add" data-cs-icon="' +
((__t = ( fontIcon('plus-circle') )) == null ? '' : __t) +
'"></i>\n	<i class="cs-icon remove" data-cs-icon="' +
((__t = ( fontIcon('times-circle') )) == null ? '' : __t) +
'"></i>\n</div>';

}
return __p
};templates['controls/info-box']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if ( ui.title ) { ;
__p += '<h4>' +
((__t = ( ui.title )) == null ? '' : __t) +
'</h4>';
 } ;
__p += '\n';
 if ( ui.message ) { ;
__p += '<p>' +
((__t = ( ui.message )) == null ? '' : __t) +
'</p>';
 } ;


}
return __p
};templates['controls/number']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/number ;
__p += '\n<div>\n	<input type="number" value="">\n	';
 if (options.units) { ;
__p += '\n		<span>' +
((__t = ( options.units )) == null ? '' : __t) +
'</span>\n	';
 } ;
__p += '\n</div>';

}
return __p
};templates['controls/select']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/select ;
__p += '\n<select>\n	';
 _.each( options.choices, function(item) { ;
__p += '\n		<option value="' +
((__t = ( item.value )) == null ? '' : __t) +
'" >' +
((__t = ( item.label )) == null ? '' : __t) +
'</option>\n	';
 }); ;
__p += '\n</select>';

}
return __p
};templates['controls/sortable-empty']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //controls/sortable-empty ;
__p += '\n<span class="handle"><i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('plus-square') )) == null ? '' : __t) +
'"></i> <span>Add</span></span>';

}
return __p
};templates['controls/sortable-item-wide']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //controls/sortable-item-ext ;
__p += '\n<span class="handle">' +
((__t = ( title )) == null ? '' : __t) +
'</span>\n<div class="controls">\n  <button class="action1 cs-icon" data-cs-icon="' +
((__t = ( fontIcon( actions[0].icon ) )) == null ? '' : __t) +
'" title="' +
((__t = ( actions[0].tooltip )) == null ? '' : __t) +
'"></button>\n  <button class="action2 cs-icon" data-cs-icon="' +
((__t = ( fontIcon( actions[1].icon ) )) == null ? '' : __t) +
'" title="' +
((__t = ( actions[1].tooltip )) == null ? '' : __t) +
'"></button>\n</div>\n<div class="controls extra">\n  <button class="action3 cs-icon" data-cs-icon="' +
((__t = ( fontIcon( actions[2].icon ) )) == null ? '' : __t) +
'" title="' +
((__t = ( actions[2].tooltip )) == null ? '' : __t) +
'"></button>\n</div>';

}
return __p
};templates['controls/sortable-item']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //controls/sortable-item ;
__p += '\n<span class="handle">' +
((__t = ( title )) == null ? '' : __t) +
'</span>\n<div class="controls">\n  <button class="action1 cs-icon" data-cs-icon="' +
((__t = ( fontIcon( actions[0].icon ) )) == null ? '' : __t) +
'" title="' +
((__t = ( actions[0].tooltip )) == null ? '' : __t) +
'"></button>\n  <button class="action2 cs-icon" data-cs-icon="' +
((__t = ( fontIcon( actions[1].icon ) )) == null ? '' : __t) +
'" title="' +
((__t = ( actions[1].tooltip )) == null ? '' : __t) +
'"></button>\n</div>';

}
return __p
};templates['controls/sortable']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="cs-sortable"></ul>\n';
 if (canAdd && !empty) { ;
__p += '\n<button class="cs-add-sortable-item">\n  <i class="cs-icon" data-cs-icon="&#xf0fe;"></i>\n  <span>' +
((__t = ( cs.l18n('sortable-add') )) == null ? '' : __t) +
'</span>\n</button>\n';
 } ;


}
return __p
};templates['controls/template-select']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/template-select ;
__p += '\n<select>\n	';
 _.each( options.choices, function(item) { ;
__p += '\n		<option value="' +
((__t = ( item.value )) == null ? '' : __t) +
'">' +
((__t = ( item.label )) == null ? '' : __t) +
'</option>\n	';
 }); ;
__p += '\n</select>\n<button class="' +
((__t = ( options.templateType )) == null ? '' : __t) +
'">' +
((__t = ( ui.buttonText )) == null ? '' : __t) +
'</button>';

}
return __p
};templates['controls/text']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/text ;
__p += '\n<input ' +
((__t = ( (options.monospace) ? "style=\"font-family:monospace;\"" : "" )) == null ? '' : __t) +
' type="text" value="">';

}
return __p
};templates['controls/textarea']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/textarea ;
__p += '\n<textarea ' +
((__t = ( (options.monospace) ? "style=\"font-family:monospace;\"" : "" )) == null ? '' : __t) +
'></textarea>\n';
 if (options.expandable) { print(render( 'controls/expand-control-button' )) } ;
__p += '\n';

}
return __p
};templates['controls/title']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="cs-title ';
 if (options.showInspectButton) { ;
__p += 'inspectable';
 } ;
__p += '">\n	<input type="text" class="cs-title-input" value="' +
((__t = ( title )) == null ? '' : __t) +
'"></input>\n	';
 if (options.showInspectButton) { ;
__p += '\n	<button class="cs-title-button" title="' +
((__t = ( l18n('tooltip-inspect') )) == null ? '' : __t) +
'"><i class="cs-icon" data-cs-icon="&#xf002;"></i></button>\n	';
 } ;
__p += '\n</div>';

}
return __p
};templates['controls/toggle']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/toggle ;
__p += '\n<ul class="cs-toggle">\n  <li class="on"><span>' +
((__t = ( l18n('controls-on') )) == null ? '' : __t) +
'</span></li>\n  <li class="off"><span>' +
((__t = ( l18n('controls-off') )) == null ? '' : __t) +
'</span></li>\n</ul>';

}
return __p
};templates['controls/wpselect']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/controls/select ;
__p += '\n<div class="cs-wp-select"></div>';

}
return __p
};templates['extra/confirm']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/extra/confirm ;
__p += '\n<div class="' +
((__t = ( contentClass )) == null ? '' : __t) +
'">\n	';
 if ( message ) { ;
__p += '<p class="message">' +
((__t = ( message )) == null ? '' : __t) +
'</p>';
 } ;
__p += '\n  ';
 if ( yep )  { ;
__p += '<button class="action yep sad">' +
((__t = ( yep )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n  ';
 if ( nope ) { ;
__p += '<button class="action nope">' +
((__t = ( nope )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n  ';
 if ( subtext ) { ;
__p += '<p class="subtext">' +
((__t = ( subtext )) == null ? '' : __t) +
'</p>';
 } ;
__p += '\n</div>';

}
return __p
};templates['extra/expanded-control']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-expanded-content-inner"></div>\n<button class="cs-expanded-close">&times;</button>';

}
return __p
};templates['extra/home']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/extra/home ;
__p += '\n<p class="saved-last ' +
((__t = ( savedLastClass )) == null ? '' : __t) +
'">' +
((__t = ( savedLastMessage )) == null ? '' : __t) +
'</p>\n<ul class="cs-controls">\n  <li class="cs-control cs-control-actions">\n    <ul class="cs-actions">\n      <li class="action new">\n        <a href="' +
((__t = ( dashboardEditUrl )) == null ? '' : __t) +
'">\n          <i class="cs-icon" data-cs-icon="&#xf19a;"></i>\n          <span>' +
((__t = ( l18n('home-dashboard') )) == null ? '' : __t) +
'</span>\n        </a>\n      </li>\n      <li class="action templates">\n        <a href="' +
((__t = ( frontEndUrl )) == null ? '' : __t) +
'">\n          <i class="cs-icon" data-cs-icon="&#xf14c;"></i>\n          <span>' +
((__t = ( l18n('home-view-site') )) == null ? '' : __t) +
'</span>\n        </a>\n      </li>\n    </ul>\n  </li>\n</ul>';

}
return __p
};templates['extra/options']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/extra/options ;
__p += '\n';

}
return __p
};templates['extra/respond']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/extra/respond ;
__p += '\n<div class="cs-respond-buttons">\n  <button class="cs-icon xl" data-respond="100%" data-cs-icon="' +
((__t = ( cs.fontIcon('desktop') )) == null ? '' : __t) +
'"></button>\n  <button class="cs-icon lg" data-respond="1199px" data-cs-icon="' +
((__t = ( cs.fontIcon('laptop') )) == null ? '' : __t) +
'"></button>\n  <button class="cs-icon md" data-respond="979px" data-cs-icon="' +
((__t = ( cs.fontIcon('tablet') )) == null ? '' : __t) +
'"></button>\n  <button class="cs-icon sm" data-respond="767px" data-cs-icon="' +
((__t = ( cs.fontIcon('tablet') )) == null ? '' : __t) +
'"></button>\n  <button class="cs-icon xs" data-respond="480px" data-cs-icon="' +
((__t = ( cs.fontIcon('mobile') )) == null ? '' : __t) +
'"></button>\n</div>\n<div class="cs-respond-labels">\n  <div class="xl" data-respond="100%"><i class="cs-icon" data-cs-icon="' +
((__t = ( cs.fontIcon('desktop') )) == null ? '' : __t) +
'"></i><span class="label">Extra Large</span><span class="size">1200px &amp; Up</span></div>\n  <div class="lg" data-respond="1199px"><i class="cs-icon" data-cs-icon="' +
((__t = ( cs.fontIcon('laptop') )) == null ? '' : __t) +
'"></i><span class="label">Large</span><span class="size">980px &ndash; 1199px</span></div>\n  <div class="md" data-respond="979px"><i class="cs-icon" data-cs-icon="' +
((__t = ( cs.fontIcon('tablet') )) == null ? '' : __t) +
'"></i><span class="label">Medium</span><span class="size">768px &ndash; 979px</span></div>\n  <div class="sm" data-respond="767px"><i class="cs-icon" data-cs-icon="' +
((__t = ( cs.fontIcon('tablet') )) == null ? '' : __t) +
'"></i><span class="label">Small</span><span class="size">481px &ndash; 767px</span></div>\n  <div class="xs" data-respond="480px"><i class="cs-icon" data-cs-icon="' +
((__t = ( cs.fontIcon('mobile') )) == null ? '' : __t) +
'"></i><span class="label">Extra Small</span><span class="size">480px &amp; Smaller</span></div>\n</div>';

}
return __p
};templates['extra/save-complete']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/extra/save-complete ;
__p += '\n<p class="message">' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n';

}
return __p
};templates['layout/actions']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="cs-actions">\n  <li class="action new">\n    <i class="cs-icon" data-cs-icon="&#xf0fe;"></i>\n    <span>' +
((__t = ( l18n('layout-add-section') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action templates">\n    <i class="cs-icon" data-cs-icon="&#xf15b;"></i>\n    <span>' +
((__t = ( l18n('layout-templates') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>';

}
return __p
};templates['inspector/blank-state']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/inspector/blank-state ;
__p += '\n' +
((__t = ( cs.icon('logo-flat-custom') )) == null ? '' : __t) +
'\n<span class="title">Nothing Selected</span>\n<span>Click on an element in the site preview to begin inspecting it.</span>';

}
return __p
};templates['inspector/breadcrumbs']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if ( count > 0 ) { ;
__p += '\n  <button data-level="0" ';
 if ( items.length == 1 ) { print('class="disabled"') } ;
__p += '>';
 print((items.length == 1) ? _.first( items ).title : _.first( items ).label ) ;
__p += '</button>\n  ';
 _.each( _.rest( items ), function(item,index) { ;
__p += '\n  	<span><i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon( (rtl) ? 'angle-left' : 'angle-right' ) )) == null ? '' : __t) +
'"></i></span>\n  	<button ';
 if ( count == index+2 ) { print('class="disabled"') } ;
__p += ' data-level="' +
((__t = ( index + 1 )) == null ? '' : __t) +
'" >' +
((__t = ( item.label )) == null ? '' : __t) +
'</button>\n  ';
 }) ;
__p += '\n';
 } ;


}
return __p
};templates['inspector/column-actions']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="cs-actions">\n  <li class="action manage-layout">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('bars') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('inspector-manage-layout') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action erase">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('eraser') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('inspector-erase') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>';

}
return __p
};templates['inspector/element-actions']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="cs-actions">\n  <li class="action duplicate">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('copy') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('inspector-duplicate') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action delete">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('trash-o') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('inspector-delete') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>';

}
return __p
};templates['inspector/row-actions']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="cs-actions">\n  <li class="action manage-layout">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('bars') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('inspector-manage-layout') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action delete">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('trash-o') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('inspector-delete') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>';

}
return __p
};templates['library/element-stub']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/library/element-stub ;
__p += '\n<span class="icon">' +
((__t = ( icon )) == null ? '' : __t) +
'</span>\n<span class="name"><span>' +
((__t = ( ui.title )) == null ? '' : __t) +
'</span></span>';

}
return __p
};templates['library/search']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-search-section">\n  <div class="cs-search">\n    <input type="search" placeholder="' +
((__t = ( l18n('elements-search') )) == null ? '' : __t) +
'" id="elements-search">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('search') )) == null ? '' : __t) +
'"></i>\n  </div>\n</div>';

}
return __p
};templates['main/editor']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/main/editor ;
__p += '\n<header id="header" class="cs-editor-header"></header>\n<section id="pane"></section>\n<div id="skeleton" class="cs-editor-skeleton"></div>\n<footer id="footer" class="cs-editor-footer"></footer>\n<div id="expand" class="cs-editor-expansion"></div>';

}
return __p
};templates['main/extra']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-editor-extra">\n	<div class="cs-tooltip-outer"><div class="cs-tooltip-inner"></div></div>\n</div>';

}
return __p
};templates['main/footer']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/main/footer ;
__p += '\n<nav>\n  <button class="collapse cs-icon" data-cs-icon="' +
((__t = ( fontIcon('play-circle') )) == null ? '' : __t) +
'"></button>\n  <button class="home cs-icon" data-cs-icon="' +
((__t = ( fontIcon('home') )) == null ? '' : __t) +
'"></button>\n  <button class="options cs-icon" data-cs-icon="' +
((__t = ( fontIcon('toggle-on') )) == null ? '' : __t) +
'"></button>\n  <button class="respond cs-icon" data-cs-icon="' +
((__t = ( fontIcon('mobile') )) == null ? '' : __t) +
'"></button>\n  <button class="save">' +
((__t = ( l18n('footer-button-save') )) == null ? '' : __t) +
'</button>\n</nav>\n<div class="cs-editor-extra">\n  <div class="cs-tooltip-outer"><div class="cs-tooltip-inner"></div></div>\n</div>';

}
return __p
};templates['main/header']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/main/header ;
__p += '\n<button class="layout">' +
((__t = ( getIcon('nav-layout-solid') )) == null ? '' : __t) +
'</button>\n<button class="elements">' +
((__t = ( getIcon('nav-elements-solid') )) == null ? '' : __t) +
'</button>\n<button class="inspector">' +
((__t = ( getIcon('nav-inspector-solid') )) == null ? '' : __t) +
'</button>\n<button class="settings">' +
((__t = ( getIcon('nav-settings-solid') )) == null ? '' : __t) +
'</button>';

}
return __p
};templates['main/pane']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( heading )) == null ? '' : __t) +
'</h2>\n<div class="cs-pane-content-outer">\n	';
 if ( paneTemplate ) { ;
__p += '\n		' +
((__t = ( render( paneTemplate, arguments[0] ) )) == null ? '' : __t) +
'\n	';
 } ;
__p += '\n  <div id="content" class="cs-pane-content-inner" style="right:0px;"></div>\n</div>\n<div class="cs-builder-sub ' +
((__t = ( name )) == null ? '' : __t) +
'">\n  <button class="cs-builder-sub-back">\n    <i class="cs-icon" data-cs-icon="&#xf053;"></i> <span>' +
((__t = ( returnButtonText )) == null ? '' : __t) +
'</span>\n  </button>\n  <div class="cs-pane-content-outer">\n  	<div id="sub" class="cs-pane-content-inner"></div>\n  </div>\n</div>\n\n\n';

}
return __p
};templates['main/skeleton-item']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<span class="cs-skeleton-title ' +
((__t = ( _type )) == null ? '' : __t) +
'" >' +
((__t = ( handleText )) == null ? '' : __t) +
'</span>\n<div class="cs-skeleton-container"></div>';

}
return __p
};templates['main/skeleton']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<h2>Skeleton Mode</h2>\n<div class="cs-skeleton-content-outer">\n	<div class="cs-skeleton-content-inner"></div>\n</div>';

}
return __p
};templates['settings/actions']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="cs-actions">\n  <li class="action css">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('paint-brush') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('settings-css-editor') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action js">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('code') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('settings-js-editor') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>';

}
return __p
};templates['settings/content']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/settings/page-settings ;
__p += '\n<div id="controls"></div>\n<div id="sections"></div>';

}
return __p
};templates['settings/section']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<h3 class="cs-pane-section-toggle">' +
((__t = ( _section_title )) == null ? '' : __t) +
'</h3>\n<div class="cs-pane-section">\n	<ul class="cs-controls"></ul>\n</div>';

}
return __p
};templates['utility/htmlhint']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<p>' +
((__t = ( l18n('htmlhint-intro') )) == null ? '' : __t) +
'</p>\n<ul>';
 _.each( errors, function(item) { ;
__p += '\n  <li>' +
((__t = ( l18n('htmlhint-' + item ) )) == null ? '' : __t) +
'</li>\n';
 }); ;
__p += '</ul>';

}
return __p
};templates['layout/sub-row/layout-sub-row']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/layout/sub-row/layout-sub-row ;
__p += '\n<div id="layout-row-controls" class="cs-pane-section controls"></div>\n<div id="layout-column-controls" class="cs-pane-section controls"></div>';

}
return __p
};templates['layout/sub-templates/layout-sub-template']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //builder/layout/sub-templates/layout-sub-templates ;
__p += '\n<div id="layout-template-controls" class="cs-pane-section controls"></div>\n<div id="layout-template-sections" class="cs-pane-section sections"></div>';

}
return __p
};templates['layout/sub-templates/save-dialog']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-title">\n	<input type="text" class="cs-title-input" value="' +
((__t = ( title )) == null ? '' : __t) +
'"></input>\n</div>\n<ul class="cs-actions">\n  <li class="action download">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('download') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('templates-download') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action save">\n    <i class="cs-icon" data-cs-icon="' +
((__t = ( fontIcon('book') )) == null ? '' : __t) +
'"></i>\n    <span>' +
((__t = ( l18n('templates-save-library') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>\n<button class="close">&times;</button>';

}
return __p
};templates['layout/sub-templates/template-actions']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="cs-actions">\n  <li class="action save">\n    <i class="cs-icon" data-cs-icon="&#xf0c7;"></i>\n    <span>' +
((__t = ( l18n('templates-save') )) == null ? '' : __t) +
'</span>\n  </li>\n  <li class="action upload">\n    <i class="cs-icon" data-cs-icon="&#xf093;"></i>\n    <span>' +
((__t = ( l18n('templates-upload') )) == null ? '' : __t) +
'</span>\n  </li>\n</ul>';

}
return __p
};templates['layout/sub-templates/upload-dialog']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<input id="template-upload" type="file" name="blockUpload"/>\n<button class="process">' +
((__t = ( l18n('templates-upload-button') )) == null ? '' : __t) +
'</button>\n<button class="close">&times;</button>';

}
return __p
};module.exports=templates;
},{}],118:[function(require,module,exports){
var templates={};templates['dragging-placeholder']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-dragging-placeholder">\n	<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n	  <g>\n	    <path d="M-275,395.9l12-6.4l-11.5-6c-0.3-0.2-0.6-0.2-0.9,0l-11.6,6.1L-275,395.9z"/>\n	    <path d="M-274,397.5v12.7l11.4-6.1c0.3-0.2,0.5-0.5,0.5-0.9v-12.1L-274,397.5z"/>\n	    <path d="M-276,397.5l-11.9-6.3v12.1c0,0.4,0.2,0.7,0.5,0.9l11.4,6V397.5z"/>\n	  </g>\n	</svg>\n</div>';

}
return __p
};templates['empty-column']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // elements/empty-column ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-275,395.9l12-6.4l-11.5-6c-0.3-0.2-0.6-0.2-0.9,0l-11.6,6.1L-275,395.9z"/>\n    <path d="M-274,397.5v12.7l11.4-6.1c0.3-0.2,0.5-0.5,0.5-0.9v-12.1L-274,397.5z"/>\n    <path d="M-276,397.5l-11.9-6.3v12.1c0,0.4,0.2,0.7,0.5,0.9l11.4,6V397.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['empty-element']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-empty-element">\n  <div class="cs-empty-element-icon">\n    ' +
((__t = ( cs.icon("element-" + _type ) )) == null ? '' : __t) +
'\n  </div>\n</div>';

}
return __p
};templates['empty-rows']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // elements/empty-rows ;
__p += '\n' +
((__t = ( cs.icon('logo-flat-custom') )) == null ? '' : __t) +
'\n<h2>Welcome to Cornerstone</h2>\n<p>Get started by adding sections to the <strong class="cs-empty-rows-layout">' +
((__t = ( cs.icon('nav-layout-solid') )) == null ? '' : __t) +
'Layout</strong> pane in the sidebar or begin with a template. Click on your sections to add rows and alter column structure, then go to the <strong class="cs-empty-rows-elements">' +
((__t = ( cs.icon('nav-elements-solid') )) == null ? '' : __t) +
'Elements</strong> pane and begin dragging in your items. Clicking on any element in the preview area takes you to the <strong class="cs-empty-rows-inspector">' +
((__t = ( cs.icon('nav-inspector-solid') )) == null ? '' : __t) +
'Inspector</strong> pane to alter its appearance. Happy building!</p>';

}
return __p
};templates['loading']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // elements/loading ;
__p += '\n<div class="cs-empty-element">\n  <div class="cs-empty-element-icon">\n    <i class="cs-icon cs-icon-loading" data-cs-icon="&#xf110;"></i>\n  </div>\n</div>';

}
return __p
};templates['observer']=function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="cs-observer-tooltip top left">' +
((__t = ( tooltip )) == null ? '' : __t) +
'</div>';

}
return __p
};module.exports=templates;
},{}],119:[function(require,module,exports){
var templates={};templates['element-accordion']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-accordion ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-264,385h-22c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-5C-263,385.4-263.4,385-264,385zM-286,391v-5h22v5H-286z M-264,391.5V391l0,0V391.5z"/>\n    <polygon points="-283,387 -284,387 -284,388 -285,388 -285,389 -284,389 -284,390 -283,390 -283,389 -282,389 -282,388 -283,388 	"/>\n    <path d="M-264,393h-22c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-14C-263,393.4-263.4,393-264,393zM-286,408v-14h22v14H-286z M-264,408.5V408l0,0V408.5z"/>\n    <polygon points="-284.2,397.9 -283.5,397.2 -282.8,397.9 -282.1,397.2 -282.8,396.5 -282.1,395.8 -282.8,395.1 -283.5,395.8 -284.2,395.1 -284.9,395.8 -284.2,396.5 -284.9,397.2 	"/>\n    <path d="M-271.5,388h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-271.2,388-271.5,388z"/>\n    <path d="M-279.5,397h10c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-10c-0.3,0-0.5,0.2-0.5,0.5S-279.8,397-279.5,397z"/>\n    <path d="M-275.5,399h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-275.2,399-275.5,399z"/>\n    <path d="M-271,399.5c0,0.3,0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5C-270.8,399-271,399.2-271,399.5z"/>\n    <path d="M-265.5,401h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-265.2,401-265.5,401z"/>\n    <path d="M-265.5,403h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-265.2,403-265.5,403z"/>\n    <path d="M-268.5,405h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-268.2,405-268.5,405z"/>\n    <path d="M-275,406v-5h-10v5.2v0.5v0.3h10V406L-275,406z M-279.5,402h3.5v2c-0.4-0.3-0.8-0.4-1.2-0.5C-277.6,402.6-278.5,402-279.5,402c-0.8,0-1.5,0.4-2,1c-0.1,0-0.1,0-0.2,0c-0.9,0-1.7,0.4-2.2,0.9V402H-279.5z M-279.6,405.8h-4.3c0.2-1,1.1-1.8,2.2-1.8C-280.6,404-279.8,404.7-279.6,405.8z M-280.4,403.3c0.3-0.2,0.6-0.3,0.9-0.3c0.5,0,1,0.3,1.2,0.6c-0.3,0.1-0.7,0.3-0.9,0.6C-279.6,403.8-280,403.5-280.4,403.3z M-278.5,406c0-0.3-0.1-0.6-0.2-0.9c0.3-0.4,0.7-0.6,1.2-0.6c0.8,0,1.5,0.7,1.5,1.5l0,0H-278.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-advanced-carousel']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-advanced-carousel ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <polygon points="-265.1,394.1 -265.9,394.9 -263.7,397 -265.9,399.1 -265.1,399.9 -262.3,397 	"/>\n    <polygon points="-284.9,394.1 -287.7,397 -284.9,399.9 -284.1,399.1 -286.3,397 -284.1,394.9 	"/>\n    <path d="M-275,390c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S-273.9,390-275,390z M-275,393c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S-274.4,393-275,393z"/>\n    <path d="M-281,390c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S-279.9,390-281,390z M-281,393c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S-280.4,393-281,393z"/>\n    <path d="M-269,390c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S-267.9,390-269,390z M-269,393c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S-268.4,393-269,393z"/>\n    <path d="M-280.5,396c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5H-280.5z"/>\n    <path d="M-274.5,396c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5H-274.5z"/>\n    <path d="M-268.5,396c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5H-268.5z"/>\n    <path d="M-279.5,398h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-279.2,398-279.5,398z"/>\n    <path d="M-273.5,398h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-273.2,398-273.5,398z"/>\n    <path d="M-267.5,398h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-267.2,398-267.5,398z"/>\n    <path d="M-279.5,400h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-279.2,400-279.5,400z"/>\n    <path d="M-273.5,400h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-273.2,400-273.5,400z"/>\n    <path d="M-267.5,400h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-267.2,400-267.5,400z"/>\n    <path d="M-279.5,402h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-279.2,402-279.5,402z"/>\n    <path d="M-273.5,402h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-273.2,402-273.5,402z"/>\n    <path d="M-267.5,402h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-267.2,402-267.5,402z"/>\n    <path d="M-273.5,404h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-273.2,404-273.5,404z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-alert']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-alert ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265,404.3c-0.5-1-0.3-1-1.3-2.2c-0.9-1.1-1.7-2-1.7-9.1c0-3.9-3.1-7-7-7s-7,3.1-7,7c0,7.1-0.8,8-1.6,9.1c-1,1.2-0.8,1.2-1.3,2.2c-0.2,0.4,0.1,0.7,0.4,0.7h6.1c0.2,1.7,1.7,3,3.4,3s3.2-1.3,3.4-3h6.1C-265.2,405-264.9,404.7-265,404.3zM-281,393c0-3.3,2.7-6,6-6s6,2.7,6,6c0,7.5,0.9,8.5,1.9,9.7c0.3,0.4,0.6,0.7,0.9,1.3h-17.5C-282.6,401.6-281,402.9-281,393zM-275,407c-1.2,0-2.2-0.9-2.4-2h4.9C-272.8,406.1-273.8,407-275,407z"/>\n    <circle cx="-277.5" cy="390.5" r="0.5"/>\n    <circle cx="-276.5" cy="389.5" r="0.5"/>\n    <circle cx="-278.5" cy="391.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-animations']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-animation ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-274,396.5v-8c0-1.4-1.1-2.5-2.5-2.5h-8c-1.4,0-2.5,1.1-2.5,2.5v8c0,1.4,1.1,2.5,2.5,2.5h8C-275.1,399-274,397.9-274,396.5z M-286,396.5v-8c0-0.8,0.7-1.5,1.5-1.5h8c0.8,0,1.5,0.7,1.5,1.5v8c0,0.8-0.7,1.5-1.5,1.5h-8C-285.3,398-286,397.3-286,396.5z"/>\n    <path d="M-272,398.5v-7c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v7c0,0.8-0.7,1.5-1.5,1.5h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7C-273.1,401-272,399.9-272,398.5z"/>\n    <path d="M-270,400.5v-6c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v6c0,0.8-0.7,1.5-1.5,1.5h-6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6C-271.1,403-270,401.9-270,400.5z"/>\n    <path d="M-268,402.5v-5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v5c0,0.8-0.7,1.5-1.5,1.5h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5C-269.1,405-268,403.9-268,402.5z"/>\n    <path d="M-266.5,400c-0.3,0-0.5,0.2-0.5,0.5v4c0,0.8-0.7,1.5-1.5,1.5h-4c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4c1.4,0,2.5-1.1,2.5-2.5v-4C-266,400.2-266.2,400-266.5,400z"/>\n    <path d="M-263.1,394.1l-6.2-6.1h1.3v-1h-2h-1v1v2h1v-1.3l6.1,6.1c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1C-263,394.7-263,394.3-263.1,394.1z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-author']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-author ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266,385h-15.5c-1.9,0-3.5,1.6-3.5,3.5v17c0,1.9,1.6,3.5,3.5,3.5l0,0h15.5c0.6,0,1-0.4,1-1v-22C-265,385.4-265.4,385-266,385z M-268,405.5c0-1.2,0.9-2.2,2-2.4v4.9C-267.1,407.7-268,406.7-268,405.5z M-266,402h-14v-16h14V402zM-284,388.5c0-1.4,1.1-2.5,2.5-2.5h0.5v16h-0.5c-1,0-1.9,0.4-2.5,1.1V388.5z M-284,405.5c0-1.4,1.1-2.5,2.5-2.5h13.6c-0.3,0.3-0.5,0.6-0.7,1h-13.9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13.6c0,0.2-0.1,0.3-0.1,0.5s0,0.3,0,0.5h-13.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13.9c0.2,0.4,0.4,0.7,0.7,1h-13.6C-282.9,408-284,406.9-284,405.5z"/>\n    <path d="M-278.7,397.9c0.2,0.2,0.5,0.1,0.7-0.1c0.6-0.9,1.8-1.9,2.1-1.8c0,0,0.3,0.3,0,1.8c0,0.4,0.1,0.7,0.4,0.9c0.5,0.3,1.1,0.1,1.8-0.1c0.8-0.3,1.8-0.6,2.4-0.1c0.5,0.3,1.4,0.5,2.2,0.5c0.6,0,1.2-0.1,1.6-0.2c0.3-0.1,0.4-0.3,0.4-0.6c0-0.3-0.3-0.4-0.6-0.4c-0.8,0.2-2.4,0.2-2.9-0.1c-1.1-0.8-2.4-0.4-3.3-0.1c-0.3,0.1-0.7,0.2-0.8,0.2l0,0c0.2-1,0.3-2.4-0.6-2.8c-1.3-0.6-3.3,2.1-3.3,2.1C-279,397.4-279,397.7-278.7,397.9z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-block-grid']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-block-grid ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-287,397h10c0.6,0,1-0.4,1-1v-8c0-0.6-0.4-1-1-1h-10c-0.6,0-1,0.4-1,1v8C-288,396.6-287.6,397-287,397zM-277,396v0.5V396L-277,396z M-287,388h10v8h-10V388z"/>\n    <path d="M-281,399h-6c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1v-5C-280,399.4-280.4,399-281,399zM-287,405v-5h6v5H-287z M-281,405.5V405l0,0V405.5z"/>\n    <path d="M-272,399h-6c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1v-5C-271,399.4-271.4,399-272,399zM-278,405v-5h6v5H-278z M-272,405.5V405l0,0V405.5z"/>\n    <path d="M-263,399h-6c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1v-5C-262,399.4-262.4,399-263,399zM-269,405v-5h6v5H-269z M-263,405.5V405l0,0V405.5z"/>\n    <path d="M-263,387h-10c-0.6,0-1,0.4-1,1v8c0,0.6,0.4,1,1,1h10c0.6,0,1-0.4,1-1v-8C-262,387.4-262.4,387-263,387zM-273,396v-8h10v8H-273z M-263,396.5V396l0,0V396.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-blockquote']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-blockquote ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-280.6,394.1c-0.1-0.4,1.1-2.1,2.4-3.3c0.3-0.3,0.4-0.7,0.2-1.1c-0.1-0.5-0.5-0.7-0.9-0.7h-0.2c-5.1,1-8.9,5.5-8.9,10.8c0,3.3,2.7,6,6,6s6-2.7,6-6C-276,397-277.9,394.6-280.6,394.1z M-282,404.8c-2.8,0-5-2.2-5-5c0-4.8,3.4-8.9,8.1-9.8c-0.1,0.1-3,3-2.7,4.3c0.1,0.3,0.3,0.6,0.7,0.6c2.3,0.5,3.8,2.5,3.8,4.9C-277,402.6-279.2,404.8-282,404.8z"/>\n    <path d="M-266.6,394.1c-0.1-0.4,1.1-2.1,2.4-3.3c0.3-0.3,0.4-0.7,0.2-1.1c-0.1-0.5-0.5-0.7-0.9-0.7h-0.2c-5.1,1-8.9,5.5-8.9,10.8c0,3.3,2.7,6,6,6s6-2.7,6-6C-262,397-263.9,394.6-266.6,394.1z M-268,404.8c-2.8,0-5-2.2-5-5c0-4.8,3.4-8.9,8.1-9.8c-0.1,0.1-3,3-2.7,4.3c0.1,0.3,0.3,0.6,0.7,0.6c2.3,0.5,3.8,2.5,3.8,4.9C-263,402.6-265.2,404.8-268,404.8z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-button']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-button ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265.5,401c1.4,0,2.5-1.1,2.5-2.5v-6c0-1.4-1.1-2.5-2.5-2.5h-19c-1.4,0-2.5,1.1-2.5,2.5v6c0,1.4,1.1,2.5,2.5,2.5H-265.5z M-286,398.5v-6c0-0.8,0.7-1.5,1.5-1.5h19c0.8,0,1.5,0.7,1.5,1.5v6c0,0.8-0.7,1.5-1.5,1.5h-19C-285.3,400-286,399.3-286,398.5z"/>\n    <path d="M-262.2,400.9c-0.2-0.2-0.5-0.2-0.7,0c-0.7,0.7-1.6,1.1-2.6,1.1h-19c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h19c1.2,0,2.4-0.5,3.3-1.4C-262,401.4-262,401.1-262.2,400.9z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-callout']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-callout ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265.4,389h-19c-1.4,0-2.5,1.1-2.5,2.5v11c0,1.4,1.1,2.5,2.5,2.5h19c1.4,0,2.5-1.1,2.5-2.5v-11C-262.9,390.1-264,389-265.4,389z M-263.9,402.5c0,0.8-0.7,1.5-1.5,1.5h-19c-0.8,0-1.5-0.7-1.5-1.5v-11c0-0.8,0.7-1.5,1.5-1.5h19c0.8,0,1.5,0.7,1.5,1.5V402.5z"/>\n    <path d="M-274,391.5c0-0.3-0.2-0.5-0.5-0.5h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9C-274.2,392-274,391.8-274,391.5z"/>\n    <path d="M-266.5,394h-14c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h14c0.3,0,0.5-0.2,0.5-0.5S-266.2,394-266.5,394z"/>\n  </g>\n  <g>\n    <path d="M-266.5,397h-17c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h17c0.3,0,0.5,0.2,0.5,0.5S-266.2,397-266.5,397z"/>\n  </g>\n  <g>\n    <path d="M-270.5,399h-13c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h13c0.3,0,0.5,0.2,0.5,0.5S-270.2,399-270.5,399z"/>\n  </g>\n  <g>\n    <path d="M-277,403h-6c-0.6,0-1-0.4-1-1v-1c0-0.6,0.4-1,1-1h6c0.6,0,1,0.4,1,1v1C-276,402.6-276.4,403-277,403zM-277,402v0.5V402L-277,402z M-283,401v1h6v-1H-283z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-card']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-card ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-276.4,404.4l1.6,1.6h-8.7l0,0c-1.4,0-2.5-1.1-2.5-2.5c0-0.7,0.3-1.5,0.9-1.9c0.2-0.2,0.2-0.5,0.1-0.7c-0.1-0.2-0.5-0.2-0.7-0.1c-0.8,0.7-1.3,1.7-1.3,2.7c0,1.9,1.6,3.5,3.5,3.5l0,0h8.8l-1.6,1.6l0.7,0.7l2.9-2.9l-2.9-2.9L-276.4,404.4z"/>\n    <path d="M-277.5,392.5c0,1.4,1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5S-277.5,391.1-277.5,392.5z M-273.5,392.5c0,0.8-0.7,1.5-1.5,1.5s-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5S-273.5,391.7-273.5,392.5z"/>\n    <path d="M-272,388.5c0-0.3-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5C-272.2,389-272,388.8-272,388.5z"/>\n    <path d="M-279,396.5c0,0.3,0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-9C-278.8,396-279,396.2-279,396.5z"/>\n    <path d="M-281,398.5c0,0.3,0.2,0.5,0.5,0.5h11c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-11C-280.8,398-281,398.2-281,398.5z"/>\n    <path d="M-280.5,401h8c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-8c-0.3,0-0.5,0.2-0.5,0.5S-280.8,401-280.5,401z"/>\n    <path d="M-264.3,400.8c-0.2-0.2-0.5-0.1-0.7,0.1c-0.2,0.2-0.1,0.5,0.1,0.7c0.6,0.5,0.9,1.2,0.9,1.9c0,1.4-1.1,2.5-2.5,2.5l0,0h-4c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4l0,0c1.9,0,3.5-1.6,3.5-3.5C-263,402.5-263.5,401.5-264.3,400.8z"/>\n    <path d="M-283,404h4.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4.5v-16h16v16h-6.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6.5c0.6,0,1-0.4,1-1v-16c0-0.6-0.4-1-1-1h-16c-0.6,0-1,0.4-1,1v16C-284,403.6-283.6,404-283,404z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-clear']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-clear ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265,387h-2v-1c0-0.6-0.4-1-1-1h-17c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h2v1c0,0.6,0.4,1,1,1h17c0.6,0,1-0.4,1-1v-3C-264,387.4-264.4,387-265,387z M-285,389v-3h17v1h-14c-0.6,0-1,0.4-1,1v1H-285z M-268,389h-14v-1h14V389zM-268,389v0.5V389L-268,389z M-282,391v-1h14c0.6,0,1-0.4,1-1v-1h2v3H-282z M-265,391.5V391l0,0V391.5z"/>\n    <path d="M-265,398h-20c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h20c0.6,0,1-0.4,1-1v-3C-264,398.4-264.4,398-265,398zM-285,402v-3h20v3H-285z M-265,402.5V402l0,0V402.5z"/>\n    <path d="M-265,404h-20c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h20c0.6,0,1-0.4,1-1v-3C-264,404.4-264.4,404-265,404zM-285,408v-3h20v3H-285z M-265,408.5V408l0,0V408.5z"/>\n    <polygon points="-277.4,393.6 -279.5,395.8 -281.6,393.6 -282.4,394.4 -279.5,397.2 -276.6,394.4   "/>\n  </g>\n</svg>';

}
return __p
};templates['element-code']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-code ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-277.8,393h8.3c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-8.3c-0.3,0-0.5,0.2-0.5,0.5S-278.1,393-277.8,393z"/>\n    <path d="M-269.5,398h-12c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h12c0.3,0,0.5-0.2,0.5-0.5S-269.2,398-269.5,398z"/>\n    <path d="M-275,404h-6.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6.5c0.3,0,0.5-0.2,0.5-0.5S-274.7,404-275,404z"/>\n    <polygon points="-278.6,394.6 -280.8,392.5 -278.6,390.4 -279.4,389.6 -282.2,392.5 -279.4,395.4   "/>\n    <polygon points="-271.4,402.4 -269.2,404.5 -271.4,406.6 -270.6,407.4 -267.8,404.5 -270.6,401.6   "/>\n    <rect x="-273.7" y="400.9" transform="matrix(0.9745 0.2246 -0.2246 0.9745 83.8131 71.6855)" width="1" height="6.7"/>\n    <path d="M-265.3,390l-5.7-5.7c-0.2-0.2-0.5-0.3-0.7-0.3h-11.8c-0.8,0-1.5,0.7-1.5,1.5v23c0,0.8,0.7,1.5,1.5,1.5h17c0.8,0,1.5-0.7,1.5-1.5v-17.8C-265,390.5-265.1,390.2-265.3,390z M-271,385.6l4.4,4.4h-3.9c-0.3,0-0.5-0.2-0.5-0.5V385.6zM-266.5,409h-17c-0.3,0-0.5-0.2-0.5-0.5v-23c0-0.3,0.2-0.5,0.5-0.5h11.5v4.5c0,0.8,0.7,1.5,1.5,1.5h4.5v17.5C-266,408.8-266.2,409-266.5,409z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-columnize']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-columnize ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-276.5,385h-6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6c0.3,0,0.5-0.2,0.5-0.5S-276.2,385-276.5,385z"/>\n    <path d="M-273.5,386h9c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-9c-0.3,0-0.5,0.2-0.5,0.5S-273.8,386-273.5,386z"/>\n    <path d="M-276.5,387h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,387-276.5,387z"/>\n    <path d="M-264.5,387h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,387-264.5,387z"/>\n    <path d="M-276.5,389h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,389-276.5,389z"/>\n    <path d="M-264.5,389h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,389-264.5,389z"/>\n    <path d="M-276.5,391h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,391-276.5,391z"/>\n    <path d="M-264.5,391h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,391-264.5,391z"/>\n    <path d="M-276.5,393h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,393-276.5,393z"/>\n    <path d="M-273.5,394h7c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-7c-0.3,0-0.5,0.2-0.5,0.5S-273.8,394-273.5,394z"/>\n    <path d="M-276.5,395h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,395-276.5,395z"/>\n    <path d="M-264.5,395h-6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6c0.3,0,0.5-0.2,0.5-0.5S-264.2,395-264.5,395z"/>\n    <path d="M-276.5,397h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,397-276.5,397z"/>\n    <path d="M-264.5,397h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,397-264.5,397z"/>\n    <path d="M-285.5,400h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-285.8,400-285.5,400z"/>\n    <path d="M-264.5,399h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,399-264.5,399z"/>\n    <path d="M-276.5,401h-6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6c0.3,0,0.5-0.2,0.5-0.5S-276.2,401-276.5,401z"/>\n    <path d="M-264.5,401h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,401-264.5,401z"/>\n    <path d="M-276.5,403h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,403-276.5,403z"/>\n    <path d="M-267.5,403h-6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6c0.3,0,0.5-0.2,0.5-0.5S-267.2,403-267.5,403z"/>\n    <path d="M-276.5,405h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,405-276.5,405z"/>\n    <path d="M-276.5,407h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-276.2,407-276.5,407z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-contact-form-7']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-contact-form-7 ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265.3,390l-5.7-5.7c-0.2-0.2-0.5-0.3-0.7-0.3h-11.8c-0.8,0-1.5,0.7-1.5,1.5v23c0,0.8,0.7,1.5,1.5,1.5h17c0.8,0,1.5-0.7,1.5-1.5v-17.8C-265,390.5-265.1,390.2-265.3,390z M-271,385.6l4.4,4.4h-3.9c-0.3,0-0.5-0.2-0.5-0.5V385.6zM-266.5,409h-17c-0.3,0-0.5-0.2-0.5-0.5v-23c0-0.3,0.2-0.5,0.5-0.5h11.5v4.5c0,0.8,0.7,1.5,1.5,1.5h4.5v17.5C-266,408.8-266.2,409-266.5,409z"/>\n    <path d="M-270,393.6C-270,393.5-270,393.5-270,393.6C-270,393.5-270,393.5-270,393.6c0-0.1,0-0.2,0-0.2v-0.1c0,0,0-0.1-0.1-0.1c0,0,0-0.1-0.1-0.1l0,0c0,0,0,0-0.1,0h-0.1h-0.1c0,0,0,0-0.1,0h-9c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5V394h7.5c-1.6,2.1-5.5,7.9-5.5,12.5c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5c0-5.3,5.8-12.6,5.9-12.7c0,0,0,0,0-0.1v-0.1C-270,393.6-270,393.6-270,393.6z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-container']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-container ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266,397.4l2.1-11.4H-274v-1h1.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1.5v1h-10.1l1.1,5.1c0.1,0.3,0.3,0.4,0.6,0.4c0.3-0.1,0.4-0.3,0.4-0.6l-0.9-3.9h19.8l-1.8,10h-1.6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1.7l3.3,5h-2l-12.4-12.4c-0.9-0.9-2.6-0.9-3.5,0l-4.2,4.2c-1,1-1,2.6,0,3.5l4.8,4.7h-5.8l1-1.7c0.1-0.2,0.1-0.5-0.2-0.7c-0.3-0.2-0.5-0.1-0.7,0.2l-1.5,2.6v6.6h26v-6.7L-266,397.4z M-284.9,397.6c-0.6-0.6-0.6-1.5,0-2.1l4.2-4.2c0.6-0.6,1.5-0.6,2.1,0l11.8,11.7h-12.6L-284.9,397.6z M-287,409v-5h24v5H-287z"/>\n    <path d="M-272.5,406h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-272.2,406-272.5,406z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-countdown-timer']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-countdown-timer ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265,407.3v-2.8c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v2.8l-1.6-1.6l-0.7,0.7l2.9,2.9l2.9-2.9l-0.7-0.7L-265,407.3z"/>\n    <path d="M-284.5,388h-2c-0.8,0-1.5,0.7-1.5,1.5v5c0,0.4,0.2,0.7,0.4,1c-0.2,0.3-0.4,0.6-0.4,1v5c0,0.8,0.7,1.5,1.5,1.5h2c0.8,0,1.5-0.7,1.5-1.5v-5c0-0.4-0.2-0.7-0.4-1c0.2-0.3,0.4-0.6,0.4-1v-5C-283,388.7-283.7,388-284.5,388z M-287,389.5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5v5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5V389.5z M-284,401.5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5V401.5z"/>\n    <path d="M-278.5,388h-2c-0.8,0-1.5,0.7-1.5,1.5v5c0,0.4,0.2,0.7,0.4,1c-0.2,0.3-0.4,0.6-0.4,1v5c0,0.8,0.7,1.5,1.5,1.5h2c0.8,0,1.5-0.7,1.5-1.5v-5c0-0.4-0.2-0.7-0.4-1c0.2-0.3,0.4-0.6,0.4-1v-5C-277,388.7-277.7,388-278.5,388z M-281,389.5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5v5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5V389.5z M-278,401.5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5V401.5z"/>\n    <path d="M-268,396.5c0-0.4-0.2-0.7-0.4-1c0.2-0.3,0.4-0.6,0.4-1v-5c0-0.8-0.7-1.5-1.5-1.5h-2c-0.8,0-1.5,0.7-1.5,1.5v5c0,0.4,0.2,0.7,0.4,1c-0.2,0.3-0.4,0.6-0.4,1v5c0,0.8,0.7,1.5,1.5,1.5h2c0.8,0,1.5-0.7,1.5-1.5V396.5z M-272,389.5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5v5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5V389.5z M-269,401.5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5V401.5z"/>\n    <path d="M-262,389.5c0-0.8-0.7-1.5-1.5-1.5h-2c-0.8,0-1.5,0.7-1.5,1.5v5c0,0.4,0.2,0.7,0.4,1c-0.2,0.3-0.4,0.6-0.4,1v5c0,0.8,0.7,1.5,1.5,1.5h2c0.8,0,1.5-0.7,1.5-1.5v-5c0-0.4-0.2-0.7-0.4-1c0.2-0.3,0.4-0.6,0.4-1V389.5z M-266,389.5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5v5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5V389.5z M-263,401.5c0,0.3-0.2,0.5-0.5,0.5h-2c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h2c0.3,0,0.5,0.2,0.5,0.5V401.5z"/>\n    <circle cx="-275" cy="392" r="1"/>\n    <circle cx="-275" cy="398" r="1"/>\n  </g>\n</svg>';

}
return __p
};templates['element-counter']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-counter ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-263.6,390.6l-2.9-2.9l-2.9,2.9l0.7,0.7l1.7-1.6v3.8c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-3.8l1.6,1.6L-263.6,390.6z"/>\n    <path d="M-282,392c-2.2,0-4,1.8-4,4v6c0,2.2,1.8,4,4,4s4-1.8,4-4v-6C-278,393.8-279.8,392-282,392z M-285,402v-6c0-0.5,0.2-1,0.4-1.5l4.5,9.8c-0.5,0.4-1.2,0.7-1.9,0.7C-283.7,405-285,403.7-285,402z M-279,402c0,0.5-0.2,1-0.4,1.5l-4.5-9.8c0.5-0.4,1.2-0.7,1.9-0.7c1.7,0,3,1.3,3,3V402z"/>\n    <path d="M-273,392c-2.2,0-4,1.8-4,4v6c0,2.2,1.8,4,4,4s4-1.8,4-4v-6C-269,393.8-270.8,392-273,392z M-276,402v-6c0-0.5,0.2-1,0.4-1.5l4.5,9.8c-0.5,0.4-1.2,0.7-1.9,0.7C-274.7,405-276,403.7-276,402z M-270,402c0,0.5-0.2,1-0.4,1.5l-4.5-9.8c0.5-0.4,1.2-0.7,1.9-0.7c1.7,0,3,1.3,3,3V402z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-creative-cta']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-highlight-box ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-279.5,394h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-279.8,394-279.5,394z"/>\n    <path d="M-270.5,396h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-270.2,396-270.5,396z"/>\n    <path d="M-270.5,398h-9.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9.5c0.3,0,0.5-0.2,0.5-0.5S-270.2,398-270.5,398z"/>\n    <path d="M-270.5,400h-9.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9.5c0.3,0,0.5-0.2,0.5-0.5S-270.2,400-270.5,400z"/>\n    <path d="M-265.3,405h1.3v-1h-3v3h1v-1.3l2.1,2.1c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1c0.2-0.2,0.2-0.5,0-0.7L-265.3,405z"/>\n    <path d="M-264,390v-1h-1.3l2.1-2.1c0.2-0.2,0.2-0.5,0-0.7c-0.2-0.2-0.5-0.2-0.7,0l-2.1,2.1V387h-1v3H-264z"/>\n    <path d="M-286,404v1h1.3l-2.1,2.1c-0.2,0.2-0.2,0.5,0,0.7c0,0.2,0.2,0.2,0.3,0.2s0.3,0,0.4-0.1l2.1-2.2v1.3h1v-3H-286z"/>\n    <path d="M-284,388.3l-2.1-2.2c-0.2-0.1-0.6-0.1-0.8,0c-0.2,0.1-0.1,0.6,0,0.8l2.2,2.1h-1.3v1h3v-3h-1V388.3z"/>\n    <path d="M-269,391h-12c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1v-10C-268,391.4-268.4,391-269,391z M-281,402v-10h12v10H-281z M-269,402.5V402l0,0V402.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-custom-headline']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-custom-headline ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-285.5,389h9c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-9c-0.3,0-0.5,0.2-0.5,0.5S-285.8,389-285.5,389z"/>\n    <path d="M-264.5,404h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-264.2,404-264.5,404z"/>\n    <path d="M-270.5,396h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-270.2,396-270.5,396z"/>\n    <circle cx="-274.5" cy="388.5" r="0.5"/>\n    <circle cx="-272.5" cy="388.5" r="0.5"/>\n    <circle cx="-270.5" cy="388.5" r="0.5"/>\n    <circle cx="-268.5" cy="388.5" r="0.5"/>\n    <circle cx="-266.5" cy="388.5" r="0.5"/>\n    <circle cx="-264.5" cy="388.5" r="0.5"/>\n    <circle cx="-285.5" cy="404.5" r="0.5"/>\n    <circle cx="-283.5" cy="404.5" r="0.5"/>\n    <circle cx="-281.5" cy="404.5" r="0.5"/>\n    <circle cx="-279.5" cy="404.5" r="0.5"/>\n    <circle cx="-277.5" cy="404.5" r="0.5"/>\n    <circle cx="-275.5" cy="404.5" r="0.5"/>\n    <circle cx="-268.5" cy="396.5" r="0.5"/>\n    <circle cx="-266.5" cy="396.5" r="0.5"/>\n    <circle cx="-264.5" cy="396.5" r="0.5"/>\n    <circle cx="-285.5" cy="396.5" r="0.5"/>\n    <circle cx="-283.5" cy="396.5" r="0.5"/>\n    <circle cx="-281.5" cy="396.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-custom']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-custom ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <path d="M-262.1,403.9C-262.1,403.8-262.1,403.8-262.1,403.9c0.1-0.1,0.1-0.1,0.1-0.2c0,0,0,0,0-0.1v-13.2l0,0c0,0,0,0,0-0.1c0,0,0,0,0-0.1c0,0,0,0,0-0.1l0,0l0,0c0,0,0,0,0-0.1l0,0c0,0,0,0-0.1,0l0,0l-12.2-6.6l0,0h-0.1h-0.1h-0.1h-0.1l0,0l-13,6.6l0,0c0,0,0,0-0.1,0l0,0c0,0,0,0,0,0.1l0,0l0,0l0,0v0.1v0.1l0,0v13.2c0,0,0,0,0,0.1v0.1v0.1c0,0,0,0.1,0.1,0.1c0,0,0.1,0,0.1,0.1c0,0,0,0,0.1,0l12.9,6.6l0,0c0.1,0,0.1,0.1,0.2,0.1l0,0c0.1,0,0.2,0,0.2-0.1l0,0l11.9-6.6l0,0C-262.2,404-262.2,404-262.1,403.9C-262.2,403.9-262.2,403.9-262.1,403.9z M-274.5,384.4l10.9,6l-10.9,6l-11.8-6L-274.5,384.4z M-286.9,391.2l11.9,6.1v12.1l-11.9-6.1V391.2z M-274,397.3l10.9-6.1v12.1l-10.9,6.1V397.3z"/>\n</svg>';

}
return __p
};templates['element-default']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-default ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <path d="M-268.3,383.7h-13.3c-3.6,0-6.7,3-6.7,6.7v13.3c0,3.6,3,6.7,6.7,6.7h13.3c3.6,0,6.7-3,6.7-6.7v-13.3C-261.7,386.7-264.7,383.7-268.3,383.7z M-262.9,403.7c0,3-2.4,5.5-5.5,5.5h-13.3c-3,0-5.5-2.4-5.5-5.5v-13.3c0-3,2.4-5.5,5.5-5.5h13.3c3,0,5.5,2.4,5.5,5.5V403.7z M-275,406.7c-5.3,0-9.7-4.4-9.7-9.7s4.4-9.7,9.7-9.7s9.7,4.4,9.7,9.7S-269.7,406.7-275,406.7zM-275,388.5c-4.6,0-8.5,3.8-8.5,8.5s3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5S-270.4,388.5-275,388.5z"/>\n</svg>';

}
return __p
};templates['element-embedded-audio']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-embedded-audio ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-272.5,393c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c0.8,0,1.5,0.7,1.5,1.5S-271.7,393-272.5,393z"/>\n    <path d="M-272.5,396c2.5,0,4.5-2,4.5-4.5s-2-4.5-4.5-4.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c1.9,0,3.5,1.6,3.5,3.5s-1.6,3.5-3.5,3.5c-0.3,0-0.5,0.2-0.5,0.5S-272.8,396-272.5,396z"/>\n    <path d="M-272.5,398c3.6,0,6.5-2.9,6.5-6.5s-2.9-6.5-6.5-6.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c3,0,5.5,2.5,5.5,5.5s-2.5,5.5-5.5,5.5c-0.3,0-0.5,0.2-0.5,0.5S-272.8,398-272.5,398z"/>\n    <path d="M-283,395h3.3l3,3c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.3,0,0.4-0.1c0.4-0.2,0.6-0.5,0.6-0.9v-11.6c0-0.4-0.2-0.8-0.6-0.9c-0.4-0.2-0.8-0.1-1.1,0.2l-3,3h-3.3c-0.6,0-1,0.4-1,1v5C-284,394.6-283.6,395-283,395z M-276,385.7v11.6l-3-3v-5.6L-276,385.7z M-283,389h3v5h-3V389z"/>\n    <path d="M-278.5,399c-0.3,0-0.5,0.2-0.5,0.5v5.8l-1.6-1.6l-0.7,0.7l2.9,2.9l2.9-2.9l-0.7-0.7l-1.8,1.6v-5.8C-278,399.2-278.2,399-278.5,399z"/>\n    <path d="M-264,400h-12.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h12.5v7h-22v-7h5.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5.5c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-7C-263,400.4-263.4,400-264,400z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-embedded-video']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-embedded-video ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-280.5,398h11c0.8,0,1.5-0.7,1.5-1.5v-10c0-0.8-0.7-1.5-1.5-1.5h-11c-0.8,0-1.5,0.7-1.5,1.5v10C-282,397.3-281.3,398-280.5,398z M-271,386h1.5c0.3,0,0.5,0.2,0.5,0.5v1.5h-2V386z M-271,389h2v2h-2V389z M-271,392h2v2h-2V392zM-271,395h2v1.5c0,0.3-0.2,0.5-0.5,0.5h-1.5V395z M-278,386h6v5h-6V386z M-278,392h6v5h-6V392z M-281,386.5c0-0.3,0.2-0.5,0.5-0.5h1.5v2h-2V386.5z M-281,389h2v2h-2V389z M-281,392h2v2h-2V392z M-281,395h2v2h-1.5c-0.3,0-0.5-0.2-0.5-0.5V395z"/>\n    <path d="M-278.5,399c-0.3,0-0.5,0.2-0.5,0.5v5.8l-1.6-1.6l-0.7,0.7l2.9,2.9l2.9-2.9l-0.7-0.7l-1.8,1.6v-5.8C-278,399.2-278.2,399-278.5,399z"/>\n    <path d="M-264,400h-12.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h12.5v7h-22v-7h5.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5.5c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-7C-263,400.4-263.4,400-264,400z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-envira-gallery']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-envira-gallery ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1388 3226 30 30" style="enable-background:new -1388 3226 30 30;" xml:space="preserve">\n  <g>\n    <path d="M-1371.2,3240.1c-1.9-4.3-3.7-8.8-10.7-10.1c-0.2,0-0.5,0.1-0.5,0.3c-0.1,0.2,0,0.4,0.1,0.6c3.8,3.3,5.1,6,6.2,8.4c1.5,3.1,2.8,5.8,8.9,8.7c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.4-0.2c0.1-0.2,0.1-0.5-0.1-0.7C-1369,3245.4-1370.1,3242.8-1371.2,3240.1z M-1375.2,3238.8c-1-2.1-2.2-4.5-5.1-7.4c5,1.5,6.5,5.2,8.1,9.1c0.7,1.7,1.5,3.5,2.6,5C-1373,3243.4-1374,3241.3-1375.2,3238.8z"/>\n    <path d="M-1364.9,3248.6c1.4-5.8,0.8-10.5-1.7-13.9c-3.2-4.2-9.4-6.4-18.9-6.7h-0.8l0.3,0.7c0.5,1.1,0.9,2.7,1.3,4.6c1.6,6.7,3.9,16.7,14.6,16.7c1.4,0,2.9-0.2,4.4-0.5l4.2,4h1.5L-1364.9,3248.6z M-1365.9,3248.6c-1.5,0.3-2.9,0.5-4.2,0.5c-9.9-0.1-12-9.3-13.6-16c-0.3-1.6-0.7-3-1.1-4.1c8.8,0.4,14.5,2.5,17.4,6.3C-1365.1,3238.5-1364.6,3242.9-1365.9,3248.6z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-essential-grid']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-essential-grid ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1388 3226 30 30" style="enable-background:new -1388 3226 30 30;" xml:space="preserve">\n  <g>\n    <path d="M-1363.5,3228h-19c-1.9,0-3.5,1.6-3.5,3.5v19c0,1.9,1.6,3.5,3.5,3.5h19c1.9,0,3.5-1.6,3.5-3.5v-19C-1360,3229.6-1361.6,3228-1363.5,3228z M-1361,3250.5c0,1.4-1.1,2.5-2.5,2.5h-19c-1.4,0-2.5-1.1-2.5-2.5v-19c0-1.4,1.1-2.5,2.5-2.5h19c1.4,0,2.5,1.1,2.5,2.5V3250.5z"/>\n    <path d="M-1374.6,3233.5h-4.8c-0.6,0-1.1,0.5-1.1,1.1v4.8c0,0.6,0.5,1.1,1.1,1.1h4.8c0.6,0,1.1-0.5,1.1-1.1v-4.8C-1373.5,3234-1374,3233.5-1374.6,3233.5z M-1374.5,3239.4c0,0.1,0,0.1-0.1,0.1h-4.8c-0.1,0-0.1,0-0.1-0.1v-4.8c0-0.1,0-0.1,0.1-0.1h4.8c0.1,0,0.1,0,0.1,0.1C-1374.5,3234.6-1374.5,3239.4-1374.5,3239.4z"/>\n    <path d="M-1366.6,3233.5h-4.8c-0.6,0-1.1,0.5-1.1,1.1v4.8c0,0.6,0.5,1.1,1.1,1.1h4.8c0.6,0,1.1-0.5,1.1-1.1v-4.8C-1365.5,3234-1366,3233.5-1366.6,3233.5z M-1366.5,3239.4C-1366.5,3239.5-1366.5,3239.5-1366.5,3239.4l-4.9,0.1c-0.1,0-0.1,0-0.1-0.1v-4.8c0-0.1,0-0.1,0.1-0.1h4.8c0.1,0,0.1,0,0.1,0.1C-1366.5,3234.6-1366.5,3239.4-1366.5,3239.4z"/>\n    <path d="M-1374.6,3241.5h-4.8c-0.6,0-1.1,0.5-1.1,1.1v4.8c0,0.6,0.5,1.1,1.1,1.1h4.8c0.6,0,1.1-0.5,1.1-1.1v-4.8C-1373.5,3242-1374,3241.5-1374.6,3241.5z M-1374.5,3247.4c0,0.1,0,0.1-0.1,0.1h-4.8c-0.1,0-0.1,0-0.1-0.1v-4.8c0-0.1,0-0.1,0.1-0.1h4.8c0.1,0,0.1,0,0.1,0.1C-1374.5,3242.6-1374.5,3247.4-1374.5,3247.4z"/>\n    <path d="M-1366.6,3241.5h-4.8c-0.6,0-1.1,0.5-1.1,1.1v4.8c0,0.6,0.5,1.1,1.1,1.1h4.8c0.6,0,1.1-0.5,1.1-1.1v-4.8C-1365.5,3242-1366,3241.5-1366.6,3241.5z M-1366.5,3247.4C-1366.5,3247.5-1366.5,3247.5-1366.5,3247.4l-4.9,0.1c-0.1,0-0.1,0-0.1-0.1v-4.8c0-0.1,0-0.1,0.1-0.1h4.8c0.1,0,0.1,0,0.1,0.1C-1366.5,3242.6-1366.5,3247.4-1366.5,3247.4z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-feature-box']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-feature-box ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-275,393.1c2.3,0,4.1-1.8,4.1-4.1s-1.8-4.1-4.1-4.1s-4.1,1.8-4.1,4.1S-277.3,393.1-275,393.1z M-276.5,390.5c0-0.8,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5c0,0.6-0.3,1.1-0.8,1.3c-0.2,0.1-0.4,0.1-0.7,0.1s-0.5,0-0.7-0.1C-276.2,391.6-276.5,391.1-276.5,390.5z M-275,386.1c1.6,0,2.9,1.3,2.9,2.9c0,0.5-0.2,1-0.4,1.5c0-1.4-1.1-2.5-2.5-2.5s-2.5,1.1-2.5,2.5c-0.3-0.5-0.4-1-0.4-1.5C-277.9,387.4-276.6,386.1-275,386.1z"/>\n    <path d="M-280.5,396h11c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-11c-0.3,0-0.5,0.2-0.5,0.5S-280.8,396-280.5,396z"/>\n    <path d="M-281.5,400h15c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-15c-0.3,0-0.5,0.2-0.5,0.5S-281.8,400-281.5,400z"/>\n    <path d="M-266.5,401h-17c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h17c0.3,0,0.5-0.2,0.5-0.5S-266.2,401-266.5,401z"/>\n    <path d="M-266.5,403h-17c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h17c0.3,0,0.5-0.2,0.5-0.5S-266.2,403-266.5,403z"/>\n    <path d="M-266.5,405h-17c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h17c0.3,0,0.5-0.2,0.5-0.5S-266.2,405-266.5,405z"/>\n    <path d="M-270.5,407h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-270.2,407-270.5,407z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-feature-headline']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-feature-headline ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-282.5,386c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S-280,386-282.5,386z M-282.5,394c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S-280.6,394-282.5,394z"/>\n    <path d="M-275.5,391h12c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-0.5v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-0.5c-0.3,0-0.5,0.2-0.5,0.5S-275.8,391-275.5,391z"/>\n    <path d="M-284,392h3v-3h-3V392z M-283,390h1v1h-1V390z"/>\n    <path d="M-282.5,399c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S-280,399-282.5,399z M-282.5,407c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S-280.6,407-282.5,407z"/>\n    <path d="M-263.5,403h-0.5v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-1v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-0.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h12c0.3,0,0.5-0.2,0.5-0.5S-263.2,403-263.5,403z"/>\n    <path d="M-280.5,404.4L-280.5,404.4c0-0.1,0-0.2-0.1-0.2c0,0,0,0,0-0.1l-1.5-2c0,0,0,0-0.1,0c-0.1,0,0,0,0-0.1l0,0h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1l0,0c0,0,0,0,0,0.1s0,0-0.1,0l-1.5,2c0,0,0,0,0,0.1v0.1v0.1c0,0,0,0,0,0.1l0,0v0.1v0.1c0,0,0,0.1,0.1,0.1c0,0,0,0.1,0.1,0.1l0,0l0,0c0,0.1,0.1,0.1,0.2,0.1l0,0l0,0h3l0,0c0.1,0,0.2,0,0.3-0.1l0,0l0,0c0,0,0,0,0.1-0.1c0,0,0,0,0.1-0.1v-0.1C-280.5,404.6-280.5,404.6-280.5,404.4C-280.5,404.5-280.5,404.5-280.5,404.4C-280.5,404.5-280.5,404.5-280.5,404.4z M-282.5,403.3l0.5,0.7h-1L-282.5,403.3z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-feature-list']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-feature-list ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-284,385c-1.7,0-3,1.3-3,3c0,1.5,1.1,2.8,2.6,3c0.1,0,0.3,0,0.4,0c1.7,0,3-1.3,3-3S-282.3,385-284,385z M-285,389c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S-285,389.6-285,389z M-282.1,388.5c-0.2-0.9-1-1.5-1.9-1.5s-1.7,0.6-1.9,1.5c-0.1-0.2-0.1-0.3-0.1-0.5c0-1.1,0.9-2,2-2s2,0.9,2,2C-282,388.2-282,388.3-282.1,388.5z"/>\n    <path d="M-284,394c-1.7,0-3,1.3-3,3c0,1.5,1.1,2.8,2.6,3c0.1,0,0.3,0,0.4,0c1.7,0,3-1.3,3-3S-282.3,394-284,394z M-285,398c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S-285,398.6-285,398z M-282.1,397.5c-0.2-0.9-1-1.5-1.9-1.5s-1.7,0.6-1.9,1.5c-0.1-0.2-0.1-0.3-0.1-0.5c0-1.1,0.9-2,2-2s2,0.9,2,2C-282,397.2-282,397.3-282.1,397.5z"/>\n    <path d="M-284,403c-1.7,0-3,1.3-3,3c0,1.5,1.1,2.8,2.6,3c0.1,0,0.3,0,0.4,0c1.7,0,3-1.3,3-3S-282.3,403-284,403z M-285,407c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S-285,407.6-285,407z M-282.1,406.5c-0.2-0.9-1-1.5-1.9-1.5s-1.7,0.6-1.9,1.5c-0.1-0.2-0.1-0.3-0.1-0.5c0-1.1,0.9-2,2-2s2,0.9,2,2C-282,406.2-282,406.3-282.1,406.5z"/>\n    <path d="M-278.5,386h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-278.8,386-278.5,386z"/>\n    <path d="M-277,388.5c0,0.3,0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-13C-276.8,388-277,388.2-277,388.5z"/>\n    <path d="M-278.5,391h12c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-12c-0.3,0-0.5,0.2-0.5,0.5S-278.8,391-278.5,391z"/>\n    <path d="M-278.5,395h4c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4c-0.3,0-0.5,0.2-0.5,0.5S-278.8,395-278.5,395z"/>\n    <path d="M-263.5,397h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-263.2,397-263.5,397z"/>\n    <path d="M-278.5,400h14c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-14c-0.3,0-0.5,0.2-0.5,0.5S-278.8,400-278.5,400z"/>\n    <path d="M-278.5,404h7c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-7c-0.3,0-0.5,0.2-0.5,0.5S-278.8,404-278.5,404z"/>\n    <path d="M-263.5,406h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-263.2,406-263.5,406z"/>\n    <path d="M-271.5,408h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-271.2,408-271.5,408z"/>\n    <circle cx="-284" cy="392.5" r="0.5"/>\n    <circle cx="-284" cy="401.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-gap']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-gap ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-262.5,384c-0.3,0-0.5,0.2-0.5,0.5v4.5h-24v-4.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v5.5h26v-5.5C-262,384.2-262.2,384-262.5,384z"/>\n    <path d="M-288,409.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V408h24v1.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V407h-26V409.5z"/>\n    <polygon points="-284.6,401.6 -285.4,402.4 -282.5,405.2 -279.6,402.4 -280.4,401.6 -282,403.3 -282,393.7 -280.4,395.4 -279.6,394.6 -282.5,391.8 -285.4,394.6 -284.6,395.4 -283,393.7 -283,403.3  "/>\n    <polygon points="-269.6,401.6 -270.4,402.4 -267.5,405.2 -264.6,402.4 -265.4,401.6 -267,403.3 -267,393.7 -265.4,395.4 -264.6,394.6 -267.5,391.8 -270.4,394.6 -269.6,395.4 -268,393.7 -268,403.3  "/>\n  </g>\n</svg>';

}
return __p
};templates['element-google-map']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-google-map ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-270.5,390h1c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-1c-0.3,0-0.5,0.2-0.5,0.5S-270.8,390-270.5,390z"/>\n    <path d="M-265,389h-0.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h0.5v14.3l-4.1-4.1l0,0l-0.1-0.1c-0.1,0-0.1,0-0.2,0l0,0h-4c-0.3,0-0.5,0.2-0.5,0.5c0,0.3,0.2,0.5,0.5,0.5h3.4v7l-15-0.1v-7h0.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-0.5c-0.6,0-1,0.4-1,1v7c0,0.3,0.1,0.5,0.3,0.7c0.2,0.2,0.4,0.3,0.7,0.3h15c0.6,0,1-0.4,1-1v-2h4.5c0.1,0,0.1,0,0.2,0c0.1-0.1,0.2-0.1,0.3-0.3c0-0.1,0-0.1,0-0.2V390C-264,389.4-264.4,389-265,389z M-269,405v-3.3l3.3,3.3H-269z"/>\n    <path d="M-279,405.3l0.4-0.4c0.2-0.4,6.6-7.9,6.6-12.9c0-3.9-3.1-7-7-7s-7,3.1-7,7c0,5,6.3,12.5,6.6,12.8L-279,405.3z M-279,386c3.3,0,6,2.7,6,6c0,4-4.6,10-6,11.7c-1.4-1.7-6-7.7-6-11.7C-285,388.7-282.3,386-279,386z"/>\n    <path d="M-275,392c0-2.2-1.8-4-4-4s-4,1.8-4,4s1.8,4,4,4S-275,394.2-275,392z M-282,392c0-1.7,1.3-3,3-3s3,1.3,3,3s-1.3,3-3,3S-282,393.7-282,392z"/>\n    <path d="M-268,387.9v6.6c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-6.6c0.6-0.2,1-0.8,1-1.4c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5C-269,387.2-268.6,387.7-268,387.9z M-267.5,386c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5s-0.5-0.2-0.5-0.5S-267.8,386-267.5,386z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-gravity-forms']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-gravity-forms ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266.7,390.2l-6.5-3.8c-1.1-0.6-2.4-0.6-3.5,0l-6.6,3.8c-1.1,0.6-1.7,1.8-1.7,3v7.5c0,1.2,0.7,2.4,1.8,3l6.5,3.8c0.5,0.3,1.1,0.5,1.8,0.5c0.7,0,1.2-0.2,1.8-0.5l6.5-3.8c1.1-0.6,1.8-1.8,1.8-3v-7.5C-265,392-265.6,390.8-266.7,390.2zM-266,400.8c0,0.9-0.5,1.7-1.2,2.2l-6.5,3.8c-0.8,0.4-1.7,0.4-2.5,0l-6.5-3.8c-0.8-0.5-1.3-1.3-1.3-2.2v-7.5c0-0.9,0.5-1.7,1.2-2.2l6.5-3.8c0.4-0.2,0.9-0.3,1.3-0.3s0.9,0.1,1.2,0.3l6.5,3.8c0.8,0.4,1.2,1.3,1.2,2.2v7.5H-266z"/>\n    <path d="M-282,398.5v2.5h14v-4h-3v1h-7.9c0.2-1.1,1.2-2,2.4-2h8.5v-3h-8.5C-279.5,393-282,395.5-282,398.5zM-269,395h-7.5c-1.9,0-3.5,1.6-3.5,3.5v0.5h10v-1h1v2h-12v-1.5c0-2.5,2-4.5,4.5-4.5h7.5V395z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-heading']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-heading ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <circle cx="-275" cy="395.5" r="1.5"/>\n    <path d="M-280.5,392h11c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-0.5v-0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v0.5h-0.5c-0.3,0-0.5,0.2-0.5,0.5S-280.8,392-280.5,392z"/>\n    <path d="M-272,395.5c0,0.3,0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5C-271.8,395-272,395.2-272,395.5z"/>\n    <path d="M-283.5,396h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-283.8,396-283.5,396z"/>\n    <path d="M-264.5,400h-21c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h21c0.3,0,0.5-0.2,0.5-0.5S-264.2,400-264.5,400z"/>\n    <path d="M-267.5,403h-15c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h15c0.3,0,0.5-0.2,0.5-0.5S-267.2,403-267.5,403z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-icon-list']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-icon-list ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-286,391h4c0.6,0,1-0.4,1-1v-4c0-0.6-0.4-1-1-1h-4c-0.6,0-1,0.4-1,1v4C-287,390.6-286.6,391-286,391zM-282,390h-4v-4h4V390"/>\n    <path d="M-284,400c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S-285.7,400-284,400z M-284,395c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S-285.1,395-284,395z"/>\n    <path d="M-283.1,403.2c-0.4-0.6-1.4-0.6-1.7,0l-2.5,4.3c-0.2,0.3-0.2,0.7,0,1c0.1,0.3,0.4,0.5,0.8,0.5h5c0.4,0,0.7-0.2,0.9-0.5c0.2-0.3,0.2-0.7,0-1L-283.1,403.2z M-286.5,408l2.5-4.3l2.5,4.3H-286.5z"/>\n    <path d="M-277.5,389h14.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-14.5c-0.3,0-0.5,0.2-0.5,0.5S-277.8,389-277.5,389z"/>\n    <path d="M-263,397h-14.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h14.5c0.3,0,0.5-0.2,0.5-0.5S-262.7,397-263,397z"/>\n    <path d="M-263,406h-14.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h14.5c0.3,0,0.5-0.2,0.5-0.5S-262.7,406-263,406z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-icon']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-icon ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266,397.4l2.1-11.4H-274v-1h1.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1.5v1h-10.1l1.1,5.1c0.1,0.3,0.3,0.4,0.6,0.4c0.3-0.1,0.4-0.3,0.4-0.6l-0.9-3.9h19.8l-1.8,10h-1.6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1.7l3.3,5h-2l-12.4-12.4c-0.9-0.9-2.6-0.9-3.5,0l-4.2,4.2c-1,1-1,2.6,0,3.5l4.8,4.7h-5.8l1-1.7c0.1-0.2,0.1-0.5-0.2-0.7c-0.3-0.2-0.5-0.1-0.7,0.2l-1.5,2.6v6.6h26v-6.7L-266,397.4z M-284.9,397.6c-0.6-0.6-0.6-1.5,0-2.1l4.2-4.2c0.6-0.6,1.5-0.6,2.1,0l11.8,11.7h-12.6L-284.9,397.6z M-287,409v-5h24v5H-287z"/>\n    <path d="M-272.5,406h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-272.2,406-272.5,406z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-image']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-image ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266.5,388h-17c-0.8,0-1.5,0.7-1.5,1.5v15c0,0.8,0.7,1.5,1.5,1.5h17c0.8,0,1.5-0.7,1.5-1.5v-15C-265,388.7-265.7,388-266.5,388z M-266,389.5v2.4c-0.7,0.7-1.6,1.1-2.5,1.1l0,0c-1.9,0-3.5-1.6-3.5-3.5c0-0.2,0-0.3,0.1-0.5h5.4C-266.2,389-266,389.2-266,389.5z M-283.5,389h10.5c0,0.2,0,0.3,0,0.5c0,2.5,2,4.5,4.5,4.5l0,0c0.9,0,1.8-0.3,2.5-0.8v6.1l-2.8-2.8c-0.4-0.4-1-0.4-1.4,0l-2.8,2.8l-4.8-4.8c-0.4-0.4-1-0.4-1.4,0l-4.8,4.8v-9.8C-284,389.2-283.8,389-283.5,389z M-284,404.5v-3.8l5.5-5.5l9.8,9.8h-14.8C-283.8,405-284,404.8-284,404.5z M-266.5,405h-0.8l-5-5l2.8-2.8l3.5,3.5v3.8C-266,404.8-266.2,405-266.5,405z"/>\n    <path d="M-265.5,386h-19c-1.4,0-2.5,1.1-2.5,2.5v17c0,1.4,1.1,2.5,2.5,2.5h19c1.4,0,2.5-1.1,2.5-2.5v-17C-263,387.1-264.1,386-265.5,386z M-264,405.5c0,0.8-0.7,1.5-1.5,1.5h-19c-0.8,0-1.5-0.7-1.5-1.5v-17c0-0.8,0.7-1.5,1.5-1.5h19c0.8,0,1.5,0.7,1.5,1.5V405.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-info-table']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-info-table ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266,385h-18c-0.6,0-1,0.4-1,1v21c0,0.6,0.4,1,1,1h18c0.6,0,1-0.4,1-1v-21C-265,385.4-265.4,385-266,385z M-284,407v-21h18v21H-284z M-266,407.5V407l0,0V407.5z"/>\n    <path d="M-278,394c0,1.7,1.3,3,3,3s3-1.3,3-3s-1.3-3-3-3S-278,392.3-278,394z M-273,394c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S-273,392.9-273,394z"/>\n    <path d="M-278.5,389h7c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-7c-0.3,0-0.5,0.2-0.5,0.5S-278.8,389-278.5,389z"/>\n    <path d="M-268.5,399h-11c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h11c0.3,0,0.5-0.2,0.5-0.5S-268.2,399-268.5,399z"/>\n    <path d="M-268.5,401h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-268.2,401-268.5,401z"/>\n    <path d="M-268.5,403h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-268.2,403-268.5,403z"/>\n    <path d="M-271.5,405h-10c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h10c0.3,0,0.5-0.2,0.5-0.5S-271.2,405-271.5,405z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-interactive-banner']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-interactive-banner ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265,385h-21v9h21V385z M-266,393h-19v-7h19V393z"/>\n    <path d="M-282.5,391h10c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-10c-0.3,0-0.5,0.2-0.5,0.5S-282.8,391-282.5,391z"/>\n    <path d="M-282.5,403h10c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-10c-0.3,0-0.5,0.2-0.5,0.5S-282.8,403-282.5,403z"/>\n    <path d="M-269,404.5c0-0.3-0.2-0.5-0.5-0.5h-11c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h11C-269.2,405-269,404.8-269,404.5z"/>\n    <path d="M-282.5,407h11c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-11c-0.3,0-0.5,0.2-0.5,0.5S-282.8,407-282.5,407z"/>\n    <polygon points="-281.6,395.6 -282.4,396.4 -279.5,399.2 -276.6,396.4 -277.4,395.6 -279.5,397.8 	"/>\n    <path d="M-263.1,406.1l-2.2-2.1h1.3v-1h-3v3h1v-1.3l2.1,2.1c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1C-263,406.7-263,406.3-263.1,406.1z"/>\n    <path d="M-265.5,407c-0.3,0-0.5,0.2-0.5,0.5v0.5h-19v-7h19v0.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V400h-21v9h21v-1.5C-265,407.2-265.2,407-265.5,407z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-layerslider']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-layerslider ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1388 3226 30 30" style="enable-background:new -1388 3226 30 30;" xml:space="preserve">\n  <g>\n    <path d="M-1373,3243.2l6.9-6.9c0.3-0.3,0.4-0.7,0.4-1.1c0-0.4-0.2-0.8-0.4-1.1l-5.8-5.8c-0.6-0.6-1.6-0.6-2.2,0l-5.8,5.9c-0.3,0.3-0.4,0.7-0.4,1.1c0,0.4,0.2,0.8,0.4,1.1L-1373,3243.2z M-1379.2,3234.9l5.8-5.8c0.1-0.1,0.3-0.1,0.4-0.1s0.3,0.1,0.4,0.2l5.8,5.8c0.1,0.1,0.2,0.2,0.2,0.4c0,0.1-0.1,0.3-0.2,0.4l-6.2,6l-6.2-6.2c-0.1-0.1-0.1-0.2-0.1-0.3C-1379.3,3235.2-1379.3,3235-1379.2,3234.9z"/>\n    <path d="M-1360.4,3239.9l-2.6-2.6c-0.6-0.6-1.5-0.6-2.1,0l-7.9,7.5l-7.6-7.6c-0.4-0.4-0.8-0.5-1.1-0.5c-0.6,0-1.1,0.4-1.3,0.9s-0.1,0.9,0.2,1.3l9.5,9.5c0.2,0.2,0.5,0.2,0.7,0l8.6-8.2l0.8,0.8l-9.8,9.8l-10.7-10.7c-0.7-0.7-1.8-0.5-2.3,0.3c-0.2,0.4-0.2,0.9,0,1.3c0,0,0,0.1,0.1,0.1l11.8,11.8c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.2,1.1-0.4l11.6-11.6C-1359.8,3241.5-1359.8,3240.5-1360.4,3239.9z M-1361.1,3241.4l-11.5,11.5c-0.2,0.2-0.5,0.2-0.7,0l-11.8-11.7c0-0.1,0-0.2,0-0.3c0.1-0.2,0.5-0.3,0.7-0.1l11,11c0.2,0.2,0.5,0.2,0.7,0l10.5-10.5c0.2-0.2,0.2-0.5,0-0.7l-1.5-1.5c-0.2-0.2-0.5-0.2-0.7,0l-8.6,8.2l-9.1-9.1c0-0.1,0-0.2,0-0.2c0.1-0.2,0.4-0.5,0.8-0.1l8,8c0.2,0.2,0.5,0.2,0.7,0l8.3-7.8c0.2-0.2,0.5-0.2,0.7,0l2.6,2.6C-1360.9,3240.8-1360.9,3241.2-1361.1,3241.4z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-lightbox']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-lightbox ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-275,386c-3.3,0-6,2.7-6,6c0,1.3,0.4,3.1,1.3,4.3c1,1.2,1.7,2.4,1.7,4.2v0.5h5.5h0.5v-0.7c0-1.6,0.5-3.2,1.5-4.5c0.9-1.2,1.5-2.8,1.5-3.8C-269,388.7-271.7,386-275,386z M-271.3,395.2c-1,1.4-1.6,3.1-1.7,4.8h-4c-0.1-1.6-0.7-2.9-1.9-4.4c-0.6-0.7-1.1-2.3-1.1-3.6c0-2.8,2.2-5,5-5s5,2.2,5,5C-270,392.7-270.5,394-271.3,395.2z"/>\n    <path d="M-272.5,402h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-272.2,402-272.5,402z"/>\n    <path d="M-272.5,404h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-272.2,404-272.5,404z"/>\n    <path d="M-274.5,406h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1c0.3,0,0.5-0.2,0.5-0.5S-274.2,406-274.5,406z"/>\n    <path d="M-273.5,393h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-273.2,393-273.5,393z"/>\n    <path d="M-266.5,389c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h2.5v12h-5.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5.5c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7v-13H-266.5z"/>\n    <path d="M-280.5,402h-5.5v-12h2.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-3.5v13c0,0.3,0.1,0.5,0.3,0.7c0.2,0.2,0.4,0.3,0.7,0.3h5.5c0.3,0,0.5-0.2,0.5-0.5S-280.2,402-280.5,402z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-line']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-line ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-281.5,387h16c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-16c-0.3,0-0.5,0.2-0.5,0.5S-281.8,387-281.5,387z"/>\n    <path d="M-284.5,389h19c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-19c-0.3,0-0.5,0.2-0.5,0.5S-284.8,389-284.5,389z"/>\n    <path d="M-284.5,391h19c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-19c-0.3,0-0.5,0.2-0.5,0.5S-284.8,391-284.5,391z"/>\n    <path d="M-284.5,393h19c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-19c-0.3,0-0.5,0.2-0.5,0.5S-284.8,393-284.5,393z"/>\n    <path d="M-284.5,395h11c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-11c-0.3,0-0.5,0.2-0.5,0.5S-284.8,395-284.5,395z"/>\n    <path d="M-265.5,402h-16c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h16c0.3,0,0.5-0.2,0.5-0.5S-265.2,402-265.5,402z"/>\n    <path d="M-265.5,404h-19c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h19c0.3,0,0.5-0.2,0.5-0.5S-265.2,404-265.5,404z"/>\n    <path d="M-269.5,406h-15c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h15c0.3,0,0.5-0.2,0.5-0.5S-269.2,406-269.5,406z"/>\n    <circle cx="-286.5" cy="398.5" r="0.5"/>\n    <circle cx="-284.5" cy="398.5" r="0.5"/>\n    <circle cx="-282.5" cy="398.5" r="0.5"/>\n    <circle cx="-280.5" cy="398.5" r="0.5"/>\n    <circle cx="-278.5" cy="398.5" r="0.5"/>\n    <circle cx="-276.5" cy="398.5" r="0.5"/>\n    <circle cx="-274.5" cy="398.5" r="0.5"/>\n    <circle cx="-272.5" cy="398.5" r="0.5"/>\n    <circle cx="-270.5" cy="398.5" r="0.5"/>\n    <circle cx="-268.5" cy="398.5" r="0.5"/>\n    <circle cx="-266.5" cy="398.5" r="0.5"/>\n    <circle cx="-264.5" cy="398.5" r="0.5"/>\n    <circle cx="-262.5" cy="398.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-mailchimp']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-mailchimp ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n	<path d="M-264.3,401.9c-0.1-0.3-0.4-0.4-0.6-0.5c-0.1,0-0.1,0-0.2-0.1c0-0.2,0-0.4,0-0.5c0.5-0.4,0.5-1.3,0.5-1.9c0-0.9-1.8-1.9-2.5-2.3c0-2.2-0.2-3.3-0.5-3.9c0-0.4,0-0.9-0.3-1.3c0.8-1,1.6-2.6,1.5-3.9c-0.1-0.6-0.4-1.2-0.8-1.5c-1.6-1.1-4.1-0.2-5.2,0.3c-0.1-0.1-0.1-0.2-0.2-0.2c-0.3-0.4-0.7-0.8-1.1-1.1h-0.1c-1.7-0.6-3.8,0.4-7.5,3.6c-3.8,3.2-4.2,5.9-4.2,6.9c0,0.8,0.3,1.3,0.5,1.7c-0.3,0.5-0.5,1.2-0.5,1.8c0,1.3,0.7,2.4,1.8,3.1c0.5,0.3,1,0.4,1.6,0.4c0.7,2,2.7,6.7,9.1,6.7c0.7,0,1.4,0,2.1-0.2c1.7-0.2,4.2-1.4,6.4-5.8C-264.3,402.7-264.1,402.3-264.3,401.9z M-266,401.7v0.2l0.1,0.1l0,0c-0.7,0.5-1.7,1.3-2.3,1.5c-1.5,0.4-4.1,0.3-4.6-0.4c-0.1-0.1-0.2-0.3,0.2-0.8c0.3-0.4,0.9-0.5,2-0.6c1.2-0.1,2.8-0.2,4.6-1.1l0,0C-266,401-266,401.4-266,401.7z M-265.5,399c0,0.1,0,0.1,0,0.2c-2.1,1.3-3.8,1.4-5.2,1.5c-1.2,0.1-2.2,0.1-2.7,1c-0.6,0.9-0.4,1.6-0.1,2c0.6,0.8,2,1.1,3.3,1.1c0.9,0,1.8-0.1,2.4-0.3c0.4-0.1,1.4-0.7,2.2-1.3c-0.3,0.6-0.6,1.1-1,1.6c-0.5,0.3-2.7,1.7-4.4,1.7c-2,0-3.4-1.1-4.3-3.2c-0.6-1.4,0.7-2.9,1.5-3.4l0.6-0.3l-0.5-0.5c-0.8-0.8-0.9-1.1-1.2-1.5c-0.1-0.1-0.1-0.3-0.2-0.4c-0.4-0.6-0.5-1.3-0.3-1.8c0.2-0.6,0.8-1,1.5-1.2c0.8-0.2,1.2-0.1,1.7,0.1c0.3,0.1,0.7,0.2,1.2,0.2s0.8-0.3,1.1-0.5c0.3-0.3,0.7-0.5,1.6-0.5c0.1,0.2,0.2,0.6,0.2,1.6c-0.1-0.1-0.3-0.1-0.5-0.1c-0.6,0-1,0.4-1,1s0.4,1,1,1c0.2,0,0.3-0.1,0.5-0.2c0,0.1,0,0.1,0,0.2v0.3l0.3,0.1C-266.6,398-265.6,398.8-265.5,399zM-267.8,386.9c0.2,0.2,0.4,0.4,0.4,0.8c0.1,0.9-0.6,2.3-1.2,3.1c-1.3-1.1-2.8-1.7-5.5-1.3c-2.8,0.5-5.9,4.4-7,6.1c-0.2-0.1-0.5-0.1-0.7-0.1c2.6-4.3,4.3-5.4,9.5-8.1C-270.9,386.7-268.9,386.2-267.8,386.9z M-280.7,389.4c3.2-2.8,5.2-3.8,6.5-3.4c0.3,0.2,0.6,0.5,0.9,0.8c0,0,0,0,0,0.1c-5.2,2.6-6.8,3.9-9.7,8.8c-0.1,0-0.3,0.1-0.4,0.1c-0.4,0.2-0.6,0.3-0.9,0.6c-0.1-0.2-0.2-0.5-0.2-0.9C-284.5,394.8-284.2,392.4-280.7,389.4z M-271.1,408c-7,1-9.2-3.3-10.1-5.6c0.4-0.1,0.8-0.3,1.2-0.5l-0.4-0.9c-0.9,0.6-1.9,0.6-2.8,0.2c-0.8-0.5-1.3-1.3-1.3-2.2c0-1,0.6-1.9,1.5-2.3c0.9-0.4,2-0.2,3,0.5c-0.6-0.3-1.3-0.3-1.9,0c-0.7,0.4-1.1,1.1-1.1,1.8s0.4,1.3,0.9,1.7c0.4,0.2,0.7,0.3,1.1,0.3c0.3,0,0.7-0.1,1-0.2l-0.4-0.9c-0.5,0.2-0.9,0.1-1.1,0c-0.3-0.2-0.5-0.6-0.5-0.9c0-0.4,0.2-0.7,0.5-0.9c0.4-0.2,0.8-0.1,1.2,0.1l0.6-0.8c0,0,0,0-0.1,0l0.6-0.7c-0.3-0.3-0.6-0.5-0.9-0.6c1.1-1.7,3.9-5.1,6.2-5.5c2.9-0.5,4,0.3,5.1,1.4c0.2,0.2,0.3,0.4,0.3,0.7c-1.1,0.1-1.6,0.4-2,0.7c-0.2,0.2-0.3,0.3-0.5,0.3c-0.3,0-0.6-0.1-0.9-0.1c-0.5-0.2-1.2-0.3-2.2-0.1s-1.8,0.9-2.1,1.8c-0.2,0.6-0.4,1.6,0.3,2.7c0.1,0.1,0.2,0.3,0.2,0.4c0.2,0.4,0.4,0.7,0.9,1.3c-1.1,0.9-2.1,2.6-1.4,4.3c1.3,3.2,3.5,3.8,5.2,3.8c0.7,0,1.5-0.2,2.3-0.5C-269.6,407.6-270.4,407.9-271.1,408z"/>\n	<circle cx="-272" cy="397" r="1"/>\n	<circle cx="-269.5" cy="398.5" r="0.5"/>\n	<circle cx="-268.5" cy="398.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-map-embed']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-map-embed ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-275,385c-3.9,0-7,3.1-7,7c0,5,6.3,12.5,6.6,12.8l0.4,0.4l0.4-0.4c0.2-0.3,6.6-7.8,6.6-12.8C-268,388.1-271.1,385-275,385z M-275,403.7c-1.4-1.7-6-7.7-6-11.7c0-3.3,2.7-6,6-6s6,2.7,6,6C-269,396-273.6,402-275,403.7z"/>\n    <path d="M-275,388c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S-272.8,388-275,388z M-275,395c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S-273.3,395-275,395z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-modal']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-modal ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-264,386h-22c-0.6,0-1,0.4-1,1v1v18v1c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-20C-263,386.4-263.4,386-264,386z M-286,387h22v1h-22V387z M-286,389h22v16h-22V389z M-286,407v-1h22v1H-286z M-264,407.5V407l0,0V407.5z"/>\n    <polygon points="-265.4,389.6 -267,391.3 -268.6,389.6 -269.4,390.4 -267.7,392 -269.4,393.6 -268.6,394.4 -267,392.7 -265.4,394.4 -264.6,393.6 -266.3,392 -264.6,390.4 	"/>\n    <path d="M-272,391h-6c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1v-10C-271,391.4-271.5,391-272,391z M-272,394.8c-0.3,0.1-0.7,0.2-1,0.2c-1.8,0-3.2-1.3-3.5-3h4.5V394.8z M-277.5,392c0.3,2.2,2.1,4,4.5,4c0.3,0,0.7,0,1-0.1v2.4l-0.8-0.8c-0.4-0.4-1-0.4-1.4,0l-1.3,1.3l-2.5-2.5V392H-277.5z M-278,397.7l4.3,4.3h-4.3V397.7z M-272.3,402l-2.5-2.5l1.3-1.3l1.5,1.5v2.3H-272.3z M-272,402.5V402l0,0V402.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-pricing-table']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-pricing-table ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-264,388h-4.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4.5v2h-4.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4.5v15h-4.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4.5c0.6,0,1-0.4,1-1v-18C-263,388.4-263.4,388-264,388z"/>\n    <path d="M-281.5,407h-4.5v-15h4.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4.5v-2h4.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4.5c-0.6,0-1,0.4-1,1v18c0,0.6,0.4,1,1,1h4.5c0.3,0,0.5-0.2,0.5-0.5S-281.2,407-281.5,407z"/>\n    <path d="M-270,389.5L-270,389.5V385c0-0.6-0.4-1-1-1h-8c-0.6,0-1,0.4-1,1v4.5l0,0l0,0v5l0,0l0,0V409c0,0.6,0.4,1,1,1h8c0.6,0,1-0.4,1-1v-14.5l0,0l0,0V389.5L-270,389.5z M-279,390h8v4h-8V390z M-271,385v4h-8v-4H-271z M-271,409.5V409h-8v-14h8v14V409.5z"/>\n    <path d="M-272.5,398h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-272.2,398-272.5,398z"/>\n    <path d="M-277.5,387h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-277.8,387-277.5,387z"/>\n    <path d="M-272.5,400h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-272.2,400-272.5,400z"/>\n    <path d="M-272.5,402h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-272.2,402-272.5,402z"/>\n    <path d="M-269,397.5c0,0.3,0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-3C-268.8,397-269,397.2-269,397.5z"/>\n    <path d="M-268.5,400h3c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-3c-0.3,0-0.5,0.2-0.5,0.5S-268.8,400-268.5,400z"/>\n    <path d="M-268.5,402h3c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-3c-0.3,0-0.5,0.2-0.5,0.5S-268.8,402-268.5,402z"/>\n    <path d="M-273,405h-4c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h4c0.6,0,1-0.4,1-1v-1C-272,405.4-272.4,405-273,405zM-277,407v-1h4v1H-277z M-273,407.5V407l0,0V407.5z"/>\n    <path d="M-268.5,405c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h2.5c0.6,0,1-0.4,1-1v-1c0-0.6-0.4-1-1-1h-2.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h2.5v1H-268.5z"/>\n    <path d="M-281.5,404c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-2.5c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h2.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-2.5v-1H-281.5z"/>\n    <circle cx="-275" cy="392" r="1"/>\n    <circle cx="-283" cy="394" r="1"/>\n    <circle cx="-267" cy="394" r="1"/>\n    <circle cx="-277.5" cy="398.5" r="0.5"/>\n    <circle cx="-277.5" cy="400.5" r="0.5"/>\n    <circle cx="-277.5" cy="402.5" r="0.5"/>\n    <path d="M-281.5,397h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1c0.3,0,0.5-0.2,0.5-0.5S-281.2,397-281.5,397z"/>\n    <path d="M-281.5,399h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1c0.3,0,0.5-0.2,0.5-0.5S-281.2,399-281.5,399z"/>\n    <path d="M-281.5,401h-1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1c0.3,0,0.5-0.2,0.5-0.5S-281.2,401-281.5,401z"/>\n    <circle cx="-284.5" cy="397.5" r="0.5"/>\n    <circle cx="-284.5" cy="399.5" r="0.5"/>\n    <circle cx="-284.5" cy="401.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-promo']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-promo ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-267.5,385h-15c-0.8,0-1.5,0.7-1.5,1.5v5.3v1.2v14.5c0,0.8,0.7,1.5,1.5,1.5h15c0.8,0,1.5-0.7,1.5-1.5V393v-5v-1.5C-266,385.7-266.7,385-267.5,385z M-267,386.5v2.2c-0.1,0.1-0.2,0.1-0.3,0.1c-0.1,0-0.1,0.1-0.2,0.1s-0.2,0-0.2,0c-0.7,0.1-1.3-0.1-1.7-0.5s-0.6-1.1-0.6-1.7c0-0.1,0-0.2,0-0.2c0-0.1,0-0.2,0.1-0.2c0-0.1,0.1-0.2,0.1-0.3h2.2C-267.2,386-267,386.2-267,386.5z M-283,386.5c0-0.3,0.2-0.5,0.5-0.5h11.7c-0.1,0.3-0.2,0.7-0.2,1c0,1.7,1.3,3,3,3c0.3,0,0.7-0.1,1-0.2v2.2h-2.3l-2.6-2.6c-0.6-0.6-1.5-0.6-2.1,0l-1.2,1.2l-2.7-2.7c-0.6-0.6-1.5-0.6-2.1,0l-3,2.9V386.5zM-279.4,388.6c0.2-0.2,0.5-0.2,0.7,0l3.4,3.4l1.9-1.9c0.2-0.2,0.5-0.2,0.7,0l1.9,1.9h-12L-279.4,388.6z M-267,407.5c0,0.3-0.2,0.5-0.5,0.5h-15c-0.3,0-0.5-0.2-0.5-0.5V393h13.3h1.4h1.3V407.5z"/>\n    <path d="M-269.5,394h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-269.2,394-269.5,394z"/>\n    <path d="M-269.5,396h-11c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h11c0.3,0,0.5-0.2,0.5-0.5S-269.2,396-269.5,396z"/>\n    <path d="M-269.5,398h-11c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h11c0.3,0,0.5-0.2,0.5-0.5S-269.2,398-269.5,398z"/>\n    <path d="M-271.5,401c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5H-271.5z"/>\n    <path d="M-270.5,403h-9c-0.8,0-1.5,0.7-1.5,1.5v1c0,0.8,0.7,1.5,1.5,1.5h9c0.8,0,1.5-0.7,1.5-1.5v-1C-269,403.7-269.7,403-270.5,403z M-270,405.5c0,0.3-0.2,0.5-0.5,0.5h-9c-0.3,0-0.5-0.2-0.5-0.5v-1c0-0.3,0.2-0.5,0.5-0.5h9c0.3,0,0.5,0.2,0.5,0.5V405.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-prompt']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-prompt ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-265.5,390h-19c-1.4,0-2.5,1.1-2.5,2.5v9c0,1.4,1.1,2.5,2.5,2.5h19c1.4,0,2.5-1.1,2.5-2.5v-9C-263,391.1-264.1,390-265.5,390z M-264,401.5c0,0.8-0.7,1.5-1.5,1.5h-19c-0.8,0-1.5-0.7-1.5-1.5v-9c0-0.8,0.7-1.5,1.5-1.5h19c0.8,0,1.5,0.7,1.5,1.5V401.5z"/>\n    <path d="M-283.6,394h3.1c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-3.1c-0.3,0-0.5,0.2-0.5,0.5S-283.9,394-283.6,394z"/>\n    <path d="M-275.5,396h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-275.2,396-275.5,396z"/>\n    <path d="M-275.5,398h-8.1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8.1c0.3,0,0.5-0.2,0.5-0.5S-275.2,398-275.5,398z"/>\n    <path d="M-279.5,400h-4.1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4.1c0.3,0,0.5-0.2,0.5-0.5S-279.2,400-279.5,400z"/>\n    <path d="M-267,396h-5c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h5c0.6,0,1-0.4,1-1v-1C-266,396.4-266.4,396-267,396zM-272,398v-1h5v1H-272z M-267,398.5V398l0,0V398.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-protect']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-protect ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-269,393.3V390l0,0l0,0c0-3.3-2.7-6-6-6s-6,2.7-6,6v3.3c-1.8,1.6-3,4-3,6.7c0,5,4,9,9,9s9-4,9-9C-266,397.3-267.2,395-269,393.3z M-280,390c0-2.8,2.2-5,5-5s5,2.2,5,5.1v2.4c-1.4-1-3.2-1.5-5-1.5s-3.6,0.6-5,1.5V390z M-275,408c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S-270.6,408-275,408z"/>\n    <path d="M-275,397c-1.7,0-3,1.3-3,3c0,1.3,0.8,2.4,2,2.8v3.2h2v-3.2c1.2-0.4,2-1.5,2-2.8C-272,398.3-273.3,397-275,397z M-275,402c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S-273.9,402-275,402z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-pullquote']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-pullquote ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-262.5,403h-25c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h25c0.3,0,0.5-0.2,0.5-0.5S-262.2,403-262.5,403z"/>\n    <path d="M-262.5,400h-25c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h25c0.3,0,0.5-0.2,0.5-0.5S-262.2,400-262.5,400z"/>\n    <path d="M-262.5,397h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-262.2,397-262.5,397z"/>\n    <path d="M-262.5,394h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-262.2,394-262.5,394z"/>\n    <path d="M-262.5,391h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-262.2,391-262.5,391z"/>\n    <path d="M-269.5,389h7c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-7c-0.3,0-0.5,0.2-0.5,0.5S-269.8,389-269.5,389z"/>\n    <path d="M-274.5,406h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-274.2,406-274.5,406z"/>\n    <path d="M-284,398.6c2.2,0,4-1.8,4-4c0-1.8-1.2-3.4-2.9-3.9c0.2-0.3,0.9-1.2,1.5-1.8c0.2-0.2,0.3-0.6,0.2-0.9c-0.1-0.3-0.4-0.5-0.8-0.5h-0.2c-3.3,0.7-5.8,3.6-5.8,7.1C-288,396.8-286.2,398.6-284,398.6z M-282.5,388.6c-0.6,0.7-1.5,1.8-1.4,2.5c0.1,0.3,0.3,0.5,0.6,0.5c1.4,0.4,2.3,1.6,2.3,3c0,1.7-1.4,3-3,3s-3-1.4-3-3C-287,391.8-285.1,389.4-282.5,388.6z"/>\n    <path d="M-275,398.6c2.2,0,4-1.8,4-4c0-1.8-1.2-3.4-2.9-3.9c0.2-0.4,0.8-1.2,1.4-1.8c0.2-0.2,0.3-0.6,0.2-0.9c-0.1-0.3-0.4-0.5-0.8-0.5h-0.2c-3.3,0.7-5.7,3.6-5.7,7.1C-279,396.8-277.2,398.6-275,398.6z M-273.6,388.6c-0.6,0.7-1.5,1.8-1.3,2.5c0.1,0.3,0.3,0.5,0.6,0.5c1.4,0.3,2.3,1.5,2.3,2.9c0,1.7-1.4,3-3,3s-3-1.4-3-3C-278,391.8-276.2,389.4-273.6,388.6z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-raw-content']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-raw-content ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <g>\n      <polygon points="-282.6,398.4 -283.4,397.6 -280.2,394.5 -283.4,391.4 -282.6,390.6 -278.8,394.5"/>\n    </g>\n    <g>\n      <path d="M-264,408h-22c-0.6,0-1-0.4-1-1v-20c0-0.6,0.4-1,1-1h22c0.6,0,1,0.4,1,1v20C-263,407.6-263.4,408-264,408zM-264,407v0.5V407z M-286,387v20h22v-20H-286z"/>\n    </g>\n    <g>\n      <rect x="-279" y="397" width="5" height="1"/>\n    </g>\n  </g>\n</svg>';

}
return __p
};templates['element-raw-html']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-raw-html ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <polygon points="-269.4,400.4 -267.2,402.5 -269.4,404.6 -268.6,405.4 -265.8,402.5 -268.6,399.6 	"/>\n    <polygon points="-281.4,399.6 -284.2,402.5 -281.4,405.4 -280.6,404.6 -282.8,402.5 -280.6,400.4 	"/>\n    <rect x="-273" y="398.9" transform="matrix(0.9487 0.3162 -0.3162 0.9487 113.1446 106.7969)" width="1" height="6.3"/>\n    <path d="M-283.5,397c0.3,0,0.5-0.2,0.5-0.5V393h1v3.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-7c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v2.5h-1v-2.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v7C-284,396.8-283.8,397-283.5,397z"/>\n    <path d="M-277.5,389h-2c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h0.5v6.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V390h0.5c0.3,0,0.5-0.2,0.5-0.5S-277.2,389-277.5,389z"/>\n    <path d="M-268.5,397h2c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-1.5v-6.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v7C-269,396.8-268.8,397-268.5,397z"/>\n    <path d="M-264,386h-22c-0.6,0-1,0.4-1,1v20c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-20C-263,386.4-263.4,386-264,386z M-286,407v-20h22v20H-286z M-264,407.5V407l0,0V407.5z"/>\n    <path d="M-272.5,389c-0.4,0-0.7,0.2-1,0.4c-0.3-0.2-0.6-0.4-1-0.4c-0.8,0-1.5,0.7-1.5,1.5v6c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-6c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v6c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-6c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v6c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-6C-271,389.7-271.7,389-272.5,389z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-recent-posts']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-recent-posts ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-274,394.5c0-0.3-0.2-0.5-0.5-0.5h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7C-274.2,395-274,394.8-274,394.5z"/>\n    <path d="M-274.5,389h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-274.2,389-274.5,389z"/>\n    <path d="M-281.5,400h4c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4c-0.3,0-0.5,0.2-0.5,0.5S-281.8,400-281.5,400z"/>\n    <path d="M-281.5,405h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-281.8,405-281.5,405z"/>\n    <path d="M-265.5,407c-0.3,0-0.5,0.2-0.5,0.5v1c0,0.3-0.2,0.5-0.5,0.5h-17c-0.3,0-0.5-0.2-0.5-0.5v-23c0-0.3,0.2-0.5,0.5-0.5h11.5v4.5c0,0.8,0.7,1.5,1.5,1.5h4.5v2.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-2.8c0-0.3-0.1-0.5-0.3-0.7l-5.7-5.7c-0.2-0.2-0.5-0.3-0.7-0.3h-11.8c-0.8,0-1.5,0.7-1.5,1.5v23c0,0.8,0.7,1.5,1.5,1.5h17c0.8,0,1.5-0.7,1.5-1.5v-1C-265,407.2-265.2,407-265.5,407z M-266.6,390h-3.9c-0.3,0-0.5-0.2-0.5-0.5v-3.9L-266.6,390z"/>\n    <path d="M-269.5,394c-3.6,0-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5s6.5-2.9,6.5-6.5S-265.9,394-269.5,394z M-269.5,406c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5S-266.5,406-269.5,406z"/>\n    <path d="M-266.5,400h-2.5v-3.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v4c0,0.3,0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-266.2,400-266.5,400z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-revolution-slider']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-revolution-slider ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-264,397h-3c-0.5,0-0.9,0.4-1,0.9c-0.5,3.5-3.5,6.1-7,6.1c-1.9,0-3.8-0.8-5.1-2.2l2.1-2.1c0.3-0.3,0.4-0.7,0.2-1.1c-0.2-0.4-0.5-0.6-0.9-0.6h-7.3c-0.6,0-1,0.4-1,1v7.3c0,0.4,0.2,0.8,0.6,0.9c0.4,0.2,0.8,0.1,1.2-0.3l1.6-1.6c2.3,2.4,5.3,3.7,8.6,3.7c6.3,0,11.4-4.7,12-10.9c0-0.3-0.1-0.6-0.3-0.8C-263.5,397.1-263.8,397-264,397z M-275,408c-3,0-5.8-1.2-7.9-3.4c-0.2-0.2-0.4-0.3-0.7-0.3c-0.3,0-0.5,0.1-0.7,0.3l-1.7,1.7V399h7.3l-2.1,2.1c-0.4,0.4-0.4,1,0,1.4c1.5,1.6,3.6,2.5,5.8,2.5c4,0,7.4-3,7.9-7h3C-264.6,403.7-269.3,408-275,408z"/>\n    <path d="M-263.6,387.8c-0.4-0.2-0.8-0.1-1.1,0.2l-1.2,1.2c-2.3-2.7-5.6-4.2-9.1-4.2c-6.3,0-11.4,4.7-12,10.9c0,0.3,0.1,0.6,0.3,0.8c0.2,0.2,0.5,0.3,0.7,0.3h3c0.5,0,0.9-0.4,1-0.9c0.5-3.5,3.5-6.1,7-6.1c2.2,0,4.2,1,5.6,2.7l-1.6,1.6c-0.3,0.3-0.4,0.7-0.2,1.1c0.2,0.4,0.5,0.6,0.9,0.6h6.3c0.6,0,1-0.4,1-1v-6.3C-263,388.3-263.2,387.9-263.6,387.8z M-282.9,396.5V396l0,0V396.5z M-264,395h-6.3l1.6-1.6c0.4-0.4,0.4-0.9,0.1-1.3c-1.6-2-3.9-3.1-6.4-3.1c-4,0-7.4,3-7.9,7h-3c0.5-5.7,5.2-10,10.9-10c3.2,0,6.3,1.4,8.3,3.8c0.2,0.2,0.4,0.3,0.8,0.4c0.3,0,0.5-0.1,0.7-0.3l1.2-1.2V395z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-search']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-search ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-279,387c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S-275.7,387-279,387z M-279,398c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S-276.2,398-279,398z"/>\n    <path d="M-264.1,404.1l-5.8-5.8c-0.4-0.4-1-0.4-1.4,0l-0.4,0.4l-0.9-0.9c1-1.3,1.6-3,1.6-4.7c0-4.4-3.6-8-8-8s-8,3.6-8,8s3.6,8,8,8c2.3,0,4.3-1,5.8-2.5l0.9,0.9l-0.4,0.4c-0.4,0.4-0.4,1,0,1.4l5.8,5.8c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3l1.4-1.4C-263.7,405.1-263.7,404.5-264.1,404.1z M-279,400c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S-275.1,400-279,400z M-266.2,406.2l-5.8-5.8l1.4-1.4l5.8,5.8L-266.2,406.2z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-self-hosted-audio']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-self-hosted-audio ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-272.5,398c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c0.8,0,1.5,0.7,1.5,1.5S-271.7,398-272.5,398z"/>\n    <path d="M-272.5,401c2.5,0,4.5-2,4.5-4.5s-2-4.5-4.5-4.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c1.9,0,3.5,1.6,3.5,3.5s-1.6,3.5-3.5,3.5c-0.3,0-0.5,0.2-0.5,0.5S-272.8,401-272.5,401z"/>\n    <path d="M-272.5,403c3.6,0,6.5-2.9,6.5-6.5s-2.9-6.5-6.5-6.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5c3,0,5.5,2.5,5.5,5.5s-2.5,5.5-5.5,5.5c-0.3,0-0.5,0.2-0.5,0.5S-272.8,403-272.5,403z"/>\n    <path d="M-283,400h3.3l3,3c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.3,0,0.4-0.1c0.4-0.2,0.6-0.5,0.6-0.9v-11.6c0-0.4-0.2-0.8-0.6-0.9c-0.4-0.2-0.8-0.1-1.1,0.2l-3,3h-3.3c-0.6,0-1,0.4-1,1v5C-284,399.6-283.6,400-283,400z M-279,393.7l3-3v11.6l-3-3V393.7z M-283,394h3v5h-3V394z"/>\n    <path d="M-263.5,398c-0.3,0-0.5,0.2-0.5,0.5v6.5h-22v-6.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v6.5c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-6.5C-263,398.2-263.2,398-263.5,398z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-self-hosted-video']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-self-hosted-video ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-280.5,403h11c0.8,0,1.5-0.7,1.5-1.5v-10c0-0.8-0.7-1.5-1.5-1.5h-2l0,0l0,0h-7l0,0l0,0h-2c-0.8,0-1.5,0.7-1.5,1.5v10C-282,402.3-281.3,403-280.5,403z M-279,399h-2v-2h2V399z M-278,397h6v5h-6V397z M-271,397h2v2h-2V397zM-269,396h-2v-2h2V396z M-272,396h-6v-5h6V396z M-279,396h-2v-2h2V396z M-281,401.5V400h2v2h-1.5C-280.8,402-281,401.8-281,401.5zM-269.5,402h-1.5v-2h2v1.5C-269,401.8-269.2,402-269.5,402z M-269,391.5v1.5h-2v-2h1.5C-269.2,391-269,391.2-269,391.5zM-280.5,391h1.5v2h-2v-1.5C-281,391.2-280.8,391-280.5,391z"/>\n    <path d="M-264.5,398c-0.3,0-0.5,0.2-0.5,0.5v6.5h-20v-6.5c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v6.5c0,0.6,0.4,1,1,1h20c0.6,0,1-0.4,1-1v-6.5C-264,398.2-264.2,398-264.5,398z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-skill-bar']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-skill-bar ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-263,385h-24c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h24c0.6,0,1-0.4,1-1v-3C-262,385.4-262.4,385-263,385zM-287,389v-3h24v3H-287z M-263,389.5V389l0,0V389.5z"/>\n    <path d="M-263,391h-24c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h24c0.6,0,1-0.4,1-1v-3C-262,391.4-262.4,391-263,391zM-287,395v-3h24v3H-287z M-263,395.5V395l0,0V395.5z"/>\n    <path d="M-263,397h-24c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h24c0.6,0,1-0.4,1-1v-3C-262,397.4-262.4,397-263,397zM-287,401v-3h24v3H-287z M-263,401.5V401l0,0V401.5z"/>\n    <path d="M-263,403h-24c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h24c0.6,0,1-0.4,1-1v-3C-262,403.4-262.4,403-263,403zM-287,407v-3h24v3H-287z M-263,407.5V407l0,0V407.5z"/>\n    <path d="M-267.5,387h-18c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h18c0.3,0,0.5-0.2,0.5-0.5S-267.2,387-267.5,387z"/>\n    <path d="M-278.5,393h-7c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h7c0.3,0,0.5-0.2,0.5-0.5S-278.2,393-278.5,393z"/>\n    <path d="M-272.5,399h-13c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h13c0.3,0,0.5-0.2,0.5-0.5S-272.2,399-272.5,399z"/>\n    <path d="M-265.5,405h-20c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h20c0.3,0,0.5-0.2,0.5-0.5S-265.2,405-265.5,405z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-slider']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-slider ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-266,387h-18c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h18c0.6,0,1-0.4,1-1v-10C-265,387.4-265.4,387-266,387zM-266,388.9c-0.7,0.7-1.6,1.1-2.5,1.1l0,0c-1.4,0-2.6-0.8-3.2-2h5.7V388.9z M-272.7,388c0.6,1.8,2.3,3,4.2,3c0.9,0,1.8-0.3,2.5-0.8v5.1l-2.8-2.8c-0.4-0.4-1-0.4-1.4,0l-2.8,2.8l-4.8-4.8c-0.4-0.4-1-0.4-1.4,0l-4.8,4.8V388H-272.7zM-284,396.7l5.5-5.5l6.8,6.8H-284V396.7z M-270.3,398l-2-2l2.8-2.8l3.5,3.5v1.3H-270.3z M-266,398.5V398l0,0V398.5z"/>\n    <path d="M-265.5,385h-19c-1.4,0-2.5,1.1-2.5,2.5v11c0,1.4,1.1,2.5,2.5,2.5h19c1.4,0,2.5-1.1,2.5-2.5v-11C-263,386.1-264.1,385-265.5,385z M-264,398.5c0,0.8-0.7,1.5-1.5,1.5h-19c-0.8,0-1.5-0.7-1.5-1.5v-11c0-0.8,0.7-1.5,1.5-1.5h19c0.8,0,1.5,0.7,1.5,1.5V398.5z"/>\n    <polygon points="-268.4,403.4 -266.2,405.5 -268.4,407.6 -267.6,408.4 -264.8,405.5 -267.6,402.6     "/>\n    <polygon points="-281.6,403.4 -282.4,402.6 -285.2,405.5 -282.4,408.4 -281.6,407.6 -283.8,405.5     "/>\n    <path d="M-278.5,405h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-278.2,405-278.5,405z"/>\n    <path d="M-273.5,405h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-273.2,405-273.5,405z"/>\n    <path d="M-268,405.5c0-0.3-0.2-0.5-0.5-0.5h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3C-268.2,406-268,405.8-268,405.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-social-sharing']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-social-sharing ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-276,386.7v15.8c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-15.8l2.6,2.6l0.7-0.7l-3.9-3.9l-3.9,3.9l0.7,0.7L-276,386.7z"/>\n    <path d="M-267,392h-4.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4.5v15h-17v-15h4.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4.5c-0.3,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.4-0.3,0.7v15c0,0.5,0.4,1,1,1h17c0.5,0,1-0.4,1-1v-15C-266,392.5-266.5,392-267,392z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-soliloquy']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-soliloquy ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-280.7,398.3c-0.6-1-0.4-2.2,0.4-3l2.3-2.3v-3h-3.5l-3.1,3.1c-2.1,2.1-2.1,5.6,0,7.8l1.6,1.6V399h2.8L-280.7,398.3z M-284,398v2c-1.6-1.8-1.6-4.5,0.1-6.2l2.8-2.8h2.1v1.5l-2,2c-0.9,0.9-1.2,2.3-0.9,3.5H-284z"/>\n    <path d="M-277,391.8l0.7-0.4c1-0.5,2.2-0.4,3,0.4l2.3,2.2h3v-3.5l-3.1-3.1c-1-1-2.4-1.6-3.9-1.6s-2.9,0.6-3.9,1.6l-1.6,1.6h3.5V391.8z M-278,388c0.8-0.8,1.9-1.2,3-1.2c1.2,0,2.3,0.5,3.2,1.3l2.8,2.9v2h-1.5l-2-2c-0.9-0.9-2.3-1.2-3.5-0.9V388H-278z"/>\n    <path d="M-265.4,393.1l-1.6-1.6v3.5h-2.8l0.4,0.7c0.6,1,0.4,2.2-0.4,3l-2.2,2.3v3h3.4l3.1-3.1c1-1,1.6-2.4,1.6-3.9C-263.8,395.5-264.4,394.1-265.4,393.1z M-266.1,400.2l-2.9,2.8h-2v-1.5l2-2c0.9-0.9,1.2-2.3,0.9-3.5h2.1v-2c0.8,0.8,1.2,1.9,1.2,3C-264.8,398.2-265.3,399.3-266.1,400.2z"/>\n    <path d="M-273,402.2l-0.7,0.4c-1,0.5-2.2,0.4-3-0.4l-2.3-2.2h-3v3.5l3.1,3.1c1,1,2.4,1.6,3.9,1.6s2.8-0.6,3.9-1.6l1.6-1.6h-3.5V402.2z M-272,406c-0.8,0.8-1.9,1.2-3,1.2c-1.2,0-2.3-0.5-3.2-1.3l-2.8-2.9v-2h1.5l2,2c0.9,0.9,2.3,1.2,3.5,0.9v2.1H-272z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-table-of-contents']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-table-of-contents ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-280.5,388c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S-279.7,388-280.5,388z M-280.5,390c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5S-280.2,390-280.5,390z"/>\n    <path d="M-280.5,393c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S-279.7,393-280.5,393z M-280.5,395c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5S-280.2,395-280.5,395z"/>\n    <path d="M-268.5,394h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-268.2,394-268.5,394z"/>\n    <path d="M-277.5,390h3c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-3c-0.3,0-0.5,0.2-0.5,0.5S-277.8,390-277.5,390z"/>\n    <path d="M-280.5,398c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S-279.7,398-280.5,398z M-280.5,400c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5S-280.2,400-280.5,400z"/>\n    <path d="M-268.5,399h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-268.2,399-268.5,399z"/>\n    <path d="M-280.5,403c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S-279.7,403-280.5,403z M-280.5,405c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5S-280.2,405-280.5,405z"/>\n    <path d="M-268.5,404h-9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9c0.3,0,0.5-0.2,0.5-0.5S-268.2,404-268.5,404z"/>\n    <path d="M-265.3,390l-5.7-5.7c-0.2-0.2-0.5-0.3-0.7-0.3h-11.8c-0.8,0-1.5,0.7-1.5,1.5v23c0,0.8,0.7,1.5,1.5,1.5h17c0.8,0,1.5-0.7,1.5-1.5v-17.8C-265,390.5-265.1,390.2-265.3,390z M-271,385.6l4.4,4.4h-3.9c-0.3,0-0.5-0.2-0.5-0.5V385.6zM-266.5,409h-17c-0.3,0-0.5-0.2-0.5-0.5v-23c0-0.3,0.2-0.5,0.5-0.5h11.5v4.5c0,0.8,0.7,1.5,1.5,1.5h4.5v17.5C-266,408.8-266.2,409-266.5,409z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-tabs']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-tabs ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-279.5,387h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-279.2,387-279.5,387z"/>\n    <path d="M-284.5,392h4c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-4c-0.3,0-0.5,0.2-0.5,0.5S-284.8,392-284.5,392z"/>\n    <path d="M-266.5,389h-5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h5c0.3,0,0.5-0.2,0.5-0.5S-266.2,389-266.5,389z"/>\n    <path d="M-266.5,391h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,391-266.5,391z"/>\n    <path d="M-266.5,393h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,393-266.5,393z"/>\n    <path d="M-266.5,395h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,395-266.5,395z"/>\n    <path d="M-266.5,397h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,397-266.5,397z"/>\n    <path d="M-266.5,399h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,399-266.5,399z"/>\n    <path d="M-266.5,401h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,401-266.5,401z"/>\n    <path d="M-266.5,403h-8c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h8c0.3,0,0.5-0.2,0.5-0.5S-266.2,403-266.5,403z"/>\n    <path d="M-268.5,405h-6c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h6c0.3,0,0.5-0.2,0.5-0.5S-268.2,405-268.5,405z"/>\n    <path d="M-264,385h-22c-0.6,0-1,0.4-1,1v3.5v0.5v3.5v0.5v3.5v0.5v3c0,0.6,0.4,1,1,1h8v6c0,0.6,0.4,1,1,1h13c0.6,0,1-0.4,1-1v-22C-263,385.4-263.4,385-264,385z M-279.8,390h1.8v3h-8v-3H-279.8z M-278,394v3h-8v-3H-278z M-286,401v-3h8v3H-286z M-277,408v-18.5c0-0.5,0-0.5-2.8-0.5h-6.2v-3h22v22H-277z M-264,408.5V408l0,0V408.5z"/>\n    <path d="M-284.5,396h5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-5c-0.3,0-0.5,0.2-0.5,0.5S-284.8,396-284.5,396z"/>\n    <path d="M-281.5,399h-3c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h3c0.3,0,0.5-0.2,0.5-0.5S-281.2,399-281.5,399z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-text-slide']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-text-slide-up-effect ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-270,391.7v1.8c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-1.8l1.6,1.6l0.7-0.7l-2.9-2.9l-2.9,2.9l0.7,0.7L-270,391.7z"/>\n    <path d="M-280,390c-2.2,0-4,1.8-4,4l0,0v10.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V398h6v6.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V394l0,0C-276,391.8-277.8,390-280,390z M-283,397v-3l0,0c0-1.7,1.3-3,3-3s3,1.3,3,3l0,0v3H-283z"/>\n    <path d="M-271,395c-2.2,0-4,1.8-4,4l0,0v2c0,2.2,1.8,4,4,4c1.2,0,2.3-0.5,3-1.4v0.9c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V399l0,0C-267,396.8-268.8,395-271,395z M-271,404c-1.7,0-3-1.3-3-3v-2l0,0c0-1.7,1.3-3,3-3s3,1.3,3,3l0,0v2C-268,402.7-269.3,404-271,404z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-text-type']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-text-type-effect ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-275.5,393h9.8l-1.6,1.6l0.7,0.7l2.9-2.9l-2.9-2.9l-0.7,0.7l1.6,1.6h-9.8c-0.3,0-0.5,0.2-0.5,0.5C-276,392.6-275.8,393-275.5,393z"/>\n    <path d="M-271.5,404h-4c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4c0.3,0,0.5-0.2,0.5-0.5S-271.2,404-271.5,404z"/>\n    <path d="M-264.5,404h-4c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4c0.3,0,0.5-0.2,0.5-0.5S-264.2,404-264.5,404z"/>\n    <path d="M-282,390c-2.2,0-4,1.8-4,4l0,0v10.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V398h6v6.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V394l0,0C-278,391.8-279.8,390-282,390z M-285,397v-3l0,0c0-1.7,1.3-3,3-3s3,1.3,3,3l0,0v3H-285z"/>\n  </g>\n</svg>';

}
return __p
};templates['element-text']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-text ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <path d="M-266.5,387h-16c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V388h7v18h-1.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h4c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-1.5v-18h7v1.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-2C-266,387.2-266.2,387-266.5,387z"/>\n</svg>';

}
return __p
};templates['element-visibility']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-visibility ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-264.2,396.7c-0.2-0.2-4.2-5.3-10.2-5.7c-0.2,0-0.4,0-0.6,0s-0.4,0-0.6,0c-5.9,0.3-10,5.4-10.2,5.7l-0.2,0.3l0.2,0.3c0.2,0.2,4.2,5.3,10.2,5.7c0.2,0,0.4,0,0.6,0s0.4,0,0.6,0c5.9-0.3,10-5.4,10.2-5.7l0.2-0.3L-264.2,396.7zM-270,397c0,2.8-2.2,5-5,5s-5-2.2-5-5s2.2-5,5-5S-270,394.2-270,397z M-284.7,397c0.7-0.8,2.6-2.7,5.2-4c-0.9,1.1-1.5,2.5-1.5,4s0.6,2.9,1.5,4C-282.2,399.7-284.1,397.8-284.7,397z M-270.5,401c0.9-1.1,1.5-2.4,1.5-4c0-1.5-0.6-2.9-1.5-4c2.7,1.2,4.6,3.2,5.2,4C-265.9,397.8-267.8,399.7-270.5,401z"/>\n    <path d="M-275,399c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S-276.1,399-275,399z M-275,396c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S-275.6,396-275,396z"/>\n    <circle cx="-277.5" cy="394.5" r="0.5"/>\n  </g>\n</svg>';

}
return __p
};templates['element-widget-area']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/element-widget-area ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g><path d="M-268.8,411h-12.5c-2.6,0-4.7-2.1-4.7-4.7v-18.7c0-2.6,2.1-4.7,4.7-4.7h12.5c2.6,0,4.7,2.1,4.7,4.7v18.7C-264.2,408.9-266.2,411-268.8,411z M-281.3,384c-2,0-3.6,1.7-3.6,3.6v18.7c0,2,1.7,3.6,3.6,3.6h12.5c2,0,3.6-1.7,3.6-3.6v-18.7c0-2-1.7-3.6-3.6-3.6H-281.3z"/></g>\n  <g><path d="M-277.2,393.3c-0.2,0-0.4-0.1-0.5-0.3l-2.1-5.2c-0.1-0.3,0-0.5,0.3-0.6c0.3-0.1,0.5,0,0.6,0.3l2.1,5.2c0.1,0.3,0,0.5-0.3,0.6C-277.1,393.3-277.1,393.3-277.2,393.3z"/></g>\n  <g><path d="M-277.2,393.3c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.3-0.4-0.2-0.7l2.1-4.2c0.1-0.2,0.4-0.3,0.7-0.2s0.3,0.4,0.2,0.7l-2.1,4.2C-276.7,393.2-277,393.3-277.2,393.3z"/></g>\n  <g><path d="M-273,393.3c-0.2,0-0.4-0.1-0.4-0.3l-2.1-4.2c-0.1-0.2,0-0.5,0.2-0.7c0.2-0.2,0.5,0,0.7,0.2l2.1,4.2c0.1,0.2,0,0.5-0.2,0.7C-272.8,393.3-272.9,393.3-273,393.3z"/></g>\n  <g><path d="M-273,393.3c-0.1,0-0.1,0-0.2,0c-0.3-0.1-0.4-0.4-0.3-0.6l2.1-5.2c0.1-0.3,0.4-0.4,0.6-0.3c0.2,0.1,0.4,0.4,0.3,0.6l-2.1,5.2C-272.6,393.2-272.8,393.3-273,393.3z"/></g>\n  <g><path d="M-277.2,406.8c-0.2,0-0.4-0.1-0.5-0.3l-2.1-5.2c-0.1-0.3,0-0.5,0.3-0.6c0.3-0.1,0.5,0,0.6,0.3l2.1,5.2c0.1,0.3,0,0.5-0.3,0.6C-277.1,406.8-277.1,406.8-277.2,406.8z"/></g>\n  <g><path d="M-277.2,406.8c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.3-0.4-0.2-0.7l2.1-4.2c0.1-0.2,0.4-0.3,0.7-0.2s0.3,0.4,0.2,0.7l-2.1,4.2C-276.7,406.7-277,406.8-277.2,406.8z"/></g>\n  <g><path d="M-273,406.8c-0.2,0-0.4-0.1-0.4-0.3l-2.1-4.2c-0.1-0.2,0-0.5,0.2-0.7c0.2-0.2,0.5,0,0.7,0.2l2.1,4.2c0.1,0.2,0,0.5-0.2,0.7C-272.8,406.8-272.9,406.8-273,406.8z"/></g>\n  <g><path d="M-273,406.8c-0.1,0-0.1,0-0.2,0c-0.3-0.1-0.4-0.4-0.3-0.6l2.1-5.2c0.1-0.3,0.4-0.4,0.6-0.3c0.2,0.1,0.4,0.4,0.3,0.6l-2.1,5.2C-272.6,406.7-272.8,406.8-273,406.8z"/></g>\n  <g><path d="M-264.7,397.5h-20.8c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h20.8c0.3,0,0.5,0.2,0.5,0.5S-264.4,397.5-264.7,397.5z"/></g>\n</svg>';

}
return __p
};templates['logo-flat-custom']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/logo-flat-custom ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-137 283 336 227" enable-background="new -137 283 336 227" xml:space="preserve">\n  <g>\n    <path class="cs-logo-block-light" d="M86.8,444.8C52.6,464.5,65.3,457.2,31,477c-5.9-3.4-49.9-28.8-55.8-32.2c61.8-35.7,25.9-15,55.8-32.2C49.9,423.5,33.8,414.2,86.8,444.8z"/>\n    <path class="cs-logo-block-regular" d="M86.8,444.8V477c-34.2,19.7-21.5,12.4-55.8,32.2V477C65.2,457.3,52.5,464.6,86.8,444.8z"/>\n    <path class="cs-logo-block-dark" d="M31,477v32.2c-5.9-3.4-49.9-28.8-55.8-32.2v-32.2C-18.9,448.2,25.1,473.6,31,477z"/>\n    <path class="cs-logo-arms-dark" d="M-38.7,436.7L-38.7,436.7v32.2c-54.9-31.7-13.2-7.6-97.6-56.4v-32.1C-135.9,380.7-67.1,420.3-38.7,436.7z"/>\n    <path class="cs-logo-arms-regular" d="M86.8,316v32.2c-74.9,43.3-33.5,19.4-83.7,48.3l-27.9-16.1C73,324,24.8,351.8,86.8,316z"/>\n    <path class="cs-logo-arms-light" d="M31,283.8l-167.3,96.6c0.5,0.3,69.2,40,97.6,56.3l55.8-32.2c-17.7-10.2-8.7-5-41.8-24.1C73,324,24.8,351.8,86.8,316L31,283.8z"/>\n    <path class="cs-logo-arms-light" d="M142.5,348.2c-13.4,7.7-83.9,48.4-97.6,56.3l55.8,32.2c29-16.7,94.9-54.8,97.6-56.4C164.1,360.7,176.8,368,142.5,348.2z"/>\n    <path class="cs-logo-arms-regular" d="M198.3,380.4v32.2c0,0-97.6,56.3-97.6,56.4v-32.2C129.7,420,195.6,382,198.3,380.4z"/>\n    <path class="cs-logo-arms-regular" d="M17,404.5v16.1c-17.8,10.3-8.8,5.1-41.8,24.1v16.4l-13.6,7.9l-0.3-0.2v-32.2l0,0L17,404.5z"/>\n    <path class="cs-logo-arms-dark" d="M100.7,436.8V469l-13.9-8.1l0,0v-16.1C59,428.7,59.4,429,45,420.6v-16.1l0,0L100.7,436.8z"/>\n  </g>\n</svg>';

}
return __p
};templates['logo-flat-original']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/logo-flat-original ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-137 283 336 227" enable-background="new -137 283 336 227" xml:space="preserve">\n  <g>\n    <path fill="#26CABC" d="M86.8,444.8C52.6,464.5,65.3,457.2,31,477c-5.9-3.4-49.9-28.8-55.8-32.2c61.8-35.7,25.9-15,55.8-32.2C49.9,423.5,33.8,414.2,86.8,444.8z"/>\n    <path fill="#22B3A6" d="M86.8,444.8V477c-34.2,19.7-21.5,12.4-55.8,32.2V477C65.2,457.3,52.5,464.6,86.8,444.8z"/>\n    <path fill="#1D968D" d="M31,477v32.2c-5.9-3.4-49.9-28.8-55.8-32.2v-32.2C-18.9,448.2,25.1,473.6,31,477z"/>\n    <path fill="#DF5540" d="M-38.7,436.7L-38.7,436.7v32.2c-54.9-31.7-13.2-7.6-97.6-56.4v-32.1C-135.9,380.7-67.1,420.3-38.7,436.7z"/>\n    <path fill="#FA5745" d="M86.8,316v32.2c-74.9,43.3-33.5,19.4-83.7,48.3l-27.9-16.1C73,324,24.8,351.8,86.8,316z"/>\n    <path fill="#FE7864" d="M31,283.8l-167.3,96.6c0.5,0.3,69.2,40,97.6,56.3l55.8-32.2c-17.7-10.2-8.7-5-41.8-24.1C73,324,24.8,351.8,86.8,316L31,283.8z"/>\n    <path fill="#FE7864" d="M142.5,348.2c-13.4,7.7-83.9,48.4-97.6,56.3l55.8,32.2c29-16.7,94.9-54.8,97.6-56.4C164.1,360.7,176.8,368,142.5,348.2z"/>\n    <path fill="#FA5745" d="M198.3,380.4v32.2c0,0-97.6,56.3-97.6,56.4v-32.2C129.7,420,195.6,382,198.3,380.4z"/>\n    <path fill="#FA5745" d="M17,404.5v16.1c-17.8,10.3-8.8,5.1-41.8,24.1v16.4l-13.6,7.9l-0.3-0.2v-32.2l0,0L17,404.5z"/>\n    <path fill="#DF5540" d="M100.7,436.8V469l-13.9-8.1l0,0v-16.1C59,428.7,59.4,429,45,420.6v-16.1l0,0L100.7,436.8z"/>\n  </g>\n</svg>';

}
return __p
};templates['nav-elements-solid']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/nav-elements-solid ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-275,395.9l12-6.4l-11.5-6c-0.3-0.2-0.6-0.2-0.9,0l-11.6,6.1L-275,395.9z"/>\n    <path d="M-274,397.5v12.7l11.4-6.1c0.3-0.2,0.5-0.5,0.5-0.9v-12.1L-274,397.5z"/>\n    <path d="M-276,397.5l-11.9-6.3v12.1c0,0.4,0.2,0.7,0.5,0.9l11.4,6V397.5z"/>\n  </g>\n</svg>';

}
return __p
};templates['nav-inspector-solid']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/nav-inspector-solid ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-262.5,406.7l-4.9-5.1c-0.4-0.4-1-0.4-1.4,0l-0.5,0.4l-0.5-0.5c1.7-1.9,2.7-4.3,2.7-7.1c0.1-5.7-4.6-10.4-10.4-10.4s-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5c2.7,0,5.2-1,7.1-2.7l0.5,0.5l-0.2,0.2c-0.4,0.4-0.4,1,0,1.4l4.9,5.1c0.2,0.2,0.4,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.4,0.3-0.7C-262.2,407.1-262.3,406.8-262.5,406.7z M-277.5,403c-4.7,0-8.5-3.8-8.5-8.5s3.8-8.5,8.5-8.5s8.5,3.8,8.5,8.5S-272.8,403-277.5,403z"/>\n    <path d="M-277.5,387.8c-3.7,0-6.7,2.9-6.7,6.7c0,3.6,3,6.7,6.7,6.7s6.7-3,6.7-6.7C-270.8,390.8-273.9,387.8-277.5,387.8z"/>\n  </g>\n</svg>';

}
return __p
};templates['nav-layout-solid']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/nav-layout-solid ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <g>\n    <path d="M-264,384h-22c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-3C-263,384.4-263.4,384-264,384z"/>\n    <path d="M-264,391h-12c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1v-3C-263,391.4-263.4,391-264,391z"/>\n    <path d="M-286,396h6c0.6,0,1-0.4,1-1v-3c0-0.6-0.4-1-1-1h-6c-0.6,0-1,0.4-1,1v3C-287,395.6-286.6,396-286,396z"/>\n    <path d="M-286,403h12c0.6,0,1-0.4,1-1v-3c0-0.6-0.4-1-1-1h-12c-0.6,0-1,0.4-1,1v3C-287,402.6-286.6,403-286,403z"/>\n    <path d="M-264,398h-6c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1v-3C-263,398.4-263.4,398-264,398z"/>\n    <path d="M-264,405h-22c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1v-3C-263,405.4-263.4,405-264,405z"/>\n  </g>\n</svg>';

}
return __p
};templates['nav-settings-solid']=function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 // icons/nav-settings-solid ;
__p += '\n<svg class="cs-custom-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 30 30" enable-background="new -290 382 30 30" xml:space="preserve">\n  <path d="M-262,398.6v-3.1l-2.7-0.5l-0.4-1.4l2.1-1.7l-1.6-2.7l-2.6,1l-1-1l1-2.6l-2.7-1.6l-1.7,2.1l-1.4-0.4l-0.4-2.7h-3.1l-0.5,2.7l-1.4,0.4l-1.7-2.1l-2.7,1.6l1,2.6l-1,1l-2.6-1l-1.6,2.7l2.1,1.7l-0.4,1.4l-2.7,0.4v3.1l2.7,0.5l0.4,1.4l-2.1,1.7l1.6,2.7l2.6-1l1,1l-1,2.6l2.7,1.6l1.7-2.1l1.4,0.4l0.4,2.7h3.1l0.4-2.7l1.4-0.4l1.7,2.1l2.7-1.6l-1-2.6l1-1l2.6,1l1.6-2.7l-2.1-1.7l0.4-1.4L-262,398.6z M-275,403c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S-271.7,403-275,403z"/>\n</svg>';

}
return __p
};module.exports=templates;
},{}],120:[function(require,module,exports){
/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro>
 *
 * Thanks to the following contributors: andyburke, bistoco, daemianmack, drskullster, flying-sheep, OscarGodson, Parikshit N. Samant, rodolfospalenza, ssafejava
 *
 * Released under the MIT license.
 */
'use strict';

(function ($) {
  var dragging, draggingHeight, placeholders = $();
  $.fn.sortable = function (options) {
    var method = String(options);

    options = $.extend({
      connectWith: false,
      placeholder: null,
      dragImage: null
    }, options);

    return this.each(function () {

      var index, items = $(this).children(options.items), handles = options.handle ? items.find(options.handle) : items;

      if (method === 'reload') {
        $(this).children(options.items).off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
      }
      if (/^enable|disable|destroy$/.test(method)) {
        var citems = $(this).children($(this).data('items')).attr('draggable', method === 'enable');
        if (method === 'destroy') {
          $(this).off('sortupdate');
          $(this).removeData('opts');
          citems.add(this).removeData('connectWith items')
            .off('dragstart.h5s dragend.h5s dragover.h5s dragenter.h5s drop.h5s').off('sortupdate');
          handles.off('selectstart.h5s');
        }
        return;
      }

      var soptions = $(this).data('opts');

      if (typeof soptions === 'undefined') {
        $(this).data('opts', options);
      }
      else {
        options = soptions;
      }

      var startParent, newParent;
      var placeholder = ( options.placeholder === null ) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder"/>') : $(options.placeholder).addClass('sortable-placeholder');

      $(this).data('items', options.items);
      placeholders = placeholders.add(placeholder);
      if (options.connectWith) {
        $(options.connectWith).add(this).data('connectWith', options.connectWith);
      }

      items.attr('role', 'option');
      items.attr('aria-grabbed', 'false');

      // Setup drag handles
      handles.attr('draggable', 'true').not('a[href], img').on('selectstart.h5s', function() {
        if (this.dragDrop) {
          this.dragDrop();
        }
        return false;
      }).end();

      // Handle drag events on draggable items
      items.on('dragstart.h5s', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.effectAllowed = 'move';
        dt.setData('text', '');

        if (options.dragImage && dt.setDragImage) {
          dt.setDragImage(options.dragImage, 0, 0);
        }

        index = (dragging = $(this)).addClass('sortable-dragging').attr('aria-grabbed', 'true').index();
        draggingHeight = dragging.outerHeight();
        startParent = $(this).parent();
        dragging.parent().triggerHandler('sortstart', {item: dragging, startparent: startParent});
      }).on('dragend.h5s',function () {
          if (!dragging) {
            return;
          }
          dragging.removeClass('sortable-dragging').attr('aria-grabbed', 'false').show();
          placeholders.detach();
          newParent = $(this).parent();
          if (index !== dragging.index() || startParent.get(0) !== newParent.get(0)) {
            dragging.parent().triggerHandler('sortupdate', {item: dragging, oldindex: index, startparent: startParent, endparent: newParent});
          }
          dragging = null;
          draggingHeight = null;
        }).add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
          if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
            return true;
          }
          if (e.type === 'drop') {
            e.stopPropagation();
            placeholders.filter(':visible').after(dragging);
            dragging.trigger('dragend.h5s');
            return false;
          }
          e.preventDefault();
          e.originalEvent.dataTransfer.dropEffect = 'move';
          if (items.is(this)) {
            var thisHeight = $(this).outerHeight();
            if (options.forcePlaceholderSize) {
              placeholder.height(draggingHeight);
            }

            // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
            if (thisHeight > draggingHeight) {
              // Dead zone?
              var deadZone = thisHeight - draggingHeight, offsetTop = $(this).offset().top;
              if (placeholder.index() < $(this).index() && e.originalEvent.pageY < offsetTop + deadZone) {
                return false;
              }
              else if (placeholder.index() > $(this).index() && e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
                return false;
              }
            }

            dragging.hide();
            $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
            placeholders.not(placeholder).detach();
          } else if (!placeholders.is(this) && !$(this).children(options.items).length) {
            placeholders.detach();
            $(this).append(placeholder);
          }
          return false;
        });
    });
  };
})(jQuery);
},{}],121:[function(require,module,exports){
/*!
 * HTMLHint v0.9.13
 * https://github.com/yaniswang/HTMLHint
 *
 * (c) 2014-2015 Yanis Wang <yanis.wang@gmail.com>.
 * MIT Licensed
 */
var HTMLHint=function(e){function t(e,t){return Array(e+1).join(t||" ")}var a={};return a.version="0.9.13",a.release="20151030",a.rules={},a.defaultRuleset={"tagname-lowercase":!0,"attr-lowercase":!0,"attr-value-double-quotes":!0,"doctype-first":!0,"tag-pair":!0,"spec-char-escape":!0,"id-unique":!0,"src-not-empty":!0,"attr-no-duplication":!0,"title-require":!0},a.addRule=function(e){a.rules[e.id]=e},a.verify=function(t,n){t=t.replace(/^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i,function(t,a){return n===e&&(n={}),a.replace(/(?:^|,)\s*([^:,]+)\s*(?:\:\s*([^,\s]+))?/g,function(t,a,i){"false"===i?i=!1:"true"===i&&(i=!0),n[a]=i===e?!0:i}),""}),(n===e||0===Object.keys(n).length)&&(n=a.defaultRuleset);var i,r=new HTMLParser,s=new a.Reporter(t,n),o=a.rules;for(var l in n)i=o[l],i!==e&&n[l]!==!1&&i.init(r,s,n[l]);return r.parse(t),s.messages},a.format=function(e,a){a=a||{};var n=[],i={white:"",grey:"",red:"",reset:""};a.colors&&(i.white="[37m",i.grey="[90m",i.red="[31m",i.reset="[39m");var r=a.indent||0;return e.forEach(function(e){var a=40,s=a+20,o=e.evidence,l=e.line,u=e.col,d=o.length,c=u>a+1?u-a:1,f=o.length>u+s?u+s:d;a+1>u&&(f+=a-u+1),o=o.replace(/\t/g," ").substring(c-1,f),c>1&&(o="..."+o,c-=3),d>f&&(o+="..."),n.push(i.white+t(r)+"L"+l+" |"+i.grey+o+i.reset);var g=u-c,h=o.substring(0,g).match(/[^\u0000-\u00ff]/g);null!==h&&(g+=h.length),n.push(i.white+t(r)+t((l+"").length+3+g)+"^ "+i.red+e.message+" ("+e.rule.id+")"+i.reset)}),n},a}();"object"==typeof exports&&exports&&(exports.HTMLHint=HTMLHint),function(e){var t=function(){var e=this;e._init.apply(e,arguments)};t.prototype={_init:function(e,t){var a=this;a.html=e,a.lines=e.split(/\r?\n/);var n=e.match(/\r?\n/);a.brLen=null!==n?n[0].length:0,a.ruleset=t,a.messages=[]},error:function(e,t,a,n,i){this.report("error",e,t,a,n,i)},warn:function(e,t,a,n,i){this.report("warning",e,t,a,n,i)},info:function(e,t,a,n,i){this.report("info",e,t,a,n,i)},report:function(e,t,a,n,i,r){for(var s,o,l=this,u=l.lines,d=l.brLen,c=a-1,f=u.length;f>c&&(s=u[c],o=s.length,n>o&&f>a);c++)a++,n-=o,1!==n&&(n-=d);l.messages.push({type:e,message:t,raw:r,evidence:s,line:a,col:n,rule:{id:i.id,description:i.description,link:"https://github.com/yaniswang/HTMLHint/wiki/"+i.id}})}},e.Reporter=t}(HTMLHint);var HTMLParser=function(e){var t=function(){var e=this;e._init.apply(e,arguments)};return t.prototype={_init:function(){var e=this;e._listeners={},e._mapCdataTags=e.makeMap("script,style"),e._arrBlocks=[],e.lastEvent=null},makeMap:function(e){for(var t={},a=e.split(","),n=0;a.length>n;n++)t[a[n]]=!0;return t},parse:function(t){function a(t,a,n,i){var r=n-b+1;i===e&&(i={}),i.raw=a,i.pos=n,i.line=w,i.col=r,L.push(i),c.fire(t,i);for(var s;s=m.exec(a);)w++,b=n+m.lastIndex}var n,i,r,s,o,l,u,d,c=this,f=c._mapCdataTags,g=/<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g,h=/\s*([\w\-:]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g,m=/\r?\n/g,p=0,v=0,b=0,w=1,L=c._arrBlocks;for(c.fire("start",{pos:0,line:1,col:1});n=g.exec(t);)if(i=n.index,i>p&&(d=t.substring(p,i),o?u.push(d):a("text",d,p)),p=g.lastIndex,!(r=n[1])||(o&&r===o&&(d=u.join(""),a("cdata",d,v,{tagName:o,attrs:l}),o=null,l=null,u=null),o))if(o)u.push(n[0]);else if(r=n[4]){s=[];for(var y,T=n[5],H=0;y=h.exec(T);){var x=y[1],M=y[2]?y[2]:y[4]?y[4]:"",N=y[3]?y[3]:y[5]?y[5]:y[6]?y[6]:"";s.push({name:x,value:N,quote:M,index:y.index,raw:y[0]}),H+=y[0].length}H===T.length?(a("tagstart",n[0],i,{tagName:r,attrs:s,close:n[6]}),f[r]&&(o=r,l=s.concat(),u=[],v=p)):a("text",n[0],i)}else(n[2]||n[3])&&a("comment",n[0],i,{content:n[2]||n[3],"long":n[2]?!0:!1});else a("tagend",n[0],i,{tagName:r});t.length>p&&(d=t.substring(p,t.length),a("text",d,p)),c.fire("end",{pos:p,line:w,col:t.length-b+1})},addListener:function(t,a){for(var n,i=this._listeners,r=t.split(/[,\s]/),s=0,o=r.length;o>s;s++)n=r[s],i[n]===e&&(i[n]=[]),i[n].push(a)},fire:function(t,a){a===e&&(a={}),a.type=t;var n=this,i=[],r=n._listeners[t],s=n._listeners.all;r!==e&&(i=i.concat(r)),s!==e&&(i=i.concat(s));var o=n.lastEvent;null!==o&&(delete o.lastEvent,a.lastEvent=o),n.lastEvent=a;for(var l=0,u=i.length;u>l;l++)i[l].call(n,a)},removeListener:function(t,a){var n=this._listeners[t];if(n!==e)for(var i=0,r=n.length;r>i;i++)if(n[i]===a){n.splice(i,1);break}},fixPos:function(e,t){var a,n=e.raw.substr(0,t),i=n.split(/\r?\n/),r=i.length-1,s=e.line;return r>0?(s+=r,a=i[r].length+1):a=e.col+t,{line:s,col:a}},getMapAttrs:function(e){for(var t,a={},n=0,i=e.length;i>n;n++)t=e[n],a[t.name]=t.value;return a}},t}();"object"==typeof exports&&exports&&(exports.HTMLParser=HTMLParser),HTMLHint.addRule({id:"alt-require",description:"The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.",init:function(e,t){var a=this;e.addListener("tagstart",function(n){var i,r=n.tagName.toLowerCase(),s=e.getMapAttrs(n.attrs),o=n.col+r.length+1;"img"!==r||"alt"in s?("area"===r&&"href"in s||"input"===r&&"image"===s.type)&&("alt"in s&&""!==s.alt||(i="area"===r?"area[href]":"input[type=image]",t.warn("The alt attribute of "+i+" must have a value.",n.line,o,a,n.raw))):t.warn("An alt attribute must be present on <img> elements.",n.line,o,a,n.raw)})}}),HTMLHint.addRule({id:"attr-lowercase",description:"All attribute names must be in lowercase.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i=e.attrs,r=e.col+e.tagName.length+1,s=0,o=i.length;o>s;s++){n=i[s];var l=n.name;l!==l.toLowerCase()&&t.error("The attribute name of [ "+l+" ] must be in lowercase.",e.line,r+n.index,a,n.raw)}})}}),HTMLHint.addRule({id:"attr-no-duplication",description:"Elements cannot have duplicate attributes.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i,r=e.attrs,s=e.col+e.tagName.length+1,o={},l=0,u=r.length;u>l;l++)n=r[l],i=n.name,o[i]===!0&&t.error("Duplicate of attribute name [ "+n.name+" ] was found.",e.line,s+n.index,a,n.raw),o[i]=!0})}}),HTMLHint.addRule({id:"attr-unsafe-chars",description:"Attribute values cannot contain unsafe chars.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i,r=e.attrs,s=e.col+e.tagName.length+1,o=/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,l=0,u=r.length;u>l;l++)if(n=r[l],i=n.value.match(o),null!==i){var d=escape(i[0]).replace(/%u/,"\\u").replace(/%/,"\\x");t.warn("The value of attribute [ "+n.name+" ] cannot contain an unsafe char [ "+d+" ].",e.line,s+n.index,a,n.raw)}})}}),HTMLHint.addRule({id:"attr-value-double-quotes",description:"Attribute values must be in double quotes.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i=e.attrs,r=e.col+e.tagName.length+1,s=0,o=i.length;o>s;s++)n=i[s],(""!==n.value&&'"'!==n.quote||""===n.value&&"'"===n.quote)&&t.error("The value of attribute [ "+n.name+" ] must be in double quotes.",e.line,r+n.index,a,n.raw)})}}),HTMLHint.addRule({id:"attr-value-not-empty",description:"All attributes must have values.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i=e.attrs,r=e.col+e.tagName.length+1,s=0,o=i.length;o>s;s++)n=i[s],""===n.quote&&""===n.value&&t.warn("The attribute [ "+n.name+" ] must have a value.",e.line,r+n.index,a,n.raw)})}}),HTMLHint.addRule({id:"csslint",description:"Scan css with csslint.",init:function(e,t,a){var n=this;e.addListener("cdata",function(e){if("style"===e.tagName.toLowerCase()){var i;if(i="object"==typeof exports&&require?require("csslint").CSSLint.verify:CSSLint.verify,void 0!==a){var r=e.line-1,s=e.col-1;try{var o=i(e.raw,a).messages;o.forEach(function(e){var a=e.line;t["warning"===e.type?"warn":"error"]("["+e.rule.id+"] "+e.message,r+a,(1===a?s:0)+e.col,n,e.evidence)})}catch(l){}}}})}}),HTMLHint.addRule({id:"doctype-first",description:"Doctype must be declared first.",init:function(e,t){var a=this,n=function(i){"start"===i.type||"text"===i.type&&/^\s*$/.test(i.raw)||(("comment"!==i.type&&i.long===!1||/^DOCTYPE\s+/i.test(i.content)===!1)&&t.error("Doctype must be declared first.",i.line,i.col,a,i.raw),e.removeListener("all",n))};e.addListener("all",n)}}),HTMLHint.addRule({id:"doctype-html5",description:'Invalid doctype. Use: "<!DOCTYPE html>"',init:function(e,t){function a(e){e.long===!1&&"doctype html"!==e.content.toLowerCase()&&t.warn('Invalid doctype. Use: "<!DOCTYPE html>"',e.line,e.col,i,e.raw)}function n(){e.removeListener("comment",a),e.removeListener("tagstart",n)}var i=this;e.addListener("all",a),e.addListener("tagstart",n)}}),HTMLHint.addRule({id:"head-script-disabled",description:"The <script> tag cannot be used in a <head> tag.",init:function(e,t){function a(a){var n=e.getMapAttrs(a.attrs),o=n.type,l=a.tagName.toLowerCase();"head"===l&&(s=!0),s!==!0||"script"!==l||o&&r.test(o)!==!0||t.warn("The <script> tag cannot be used in a <head> tag.",a.line,a.col,i,a.raw)}function n(t){"head"===t.tagName.toLowerCase()&&(e.removeListener("tagstart",a),e.removeListener("tagend",n))}var i=this,r=/^(text\/javascript|application\/javascript)$/i,s=!1;e.addListener("tagstart",a),e.addListener("tagend",n)}}),HTMLHint.addRule({id:"href-abs-or-rel",description:"An href attribute must be either absolute or relative.",init:function(e,t,a){var n=this,i="abs"===a?"absolute":"relative";e.addListener("tagstart",function(e){for(var a,r=e.attrs,s=e.col+e.tagName.length+1,o=0,l=r.length;l>o;o++)if(a=r[o],"href"===a.name){("absolute"===i&&/^\w+?:/.test(a.value)===!1||"relative"===i&&/^https?:\/\//.test(a.value)===!0)&&t.warn("The value of the href attribute [ "+a.value+" ] must be "+i+".",e.line,s+a.index,n,a.raw);break}})}}),HTMLHint.addRule({id:"id-class-ad-disabled",description:"The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i,r=e.attrs,s=e.col+e.tagName.length+1,o=0,l=r.length;l>o;o++)n=r[o],i=n.name,/^(id|class)$/i.test(i)&&/(^|[-\_])ad([-\_]|$)/i.test(n.value)&&t.warn("The value of attribute "+i+" cannot use the ad keyword.",e.line,s+n.index,a,n.raw)})}}),HTMLHint.addRule({id:"id-class-value",description:"The id and class attribute values must meet the specified rules.",init:function(e,t,a){var n,i=this,r={underline:{regId:/^[a-z\d]+(_[a-z\d]+)*$/,message:"The id and class attribute values must be in lowercase and split by an underscore."},dash:{regId:/^[a-z\d]+(-[a-z\d]+)*$/,message:"The id and class attribute values must be in lowercase and split by a dash."},hump:{regId:/^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,message:"The id and class attribute values must meet the camelCase style."}};if(n="string"==typeof a?r[a]:a,n&&n.regId){var s=n.regId,o=n.message;e.addListener("tagstart",function(e){for(var a,n=e.attrs,r=e.col+e.tagName.length+1,l=0,u=n.length;u>l;l++)if(a=n[l],"id"===a.name.toLowerCase()&&s.test(a.value)===!1&&t.warn(o,e.line,r+a.index,i,a.raw),"class"===a.name.toLowerCase())for(var d,c=a.value.split(/\s+/g),f=0,g=c.length;g>f;f++)d=c[f],d&&s.test(d)===!1&&t.warn(o,e.line,r+a.index,i,d)})}}}),HTMLHint.addRule({id:"id-unique",description:"The value of id attributes must be unique.",init:function(e,t){var a=this,n={};e.addListener("tagstart",function(e){for(var i,r,s=e.attrs,o=e.col+e.tagName.length+1,l=0,u=s.length;u>l;l++)if(i=s[l],"id"===i.name.toLowerCase()){r=i.value,r&&(void 0===n[r]?n[r]=1:n[r]++,n[r]>1&&t.error("The id value [ "+r+" ] must be unique.",e.line,o+i.index,a,i.raw));break}})}}),HTMLHint.addRule({id:"inline-script-disabled",description:"Inline script cannot be use.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i,r=e.attrs,s=e.col+e.tagName.length+1,o=/^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i,l=0,u=r.length;u>l;l++)n=r[l],i=n.name.toLowerCase(),o.test(i)===!0?t.warn("Inline script [ "+n.raw+" ] cannot be use.",e.line,s+n.index,a,n.raw):("src"===i||"href"===i)&&/^\s*javascript:/i.test(n.value)&&t.warn("Inline script [ "+n.raw+" ] cannot be use.",e.line,s+n.index,a,n.raw)})}}),HTMLHint.addRule({id:"inline-style-disabled",description:"Inline style cannot be use.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i=e.attrs,r=e.col+e.tagName.length+1,s=0,o=i.length;o>s;s++)n=i[s],"style"===n.name.toLowerCase()&&t.warn("Inline style [ "+n.raw+" ] cannot be use.",e.line,r+n.index,a,n.raw)})}}),HTMLHint.addRule({id:"jshint",description:"Scan script with jshint.",init:function(e,t,a){var n=this;e.addListener("cdata",function(i){if("script"===i.tagName.toLowerCase()){var r=e.getMapAttrs(i.attrs),s=r.type;if(void 0!==r.src||s&&/^(text\/javascript)$/i.test(s)===!1)return;var o;if(o="object"==typeof exports&&require?require("jshint").JSHINT:JSHINT,void 0!==a){var l=i.line-1,u=i.col-1,d=i.raw.replace(/\t/g," ");try{var c=o(d,a);c===!1&&o.errors.forEach(function(e){var a=e.line;t.warn(e.reason,l+a,(1===a?u:0)+e.character,n,e.evidence)})}catch(f){}}}})}}),HTMLHint.addRule({id:"space-tab-mixed-disabled",description:"Do not mix tabs and spaces for indentation.",init:function(e,t,a){var n=this;e.addListener("text",function(i){for(var r,s=i.raw,o=/(^|\r?\n)([ \t]+)/g;r=o.exec(s);){var l=e.fixPos(i,r.index+r[1].length);"space"===a&&/^ +$/.test(r[2])===!1?t.warn("Please use space for indentation.",l.line,1,n,i.raw):"tab"===a&&/^\t+$/.test(r[2])===!1?t.warn("Please use tab for indentation.",l.line,1,n,i.raw):/ +\t|\t+ /.test(r[2])===!0&&t.warn("Do not mix tabs and spaces for indentation.",l.line,1,n,i.raw)}})}}),HTMLHint.addRule({id:"spec-char-escape",description:"Special characters must be escaped.",init:function(e,t){var a=this;e.addListener("text",function(n){for(var i,r=n.raw,s=/[<>]/g;i=s.exec(r);){var o=e.fixPos(n,i.index);t.error("Special characters must be escaped : [ "+i[0]+" ].",o.line,o.col,a,n.raw)}})}}),HTMLHint.addRule({id:"src-not-empty",description:"The src attribute of an img(script,link) must have a value.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){for(var n,i=e.tagName,r=e.attrs,s=e.col+i.length+1,o=0,l=r.length;l>o;o++)n=r[o],(/^(img|script|embed|bgsound|iframe)$/.test(i)===!0&&"src"===n.name||"link"===i&&"href"===n.name||"object"===i&&"data"===n.name)&&""===n.value&&t.error("The attribute [ "+n.name+" ] of the tag [ "+i+" ] must have a value.",e.line,s+n.index,a,n.raw)})}}),HTMLHint.addRule({id:"style-disabled",description:"<style> tags cannot be used.",init:function(e,t){var a=this;e.addListener("tagstart",function(e){"style"===e.tagName.toLowerCase()&&t.warn("The <style> tag cannot be used.",e.line,e.col,a,e.raw)})}}),HTMLHint.addRule({id:"tag-pair",description:"Tag must be paired.",init:function(e,t){var a=this,n=[],i=e.makeMap("area,base,basefont,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track");e.addListener("tagstart",function(e){var t=e.tagName.toLowerCase();void 0!==i[t]||e.close||n.push({tagName:t,line:e.line,raw:e.raw})}),e.addListener("tagend",function(e){for(var i=e.tagName.toLowerCase(),r=n.length-1;r>=0&&n[r].tagName!==i;r--);if(r>=0){for(var s=[],o=n.length-1;o>r;o--)s.push("</"+n[o].tagName+">");if(s.length>0){var l=n[n.length-1];t.error("Tag must be paired, missing: [ "+s.join("")+" ], start tag match failed [ "+l.raw+" ] on line "+l.line+".",e.line,e.col,a,e.raw)}n.length=r}else t.error("Tag must be paired, no start tag: [ "+e.raw+" ]",e.line,e.col,a,e.raw)}),e.addListener("end",function(e){for(var i=[],r=n.length-1;r>=0;r--)i.push("</"+n[r].tagName+">");if(i.length>0){var s=n[n.length-1];t.error("Tag must be paired, missing: [ "+i.join("")+" ], open tag match failed [ "+s.raw+" ] on line "+s.line+".",e.line,e.col,a,"")}})}}),HTMLHint.addRule({id:"tag-self-close",description:"Empty tags must be self closed.",init:function(e,t){var a=this,n=e.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");e.addListener("tagstart",function(e){var i=e.tagName.toLowerCase();void 0!==n[i]&&(e.close||t.warn("The empty tag : [ "+i+" ] must be self closed.",e.line,e.col,a,e.raw))})}}),HTMLHint.addRule({id:"tagname-lowercase",description:"All html element names must be in lowercase.",init:function(e,t){var a=this;e.addListener("tagstart,tagend",function(e){var n=e.tagName;n!==n.toLowerCase()&&t.error("The html element name of [ "+n+" ] must be in lowercase.",e.line,e.col,a,e.raw)})}}),HTMLHint.addRule({id:"title-require",description:"<title> must be present in <head> tag.",init:function(e,t){function a(e){var t=e.tagName.toLowerCase();"head"===t?r=!0:"title"===t&&r&&(s=!0)}function n(r){var o=r.tagName.toLowerCase();if(s&&"title"===o){var l=r.lastEvent;("text"!==l.type||"text"===l.type&&/^\s*$/.test(l.raw)===!0)&&t.error("<title></title> must not be empty.",r.line,r.col,i,r.raw)}else"head"===o&&(s===!1&&t.error("<title> must be present in <head> tag.",r.line,r.col,i,r.raw),e.removeListener("tagstart",a),e.removeListener("tagend",n))}var i=this,r=!1,s=!1;e.addListener("tagstart",a),e.addListener("tagend",n)}});
},{"csslint":126,"jshint":126}],122:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2

/*
jQuery Growl
Copyright 2015 Kevin Sylvestre
1.2.6
 */

(function() {
  "use strict";
  var $, Animation, Growl,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Animation = (function() {
    function Animation() {}

    Animation.transitions = {
      "webkitTransition": "webkitTransitionEnd",
      "mozTransition": "mozTransitionEnd",
      "oTransition": "oTransitionEnd",
      "transition": "transitionend"
    };

    Animation.transition = function($el) {
      var el, ref, result, type;
      el = $el[0];
      ref = this.transitions;
      for (type in ref) {
        result = ref[type];
        if (el.style[type] != null) {
          return result;
        }
      }
    };

    return Animation;

  })();

  Growl = (function() {
    Growl.settings = {
      namespace: 'growl',
      duration: 3200,
      close: "&#215;",
      location: "default",
      style: "default",
      size: "medium"
    };

    Growl.growl = function(settings) {
      if (settings == null) {
        settings = {};
      }
      this.initialize();
      return new Growl(settings);
    };

    Growl.initialize = function() {
      return $("body:not(:has(#growls))").append('<div id="growls" />');
    };

    function Growl(settings) {
      if (settings == null) {
        settings = {};
      }
      this.html = bind(this.html, this);
      this.$growl = bind(this.$growl, this);
      this.$growls = bind(this.$growls, this);
      this.animate = bind(this.animate, this);
      this.remove = bind(this.remove, this);
      this.dismiss = bind(this.dismiss, this);
      this.present = bind(this.present, this);
      this.cycle = bind(this.cycle, this);
      this.close = bind(this.close, this);
      this.unbind = bind(this.unbind, this);
      this.bind = bind(this.bind, this);
      this.render = bind(this.render, this);
      this.settings = $.extend({}, Growl.settings, settings);
      this.$growls().attr('class', this.settings.location);
      this.render();
    }

    Growl.prototype.render = function() {
      var $growl;
      $growl = this.$growl();
      this.$growls().append($growl);
      if (this.settings['static'] != null) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.debug === "function") {
            console.debug('DEPRECATION: static has been renamed to fix and will be removed in the next release');
          }
        }
        this.settings['fixed'] = this.settings['static'];
      }
      if (this.settings.fixed) {
        this.present();
      } else {
        this.cycle();
      }
    };

    Growl.prototype.bind = function($growl) {
      if ($growl == null) {
        $growl = this.$growl();
      }
      return $growl.on("contextmenu", this.close).find("." + this.settings.namespace + "-close").on("click", this.close);
    };

    Growl.prototype.unbind = function($growl) {
      if ($growl == null) {
        $growl = this.$growl();
      }
      return $growl.off("contextmenu", this.close).find("." + this.settings.namespace + "-close").off("click", this.close);
    };

    Growl.prototype.close = function(event) {
      var $growl;
      event.preventDefault();
      event.stopPropagation();
      $growl = this.$growl();
      return $growl.stop().queue(this.dismiss).queue(this.remove);
    };

    Growl.prototype.cycle = function() {
      var $growl;
      $growl = this.$growl();
      return $growl.queue(this.present).delay(this.settings.duration).queue(this.dismiss).queue(this.remove);
    };

    Growl.prototype.present = function(callback) {
      var $growl;
      $growl = this.$growl();
      this.bind($growl);
      return this.animate($growl, this.settings.namespace + "-incoming", 'out', callback);
    };

    Growl.prototype.dismiss = function(callback) {
      var $growl;
      $growl = this.$growl();
      this.unbind($growl);
      return this.animate($growl, this.settings.namespace + "-outgoing", 'in', callback);
    };

    Growl.prototype.remove = function(callback) {
      this.$growl().remove();
      return callback();
    };

    Growl.prototype.animate = function($element, name, direction, callback) {
      var transition;
      if (direction == null) {
        direction = 'in';
      }
      transition = Animation.transition($element);
      $element[direction === 'in' ? 'removeClass' : 'addClass'](name);
      $element.offset().position;
      $element[direction === 'in' ? 'addClass' : 'removeClass'](name);
      if (callback == null) {
        return;
      }
      if (transition != null) {
        $element.one(transition, callback);
      } else {
        callback();
      }
    };

    Growl.prototype.$growls = function() {
      return this.$_growls != null ? this.$_growls : this.$_growls = $('#growls');
    };

    Growl.prototype.$growl = function() {
      return this.$_growl != null ? this.$_growl : this.$_growl = $(this.html());
    };

    Growl.prototype.html = function() {
      return "<div class='" + this.settings.namespace + " " + this.settings.namespace + "-" + this.settings.style + " " + this.settings.namespace + "-" + this.settings.size + "'>\n  <div class='" + this.settings.namespace + "-close'>" + this.settings.close + "</div>\n  <div class='" + this.settings.namespace + "-title'>" + this.settings.title + "</div>\n  <div class='" + this.settings.namespace + "-message'>" + this.settings.message + "</div>\n</div>";
    };

    return Growl;

  })();

  $.growl = function(options) {
    if (options == null) {
      options = {};
    }
    return Growl.growl(options);
  };

  $.growl.error = function(options) {
    var settings;
    if (options == null) {
      options = {};
    }
    settings = {
      title: "Error!",
      style: "error"
    };
    return $.growl($.extend(settings, options));
  };

  $.growl.notice = function(options) {
    var settings;
    if (options == null) {
      options = {};
    }
    settings = {
      title: "Notice!",
      style: "notice"
    };
    return $.growl($.extend(settings, options));
  };

  $.growl.warning = function(options) {
    var settings;
    if (options == null) {
      options = {};
    }
    settings = {
      title: "Warning!",
      style: "warning"
    };
    return $.growl($.extend(settings, options));
  };

}).call(this);
},{}],123:[function(require,module,exports){
//https://github.com/customd/jquery-visible
(function($){

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */
    var $w = $(window);
    $.fn.visible = function(partial,hidden,direction){

        if (this.length < 1)
            return;

        var $t        = this.length > 1 ? this.eq(0) : this,
            t         = $t.get(0),
            vpWidth   = $w.width(),
            vpHeight  = $w.height(),
            direction = (direction) ? direction : 'both',
            clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;

        if (typeof t.getBoundingClientRect === 'function'){

            // Use this native browser method, if available.
            var rec = t.getBoundingClientRect(),
                tViz = rec.top    >= 0 && rec.top    <  vpHeight,
                bViz = rec.bottom >  0 && rec.bottom <= vpHeight,
                lViz = rec.left   >= 0 && rec.left   <  vpWidth,
                rViz = rec.right  >  0 && rec.right  <= vpWidth,
                vVisible   = partial ? tViz || bViz : tViz && bViz,
                hVisible   = partial ? lViz || rViz : lViz && rViz;

            if(direction === 'both')
                return clientSize && vVisible && hVisible;
            else if(direction === 'vertical')
                return clientSize && vVisible;
            else if(direction === 'horizontal')
                return clientSize && hVisible;
        } else {

            var viewTop         = $w.scrollTop(),
                viewBottom      = viewTop + vpHeight,
                viewLeft        = $w.scrollLeft(),
                viewRight       = viewLeft + vpWidth,
                offset          = $t.offset(),
                _top            = offset.top,
                _bottom         = _top + $t.height(),
                _left           = offset.left,
                _right          = _left + $t.width(),
                compareTop      = partial === true ? _bottom : _top,
                compareBottom   = partial === true ? _top : _bottom,
                compareLeft     = partial === true ? _right : _left,
                compareRight    = partial === true ? _left : _right;

            if(direction === 'both')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if(direction === 'vertical')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if(direction === 'horizontal')
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
        }
    };

})(jQuery);
},{}],124:[function(require,module,exports){
//https://github.com/kmewhort/pointer_events_polyfill
/*
 * Pointer Events Polyfill: Adds support for the style attribute "pointer-events: none" to browsers without this feature (namely, IE).
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 */

// constructor
function PointerEventsPolyfill(options){
    // set defaults
    this.options = {
        selector: '*',
        mouseEvents: [ 'click','dblclick','mousedown','mouseup', 'mouseenter', 'mouseleave', 'mouseover' ],
        usePolyfillIf: function(){
            if(navigator.appName == 'Microsoft Internet Explorer')
            {
                var agent = navigator.userAgent;
                if (agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null){
                    var version = parseFloat( RegExp.$1 );
                    if(version < 11)
                      return true;
                }
            }
            return false;
        }
    };
    if(options){
        var obj = this;
        $.each(options, function(k,v){
          obj.options[k] = v;
        });
    }

    if(this.options.usePolyfillIf())
      this.register_mouse_events();
}

// singleton initializer
PointerEventsPolyfill.initialize = function(options){
    if(PointerEventsPolyfill.singleton == null)
      PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
    return PointerEventsPolyfill.singleton;
};

// handle mouse events w/ support for pointer-events: none
PointerEventsPolyfill.prototype.register_mouse_events = function(){
    // register on all elements (and all future elements) matching the selector
    $(document).on(this.options.mouseEvents.join(" "), this.options.selector, function(e){
       if($(this).css('pointer-events') == 'none'){
             // peak at the element below
             var origDisplayAttribute = $(this).css('display');
             $(this).css('display','none');

             var underneathElem = document.elementFromPoint(e.clientX, e.clientY);

            if(origDisplayAttribute)
                $(this)
                    .css('display', origDisplayAttribute);
            else
                $(this).css('display','');

             // fire the mouse event on the element below
            e.target = underneathElem;
            $(underneathElem).trigger(e);

            return false;
        }
        return true;
    });
};
},{}],125:[function(require,module,exports){
// Modified to fix transparent pixels being calculated as black (https://github.com/briangonzalez/rgbaster.js/issues/8)
;(function(window, undefined){

  "use strict";

  // Helper functions.
  var getContext = function(){
    return document.createElement("canvas").getContext('2d');
  };

  var getImageData = function(img, loaded){

    var imgObj = new Image();
    var imgSrc = img.src || img;

    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if ( imgSrc.substring(0,5) !== 'data:' )
      imgObj.crossOrigin = "Anonymous";

    imgObj.onload = function(){
      var context = getContext('2d');
      context.drawImage(imgObj, 0, 0);

      var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
      loaded && loaded(imageData.data);
    };

    imgObj.src = imgSrc;

  };

  var makeRGB = function(name){
    return ['rgb(', name, ')'].join('');
  };

  var mapPalette = function(palette){
    return palette.map(function(c){ return makeRGB(c.name); });
  };


  // RGBaster Object
  // ---------------
  //
  var BLOCKSIZE = 5;
  var PALETTESIZE = 10;

  var RGBaster = {};

  RGBaster.colors = function(img, opts){

    opts = opts || {};
    var exclude = opts.exclude || [ ], // for example, to exlude white and black:  [ '0,0,0', '255,255,255' ]
        paletteSize = opts.paletteSize || PALETTESIZE;

    getImageData(img, function(data){

              var length        = ( img.width * img.height ) || data.length,
                  colorCounts   = {},
                  rgbString     = '',
                  rgb           = [],
                  colors        = {
                    dominant: { name: '', count: 0 },
                    palette:  Array.apply(null, new Array(paletteSize)).map(Boolean).map(function(a){ return { name: '0,0,0', count: 0 }; })
                  };

              // Loop over all pixels, in BLOCKSIZE iterations.
              var i = 0;
              while ( i < length ) {
                rgb[0] = data[i];
                rgb[1] = data[i+1];
                rgb[2] = data[i+2];
                rgbString = rgb.join(",");

                // Increment!
                i += BLOCKSIZE * 4;

                // Ignore transparent pixels
                if (data[i+3] === 0) {
                  continue;
                }

                // Keep track of counts.
                if ( rgbString in colorCounts ) {
                  colorCounts[rgbString] = colorCounts[rgbString] + 1;
                }
                else{
                  colorCounts[rgbString] = 1;
                }

                // Find dominant and palette, ignoring those colors in the exclude list.
                if ( exclude.indexOf( makeRGB(rgbString) ) === -1 ) {
                  var colorCount = colorCounts[rgbString];
                  if ( colorCount > colors.dominant.count ){
                    colors.dominant.name = rgbString;
                    colors.dominant.count = colorCount;
                  } else {
                    colors.palette.some(function(c){
                      if ( colorCount > c.count ) {
                        c.name = rgbString;
                        c.count = colorCount;
                        return true;
                      }
                    });
                  }
                }

              }

              if ( opts.success ) {
                var palette = mapPalette(colors.palette);
                opts.success({
                  dominant: makeRGB(colors.dominant.name),
                  secondary: palette[0],
                  palette:  palette
                });
              }
    });
  };

  window.RGBaster = window.RGBaster || RGBaster;

})(window);
},{}],126:[function(require,module,exports){

},{}],127:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],128:[function(require,module,exports){
/*global define:false */
/**
 * Copyright 2015 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.5.3
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {Object}
     */
    var _KEYCODE_MAP = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111 : '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a US keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on US keyboards
     *
     * @type {Object}
     */
    var _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {Object}
     */
    var _SPECIAL_ALIASES = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _MAP from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {Object|undefined}
     */
    var _REVERSE_MAP;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i;
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsTo(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsTo(element.parentNode, ancestor);
    }

    function Mousetrap(targetElement) {
        var self = this;

        targetElement = targetElement || document;

        if (!(self instanceof Mousetrap)) {
            return new Mousetrap(targetElement);
        }

        /**
         * element to attach key events to
         *
         * @type {Element}
         */
        self.target = targetElement;

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        self._directMap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        var _sequenceLevels = {};

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        var _resetTimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignoreNextKeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignoreNextKeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextExpectedAction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {Object} doNotReset
         * @returns void
         */
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};

            var activeSequences = false,
                key;

            for (key in _sequenceLevels) {
                if (doNotReset[key]) {
                    activeSequences = true;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }

            if (!activeSequences) {
                _nextExpectedAction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event|Object} e
         * @param {string=} sequenceName - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {Array}
         */
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _isModifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequenceName or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deleteCombo = !sequenceName && callback.combo == combination;
                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                    if (deleteCombo || deleteSequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {Function} callback
         * @param {Event} e
         * @returns void
         */
        function _fireCallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventDefault(e);
                _stopPropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event} e
         * @returns void
         */
        self._handleKey = function(character, modifiers, e) {
            var callbacks = _getMatches(character, modifiers, e);
            var i;
            var doNotReset = {};
            var maxLevel = 0;
            var processedSequenceCallback = false;

            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxLevel = Math.max(maxLevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxLevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetSequences call
                    if (callbacks[i].level != maxLevel) {
                        continue;
                    }

                    processedSequenceCallback = true;

                    // keep a list of which sequences were matches for later
                    doNotReset[callbacks[i].seq] = 1;
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedSequenceCallback) {
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextExpectedAction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                _resetSequences(doNotReset);
            }

            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {Event} e
         * @returns void
         */
        function _handleKeyEvent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keyCode;
            }

            var character = _characterFromEvent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                _ignoreNextKeyup = false;
                return;
            }

            self.handleKey(character, _eventModifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetSequenceTimer() {
            clearTimeout(_resetTimer);
            _resetTimer = setTimeout(_resetSequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {Array} keys
         * @param {Function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindSequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequenceLevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextAction
             * @returns {Function}
             */
            function _increaseSequence(nextAction) {
                return function() {
                    _nextExpectedAction = nextAction;
                    ++_sequenceLevels[combo];
                    _resetSequenceTimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            function _callbackAndReset(e) {
                _fireCallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignoreNextKeyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isFinal = i + 1 === keys.length;
                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                _bindSingle(keys[i], wrappedCallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {Function} callback
         * @param {string=} action
         * @param {string=} sequenceName - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindSingle(combination, callback, action, sequenceName, level) {

            // store a direct mapped reference for use with Mousetrap.trigger
            self._directMap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindSequence(combination, sequence, callback, action);
                return;
            }

            info = _getKeyInfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {Array} combinations
         * @param {Function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindMultiple = function(combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindSingle(combinations[i], callback, action);
            }
        };

        // start!
        _addEvent(targetElement, 'keypress', _handleKeyEvent);
        _addEvent(targetElement, 'keydown', _handleKeyEvent);
        _addEvent(targetElement, 'keyup', _handleKeyEvent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    Mousetrap.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directMap dict.
     *
     * TODO: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|Array} keys
     * @param {string} action
     * @returns void
     */
    Mousetrap.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {}, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    Mousetrap.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
            self._directMap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    Mousetrap.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @param {Element} element
     * @return {boolean}
     */
    Mousetrap.prototype.stopCallback = function(e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsTo(element, self.target)) {
            return false;
        }

        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
    };

    /**
     * exposes _handleKey publicly so it can be overwritten by extensions
     */
    Mousetrap.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
    };

    /**
     * Init the global mousetrap functions
     *
     * This method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    Mousetrap.init = function() {
        var documentMousetrap = Mousetrap(document);
        for (var method in documentMousetrap) {
            if (method.charAt(0) !== '_') {
                Mousetrap[method] = (function(method) {
                    return function() {
                        return documentMousetrap[method].apply(documentMousetrap, arguments);
                    };
                } (method));
            }
        }
    };

    Mousetrap.init();

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose as a common js module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Mousetrap;
    }

    // expose mousetrap as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return Mousetrap;
        });
    }
}) (window, document);

},{}],129:[function(require,module,exports){
/**
 * adds a bindGlobal method to Mousetrap that allows you to
 * bind specific keyboard shortcuts that will still work
 * inside a text input field
 *
 * usage:
 * Mousetrap.bindGlobal('ctrl+s', _saveChanges);
 */
/* global Mousetrap:true */
(function(Mousetrap) {
    var _globalCallbacks = {};
    var _originalStopCallback = Mousetrap.prototype.stopCallback;

    Mousetrap.prototype.stopCallback = function(e, element, combo, sequence) {
        var self = this;

        if (self.paused) {
            return true;
        }

        if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
            return false;
        }

        return _originalStopCallback.call(self, e, element, combo);
    };

    Mousetrap.prototype.bindGlobal = function(keys, callback, action) {
        var self = this;
        self.bind(keys, callback, action);

        if (keys instanceof Array) {
            for (var i = 0; i < keys.length; i++) {
                _globalCallbacks[keys[i]] = true;
            }
            return;
        }

        _globalCallbacks[keys] = true;
    };

    Mousetrap.init();
}) (Mousetrap);

},{}],130:[function(require,module,exports){
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.NProgress = factory();
  }

})(this, function() {
  var NProgress = {};

  NProgress.version = '0.2.0';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
  NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

  NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

  NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   *
   * @param $promise jQUery Promise
   */
  (function() {
    var initial = 0, current = 0;

    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() === "resolved") {
        return this;
      }

      if (current === 0) {
        NProgress.start();
      }

      initial++;
      current++;

      $promise.always(function() {
        current--;
        if (current === 0) {
            initial = 0;
            NProgress.done();
        } else {
            NProgress.set((initial - current) / initial);
        }
      });

      return this;
    };

  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress');

    addClass(document.documentElement, 'nprogress-busy');
    
    var progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;
    
    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

  NProgress.remove = function() {
    removeClass(document.documentElement, 'nprogress-busy');
    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
    var progress = document.getElementById('nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return !!document.getElementById('nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

  NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

  var queue = (function() {
    var pending = [];
    
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop, 
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});


},{}],131:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = require('./src/js/adaptor/jquery');

},{"./src/js/adaptor/jquery":132}],132:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('../main')
  , psInstances = require('../plugin/instances');

function mountJQuery(jQuery) {
  jQuery.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      if (typeof settingOrCommand === 'object' ||
          typeof settingOrCommand === 'undefined') {
        // If it's an object or none, initialize.
        var settings = settingOrCommand;

        if (!psInstances.get(this)) {
          ps.initialize(this, settings);
        }
      } else {
        // Unless, it may be a command.
        var command = settingOrCommand;

        if (command === 'update') {
          ps.update(this);
        } else if (command === 'destroy') {
          ps.destroy(this);
        }
      }

      return jQuery(this);
    });
  };
}

if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define(['jquery'], mountJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    mountJQuery(jq);
  }
}

module.exports = mountJQuery;

},{"../main":138,"../plugin/instances":149}],133:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

},{}],134:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],135:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],136:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],137:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('./class')
  , d = require('./dom');

exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

exports.clone = function (obj) {
  if (obj === null) {
    return null;
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = this.clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = this.clone(original);
  for (var key in source) {
    result[key] = this.clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return d.matches(el, "input,[contenteditable]") ||
         d.matches(el, "select,[contenteditable]") ||
         d.matches(el, "textarea,[contenteditable]") ||
         d.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return this.toInt(d.css(element, 'width')) +
         this.toInt(d.css(element, 'paddingLeft')) +
         this.toInt(d.css(element, 'paddingRight')) +
         this.toInt(d.css(element, 'borderLeftWidth')) +
         this.toInt(d.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":133,"./dom":134}],138:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var destroy = require('./plugin/destroy')
  , initialize = require('./plugin/initialize')
  , update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":140,"./plugin/initialize":148,"./plugin/update":152}],139:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = {
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  stopPropagationOnClick: true,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  useKeyboard: true,
  useSelectionScroll: false,
  wheelPropagation: false,
  wheelSpeed: 1
};

},{}],140:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  d.remove(i.scrollbarX);
  d.remove(i.scrollbarY);
  d.remove(i.scrollbarXRail);
  d.remove(i.scrollbarYRail);
  h.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":134,"../lib/helper":137,"./instances":149}],141:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = window.Event.prototype.stopPropagation.bind;

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarY, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var halfOfScrollbarLength = h.toInt(i.scrollbarYHeight / 2);
    var positionTop = i.railYRatio * (e.pageY - window.scrollY - pageOffset(i.scrollbarYRail).top - halfOfScrollbarLength);
    var maxPositionTop = i.railYRatio * (i.railYHeight - i.scrollbarYHeight);
    var positionRatio = positionTop / maxPositionTop;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    updateScroll(element, 'top', (i.contentHeight - i.containerHeight) * positionRatio);
    updateGeometry(element);

    e.stopPropagation();
  });

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarX, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var halfOfScrollbarLength = h.toInt(i.scrollbarXWidth / 2);
    var positionLeft = i.railXRatio * (e.pageX - window.scrollX - pageOffset(i.scrollbarXRail).left - halfOfScrollbarLength);
    var maxPositionLeft = i.railXRatio * (i.railXWidth - i.scrollbarXWidth);
    var positionRatio = positionLeft / maxPositionLeft;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    updateScroll(element, 'left', ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../../lib/helper":137,"../instances":149,"../update-geometry":150,"../update-scroll":151}],142:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../../lib/dom')
  , h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = i.scrollbarXRail.getBoundingClientRect().left + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = h.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    h.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = h.toInt(d.css(i.scrollbarX, 'left')) * i.railXRatio;
    h.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = i.scrollbarYRail.getBoundingClientRect().top + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = h.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    h.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = h.toInt(d.css(i.scrollbarY, 'top')) * i.railYRatio;
    h.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":134,"../../lib/helper":137,"../instances":149,"../update-geometry":150,"../update-scroll":151}],143:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (e.isDefaultPrevented && e.isDefaultPrevented()) {
      return;
    }

    if (!hovered) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      // go deeper if element is a webcomponent
      while (activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }
      if (h.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      deltaX = -30;
      break;
    case 38: // up
      deltaY = 30;
      break;
    case 39: // right
      deltaX = 30;
      break;
    case 40: // down
      deltaY = -30;
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/helper":137,"../instances":149,"../update-geometry":150,"../update-scroll":151}],144:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    return [deltaX, deltaY];
  }

  function shouldBeConsumedByTextarea(deltaX, deltaY) {
    var hoveredTextarea = element.querySelector('textarea:hover');
    if (hoveredTextarea) {
      var maxScrollTop = hoveredTextarea.scrollHeight - hoveredTextarea.clientHeight;
      if (maxScrollTop > 0) {
        if (!(hoveredTextarea.scrollTop === 0 && deltaY > 0) &&
            !(hoveredTextarea.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = hoveredTextarea.scrollLeft - hoveredTextarea.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(hoveredTextarea.scrollLeft === 0 && deltaX < 0) &&
            !(hoveredTextarea.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    // FIXME: this is a quick fix for the select problem in FF and IE.
    // If there comes an effective way to deal with the problem,
    // this lines should be removed.
    if (!h.env.isWebKit && element.querySelector('select:focus')) {
      return;
    }

    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByTextarea(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../../lib/helper":137,"../instances":149,"../update-geometry":150,"../update-scroll":151}],145:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":149,"../update-geometry":150}],146:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    h.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        h.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        h.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        h.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        h.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":137,"../instances":149,"../update-geometry":150,"../update-scroll":151}],147:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  }

  if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element, supportsTouch, supportsIePointer) {
  var i = instances.get(element);
  bindTouchHandler(element, i, supportsTouch, supportsIePointer);
};

},{"../instances":149,"../update-geometry":150,"../update-scroll":151}],148:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry');

// Handlers
var clickRailHandler = require('./handler/click-rail')
  , dragScrollbarHandler = require('./handler/drag-scrollbar')
  , keyboardHandler = require('./handler/keyboard')
  , mouseWheelHandler = require('./handler/mouse-wheel')
  , nativeScrollHandler = require('./handler/native-scroll')
  , selectionHandler = require('./handler/selection')
  , touchHandler = require('./handler/touch');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = h.extend(i.settings, userSettings);

  clickRailHandler(element);
  dragScrollbarHandler(element);
  mouseWheelHandler(element);
  nativeScrollHandler(element);

  if (i.settings.useSelectionScroll) {
    selectionHandler(element);
  }

  if (h.env.supportsTouch || h.env.supportsIePointer) {
    touchHandler(element, h.env.supportsTouch, h.env.supportsIePointer);
  }
  if (i.settings.useKeyboard) {
    keyboardHandler(element);
  }

  updateGeometry(element);
};

},{"../lib/class":133,"../lib/helper":137,"./handler/click-rail":141,"./handler/drag-scrollbar":142,"./handler/keyboard":143,"./handler/mouse-wheel":144,"./handler/native-scroll":145,"./handler/selection":146,"./handler/touch":147,"./instances":149,"./update-geometry":150}],149:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , defaultSettings = require('./default-setting')
  , EventManager = require('../lib/event-manager')
  , guid = require('../lib/guid')
  , h = require('../lib/helper');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = h.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = d.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  i.scrollbarXRail = d.appendTo(d.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = d.appendTo(d.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = h.toInt(d.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : h.toInt(d.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = h.toInt(d.css(i.scrollbarXRail, 'borderLeftWidth')) + h.toInt(d.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  d.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
  d.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = d.appendTo(d.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = d.appendTo(d.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = h.toInt(d.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : h.toInt(d.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? h.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = h.toInt(d.css(i.scrollbarYRail, 'borderTopWidth')) + h.toInt(d.css(i.scrollbarYRail, 'borderBottomWidth'));
  d.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));
  d.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  if (typeof element.dataset === 'undefined') {
    return element.getAttribute('data-ps-id');
  } else {
    return element.dataset.psId;
  }
}

function setId(element, id) {
  if (typeof element.dataset === 'undefined') {
    element.setAttribute('data-ps-id', id);
  } else {
    element.dataset.psId = id;
  }
}

function removeId(element) {
  if (typeof element.dataset === 'undefined') {
    element.removeAttribute('data-ps-id');
  } else {
    delete element.dataset.psId;
  }
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/dom":134,"../lib/event-manager":135,"../lib/guid":136,"../lib/helper":137,"./default-setting":139}],150:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  d.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  d.css(i.scrollbarYRail, yRailOffset);

  d.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  d.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = d.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        d.remove(rail);
      });
    }
    d.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = d.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        d.remove(rail);
      });
    }
    d.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, h.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = h.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = 0;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, h.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = h.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  cls[i.scrollbarXActive ? 'add' : 'remove'](element, 'ps-active-x');
  cls[i.scrollbarYActive ? 'add' : 'remove'](element, 'ps-active-y');
};

},{"../lib/class":133,"../lib/dom":134,"../lib/helper":137,"./instances":149,"./update-scroll":151}],151:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('./instances');

var upEvent = document.createEvent('Event')
  , downEvent = document.createEvent('Event')
  , leftEvent = document.createEvent('Event')
  , rightEvent = document.createEvent('Event')
  , yEvent = document.createEvent('Event')
  , xEvent = document.createEvent('Event')
  , xStartEvent = document.createEvent('Event')
  , xEndEvent = document.createEvent('Event')
  , yStartEvent = document.createEvent('Event')
  , yEndEvent = document.createEvent('Event')
  , lastTop
  , lastLeft;

upEvent.initEvent('ps-scroll-up', true, true);
downEvent.initEvent('ps-scroll-down', true, true);
leftEvent.initEvent('ps-scroll-left', true, true);
rightEvent.initEvent('ps-scroll-right', true, true);
yEvent.initEvent('ps-scroll-y', true, true);
xEvent.initEvent('ps-scroll-x', true, true);
xStartEvent.initEvent('ps-x-reach-start', true, true);
xEndEvent.initEvent('ps-x-reach-end', true, true);
yStartEvent.initEvent('ps-y-reach-start', true, true);
yEndEvent.initEvent('ps-y-reach-end', true, true);

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = 0;
    element.dispatchEvent(yStartEvent);
    return; // don't allow negative scroll
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = 0;
    element.dispatchEvent(xStartEvent);
    return; // don't allow negative scroll
  }

  var i = instances.get(element);

  if (axis === 'top' && value > i.contentHeight - i.containerHeight) {
    element.scrollTop = i.contentHeight - i.containerHeight;
    element.dispatchEvent(yEndEvent);
    return; // don't allow scroll past container
  }

  if (axis === 'left' && value > i.contentWidth - i.containerWidth) {
    element.scrollLeft = i.contentWidth - i.containerWidth;
    element.dispatchEvent(xEndEvent);
    return; // don't allow scroll past container
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(upEvent);
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(downEvent);
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(leftEvent);
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(rightEvent);
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(yEvent);
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(xEvent);
  }

};

},{"./instances":149}],152:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  d.css(i.scrollbarXRail, 'display', 'block');
  d.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  d.css(i.scrollbarXRail, 'display', 'none');
  d.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  d.css(i.scrollbarXRail, 'display', '');
  d.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":134,"../lib/helper":137,"./instances":149,"./update-geometry":150}]},{},[4])(4)
});
//# sourceMappingURL=builder.map

/* Modules bundled with Browserify */
