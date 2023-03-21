const querystring = require('querystring');
const axios = require('axios');

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
        const payload = JSON.parse(querystring.parse(event.body).payload)
        const date = new Date();
        await axios.post(payload.response_url, {
            "replace_original": "true",
            text: 'New comic book alert!',
            attachments: [
                {
                    title: 'The Further Adventures of Slackbot',
                    fields: [
                        {
                            title: 'Volume',
                            value: '1',
                            short: true,
                        },
                        {
                            title: 'Issue',
                            value: '3',
                            short: true,
                        },
                    ],
                    author_name: 'Stanford S. Strickland',
                    author_icon:
                        'http://a.slack-edge.com/7f18https://a.slack-edge.com/80588/img/api/homepage_custom_integrations-2x.png',
                    image_url: 'http://i.imgur.com/OJkaVOI.jpg?1',
                },
                {
                    title: 'Synopsis',
                    text: 'After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy...',
                },
                {
                    title: `${payload.user.name} approved this video`,
                    text: `Approved at ${date.toTimeString()}`
                },
            ]
        });
    }
    return {
        statusCode: 200,
    }
}