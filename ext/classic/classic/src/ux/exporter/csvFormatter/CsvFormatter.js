/**
 * @class Ext.ux.Exporter.CSVFormatter
 * @extends Ext.ux.Exporter.Formatter
 * Specialised Format class for outputting .csv files
 */
Ext.define("Ext.ux.exporter.csvFormatter.CsvFormatter", {
    extend: "Ext.ux.exporter.Formatter",
    contentType: 'data:text/csv;base64,',
    separator: ",",
    extension: "csv",

    format: function(store, config) {
    	this.grid = config.grid;
        this.columns = config.columns || (store.fields ? store.fields.items : store.model.prototype.fields.items);
//        return this.getHeaders() + "\n" + this.getRows(store)+"\n" + this.getSummary(config.grid);
        return this.getHeaders() + "\n" + this.getRows(store);
    },
    getHeaders: function(store) {
        var columns = [], title;
        Ext.each(this.columns, function(col) {
        	if (col.xtype == "rownumberer" || col.xtype == "actioncolumn") {
        		return;
        	}        	
        	
			var title;
			if (col.text != undefined) {
			  title = col.text;
			} else if(col.name) {
			  title = col.name.replace(/_/g, " ");
			  title = Ext.String.capitalize(title);
			}
	        columns.push(title);
        }, this);

        return columns.join(this.separator);
    },
    getSummary : function(grid) {
    	var me = this;
    	var rows = [];
        Ext.each(this.columns, function(col, index) {
        	var value = me.renderSummary(col, index);
        	var dom = new DOMParser().parseFromString(value,'text/html');
        	var i=0;
        	Ext.each(dom.getElementsByTagName('span'), function(el) {
        		if (rows[i] ==undefined)
        			rows[i] = el.innerHTML;
        		else
        			rows[i] += (me.separator+el.innerHTML);
        		i++
        	});
          }, this);
        return rows.join('\n');
    },
    renderSummary: function(column, colIndex){
		var value;
		value = this.getSummaryValue(this.grid.store, column.summaryType, column.dataIndex, false);

		if (column.summaryRenderer)
		{
			var summaryRcd = this.getSummaryRecord42();
			var summaryObject = this.getSummaryObject42(value, column, colIndex, summaryRcd);
			value = column.summaryRenderer.call(this.grid, 
					                           value, 
					                           summaryObject, 
					                           summaryRcd,
					                           -1,
					                           colIndex,
					                           this.grid.store,
					                           this.grid.view); 
			return value;
		}
		else
		{
			var meta = this.getSummaryObject42(column, colIndex);
			if (value === undefined || value == 0)
				return this.getHtml("&nbsp;", meta);
			else
				return value;
		}

	},
   getSummaryRecord42: function()
   {
   		var rcd = Ext.create(this.grid.store.model);
   		for (var i = 0; i < this.columns.length; i++)
   		{
   			var	valueObject = this.getSummaryValue(this.grid.store, this.columns[i].summaryType, this.columns[i].dataIndex, false);
   			if (valueObject === undefined)
   				continue; // Do nothing
   			else
   				rcd.set(this.columns[i].dataIndex, valueObject);
   		}
   		return rcd;
   },
   getSummaryObject42: function(value, column, colIndex, rcd)
   {
   		return { align : column.align,
   			     cellIndex: colIndex,
   			     'column': column,
   			     classes: [],
   			     innerCls: '',
   			     record : rcd,
   			     recordIndex: -1,
   			     style : '',
   			     tdAttr : '',
   			     tdCls : '',
   			     unselectableAttr : 'unselectable="on"',
   			     'value' : value
   			   };
   },
   getSummaryValue: function(store, type, field, group) {
       if (type) 
       {
           if (Ext.isFunction(type)) 
           {
               return store.aggregate(type, null, group, [field]);
           }

           switch (type) 
           {
               case 'count':
                   return store.count(group);
               case 'min':
                   return store.min(field, group);
               case 'max':
                   return store.max(field, group);
               case 'sum':
                   return store.sum(field, group);
               case 'average':
                   return store.average(field, group);
               default:
                   return group ? {} : '';              
           }
       }
   	},  
    getRows: function(store) {
        var rows = [];
        store.each(function(record, index) {
          rows.push(this.getCell(record, index));
        }, this);

        return rows.join("\n");
    },
    getCell: function(record, index) {
        var cells = [];
        Ext.each(this.columns, function(col) {
        	if (col.xtype == "rownumberer" || col.xtype == "actioncolumn") {
        		return;
        	}
        	
            var name = col.name || col.dataIndex;
            if(name) {
                if (Ext.isFunction(col.renderer)) {
                  var value = col.renderer(record.get(name), null, record);
                } else {
                  var value = record.get(name);
                }
                cells.push(value);
            }
        });

        return cells.join(this.separator);
    }
});