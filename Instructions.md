# New Symbol Creation

1. Create a new file called liquidgauge.js in your PI Coresight installation folder, `INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext`. If the `ext` folder does not exist, create it.  

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
            typeName: 'liquidgauge',
            datasourceBehavior: CS.DatasourceBehaviors.Single
        };
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Launch [PI Coreisght][1] and see that there is now a new icon on the symbol selector menu, right above the search pane. (**TODO add screen shot**) At this point the symbol will not do anything.
1. Before going any further with implementation, let's get the initial presentation layer done. Let's create an HTML file in the same directory as our Javascript file and name it `sym-liquidgauge-template.html`. Add the following to the HTML file.

    ```html
    <div id="gaugeContainer">
        <span>Symbol</span>
    </div>
    ```

1. Next, let's begin filling in some details about the type of data will be using.

    ```javascript
    (function (CS) {
        var defintion = {
            typeName: 'liquidgauge',
            datasourceBehavior: CS.DatasourceBehaviors.Single,
            getDefaultConfig: function() {
    		    return {
    		        DataShape: 'Gauge'
                };
    	    }
        };
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Again, launch [PI Coreisght][1] and this time perform a search for sinusoid (**TODO need data item**)
1. Select the liquidgauge from the symbol selector menu and drag the data item to the display. You will notice after dropping the symbol it is not really possible to select it. This is due to the symbol not having a default size.
1. To fix the sizing issue, update the `getDefaultConfig` function's return value to return both `Height` and `Width`. We also need to add an initialization function to the definition object.

    ```javascript
    (function (CS) {
        var defintion = {
            typeName: 'liquidgauge',
            datasourceBehavior: CS.DatasourceBehaviors.Single,
            getDefaultConfig: function() {
    		    return {
    		        DataShape: 'Gauge',
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

1. Retry again in [PI Coreisght][1] by adding the new symbol. The symbol can now be selected, moved, and is completely integrated into undo stack.
1. Now that the infrastructure is in place, it is time to have the symbol do something. For this we will have to expand out the `init` function. We will add a parameter to the function, `scope` and a function inside the function to handle when the symbol receives new data. Last we will add a return to the function, to let the PI Coresight infrastructure know how to communicate with the symbol.

    ```javascript
    function init(scope) {
        function onUpdate(data) {
        }
        return { dateUpdate: onUpdate };
    }
    ```

1. The code above tells the PI Coresight infrastructure to call the `onUpdate` function every time a data update occurs. We now need to do something with the data provided to our `onUpdate` function.
1. Using the code below, we add two variables to our scope, `value` and `indicator`. Adding these variables to the scope will make them available in the presentation HTML.

    ```javascript
    function init(scope) {
        function onUpdate(data) {
            if(data) {
                scope.value = data.Value;
                scope.indicator = data.Indicator;
            }
        }
        return { dataUpdate: onUpdate };
    }
    ```

1. Now to update the presentation HTML file to show these values.

    ```html
    <div id="gaugeContainer">
        <span>Symbol</span>
        <span>Value: {{value}}</span>
        <span>Indicator: {{indicator}}</span>
    </div>
    ```

1. Retry again in [PI Coreisght][1] by adding the new symbol. 

(**TODO update URL below**) 

[1]:http://localhost:55950/#/Displays/New/