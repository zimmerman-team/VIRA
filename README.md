# INSINGER API

An API/back-end service that processes Insinger data file for a project/report management tool.

---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    vX.X.X

    $ npm --version
    X.X.X

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

###

### MongoDB installation

You can follow the official [documentation](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials) to install MongoDB in your preferred OS.
Just make sure that you install version 4.x.x of MongoDB

---

## Install

    $ git clone https://github.com/zimmerman-zimmerman/insinger-backend.git
    $ cd insinger-backend
    $ yarn install

## Configure app

Create an `.env` file in the root directory and add the following:

```
REACT_APP_AE_API_CLIENT_ID=<REACT_APP_AE_API_CLIENT_ID>
REACT_APP_AUTH_DOMAIN=<REACT_APP_AUTH_DOMAIN>
REACT_APP_AE_API_CLIENT_SECRET=<REACT_APP_AE_API_CLIENT_SECRET>
REACT_APP_AE_API_URL=<REACT_APP_AE_API_URL>
REACT_APP_POSTMARK_CLIENT_ID=<REACT_APP_POSTMARK_CLIENT_ID>

REACT_APP_PROJECT_URL=<http://localhost:3000 for running locally | https://something.com for deployed runs>
REACT_APP_BACKEND_PORT=4200
REACT_APP_BACKEND_URL=http://localhost:4200
REACT_APP_MONGO_DB_URL=mongodb://localhost:27017/insinger
REACT_APP_DATA_FILE=<name of the data file in server/scripts, must be a csv file>
```

## Parse data

    $ yarn import-data

## Create and invite users based on data

    $ yarn check-invite-new-users

## Running the project

    $ yarn start

## Run tests

    $ yarn start-test-api
