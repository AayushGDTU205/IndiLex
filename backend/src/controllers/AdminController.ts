import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { responseHandler } from "../utils/responseHandler";
import { prisma } from "../lib/db";
import nodemailer from "nodemailer"

export const getLawyerReq=responseHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const lawyerReqs=await prisma.lawyerReq.findMany();
        res.status(200).json({
            success:true,
            message:"details retrieved",
            data:lawyerReqs
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message||"server failure");
    }
})

interface requestBody{
    reqID:number
}

export const acceptLawyerReq=responseHandler(async(req:Request<{},{},requestBody>,res:Response,next:NextFunction)=>{
    try{
        const {reqID}=req.body;
        const retrieveReq=await prisma.lawyerReq.findUnique({where:{id:+reqID}});
        if(!retrieveReq){
            throw new ErrorHandler(400,false,"No such request found");
        }
        const newLawyer=await prisma.lawyer.create({
            data:{
                name:retrieveReq.name,
                email:retrieveReq.email,
                location:retrieveReq.location,
                address:retrieveReq.address,
                barLicenseNumber:retrieveReq.barLicenseNumber,
                Specialization:retrieveReq.Specialization,
                court:retrieveReq.court,
                practiceSince:+retrieveReq.practiceSince
            }
        })
        const findUser=await prisma.user.update({
            where:{
                id:retrieveReq.userId
            },
            data:{
                isLawyer:true
            }
        })

        const delLawyerReq=await prisma.lawyerReq.delete({where:{id:+reqID}});
        const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.gmail_account,
                        pass: process.env.GMAIL_APP_PASSWORD,
                    },
                });
                const info = await transporter.sendMail({
                    from: '"IndiLex" <no-reply@indilex.in>',
                    to: retrieveReq.email,
                    subject: `Congrats ${retrieveReq.name} 🎉🎉🎉`,
                    text: "Hello world?", // plain‑text body
                    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #1a73e8;">Congratulations, ${retrieveReq.name}!</h2>
    <p>We're thrilled to inform you that your request to join <strong>IndiLex</strong> has been <strong style="color:green;">approved</strong>.</p>
    
    <p>As a verified lawyer on IndiLex, you now have access to:</p>
    <ul>
      <li>Connect with users seeking legal aid</li>
      <li>Get listed on our platform for potential clients</li>
      <li>Participate in legal forums and case discussions</li>
    </ul>

    <p>We’re excited to have you onboard. Start exploring your dashboard and update your profile to attract more clients.</p>

    <p style="margin-top: 20px;">If you have any questions or need assistance, feel free to reach out to us at 
      <a href="mailto:support@indilex.in">support@indilex.in</a>.
    </p>

    <p>Warm regards,<br/><strong>The IndiLex Team</strong></p>

    <hr style="margin: 30px 0;">
    <small style="color: #888;">You are receiving this email because you registered on IndiLex.in</small>
  </div>
        `, // HTML body
                })
        res.status(200).json({
            success:true,
            message:"new lawyer added",
            data:[newLawyer,delLawyerReq,findUser]
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message||"server failure");
    }
})