(function() {

	tinymce.PluginManager.add( 'shortcodes_editor_button', function( editor, url ) {

		editor.addButton( 'shortcodes_editor_button', {
			title: 'Shortcodes Indep',
			type: 'menubutton',
			icon: 'icon shortcodes-editor-icon',
			menu: [


				/* ACCORDION */
				{
					text: 'Accordion',
					onclick: function() {
						editor.insertContent('[accordion]<br />[item title="Title 1"]Text[/item]<br />[item title="Title 2"]Text[/item]<br />[item title="Title 3"]Text[/item]<br />[/accordion]');
					}
				}, // ACCORDION



				/* BUTTONS */
				{
					text: 'Button',
					onclick: function() {
						editor.windowManager.open( {
							title: 'Button',
							body: [

								// Button Text
								{
									type: 'textbox',
									name: 'content',
									label: 'Text',
									value: 'Button Text'
								},

								// Button Color
								{
									type: 'listbox',
									name: 'color',
									label: 'Color',
									'values': [
										{text: 'Red', value: 'red'},
										{text: 'Pink', value: 'pink'},
										{text: 'Orange', value: 'orange'},
										{text: 'Yellow', value: 'yellow'},
										{text: 'Green', value: 'green'},
										{text: 'Teal', value: 'teal'},
										{text: 'Blue', value: 'blue'},
										{text: 'Purple', value: 'purple'},
										{text: 'Brown', value: 'brown'},
										{text: 'Gray', value: 'gray'},
										{text: 'Black', value: 'black'}
									]
								},

								// Text Color
								{
									type: 'listbox', 
									name: 'text', 
									label: 'Text Color',
									'values': [
										{text: 'White', value: 'white'},
										{text: 'Black', value: 'black'}
									]
								},

								// Button URL
								{
									type: 'textbox', 
									name: 'url',
									label: 'URL',
									value: 'http://'
								},

								// Button Target
								{
									type: 'listbox', 
									name: 'openin', 
									label: 'Open In',
									'values': [
										{text: 'Same Window', value: '_self'},
										{text: 'New Window', value: '_blank'}
									]
								} 

							],
							onsubmit: function( e ) {
								editor.insertContent( '[button content="' + e.data.content + '" color="' + e.data.color + '" text="' + e.data.text + '" url="' + e.data.url + '" openin="' + e.data.openin + '"]');
							}
						});
					}
				}, // BUTTONS



				/* COLUMNS */
				{
					text: 'Columns',
					menu: [

						/* Two */
						{
							text: 'Two Columns',
							onclick: function() {
								editor.insertContent('[columns_row width="half"]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[/columns_row]');
							}
						}, // Two

						/* Three */
						{
							text: 'Three Columns',
							onclick: function() {
								editor.insertContent('[columns_row width="third"]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[/columns_row]');
							}
						}, // Three

						/* Four */
						{
							text: 'Four Columns',
							onclick: function() {
								editor.insertContent('[columns_row width="fourth"]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[/columns_row]');
							}
						}, // Four

						/* Third & Two Thirds */
						{
							text: 'Third & Two Thirds',
							onclick: function() {
								editor.insertContent('[columns_row width="third-and-two-thirds"]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[/columns_row]');
							}
						}, // Third & Two Thirds

						/* Two Thirds & Third */
						{
							text: 'Two Thirds & Third',
							onclick: function() {
								editor.insertContent('[columns_row width="two-thirds-and-third"]<br />[column]Add Text or Shortcode[/column]<br />[column]Add Text or Shortcode[/column]<br />[/columns_row]');
							}
						}, // Two Thirds & Third

					]
				}, // COLUMNS



				/* DROP CAP */
				{
					text: 'Drop Cap',
					onclick: function() {
						editor.insertContent('[dropcap letter="A"]');
					}
				}, // DROP CAP



				/* IMAGE BOX */
				{
					text: 'Image Box',
					onclick: function() {
						editor.windowManager.open( {
							title: 'Image Box',
							body: [

								// Image Path
								{
									type: 'textbox',
									minWidth: 350, 
									name: 'image', 
									label: 'Image URL',
									value: 'http://'
								},

								// Main Title
								{
									type: 'textbox',
									name: 'maintitle', 
									label: 'Main Title',
									value: ''
								},

								// Sub Title
								{
									type: 'textbox', 
									name: 'subtitle', 
									label: 'Sub Title',
									value: ''
								},
								
								// Text Color
								{
									type: 'listbox', 
									name: 'color', 
									label: 'Text Color',
									'values': [
										{text: 'White', value: 'white'},
										{text: 'Black', value: 'black'}
									]
								},

								// Vertical Space
								{
									type: 'textbox', 
									name: 'space', 
									label: 'Vertical Space',
									value: '60'
								} ,

								// Link To
								{
									type: 'textbox', 
									name: 'link', 
									label: 'Link To',
									value: 'no link'
								} 

							],
							onsubmit: function( e ) {
								editor.insertContent( '[imagebox maintitle="' + e.data.maintitle + '" subtitle="' + e.data.subtitle + '" image="' + e.data.image + '" color="' + e.data.color + '" space="' + e.data.space + '" link="' + e.data.link + '"]');
							}
						});
					}
				}, // IMAGE BOX



				/* INFOBOX */
				{
					text: 'Info Box',
					onclick: function() {
						editor.windowManager.open( {
							title: 'Info Box',
							body: [

								// Infobox Main Title
								{
									type: 'textbox',
									minWidth: 350,
									name: 'maintitle', 
									label: 'Main Title',
									value: ''
								},

								// Infobox Sub Title
								{
									type: 'textbox', 
									name: 'subtitle', 
									label: 'Sub Title',
									value: ''
								},

								// Infobox Color
								{
									type: 'listbox',
									name: 'bg',
									label: 'Background',
									'values': [
										{text: 'Red', value: 'red'},
										{text: 'Pink', value: 'pink'},
										{text: 'Orange', value: 'orange'},
										{text: 'Yellow', value: 'yellow'},
										{text: 'Green', value: 'green'},
										{text: 'Teal', value: 'teal'},
										{text: 'Blue', value: 'blue'},
										{text: 'Purple', value: 'purple'},
										{text: 'Brown', value: 'brown'},
										{text: 'Gray', value: 'gray'},
										{text: 'Black', value: 'black'}
									]
								},

								// Infobox Text Color
								{
									type: 'listbox', 
									name: 'color', 
									label: 'Text Color',
									'values': [
										{text: 'Black', value: 'black'},
										{text: 'White', value: 'white'}
									]
								},

								// Opacity
								{
									type: 'listbox', 
									name: 'opacity', 
									label: 'Opacity',
									'values': [
										{text: 'Off', value: 'off'},
										{text: 'On', value: 'on'}
									]
								},

								// Vertical Space
								{
									type: 'textbox', 
									name: 'space', 
									label: 'Vertical Space',
									value: '30'
								},

								// Link To
								{
									type: 'textbox', 
									name: 'link', 
									label: 'Link To',
									value: 'no link'
								} 

							],
							onsubmit: function( e ) {
								editor.insertContent( '[infobox maintitle="' + e.data.maintitle + '" subtitle="' + e.data.subtitle + '" bg="' + e.data.bg + '" color="' + e.data.color + '" opacity="' + e.data.opacity + '" space="' + e.data.space + '" link="' + e.data.link + '"]');
							}
						});
					}
				}, // INFOBOX



				/* TABS */
				{
					text: 'Tabs',
					menu: [

						/* Horizontal */
						{
							text: 'Horizontal',
							onclick: function() {
								editor.insertContent('[tabgroup layout="horizontal"]<br />[tab title="Title 1"]Text[/tab]<br />[tab title="Title 2"]Text[/tab]<br />[tab title="Title 3"]Text[/tab]<br />[/tabgroup]');
							}
						}, // Horizontal

						/* Vertical */
						{
							text: 'Vertical',
							onclick: function() {
								editor.insertContent('[tabgroup layout="vertical"]<br />[tab title="Title 1"]Text[/tab]<br />[tab title="Title 2"]Text[/tab]<br />[tab title="Title 3"]Text[/tab]<br />[/tabgroup]');
							}
						} // Vertical

					]
				}, // TABS



				/* TITLE */
				{
					text: 'Title',
					onclick: function() {
						editor.windowManager.open( {
							title: 'TItle',
							body: [

								// Main Title
								{
									type: 'textbox',
									minWidth:350,
									name: 'maintitle',
									label: 'Main Title',
									value: ''
								},

								// Sub Title
								{
									type: 'textbox',
									name: 'subtitle',
									label: 'Sub Title',
									value: ''
								}

							],
							onsubmit: function( e ) {
								editor.insertContent( '[title maintitle="' + e.data.maintitle + '" subtitle="' + e.data.subtitle + '"]');
							}
						});
					}
				}, // TITLE



				/* SITE AUTHORS */
				{
					text: 'Site Authors',
					onclick: function() {
						editor.windowManager.open( {
							title: 'Site Authors',
							body: [

								// Admins
								{
									type: 'listbox',
									minWidth: 200,
									name: 'admins',
									label: 'Show Admins',
									'values': [
										{text: 'No', value: 'no'},
										{text: 'Yes', value: 'yes'}
									]
								},

								// Authors
								{
									type: 'listbox',
									name: 'authors',
									label: 'Show Authors',
									'values': [
										{text: 'Yes', value: 'yes'},
										{text: 'No', value: 'no'}
									]
								},

								// Contributurs
								{
									type: 'listbox',
									name: 'contributors',
									label: 'Show Contributors',
									'values': [
										{text: 'No', value: 'no'},
										{text: 'Yes', value: 'yes'}
									]
								},

								// Editors
								{
									type: 'listbox',
									name: 'editors',
									label: 'Show Editors',
									'values': [
										{text: 'No', value: 'no'},
										{text: 'Yes', value: 'yes'}
									]
								},

								// Authors Layout
								{
									type: 'listbox', 
									name: 'layout', 
									label: 'Layout',
									'values': [
										{text: 'Two Columns', value: 'two-cols'},
										{text: 'Three Columns', value: 'three-cols'},
										{text: 'Four Columns', value: 'four-cols'}
									]
								},

								// Author Image Styling
								{
									type: 'listbox', 
									name: 'imagestyle', 
									label: 'Image Style',
									'values': [
										{text: 'Square', value: 'sqaure'},
										{text: 'Round', value: 'round'},
									]
								},

							],
							onsubmit: function( e ) {
								editor.insertContent( '[site_authors admins="' + e.data.admins + '" authors="' + e.data.authors + '" contributors="' + e.data.contributors + '" editors="' + e.data.editors + '" layout="' + e.data.layout + '" imagestyle="' + e.data.imagestyle + '"]');
							}
						});
					}
				}, // SITE AUTHORS



				/* SEPARATORS */
				{
					text: 'Separatos',
					menu: [

						/* Thick Line */
						{
							text: 'Thick Line',
							onclick: function() {
								editor.insertContent('[separator type="thick"]');
							}
						}, // Thick Line

						/* Thin Line */
						{
							text: 'Thin Line',
							onclick: function() {
								editor.insertContent('[separator type="thin"]');
							}
						}, // Thin Line

						/* White Space */
						{
							text: 'White Space',
							onclick: function() {
								editor.insertContent('[separator type="space"]');
							}
						} // White Space

					]
				}, // SEPARATORS

			]
		});

	});

})();