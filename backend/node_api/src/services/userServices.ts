// const User = require('../schemas/userSchema');
// const bcrypt = require('bcrypt');
import { User } from '../schemas/userSchema'
import bcrypt from 'bcrypt';


exports.registerUser = async (userData: any): Promise<User> => {
    const hashedPasword = await bcrypt.hash(userData.password, 10);
    const user = await new User( { ...userData, password : hashedPasword } );
    return await user.save();
};
