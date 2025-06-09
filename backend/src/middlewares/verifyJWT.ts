import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { responseHandler } from "../utils/responseHandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/db";

export const verifyJwt=responseHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies.accessToken;
        if(!token){
            throw new ErrorHandler(400,false,"session terminated, please login again");
        }
        const decode=jwt.verify(token,process.env.access_key_str!);
        const email:string=(decode as JwtPayload).email;
        const User=await prisma.user.findUnique({where:{email:email}});
        if(!User){
            throw new ErrorHandler(400,false,"Unauthorized access");
        }
        req.user=User;
        next();
    }catch(error:any){
        throw new ErrorHandler(error.statusCode || 500, false,error.message||"server failure");
    }
})
