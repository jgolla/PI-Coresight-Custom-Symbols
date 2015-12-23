# New Symbol Creation
## Simple Value Symbol

1. Create a new file called sym-simplevalue.js in your PI Coresight installation folder, `INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext`. If the `ext` folder does not exist, create it.  

1. Add the following code to the file, this will initialize the structure used for creating custom symbols.

    ```javascript
    (function (CS) {
    })(window.Coresight);
    ```
    
1. Begin by creating the symbol definition object that will be used to register the symbol with PI Coresight.

    ```javascript
    (function (CS) {
        var defintion = {};
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Let's start by building out the required parts of the new symbol.

    ```javascript
    (function (CS) {
        var defintion = {
            typeName: 'simplevalue',
            datasourceBehavior: CS.DatasourceBehaviors.Single
        };
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Launch [PI Coresight][1] and see that there is now a new icon on the symbol selector menu, right above the search pane. (**TODO add screen shot**) At this point the symbol will not do anything.
1. Before going any further with implementation, let's get the initial presentation layer done. Let's create an HTML file in the same directory as our Javascript file and name it `sym-simplevalue-template.html`. Add the following to the HTML file.

    ```html
    <div>
        <div>Simple Value</div>
    </div>
    ```

1. Next, let's begin filling in some details about the type of data will be using.

    ```javascript
    (function (CS) {
        var defintion = {
            typeName: 'simplevalue',
            datasourceBehavior: CS.DatasourceBehaviors.Single,
            getDefaultConfig: function() {
    		    return {
    		        DataShape: 'Value'
                };
    	    }
        };
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Again, launch [PI Coresight][1] and this time perform a search for sinusoid (**TODO need data item**)
1. Select the simplevalue from the symbol selector menu and drag the data item to the display. You will notice after dropping the symbol it is not really possible to select it. This is due to the symbol not having a default size.
1. To fix the sizing issue, update the `getDefaultConfig` function's return value to return both `Height` and `Width`. We also need to add an initialization function to the definition object.

    ```javascript
    (function (CS) {
        var defintion = {
            typeName: 'simplevalue',
            datasourceBehavior: CS.DatasourceBehaviors.Single,
            getDefaultConfig: function() {
    		    return {
    		        DataShape: 'Value',
    		        Height: 150,
                    Width: 150
                };
    	    },
    	    init: init
        };
        
        function init() {
        }
        
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Retry again in [PI Coresight][1] by adding the new symbol. The symbol can now be selected, moved, and is completely integrated into undo stack.
1. Now that the infrastructure is in place, it is time to have the symbol do something. For this we will have to expand out the `init` function. We will add a parameter to the function, `scope` and a function inside the function to handle when the symbol receives new data. Last we will add a return to the function, to let the PI Coresight infrastructure know how to communicate with the symbol.

    ```javascript
    function init(scope) {
        function onUpdate(data) {
        }
        return { dateUpdate: onUpdate };
    }
    ```

1. The code above tells the PI Coresight infrastructure to call the `onUpdate` function every time a data update occurs. We now need to do something with the data provided to our `onUpdate` function.
1. Using the code below, we add some variables to our scope, `value`, `time`, and `label`. Adding these variables to the scope will make them available in the presentation HTML.

    ```javascript
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
    ```

1. Now to update the presentation HTML file to show these values.

    ```html
    <div>
        <div>Label: {{label}}</div>
        <div>Value: {{value}}</div>
        <div>Time: {{time}}</div>
    </div>
    ```

1. Retry again in [PI Coresight][1] by adding the new symbol. 
1. Now that the symbol is starting to come together, it is time to make it look a little nicer by adding some stylinging to the container div and removing the labels added above.

    ```html
    <div style="background: orange; color: black">
        <div>{{label}}</div>
        <div>{{value}}</div>
        <div>{{time}}</div>
    </div>
    ```

1. While this is very nice, it would be much better if the user of the symbol could configure the colors shown here. To do this, we need to add symbol configuration options to the symbol definition. First we will add the context menu options to the symbol.

    ```javascript
    var defintion = {
        typeName: 'simplevalue',
        datasourceBehavior: CS.DatasourceBehaviors.Single,
        getDefaultConfig: function() {
    	    return {
    	        DataShape: 'Value',
    	        Height: 150,
                Width: 150
            };
        },
        configOptions: function (symbol) {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        },
        init: init
    };
    ```

1. Next we need to add the default values for the options we wish to configure. This is done in `getDefaultConfig`.

    ```javascript
    var defintion = {
        typeName: 'simplevalue',
        datasourceBehavior: CS.DatasourceBehaviors.Single,
        getDefaultConfig: function() {
    	    return {
    	        DataShape: 'Value',
    	        Height: 150,
                Width: 150,
                BackgroundColor: 'rgb(255,0,0)',
                TextColor: 'rgb(0,255,0)'
            };
        },
        configOptions: function (symbol) {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        },
        init: init
    };
    ```

1. Now that we have it defined in the implementation, we need to create the configuration HTML file. Create a file named `sym-simplevalue-config.html` in the same directory as the implementation and presentation files.

    ```html
    <div class="c-side-pane t-toolbar">
        <span style="color:#fff; margin-left:15px">Text Color</span>
    </div>
    <format-color-picker id="textColor" property="TextColor" config="config"></format-color-picker>
    <div class="c-side-pane t-toolbar">
        <span style="color:#fff; margin-left:15px">Background Color</span>
    </div>
    <format-color-picker id="backgroundColor" property="BackgroundColor" config="config"></format-color-picker>
    ```

1. Now by launching [PI Coresight][1], you will see you can right click on the symbol to configure it. When the configuration pane opens, the two color pickers defined in the config HTML are listed, but they have no effect.
1. To hook up the color pickers to the presentation, we must modify the presentation layer to use those variables.

    ```html
    <div id="gaugeContainer" ng-style="{background: config.BackgroundColor, color: config.TextColor}">
        <div>{{label}}</div>
        <div>{{value}}</div>
        <div>{{time}}</div>
    </div>
    ```

1. The last thing we want to do with our shape is to turn on or off individual parts, such as the label and time. To do this, we will first update the `getDefaultConfig` function to contain the booleans for showing and hiding.

    ```javascript
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
    ```

1. Next we will update the presentation to honor these settings.

     ```html
    <div ng-style="{background: config.BackgroundColor, color: config.TextColor}">
        <div ng-show="config.ShowLabel">{{label}}</div>
        <div>{{value}}</div>
        <div ng-show="config.ShowTime">{{time}}</div>
    </div>
    ```

1. Finally, we will update the configuration to support these options.

    ```html
    <div class="c-side-pane t-toolbar">
        <span style="color:#fff; margin-left:15px">Text Color</span>
    </div>
    <format-color-picker id="textColor" property="TextColor" config="config"></format-color-picker>
    <div class="c-side-pane t-toolbar">
        <span style="color:#fff; margin-left:15px">Background Color</span>
    </div>
    <format-color-picker id="backgroundColor" property="BackgroundColor" config="config"></format-color-picker>
    
    <div class="c-side-pane t-toolbar">
        <span style="color:#fff; margin-left:15px">Show Options</span>
    </div>
    <div class="c-config-content">Show Label:
        <input type="checkbox" ng-model="config.ShowLabel">
    </div>
    <div class="c-config-content">Show Time:
        <input type="checkbox" ng-model="config.ShowTime">
    </div>
    ```


(**TODO update URL below**) 

[1]:http://localhost:55950/#/Displays/New/