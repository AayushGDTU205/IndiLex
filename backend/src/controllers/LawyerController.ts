import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/db";
import ErrorHandler from "../utils/errorHandler";
import { responseHandler } from "../utils/responseHandler";
import nodemailer from "nodemailer"

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

interface requestBody{
    caseID:number
}

export const AcceptCase=responseHandler(async(req:Request<{},{},requestBody>,res:Response,next:NextFunction)=>{
    try{
        let {caseID}=req.body;
        if(!caseID){
            throw new ErrorHandler(400,false,"empty field");
        }
        const Case=await prisma.userReq.findUnique({where:{id:+caseID}});
        if(!Case){
            throw new ErrorHandler(400,false,"no such case exists");
        }
        const pastCase=await prisma.reviewedUserReq.create({
            data:{
                name:Case.name,
                email:Case.email,
                contact:Case.contact,
                caseDesc:Case.caseDesc,
                userID:+Case.userID,
                laywerID:+Case.laywerID,
                status:"Accepted"
            }
        })
        const del=await prisma.userReq.delete({where:{id:+caseID}});
        const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.gmail_account,
                        pass: process.env.GMAIL_APP_PASSWORD,
                    },
            });
            const info = await transporter.sendMail({
                    from: '"IndiLex" <no-reply@indilex.in>',
                    to: Case.email,
                    subject: `📩 Confirmation: Your Case Has Been Taken Up by a Lawyer`,
                    text: "Hello world?", // plain‑text body
                    html: `<!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="UTF-8" />
                    <title>Case Accepted - IndiLex</title>
                    <style>
                        body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f9fa;
                        color: #212529;
                        margin: 0;
                        padding: 0;
                        }
                        .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                        }
                        .header {
                        text-align: center;
                        border-bottom: 1px solid #dee2e6;
                        padding-bottom: 20px;
                        margin-bottom: 20px;
                        }
                        .header h2 {
                        color: #0d6efd;
                        }
                        .content p {
                        line-height: 1.6;
                        }
                        .footer {
                        margin-top: 30px;
                        font-size: 0.9em;
                        color: #6c757d;
                        text-align: center;
                        }
                        .highlight {
                        color: #0d6efd;
                        font-weight: bold;
                        }
                    </style>
                    </head>
                    <body>
                    <div class="container">
                        <div class="header">
                        <h2>IndiLex</h2>
                        <p>Legal Support Platform</p>
                        </div>
                        <div class="content">
                        <p>Dear <strong>${Case.name}</strong>,</p>
                        <p>
                            We are pleased to inform you that your case request has been <span class="highlight">accepted</span> by the lawyer.
                        </p>
                        <p>
                            You can now expect the lawyer to reach out to you shortly to proceed further. Please keep your communication channel open and check your email regularly.
                        </p>
                        <p>
                            If you have any questions or need help, feel free to reply to this email or reach us at <a href="mailto:support@indilex.in">support@indilex.in</a>.
                        </p>
                        <p>Thank you for using <strong>IndiLex</strong>.</p>
                        <p>Best regards,<br><strong>The IndiLex Team</strong></p>
                        </div>
                        <div class="footer">
                        &copy; 2025 IndiLex. All rights reserved.
                        </div>
                    </div>
                    </body>
                    </html>
                    `, // HTML body
                })
        res.status(200).json({
            message:"case accept success",
            success:true,
            data:[pastCase,del]
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message||"server failure");
    }
})
export const RejectCase=responseHandler(async(req:Request<{},{},requestBody>,res:Response,next:NextFunction)=>{
    try{
        let {caseID}=req.body;
        if(!caseID){
            throw new ErrorHandler(400,false,"no such case exists");
        }
        const Case=await prisma.userReq.findUnique({where:{id:+caseID}});
        if(!Case){
            throw new ErrorHandler(400,false,"no such case exists");
        }
        const pastCase=await prisma.reviewedUserReq.create({
            data:{
                name:Case.name,
                email:Case.email,
                contact:Case.contact,
                caseDesc:Case.caseDesc,
                userID:+Case.userID,
                laywerID:+Case.laywerID,
                status:"Rejected"
            }
        })
        const del=await prisma.userReq.delete({where:{id:+caseID}});
        const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.gmail_account,
                        pass: process.env.GMAIL_APP_PASSWORD,
                    },
            });
            const info = await transporter.sendMail({
                    from: '"IndiLex" <no-reply@indilex.in>',
                    to: Case.email,
                    subject: `Case Request Update`,
                    text: "Hello world?", // plain‑text body
                    html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <title>Case Request Update</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <table width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px;">
                            <tr>
                                <td align="center">
                                <h2 style="color: #2c3e50;">IndiLex - Case Request Update</h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <p style="font-size: 16px; color: #333;">
                                    Dear <strong>${Case.name}</strong>,
                                </p>
                                <p style="font-size: 15px; color: #555;">
                                    We regret to inform you that your case request has been respectfully declined by the lawyer you approached on <strong>IndiLex</strong>.
                                </p>
                                <p style="font-size: 15px; color: #555;">
                                    Please do not be discouraged — you can explore and connect with other qualified lawyers on our platform who may be able to assist you further.
                                </p>
                                <p style="font-size: 14px; color: #999;">
                                    Thank you for using IndiLex. We're committed to helping you find the legal guidance you need.
                                </p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Warm regards,<br /><strong>Team IndiLex</strong></p>
                                </td>
                            </tr>
                            </table>
                        </body>
                        </html>

                    `, // HTML body
                })
        res.status(200).json({
            message:"case accept success",
            success:true,
            data:[pastCase,del]
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message||"server failure");
    }
})

export const getReviewedCases=responseHandler(async(req:Request,res:Response,next:NextFunction)=>{
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

        const Cases=await prisma.reviewedUserReq.findMany({where:{laywerID:findMe.id}});
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