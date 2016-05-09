/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'KJERP',
    extend: 'KJERP.Application',
	paths : {
//		'Ext.ux':'classic/libs'
//		'Ext.ux.exporter' : 'classic/libs/exporter',
//		'Ext.ux.editor' : 'classic/libs/editor',
//		'Ext.ux.grid' : 'classic/libs/grid',
//		'Ext.ux.field' : 'classic/libs/field'
	},
    requires: [
        'KJERP.view.main.Main'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView:'KJERP.view.main.Main'

	
    //-------------------------------------------------------------------------
    // Most customizations should be made to KJERP.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
