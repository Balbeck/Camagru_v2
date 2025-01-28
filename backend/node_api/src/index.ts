// console.log('hello World 🌏')

import express, { Express, Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();
const port: number = parseInt(process.env.BACKEND_PORT);

const app: Express = express();

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());        // Middleware

// const server = http.createServer(app)
// server.listen(port, () => {
//     console.log(` 🐳 Back Server is running 🌏n http://localhost:${port}/ 🚀`)
// })


// [ Connection to Mongo DB ]
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' 📚 Connecté à MongoDB ! 📚 ');
  } catch (err) {
    console.error(' 🍁 Erreur de connexion à MongoDB 🍁 : ', err);
    // process.exit(1);
  }
};
mongoose.connection.on('error', (error: Error) =>
    console.error(error)
);

// [  S c h e m a s  ]
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  // Ajoutez d'autres champs selon vos besoins
});

const imageSchema = new mongoose.Schema({
  url: String,
  description: String,
  // Ajoutez d'autres champs selon vos besoins
});

const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  // Ajoutez d'autres champs selon vos besoins
});

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  // Ajoutez d'autres champs selon vos besoins
});

// [  Création des modèles  ]
const User = mongoose.model('User', userSchema);
const Image = mongoose.model('Image', imageSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Like = mongoose.model('Like', likeSchema);



// - - - [ - R-o-u-t-e-s ] - - -
app.get('/', (req: Request, res: Response) => {
  res.send('API REST avec Node.js, Express et MongoDB en TypeScript');
});

// Exemple de route asynchrone
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: err });
  }
});


// -- -- --  [  Launch Server  ]  -- -- --
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(port, () => {
    console.log(` 🐳 Back Server is running 🌏n http://localhost:${port}/ 🚀`);
  });
};

startServer().catch((err) => {
  console.error('Erreur lors du démarrage du serveur:', err);
});

export default connectDB;
