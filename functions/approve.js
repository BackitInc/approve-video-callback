exports.handler = async (event, context) => {
    console.log(event);
    //const request = JSON.parse(event.body);

    // if (request.challenge) {
    //     return {
    //         statusCode: 200,
    //         body: request.challenge
    //     }
    // }
    return {
        statusCode: 200,
        body: event
    }
}