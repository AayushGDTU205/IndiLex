"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const verifyJWT_1 = require("./middlewares/verifyJWT");
const dotenv_1 = __importDefault(require("dotenv"));
const AdminCheck_1 = require("./middlewares/AdminCheck");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use((0, cookie_parser_1.default)());
app.use('/', userRoutes_1.default);
app.use('/admin', verifyJWT_1.verifyJwt, AdminCheck_1.adminCheck, adminRoutes_1.default);
// app.get('/verify',verifyJwt,adminCheck,async(req,res)=>{
//     res.json({
//         message:"admin check success"
//     })
// })
app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
});
