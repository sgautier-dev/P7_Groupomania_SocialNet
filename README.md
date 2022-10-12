## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description

GroupoNet App, Groupomania's employees social network. In development.

## Technologies

Build using MERN Stack:
    MongoDB (Atlas)
    Express
    React (Redux & RTK Query)
    Node

## Author

Sébastien Gautier

## References

    https://redux.js.org/
    https://www.codecademy.com/
    https://openclassrooms.com/

## Requirements

    React V18
    Node V16

## Installing dependencies

From the server directory run: `npm install`
From the client directory run: `npm install`

## Environment variables

On the server directory create a .env file and add into it:
    NODE_ENV=development
    DATABASE_URI= <your mongodb connection string>
    ACCESS_TOKEN_SECRET= <a unique hex 64 secret token string>
    REFRESH_TOKEN_SECRET=<an other hex 64 secret token string>


## Starting the App in development mode

From the server directory run: `npm run dev`
From the client directory run: `npm start`

## Viewing the App

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

