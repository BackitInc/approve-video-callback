const querystring = require('querystring');
const axios = require('axios');
const { DateTime } = require('luxon');

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

    if(event.body && /^payload=+/.test(event.body)) {
        const payload = JSON.parse(querystring.parse(event.body).payload);
        const action = JSON.parse(payload.actions[0].value);
        console.log(action);
        console.log(payload);
        await axios.post(action.url, {
            file: action.file,
            hash: action.hash,
        });
        console.log('Finished posting');
        const message = payload.message;
        console.log('The message');
        console.log(message);
        message.blocks[2] = {
            type: 'mrkdwn',
            text: '*Video Approved*'
        };
        message.blocks[3] = {
            type: 'mrkdwn',
            text: `:white_check_mark: ${payload.user.name} approved this video on ${DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}`
        };
        console.log('Message modified');
        console.log(message);
        console.log('The URL');
        console.log(payload.response_url);
        console.log('The Payload');
        message.replace_original = 'true';
        console.log(message);
        console.log('JSON STRINGIFYING');
        const moo = Object.assign({}, message);
        console.log(JSON.stringify(moo));
        await axios.post(payload.response_url, moo);
    }
    return {
        statusCode: 200,
    }
}