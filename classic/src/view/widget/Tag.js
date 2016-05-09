Ext.define('KJERP.view.widget.Tag', {
	extend:'Ext.form.field.Tag',
	xtype:'kjerptag',
	fieldLabel: 'Tag',
	displayField: 'text',
	valueField: 'value',
	name:'tag',
	typeAhead:false,
	scrollable:true,
	editable:false,
	queryMode: 'local',
	selectOnFocus:false,
	filterPickList: true,
	emptyText:'Select tag...',
	delimiter:',',
	config:{
		appCategory:null
	},

	initComponent:function() {
		var me = this,
			appCategory = me.getAppCategory();
			
		var filteredTags = [];
		
		if (appCategory) {
			for (var i=0;i<appCategory.length;i++) {
				for (var j=0; j<_DATA.tags.length; j++) {
					var tag = _DATA.tags[j];
					if (tag.appCategory == null || tag.appCategory.length == 0 || tag.appCategory.indexOf(appCategory[i]) !== -1) {
						filteredTags.push(tag);
						break;
					}
				}
			}
		} else {
			filteredTags = _DATA.tags;
		}
		
		me.store = {
			field:['text'],
			data:filteredTags
		};		
		
		me.callParent(arguments)
	}
 });  