# VIRA

[![CircleCI](https://circleci.com/gh/zimmerman-team/VIRA.svg?style=svg&circle-token=f1c9c39b17f9c53166ffa2440e707cd75aaab5d5)](https://circleci.com/gh/zimmerman-team/VIRA)

## What VIRA?

This tool allows you to easily generate reports on the basis of projects that have been co-funded by your foundation. After signing in, access is granted to project information and the progress can be reported. These reports allow your foundation to monitor the effectiveness of contributions more effectively.

## About the project

- Website: Private
- Authors: <a href="https://www.zimmerman.team/" target="_blank">Zimmerman</a> and <a href="https://www.oamconsult.com/ target="\_blank">OAM Consult</a>
- License: AGPLv3
- Github Backend Repo: <a href="https://github.com/zimmerman-team/VIRA" target="_blank">github.com/zimmerman-team/VIRA</a>
- Github Frontend Repo: <a href="https://github.com/zimmerman-team/VIRA.frontend" target="_blank">github.com/zimmerman-team/VIRA.frontend</a>

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

    $ git clone https://github.com/zimmerman-team/VIRA.git
    $ cd VIRA
    $ yarn install

## Configure app

Create an `.env` file in the root directory and add the following:

```
REACT_APP_AE_API_CLIENT_ID=<Auth0 Authentication Extension API client id>
REACT_APP_AUTH_DOMAIN=<Auth0 tenant custom domain>
REACT_APP_AE_API_CLIENT_SECRET=<Auth0 Authentication Extension API client secret>
REACT_APP_AE_API_URL=<Auth0 Authentication Extension API URL>

REACT_APP_POSTMARK_CLIENT_ID=<Postmark client id>
REACT_APP_POSTMARK_TEMPLATE_WELCOME=<Postmark welcome email template id>
REACT_APP_POSTMARK_TEMPLATE_RESET=<Postmark reset password template id>
REACT_APP_POSTMARK_TEMPLATE_NOTIFICATION=<Postmark project notification email template id>

REACT_APP_PROJECT_URL=<http://localhost:3000 for running locally | https://something.com for deployed runs>
REACT_APP_BACKEND_PORT=4200
REACT_APP_BACKEND_URL=http://localhost:4200
REACT_APP_MONGO_DB_URL=mongodb://localhost:27017/vira
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
