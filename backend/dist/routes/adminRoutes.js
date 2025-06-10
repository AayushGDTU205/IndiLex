"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
let router = (0, express_1.Router)();
router.get('/getLawyerReq', AdminController_1.getLawyerReq);
router.post('/acceptLawyerReq', AdminController_1.acceptLawyerReq);
router.post('/rejectLawyerReq', AdminController_1.rejectLawyerReq);
exports.default = router;
