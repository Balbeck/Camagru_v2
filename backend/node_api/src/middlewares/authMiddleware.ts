import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || "Y_a_un_Pb_Bro";


// - - - *[ Create J W T  with ( id ) ]* - - - 
export const generateJwt = (_id: string): string => {
    return jwt.sign({ id: _id }, JWT_SECRET, { expiresIn: "1d" });
};


// - - - *[ etendre type de Request pour add 'req.user' ]* - - - 
// * -  pour Create  req.user  pour Auth by (id) ! - *
declare module "express-serve-static-core" {
    interface Request {
        user?: { id: string };
    }
}

// - - - *[ Middleware pour vérifier le token JWT ]* - - - 
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {

    //  * -  Vérifie le token dans les cookies ou les headers  - *
    const token = req.cookies?.Cama || req.headers.authorization?.split(" ")[1];
    // console.log(' 🦧 [A]*verifyJwt ] token: ', token);
    if (!token) {
        console.log(' 🦧 [A]*verifyJwt ] No Token ❌ ');
        res.status(401).json({ message: "Access Denied, No Token" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        // * -  assign and set token to -> req.user  - *
        req.user = decoded;
        console.log(' 🦧 [A]*verifyJwt ] ✅ req.user: ', req.user);
        next();

    } catch (error) {
        console.log(' 🦧 [A]*verifyJwt ] Invalid Credentials! ❌ ');
        res.status(401).json({ message: "Invalid Credentials!" });
    }
};
