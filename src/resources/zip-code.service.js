const dataSet = require('./data.json');

const searchService = {
    /**
     * To Search dataset based on address zip code.
     * 
     * @param {string} searchText keywords user wanted to search
     * @param {any=} filters various filters if we wanted to narrow our search result
     */
    searchByPinCode: async function (searchText, filters) {
        const resultSet = dataSet.filter(addr => {
            return addr.zip.includes(searchText);
        })
        console.log(`Result count: `, resultSet.length);
        if (resultSet.length) {
            return resultSet;
        }
        return `No data found`;
    },

    /**
     * To Search dataset based on address city.
     * 
     * @param {string} searchText keywords user wanted to search
     * @param {any=} filters various filters if we wanted to narrow our search result
     */
    searchByCity: async function (searchText, filters) {
        const resultSet = dataSet.filter(addr => {
            return (addr.primary_city && addr.primary_city.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
                || (addr.acceptable_cities && addr.acceptable_cities.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
                || (addr.unacceptable_cities && addr.unacceptable_cities.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
        })
        console.log(`Result count: `, resultSet.length);
        if (resultSet.length) {
            return filterResultSet(resultSet, filters);
        }
        return `No data found`;
    },

    /**
     * To Search dataset based on address city.
     * 
     * @param {string} searchText keywords user wanted to search
     * @param {any=} filters various filters if we wanted to narrow our search result
     */
    searchByCity: async function (searchText, filters) {
        const resultSet = dataSet.filter(addr => {
            return (addr.primary_city && addr.primary_city.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
                || (addr.acceptable_cities && addr.acceptable_cities.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
                || (addr.unacceptable_cities && addr.unacceptable_cities.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
        })
        console.log(`Result count: `, resultSet.length);
        if (resultSet.length) {
            return filterResultSet(resultSet, filters);
        }
        return `No data found`;
    },

    /**
     * To Search dataset based on lat long.
     * 
     * @param {{latitude: string; longitude: string}} position keywords user wanted to search
     * @param {any=} filters various filters if we wanted to narrow our search result
     */
    findNearestAddress: async function (position, filters) {
        /** @type {{latitude: string; longitude: string, distanceFromGivenPosition: number}[]} data */
        const data = filterResultSet(dataSet, filters);
        data.forEach(addr => {
            addr.distanceFromGivenPosition = calculateDistance(parseFloat(addr.latitude), parseFloat(addr.latitude), position.latitude, position.longitude, 'K')
        });
        const nearest = data.sort((a, b) => a.distanceFromGivenPosition - b.distanceFromGivenPosition);
        console.log(`Nearest address: `, nearest[0].distanceFromGivenPosition);

        if (nearest.length) {
            return nearest[0];
        }
        return `No data found`;
    }
}

/**
 * To filter out records 
 * 
 * @param {any[]} records records to be filtered
 * @param {any} filters various filter options
 * 
 *   Y E T   T O   I M P L E M E N T
 */
function filterResultSet(records, filters) {
    return records;
}

/**
 * To find distance between two points
 * 
 * Ref: https://stackoverflow.com/questions/26836146/how-to-sort-array-items-by-longitude-latitude-distance-in-javascripts
 * 
 * @param {number} lat1 first position latitude
 * @param {number} lon1 first position longitude
 * @param {number} lat2 second position latitude
 * @param {number} lon2 second position longitude
 * @param {string} unit measurement unit `K` for kilometers 'N' for nautical miles
 */
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    const radiusLat1 = Math.PI * lat1 / 180
    const radiusLat2 = Math.PI * lat2 / 180
    // var radlon1 = Math.PI * lon1 / 180
    // var radlon2 = Math.PI * lon2 / 180
    const theta = lon1 - lon2
    const radtheta = Math.PI * theta / 180
    let dist = Math.sin(radiusLat1) * Math.sin(radiusLat2) + Math.cos(radiusLat1) * Math.cos(radiusLat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}

module.exports = searchService;