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
exports.verifyJwt = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const responseHandler_1 = require("../utils/responseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../lib/db");
exports.verifyJwt = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new errorHandler_1.default(400, false, "session terminated, please login again");
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.access_key_str);
        const email = decode.email;
        const User = yield db_1.prisma.user.findUnique({ where: { email: email } });
        if (!User) {
            throw new errorHandler_1.default(400, false, "Unauthorized access");
        }
        req.user = User;
        next();
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
