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
        const message = Object.assign(payload.message, {
            replace_original: 'true',
            blocks: [
                payload.message.blocks[0],
                payload.message.blocks[1],
                // {
                //     type: 'section',
                //     block_id: payload.message.blocks[2].block_id,
                //     text: {
                //         type: 'text',
                //         test: 'Video Approved',
                //         verbatim: false
                //     }
                // },
                // {
                //     type: 'mrkdwn',
                //     text: `:white_check_mark: ${payload.user.name} approved this video on ${DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}`
                // }
            ]
        });
        console.log('The message');
        console.log(message);
        // message.blocks[2] = {
        //     type: 'mrkdwn',
        //     text: '*Video Approved*'
        // };
        // message.blocks[3] = {
        //     type: 'mrkdwn',
        //     text: `:white_check_mark: ${payload.user.name} approved this video on ${DateTime.now().toLocaleString(DateTime.DATETIME_FULL)}`
        // };
        console.log('Message modified');
        console.log(message);
        console.log('The URL');
        console.log(payload.response_url);
        console.log('The Payload');
        console.log(message);
        console.log('JSON STRINGIFYING');
        console.log(JSON.stringify(message));
        await axios.post(payload.response_url, message);
    }
    return {
        statusCode: 200,
    }
}