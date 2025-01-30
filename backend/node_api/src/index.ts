// console.log('hello World 🌏')
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

// import mongoose from 'mongoose';
import connectMongoDb from './db_config/connectMongoDb';

// import Interface for typescript
import { IUser } from 'schemas/userSchema';

import dotenv from 'dotenv';
dotenv.config();
const port: number = parseInt(process.env.BACKEND_PORT);

// [ Routes ]
import userRoutes from './routes/userRoutes';

// - - - [ Create App ] - - -
const app: Express = express();

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.use('/user', userRoutes);




// // - - - [ - R-o-u-t-e-s ] - - -
// app.get('/test', (req: Request, res: Response) => {
//     res.send('API REST avec Node.js, Express et MongoDB en TypeScript');

// });

// app.post('/test', (req: Request, res: Response) => {
//     res.send({ message: 'API REST avec Node.js, Express et MongoDB en TypeScript' });
// });

// // Exemple de route asynchrone
// app.get('/users', async (req: Request, res: Response) => {
//     try {
//         const users = await User<IUser>.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: err });
//     }
// });






// -- -- --  [  Launch Server  ]  -- -- --
const startServer = async (): Promise<void> => {
    await connectMongoDb();
    app.listen(port, () => {
        console.log(` 🐳 Back Server is running 🌏n http://localhost:${port}/ 🚀`);
    });
};

startServer().catch((err) => {
    console.error('Erreur lors du démarrage du serveur:', err);
});

// const server = http.createServer(app)
// server.listen(port, () => {
//     console.log(` 🐳 Back Server is running 🌏n http://localhost:${port}/ 🚀`)
// })

