# slackbots

Misc bots for slack. Written in Node JS so far. may add some GO ones.

## Development ##

Requires [node](https://nodejs.org/)

node installs a package manager called npm which we use to get packages.


## Packages ##

In the app directory (dicebot for example) you will need to install the required packages
They will be saved to a node_modules subdir
Each bots README will have the packages you need.

```bash
npm install express --save
```

## Running app ##

To run the bot from the same app directory (dicebot for example)

```bash
node app
```

## Testing ##

to test locally recommend curl as it can inject payloads that some apps need
all apps have the hello bot so you can use hello as the keyword and it will responde with "Hello World"

```bash
curl http://localhost:3000/<keyword>
```