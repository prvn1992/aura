const api = require("lambda-api")({
    version: "v1",
    base: "zipcode", /* API gateway base name*/
});
const zipCode = require('./resources/zip-code.router');

/**
 * To handle boiler-code and register REST api
 * 
 * @param {any} lambdaEvent request object from lambda
 * @returns {Promise<any[] | any>} response Object
 * 
 */
async function route(lambdaEvent) {

    let result = {};

    /* Define sub-resource router below  */
    api.register(zipCode, { prefix: "", path: lambdaEvent.path });

    /**
     * Error handling for router definitions response
     */
    api.use((err, req, res, next) => {
        // do something
        console.log("Error with router\n", lambdaEvent.path);
        res.status(500);
        res.error(err);
        // return { Error: err.stack };
        next();
    });

    /* Bootstrapping the request to REST */
    console.time(`Time taken to give response for ${lambdaEvent.path}`);
    result = await api.run(lambdaEvent).then((data) => data);
    console.timeEnd(`Time taken to give response for ${lambdaEvent.path}`);
    return result;

}


module.exports = route;