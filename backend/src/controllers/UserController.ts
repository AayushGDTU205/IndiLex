import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { responseHandler } from "../utils/responseHandler"
import { CookieOptions, NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/errorHandler"
import nodemailer from "nodemailer"
import { prisma } from "../lib/db"

interface requestBody{
    name:string,
    email:string,
    password:string,
    formStatus:string,
    isLawyer:boolean,
    isAdmin:boolean
}

export const postSignup=responseHandler(async(req:Request<{},{},requestBody>,res:Response,next:NextFunction)=>{
    try{
        // obtaining details entered by user
        const {name,email,password}=req.body;
        // checking if user has missed any field
        const fields:Array<string>=["name","email","password"];
        const bodyFields:Array<string>=Object.keys(req.body);
        const missing:Array<string>=fields.filter((f:string)=>{
            if(!bodyFields.includes(f))return true;
            else return false;
        })
        if(missing.length>0){
            throw new ErrorHandler(400,false,"kindly fill all the fields");
        }
        // we will find user in DB to check for duplicate acconts
        const User=await prisma.user.findUnique({where:{email:email}});
        if(User!==null){
            throw new ErrorHandler(400,false,"User with same email exists, Go to Login");
        }
        // hashing password for security
        const hashed:string=await bcrypt.hash(password,10);
        if(!hashed){
            throw new ErrorHandler(400,false,"server error");
        }
        // insert into DB
        await prisma.user.create({
            data:{
                email,
                name,
                password:hashed
            }
        })

        // sending email notification to the newly signed in user
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_account,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: '"IndiLex" <no-reply@indilex.in>',
            to: email,
            subject: `Welcome to IndiLex ${name}`,
            text: "Hello world?", // plain‑text body
            html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to IndiLex</title>
    <style>
      /* For email clients that support media queries */
      @media only screen and (max-width: 600px) {
        .container {
          width: 90% !important;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table class="container" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="background-color:#2B2D42; padding:30px;">
                <h1 style="color:#ffffff; margin:0;">Welcome to IndiLex!</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                <p style="font-size:16px; color:#333333;">
                  Hello <strong>${name}</strong>,
                </p>
                <p style="font-size:16px; color:#333333;">
                  Thank you for signing up with <strong>IndiLex</strong> — your trusted companion for navigating Indian legal systems with clarity and ease.
                </p>
                <p style="font-size:16px; color:#333333;">
                  Whether you’re looking for legal guidance, understanding your rights, or seeking help on specific laws, IndiLex is here to support you.
                </p>
                <p style="font-size:16px; color:#333333;">
                  To get started, log in to your dashboard and explore the tools we’ve built just for you.
                </p>
                <p style="font-size:14px; color:#888888;">
                  If you have any questions, feel free to reply to this email or contact our support team.
                </p>
                <p style="font-size:16px; color:#333333;">
                  Welcome aboard,<br />
                  The IndiLex Team
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color:#EDF2F4; padding:20px; font-size:12px; color:#888888;">
                © 2025 IndiLex. All rights reserved.<br />
                <a href="{{privacyPolicyUrl}}" style="color:#888888; text-decoration:underline;">Privacy Policy</a> |
                <a href="{{termsUrl}}" style="color:#888888; text-decoration:underline;">Terms of Service</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`, // HTML body
        })

        // success
        return res.status(200).json({
            success:true,
            message:"signup successful",
        })

        
    }catch(error:any){
        throw new ErrorHandler(error.statusCode || 500,false,error.message || "server failure");
    }
})


interface requestBody2{
    email:string,
    password:string
}

export const postLogin=responseHandler(async(req:Request<{},{},requestBody2>,res:Response,next:NextFunction)=>{
    try{
        // obtaining details entered by user
        const {email,password}=req.body;
        if(!email){
            throw new ErrorHandler(400,false,"please enter your email");
        }
        if(!password){
            throw new ErrorHandler(400,false,"please enter your password");
        }
        // user finding and checking
        const User=await prisma.user.findUnique({where:{email:email}});
        if(!User){
            throw new ErrorHandler(400,false,"account does not exist, please proceed to Sign Up");
        }
        const match=await bcrypt.compare(password,User.password);
        if(!match){
            throw new ErrorHandler(400,false,"incorrect password, please try again");
        }
        // token making
        const AccessToken=jwt.sign(
          {
            userID:User.id,
            email:User.email,
            name:User.name
          },
          process.env.access_key_str!,
          {
            expiresIn:"10h"
          }
        )
        if(!AccessToken){
          throw new ErrorHandler(400,false,"access failure, try again");
        }
        // cookie making
        const options: CookieOptions = {
          httpOnly: true,
          expires: new Date(Date.now() + 31557600 * 1000), // 1 year in milliseconds
          secure: true,
          sameSite: 'none', // requires HTTPS
        };
        // success
        res.status(200).cookie("accessToken",AccessToken,options).json({
          message:"login success",
          success:true
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode || 500,false,error.message || "server failure");
    }
})

interface requestBody3{
    name:string,
    email:string,
    location:string,
    image:string,
    address:string,
    barLicenseNumber:string,
    Specialization:string,
    court:string,
    practiceSince:number
}

export const postLawyerFillUp=responseHandler(async(req:Request<{},{},requestBody3>,res:Response,next:NextFunction)=>{
    try{
        const {name,email,location,address,barLicenseNumber,Specialization,court,practiceSince}=req.body;
        const fields:Array<string>=["name","email","location","address","barLicenseNumber","Specialization","court","practiceSince"];
        const bodyFields:Array<string>=Object.keys(req.body);
        const missing:Array<string>=fields.filter((f:string)=>{
            if(!bodyFields.includes(f))return true;
            else return false;
        })
        if(missing.length>0){
            throw new ErrorHandler(400,false,"kindly fill all the fields");
        }
        const User=await prisma.user.findUnique({where:{email:email}});
        if(!User){
          throw new ErrorHandler(400,false,"user not found");
        }
        if(User.formStatus==="filled"){
          throw new ErrorHandler(400,false,"cannot fill the form again since it has been filled once");
        }
        await prisma.lawyerReq.create({
          data:{
            name,
            email,
            location,
            address,
            barLicenseNumber,
            Specialization,
            court,
            practiceSince:+practiceSince,
            userId:User.id
          }
        })
        const updateUser=await prisma.user.update({
          where:{
            email:User.email
          },
          data:{
            formStatus:"filled"
          }
        })
        // inserting this into DB
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_account,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: '"IndiLex" <no-reply@indilex.in>',
            to: email,
            subject: `Hello ${name}`,
            text: "Hello world?", // plain‑text body
            html: `<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        background-color: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 30px;
        color: #333;
      }
      .header {
        text-align: center;
        color: #2c3e50;
      }
      .highlight {
        color: #2c7be5;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 class="header">Welcome to <span class="highlight">IndiLex</span>!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>
        Thank you for submitting your Lawyer Registration Request on <strong>IndiLex</strong>.
        We appreciate your interest in joining our legal platform.
      </p>
      <p>
        Our team will review your submission and verify the provided information. You’ll be notified via email once your request is approved or if we need any further details.
      </p>
      <p>
        In the meantime, if you have any questions or wish to get in touch, feel free to reply to this email.
      </p>
      <p>
        Thanks again for your interest,<br>
        <strong>The IndiLex Team</strong>
      </p>
      <div class="footer">
        This is an automated message. Please do not reply directly to this email.
      </div>
    </div>
  </body>
</html>
"`, // HTML body
        })
        res.status(200).json({
          message:"request sent",
          success:true
        })
    }
    catch(error:any){
        throw new ErrorHandler(error.statusCode||500,false,error.message|| "server failure");
    }
})