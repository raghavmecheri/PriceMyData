const appendPriceEntry = () => {

}

const getPriceDataMeans = () => {

}


const fbMock = {
    likes:0.01,
    apps:0.5,
    peers: 0.3,
    facial: 1,
    addressbook: 1.3,
    interests: 0.09,
    location: 1 
}
const getFBMap = () => {
    return new Promise((resolve, reject) => {
        resolve(fbMock)
    })
}


module.exports = {
    getFBMap
}