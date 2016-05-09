Ext.define('Ext.ux.editor.CKEditor',{
	extend:'Ext.form.field.TextArea',
	xtype:'ckeditor',
	value:'',
	editor:null,
	CKConfig:{  
        toolbar: 'Full',  
        uiColor: '#ffffff',
        filebrowserUploadUrl: _GLOBAL.CK_UPLOAD,// 'server/ckupload.php',  
        filebrowserImageUploadUrl: _GLOBAL.CK_UPLOAD,// 'server/ckupload.php',  
        filebrowserFlashUploadUrl: _GLOBAL.CK_UPLOAD,// 'server/ckupload.php',  
        baseFloatZIndex:999999
    },  
	initComponent:function(){
		var me = this;
		me.callParent(arguments);
		me.on('afterrender',function() {
				Ext.apply(this.CKConfig ,{
					height:this.getHeight()
				});
				this.editor = CKEDITOR.replace(this.inputEl.id,this.CKConfig);
				this.editor.setData(this.value);
				this.editorId =this.editor.id;
			},
			me);
		
			me.on('resize', function(cmp, width, height, oldWidth, oldHeight, eOpt) {
				if (me.editor) {
					me.editor.resize(width-2, height-30);
				}
			});
	},

	onRender:function(ct, position){
		if(!this.el){
			this.defaultAutoCreate = {
				tag:'textarea',
				autocomplete:'off'
			};
		}
		this.callParent(arguments)
	},
	setValue:function(value){
		this.callParent(arguments);
		this.value = value;
		if(this.editor){
			this.editor.setData(value);
		}
	},
	getRawValue:function(){
		if(this.editor){
			return this.editor.getData()
		}else{
			return this.value;
		}
	}
});
