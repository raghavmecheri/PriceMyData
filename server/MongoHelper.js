const MongoPool = require('mongopooler');

const appendPriceEntry = () => {

}

const getPriceDataMeans = () => {

}


const fbMock = {
    likes:0.01,
    apps:0.5,
    // peers: 0.3,
    interests: 0.09,
    location: 1,
    facial: 1,
    // addressbook: 1.3, 
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

const appendFBEntry = (fbData) => {
    MongoPool.getInstance((client) => {
        let db = client.db("pricemydata")
        let collectionName = "fbprices"
        db.collection(collectionName).insertOne(fbData, (err, res) => {
            if (err) throw err;
        })
    })
}


module.exports = {
    getFBMap,
    appendFBEntry
}