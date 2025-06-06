import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import connectMongoDb from './db_config/connectMongoDb';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';
import imageRoutes from './routes/imageRoutes';

import dotenv from 'dotenv';
dotenv.config();
const port: number = parseInt(process.env.BACKEND_PORT);


// - - - [ Create App ] - - -
const app: Express = express();


// - - - [ App Configuration ] - - -
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json());


// - - - [ Routes ] - - -
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/like', likeRoutes);
app.use('/comment', commentRoutes);
app.use('/image', imageRoutes);


// -- -- --  [  Launch Server  ]  -- -- --
const startServer = async (): Promise<void> => {
    await connectMongoDb();
    app.listen(port, () => {
        console.log(` 🐳 Back Server is running 🌏n http://localhost:${port}/ 🚀`);
    });
};

startServer().catch((err) => {
    console.log(' [ ❌ ] Erreur lors du démarrage du serveur: -> \n', err);
});
