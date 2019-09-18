import AWSHelper from "../AWSHelper"
import FileRemovalHandler from "./FileRemovalHandler"
import MongoHelper from "../MongoHelper"
import DataReadHandler from "./DataReadHandler"


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

const entryMap = {
    location: ["locationHistory.locations"],
    browser: ["Browser###History", "extensions.Extensions", "searchEngines.Search###Engines"],
    youtube: ["youtubeLikes", "youtubeSubs"],
    maps: ["dishesProdAct","labledPlacesfeatures"]
}

const actvitesPath = "My Activity/"
const activityExt = "MyActivity.json"


export const valueGoogleData = async (req, res) => {
    let username = req.body.username;
    let myZip = req.file;
    // AWSHelper.dumpFBData(myZip, username)
    let valueMap = await MongoHelper.getGoogleMap();
    let value = await DataReadHandler.processZipFile(myZip, valueMap, fileStructure, entryMap, true);
    
    if(value) {
        res.json({
            "status":"true",
            "value":value
        })
    }

    res.json({
        "status":"false",
        "value":{}
    })
}