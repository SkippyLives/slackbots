// JavaScript source code
var request = require('request');

var matches = [];
// format of dict in matches(challengerName,opponentName,weapon)

var standings = [];
// format of dict in standings (userName,wins,losses)

var weapons = ["rock","paper","scissors"];

module.exports = function (req, res, next) {
    // default roll is 2d6
    var inputs = [];

    var botPayload = {};

    if (req.body.token != 'boQucr9ebdKjVfE3ZX1Q8nJL') {
        return
    }

    if (req.body.text) {
        // parse input to see what commands are given
        // <challenge|accept|standings> <member> rock|paper|scissors

        inputs = req.body.text.split(" ");

        //matches shouldn't be longer than 3 and not 0 or 2
        if (inputs.length < 1 || inputs.length > 3 || inputs.length == 2) {
            // send error message back to user if input is bad
            return res.status(200).send(helpText());
        }

    }
    else {
        return res.status(200).send(helpText());
    }

    // Input good format now we see if they have right keywords
    // We start with first match which could be any of the optional first parameter or the weapon

    // check if they entered first optional parameter
    if ('standings' == inputs[0]) {
        // write response message and add to payload
        botPayload.text = 'W    L      User\n';
        for (var i = 0; i < standings.length; i++) {
            botPayload.text += " " + standings[i]['wins'] + '      ' + standings[i]['losses'] + '       ' + standings[i]['userName'] + '\n';
        } 
    } else if ('challenge' == inputs[0]) {

        if (inputs.length != 3) {
            // must have opp and weapon!!
            return res.status(200).send(helpText());
        }
        // add a challenge
        // a challenge consists of a dictionary with challengerName,opponentName,weapon
        // first see if there is already a challenge from this member to this opponent.
        var challengerName = req.body.user_name;
        var oppName = inputs[1];
        var challengerWeapon = String(inputs[2]).toLowerCase();
        if (!verifyWeapon(challengerWeapon)) {
            return res.status(200).send(challengerWeapon + " is not a valid weapon\n" + helpText());
        }
        for (var i = 0; i < matches.length; i++) {
            if (challengerName = matches[i]['challengerName']) {
                if (oppName == matches[i]['opponentName']) {
                    return res.status(200).send("There is already a match pending");
                }
            }
        }
        // create a match
        matches.push({ 'challengerName': challengerName, 'opponentName': oppName, 'weapon': challengerWeapon });

        // create group message that a new challenge has been created
        botPayload.text = challengerName + " has challenged " + oppName + " to Rock/Paper/Scissors\n";
        botPayload.text += "To accept this challege, " + oppName + ", use /rps accept " + challengerName + " <rock|paper|scissors>\n";

    } else if ('accept' == inputs[0]) {
        if (inputs.length != 3) {
            // must have opp and weapon!!
            return res.status(200).send(helpText());
        }
        // look for challenge
        var oppName = req.body.user_name;
        var challengerName = inputs[1];
        var oppWeapon = String(inputs[2]).toLowerCase();
        if (!verifyWeapon(oppWeapon)) {
            return res.status(200).send(oppWeapon + " is not a valid weapon\n" + helpText());
        }
        var idx = searchMatches(challengerName, oppName);
        if (idx < 0) {
            return res.status(200).send("There is no match pending");
        }
        // match exists
        // remove from matchlist 
        var challengerWeapon = matches[idx]['weapon'];
        matches.splice(idx,1);

        // Determine winner/tie
        botPayload.text = "Challenge Accepted!\n" + challengerName + " chose " + challengerWeapon + "\n";
        botPayload.text += oppName + " chose " + oppWeapon + "\n";

        var win = getWinner(challengerWeapon, oppWeapon);
        if (win == 0) {
            // tie
            botPayload.text += "Its a Tie!\n";
            // no standings update
        } else if (win == 1) {
            botPayload.text += challengerName + " Wins!\n";
            updateStandings(challengerName, oppName);
        } else {
            botPayload.text += oppName + " Wins!\n";
            updateStandings(oppName, challengerName);
        }   
    } else {
        // if here then we are playing the bot
        var challengerName = req.body.user_name;
        var challengerWeapon = String(inputs[0]).toLowerCase();
        if (!verifyWeapon(challengerWeapon)) {
            return res.status(200).send(challengerWeapon + " is not a valid weapon\n" + helpText());
        }
        var botWeapon = weapons[Math.floor(Math.random()*3)];
        botPayload.text = "Challenge Accepted!\n";
        botPayload.text += challengerName + " chose " + challengerWeapon + "\n";
        botPayload.text += "RPSBot chose " + botWeapon + "\n";
        var win = getWinner(challengerWeapon, botWeapon);
        if (win == 0) {
            // tie
            botPayload.text += "Its a Tie!\n";
            // no standings update
        } else if (win == 1) {
            botPayload.text += challengerName + " Wins!\n";
        } else {
            botPayload.text += "RPSBot Wins!\n";
        }
        
    }

        // if we are here all is well to send a group message
        // send payload to chatgroup 
    botPayload.username = 'RPSBot';
    botPayload.channel = req.body.channel_id;
    botPayload.icon_emoji = ':punch:';

    send(botPayload, function (error, status, body) {
        if (error) {
            return next(error);
        } else if (status !== 200) {
            // inform user that our Incoming WebHook failed
            return next(new Error('Incoming WebHook: ' + status + ' ' + body));
        } else {
            return res.status(200).end();
        }
    });
};

// get winner
function getWinner(challengerWeapon, oppWeapon) {
    // return 0 if tie; 1 if challenger wins, 2 if opp wins
    if (challengerWeapon == oppWeapon) {
        return 0;
    }
    // rock first
    if ('rock' == challengerWeapon) {
        if ('paper' == oppWeapon) {
            return 2; // opp wins
        } else {
            return 1; // challenger wins
        }
    }
    // paper next
    if ('paper' == challengerWeapon) {
        if ('scissors' == oppWeapon) {
            return 2; // opp wins
        } else {
            return 1; // challenger wins
        }            
    }
    // scissors last
    if ('scissors' == challengerWeapon) {
        if ('rock' == oppWeapon) {
            return 2; // opp wins
        } else {
            return 1; // challenger wins
        }
    }
    // shouldn't be here but if are call it a tie :)
    return 0
}

// update the standings
function updateStandings(winner, loser) {
    //winner first
    var idx = searchStandings(winner);
    if (idx < 0) {
        //add user to standings
        standings.push({ 'userName':winner, 'wins':1, 'losses':0 })
    } else {
        standings[idx]['wins'] += 1;
    }
    //now loser
    idx = searchStandings(loser);
    if (idx < 0) {
        //add user to standings
        standings.push({ 'userName': loser, 'wins': 0, 'losses': 1 })
    } else {
        standings[idx]['losses'] += 1;
    }
}

// make sure weapon is valid
function verifyWeapon(weapon) {
    if (weapons.indexOf(weapon) < 0) {
        return false;
    } else {
        return true;
    }
}
// search matches
function searchMatches(userName, oppName) {
    // returns idx if found or -1 if not found
    for (var i = 0; i < matches.length; i++) {
        if (userName = matches[i]['challengerName']) {
            if (oppName == matches[i]['opponentName']) {
                return i;
            }
        }
    }
    return -1

}

// search standing
function searchStandings(userName) {
    for (var i = 0; i < standings.length; i++) {
        if (userName == standings[i]['userName']) {
            return i;
        }
    }
    return -1
}

// print a standard help text
function helpText() {
    var help = "Usage: /rps <challenge|respond|standings> <member> rock|paper|scissors"
    return help;
}

// send function to send to channel
function send(payload, callback) {
    var path = '/T0TJQR3CZ/B0TKB5H5W/ByBICQOvNBmfeZsT5iIgKytr';
    var uri = 'https://hooks.slack.com/services' + path;

    request({
        uri: uri,
        method: 'POST',
        body: JSON.stringify(payload)
    }, function (error, response, body) {
        if (error) {
            return callback(error);
        }

        callback(null, response.statusCode, body);
    });
}