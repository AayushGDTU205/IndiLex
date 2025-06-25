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
exports.postLogout = exports.getMe = exports.getKhabar = exports.sendReqToLawyer = exports.getLawyers = exports.postLawyerFillUp = exports.postLogin = exports.postSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const responseHandler_1 = require("../utils/responseHandler");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("../lib/db");
const axios_1 = __importDefault(require("axios"));
exports.postSignup = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // obtaining details entered by user
        const { name, email, password } = req.body;
        // checking if user has missed any field
        const fields = ["name", "email", "password"];
        const bodyFields = Object.keys(req.body);
        const missing = fields.filter((f) => {
            if (!bodyFields.includes(f))
                return true;
            else
                return false;
        });
        if (missing.length > 0) {
            throw new errorHandler_1.default(400, false, "kindly fill all the fields");
        }
        // we will find user in DB to check for duplicate acconts
        const User = yield db_1.prisma.user.findUnique({ where: { email: email } });
        if (User) {
            throw new errorHandler_1.default(400, false, "User with same email exists, Go to Login");
        }
        // hashing password for security
        const hashed = yield bcrypt_1.default.hash(password, 10);
        if (!hashed) {
            throw new errorHandler_1.default(400, false, "server error");
        }
        // insert into DB
        const newUser = yield db_1.prisma.user.create({
            data: {
                email,
                name,
                password: hashed
            }
        });
        // sending email notification to the newly signed in user
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_account,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
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
        });
        // success
        return res.status(200).json({
            success: true,
            message: "signup successful",
            data: newUser
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.postLogin = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // obtaining details entered by user
        const { email, password } = req.body;
        if (!email) {
            throw new errorHandler_1.default(400, false, "please enter your email");
        }
        if (!password) {
            throw new errorHandler_1.default(400, false, "please enter your password");
        }
        // user finding and checking
        const User = yield db_1.prisma.user.findUnique({ where: { email: email } });
        if (!User) {
            throw new errorHandler_1.default(400, false, "account does not exist, please proceed to Sign Up");
        }
        const match = yield bcrypt_1.default.compare(password, User.password);
        if (!match) {
            throw new errorHandler_1.default(400, false, "incorrect password, please try again");
        }
        // token making
        const AccessToken = jsonwebtoken_1.default.sign({
            userID: User.id,
            email: User.email,
            name: User.name
        }, process.env.access_key_str, {
            expiresIn: "10h"
        });
        if (!AccessToken) {
            throw new errorHandler_1.default(400, false, "access failure, try again");
        }
        // cookie making
        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + 31557600 * 1000), // 1 year in milliseconds
            secure: true,
            sameSite: 'none', // requires HTTPS
        };
        // success
        res.status(200).cookie("accessToken", AccessToken, options).json({
            message: "login success",
            success: true,
            data: User
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.postLawyerFillUp = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //obtaining details from user
        const { name, email, location, address, barLicenseNumber, Specialization, court, practiceSince } = req.body;
        const fields = ["name", "email", "location", "address", "barLicenseNumber", "Specialization", "court", "practiceSince"];
        const bodyFields = Object.keys(req.body);
        const missing = fields.filter((f) => {
            if (!bodyFields.includes(f))
                return true;
            else
                return false;
        });
        if (missing.length > 0) {
            throw new errorHandler_1.default(400, false, "kindly fill all the fields");
        }
        // checking if user exists
        const User = yield db_1.prisma.user.findUnique({ where: { email: email } });
        if (!User) {
            throw new errorHandler_1.default(400, false, "user not found");
        }
        // checking if form is not being filled again
        if (User.formStatus === "filled") {
            throw new errorHandler_1.default(400, false, "cannot fill the form again since it has been filled once");
        }
        // inserting lawyer registration into DB for admin to check up
        const newReq = yield db_1.prisma.lawyerReq.create({
            data: {
                name,
                email,
                location,
                address,
                barLicenseNumber,
                Specialization,
                court,
                practiceSince: +practiceSince,
                userId: User.id
            }
        });
        // updating form status
        const updateUser = yield db_1.prisma.user.update({
            where: {
                email: User.email
            },
            data: {
                formStatus: "filled"
            }
        });
        // sending mail upon form submission
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_account,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
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
        });
        // success
        res.status(200).json({
            message: "request sent",
            success: true,
            data: newReq
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.getLawyers = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let lawyers = yield db_1.prisma.lawyer.findMany();
        res.status(200).json({
            success: true,
            message: "retrieved lawyers",
            data: lawyers
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.sendReqToLawyer = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { name, email, contact, caseDesc, lawyerID } = req.body;
        const fields = ["name", "email", "contact", "caseDesc", "lawyerID"];
        const bodyFields = Object.keys(req.body);
        const missing = fields.filter((f) => {
            if (!bodyFields.includes(f))
                return true;
            else
                return false;
        });
        if (missing.length > 0) {
            throw new errorHandler_1.default(400, false, "kindly fill all the fields");
        }
        const retLawyer = yield db_1.prisma.lawyer.findUnique({ where: { id: +lawyerID } });
        if (!retLawyer) {
            throw new errorHandler_1.default(400, false, "lawyer not found");
        }
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userID) {
            throw new errorHandler_1.default(401, false, "Unauthorized: User ID not found");
        }
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) === retLawyer.email) {
            throw new errorHandler_1.default(400, false, "invalid");
        }
        let newReq = yield db_1.prisma.userReq.create({
            data: {
                name: name,
                email: email,
                contact: +contact,
                caseDesc,
                laywerID: +lawyerID,
                userID: +userID
            }
        });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_account,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
            from: '"IndiLex" <no-reply@indilex.in>',
            to: retLawyer.email,
            subject: `📬 New Case Request from a Client`,
            text: "Hello world?", // plain‑text body
            html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #1a73e8;">Hello ${retLawyer.name},</h2>

    <p>You’ve received a <strong>new legal case request</strong> through <strong>IndiLex</strong>.</p>

    <p><strong>Client Details:</strong></p>
    <ul style="padding-left: 16px;">
      <li><strong>Name:</strong> ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.name}</li>
      <li><strong>Email:</strong> ${(_d = req.user) === null || _d === void 0 ? void 0 : _d.email}</li>
      <li><strong>Contact:</strong> ${contact}</li>
    </ul>

    <p><strong>Case Description:</strong></p>
    <div style="background-color: #f1f1f1; padding: 12px; border-radius: 6px;">
      ${caseDesc}
    </div>

    <p>Log in to your IndiLex dashboard to take action on this request.</p>

    <p>Regards,<br/><strong>Team IndiLex</strong></p>

    <hr style="margin-top: 30px;">
    <small style="color: #888;">You are receiving this email because you are registered as a lawyer on IndiLex</small>
  </div>`, // HTML body
        });
        const info1 = yield transporter.sendMail({
            from: '"IndiLex" <no-reply@indilex.in>',
            to: (_e = req.user) === null || _e === void 0 ? void 0 : _e.email,
            subject: `✅ Case Request Sent Successfully`,
            text: "Hello world?", // plain‑text body
            html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #34a853;">Hi ${(_f = req.user) === null || _f === void 0 ? void 0 : _f.name},</h2>

    <p>Your case request has been <strong>successfully sent</strong> to <strong>${retLawyer.name}</strong> via <strong>IndiLex</strong>.</p>

    <p><strong>Case Summary:</strong></p>
    <div style="background-color: #f1f1f1; padding: 12px; border-radius: 6px;">
      ${caseDesc}
    </div>

    <p>The lawyer will review your request and may contact you shortly using the details you provided.</p>

    <p>Thank you for using IndiLex to seek legal help.</p>

    <p>Best wishes,<br/><strong>Team IndiLex</strong></p>

    <hr style="margin-top: 30px;">
    <small style="color: #888;">This is an automated confirmation email from IndiLex</small>
  </div>`, // HTML body
        });
        res.status(200).json({
            message: "request sent",
            success: true,
            data: [retLawyer, newReq]
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.getKhabar = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const API_KEY = process.env.NEWS_API_KEY;
        const response = yield axios_1.default.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'india AND (law OR judgement OR court OR legislation OR "supreme court" OR "high court")',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 100,
                apiKey: API_KEY,
                domains: 'barandbench.com,livelaw.in,indiatoday.in,hindustantimes.com,thehindu.com,timesofindia.indiatimes.com,livemint.com'
            }
        });
        if (response.data.status === 'ok') {
            // Filter and clean the articles
            const articles = response.data.articles;
            const filteredArticles = articles
                .filter(article => article.title &&
                article.description &&
                article.urlToImage &&
                !article.title.includes('[Removed]') &&
                !article.description.includes('[Removed]'));
            const limitedArticles = filteredArticles.slice(0, 50); // Or 100, your choice
            res.status(200).json({
                success: true,
                data: limitedArticles,
                total: limitedArticles.length
            });
        }
        else {
            throw new errorHandler_1.default(400, false, 'Failed to fetch news from NewsAPI');
        }
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.getMe = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(404).json({
                message: 'not logged in',
                isLoggedIn: false
            });
        }
        res.status(200).json({
            message: 'logged in',
            isLoggedIn: true,
            data: req.user
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, "server failure");
    }
}));
exports.postLogout = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: 'none', // requires HTTPS
        };
        res.status(200).cookie("accessToken", "", options).json({
            message: "logged out succesfully"
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, "server failure");
    }
}));
