module.export = class BaseController {
    constructor() {
        if(this.constructor === BaseController) {
            throw new Error("Cannot instantiate base controller directly");
        }
    }

    getHierarchyConfig() {
        throw new Error("getHierarchyConfig must be implemented in subclass");
    }

    //transforms parsed file hierarchy into 
    postProcessor(hierarchyVals) {
        //if not implemented just return the same object
        return hierarchyVals;
    }
}