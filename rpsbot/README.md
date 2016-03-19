# rpsbot

Rock/Paper/Scissors bot
called in slack by using the /rps slash command

includes dicebot and hello bots from the tutorials on http://www.sitepoint.com/getting-started-slack-bots/ 
That tutorial also explains how to connect to your slack channel and all the glue. Highly recommend reading it.

rpsbot allows you to play against the bot or another member

## Syntax ##

/rps <challenge|respond|standings> <member> rock|paper|scissors

## Examples ##

/rps standings 
would display everyone win/loss scores

/rps scissors 
would challenge the rpsbot - it would randomly pick a weapon and determine results

/rps challenge <member> scissors
would log a challenge for member skippylives and remember you chose scissors

/rps respond <member> rock
would look for an open challenge from member and if exists run the match.

## Development ##

Requires [node](https://nodejs.org/)

node installs a package manager called npm which we use to get packages.

## Required Packages ##

Dicebot requires these packages: 

```bash
npm install express --save
npm install body-parser --save
npm install requests --save
```

## Running app ##

To run the bot from the same app directory (dicebot for example)

```bash
node app
```

## Testing ##

to test locally recommend curl as it can inject payloads that some apps need
all apps have the hello bot so you can use hello as the keyword and it will responde with "Hello World"
NOTE: since dicebot uses a secondary channel you can't test its results without hooking it into your slack webhook

```bash
curl http://localhost:3000/roll
```