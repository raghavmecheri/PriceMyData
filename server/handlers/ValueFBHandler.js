import AWSHelper from "../AWSHelper"
import FileRemovalHandler from "./FileRemovalHandler"
import MongoHelper from "../MongoHelper"
import DataReadHandler from "./DataReadHandler"

const fileStructure = {
    "likes_and_reactions/posts_and_comments.json": "postComment",
    "likes_and_reactions/pages.json": "pages",
    "apps_and_websites/apps_and_websites.json":"appsWebsites",
    "about_you/friend_peer_group.json":"peerGroup",
    "about_you/face_recognition.json": "facialRecog",
    "about_you/your_address_books.json": "addressBook",
    "ads/ads_interests.json": "interestList",
    "ads/advertisers_who_uploaded_a_contact_list_with_your_information.json": "advertiserCount",
    "ads/advertisers_you've_interacted_with.json": "advertiserInteracted",
    "location/location_history.json": "locationHistory"
}

const entryMap = {
    likes: ["postComment.reactions","pages.page_likes"],
    apps: ["appsWebsites.installed_apps"],
    addressBook: ["addressBook.address_book.address_book"],
    interests: ["interestList.topics"],
    location: ["locationHistory.location_history"],
    hasPeerGroup: ["peerGroup.friend_peer_group"],
    hasFacial: ["facialRecog.facial_data"],
    advertisers: ["advertiserCount.custom_audiences", "advertiserInteracted.history"]
}


export const valueFBData = async (req, res) => {
    let username = req.body.username;
    let myZip = req.file;
    // AWSHelper.dumpFBData(myZip, username)
    let valueMap = await MongoHelper.getFBMap();
    let value = await DataReadHandler.processZipFile(myZip, valueMap, fileStructure, entryMap);
    
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