import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { Request, Response,NextFunction } from 'express';
import { responseHandler } from "./utils/responseHandler";
import ErrorHandler from "./utils/errorHandler";
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import lawyerRoutes from "./routes/lawyerRoutes"
import { verifyJwt } from "./middlewares/verifyJWT";
import dotenv from 'dotenv';
import { adminCheck } from "./middlewares/AdminCheck";
import { lawyerCheck } from "./middlewares/LawyerCheck";
dotenv.config();
const app=express();
app.use(cors({
    credentials: true,
    origin: "https://indilex.onrender.com"
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/',userRoutes);
app.use('/admin',verifyJwt,adminCheck,adminRoutes);
app.use('/lawyer',verifyJwt,lawyerCheck,lawyerRoutes);
// app.get('/verify',verifyJwt,lawyerCheck,async(req,res)=>{
//     res.json({
//         message:"lawyer check success"
//     })
// })


app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`);
})