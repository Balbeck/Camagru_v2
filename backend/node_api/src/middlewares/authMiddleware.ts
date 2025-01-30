import { Request, Response } from "express";
import jwt, { Jwt } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateJwt = (_id: String): string => {
    return jwt.sign({ id: _id }, JWT_SECRET, {expiresIn: '1d'});
};

// export const verifyJwt = (req: Request, res: Response) => {
//     const token =req.header('Authorization')?.replace('Bearer', '');
//     if (!token){
//         return res.status(401).json({message: 'JWT_MISSING'});
//     }
//     try {
//         // Revoir la logique !
//         const decodedJwt = jwt.verify(token, JWT_SECRET) as {id: string};
//         (req as any).id = decodedJwt.id;
//         next();
//     } catch (error: any) {
//         res.status(401).json({message: 'INVALID_TOKEN'});
//     }
// };
