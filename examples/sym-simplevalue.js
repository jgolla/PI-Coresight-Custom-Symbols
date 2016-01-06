(function (CS) {
	var defintion = {
	    typeName: 'simplevalue',
	    datasourceBehavior: CS.DatasourceBehaviors.Single,
		getDefaultConfig: function() {
		    return {
		        DataShape: 'Value',
		        Height: 150,
		        Width: 150,
		        BackgroundColor: 'rgb(255,0,0)',
		        TextColor: 'rgb(0,255,0)',
		        ShowLabel: true,
		        ShowTime: false
		    };
		},
		StateVariables: [ 'Fill', 'Blink' ],
	    configOptions: function (symbol) {
	    	var options = [{
	            title: 'Format Symbol',
	            mode: 'format' 
	        }];

	        var multistateOption = {};
	        if (symbol.MSDataSources && symbol.MSDataSources.length > 0) {
	        	multistateOption.title = 'Configure Multistate';
	            multistateOption.mode = 'multistate';
	        } else {
	        	multistateOption.title = 'Initialize Multistate';
	            multistateOption.mode = 'initialize-multistate';
	            multistateOption.datasource = symbol.DataSources[0];
	        }

	        options.push(multistateOption);
	        return options;
	    },
	    init: init
	};

	function init(scope) {
	    function onUpdate(data) {
	        if(data) {
	            scope.value = data.Value;
	            scope.time = data.Time;
	            if(data.Label) {
	                scope.label = data.Label;
	            }
	        }
	    }
	    return { dataUpdate: onUpdate };
	}	

    CS.symbolCatalog.register(defintion);
})(window.Coresight);