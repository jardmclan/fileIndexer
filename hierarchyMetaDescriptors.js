const BaseController = require("./baseController");

module.export = class HierarchyMetaDescriptor {

    
    constructor(controller) {
        const Controller = require(controller);
        this.controller = new Controller();
        //validate controller
        if(!(controller.prototype instanceof BaseController)) {
            throw new Error("Invalid controller, must implement BaseController");
        }
        //set config
        this.config = this.controller.getHierarchyConfig();
    }

    //path should be an array of file names
    getMetaDescriptorFromHierarchy(path, file) {

        let taggedValues = this.getTaggedValues(path);
        //add static values if exist in config
        if(this.config.static !== undefined) {
            Object.assign(taggedValues, this.config.static);
        }
        let hierarchyVals = {
            file: file,
            descriptor: taggedValues
        };

        return this.controller.postProcessor(hierarchyVals);
    }

    getTaggedValues(path) {
        return this.recursiveGetTaggedValues(this.config.hierarchy, path, {i: 0});
    }

    //index must be wrapped in an object so value is passed by reference and modified in recursion (sometimes I wish all languages had pointers)
    recursiveGetTaggedValues(tagHierarchy, path, wrappedIndex) {
        let taggedValues = {};
        //modify wrapped index so it persists between recursive calls for tracking path position
        //keep independant counter for tracking position in pathHierarchy
        for(let i = 0; wrappedIndex.i < path.length && i < tagHierarchy.length; wrappedIndex.i++, i++) {
            let value = path[wrappedIndex.i];
            let item = tagHierarchy[i];
            let tag = item;
            if(typeof item == "object") {
                //set current tag properly
                tag = item.tag;
                //get hierarchy branch based on value
                let branch = item.values[value];
                //if no branch for the given value try to get default if it exists
                if(branch == undefined) {
                    let defaultHierarchy = item.default;
                    //if no default then throw error
                    if(defaultHierarchy == undefined) {
                        throw new Error("Failed to parse hierarchy, unknown value for branch and no default specified");
                    }
                    //set the branch to default
                    branch = defaultHierarchy;
                }
                Object.assign(taggedValues, this.getTaggedValues(branch, path, wrappedIndex));
            }
            //set current tag to the corresponding path value
            taggedValues[tag] = value;
        }
        return taggedValues;
    }

    //how about we don't
    // * getTag(tags, value) {
    //     for(let tag of tags) {
    //         if(typeof tag == "object") {
    //             let newValue = yield tag.tag;
    //             let gen = this.getTag(tag.values[value], newValue);
    //             let genVal = gen.next();
    //             while(!value.done) {
    //                 let newValue = yield genVal.value;
    //                 genVal = gen.next(newValue);
    //             }
    //         }
    //         else {
    //             let newValue = yield tag;
    //         }
    //     }
    // }

}