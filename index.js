const router = require('./src/router');

/**
 * Organizing response in API gateway format
 * 
 * @param {number} statusCode HTTP-statusCode
 * @param {Object} headers HTTP-headers
 * @param {string} body request payload
 * @returns {JSON} response 
 */
function setResponse(statusCode, headers, body) {
  statusCode = statusCode || 404;
  headers = typeof headers === "object" ? headers : { "Content-Type": "application/json" };
  body = typeof body == 'string' ? body : JSON.stringify(body);

  headers = Object.assign(headers, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": true
  });
  return {
    statusCode,
    headers,
    body
  };
}

// lambda-like handler function
module.exports.handler = async (event, context) => {

  // Trim /v1 for requests
  event.path = event.path.replace(/^\/v1/, "");

  // This will allow the freezing of connections and will prevent Lambda from hanging on open connections
  // for reference https://www.jeremydaly.com/reuse-database-connections-aws-lambda/
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(`\n\n\n\n\n-------------------  request URL ----------------------\n`, event.path)

  // Checking if there is unwanted slashes, and redirect the url
  if ((/\/[\/]*\//gu).test(event.path) || (/\/$/u).test(event.path)) {
    let path = event.path.replace(/\/[\/]*\//gu, "/").replace(/\/$/u, "");

    // Response for url redirection
    return setResponse(301, {
      Location: `http://${event.headers.Host}/${event.requestContext.stage}${path}${event.queryStringParameters ? `?${querystring.stringify(event.queryStringParameters)}` : ""}`
    }, "Invalid url, will be redirected to trimmed url");
  }

  // Trim the request params
  request = requestParse(event);

  // Pass through request-routing

  result = await router(request).then((data) => {
    console.log(`Inside router`);
    data = setResponse(data.body.code || data.statusCode, data.headers, data.body);

    return data;
  }).catch((error) => {
    console.log(error);

    return setResponse(500, {}, error);
  });

  return result;
};

/**
 * Request parser 
 * @param {Object} event Request Object
 * @returns {Object} Trimmed Request Object 
 */
function requestParse(event) {

  let result = Object.assign({}, event);

  // Trim unwanted slashes and decode uri
  result.path = decodeURI(result.path);
  result.resource = result.resource.trim();
  result.httpMethod = result.httpMethod.toUpperCase();
  result.requestContext.path = decodeURI(result.requestContext.path);
  result.requestContext.stage = result.requestContext.stage.trim();

  return result;
}
