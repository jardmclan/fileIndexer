const fs = require("fs").promises;
const HierarchyMetaDescriptor = require("./hierarchyMetaDescriptors");
const {join} = require("path");

let root = "./input/RF_Monthly_3_Yr_Sample";

readToLeafRecursive(root);

function readToLeafRecursive(root, descriptor) {

    return fs.readdir(root).then((content) => {
        subProcessors = [];
        //create descriptor for this

        for(let item of content) {
            let subPath = join(root, item);
            let subDescriptor = new HierarchyMetaDescriptor(subPath, descriptor);
            fs.lstat(subPath).then((stats) => {
                if(stats.isDirectory()) {
                    
                    subProcessors.push(readToLeafRecursive(subPath, subDescriptor));
                }
                //subpath is a file, close out descriptor with the path and add descriptor to return values
                else {
                    subDescriptor
                }
            }, (e) => {
                throw new Error(`Error reading file stat.\n${e}`);
            });
        }

        return Promise.all()

        //readToLeafRecursive(dir, )
    }, (e) => {
        throw new Error(`Error reading directory.\n${e}`);
    });

}