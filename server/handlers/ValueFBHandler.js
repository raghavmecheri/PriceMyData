import AWSHelper from "../AWSHelper"
import FileRemovalHandler from "./FileRemovalHandler"

const StreamZip = require('node-stream-zip');
const path = require('path');

export const valueFBData = async (req, res) => {
    let username = req.body.username;
    let myZip = req.file;
    AWSHelper.dumpFBData(myZip, username)
    let value = await processZipFile(myZip)
    
    FileRemovalHandler.removeDirectory(myZip.path);

    res.json({
        "status":"true",
        "value":value
    })
}

const processZipFile = (zipData) => {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipData.path,
            storeEntries: true
        });
        zip.on('ready', () => {
            console.log('Entries read: ' + zip.entriesCount);
            for (const entry of Object.values(zip.entries())) {
                const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
                console.log(`Entry ${entry.name}: ${desc}`);
            }
        })
        resolve(100)
    })
}