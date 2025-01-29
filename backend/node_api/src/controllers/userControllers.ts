const UserService = require('../services/userService');

exports.register = async (req: any, res: any) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
