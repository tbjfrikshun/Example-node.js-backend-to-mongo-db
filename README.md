# Project Title

Node backend application using Express for routes and mongoDb for the back end database.

## Getting Started

Find a directory on your computer for the project.   Initial development was done on Mac OS but you can also use windows.   Note this app does not contain a gui. The interface to it is routes setup in Express. 

### Prerequisites

You will need git, npm, node, mongodb, postman and mongoDb Compass already installed.

### Installing configuring

1) Install git CLI: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git (don't forget to configure your email username and account setup on https://github.com )
2) Install Node.js and npm: https://blog.teamtreehouse.com/install-node-js-npm-mac
3) Install mongodb https://www.mongodb.com/what-is-mongodb and Compass https://www.mongodb.com/products/compass
4) Install https://www.getpostman.com/downloads/
5) Setup your project root directory and clone the software: git clone "clone string copied from github"
6) From project root run: npm init
7) Set your enviroment variables: export vidly_jwtPrivateKey=yourpassword and export NODE_ENV=development

### Project usage
There are three ways to run this project:  

1) The first is with Postman where you have control over the requests sent and received from the routes. In this case set export NODE_ENV=development and use nodemon from the command line.
2) The second is when developing tests.   In this case you will want to use npm test from the command line.
3) The third is to run it in production mode in Heroku.   In this case you will need to set NODE_ENV=production and Add-on Datastore mLab MongoDB.