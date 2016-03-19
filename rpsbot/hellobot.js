// JavaScript source code
module.exports = function (req, res, next) {
    var token = '';

    if (req.body.token != token) {
        return
    }

    var userName = req.body.user_name;
    var botPayload = {
        text: 'Hello, ' + userName + '!'
    };

    // avoid infinite loop
    if (userName !== 'slackbot') {
        return res.status(200).json(botPayload);
    } else {
        return res.status(200).end();
    }

}

