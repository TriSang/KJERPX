Ext.define('KJERP.view.vessel.Equipments', {
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
		'Ext.grid.plugin.CellEditing',
        'Ext.data.*',
        'Ext.tree.*'		
	],
	xtype:'vesselequipments',
	title:'Equipments (0)',
	header:false,
	style:_GRID.borderStyle,
	useArrows: true,
	rootVisible: false,
	multiSelect: false,
	singleExpand: false,		
	config:{
		authCode:'700'
	},
	viewConfig: {
        plugins: {
			ptype: 'treeviewdragdrop',
            containerScroll: true,
            dragText: 'Drag and drop to reorganize',
            enableDrag:true,
            enableDrop:true
        },
		listeners: {
            nodedragover: _FUNCTION.treeNodeDragOverProduct,
            drop:_FUNCTION.treeNodeDropProduct
		}
    },		
	dockedItems:[{
		xtype:'toolbar',
		items:[{
				xtype:'tbspacer', flex:1 
			},{
				xtype:'button', text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			},{
				xtype:'button', text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true, hidden:true
			},{
				xtype:'button', text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, disabled:true, hidden:true
			}, {
				xtype:'button', text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true
			}, {
				xtype:'button', text:_TOOLBAR.label.save, action:'save', glyph:_GLYPH.toolbar.save, disabled:false				
        }]
	}],
	//선택 팝업
    enableSelectionMode:function(selectedMode) {
    	if (!selectedMode) selectedMode = true;
    	
		this.down('button[action=add]').setHidden(selectedMode);
		this.down('button[action=excel]').setHidden(selectedMode);
		this.down('button[action=del]').setHidden(selectedMode);
		this.down('button[action=edit]').setHidden(selectedMode);
		this.down('button[action=select]').setHidden(!selectedMode);
		
		//선택 팝업의 경우 숨길 필드 지정 
		var toHideFields = [];
		for(i=0;i<fields.length;i++){
			this.down('[dataIndex='+toHideFields[i]+']').setHidden(selectedMode);
		}
    },

	selType: 'checkboxmodel',
	plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
	drawOrderRender:function(value, meta, record) {
		if (record.isLeaf()) return '';
		if (value) {
			return '<a href="#"><img src="resources/images/icon/check.png" class="dwOrderUncheck my-drawing-icon" title="Hide drawing status"></img></a>';
		} else {
			return '<a href="#"><img src="resources/images/icon/uncheck.png" class="dwOrderCheck my-drawing-icon" title="Show drawing status"></img></a>';
		}
	},
	drawItemRender:function(fieldPrefix, value, meta, record) {
    	var isDrawOrder = record.get('dwOrder');
    	if (record.isLeaf()) return '';
    	
    	var category = 'DAP';
    	if (fieldPrefix.indexOf('dwWorking')!=-1) {
    		category = 'DWK';
    	} else if (fieldPrefix.indexOf('dwFinal')!=-1) {
    		category = 'DFI';
    	} 
    	
        if (!isDrawOrder) return '';
    	var files = record.get(fieldPrefix+'Files');
    	var fileLink = '';
    	if (files) {
    		if (files.length>0)
    			fileLink = '<a href="#"><img src="resources/images/icon/file.png" class="download_'+category+' my-drawing-icon" title="Click to download file"></img></a>';
    		else
        		fileLink = '<img src="resources/images/icon/nofile.png" class="my-drawing-icon" title="No files"></img>';
    	}
    	var comment = record.get(fieldPrefix+'Comment');
    	var commentLink ='';
    	if (comment && comment.length>0) {
    		commentLink = '<a href="#"><img src="resources/images/icon/comment.png" class="comment_'+category+' my-drawing-icon" title="see comments"></img></a>';
    	}
    	var stateTitle =_RENDER.stateDrawing(record.get(fieldPrefix+'State'));
    	var stateIcon = _FUNCTION.arrayIcon(record.get(fieldPrefix+'State'), _DATA.stateDrawing);
    	
    	var result = [
    		'<img src="',stateIcon,'" class="my-drawing-icon"  title="',stateTitle,'"></img>',	// state
    		commentLink,
    		fileLink,
    		'<a href="#"><img src="resources/images/icon/edit.png" class="edit_'+category+'" title="edit drawing"></img></a>'			// edit
    	].join('');
    	
    	return result;
    },	
	initComponent:function() {
		var me = this;		
		this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
		
		me.store = new Ext.data.TreeStore({
            model:'KJERP.model.EquipmentItem',
            remoteSort: false,
            autoLoad:false,
            autoDestroy:false,
			defaultRootProperty:'rows',
            root: {
                name: 'rows',
                expanded: true
        	},
			proxy:{
				type:'memory'
			}
        });
        me.columns = [{
			text:'No',
			xtype: 'rownumberer',
			width:40,
			align:'center',
			renderer:_RENDER.treeRowNumber
		}, {
			xtype: 'treecolumn',
			text:'Name',
			dataIndex:'name',
			width:200	
		}, {
			text:'Model',
			dataIndex:'model',
			renderer:_RENDER.infoComponent,	
			width:120	
		}, {
			text:'Maker',
			dataIndex:'companyName',
			width:100	
		}, {
			text:'Type',
			dataIndex:'type',
			width:100	
		}, {
			text:'Tag',
			dataIndex:'tag',
			width:200,
			editor:{
				xtype:'kjerptag',
				fieldLabel:'',
				allowBlank:true
			}				
		}, {
			text:'Qty',
			dataIndex:'qty',
			width:60,
			align:'center',
			editor:{
				allowBlank:false
			}
		}, {
			text:'Serial No',
			dataIndex:'serialNo',
			width:120,
			editor:{
				allowBlank:false
			}
		}, {
			text:'RMS',
			dataIndex:'equipmentItemIdx',
			width:60,
			align:'center',
			renderer:function(value, meta, record) {
				var html = '';
				if (!record.isLeaf()) {
					html = '<a href="#"><img src="resources/images/icon/rms.png" class="rms noDecoration my-drawing-icon" title="see RMS service"></img></a>';
				}
				return html;
			}			
		}, {
			text:'MyView',
			dataIndex:'equipmentItemIdx',
			width:70,
			align:'center',
			renderer:function(value, meta, record) {
				var html = '';
				if (!record.isLeaf()) {
					html = '<a href="" title="see myView service" class="myView noDecoration"><span class="my-tree-icon-eye"></span></a>'
				}
				return html;
			}
		}, {
			text:'Report',
			dataIndex:'reportFiles',
			align:'center',
			renderer:function(value, meta, record) {
				if (record.isLeaf()) return '';
				return _RENDER.files(value, 'reportFiles');
			},
			width:120
		}, {
			header:'Drawing',
			columns:[{
				text:'Check',
				align:'center',
				dataIndex:'dwOrder',
				width:60,
				renderer:me.drawOrderRender
			},{
				text:'Approval',
				dataIndex:'dwApproveState',
				width:110,
				align:'center',
				renderer:function(value, meta, record) {
					return me.drawItemRender('dwApprove', value, meta, record)
				}
			},{
				text:'Working',
				dataIndex:'dwWorkingState',
				width:110,
				align:'center',
				renderer:function(value, meta, record) {
					return me.drawItemRender('dwWorking', value, meta, record)
				}
			},{
				text:'Final',
				dataIndex:'dwFinalState',
				width:110,
				align:'center',
				renderer:function(value, meta, record) {
					return me.drawItemRender('dwFinal', value, meta, record)
				}
			}]
		}, {
			text:'Remark',
			dataIndex:'remark',
			editor:{
				allowBlank:false
			},			
			width:150					
		}];
		
		me.callParent(arguments); //initProduct 부모의 실행한다. 
		
		me.store.on('datachanged', function(store) {
			var count = _FUNCTION.getTreeItemCount(store);
			me.setTitle('Equipments ('+count+')');
		});
		var vesselMain = me.up('vesselmain');
		var funcEditDrawing = function(drawingItem, record) {
			var drawingForm = vesselMain.down('drawingform');
			var equipmentItemRecord = Ext.create('KJERP.model.DrawingItem', drawingItem);
			drawingForm.setEquipmentDrawingItem(equipmentItemRecord);
			drawingForm.setEquipmentItemRecord(record);
			vesselMain.setActiveItem(drawingForm);
		};
		me.on('itemclick',function( view, record, item, index, event, eOpts ) {
			if (event.getTarget('a.rms')) {
				event.stopEvent();
				var view = Ext.widget('htmlviewer', {
					title:'RMS',
					scrollable:false,
					bodyPadding:'0 0 0 0',					
					layout:'fit',
					items:[{
						xclass:'KJERP.view.widget.IFrame',
						src:'http://www.jrc.co.jp/eng/product/lineup/rms/'
					}]
				});
				view.show();
			} else if (event.getTarget('a.myView')) {
				event.stopEvent();
				var view = Ext.widget('htmlviewer', {
					layout:'fit',
					title:'MyView',
					scrollable:false,
					bodyPadding:'0 0 0 0',
					items:[{
						xclass:'KJERP.view.widget.IFrame',
						src:'http://myview.kjeng.kr:85'
					}]
				});
				view.show();
			} else if (event.getTarget('a.infoComponent')) {
				event.stopEvent();
				_FUNCTION.showInfoComponent(record.get('componentIdx'));
			} else if (event.getTarget('a.reportFiles')) {
				event.stopEvent();
				var isAdd = true, 
					appIdx = record.get('equipmentItemIdx'),
					appCategory = 'SRP',
					fileAppCategorys = ['SRP', 'ETC'];
					 _FUNCTION.showFileDownMenu(record, 'reportFiles', event, isAdd, appIdx, appCategory,fileAppCategorys );
			} else if (event.getTarget('img.dwOrderCheck')) {
				event.stopEvent();
				record.set('dwOrder', 1);
				KJERP.app.getController('Vessel').updateDrawingItem(record);
			} else if  (event.getTarget('img.dwOrderUncheck')) {
				event.stopEvent();
				record.set('dwOrder', 0);
			} else if (event.getTarget('img.edit_DAP')) {
				event.stopEvent();
            	funcEditDrawing({
            		'category':'DAP',
					'equipmentItemIdx':record.get('equipmentItemIdx'),
					'state':record.get('dwApproveState'),
					'comment':record.get('dwApproveComment'),
					'user':record.get('dwApproveUser'),
					'date':record.get('dwApproveDate')
				}, record);
            } else if (event.getTarget('img.edit_DWK')) {
            	event.stopEvent();
            	funcEditDrawing({
            		'category':'DWK',
					'equipmentItemIdx':record.get('equipmentItemIdx'),
					'state':record.get('dwWorkingState'),
					'comment':record.get('dwWorkingComment'),
					'user':record.get('dwWorkingUser'),
					'date':record.get('dwWorkingDate')
				}, record);
            } else if (event.getTarget('img.edit_DFI')) {
            	event.stopEvent();
            	funcEditDrawing({
            		'category':'DFI',
					'equipmentItemIdx':record.get('equipmentItemIdx'),
					'state':record.get('dwFinalState'),
					'comment':record.get('dwFinalComment'),
					'user':record.get('dwFinalUser'),
					'date':record.get('dwFinalDate')
				}, record);            	
            } else if (event.getTarget('img.download_DAP')) {
            	event.stopEvent();
            	_FUNCTION.showFileDownMenu(record, 'dwApproveFiles', event);
            } else if (event.getTarget('img.download_DWK')) {
            	event.stopEvent();
            	_FUNCTION.showFileDownMenu(record, 'dwWorkingFiles', event);
            } else if (event.getTarget('img.download_DFI')) {
            	event.stopEvent();
            	_FUNCTION.showFileDownMenu(record, 'dwFinalFiles', event);
            } else if (event.getTarget('img.comment_DAP')) {
            	event.stopEvent();
            	Ext.widget('htmlviewer', {
            		title:'Comment \''+record.get('name')+'/'+record.get('model')+'\'',
            		html:record.get('dwApproveComment')
            	}).show();           	
            } else if (event.getTarget('img.comment_DWK')) {
            	event.stopEvent();
            	Ext.widget('htmlviewer', {
            		title:'Comment \''+record.get('name')+'/'+record.get('model')+'\'',
            		html:record.get('dwApproveComment')
            	}).show();           	
            } else if (event.getTarget('img.comment_DFI')) {
            	event.stopEvent();
            	Ext.widget('htmlviewer', {
            		title:'Comment \''+record.get('name')+'/'+record.get('model')+'\'',
            		html:record.get('dwApproveComment')
            	}).show();           	
            }
		});
	}
});
