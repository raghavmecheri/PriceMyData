const StreamZip = require('node-stream-zip');
const rimraf = require('rimraf');

const GOOGLE_ACTIVITES_REGEX = new RegExp(/My Activity\//);
const GOOGLE_FILE_REGEX = new RegExp(/json/)

const processZipFile = (zipData, valueMap, fileStructure, entryMap, isGoogle) => {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipData.path,
            storeEntries: true
        });
        zip.on('error', err => {
            // console.log("ERROR");
            console.log(err);
        });
        zip.on('ready', async () => {
            let fileData = {}
            let activitesCount = 0;
            for (const entry of Object.values(zip.entries())) {
                if(!entry.isDirectory) {
                    let fileName = entry.name;
                    if(isGoogle) {
                        if(GOOGLE_ACTIVITES_REGEX.test(fileName) && GOOGLE_FILE_REGEX.test(fileName)) {
                            try {
                                data = JSON.parse(zip.entryDataSync(fileName));
                                activitesCount += await getItemCount(data);
                            } catch (e) {
                                console.log("Failed to process activity data!")
                            }
                        }
                    }
                    let data;
                    try {
                        data = JSON.parse(zip.entryDataSync(fileName));
                    } catch (e) {
                        data = {};
                    }
                    if(fileStructure[fileName]) {
                        fileData[fileStructure[fileName]] = data;
                    }   
                }
            }
            fileData = await fillMissingFields(fileData, fileStructure);
            countAllEntires(fileData, entryMap).then(async (totalEntries) => {
                let dataValue = 0;
                if(isGoogle) {
                    totalEntries["activities"] = activitesCount;
                    dataValue = await computeGoogleValue(totalEntries, valueMap);
                } else {
                    dataValue = await computeFacebookValue(totalEntries, valueMap);
                }
                rimraf('/server/uploads/*', function () {
                    console.log("Cleared folder")
                });

                resolve({dataValue, totalEntries})
                // console.log(JSON.stringify(fileData));
            }).catch((err) => {

            })
            // console.log(dataValue);
            // console.log(advertisers);
        })
    })
}

const computeFacebookValue = (inputs, valueMap) => {
    return new Promise((resolve, reject) => {
        let sum = 0;
        let ctr = Object.keys(inputs).length
        let count = 0;
        for (var key in inputs) {
            if (valueMap.hasOwnProperty(key) && inputs.hasOwnProperty(key)) {
                // console.log(key)
                if(key != "addressbook") {
                    sum += inputs[key] * valueMap[key]
                }
            }
            count += 1;
            if(count >= (ctr-1)) {
                sum += inputs["addressbook"] * valueMap["facial"]
                /*
                if(inputs.hasOwnProperty("peers") && valueMap.hasOwnProperty("peers")) {
                    if(inputs["peers"]) {
                        sum *= valueMap["peers"]
                    }
                }*/
                resolve(sum);
            }
        }
    })
}

const computeGoogleValue = (inputs, valueMap) => {
    return new Promise((resolve, reject) => {
        console.log(valueMap);
        let sum = 0;
        let ctr = Object.keys(inputs).length
        let count = 0;
        for (var key in inputs) {
            if (valueMap.hasOwnProperty(key) && inputs.hasOwnProperty(key)) {
                sum += inputs[key] * valueMap[key]
            }
            count += 1;
            if(count >= (ctr)) {
                resolve(sum);
            } 
        }
    })
}


const getItemCount = (jsonData) => {
    return new Promise((resolve, reject) => {
        if(jsonData.length == null) {
            resolve(0);
        }
        resolve(jsonData.length);
    })
}

const hasEntry = (jsonData) => {
    return new Promise ((resolve, reject) => {
        if(jsonData) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}

const fillMissingFields = (fileData, fileStructure) => {
    return new Promise(async (resolve, reject) => {
        const entryList = Object.entries(fileStructure);
        let counts = 0;
        for (let [key, value] of entryList) {
            if(!fileData[value]) {
                console.log(`${value} undefined. Filling...`)
                fileData[value] = {};
            }
            counts += 1;
            if(counts >= (entryList.length-1)) {
                resolve(fileData)
            }   
        }
    })
}
const getNestedValue = (nestedValue, inputVector) => {
    return new Promise((resolve, reject) => {
        console.log(`Handing ${nestedValue}`);
        let nestedList = nestedValue.split(".");
        let childJson = inputVector;

        let maxLen = nestedList.length;
        let count = 0;
        nestedList.forEach( async (element) => {
            childJson = childJson[element];
            count +=1;
            if(count >= maxLen) {
                let result;
                try {
                    result = await getItemCount(childJson);
                } catch (e) {
                    result = 0;
                }
                resolve(result);
            }
        });
    })
}

const countAllEntires = (inputVector, entryMap) => {
    return new Promise(async (resolve, reject) => {
        var totalEntries = new Proxy({}, {
            get: (target, name) => name in target ? target[name] : 0
          })
        let enter = Object.keys(entryMap);
        for(let key of enter) {
            let value = entryMap[key];
            console.log(value);
            for(let subKey of value) {
                totalEntries[key] += await getNestedValue(subKey, inputVector);
            }     
        }
        console.log(totalEntries);
        resolve(totalEntries);
    })
}

module.exports = {
    processZipFile
}