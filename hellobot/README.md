# hellobot

Simply returns a greeting back to the user.
called in slack by typing hello as the first word. uses the outgoing webhook in slack

This is straight from the tutorials on http://www.sitepoint.com/getting-started-slack-bots/ 
That tutorial also explains how to connect to your slack channel and all the glue. Highly recommend reading it.

## Example ##

hello
will respond with Hello, <username>
Hello, SkippyLives

## Development ##

Requires [node](https://nodejs.org/)

node installs a package manager called npm which we use to get packages.

## Required Packages ##

Hellobot requires these packages: 

```bash
npm install express --save
npm install body-parser --save
```

### JavaScript

To run the bot from the same app directory (dicebot for example)

```bash
node app
```

to test locally recommend curl as it can inject payloads that some apps need
all apps have the hello bot so you can use hello as the keyword and it will responde with "Hello World"


```bash
curl http://localhost:3000/hello
curl -X POST --data "user_name=foobar" http://localhost:3000/hello
```
