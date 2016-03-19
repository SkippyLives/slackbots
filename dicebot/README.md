# dicebot

Rolls dice and adds them up.
called in slack by using the /roll slash command

This is straight from the tutorials on http://www.sitepoint.com/getting-started-slack-bots/ 
That tutorial also explains how to connect to your slack channel and all the glue. Highly recommend reading it.

## Example ##

/roll 2d6
will roll a 6 sided die twice. output is the results of each die and the total of them added together
4+3=7

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

### JavaScript

To run the bot from the same app directory (dicebot for example)

```bash
node app
```

to test locally recommend curl as it can inject payloads that some apps need
all apps have the hello bot so you can use hello as the keyword and it will responde with "Hello World"
NOTE: since dicebot uses a secondary channel you can't test its results without hooking it into your slack webhook

```bash
curl http://localhost:3000/roll
```