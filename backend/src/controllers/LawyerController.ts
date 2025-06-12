import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/db";
import ErrorHandler from "../utils/errorHandler";
import { responseHandler } from "../utils/responseHandler";

export const getUserReq=responseHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const User=req.user;
        if(!User){
            throw new ErrorHandler(400,false,"Unauthorized, Invalid User Access");
        }
        // finding my lawyer credentials
        const findMe=await prisma.lawyer.findUnique({where:{email:User.email}});
        if(!findMe){
            throw new ErrorHandler(400,false,"Server is facing internal issue, logout and login again");
        }

        const Cases=await prisma.userReq.findMany({where:{laywerID:findMe.id}});
        res.status(200).json({
            success:true,
            message:"cases retrieved",
            data:Cases
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message||"server failure");
    }
})