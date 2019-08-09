import AWSHelper from "../AWSHelper"
import FileRemovalHandler from "./FileRemovalHandler"
import MongoHelper from "../MongoHelper"
import DataReadHandler from "./DataReadHandler"

const StreamZip = require('node-stream-zip');
const path = require('path');

export const valueFBData = async (req, res) => {
    let username = req.body.username;
    let myZip = req.file;
    AWSHelper.dumpFBData(myZip, username)
    let valueMap = await MongoHelper.getFBMap();
    let value = await processZipFile(myZip, valueMap)
    
    FileRemovalHandler.removeDirectory(myZip.path);

    res.json({
        "status":"true",
        "value":value
    })
}

const processZipFile = (zipData, fbValueMap) => {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipData.path,
            storeEntries: true
        });
        zip.on('ready', async () => {

            const postComment = JSON.parse(zip.entryDataSync("likes_and_reactions/posts_and_comments.json"))
            const pages = JSON.parse(zip.entryDataSync("likes_and_reactions/pages.json"))
            const appsWebsites = JSON.parse(zip.entryDataSync("apps_and_websites/apps_and_websites.json"))
            const peerGroup = JSON.parse(zip.entryDataSync("about_you/friend_peer_group.json"))
            const facialRecog = JSON.parse(zip.entryDataSync("about_you/face_recognition.json"))
            const addressBook = JSON.parse(zip.entryDataSync("about_you/your_address_books.json"))
            const interestList = JSON.parse(zip.entryDataSync("ads/ads_interests.json"))
            const advertiserCount = JSON.parse(zip.entryDataSync("ads/advertisers_who_uploaded_a_contact_list_with_your_information.json"))
            const advertiserInteracted = JSON.parse(zip.entryDataSync("ads/advertisers_you've_interacted_with.json"))
            const locationHistory = JSON.parse(zip.entryDataSync("location/location_history.json"))

            let likes = await DataReadHandler.getItemCount(postComment.reactions) + await DataReadHandler.getItemCount(pages.page_likes);
            let apps = await DataReadHandler.getItemCount(appsWebsites.installed_apps);
            let addressbook = await DataReadHandler.getItemCount(addressBook.address_book.address_book);
            let interests = await DataReadHandler.getItemCount(interestList.topics);
            let location = await DataReadHandler.getItemCount(locationHistory.location_history);

            let hasPeerGroup = await DataReadHandler.hasEntry(peerGroup.friend_peer_group);
            let hasFacial = await DataReadHandler.hasEntry(facialRecog.facial_data);
            let advertisers = await DataReadHandler.getItemCount(advertiserCount.custom_audiences) + await DataReadHandler.getItemCount(advertiserInteracted.history);

            const inputs = {
                likes,
                apps,
                addressbook,
                interests,
                location,
                peers: hasPeerGroup? 1:0,
                facial: hasFacial? 1:0
            }

            const dataValue = await computeDataValue(inputs, fbValueMap)
            // console.log(dataValue);
            // console.log(advertisers);
            resolve({dataValue, advertisers})
        })
    })
}

const computeDataValue = (inputs, valueMap) => {
    return new Promise((resolve, reject) => {
        let sum = 0;
        let ctr = Object.keys(inputs).length
        let count = 0;
        for (var key in inputs) {
            if (valueMap.hasOwnProperty(key) && inputs.hasOwnProperty(key)) {
                // console.log(key)
                if(key != "peers") {
                    sum += inputs[key] * valueMap[key]
                }
            }
            count += 1;
            if(count >= (ctr-1)) {
                if(inputs.hasOwnProperty("peers") && valueMap.hasOwnProperty("peers")) {
                    if(inputs["peers"]) {
                        sum *= valueMap["peers"]
                    }
                }
                resolve(sum);
            }
        }
    })
}