Ext.define('KJERP.view.product.List', {
    extend: 'Ext.tree.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.ProductComponent',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
        'Ext.data.*',
        'Ext.tree.*',
        'KJERP.view.widget.*'
	],
	xtype:'productlist',
	emptyText:_GRID.emptyText,
	header:{
		title:'Product Management',
		iconCls:'my-panel-icon-product'
	},
	useArrows: true,
	rootVisible: false,
	multiSelect: false,
	singleExpand: false,	
	iconCls:'my-panel-icon-product',
	config:{
		authCode:'600',
		popupSelectionMode:false,
		popupDestStore:null,
		isUpdateSelected:false,
		toHideFields:[],
		callbackOnSelect:null,
		totalCount:0
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[
			{
				xtype:'hiddenfield',
				name:'isProduct',
				value:'1'	// bring not product company
			},
			{
				xtype:'searchtextfield',
				name: 'ALL',
	        	emptyText: 'Name/Model...'
			}, {
				xtype:'datacombo',
				fieldLabel:'',
				name:'state',
				width:_LIST.queryFieldWidth,
				comboData:_DATA.stateComponent,
				emptyText:'Status'	       
			}, {
				xtype:'kjerptag',
				fieldLabel:'',
				name:'tag',
				emptyText:'Tag'	 			        	
			}, {
				xtype:'button', text:_TOOLBAR.label.search, action:'search', glyph:_GLYPH.toolbar.search
			}, {
				xtype:'button', text:_TOOLBAR.label.excel, action:'excel', glyph:_GLYPH.toolbar.excel
			}, { 
				xtype:'tbspacer', flex:1 
			}, {
				xtype:'tbseparator'
			},{
				xtype:'button', text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			},{
				xtype:'button', text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true
			},{
				xtype:'button', text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, hidden:true, disabled:true
			}, {
				xtype:'button', text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true
			}, {
				xtype:'button', text:_TOOLBAR.label.select, action:'select', glyph:_GLYPH.toolbar.add, hidden:true, disabled:false
        }]
	}],
    features:[{
    	id:'summary',
        ftype:'summary',
        dock:'bottom',
        name:'summary'
    }],
	//선택 팝업
    enableSelectionMode:function(selectedMode) {
    	var me = this;
    	
    	me.down('button[action=add]').setHidden(selectedMode);
    	me.down('button[action=excel]').setHidden(selectedMode);
    	me.down('button[action=del]').setHidden(selectedMode);
		me.down('button[action=edit]').setHidden(selectedMode);
		me.down('button[action=view]').setHidden(selectedMode);
		me.down('button[action=select]').setHidden(!selectedMode);
		
		//선택 팝업의 경우 숨길 필드 지정 
		if (selectedMode) {
			var toHideFields = me.getToHideFields();
			for(i=0;i<toHideFields.length;i++){
				me.down('[dataIndex='+toHideFields[i]+']').setHidden(selectedMode);
			}
		} else {
			
		}
    },
	selType: 'checkboxmodel',
	selectComponentByTag:function(parentNode, tags, allTags) {
		var me = this,
			isAllCheck = tags.length==allTags.length,
			isAllUnCheck = tags.length==0,
			toSelectNodes = [],
			toDeselectNodes = [],
			selectionModel = me.getSelectionModel();
		parentNode.set('selectedTags', tags);
		
		if (!isAllUnCheck) {
			selectionModel.select(parentNode, true);
		} else {
			toDeselectNodes.push(parentNode);
		}
		
		parentNode.childNodes.every(function(node) {
			var checked = false;
			if (isAllCheck) checked = true;
			
			if (!isAllCheck && !isAllUnCheck) {
				var itemTag = node.get('tag');
				if (itemTag) {
					for (var i=0;!checked && (i< tags.length);i++) {
						if (itemTag.indexOf(tags[i]) != -1) {
							checked = true;
						}
					}
				}
			}
			
			if (checked) toSelectNodes.push(node); 
			else  toDeselectNodes.push(node);
			
			return true;
		});
		selectionModel.deselect(toDeselectNodes);
		selectionModel.select(toSelectNodes, true);
	},
	listeners:{
		itemcontextmenu: function(tree, record, item, index, e, eOpts ) {
			var me = this;
			if (!me.getPopupSelectionMode()) return;
			
			var tags = _DATA.tags;
			var menuItems = [];
			var parentNode = record.isLeaf()?record.parentNode:record;
			var selectedTags = parentNode.get('selectedTags');
			
			if (!selectedTags) {
				selectedTags = [];
			}
			
			var selectMenuItem = function(menu, selectAll) {
				menu.items.each(function(menuItem) {
					if (menuItem.getXType() ==='menucheckitem') {
						menuItem.setChecked(selectAll);
					}
				});
			};
			var allTags = [];
			menuItems.push({
				text: 'select all',
				iconCls:'my-tree-icon-check',
				handler:function() {
					selectMenuItem(this.up('menu'), true);
					me.selectComponentByTag(parentNode, allTags, allTags);
				}
			});
			menuItems.push({
				text: 'deselect all',
				iconCls:'my-tree-icon-uncheck',
				handler:function() {
					selectMenuItem(this.up('menu'), false);
					me.selectComponentByTag(parentNode, [], allTags)
				}
			});
			menuItems.push({
				xtype: 'menuseparator'
			});			
			for (var i=0;i<tags.length;i++) {
				var tag = tags[i];
				if (tag.appCategory.indexOf('product') <0) continue;
				
				allTags.push(tag.value);
				menuItems.push({
					xtype: 'menucheckitem',
					text: tag.value,
					checked: selectedTags.indexOf(tag.value)<0?false:true,
					handler:function(item) {
						if (item.checked) { // add tag
							var pos = selectedTags.indexOf(item.text);
							if (pos<0) selectedTags.push(item.text);
						} else {
							var pos = selectedTags.indexOf(item.text);
							if (pos != -1) {
								selectedTags.splice(pos,1);
							}
						}
						me.selectComponentByTag(parentNode, selectedTags, allTags);
					}
				});
			}
			menuItems.push({
				xtype: 'menuseparator'
			});			   
			menuItems.push({
				iconCls:'my-tree-icon-exlink',
				text: 'Select components',
				handler:function() {
					var button = me.down('button[action=select]');
					button.fireEventArgs('click', [button]);
				}
			});			
			
			var menu = new Ext.menu.Menu({ 
				items:menuItems
            });
			var position = e.getXY();
			e.stopEvent();
			menu.showAt(position);
       },
		select: function (model, record, index, eOpts) {
			var me = this;
			if (record.isLeaf()) return;
			
			if (record.childNodes.length==0) {
				if (me.getPopupSelectionMode()) {
					record.expand(false,function(items) {	// 하위 컴포넌트 중에서 #standard만 선택함
						me.selectComponentByTag(record, ['#standard'], []);
					});
				}
			}
        }		
	},
	initComponent:function() {
		var me = this,
			popupSelectionMode = me.getPopupSelectionMode();
		
		me.viewConfig = {
			markDirty:false
		};
		if (popupSelectionMode) {
			me.viewConfig.plugins = {
				ptype: 'treeviewdragdrop',
	            containerScroll: true,
	            dragText: 'Drag product to select',
	            enableDrag:true
	        };
		}
		
		me.store = new Ext.data.TreeStore({
            model:'KJERP.model.Product',
            remoteSort: false,
            autoLoad:false,
			defaultRootProperty:'rows',
            proxy:  {
				type:'ajax',
		 		url: _GLOBAL.URL_SERVICE+'?service=getProductList',
		        enablePaging: false,
				actionMethods : {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
		        noCache:true,
		        useDefaultXhrHeader:false    
        	},
			listeners: {
				nodeappend:function(store, node, index) {
			   		if (me.getPopupSelectionMode() && me.getIsUpdateSelected()) {
		   				var destStore = me.getPopupDestStore();
		   				if (destStore.getRootNode().findChild('componentIdx', node.get('componentIdx'), true)) {
		   					node.set('selected', true);
		   				}
			   		}
				},
		        beforeload: function(store, operation, eOpts) {
					var node = operation.node,
						proxy = store.getProxy();
					// query product component	
		           	if (node === store.getRootNode()) return;
		           	proxy.setUrl(_GLOBAL.URL_SERVICE+'?service=getProductComponents');
		           	var params = {
		           		filters:[{
		           			property:'componentIdx', value:node.get('componentIdx')
		           		}],
		           		isLeaf:true
		           	};
		           	proxy.setExtraParams(
		           		{data:_Base64.encodeJson(params)}
		           	);
		        }
		    }
        });	
        
        me.header = popupSelectionMode?false:me.header;	// hide title if popup
		me.columns = [
		{
			xtype: 'treecolumn',
		 	text: 'Name',
		 	width:200,
		 	sortable: true,
		 	dataIndex: 'name',	
			summaryType:function(values){
			    var parentCount=0;
			
			    Ext.Array.forEach(values, function (record) {
			    	if (!record.get('leaf')) parentCount++;
			    });
			    
				me.setTotalCount(parentCount);
			},
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', me.getTotalCount());
	        }				
		}, {
			text:'Model',
			dataIndex:'model',
			renderer:_RENDER.infoComponent,			
			width:150	
		}, {
			text:'Select',
			dataIndex:'selected',
			renderer:_RENDER.selectedComponent,			
			hidden:!me.popupSelectionMode,
			align:'center',
			width:60	
		}, {
			text:'Type',
			dataIndex:'type',
			width:100
		}, {
			text:'Maker',
			dataIndex:'companySName',
			renderer:_RENDER.companySName,
			width:100
		}, {
			text:'Group',
			dataIndex:'compGroupName',
			width:120	
		}, {
			text:'Tag',
			dataIndex:'tag',
			width:200
		}, {
			text:'Mass',
			dataIndex:'mass',
			width:60			
		}, {
			text:'Color',
			dataIndex:'color',
			width:60			
		}, {
			text:'Volume',
			dataIndex:'volume',
			width:80			
		}, {
			text:'CUR',
			dataIndex:'currency',
			width:50				
		}, {
			text:'Purchase<br/>Price',
			dataIndex:'purchasePrice',
			width:100			
		}, {
			text:'List<br/>Price',
			dataIndex:'listPrice',
			width:100			
		}, {
			text:'Discount<br/>Price',
			dataIndex:'discountPrice',
			width:100		
		}, {
			text:'Unit',
			dataIndex:'unit',
			width:100				
		}, {
			text:'Remark',
			dataIndex:'remark',
			width:150			
		}, {
			text:'Status',
			dataIndex:'state',
			renderer:_RENDER.stateComponent,
			width:100				
		}, {
			xtype:'actioncolumn',
		 	width: 60,		 	
		 	hidden:_GRID.actionMenuHidden,
		 	align:'center',
		    sortable: false,
		    text:_GRID.label.action,
		    menuDisabled: true,
		    items: [{
		       glyph:_GLYPH.toolbar.edit,
		        iconCls:'action_icon',
		        tooltip: _GRID.label.tipEdit,
		        scope: this,
		        handler: function(grid, rowIndex, colIndex) {				        	
		       		_DEBUG.log('action edit!!');
		       		grid.setSelection(rowIndex);
		       		KJERP.controller.Main.shortWindowMenu(grid,'edit');			       		
				}
		    }, {
		        icon: _ICON.toolbar.del,
		        iconCls:'action_icon',
		        tooltip: _GRID.label.tipDel,
		        scope: this,
		        handler: function(grid, rowIndex, colIndex) {
		        	_DEBUG.log('action delete!!');
		        	grid.setSelection(rowIndex);
		       		KJERP.controller.Main.shortWindowMenu(grid,'del');
				}		    	
		    }] 						
		}];
		me.callParent(arguments); //initProduct 부모의 실행한다. 		
		
		me.down('button[action=select]').on(
				'click',
				function() {
					var callback = me.getCallbackOnSelect();
					if (!callback) return;
					callback(me.getSelection());
				},
				me
		);
		me.on('itemclick', function( view, record, item, index, event, eOpts ) {
			if (event.getTarget('a.infoComponent')) {
				event.stopEvent();
				_FUNCTION.showInfoComponent(record.get('componentIdx'));
			}
		});		
		me.enableSelectionMode(popupSelectionMode);
	}
});