const fs = require("fs");
const HierarchyMetaDescriptor = require("./hierarchyMetaDescriptors");
const {join} = require("path");

//hardcode for now, can take as args for automation
let rootMain = "./input/RF_Monthly_3_Yr_Sample";
let outFile = "./output/index.json";
const controller = require("geotiffController.js");
//-------------------------------------------------

const descriptorGen = new HierarchyMetaDescriptor(controller);

let writter = fs.createWriteStream(outFile);
//creating json doc, so add in beginning portion
writter.write(`{"index":`);

readToLeafRecursive(rootMain, []);

writter.write(`}`, () => {
    writter.end();
});

function readToLeafRecursive(root) {
    return fs.promises.readdir(root).then((content) => {
        for(let item of content) {
            let subPath = join(root, item);
            fs.promises.lstat(subPath).then((stats) => {
                if(stats.isDirectory()) {
                    readToLeafRecursive(subRoot, subPath);
                }
                //subpath is a file, get descriptor and write out to index file
                else {
                    let meta = descriptorGen.getMetaDescriptorFromHierarchy(subPath);
                    //order preserving, so should be fine
                    writter.write(JSON.stringify(meta));
                }
            }, (e) => {
                throw new Error(`Error reading file stat.\n${e}`);
            });
        }
    }, (e) => {
        throw new Error(`Error reading directory.\n${e}`);
    });

}


class DeferredPromise extends Promise {
    
    constructor(executor) {
        super((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            return executor(resolve, reject)
        });
    }

    resolve(result) {
        this._resolve(result);
    }

    reject(error) {
        this.reject(error);
    }
}


class MetadataStream extends Readable {
    _read(size) {
        
    }
}