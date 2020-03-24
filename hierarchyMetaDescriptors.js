module.export = class HierarchyMetaDescriptor {

    

    
    constructor(configFile) {
        const hierarchyConfig = require(configFile);

        this.position = 0;

        this.metaDescriptor = {
            fpath: null
        }

        this.metaDescriptor = {
            filepath: null,
            timeGranularity: null,
            date: null,
            spatialExtent: null,
            unit: null,
            dataSet: null
        };
    }

    next(name) {
        
        this.position++;
    }


}

//filepath, timeGranularity, date, spatial extent, unit, dataSet
