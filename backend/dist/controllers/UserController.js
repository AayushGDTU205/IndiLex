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
exports.postLawyerFillUp = exports.postLogin = exports.postSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const responseHandler_1 = require("../utils/responseHandler");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("../lib/db");
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
        if (User !== null) {
            throw new errorHandler_1.default(400, false, "User with same email exists, Go to Login");
        }
        // hashing password for security
        const hashed = yield bcrypt_1.default.hash(password, 10);
        if (!hashed) {
            throw new errorHandler_1.default(400, false, "server error");
        }
        // insert into DB
        yield db_1.prisma.user.create({
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
            subject: `Hello ${name}`,
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
            success: true
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
exports.postLawyerFillUp = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        // inserting this into DB
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
            html: `"<b>Welcome Aboard to IndiLex ${name}</b>"`, // HTML body
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
