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
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
//to send the server to frontend 
const responseHandler = (func) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield func(req, res, next);
        }
        catch (error) {
            res.status((error === null || error === void 0 ? void 0 : error.statusCode) || 500).json({
                success: false,
                message: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error',
            });
        }
    });
};
exports.responseHandler = responseHandler;
