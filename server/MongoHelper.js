const MongoPool = require('mongopooler');

const appendPriceEntry = (entry) => {
    MongoPool.getInstance((client) => {
        let db = client.db("pricemydata")
        let collectionName = "price_entries"
        db.collection(collectionName).insertOne(entry, (err, res) => {
            if (err) throw err;
        })
    })
}

const averageFBMongo = () => {
    return new Promise((resolve, reject) => {
        MongoPool.getInstance((client) => {
            let db = client.db("pricemydata")
            let collectionName = "price_entries"
            db.collection(collectionName).aggregate([
                {
                    $match: {
                        type: "FB"
                    }
                },
                { $group: { _id: "$_id", 
                f_likes: { $avg: "$f_likes" },
                f_apps: { $avg: "$f_apps" },
                f_ad: { $avg: "$f_ad" },
                f_loc: { $avg: "$f_loc" },
                f_keyinfo: { $avg: "$f_keyinfo" },
             } },
			], async (err, res) => {
				let resultArr = await res.toArray()
				let resultList = resultArr.map((value) => {return value});
				if(!resultList[0]) {
					resolve({"_id":"00", trips: 0, average_speed: 0, average_distance: 0, average_score: 0})
				}
				resolve(resultList[0])
			})
        }) 
    })
}

const averageGoogleMongo = () => {
    return new Promise((resolve, reject) => {
        MongoPool.getInstance((client) => {
            let db = client.db("pricemydata")
            let collectionName = "price_entries"
            db.collection(collectionName).aggregate([
                {
                    $match: {
                        type: "GOOGL"
                    }
                },
                { $group: { _id: "$_id", 
                g_bdata: { $avg: "$g_bdata" }, 
                g_youtube: { $avg: "$g_youtube" }, 
                g_map: { $avg: "$g_map" },
                g_loc: { $avg: "$g_loc" },
                g_services: { $avg: "$g_services" },
             } },
			], async (err, res) => {
				let resultArr = await res.toArray()
				let resultList = resultArr.map((value) => {return value});
				if(!resultList[0]) {
					resolve({"_id":"00", trips: 0, average_speed: 0, average_distance: 0, average_score: 0})
				}
				resolve(resultList[0])
			})
        }) 
    })
}

const getGoogleMap = () => {
    return new Promise( async (resolve, reject) => {
        let means = await averageGoogleMongo();
        let newMock = {
            location: means["g_loc"],
            browser: means["g_bdata"],
            youtube: means["g_youtube"],
            maps: means["g_map"],
            activities: means["g_services"]
        };
        resolve(newMock)
    })
}

const getFBMap = () => {
    return new Promise( async (resolve, reject) => {
        let means = await averageFBMongo();
        let newMock = {
            likes: means["f_likes"],
            apps: means["f_apps"],
            interests: means["f_ad"],
            location: means["f_loc"],
            facial: means["f_keyinfo"]
        };
        resolve(newMock)
    })
}

const getUserCount = () => {
    return new Promise((resolve, reject) => {
        MongoPool.getInstance((client) => {
            let db = client.db("pricemydata")
            let collectionName = "price_entries"
            db.collection(collectionName).count({}, function(error, numOfDocs){
                if(error) return callback(error);
                resolve(numOfDocs);
            });
        })
    })
}

module.exports = {
    appendPriceEntry,
    getFBMap,
    getGoogleMap,
    getUserCount
}



/*
const fbMock = {
    likes:0.01,
    apps:0.5,
    // peers: 0.3,
    interests: 0.09,
    location: 1,
    facial: 1,
    // addressbook: 1.3, 
}

const googleMock = {
    location: 0.03,
    browser: 0.22,
    youtube: 0.12,
    maps: 0.11,
    activities: 0.2
}

const computeDataAverage = (result, callback) => {
    let new_map_sums = {}
    let count = 0
    result.forEach((element) => {
        count += 1
        if(count == 1) {
            new_map_sums["likes"] = element["likes"]
            new_map_sums["apps"] = element["apps"]
            new_map_sums["interests"] = element["interests"]
            new_map_sums["location"] = element["location"]
            new_map_sums["facial"] = element["facial"]
        } else {
            new_map_sums["likes"] += element["likes"]
            new_map_sums["apps"] += element["apps"]
            new_map_sums["interests"] += element["interests"]
            new_map_sums["location"] += element["location"]
            new_map_sums["facial"] += element["facial"]
        }
        if(count >= result.length) {
            new_map_sums["likes"] = new_map_sums["likes"]/count;
            new_map_sums["apps"] = new_map_sums["apps"]/count;
            new_map_sums["interests"] = new_map_sums["interests"]/count;
            new_map_sums["location"] = new_map_sums["location"]/count;
            new_map_sums["facial"] = new_map_sums["facial"]/count;
            callback(new_map_sums);
        }
    })
}
const getFBMap = () => {
    return new Promise((resolve, reject) => {
        MongoPool.getInstance((client) => {
			let db = client.db("pricemydata")
			let collectionName = "fbprices"
			db.collection(collectionName).find({}).toArray((err, result) => {
                computeDataAverage(result, (avg) => {
                    resolve(avg)
                })
			})
		})
        // resolve(fbMock)
    })
}
const getGoogleMap = () => {
    return googleMock;
}
*/