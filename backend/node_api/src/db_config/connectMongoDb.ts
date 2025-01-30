import mongoose from 'mongoose';

// [ Connection to Mongo DB ]
const connectMongoDb = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' 📚 Connecté à MongoDB ! 📚 ');
    } catch (err) {
        console.error(' 🍁 Erreur de connexion à MongoDB 🍁 : ', err);
        process.exit(1);
    }
};

// export { connectMongoDb };
export default connectMongoDb;
