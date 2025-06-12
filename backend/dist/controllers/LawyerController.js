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
exports.getUserReq = void 0;
const db_1 = require("../lib/db");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const responseHandler_1 = require("../utils/responseHandler");
exports.getUserReq = (0, responseHandler_1.responseHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = req.user;
        if (!User) {
            throw new errorHandler_1.default(400, false, "Unauthorized, Invalid User Access");
        }
        // finding my lawyer credentials
        const findMe = yield db_1.prisma.lawyer.findUnique({ where: { email: User.email } });
        if (!findMe) {
            throw new errorHandler_1.default(400, false, "Server is facing internal issue, logout and login again");
        }
        const Cases = yield db_1.prisma.userReq.findMany({ where: { laywerID: findMe.id } });
        res.status(200).json({
            success: true,
            message: "cases retrieved",
            data: Cases
        });
    }
    catch (error) {
        throw new errorHandler_1.default(error.statusCode || 500, false, error.message || "server failure");
    }
}));
