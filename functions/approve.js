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
        const message = payload.message;
        message.blocks[2] = {
            type: 'mrkdwn',
            text: '*Video Approved*'
        };
        message.blocks[3] = {
            type: 'mrkdwn',
            text: `:white_check_mark: ${payload.user.name} approved this video on ${DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}`
        };
        await axios.post(payload.response_url, {
            replace_original: 'true',
            ...message,
        });
    }
    return {
        statusCode: 200,
    }
}