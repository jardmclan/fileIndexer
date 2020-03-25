const BaseController = require("../baseController");
const hierarchyConfig = require("./hierarchy_config.json");

module.export = class GeotiffController extends BaseController {
    constructor() {
        super();
    }

    getHierarchyConfig() {
        return hierarchyConfig;
    }

    postProcessor(hierarchyVals) {
        descriptor = {
            timeGranularity: null,
            date: null,
            spatialExtent: null,
            unit: null,
            dataSet: null
        };

        let month = hierarchyVals.descriptor.month == undefined ? "00" : this.toMonth(hierarchyVals.descriptor.month);
        let year = hierarchyVals.descriptor.year == undefined ? "00" : this.toYear(hierarchyVals.descriptor.year);

        let date = `${year}-${month}-00T00:00:00Z`;

        descriptor.date = date;

        descriptor.timeGranularity = hierarchyVals.descriptor.timeGranularity;
        descriptor.spatialExtent = hierarchyVals.descriptor.spatialExtent;
        descriptor.unit = hierarchyVals.descriptor.unit;
        descriptor.dataSet = hierarchyVals.descriptor.dataSet;

        return {
            file: hierarchyVals.file,
            descriptor: descriptor
        }
    }

    toMonth(monthValue) {
        //currently just a two number combo, keep this method in case need to process
        return monthValue;
    }

    toYear(yearValue) {
        return yearValue
    }
}