
/**
 * Challenge reference https://www.dropbox.com/s/n839xnnyqt8n6b2/aura-challenge-zipcodes.zip?dl=0&file_subpath=%2FREADME.md
 */

const handler = require('./zip-code.handler');

/**
 * Handles all sub-resource of zipcode
 */
function router(api, options) {

    console.log(`REQUESTED API: ${options.path}`);

    /**
     * **************************
     *    GETTER SERVICES
     * **************************
     */

    /**
    * @path
    * /v1/zipcode/pin
    */
    api.METHOD(`GET`, `/pin/:text`, async (request, response) => {
        return handler.getAddressByZipCode(request).then(result => {
            console.log({ result });
            response.status(result.code || 200);
            return JSON.stringify(result.data);
        }).catch(error => {
            console.error(error);
            return error;
        })
    });

    /**
     * @path
     * /v1/zipcode/city
     */
    api.METHOD(`GET`, `/city/:text`, async (request, response) => {
        return handler.getAddressByCity(request).then(result => {
            response.status(result.code || 200);
            return JSON.stringify(result.data);
        }).catch(error => {
            console.error(error);
            return error;
        })
    });

    /**
     * @path
     * /v1/zipcode/geo
     */
    api.METHOD(`GET`, `/geo/:lat/:long`, async (request, response) => {
        return handler.getAddressByGeo(request).then(result => {
            response.status(result.code || 200);
            return JSON.stringify(result.data);
        }).catch(error => {
            console.error(error);
            return error;
        })
    });

    /**
     * **************************
     *  END OF GETTER SERVICES 
     * **************************
     */

}

module.exports = router;