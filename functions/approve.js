exports.handler = async (event, context) => {
    console.log(event);
    let request = {};


    if (request.challenge) {
        return {
            statusCode: 200,
            body: request.challenge
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            body: event.body,
            params: event.queryStringParameters,
        })
    }
}