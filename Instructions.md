# New Symbol Creation

1. Create a new file called liquidgauge.js in your PI Coresight installation folder, INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext. If the ext folder does not exist, create it.  
1. Add the following code to the file, this will initialize the structure used for creating custom symbols.

    ```javascript
    (function (CS) {
        'use strict';
    })(window.Coresight);
    ```
    
1. Begin by creating the symbol definition object that will be used to register the symbol with PI Coresight.

    ```javascript
    (function (CS) {
        'use strict';
        var defintion = {};
        // registers the definition with PI Coresight
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```

1. Let's start by building out the required parts of the new symbol.

    ```javascript
    (function (CS) {
        'use strict';
        var defintion = {
            typeName: 'liquidgauge'
        };
        CS.symbolCatalog.register(defintion);
    })(window.Coresight);
    ```