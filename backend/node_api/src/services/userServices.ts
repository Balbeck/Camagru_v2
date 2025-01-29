const User = require('../schemas/userSchema');
const bcrypt = require('bcrypt');

exports.registerUser = async (userData: any) => {
    const hashedPasword = await bcrypt.hash(userData.password, 10);
    const user = new User( { ...userData, password : hashedPasword } );
    return await user.save();
};
