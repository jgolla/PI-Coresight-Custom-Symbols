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

1. Launch [PI Coreisght](https://www.osisoft.com) and see that there is now a new icon on the symbol selector menu, right above the search pane. **TODO add screen shot** At this point the symbol will not do anything.
2. Next, let's begin filling in some details about the type of data will be using.

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