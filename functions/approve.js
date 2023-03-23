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

        const message = Object.assign(payload.message, {
            replace_original: 'true',
            blocks: [
                payload.message.blocks[0],
                payload.message.blocks[1],
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '*Video Approved*',
                        verbatim: false
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `:white_check_mark: ${payload.user.name} approved this video on ${DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}`,
                        verbatim: false
                    }
                },
            ]
        });
        await axios.post(action.url, {
            file: action.file,
            hash: action.hash,
        });
        await axios.post(payload.response_url, message);
    }
    return {
        statusCode: 200,
    }
}