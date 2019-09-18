import AWSHelper from "../AWSHelper"
import FileRemovalHandler from "./FileRemovalHandler"
import MongoHelper from "../MongoHelper"
import DataReadHandler from "./DataReadHandler"


/*
    const fileStructure = {
    "Takeout/Location History/Location History.json": "locationHistory",
    "Takeout/Chrome/BrowserHistory.json":"browserHistory",
    "Takeout/Chrome/SearchEngines.json": "searchEngines",
    "Takeout/Chrome/Extensions.json":"extensions",
    "Takeout/YouTube/playlists/likes.json":"youtubeLikes",
    "Takeout/YouTube/subscriptions/subscriptions.json":"youtubeSubs",
    "Takeout/Maps/Added dishes, products, activities/Added dishes, products, activities.json":"dishesProdAct",
    "Takeout/Maps/My labeled places/Labeled places.json":"labledPlaces"
}
*/
const StreamZip = require('node-stream-zip');
const rimraf = require('rimraf');

export const valueGoogleData = async (req, res) => {
    try {
        // console.log("Evaluating Google Data...")
        let username = req.body.username;
        let myZip = req.file;
        // AWSHelper.dumpFBData(myZip, username)
        let valueMap = await MongoHelper.getGoogleMap();
        let value = await processZipFile(myZip, valueMap)
        
        FileRemovalHandler.removeDirectory(myZip.path);

        res.json({
            "status":"true",
            "value":value
        })
    } catch (e){
        res.json({
            "status":"false",
            "value":{}
        })
    }
}

const processZipFile = (zipData, fbValueMap) => {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipData.path,
            storeEntries: true
        });
        /*
        zip.on('ready', () => {
            console.log('Entries read: ' + zip.entriesCount);
            for (const entry of Object.values(zip.entries())) {
                const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
                console.log(`Entry ${entry.name}: ${desc}`);
            }
            // Do not forget to close the file once you're done
            zip.close()
        });
        */

        zip.on('ready', async () => {

            // Google location data
            const locationHistory = JSON.parse(zip.entryDataSync("Takeout/Location History/Location History.json"));

            // Chrome data
            const browserHistory = JSON.parse(zip.entryDataSync("Takeout/Chrome/BrowserHistory.json"));
            const searchEngines = JSON.parse(zip.entryDataSync("Takeout/Chrome/SearchEngines.json"));
            const extensions = JSON.parse(zip.entryDataSync("Takeout/Chrome/Extensions.json"));

            // YouTube Data
            const youtubeLikes = JSON.parse(zip.entryDataSync("Takeout/YouTube/playlists/likes.json"));
            const youtubeSubs = JSON.parse(zip.entryDataSync("Takeout/YouTube/subscriptions/subscriptions.json"));

            // Maps data
            const dishesProdAct = JSON.parse(zip.entryDataSync("Takeout/Maps/Added dishes, products, activities/Added dishes, products, activities.json"));
            const labledPlaces = JSON.parse(zip.entryDataSync("Takeout/Maps/My labeled places/Labeled places.json"));

            let location = await DataReadHandler.getItemCount(locationHistory.locations)
            let browser = await DataReadHandler.getItemCount(browserHistory["Browser History"]) + await DataReadHandler.getItemCount(extensions["Extensions"]) + await DataReadHandler.getItemCount(searchEngines["Search Engines"]);
            let youtube = await DataReadHandler.getItemCount(youtubeLikes) + await DataReadHandler.getItemCount(youtubeSubs);
            let maps = await DataReadHandler.getItemCount(dishesProdAct) + await DataReadHandler.getItemCount(labledPlaces["features"]);
            // Counting values pre-computation
            console.log("Processing activity counts...")
            const entryRegex = new RegExp(/^Takeout\/My Activity\//);
            const exitRegex = new RegExp(/json$/)
            let activities = await getActivityEntries(zip, entryRegex,exitRegex);            

            const totalEntries = {
                location,
                browser,
                youtube,
                maps,
                activities
            };

            const googleValueMap = await MongoHelper.getGoogleMap();

            const dataValue = await computeDataValue(totalEntries, googleValueMap)

            console.log(JSON.stringify(dataValue));

            rimraf('/server/uploads/*', function () {
                console.log("Cleared folder")
            });

            resolve({dataValue, totalEntries})
        })
    })
}

const getActivityEntries = (zip, entryRegex, exitRegex) => {
    let activityEntries = 0;
    return new Promise((resolve, reject) => {
        let entries = zip.entries();
        let entryNum = Object.keys(entries).length;
        let counter = 0;
        for (const entry of Object.values(entries)) {
            counter += 1;
            if(!entry.isDirectory && entryRegex.test(entry.name) && exitRegex.test(entry.name)) {
                let activityJSON = JSON.parse(zip.entryDataSync(entry.name));
                activityEntries += activityJSON.length;
                // console.log(activityEntries)
            }
            if(counter >= entryNum) {
                resolve(activityEntries);
            }
        }
    })
}

const computeDataValue = (inputs, valueMap) => {
    return new Promise((resolve, reject) => {
        let sum = 0;
        let ctr = Object.keys(inputs).length
        let count = 0;
        for (var key in inputs) {
            if (valueMap.hasOwnProperty(key) && inputs.hasOwnProperty(key)) {
                sum += inputs[key] * valueMap[key]
            }
            count += 1;
            if(count >= (ctr-1)) {
                resolve(sum);
            } 
        }
    })
}