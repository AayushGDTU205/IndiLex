"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const verifyJWT_1 = require("../middlewares/verifyJWT");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json("inside route 1");
});
// router.get('/login')
router.post('/login', UserController_1.postLogin);
router.post('/SignUp', UserController_1.postSignup);
router.post('/LaywerFillUp', verifyJWT_1.verifyJwt, UserController_1.postLawyerFillUp);
router.get('/getLawyers', verifyJWT_1.verifyJwt, UserController_1.getLawyers);
router.post('/sendReqToLawyer', verifyJWT_1.verifyJwt, UserController_1.sendReqToLawyer);
router.get('/news', verifyJWT_1.verifyJwt, UserController_1.getKhabar);
router.get('/me', verifyJWT_1.verifyJwt, UserController_1.getMe);
router.post('/logout', UserController_1.postLogout);
exports.default = router;
