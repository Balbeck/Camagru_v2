import { Request, Response } from 'express';
const UserService = require('../services/userService');


exports.register = async (req: Request, res: Response) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
