"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptLawyerReq = exports.getLawyerReq = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const responseHandler_1 = require("../utils/responseHandler");
const db_1 = require("../lib/db");
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.getLawyerReq = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lawyerReqs = yield db_1.prisma.lawyerReq.findMany();
        res.status(200).json({
            success: true,
            message: "details retrieved",
            data: lawyerReqs
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.acceptLawyerReq = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reqID } = req.body;
        const retrieveReq = yield db_1.prisma.lawyerReq.findUnique({ where: { id: +reqID } });
        if (!retrieveReq) {
            throw new errorHandler_1.default(400, false, "No such request found");
        }
        const newLawyer = yield db_1.prisma.lawyer.create({
            data: {
                name: retrieveReq.name,
                email: retrieveReq.email,
                location: retrieveReq.location,
                address: retrieveReq.address,
                barLicenseNumber: retrieveReq.barLicenseNumber,
                Specialization: retrieveReq.Specialization,
                court: retrieveReq.court,
                practiceSince: +retrieveReq.practiceSince
            }
        });
        const findUser = yield db_1.prisma.user.update({
            where: {
                id: retrieveReq.userId
            },
            data: {
                isLawyer: true
            }
        });
        const delLawyerReq = yield db_1.prisma.lawyerReq.delete({ where: { id: +reqID } });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_account,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
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
        });
        res.status(200).json({
            success: true,
            message: "new lawyer added",
            data: [newLawyer, delLawyerReq, findUser]
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
