const service = require('./zip-code.service');

const handlers = {

  getAddressByZipCode: async function (request) {
    let result;
    try {
      const searchText = request.params.text;
      const filters = request.query;
      const searchResult = await service.searchByPinCode(searchText, filters);
      result = { code: 200, data: searchResult }
    } catch (e) {
      result = {
        code: 204,
        info: `No data found`,
        error: e
      }
    }
    return result;
  },

  getAddressByCity: async function (request) {
    let result;
    try {
      const searchText = request.params.text;
      const filters = request.query;
      const searchResult = await service.searchByCity(searchText, filters);
      result = { code: 200, data: searchResult }
    } catch (e) {
      result = {
        code: 204,
        info: `No data found`,
        error: e
      }
    }
    return result;
  },

  getAddressByGeo: async function (request) {
    try {
      const latitude = parseFloat(request.params.lat);
      const longitude = parseFloat(request.params.long);
      const filters = request.query;
      const searchResult = await service.findNearestAddress({ latitude, longitude }, filters);
      return { code: 200, data: searchResult }
    } catch (e) {
      return {
        code: 204,
        info: `No data found`,
        error: e
      }
    }
  }

};


module.exports = handlers;
