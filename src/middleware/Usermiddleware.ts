import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";

export const UserMiddleware: RequestHandler = (req,res, next)=>{

    const {token} = req.headers 

    if(!token){
         res.status(401).json({
            message: 'not authorised, not logged In!!!'
        })
    }

    try {
        jwt.verify(token as string, process.env.JWT_PASSWORD as string, (err, data)=>{

            if(err){
                console.log('error in jwt auth ', err)
                res.json({
                    message:'error in token'
                })
            }

            req.userId = (data as JwtPayload).id;
            next();
        })

    } catch (error) {
        console.log('error in auth user ', error)
        res.json({
            message: 'not able to access this route '
        })
    }
}