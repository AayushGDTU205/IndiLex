import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { responseHandler } from "../utils/responseHandler";

export const adminCheck=responseHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userData=req.user;
        if(!userData){
            throw new ErrorHandler(400,false,"access denied, invalid admin");
        }
        if(userData?.isAdmin===true){
            next();
        }
        else{
            throw new ErrorHandler(400,false,"Illegal access, you are requested to leave");
        }
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message||"server failure");
    }
})