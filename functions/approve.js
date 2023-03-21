exports.handler = async (event, context) => {
    console.log(event);
    if (event?.body?.challenge) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                challenge: event.body.challenge,
            })
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