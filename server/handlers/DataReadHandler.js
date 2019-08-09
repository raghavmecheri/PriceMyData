const getItemCount = (jsonData) => {
    return new Promise((resolve, reject) => {
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

module.exports = {
    getItemCount,
    hasEntry
}