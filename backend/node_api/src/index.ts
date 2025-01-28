// console.log('hello World 🌏')

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();
const port = process.env.BACKEND_PORT || 8080;


const app = express()

app.use(cors({
    credentials: true,
})
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)

server.listen(port, () => {
    console.log(" 🐳 Server is running 🌏n http://localhost:${port}/ 🚀")
})

// [  -Init-   Mongodb + mongoose  ]
// const mongoose = require('mongoose');
const MONGO_URL: string = 'mongodb://mongo:27017/UsersDB';
mongoose.Promise = global.Promise;
const connectDb = async (): Promise<void> => {
    try {
      await mongoose.connect(MONGO_URL);
      console.log('Connected to MongoDB ! 📚');
    } catch (error) {
      console.error('Error connecting to MongoDB 🍁: ', error);
    }
  };
  mongoose.connection.on('error', (error: Error) => 
    console.error(error)
);

export default connectDb;


// const MONGO_URL = ''
// mongoose.connect(MONGO_URL);

